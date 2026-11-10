# **📋 UT04 · Rúbrica de evaluación**

Rúbrica de comprobación de la práctica *Escritorio remoto, acceso remoto y VPN*. Para cada uno de los 10 apartados se comprueban **4 elementos**: cada elemento se marca como presente (Sí) o ausente (No). No hay términos medios: o la evidencia está en la entrega, o no lo está.

### Apartado 1 · Visual Studio Code como RemoteApp con Remote Desktop Services

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Remote Desktop Services está desplegado en Windows Server 2025 (Agente de conexión, Acceso web y Host de sesión) | | |
| 2 | Visual Studio Code está publicado como RemoteApp en una colección con acceso para un grupo de usuarios | | |
| 3 | Desde el navegador del cliente Windows 11 se accede al portal web y se abre Visual Studio Code | | |
| 4 | La web «Hola mundo» se crea desde la RemoteApp, se guarda en IIS y se muestra en el navegador del cliente | | |

### Apartado 2 · Servidor SSH en una instancia Windows Server de AWS

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El servidor SSH arranca al iniciar Windows y se muestra que el cliente y el servidor SSH están activos | | |
| 2 | Se crea la regla del firewall de Windows (sin desactivarlo) y la del grupo de seguridad de AWS | | |
| 3 | Se cambia el puerto en `sshd_config` del 22 al 2222 y la conexión funciona por el nuevo puerto | | |
| 4 | Se presenta la doble pantalla con `fastfetch`: cliente a la izquierda y servidor (por SSH) a la derecha | | |

### Apartado 3 · Firefox remoto con Xming y reenvío X11

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | La instancia Ubuntu Server tiene Firefox, `xauth` y `X11Forwarding` habilitado | | |
| 2 | Xming está en ejecución en el cliente Windows y el cliente SSH tiene activado el reenvío X11 | | |
| 3 | Firefox se ejecuta en la instancia y su ventana se muestra en Windows, con captura | | |
| 4 | Se explica el proceso y el papel de Xming, SSH y la aplicación remota | | |

### Apartado 4 · Túnel SSH con PuTTY hacia MySQL

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | MySQL escucha en el puerto 5252 de la instancia, que no está abierto en el grupo de seguridad | | |
| 2 | El túnel de PuTTY en Windows 11 redirige el puerto 3306 (origen) al 5252 (destino) | | |
| 3 | Se ejecuta un `INSERT` en la tabla de usuarios a través del túnel y una consulta que lo muestra | | |
| 4 | Se documentan los pasos, el comando SQL y la verificación del dato en la instancia | | |

### Apartado 5 · Escritorio remoto con RustDesk

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | La instancia Ubuntu Server tiene un escritorio ligero y RustDesk instalado y configurado | | |
| 2 | Se establece la conexión desde Ubuntu Desktop 26.04 y se maneja el escritorio remoto | | |
| 3 | Se presenta la captura con `fastfetch`: cliente a la izquierda y servidor en RustDesk a la derecha | | |
| 4 | Se explica el proceso y las ventajas de RustDesk frente a AnyDesk o TeamViewer | | |

### Apartado 6 · Acceso desde el móvil con Guacamole

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Guacamole está desplegado con un usuario propio y una conexión a una de las instancias | | |
| 2 | Solo se abren en AWS los puertos imprescindibles para el servicio | | |
| 3 | Desde el móvil se ejecuta `fastfetch` en la instancia y se captura la pantalla | | |
| 4 | Se explica el proceso, las ventajas del acceso por navegador y las precauciones de seguridad | | |

### Apartado 7 · WireGuard en un contenedor de Proxmox

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El contenedor LXC de Proxmox tiene WireGuard configurado para dos clientes | | |
| 2 | El cliente móvil importa la configuración (QR o `.conf`) y se capturan el túnel activo y las IP asignadas | | |
| 3 | El cliente Ubuntu Desktop (NAT) conecta con el contenedor, con salida de `wg show` y pruebas de tráfico | | |
| 4 | WireGuard-UI está instalado, con un usuario nuevo y una configuración de cliente generada desde la interfaz | | |

### Apartado 8 · Captura y despliegue de imágenes con FOG

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | FOG está instalado en Ubuntu Server (100 GB, IP 192.168.1xx.150) y se captura la imagen de Linux Mint | | |
| 2 | La interfaz web de FOG muestra 200 GB de almacenamiento y el cambio se mantiene tras reiniciar | | |
| 3 | Se adaptan el servidor y FOG a la nueva red 172.16.0.0/16 | | |
| 4 | Se despliega la imagen de Linux Mint con captura de la pantalla azul con la IP actual de FOG | | |

### Apartado 9 · Laboratorio en el aula I

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se realiza el laboratorio en el aula en la sesión indicada | | |
| 2 | Se completan todos los pasos indicados en clase | | |
| 3 | Se aportan las capturas o evidencias solicitadas | | |
| 4 | Se explica brevemente el resultado obtenido | | |

### Apartado 10 · Laboratorio en el aula II

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se realiza el laboratorio en el aula en la sesión indicada | | |
| 2 | Se completan todos los pasos indicados en clase | | |
| 3 | Se aportan las capturas o evidencias solicitadas | | |
| 4 | Se explica brevemente el resultado obtenido | | |

## Calificación

Cada apartado tiene el mismo valor y cada elemento marcado "Sí" suma un punto (máximo 40 puntos). La calificación sobre 10 se obtiene dividiendo el total entre 4. Para superar la unidad es necesario alcanzar al menos 20 de los 40 elementos y tener, como mínimo, 2 de los 4 elementos marcados en cada uno de los 10 apartados (ningún apartado puede quedar completamente vacío).
