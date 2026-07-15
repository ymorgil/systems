# **🖨️ UT05 · Servidores de impresión**

## Teoría

### Servidores de impresión en Windows

El proceso de impresión consiste básicamente en transmitir una serie de datos textuales, gráficos, imágenes, etc. desde el ordenador que las ha procesado hasta un determinado periférico de impresión.

Para establecer una comunicación con cualquier periférico hay un canal de comunicación física, es decir una interfaz electrónica que permita transmitir las señales que llevan la información. Estos canales pueden ser puertos y buses de comunicación o bien una infraestructura de red. Uno de los dispositivos que se comparten más a menudo en una red son las impresoras; para realizarlo es necesario implementar:

- Un software que gestione los trabajos de impresión, organizándolos en colas, dando prioridad a algunos de ellos, poniendo portadas y evitando que las hojas de los diferentes trabajos se mezclen entre sí.
- Una **cola de impresión**, es decir, la lista de trabajos que están a la espera de ser impresos en un dispositivo.
- En empresas medianas/grandes, pools o grupos de impresoras que comparten la misma cola y un software que envía el trabajo a la primera que queda libre.

Un servidor de impresión es el software que permite que los equipos de una red local hagan uso de las impresoras de la red de forma eficaz, ya que centraliza las tareas de impresión y facilita su gestión, evitando tener que transportar el archivo a imprimir hacia el equipo que tiene la impresora conectada, y sin necesidad de tener instalada en dicho equipo la aplicación con la que se generó el trabajo.

> ¿Eso no se puede hacer ya compartiendo una impresora en Windows? Sí, pero en el momento en que se apaga el equipo al que está conectada la impresora, se pierde la posibilidad de utilizarla. En cambio, si se conecta un servidor de impresión a la red, la impresora estará siempre disponible, independientemente de los equipos que estén encendidos en ese momento.

**Software de servidor de impresión más habitual:**

- **CUPS** (Common Unix Printing System): solución de servidor de impresión utilizada en sistemas Linux. Permite gestionar impresoras locales y de red, configurar colas de impresión y utiliza el protocolo IPP para la comunicación.
- **Windows Print Server**: funcionalidad incluida en Windows Server que facilita la administración centralizada de impresoras en redes empresariales. Soporta controladores específicos para diferentes modelos y gestiona colas de impresión de manera eficiente.
- **PaperCut**: software diseñado para controlar y monitorizar el uso de impresoras en entornos educativos y corporativos; permite establecer políticas de impresión, limitar el uso excesivo y generar informes de consumo de recursos.

Objetivos típicos de un servidor de impresión: compartir todas las impresoras desde un único servidor centralizado (de red o no), controlar las impresiones por usuario/grupo/departamento, realizar cobros por impresión, implementar cuotas, y permitir el uso de las impresoras desde cualquier dispositivo de la red (Windows, Linux, Mac, móviles, etc).

**Impresoras locales compartidas en red**: están conectadas físicamente a un equipo que actúa como servidor de impresión (puerto paralelo o USB). La gestión de permisos de impresión y de acceso corre a cargo del sistema operativo al que está conectada, y la cantidad de usuarios que pueden imprimir a la vez está limitada por la capacidad de proceso de ese equipo.

**Impresoras de red**: tienen una tarjeta de comunicaciones integrada que hace innecesario un ordenador intermedio. Pueden conectarse directamente a la red mediante una interfaz de red (RJ45) o de forma inalámbrica (WiFi o Bluetooth), y no requieren que un equipo esté encendido actuando como servidor.

**Tipos de servidores de impresión:**

- **Dedicados**: dispositivos físicos diseñados exclusivamente para administrar trabajos de impresión en red, con puertos Ethernet y USB/paralelo. Ofrecen gestión de colas, control de acceso y supervisión.
- **Basados en software**: en lugar de hardware dedicado, utilizan software instalado en un equipo (Windows Print Server, CUPS).
- **En la nube**: los trabajos se envían por Internet a una impresora conectada a la nube, que gestiona la cola y el envío del trabajo.
- **Integrados en impresoras**: muchas impresoras modernas incluyen servidor de impresión integrado y se conectan directamente a la red.
- **Virtuales**: se ejecutan en máquinas virtuales y administran trabajos de impresión en múltiples sistemas operativos y entornos de red (por ejemplo, PaperCut).

