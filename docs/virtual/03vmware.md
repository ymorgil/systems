# 🖥️ Manual de VMware Workstation Pro
### Guía para Alumnado — Instalación, Uso y Creación de Máquinas Virtuales

---

## Índice

1. [¿Qué es VMware?](#1-qué-es-vmware)
2. [Tipos de licencias](#2-tipos-de-licencias)
3. [¿Qué licencia debo elegir?](#3-qué-licencia-debo-elegir)
4. [Instalación de VMware Workstation Pro](#4-instalación-de-vmware-workstation-pro)
5. [Primeros pasos: Interfaz de VMware](#5-primeros-pasos-interfaz-de-vmware)
6. [Creación de una máquina virtual con Ubuntu Server 25.04](#6-creación-de-una-máquina-virtual-con-ubuntu-server-2504)
7. [Operaciones básicas con la máquina virtual](#7-operaciones-básicas-con-la-máquina-virtual)
8. [Consejos y buenas prácticas](#8-consejos-y-buenas-prácticas)

---

## 1. ¿Qué es VMware?

**VMware** es un software de **virtualización** que permite ejecutar uno o varios sistemas operativos (llamados *máquinas virtuales*) dentro de tu sistema operativo principal, sin necesidad de particionar el disco ni reiniciar el equipo.

> 💡 **Ejemplo:** Puedes tener Windows 11 como sistema principal y, al mismo tiempo, ejecutar Ubuntu Server dentro de una ventana de VMware.

### ¿Para qué se usa en el aula?

- Practicar instalación y administración de sistemas operativos
- Probar configuraciones de red sin afectar al equipo real
- Realizar laboratorios de servidores (SSH, Apache, DNS, etc.)
- Aprender Linux sin riesgos
- Crear entornos de prueba aislados

---

## 2. Tipos de licencias

VMware (ahora bajo **Broadcom**) ofrece varias versiones de su producto de escritorio:

---

### 🆓 VMware Workstation Pro — **Uso Personal (Gratuito)**

| Característica | Detalle |
|---|---|
| **Precio** | Gratuito para uso personal y educativo |
| **Sistema Host** | Windows y Linux |
| **Sistemas Guest** | Más de 200 SO compatibles |
| **Snapshots** | ✅ Sí |
| **Red virtual** | ✅ Sí |
| **Soporte oficial** | ❌ No incluido |
| **Uso comercial** | ❌ No permitido |

Desde **mayo de 2024**, Broadcom hizo VMware Workstation Pro **gratuito para uso personal**, incluyendo el uso **educativo y académico**. Solo es necesario registrarse con una cuenta de Broadcom.

---

### 💼 VMware Workstation Pro — **Licencia Comercial**

| Característica | Detalle |
|---|---|
| **Precio** | De pago (suscripción anual) |
| **Uso** | Empresas y uso profesional |
| **Soporte** | ✅ Soporte técnico oficial |
| **Actualizaciones** | ✅ Acceso garantizado |

---

### 🏫 VMware Academic Program

Broadcom ofrece acuerdos académicos para centros educativos que quieran desplegar VMware de forma centralizada. Si tu centro tiene convenio, puede que ya tengas acceso a licencias académicas gestionadas por el departamento de informática.

> 📌 Consulta con tu profesor o técnico de sistemas si tu centro dispone de este programa.

---

### 🔄 Alternativa gratuita: VMware Workstation Player *(descontinuado)*

Anteriormente existía **VMware Player** como versión gratuita simplificada. **Ya no se distribuye por separado** desde 2024; ha sido absorbido por la versión gratuita de Workstation Pro.

---

## 3. ¿Qué licencia debo elegir?

> ### ✅ Recomendación para alumnado
>
> **VMware Workstation Pro — Versión Personal Gratuita**
>
> Como estudiante, esta es la opción correcta. Es completamente gratuita, incluye **todas las funcionalidades** de la versión de pago (snapshots, redes virtuales, clonación, etc.) y solo requiere crear una cuenta gratuita en el portal de Broadcom.
>
> 🔗 Descarga oficial: [https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion](https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion)

---

## 4. Instalación de VMware Workstation Pro

### Requisitos del sistema

| Componente | Mínimo | Recomendado |
|---|---|---|
| **CPU** | 64-bit dual-core | Quad-core o superior |
| **RAM** | 4 GB | 8 GB o más |
| **Disco** | 1.5 GB (instalación) | 50+ GB (para VMs) |
| **Virtualización** | VT-x / AMD-V activado en BIOS | — |
| **SO Host** | Windows 10/11 o Linux | — |

> ⚠️ **Importante:** Asegúrate de que la virtualización por hardware esté **activada en la BIOS/UEFI** del equipo. Sin esto, VMware no funcionará correctamente.

---

### Paso a paso: Instalación en Windows

**Paso 1 — Descargar el instalador**

1. Ve a [https://www.vmware.com/products/desktop-hypervisor](https://www.vmware.com/products/desktop-hypervisor)
2. Haz clic en **"Download for Free"** o **"Workstation Pro for Windows"**
3. Inicia sesión o crea una cuenta gratuita de Broadcom
4. Descarga el archivo `.exe`

**Paso 2 — Ejecutar el instalador**

1. Haz doble clic en el archivo descargado (ej. `VMware-Workstation-Full-XX.X.X-XXXXXX.exe`)
2. Acepta los términos de licencia
3. Selecciona las opciones de instalación:
   - ✅ **Enhanced Keyboard Driver** (recomendado)
   - ✅ **Add VMware Workstation console tools to the system PATH**
4. Elige la carpeta de instalación (por defecto está bien)
5. Haz clic en **Install** y espera a que finalice

**Paso 3 — Primer arranque**

1. Abre VMware Workstation Pro desde el escritorio o el menú Inicio
2. Cuando pregunte por la licencia, selecciona **"Use VMware Workstation 17 for Personal Use"** (o la versión correspondiente)
3. ¡Listo! Ya tienes VMware instalado

---

### Paso a paso: Instalación en Linux (Ubuntu/Debian)

```bash
# 1. Dar permisos de ejecución al instalador descargado
chmod +x VMware-Workstation-Full-*.bundle

# 2. Ejecutar como superusuario
sudo ./VMware-Workstation-Full-*.bundle

# 3. Seguir el asistente gráfico de instalación

# 4. Iniciar VMware
vmware
```

---

## 5. Primeros pasos: Interfaz de VMware

Al abrir VMware Workstation Pro verás la pantalla principal:

```
┌─────────────────────────────────────────────────────────────┐
│  VMware Workstation Pro                              [─][□][×]│
├──────────────────────────────────────────────────────────────┤
│  Archivo  Editar  Ver  VM  Pestañas  Ayuda                   │
├─────────────────┬────────────────────────────────────────────┤
│                 │                                            │
│  MIS EQUIPOS    │         PANTALLA DE INICIO                 │
│  ─────────────  │                                            │
│  [+] Nueva VM   │   [ Crear nueva máquina virtual ]          │
│                 │   [ Abrir máquina virtual        ]          │
│  Máquinas       │   [ Conectar a servidor remoto   ]          │
│  guardadas      │                                            │
│  aparecerán     │                                            │
│  aquí           │                                            │
│                 │                                            │
└─────────────────┴────────────────────────────────────────────┘
```

### Elementos principales de la interfaz

| Elemento | Función |
|---|---|
| **Panel izquierdo** | Lista de todas tus máquinas virtuales |
| **Barra de herramientas** | Botones de encendido, pausa, snapshot, etc. |
| **Área central** | Pantalla de la máquina virtual activa |
| **Barra de estado** | Información de red, dispositivos USB, etc. |

### Atajos de teclado esenciales

| Atajo | Acción |
|---|---|
| `Ctrl + Alt` | Liberar el ratón/teclado de la VM |
| `Ctrl + Alt + Enter` | Pantalla completa |
| `Ctrl + Alt + P` | Pausar la VM |
| `Ctrl + Z` | Suspender la VM |
| `Ctrl + Shift + P` | Tomar snapshot |

---

## 6. Creación de una máquina virtual con Ubuntu Server 25.04

> ⚠️ **Nota:** A la fecha de este manual, la versión disponible es **Ubuntu Server 25.04 "Plucky Puffin"**. La versión 26 aún no ha sido lanzada (se esperaría para abril de 2026). Si ya existe, los pasos son exactamente los mismos.

### Paso 1 — Descargar la ISO de Ubuntu Server

1. Ve a [https://ubuntu.com/download/server](https://ubuntu.com/download/server)
2. Descarga la imagen ISO de **Ubuntu Server 25.04** (o la más reciente disponible)
3. Guarda el archivo `.iso` en una carpeta accesible (ej. `C:\ISOs\ubuntu-server.iso`)

---

### Paso 2 — Crear la nueva máquina virtual

1. Abre VMware Workstation Pro
2. Haz clic en **"Create a New Virtual Machine"** o ve a `Archivo → Nueva máquina virtual`
3. Selecciona **"Typical (recommended)"** → clic en **Next**

```
┌──────────────────────────────────────────────────┐
│  New Virtual Machine Wizard                      │
│                                                  │
│  ○ Typical (recommended)   ◄ ELEGIR ESTA         │
│  ○ Custom (advanced)                             │
│                                                  │
│                         [Back] [Next] [Cancel]   │
└──────────────────────────────────────────────────┘
```

---

### Paso 3 — Seleccionar la ISO

1. Selecciona **"Installer disc image file (ISO)"**
2. Haz clic en **Browse** y navega hasta tu archivo `.iso` de Ubuntu Server
3. VMware detectará automáticamente el sistema operativo → clic en **Next**

```
┌──────────────────────────────────────────────────┐
│  Guest Operating System Installation             │
│                                                  │
│  ○ Use a physical drive                          │
│  ● Installer disc image file (ISO):  ◄ ELEGIR   │
│    [C:\ISOs\ubuntu-server-25.04.iso] [Browse...] │
│                                                  │
│  Detected: Ubuntu 64-bit                         │
│                         [Back] [Next] [Cancel]   │
└──────────────────────────────────────────────────┘
```

---

### Paso 4 — Configurar usuario inicial (Easy Install)

VMware puede ofrecerte la instalación rápida. Rellena:

| Campo | Valor recomendado |
|---|---|
| **Full name** | Tu nombre (ej. `Alumno Informática`) |
| **User name** | Un nombre de usuario corto (ej. `alumno`) |
| **Password** | Una contraseña segura |

> 💡 Recuerda estos datos, los necesitarás para iniciar sesión en Ubuntu Server.

Clic en **Next**.

---

### Paso 5 — Nombre y ubicación de la VM

1. **Virtual machine name:** escribe `Ubuntu Server 25.04` (o el nombre que prefieras)
2. **Location:** elige dónde guardar los archivos de la VM (necesitarás espacio suficiente)
3. Clic en **Next**

---

### Paso 6 — Tamaño del disco virtual

Se recomienda para un servidor de prácticas:

| Parámetro | Valor recomendado |
|---|---|
| **Tamaño** | `20 GB` mínimo (40 GB ideal) |
| **Tipo** | `Store virtual disk as a single file` |

```
┌──────────────────────────────────────────────────┐
│  Specify Disk Capacity                           │
│                                                  │
│  Maximum disk size (GB):  [  20.0  ]             │
│                                                  │
│  ○ Store virtual disk as a single file  ◄ ESTE  │
│  ○ Split virtual disk into multiple files        │
│                                                  │
│                         [Back] [Next] [Cancel]   │
└──────────────────────────────────────────────────┘
```

Clic en **Next**.

---

### Paso 7 — Revisar y personalizar hardware

Antes de finalizar, haz clic en **"Customize Hardware..."** para ajustar los recursos:

| Recurso | Valor recomendado para prácticas |
|---|---|
| **Memory (RAM)** | `2048 MB` (2 GB) mínimo |
| **Processors** | `2` núcleos virtuales |
| **Network Adapter** | `NAT` (acceso a Internet por defecto) |
| **CD/DVD** | Verificar que apunta a la ISO correcta |

Cierra la ventana de hardware → clic en **Finish**.

---

### Paso 8 — Instalación de Ubuntu Server

La VM arrancará automáticamente desde la ISO. Sigue el asistente de instalación:

**8.1 Selección de idioma**
```
Select your language:
  [ English ]
  [ Español ]   ◄ Puedes elegir Español
```

**8.2 Actualización del instalador**
- Si te pregunta si actualizar el instalador, elige **"Continue without updating"** para ahorrar tiempo.

**8.3 Configuración de teclado**
- Layout: `Spanish` / `Spanish`

**8.4 Tipo de instalación**
- Selecciona **"Ubuntu Server"** (opción estándar)

**8.5 Configuración de red**
- Normalmente se configura automáticamente por DHCP
- Verifica que aparece una IP asignada y continúa

**8.6 Configuración de proxy**
- Déjalo en blanco si no hay proxy → **Done**

**8.7 Mirror de Ubuntu**
- Usa el mirror por defecto → **Done**

**8.8 Particionado de disco**
```
Storage configuration:
  ● Use an entire disk   ◄ ELEGIR ESTA
  ○ Custom storage layout
```
- Selecciona el disco virtual → **Done**
- Confirma el formateo → **Continue**

**8.9 Configuración del perfil de usuario**

| Campo | Ejemplo |
|---|---|
| **Your name** | `Alumno Informática` |
| **Your server's name** | `ubuntu-server` |
| **Pick a username** | `alumno` |
| **Password** | `TuContraseñaSegura` |

**8.10 OpenSSH (recomendado)**
- Marca ✅ **"Install OpenSSH server"** — te permitirá conectarte por SSH

**8.11 Featured server snaps**
- Para prácticas básicas, no selecciones nada → **Done**

**8.12 Instalación**
- Espera a que se instale el sistema (5-15 minutos según el equipo)
- Cuando aparezca **"Installation complete!"** → clic en **"Reboot Now"**

---

### Paso 9 — Primer arranque de Ubuntu Server

1. La VM reiniciará y expulsará la ISO automáticamente
2. Aparecerá el prompt de login:

```
ubuntu-server login: alumno
Password: ********
```

3. Si el login es correcto, verás:

```
Welcome to Ubuntu 25.04 LTS (GNU/Linux 6.x.x-xx-generic x86_64)

alumno@ubuntu-server:~$
```

✅ **¡Ubuntu Server está funcionando correctamente dentro de VMware!**

---

### Paso 10 — Primeros comandos útiles

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Ver la IP de la máquina virtual
ip addr show

# Comprobar espacio en disco
df -h

# Ver la versión de Ubuntu instalada
lsb_release -a

# Apagar la máquina virtual de forma segura
sudo poweroff
```

---

## 7. Operaciones básicas con la máquina virtual

### Encender / Apagar / Pausar

| Acción | Cómo hacerlo |
|---|---|
| **Encender** | Botón ▶ verde en la barra de herramientas |
| **Apagar** | `VM → Power → Shut Down Guest` |
| **Suspender** | `VM → Suspend` (guarda el estado en RAM) |
| **Pausar** | `VM → Pause` |
| **Reiniciar** | `VM → Power → Restart Guest` |

---

### Snapshots (Instantáneas)

Los **snapshots** son una de las funciones más útiles de VMware. Guardan el estado completo de la VM en un momento determinado.

```
VM con snapshot = "punto de guardado" del sistema
```

**Crear un snapshot:**
1. `VM → Snapshot → Take Snapshot...`
2. Escribe un nombre descriptivo (ej. `"Instalación limpia"`)
3. Clic en **Take Snapshot**

**Restaurar un snapshot:**
1. `VM → Snapshot → Snapshot Manager`
2. Selecciona el snapshot deseado
3. Clic en **Go To** → confirma

> 💡 **Consejo:** Toma siempre un snapshot justo después de instalar el sistema y antes de hacer cambios importantes. Si algo falla, puedes volver atrás en segundos.

---

### Configurar la red de la VM

VMware ofrece 3 modos de red principales:

| Modo | Descripción | Uso recomendado |
|---|---|---|
| **NAT** | La VM comparte la IP del host. Tiene acceso a Internet | Uso general y descargas |
| **Bridged** | La VM aparece como un equipo más en la red física | Laboratorios de red |
| **Host-only** | Solo comunica la VM con el equipo host, sin Internet | Entornos aislados |

Para cambiar: `VM → Settings → Network Adapter → Tipo de red`

---

## 8. Consejos y buenas prácticas

> ✅ **Toma un snapshot antes de cualquier práctica destructiva**

> ✅ **Asigna solo los recursos que necesitas** — no pongas 8 GB de RAM a una VM si tu equipo solo tiene 8 GB en total

> ✅ **Apaga las VMs cuando no las uses** — consumen CPU y RAM incluso en reposo

> ✅ **Guarda las ISOs** en una carpeta organizada para reutilizarlas

> ✅ **Usa nombres descriptivos** para tus VMs: `Ubuntu-Server-Practica1` es mejor que `Nueva VM`

> ⚠️ **No suspendas el equipo host** con VMs encendidas sin pausarlas antes

> ⚠️ **No muevas o renombres los archivos `.vmdk`** fuera de VMware o la VM dejará de funcionar

---

## Referencias y recursos adicionales

| Recurso | Enlace |
|---|---|
| Descarga VMware Workstation Pro | https://www.vmware.com/products/desktop-hypervisor |
| Documentación oficial VMware | https://docs.vmware.com/en/VMware-Workstation-Pro |
| Descarga Ubuntu Server | https://ubuntu.com/download/server |
| Documentación Ubuntu | https://ubuntu.com/server/docs |
| Foros VMware (comunidad) | https://communities.vmware.com |

---

*Manual elaborado para uso académico · VMware Workstation Pro (versión gratuita personal) · Ubuntu Server 25.04*
