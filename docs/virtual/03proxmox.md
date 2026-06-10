# 🖥️ Proxmox VE — Documentación completa

## Guía de instalación en PDF

<iframe src="https://docs.google.com/viewer?url=https://ymorgil.github.io/systems/assets/pdf/proxmox.pdf&embedded=true" width="70%" height="700px" style="display: block; margin: 0 auto;"></iframe>

[Descargar guía de instalación](../assets/pdf/proxmox.pdf){ .md-button style="display:table;margin:0 auto;"}

## Conceptos básicos

| Término | Descripción |
|---|---|
| **PVE** | Proxmox Virtual Environment — el sistema completo |
| **Nodo** | Servidor físico que tiene Proxmox instalado |
| **Datacenter** | Vista global de todos los nodos del clúster. Los cambios aquí se aplican a todos los nodos |
| **Summary** | Panel de monitorización del nodo |
| **8006** | Puerto que se utiliza para el acceso web a la interfaz de Proxmox |


### Almacenamiento

| Tipo | Recomendación |
|---|---|
| Almacenamiento local | ❌ No recomendado |
| Almacenamiento en red | ✅ Recomendado |

## 💾 Almacenamiento local

**`local`** — Configurado para ISO, plantillas y copias de seguridad. Por defecto no almacena máquinas virtuales.

**`local-lvm`** — Permite almacenar imágenes de disco y contenedores.

### Redimensionado de volúmenes lógicos (LVM)

```bash
# 1. Crear volumen físico
pvcreate /dev/sdX

# 2. Extender el grupo de volúmenes
vgextend nombre-vg /dev/sdX

# 3. Extender el volumen lógico
lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv

# 4. Redimensionar el sistema de archivos
resize2fs /dev/ubuntu-vg/ubuntu-lv

# 5. Comprobar puntos de montaje
df -h
```

!!! note "Directorio vs Volumen lógico"
    Un **directorio** organiza archivos dentro de un sistema de archivos.
    Un **volumen lógico LVM** es una entidad de almacenamiento flexible y dinámica creada dentro de un grupo de volúmenes, mucho más versátil para entornos virtualizados.

## 🖥️ Crear máquinas virtuales

Pasos en orden al crear una nueva VM:

1. Seleccionar **nodo**, ID y nombre
2. Seleccionar **sistema operativo** (ISO)
3. **System** — dejar por defecto
4. Añadir **disco** y elegir el almacenamiento
5. Configurar **CPU**
6. Configurar **memoria RAM**
7. Configurar **red**

## 🔗 Configurar un clúster

Un **clúster** es la composición de varios nodos trabajando en orquestación.

Desde **Datacenter → Cluster** se crea o se une a un clúster. Una vez configurado, es posible **migrar máquinas virtuales entre nodos** del clúster.

## ⚡ Alta disponibilidad (HA)

!!! warning "Requisito"
    Para configurar HA es **obligatorio** tener un clúster previo.

Si un nodo falla, las máquinas virtuales se **migran automáticamente** a otro nodo del clúster.

Configuración en **Datacenter → HA**:

1. Crear **grupos HA** formados por los nodos que participan
2. En **HA** agregar las máquinas virtuales que se quieren proteger

## 🌐 Networking — Bridge, Bonds, VLANs

Las configuraciones de red se hacen a nivel de nodo en **System → Network**.

| Tipo | Descripción |
|---|---|
| **Bridge** | Switch virtual. Permite conectar múltiples VMs con un solo adaptador físico. Se crea uno por defecto en la instalación |
| **VLAN** | Segmentos de red virtuales |
| **Bond** | Une varios adaptadores de red físicos |

### Modos de Bond destacados

**`active-backup`** — Failover/conmutación por error. El adaptador secundario asume el rol si el principal falla. Se configura el maestro en `bond-primary`.

**`LACP (802.3ad)`** — Agrega múltiples enlaces para mayor ancho de banda y tolerancia a fallos. Política de hash recomendada: `layer3+4`.

## 📋 Crear plantillas y clonar máquinas

### Paso 1 — Preparar la máquina base

```bash
# Actualizar el sistema
apt update -y && apt dist-upgrade -y

# Instalar agente QEMU
apt install qemu-guest-agent -y

# Limpiar caché de paquetes
apt-get clean
apt-get autoremove
apt-get autoclean

# Eliminar logs
find /var/log -type f -delete
rm -rf /var/log/*

# Limpiar /tmp
rm -rf /tmp/*

# Borrar historial de comandos
cat /dev/null > ~/.bash_history && history -c

# Borrar caché de usuario
rm -rf ~/.cache/*

# Eliminar claves SSH (se regenerarán al clonar)
rm /etc/ssh/ssh_host_*

# Resetear hostname
hostnamectl set-hostname plantilla

# Escribir ceros al espacio libre (compresión más eficiente)
dd if=/dev/zero of=/tmp/zeroes bs=1M
rm /tmp/zeroes
```

### Paso 2 — Convertir a plantilla

1. Clic derecho sobre la VM → **Convert to Template**
2. Añadir un **Cloud-Init Drive** para poder automatizar el despliegue