#### Puertos y protocolos de impresión

Los **puertos físicos** son las conexiones que permiten la comunicación entre el ordenador y la impresora. Han ido evolucionando desde el puerto serie, pasando por el puerto paralelo, hasta el puerto USB actual.

- **Puerto paralelo**: fue la interfaz de impresión local por excelencia hasta la aparición del USB.
- **Puerto serie RS232**: diseñado para distancias de hasta 15 metros y velocidades bajas (unos 20 Kbps); aún se usa en algunas impresoras especiales de tickets y códigos de barras.
- **Puerto USB**: permite conexión en caliente (*hot swap*) y reconocimiento automático (*plug and play*). La versión 2.0 alcanza 480 Mbps y la 3.0 hasta 3.200 Mbps; es la interfaz más utilizada actualmente.
- **Puerto FireWire**: interfaz de serie tipo bus similar al USB, con velocidades de 400 a 3.200 Mbps según versión.
- **Puerto RJ45**: conector utilizado para conectar dispositivos a la red mediante cable.

![Puerto FireWire en un equipo](../assets/img/add/05/05-01.jpg)

![Distintos tipos de puertos y conectores de un equipo](../assets/img/add/05/05-02.png)

Los **puertos lógicos (protocolos)** son identificadores numéricos usados en software para gestionar la comunicación entre dispositivos o aplicaciones a través de una red, como los puertos TCP/UDP (hasta 65.000, siendo los más conocidos del 1 al 1024: puerto 80 HTTP, 443 HTTPS, 25 SMTP, etc). Los principales protocolos de comunicación en sistemas de impresión son:

- **Protocolo LPD/LPR** (*line printer daemon / line printer remote*): implementado originalmente en BSD Unix. Utiliza TCP/IP y trabaja normalmente escuchando en el puerto TCP 515. LPR es el proceso cliente que envía el trabajo, y LPD es el proceso que lo recibe. Los datos de impresión constan de un fichero de datos y un archivo de control (nombre del trabajo, propietario, número de copias, cola de destino, etc). Se pueden definir varias colas en un mismo servidor LPD.
- **Protocolo IPP** (*Internet Printing Protocol*): define extensiones de HTTP para dar soporte a servicios de impresión remotos, configuración de impresoras y gestión de colas. A diferencia de otros protocolos permite control de acceso, autenticación y cifrado. Es el protocolo nativo de CUPS y suele usar el puerto 631. Se le critica la sobrecarga de estar construido sobre HTTP.
- **AppSocket**: basado en el protocolo Jetdirect de Hewlett-Packard, permite comunicación directa entre equipos e impresoras en red enviando el trabajo en formato original. Suele trabajar en el puerto 9100; se considera fiable, sencillo y rápido.
- **AppleTalk**: protocolo de impresión utilizado en entornos Apple para imprimir en impresoras compartidas de una red AppleTalk.
- **SMB/CIFS** (*Server Message Block / Common Internet File System*): protocolos de la capa de aplicación que permiten compartir archivos e impresoras entre nodos de una red. Usa el puerto TCP 445; fue ideado por IBM y perfeccionado por Microsoft para sus sistemas Windows, aunque también existen implementaciones libres para Linux.

#### Sistemas de impresión

Un sistema de impresión es el conjunto de componentes y tecnologías utilizadas para imprimir documentos y gráficos en papel u otros medios, y puede variar en complejidad desde una impresora personal hasta sistemas de producción a gran escala. Principales tecnologías:

