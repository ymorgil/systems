# 🧪 Supuesto Práctico UT04 *Acceso remoto seguro con SSH y WireGuard* { .card }

!!! info "OBJETIVOS"
    Configurar y probar, de extremo a extremo, un entorno de administración remota que combine un servidor GNU/Linux y un servidor Windows, aplicando los criterios de evaluación del RA4: distinguir servicios orientados y no orientados a sesión, instalar y asegurar SSH con autenticación por clave, abrir un túnel SSH a un servicio que no viaja cifrado, desplegar una VPN WireGuard como capa adicional de cifrado, habilitar el acceso remoto nativo de Windows (RDP y WinRM), crear cuentas de acceso remoto con permisos mínimos y comprobar la conectividad entre sistemas operativos distintos.

    La práctica se estructura en **10 apartados obligatorios**: 3 de escenario y SSH, 2 de VPN WireGuard, 2 de acceso remoto en Windows y cuentas, y 3 de pruebas cruzadas, cifrado y documentación.

!!! info "RECURSOS"
    - Una máquina virtual (o instancia cloud) con **Ubuntu Server 24.04 LTS**.
    - Una máquina virtual (o instancia cloud) con **Windows Server 2022**.
    - Un cliente adicional con GNU/Linux de escritorio (Ubuntu Desktop, Manjaro...) y, si es posible, un dispositivo móvil (Android/iOS).
    - Acceso a Proxmox, VirtualBox, VMware o un proveedor cloud (AWS, Azure) para desplegar las máquinas anteriores.
    - Cliente SSH (OpenSSH o PuTTY), cliente WireGuard y, opcionalmente, MySQL Server para el ejercicio del túnel.

## **Escenario y SSH** { .seccion }

### 1. Despliegue del escenario y plan de direccionamiento

**1.1 Máquinas base**: levanta las dos máquinas base (Ubuntu Server y Windows Server) en la misma red interna y anota sus direcciones IP.

**1.2 Tabla de roles**: documenta en una tabla el rol de cada equipo (servidor SSH, servidor RDP/WinRM, servidor WireGuard).

**1.3 Cliente de pruebas**: define qué equipo actuará de cliente de escritorio para las pruebas cruzadas del apartado 8.

### 2. Instalación y configuración de SSH con autenticación por clave

**2.1 Instalación y claves**: en el servidor Ubuntu, instala `openssh-server` y genera en el cliente un par de claves con `ssh-keygen`.

**2.2 Autenticación por clave**: copia la clave pública al servidor con `scp` o `ssh-copy-id`, añádela a `~/.ssh/authorized_keys` y comprueba que la conexión ya no solicita contraseña.

**2.3 Endurecimiento de `sshd_config`**: cambia el puerto por defecto (por ejemplo, a 2222), fija `PermitRootLogin no`, `PasswordAuthentication no` y restringe el acceso con `AllowUsers` al usuario y la subred del aula.

**2.4 Verificación**: reinicia el servicio y verifica la conexión con el nuevo puerto.

### 3. Túnel SSH a un servicio no cifrado

**3.1 Servidor MySQL**: instala un servidor MySQL en la máquina Ubuntu, crea un usuario con permisos sobre una base de datos de prueba y cambia el puerto de escucha de MySQL al 5252.

**3.2 Túnel**: desde el cliente Windows, usando PuTTY (o `ssh -L`), configura un túnel SSH que redirija el puerto local 3306 al puerto remoto 5252.

**3.3 Prueba**: conecta un cliente MySQL a `localhost:3306` y ejecuta un `INSERT` sobre la tabla de prueba, comprobando que el dato llega cifrado al servidor remoto.

## **VPN WireGuard** { .seccion }

### 4. Configuración de una VPN WireGuard

**4.1 Servidor**: despliega un servidor WireGuard (en un contenedor LXC de Proxmox o directamente en el servidor Ubuntu) con interfaz `wg0` y dirección `10.0.0.1/24`, escuchando en el puerto UDP 51820.

**4.2 Peers**: genera la configuración de al menos dos peers: un cliente móvil (importando la configuración mediante código QR) y un cliente de escritorio en modo NAT.

**4.3 Verificación**: verifica el estado del túnel con `wg show` y comprueba la conectividad (`ping` a la IP interna del servidor) desde ambos clientes.

### 5. Interfaz de gestión de WireGuard

**5.1 Instalación de WireGuard-UI**: instala **WireGuard-UI** en el mismo equipo que aloja el servidor WireGuard, accediendo a su instalación por SSH o consola.

**5.2 Alta de un peer**: desde la interfaz web, crea un nuevo usuario/peer y genera su fichero de configuración, sin editar manualmente el fichero `wg0.conf`.

**5.3 Evidencias**: documenta con capturas el alta del nuevo peer y su conexión efectiva.

## **Acceso remoto en Windows y cuentas** { .seccion }

### 6. Acceso remoto en Windows: RDP y WinRM