!!! tip "Convención de numeración"
    Por convención no escrita, las **plantillas** reciben números altos (ej. 900+) y las **máquinas virtuales** números bajos.

## 🪟 Plantillas de Windows

**Requisitos:**
- VM con 2 unidades de CD
- ISO de Windows
- ISO de drivers VirtIO: [pve.proxmox.com/wiki/Windows_VirtIO_Drivers](https://pve.proxmox.com/wiki/Windows_VirtIO_Drivers)
- Guía oficial Windows 10: [pve.proxmox.com/wiki/Windows_10_guest_best_practices](https://pve.proxmox.com/wiki/Windows_10_guest_best_practices)

Antes de crear la plantilla ejecutar **Sysprep** para generalizar la instalación (evita IDs duplicados al clonar):

- [Generalizar con Sysprep](https://learn.microsoft.com/es-es/windows-hardware/manufacture/desktop/sysprep--generalize--a-windows-installation?view=windows-11)
- [Opciones de línea de comandos Sysprep](https://learn.microsoft.com/es-es/windows-hardware/manufacture/desktop/sysprep-command-line-options?view=windows-11)

!!! warning "Importante"
    No añadir aplicaciones de la Microsoft Store a la imagen que se va a generalizar.

## 💾 Backup vs Snapshot

| | Backup | Snapshot |
|---|---|---|
| **Qué es** | Clon completo del disco | Estado puntual de la VM |
| **Es independiente de la VM** | ✅ Sí | ❌ No, forma parte de la VM |
| **Uso** | Recuperación ante desastre | Probar cambios y revertir rápido |

### Regla de los 3 backups

1. **Producción** — copia en el propio entorno
2. **Backup externo** — en otro medio/red fuera de la infraestructura
3. **Backup offsite** — en otra geolocalización

### Modos de Backup en Proxmox

| Modo | Descripción |
|---|---|
| **Stop** | Mayor consistencia, breve tiempo de inactividad |
| **Suspend** | Suspende la VM. No recomendado (mayor inactividad sin mejor consistencia) |
| **Snapshot** | Mínimo tiempo de inactividad. Pequeño riesgo de inconsistencia |

Documentación oficial: [pve.proxmox.com/wiki/Backup_and_Restore](https://pve.proxmox.com/wiki/Backup_and_Restore)

## 🔐 Habilitar MFA

El **MFA** (Multi-Factor Authentication) requiere dos o más formas de autenticación para acceder al sistema.

Factores disponibles:

- Contraseña
- Código SMS
- Aplicación de autenticación (TOTP)
- Token hardware (ej. **Yubico** — recomendado)
- Biometría

### Configurar TOTP en Proxmox

1. Ir a **My Settings → TFA**
2. En **Permisos → Two Factor** → **Add**
3. Seleccionar **TOTP** → escanear el QR con la app autenticadora
4. El token se renueva cada 30 segundos

!!! danger "Importante"
    Guardar siempre la **recovery key** por si se pierde el dispositivo autenticador.

## 🚚 Migrar máquinas virtuales

### Método 1 — Clonezilla (disco a disco por red)

[Descargar Clonezilla liveCD](https://clonezilla.org/downloads.php)

**En la MV origen:**
```
remote-source >> Beginner >> disk_to_remote_disk >> dhcp
>> elegir disco >> -sfsck >> -k0 >> -p choose
```

**En la MV destino:**
```
remote-dest >> dhcp >> IP_MVorigen >> restoredisk
```

Revertir el orden de arranque al disco tras finalizar.

---

### Método 2 — Disk2vhd (P2V, físico a virtual Windows)

[Descargar Disk2vhd](https://learn.microsoft.com/en-us/sysinternals/downloads/disk2vhd)

```bash
# Convertir el disco VHD a formato QCOW2
qemu-img convert -O qcow2 <disco_origen> <disco_destino.qcow2>

# Mover la imagen a la carpeta de la VM (ej. ID 101)
mv <disco_destino.qcow2> /var/lib/vz/images/101/

cd /var/lib/vz/images/101/

# Reescanear discos
qm rescan

# Editar la config de la VM y cambiar la etiqueta del disco a sata1
vi /etc/pve/qemu-server/101.conf
```

### Método 3 — dd (clonado a nivel de bloque)

Ideal para análisis forense o cuando no hay otro método.

```bash
# Ver discos disponibles
lsblk

# Clonar disco completo
sudo dd if=/dev/nvme0n1 of=lab.img bs=1M status=progress

# Renombrar como raw
mv lab.img lab.raw

# Mover a la carpeta de la VM y reescanear
mv lab.raw /var/lib/vz/images/101/
cd /var/lib/vz/images/101/
qm rescan

# Editar config y cambiar etiqueta a sata2
vi /etc/pve/qemu-server/101.conf
```

---

*Documentación basada en el curso de Proxmox VE · [📺 Ver playlist completa](https://www.youtube.com/playlist?list=PLznRNLIWBPwH5Li7Co2i57rUVhve7m_ZQ)*