- **Impresión láser**: utiliza un láser para crear la imagen; el tóner (tinta en polvo) se adhiere al papel mediante calor, con impresión rápida y de alta calidad.
- **Impresión de inyección de tinta**: emplea cartuchos de tinta líquida expulsada en pequeñas gotas; versátil y habitual en impresoras domésticas y de oficina.
- **Impresión matricial**: cabezal con alfileres que impacta una cinta entintada; poco común hoy, se usa en formularios continuos y recibos.
- **Impresión térmica**: se basa en el calor sobre papel termosensible, ya sea por calentamiento selectivo (térmica directa) o por transferencia de tinta/cera (transferencia térmica).
- **Impresión 3D**: crea objetos tridimensionales capa por capa con distintos materiales (plástico, metal, cerámica); habitual en prototipado y fabricación aditiva.
- **Impresión de sublimación de tinta**: tinta sólida que se convierte en gas y se adhiere a superficies como tela o cerámica, mediante presión y calor.
- **Impresión de impacto**: cabezales que impactan una cinta o papel entintado (por ejemplo, de margarita); usada en aplicaciones industriales y de producción.
- **Impresión de formato ancho (plotter)**: para documentos de gran tamaño, como planos arquitectónicos, mapas o pancartas.

![Cartuchos de una impresora de inyección de tinta](../assets/img/add/05/05-03.jpeg)

![Esquema de funcionamiento de una impresora láser](../assets/img/add/05/05-04.jpeg)

**Componentes de un sistema de impresión:**

- **Impresora**: dispositivo físico que transfiere tinta, tóner o tinta sólida al medio (papel, cartulina, etiquetas).
- **Controlador de impresora**: software que traduce los datos a imprimir en comandos que la impresora entiende; cada modelo requiere un controlador compatible con el sistema operativo.
- **Medios de impresión**: papel de distintos tamaños, cartulina, transparencias, etiquetas, papel fotográfico, etc.
- **Software de diseño e impresión**: programas para crear y dar formato a los documentos (Adobe InDesign, Microsoft Word, software de diseño gráfico).
- **Red de impresión**: conecta múltiples equipos a una o varias impresoras; los servidores de impresión y los protocolos facilitan la administración y el acceso compartido.
- **Escáneres y multifuncionales**: integran escaneo, copia y fax en un mismo dispositivo.
- **Mantenimiento y suministros**: sustitución de cartuchos o tóner, limpieza de cabezales y reparación de incidencias.

**Módulos internos de un sistema de impresión:**

- **Planificador de colas (spooler)**: la mayoría de impresoras no tienen memoria suficiente para cargar un documento completo, de ahí la necesidad de colas y de un sistema que las gestione, monitorizando la impresora y enviando el siguiente trabajo cuando queda libre. Las colas pueden estar en el equipo cliente, en el servidor de impresión o en un servidor proxy de archivos.
- **Filtros**: traducen entre los datos de entrada y el lenguaje propio que entiende cada modelo de impresora.
- **Controladores de interfaz (backends)**: gestionan el puerto de comunicación físico (USB, paralelo) o la conexión de red (IPP, AppSocket, etc). El diseño modular permite añadir nuevas interfaces sin afectar al resto de la arquitectura.

#### Gestión de impresoras y trabajos

- **Administración de impresoras**: instalación y configuración de dispositivos en red, controles de acceso, mantenimiento regular y supervisión del estado para prevenir y resolver problemas.
- **Administración de trabajos de impresión**: organizar y priorizar la cola, eliminar trabajos con errores, asignar prioridades y establecer cuotas de uso.
- **Seguridad de impresión**: autenticación de usuarios, cifrado de datos y políticas de eliminación segura de trabajos confidenciales.
- **Gestión de consumibles**: inventario de cartuchos/tóner y alertas de reposición.
- **Generación de informes**: análisis de costes de impresión, uso de las impresoras y planificación de mantenimiento.
- **Administración de políticas**: reglas de uso y calidad, y cumplimiento normativo dentro de la organización.

En un equipo local la cola de impresión se encuentra en `C:\WINDOWS\system32\spool\printers`. PowerShell permite administrar las impresoras por línea de comandos: agregar un controlador, un puerto, una impresora, etc.

