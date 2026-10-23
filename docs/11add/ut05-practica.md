# 🧪 Supuesto Práctico UT05 *Servidor de impresión compartido entre Windows y Linux* { .card }

!!! info "OBJETIVOS"
    Instalar, configurar y documentar un servidor de impresión completo en un escenario heterogéneo, aplicando todo el ciclo visto en el temario: gestión de impresoras integradas en el sistema operativo, servidor de impresión en entorno web, creación y clasificación de impresoras lógicas, grupos de impresión, gestión de colas por comandos y herramientas gráficas, y compartición de impresoras entre sistemas operativos diferentes.

    La práctica se estructura en **10 apartados obligatorios**, que se corresponden con los criterios de evaluación de la UT (b, c, d, e, f, g, h e i del RA5): 3 del servidor de impresión Windows, 2 del servidor CUPS y 5 de grupos de impresión, colas e interoperabilidad.

!!! info "RECURSOS"
    - Red NAT `192.168.192.0/24` (o equivalente) con al menos tres máquinas virtuales.
    - Un **Windows Server** (controlador de dominio con el rol de Servicios de impresión y documentos).
    - Un **Ubuntu Server** con CUPS y Samba.
    - Un **Ubuntu Desktop** y un **Windows 11/10** como clientes de prueba.
    - Una impresora virtual PDF (por ejemplo CutePDF en Windows o la impresora PDF de CUPS en Linux), para no depender de hardware físico.
    - Acceso a PowerShell en los equipos Windows y a terminal en los equipos Linux.

## **Servidor de impresión Windows** { .seccion }

!!! info ""
    - Impresora lógica del servidor Windows: `nombreprint`
    - Grupo de Active Directory para la impresión: `print`
    - Documenta cada comando ejecutado y su resultado.

### 1. Instalación del servidor de impresión Windows

**1.1 Rol de impresión**: en el controlador de dominio, instala el rol **Servicios de impresión y documentos** con sus subcomponentes Servidor de impresión, Impresión en Internet y Servicio LPD.

**1.2 Comprobación**: comprueba, tanto en modo gráfico como por PowerShell (`Get-Printer`, `Get-PrinterDriver`), los controladores e impresoras que trae el sistema por defecto.

### 2. Creación de una impresora lógica en Windows

**2.1 Controlador**: descarga el controlador correspondiente y agrégalo al almacén de drivers del servidor (`Add-PrinterDriver`).

**2.2 Puerto e impresora**: mediante PowerShell, añade una nueva impresora (`Add-PrinterPort`, `Add-Printer`) con el nombre `nombreprint`.

**2.3 Pausa**: deja la impresora en pausa hasta finalizar las pruebas, documentando cada comando ejecutado y su resultado.

### 3. Compartición e integración con Active Directory

**3.1 Compartir**: comparte la impresora `nombreprint` con todos los clientes del dominio.

**3.2 Grupo `print`**: crea el grupo `print` en Active Directory con al menos dos usuarios.

**3.3 Despliegue por GPO**: configura mediante GPO que la impresora se despliegue automáticamente en los equipos de los usuarios de ese grupo.

**3.4 Comprobación**: comprueba el resultado iniciando sesión con un usuario del grupo y con otro que no pertenezca a él.

## **Servidor de impresión GNU/Linux (CUPS)** { .seccion }

### 4. Instalación de CUPS en el servidor Linux

**4.1 Instalación**: en el Ubuntu Server, instala CUPS (`sudo apt install cups`), arranca y habilita el servicio.

**4.2 Restricción de acceso**: restringe el acceso a la interfaz web de administración (puerto 631) para que solo puedan acceder los tres equipos del escenario (directivas `Allow from IP` o `Allow from IP/24` en `/etc/cups/cupsd.conf`).

**4.3 Administración**: añade el usuario de administración al grupo `lpadmin`.

### 5. Creación y clasificación de impresoras lógicas en CUPS

**5.1 Alta de la impresora**: desde la interfaz web de CUPS, da de alta una impresora virtual PDF, clasificándola según su conexión (local/red) y su controlador (genérica, PostScript).

**5.2 Restricción de administración**: restringe el acceso de administración a un grupo determinado de usuarios del sistema (directiva `Require user @grupo`).

