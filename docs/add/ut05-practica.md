# **🧪 UT05 · Práctica: despliegue de un servidor de impresión compartido entre Windows y Linux**

## Objetivo

Instalar, configurar y documentar un servidor de impresión completo en un escenario heterogéneo, aplicando todo el ciclo visto en el temario: gestión de impresoras integradas en el sistema operativo, servidor de impresión en entorno web, creación y clasificación de impresoras lógicas, grupos de impresión, gestión de colas por comandos y herramientas gráficas, y compartición de impresoras entre sistemas operativos diferentes. La práctica se estructura en **10 apartados obligatorios**, que se corresponden con los criterios de evaluación de la UT (b, c, d, e, f, g, h e i del RA5).

## Materiales

- Red NAT `192.168.192.0/24` (o equivalente) con al menos tres máquinas virtuales.
- Un **Windows Server** (controlador de dominio con el rol de Servicios de impresión y documentos).
- Un **Ubuntu Server** con CUPS y Samba.
- Un **Ubuntu Desktop** y un **Windows 11/10** como clientes de prueba.
- Una impresora virtual PDF (por ejemplo CutePDF en Windows o la impresora PDF de CUPS en Linux), para no depender de hardware físico.
- Acceso a PowerShell en los equipos Windows y a terminal en los equipos Linux.

## Estructura obligatoria de la práctica

### 1. Instalación del servidor de impresión Windows

En el controlador de dominio, instalar el rol **Servicios de impresión y documentos** (con sus subcomponentes Servidor de impresión, Impresión en Internet y Servicio LPD). Comprobar, tanto en modo gráfico como por PowerShell (`Get-Printer`, `Get-PrinterDriver`), los controladores e impresoras que trae el sistema por defecto.

### 2. Creación de una impresora lógica en Windows

Mediante PowerShell, añadir una nueva impresora (`Add-PrinterDriver`, `Add-PrinterPort`, `Add-Printer`), descargando el controlador correspondiente y agregándolo al almacén de drivers del servidor. Asignarle el nombre `nombreprint` y dejarla en pausa hasta finalizar las pruebas. Documentar cada comando ejecutado y su resultado.

### 3. Compartición e integración con Active Directory

Compartir la impresora `nombreprint` con todos los clientes del dominio. Crear el grupo `print` en Active Directory con al menos dos usuarios, y configurar mediante GPO que la impresora se despliegue automáticamente en los equipos de los usuarios de ese grupo. Comprobar el resultado iniciando sesión con un usuario del grupo y con otro que no pertenezca a él.

### 4. Instalación de CUPS en el servidor Linux

En el Ubuntu Server, instalar CUPS (`sudo apt install cups`), arrancar y habilitar el servicio, y restringir el acceso a la interfaz web de administración (puerto 631) para que solo puedan acceder los tres equipos del escenario (directivas `Allow from IP` o `Allow from IP/24` en `/etc/cups/cupsd.conf`). Añadir el usuario de administración al grupo `lpadmin`.

### 5. Creación y clasificación de impresoras lógicas en CUPS

Desde la interfaz web de CUPS, dar de alta una impresora virtual PDF, clasificándola según su conexión (local/red) y su controlador (genérica, PostScript). Restringir el acceso de administración a un grupo determinado de usuarios del sistema (directiva `Require user @grupo`). Compartirla con la red.

### 6. Grupos de impresión (pools/clases)

Crear un segundo dispositivo lógico (real o virtual) y agruparlo con el anterior: un **pool de impresión** en Windows (activando "Pool de impresoras" y añadiendo ambos puertos a la misma impresora lógica) o una **clase** en CUPS que englobe ambas impresoras. Enviar varios trabajos y comprobar que se reparten entre los dispositivos del grupo.

### 7. Gestión de colas por comandos y herramientas gráficas

Desde un cliente Windows del dominio, marcar `nombreprint` como predeterminada y enviar varios archivos a imprimir, comprobando la cola generada tanto desde el navegador (IPP) como desde el propio servidor (`Get-PrintJob`, `Restart-PrintJob`, `Suspend-PrintJob`). Desde un cliente Ubuntu Desktop, marcar la impresora de CUPS como predeterminada por terminal y comprobar la cola con `lpq`, `lpstat -p` y `lpstat -d`.

### 8. Compartición entre sistemas heterogéneos con Samba

En el Ubuntu Server, instalar Samba y compartir la impresora de CUPS mediante `/etc/samba/smb.conf` (recurso con `printable = yes`, restringido a los usuarios del grupo `print`). Validar la configuración con `testparm`, reiniciar el servicio y añadir el usuario correspondiente con `smbpasswd -a`. Desde el cliente Windows 11, agregar la impresora compartida por Samba como predeterminada y comprobar su funcionamiento imprimiendo varios documentos.

### 9. Pruebas cruzadas y cuotas de uso

Realizar pruebas cruzadas entre los tres equipos del escenario: imprimir desde Windows contra la impresora Linux (vía Samba), y comprobar el acceso desde Linux a la impresora Windows (vía IPP/LPD si el servicio LPD está instalado). Instalar **PaperCut** (o documentar de forma justificada por qué no se ha podido instalar) en el servidor de impresión Windows y limitar el uso de los usuarios del grupo `print` a un máximo de 100 páginas.

### 10. Documentación final del servidor de impresión

Redactar un documento único que recoja: los comandos y capturas de cada apartado anterior, la configuración final de `cupsd.conf` y `smb.conf` comentada, los permisos y grupos creados en ambos sistemas, y una tabla resumen de qué impresoras lógicas existen, a qué protocolo responden y desde qué sistemas operativos se ha comprobado su funcionamiento.

## Entregables

1. Capturas y comandos PowerShell de la instalación y configuración del servidor de impresión Windows (apartados 1-3).
2. Ficheros de configuración comentados (`cupsd.conf`, `smb.conf`) del servidor Linux (apartados 4, 5 y 8).
3. Evidencia de las colas generadas en ambos sistemas (`Get-PrintJob`, `lpq`, capturas de la interfaz web de CUPS e IPP).
4. Documento final de documentación del servidor de impresión (apartado 10).

!!! tip "Si no dispones de impresoras físicas"
    Toda la práctica puede resolverse con impresoras virtuales PDF (CutePDF en Windows, la impresora PDF de CUPS en Linux): lo relevante para superar los 10 apartados es la correcta configuración del servidor, de las colas y de la compartición entre sistemas, no que el papel llegue a salir físicamente por una bandeja.