| Comando | Definición |
| --- | --- |
| `Add-Printer` | Agrega una nueva impresora al sistema. |
| `Add-PrinterDriver` | Agrega un controlador de impresora al sistema. |
| `Add-PrinterPort` | Agrega un puerto de impresora al sistema. |
| `Get-PrintConfiguration` | Obtiene y configura opciones de impresión. |
| `Get-Printer` | Obtiene información sobre las impresoras del sistema. |
| `Get-PrinterDriver` | Obtiene información sobre los controladores de impresora. |
| `Get-PrinterPort` | Obtiene información sobre los puertos de impresora. |
| `Get-PrinterProperty` | Obtiene propiedades de impresoras específicas. |
| `Get-PrintJob` | Proporciona detalles sobre trabajos de impresión en curso. |
| `Remove-Printer` | Elimina una impresora del sistema. |
| `Remove-PrinterDriver` | Elimina un controlador de impresora del sistema. |
| `Remove-PrinterPort` | Elimina un puerto de impresora del sistema. |
| `Remove-PrintJob` | Elimina un trabajo de impresión en curso. |
| `Restart-PrintJob` | Reinicia un trabajo de impresión en pausa o con error. |
| `Resume-PrintJob` | Reanuda un trabajo de impresión en pausa. |
| `Suspend-PrintJob` | Pausa un trabajo de impresión en curso. |

#### Configurar un servidor de impresión en Windows

La configuración de un servidor de impresión en Windows permite a los usuarios y dispositivos de la red acceder y utilizar impresoras compartidas de manera centralizada, administrando tanto las impresoras como los trabajos de impresión. Pasos generales:

1. Instalación del rol de servidor de impresión.
2. Configuración de impresoras.
3. Compartición de impresoras.
4. Configuración de permisos de acceso.
5. Publicación en el directorio activo (opcional).
6. Configuración de opciones de impresión (opcional).
7. Administración de trabajos de impresión.
8. Conexión de clientes.

Se instala el rol **Servicios de impresión y documentos**, encargado de administrar las impresoras del sistema, que además incluye estos roles menores:

- **Servidor de impresión**, para administrar las impresoras.
- **Impresión en Internet**, para imprimir a través de Internet (previa apertura de los puertos adecuados); también ofrece un sitio web para administrar los trabajos de impresión.
- **Servicio LPD**, que garantiza compatibilidad con otros sistemas como GNU/Linux y soporta el servicio IPP.

Una vez instalado el rol se pueden consultar los drivers e impresoras por defecto, tanto en modo gráfico como por terminal. Al añadir una impresora nueva al servidor, el procedimiento habitual es: instalar la impresora, buscar y agregar su controlador al almacén de drivers, agregar un puerto local por defecto, comprobar el puerto y, finalmente, compartir la impresora con la red para que todos los clientes puedan usarla.

En los clientes, el acceso puede configurarse de dos formas: mediante navegador web con protocolo IPP (`http://IP/printers`) o como recurso compartido añadido en la sección de dispositivos del sistema. Como comprobación final, se pueden enviar archivos a imprimir con la impresora en pausa para verificar que se genera correctamente la cola de impresión, tanto vía web como desde el propio servidor.

### Servidores de impresión en Linux

Los principales sistemas de impresión en Linux son:

- **LPD**: gestor de impresión tradicional de la plataforma Unix BSD, controlado por el demonio situado en `/usr/sbin/lpd` y que utiliza el protocolo LPD/LPR. Los clientes se comunican con el demonio mediante el dispositivo `/dev/printer` y usan el archivo `/etc/printcap` para determinar el directorio de la cola de trabajos.
- **LPRng**: implementación libre que mejora el sistema de impresión manteniendo compatibilidad con el demonio LPD, e incorpora nuevas funcionalidades de control de cola y servidores de impresión en red.
- **CUPS**: sistema de impresión común de Unix, potente y completo, basado en el protocolo IPP e integrando PostScript como lenguaje estándar de definición de páginas.
- **Samba**: permite compartir impresoras configuradas en Linux con clientes Windows mediante el protocolo SMB/CIFS, de forma que los equipos Windows envían trabajos de impresión a servidores Linux como si fueran impresoras locales. Se configura principalmente en `/etc/samba/smb.conf`.

#### CUPS