**5.3 Compartir**: comparte la impresora con la red.

## **Grupos, colas e interoperabilidad** { .seccion }

### 6. Grupos de impresión (pools/clases)

**6.1 Segundo dispositivo**: crea un segundo dispositivo lógico (real o virtual).

**6.2 Agrupación**: agrúpalo con el anterior mediante un **pool de impresión** en Windows (activando "Pool de impresoras" y añadiendo ambos puertos a la misma impresora lógica) o una **clase** en CUPS que englobe ambas impresoras.

**6.3 Reparto de trabajos**: envía varios trabajos y comprueba que se reparten entre los dispositivos del grupo.

### 7. Gestión de colas por comandos y herramientas gráficas

**7.1 Cliente Windows**: desde un cliente Windows del dominio, marca `nombreprint` como predeterminada y envía varios archivos a imprimir.

**7.2 Cola en Windows**: comprueba la cola generada tanto desde el navegador (IPP) como desde el propio servidor (`Get-PrintJob`, `Restart-PrintJob`, `Suspend-PrintJob`).

**7.3 Cliente Ubuntu Desktop**: marca la impresora de CUPS como predeterminada por terminal y comprueba la cola con `lpq`, `lpstat -p` y `lpstat -d`.

### 8. Compartición entre sistemas heterogéneos con Samba

**8.1 Recurso de impresión**: en el Ubuntu Server, instala Samba y comparte la impresora de CUPS mediante `/etc/samba/smb.conf` (recurso con `printable = yes`, restringido a los usuarios del grupo `print`).

**8.2 Validación**: valida la configuración con `testparm`, reinicia el servicio y añade el usuario correspondiente con `smbpasswd -a`.

**8.3 Cliente Windows 11**: agrega la impresora compartida por Samba como predeterminada y comprueba su funcionamiento imprimiendo varios documentos.

### 9. Pruebas cruzadas y cuotas de uso

**9.1 Pruebas cruzadas**: imprime desde Windows contra la impresora Linux (vía Samba) y comprueba el acceso desde Linux a la impresora Windows (vía IPP/LPD si el servicio LPD está instalado).

**9.2 Cuotas con PaperCut**: instala **PaperCut** (o documenta de forma justificada por qué no se ha podido instalar) en el servidor de impresión Windows y limita el uso de los usuarios del grupo `print` a un máximo de 100 páginas.

### 10. Documentación final del servidor de impresión
Redacta un documento único que recoja:

**10.1 Evidencias**: los comandos y capturas de cada apartado anterior.

**10.2 Configuración**: la configuración final de `cupsd.conf` y `smb.conf` comentada, y los permisos y grupos creados en ambos sistemas.

**10.3 Tabla resumen**: qué impresoras lógicas existen, a qué protocolo responden y desde qué sistemas operativos se ha comprobado su funcionamiento.

!!! tip "SI NO DISPONES DE IMPRESORAS FÍSICAS"
    Toda la práctica puede resolverse con impresoras virtuales PDF (CutePDF en Windows, la impresora PDF de CUPS en Linux): lo relevante para superar los 10 apartados es la correcta configuración del servidor, de las colas y de la compartición entre sistemas, no que el papel llegue a salir físicamente por una bandeja.

!!! example "ENTREGA"
    - En caso de no indicar lo contrario cada apartado tendrá el mismo valor.
    - Para una calificación correcta se han de seguir las instrucciones del documento “**Pautas del curso**”, que se encuentra en el apartado de recursos del Campus.
    - La entrega debe incluir:
        1. Capturas y comandos PowerShell de la instalación y configuración del servidor de impresión Windows (apartados 1-3).
        2. Ficheros de configuración comentados (`cupsd.conf`, `smb.conf`) del servidor Linux (apartados 4, 5 y 8).
        3. Evidencia de las colas generadas en ambos sistemas (`Get-PrintJob`, `lpq`, capturas de la interfaz web de CUPS e IPP).
        4. Documento final de documentación del servidor de impresión (apartado 10).
    - Entregar un documento **“pdf”** a través del Campus. El nombre del archivo debe ser: “**Apellido1Apellido2Nombre_SPXX**”.