**6.1 Escritorio remoto**: en el servidor Windows, habilita el escritorio remoto exigiendo autenticación a nivel de red (NLA) y ajusta el firewall en consecuencia.

**6.2 Conexiones RDP**: conecta desde un cliente Windows por RDP y desde el cliente Linux mediante Remmina o rdesktop.

**6.3 WinRM**: habilita WinRM (`Enable-PSRemoting -Force`) y, desde otro equipo Windows, ejecuta un comando remoto con `Invoke-Command` y abre una sesión interactiva con `Enter-PSSession`.

**6.4 Comparativa**: documenta la diferencia entre esta gestión sin sesión gráfica y la conexión RDP anterior.

### 7. Creación de cuentas de acceso remoto
Crea, tanto en el servidor Ubuntu como en el servidor Windows, una cuenta nominal específica para el acceso remoto de la práctica (no reutilices una cuenta administrativa genérica).

**7.1 Cuenta en Linux**: añade la cuenta a `AllowUsers` y genera para ella su propio par de claves SSH.

**7.2 Cuenta en Windows**: añade la cuenta únicamente al grupo "Usuarios de escritorio remoto" (no al de administradores).

**7.3 Permisos mínimos**: comprueba que con esos permisos mínimos el acceso remoto sigue funcionando correctamente.

## **Pruebas, cifrado y documentación** { .seccion }

### 8. Pruebas cruzadas entre sistemas heterogéneos
Realiza y documenta con capturas (terminal cliente a la izquierda, sistema remoto a la derecha, mostrando por ejemplo la salida de `neofetch` o `systeminfo`) al menos cuatro combinaciones cruzadas. Cada prueba debe indicar el protocolo usado y si está o no orientado a sesión.

**8.1 Windows → Linux** por SSH.

**8.2 Linux → Windows** por RDP/WinRM.

**8.3 Cliente a través de WireGuard**: un cliente conectado a través del túnel WireGuard.

**8.4 Dispositivo móvil**: acceso desde el dispositivo móvil a través de la VPN.

### 9. Cifrado y verificación de la información transferida

**9.1 Mecanismos de cifrado**: para cada uno de los servicios configurados (SSH, túnel SSH, WireGuard, RDP, WinRM), indica explícitamente qué mecanismo de cifrado emplea (algoritmo de intercambio de claves, cifrado simétrico, TLS...).

**9.2 Captura de tráfico**: si es posible, captura con Wireshark el tráfico de una conexión Telnet o VNC sin cifrar frente a una conexión SSH o WireGuard, comparando visualmente los datos legibles en cada caso.

### 10. Documentación final del entorno administrado en remoto

**10.1 Fichas de servicio**: redacta una ficha por cada servicio de acceso remoto desplegado (SSH, túnel SSH, WireGuard, RDP, WinRM) indicando: puerto utilizado, mecanismo de autenticación y cifrado, cuentas autorizadas, reglas de firewall aplicadas y resultado de la última prueba de conectividad.

**10.2 Reproducibilidad**: esta documentación debe permitir que otra persona del equipo reproduzca el acceso sin necesidad de preguntar nada más.

!!! tip "SI NO DISPONES DE VARIAS MÁQUINAS FÍSICAS"
    Todo el escenario puede desplegarse con máquinas virtuales en VirtualBox, VMware o un contenedor Proxmox sobre un único equipo potente, e incluso combinarse con instancias gratuitas de un proveedor cloud para el servidor Windows si el hardware disponible es limitado. Lo importante no es el medio de virtualización, sino que existan al menos dos sistemas operativos distintos y una red que los conecte para poder cumplir el apartado 8.

!!! example "ENTREGA"
    - En caso de no indicar lo contrario cada apartado tendrá el mismo valor.
    - Para una calificación correcta se han de seguir las instrucciones del documento “**Pautas del curso**”, que se encuentra en el apartado de recursos del Campus.
    - La entrega debe incluir:
        1. Tabla de direccionamiento y roles del apartado 1.
        2. Capturas de la configuración de `sshd_config` y de la conexión por el nuevo puerto (apartado 2).
        3. Capturas del túnel SSH configurado en PuTTY y del `INSERT` ejecutado a través de él (apartado 3).
        4. Ficheros de configuración de los peers WireGuard (sin exponer claves privadas reales) y capturas de `wg show` (apartados 4 y 5).
        5. Capturas de las conexiones RDP y de la sesión WinRM (apartado 6).
        6. Evidencia de las cuentas de acceso remoto creadas y sus permisos (apartado 7).
        7. Capturas de las pruebas cruzadas heterogéneas (apartado 8).
        8. Comparación del tráfico cifrado frente a no cifrado, si se ha podido capturar (apartado 9).
        9. Documento final con las fichas de cada servicio (apartado 10).
    - Entregar un documento **“pdf”** a través del Campus. El nombre del archivo debe ser: “**Apellido1Apellido2Nombre_SPXX**”.