**CUPS** (*Common Unix Printing System*) es un sistema de impresión para sistemas Unix que permite que un equipo funcione como servidor de impresión, aceptando tareas de impresión desde equipos clientes, procesándolas y enviándolas a la impresora indicada.

- Los paquetes recomendados en una instalación nueva son `cups`, `cups-client` y `cups-pdf`.
- Utiliza el protocolo **IPP** para las tareas y colas de impresión, además de ofrecer los comandos tradicionales de impresión de los sistemas Unix.
- Está compuesto por una cola de impresión con su planificador, un sistema de filtros que convierte los datos a imprimir en el formato que reconoce la impresora, y un sistema de soporte que envía los datos al dispositivo.

**Características principales:**

- **Servicio de directorio (*printer browsing*)**: los clientes pueden encontrar y utilizar automáticamente impresoras de cualquier servidor de la red mediante mensajes de difusión general (*broadcasting*).
- **Clases**: permiten definir grupos de impresoras de características similares; los trabajos enviados a una clase se redirigen a la primera impresora disponible, lo que también posibilita seguridad y reparto de carga.
- **Soporte de clientes LPD**: mediante un minidemonio (`cups-lpd`) que atiende las tareas recibidas por LPD y las redirige al subsistema CUPS convirtiéndolas a protocolo IPP.
- **Administración web**: CUPS actúa también como servidor web para documentación, monitorización de estado y administración del sistema, accesible por defecto en el puerto 631 (`http://localhost:631` en local, o `http://IP_servidor:631` desde la red).
- **Impresión desde línea de comandos**: CUPS entiende directamente muchos tipos de archivo (texto, PostScript, PDF, imágenes), lo que permite imprimirlos desde aplicaciones de usuario o directamente desde terminal.

**Funcionamiento**: CUPS gira en torno a un proceso de planificación (*scheduler*), el demonio `cupsd`, que se carga en el arranque del sistema y trabaja en segundo plano gestionando las peticiones IPP —tanto locales como de clientes en red de distintas plataformas—, generando un archivo de datos y un archivo de control por cada trabajo, guardados en `/var/spool/cups`. Las impresoras compatibles con PostScript interpretan directamente los datos del planificador; las que no lo son requieren traducción mediante filtros o herramientas como Ghostscript. PostScript es un lenguaje de descripción de páginas desarrollado por Adobe, estándar en la industria de impresión profesional y diseño gráfico.

**Instalación en Ubuntu:**

```bash
sudo apt update
sudo apt install cups
```

Una vez instalado, se puede gestionar el servicio para que se inicie automáticamente con el arranque del servidor:

```bash
sudo systemctl stop cups
sudo systemctl start cups
sudo systemctl enable cups
sudo systemctl status cups
```

**Configuración**: el archivo principal de configuración es `/etc/cups/cupsd.conf` (conviene hacer copia de seguridad antes de modificarlo). Por defecto CUPS escucha en el puerto 631, que se puede mantener o cambiar por seguridad. También conviene habilitar la navegación para que las impresoras compartidas estén disponibles en la red, y revisar las directivas de acceso a la interfaz web y páginas de administración (permitir antes de denegar, para que los equipos de la red local puedan acceder). Para poder administrar CUPS con un usuario estándar, este debe pertenecer al grupo `lpadmin`:

```bash
sudo usermod -aG lpadmin nombreusuario
```

Tras las líneas `Order allow,deny` del fichero de configuración se pueden añadir directivas de acceso:

| Directiva | Efecto |
| --- | --- |
| `Allow all` | Permite el acceso a todos, incluso desde Internet (no recomendable). |
| `Allow @LOCAL` | Permite el acceso solo desde localhost. |
| `Allow from IP` | Permite el acceso desde la IP indicada. |
| `Allow from IP/24` | Permite el acceso desde toda la red local. |

Para restringir el acceso a la administración, configuración y registros:

```
Require user @SYSTEM
Require user @SYSTEM @lpadmin
```

En `/etc/cups/cups-files.conf` se encuentra el grupo de usuarios que pueden administrar CUPS (donde se pueden añadir usuarios) y las rutas de los ficheros de registro (log).

Una vez configurado el servicio, se reinicia, se comprueba su estado y ya se puede acceder a la interfaz web de administración, que ofrece los siguientes apartados:

- **Inicio**: página principal con acceso directo a las opciones más habituales.
- **Administración**: gestión de impresoras y trabajos, modificación de archivos de configuración, consulta de errores, etc.
- **Clases**: creación de grupos de impresoras para centralizar y gestionar grandes trabajos (no se usa en sistemas pequeños).
- **Ayuda en línea**: acceso a la documentación de CUPS (en inglés).
- **Trabajos**: gestión de la cola de impresión, estado y trabajos pendientes, con posibilidad de eliminarlos.
- **Impresoras**: alta, configuración, eliminación y administración de impresoras.

**Agregar una impresora**: si el servidor no tiene ninguna impresora, primero hay que añadirla al servidor para después compartirla. Una opción habitual en pruebas es instalar una impresora virtual PDF, que en lugar de imprimir en un soporte físico genera un archivo PDF; estos archivos se almacenan en la carpeta personal del usuario, en un directorio `/home/usuario/PDF`. El asistente web de CUPS guía los pasos de alta de la impresora, y el funcionamiento se puede comprobar imprimiendo una página de prueba.

**Cliente CUPS**: en un equipo cliente Ubuntu se actualizan e instalan los paquetes necesarios para utilizar el servidor de impresión, se comprueba que detecta la impresora y, una vez agregada, se realiza la comprobación mediante comandos de impresión. Por último, desde la interfaz web se puede verificar en los trabajos completados que las impresiones se han llevado a cabo.

**Comandos de impresión en GNU/Linux:**

- `lpr archivo` (o `lp archivo`): añade el documento a la cola de impresión por defecto.
- `lpq`: muestra todos los trabajos que están en la cola de impresión.
- `lprm`: cancela todos los trabajos de la cola, o solo uno si se indica su número (equivalente a `cancel`).
- `lpstat`: comando principal para mostrar información sobre impresoras y trabajos.
  - `-p`: lista las impresoras configuradas y su estado (habilitada/deshabilitada, si acepta trabajos).
  - `-d`: muestra la impresora predeterminada del sistema.
- `lpadmin`: permite administrar una impresora determinada.
- `enable` / `disable impresora`: habilita o deshabilita una impresora.
- `lpc`: consulta y gestiona el estado de impresoras y colas en sistemas LPD (habilitar/deshabilitar impresoras, controlar trabajos).
- `lpmove`: mueve trabajos de impresión de una cola a otra, útil para reubicarlos en caso de errores.
- `lpoptions`: muestra o configura las opciones de impresión y los valores predeterminados de una impresora (`-d impresora` para establecerla como predeterminada).

#### Samba como servidor de impresión

Un servidor de impresión Samba permite compartir impresoras configuradas en sistemas Linux/Unix con equipos Windows y otros dispositivos de la red local, mediante el protocolo **SMB/CIFS**, el estándar de comunicación de archivos e impresoras en entornos Windows.

- **Integración entre sistemas operativos**: Samba actúa como intermediario, haciendo que las impresoras de Linux sean accesibles como si fueran recursos nativos de Windows.
- **Compatibilidad con CUPS**: en Linux, Samba se integra habitualmente con CUPS para gestionar las impresoras físicas y virtuales.
- **Configuración**: el archivo `/etc/samba/smb.conf` define los recursos compartidos, incluidas las impresoras (nombre, permisos de acceso, disponibilidad en la red).

**Instalación en Ubuntu:**

```bash
sudo apt update
sudo apt install samba
```

Gestión del servicio:

```bash
sudo systemctl stop smbd
sudo systemctl start smbd
sudo systemctl enable smbd
sudo systemctl status smbd
```

Para compartir una carpeta o impresora hay que modificar el fichero `/etc/samba/smb.conf` (conviene hacer copia de seguridad previa). Principales opciones de configuración de un recurso:

| Opción | Comentario |
| --- | --- |
| `[recurso]` | Nombre del recurso compartido. |
| `browseable` | Indica si se puede explorar dentro del recurso (`yes`/`no`). |
| `comment` | Información adicional sobre el recurso. |
| `create mode` | Permisos por defecto de los ficheros creados. |
| `directory mode` | Permisos por defecto de los directorios creados. |
| `force user` | Usuario propietario de los ficheros y carpetas creados. |
| `force group` | Grupo propietario de los ficheros y carpetas creados. |
| `guest ok` | Indica si se permite el acceso a usuarios anónimos. |
| `path` | Carpeta a compartir. |
| `printable` | Debe ser `yes`; si no, las impresoras no funcionan. |
| `public` | Indica si el directorio permite acceso público. |
| `read only` | Indica que el directorio es de solo lectura. |
| `valid users` | Usuarios que pueden acceder a la carpeta (un grupo se indica con `@nombre`). |
| `writable` | Indica que se puede modificar el contenido de la carpeta. |
| `write list` | Usuarios que pueden modificar el contenido. |

Tras modificar la configuración, se reinician los servicios y se valida con `testparm`, comprobando después el acceso desde un cliente Windows.

**Gestión de usuarios Samba** mediante `smbpasswd`:

```bash
smbpasswd -opción usuario
```

Para poder añadir un usuario en Samba, primero debe existir en el sistema (`useradd`). Para consultar los usuarios de Samba:

```bash
pdbedit -L
```

| Opción | Comentario |
| --- | --- |
| `-a` | Añade un usuario. |
| `-x` | Elimina un usuario. |
| `-d` | Deshabilita un usuario. |
| `-e` | Habilita un usuario. |
| `-n` | Establece la contraseña a NULL. |

## Actividades y prácticas

### Práctica

**Windows**

1. Instalar el rol de **Servicios de impresión y documentos** en un controlador del dominio. Mediante PowerShell, añadir una nueva impresora (elección libre), descargando sus drivers y agregándolos al listado de drivers del servidor de impresión; agregar también un puerto local para la nueva impresora, denominada «nombreprint». Compartir la impresora con todos los clientes de la red y, a continuación, pausarla hasta finalizar las pruebas de configuración.
2. Agregar la impresora como predeterminada en uno de los equipos del dominio y mandar a imprimir una serie de archivos, comprobando mediante navegador y desde el servidor de impresión que se genera la cola de impresión correspondiente.
3. Crear el grupo `print` en el dominio con dos usuarios, y configurar la impresora para que se despliegue automáticamente en todos los usuarios del grupo mediante una GPO. Comprobar el funcionamiento con un usuario del grupo y con otro que no pertenezca a él.
4. Instalar el aplicativo **PaperCut** en el servidor de impresión y limitar el uso de los usuarios a 100 copias. Documentar el procedimiento de instalación, configuración y comprobación.
5. **Windows Server 2022 Core**:
   1. Instalar un nuevo servidor de impresión con red NAT `192.168.192.0/24` y un dominio propio.
   2. Agregar una unidad organizativa «printers» y un usuario «nombreprint» dentro de ella; listar el contenido de la UO para comprobar.
   3. Instalar el rol de **Servicios de impresión y documentos** y mostrar los drivers e impresoras por defecto.

**GNU/Linux**

Los siguientes apartados se realizan en una red NAT (`192.168.x.y/24`), con un Ubuntu Server (`.100`), un Ubuntu Desktop (`.110`) y un Windows 11 (`.102`).

6. En Ubuntu Server, instalar el servidor de impresión **CUPS** y configurarlo para que solo los tres equipos del supuesto puedan acceder a la interfaz web.
7. Ampliar la configuración de CUPS para que solo los usuarios de un grupo determinado puedan acceder a la administración del servidor y agregar impresoras. Agregar una impresora al servidor y compartirla con la red.
8. Desde un Ubuntu Desktop, agregar la impresora como predeterminada mediante terminal y comprobar su funcionamiento (cola de impresión por terminal, interfaz web y archivo impreso virtual en el servidor).
9. Instalar el servicio de **Samba** para compartir la impresora predeterminada con todos los usuarios de un grupo determinado.
10. En Windows 11, seleccionar la impresora compartida como predeterminada y comprobar su funcionamiento imprimiendo documentos, verificando el resultado mediante interfaz gráfica, interfaz web y archivo impreso virtual en el servidor.

### Recuperación

**Preguntas teóricas:**

1. Diferencias entre impresoras locales compartidas en red e impresoras en red.
2. Definir qué es una impresora virtual PDF.

**Preguntas prácticas — Windows:**

3. Instalar el rol de **Servicios de impresión y documentos** en un controlador del dominio y agregar una impresora al servidor de impresión.
4. Agregar la impresora como predeterminada en uno de los equipos del dominio y mandar a imprimir una serie de archivos.
5. Comprobar desde el servidor de impresión que se ha generado una cola de impresión con los archivos generados desde el cliente en el apartado anterior.
6. Comprobar desde el navegador web en el cliente que se ha generado la misma cola de impresión.

**GNU/Linux:**

7. En Ubuntu Server, instalar una impresora virtual y a continuación el servidor de impresión CUPS, reflejando todas las configuraciones necesarias para que los siguientes apartados funcionen.
8. Desde otro equipo Linux, agregar al servidor de impresión una impresora virtual como predeterminada e imprimir varios documentos mediante terminal, mostrando la cola de impresión.
9. En Ubuntu Server, compartir la impresora anterior mediante Samba, restringiendo el acceso solo a los usuarios de un grupo determinado.
10. Desde el cliente Linux, agregar la impresora compartida como predeterminada e imprimir varios documentos mediante terminal, mostrando la cola de impresión.

### Solución

**Supuesto de servidor de impresión en Windows:**

- Se crea una red NAT (`192.168.192.0/24`) y se configura la IP del servidor, cambiando su nombre y desactivando el DHCP automático.
- Se instala el controlador de dominio (rol de Active Directory) y se comprueba el dominio creado.
- Se crean los usuarios necesarios para el uso de las impresoras.
- Se instala el rol de **servidor de impresión** en el controlador de dominio.
- Para agregar una impresora nueva se sigue el procedimiento: instalar la impresora, descargar el controlador correspondiente, añadirlo al almacén de controladores, instalar el controlador, agregar un puerto y, finalmente, instalar la impresora y ponerla en red para compartirla con los equipos del dominio.
- Se agrega el equipo cliente al dominio para poder utilizar la impresora compartida.

**Impresoras compartidas con Samba (Linux):**

- Se agrega la impresora virtual en el equipo Linux.
- Se actualiza el sistema y se instala Samba.
- Se configura el fichero `/etc/samba/smb.conf` para compartir la impresora recién agregada, indicando los parámetros de recurso, permisos y grupo de acceso.
- Se comprueba la configuración (`testparm`), se reinician los servicios y se verifica el acceso desde un cliente Windows, agregando previamente un usuario al grupo correspondiente para poder gestionar impresoras.

**Supuesto de impresoras CutePDF y CUPS:**

- Se instala una impresora virtual CutePDF y se comparte en red; desde un segundo equipo Windows se agrega la impresora compartida y se comprueba su funcionamiento.
- Se instala una impresora virtual CutePDF en un servidor de impresión Windows Server, se realizan pruebas de impresión en local y se agrega la impresora a un equipo del dominio, comprobando su funcionamiento también desde la interfaz web.
- En un cliente Ubuntu se crean dos impresoras locales y se comprueba su funcionamiento; una de ellas se comparte mediante Samba con el resto de equipos Windows de la misma red y grupo de trabajo, creando previamente los usuarios necesarios y configurando el fichero `smb.conf`.
- En un equipo CentOS se instala el servidor de impresión CUPS, se agrega una impresora (desactivando el firewall para permitir el acceso) y se comparte con un cliente Windows de la misma red NAT.

> NOTA: los nombres de usuarios, equipos, dominios e impresoras de las capturas originales han sido sustituidos por marcadores genéricos (`nombreprint`, `nombreWin10`, etc.) tal y como aparecen en los enunciados, para preservar la privacidad del alumnado.
