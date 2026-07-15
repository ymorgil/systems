# **🧪 UT01 · Práctica: despliegue de un dominio Active Directory con GPO e integración de un cliente Linux**

## Objetivo

Diseñar, desplegar y documentar un servicio de directorio completo, aplicando todo el ciclo visto en el temario: instalación de un controlador de dominio, creación del esquema (OUs, usuarios, grupos), configuración de directivas de grupo (GPO), integración de un cliente Linux mediante los mecanismos de autenticación centralizada, y una segunda vía de despliegue basada en OpenLDAP/Samba4 sobre Linux. La práctica se estructura en **10 apartados obligatorios**, que en conjunto cubren los diez criterios de evaluación de la UT (a-j).

## Materiales

- Acceso a AWS Academy (o, alternativamente, VirtualBox/VMware con máquinas virtuales propias).
- Una imagen de **Windows Server** (2019/2022) para el controlador de dominio y un segundo Windows Server o Windows 10/11 como cliente.
- Una imagen de **Ubuntu Server/Desktop 24.04** para el cliente Linux.
- Cliente RDP (Escritorio remoto) y un cliente SSH (por ejemplo, Termius o el propio `ssh` de terminal).
- Editor de texto en el cliente Linux para trabajar con ficheros LDIF (`vim` o similar).

## Estructura obligatoria de la práctica

### 1. Despliegue de las instancias y preparación de la red

Crea tres instancias (EC2 o máquinas virtuales locales): un **Windows Server** que actuará como controlador de dominio (`WSnombreDC`), un segundo **Windows Server o Windows 10/11** que se unirá al dominio como cliente (`WSnombreCLI`), y un **Ubuntu 24.04** que se integrará posteriormente (`UDnombre`). Configura un grupo de seguridad (o firewall) que permita RDP (puerto 3389) hacia las máquinas Windows y SSH hacia la máquina Linux. Asigna al futuro controlador de dominio una **dirección IP estática** en su adaptador de red interno: es un requisito previo indispensable para promoverlo a DC.

### 2. Instalación de Active Directory Domain Services y promoción a controlador de dominio

En la instancia destinada a controlador de dominio, instala el rol **Servicios de dominio de Active Directory (AD DS)** desde el Administrador del servidor y, a continuación, promuévela mediante el asistente de configuración, eligiendo la opción **"Agregar un nuevo bosque"** puesto que es el primer dominio de la organización. Define un nombre de dominio raíz propio (por ejemplo, `nombre.local`), deja que el asistente instale el servicio **DNS** asociado, y anota la **contraseña de restauración de servicios de directorio (DSRM)**. Documenta con capturas los pasos clave del asistente (nivel funcional, opciones del controlador, opciones de DNS).

### 3. Creación de la estructura de OUs, usuarios y grupos

Diseña el esquema del directorio (criterio b): crea al menos dos **unidades organizativas** con sentido propio (por ejemplo, `Profesorado` y `Alumnado`), y dentro de cada una al menos dos **usuarios** y un **grupo de seguridad** que los agrupe. Documenta la jerarquía resultante con una captura del árbol completo en "Usuarios y equipos de Active Directory".

### 4. Configuración de zona de búsqueda inversa y comprobación de DNS

Sobre el servidor DNS instalado junto con AD DS, configura una **zona de búsqueda inversa** además de la directa (creada automáticamente). Comprueba el funcionamiento de ambas resoluciones —directa e inversa— con el comando `nslookup`, mostrando en una única captura de la consola tanto la resolución de nombre a IP como la de IP a nombre.

### 5. Diseño y aplicación de directivas de grupo (GPO) diferenciadas

Crea al menos **dos GPO distintas**, cada una vinculada a una de las OUs del apartado 3, con configuraciones diferenciadas y con sentido técnico. Por ejemplo: para `Profesorado`, un límite de tamaño de perfil de usuario de 40 MB; para `Alumnado`, un límite de 20 MB y además la restricción de acceso al Panel de control. Verifica el efecto real de cada GPO iniciando sesión con un usuario de la OU correspondiente y documentando el comportamiento observado (el aviso de cuota superada, el bloqueo del panel de control).

### 6. Unión de un cliente Windows al dominio

Une la segunda instancia Windows al dominio creado, ajustando previamente su configuración de red (adaptador en la misma red que el controlador, DNS apuntando al servidor del dominio). Documenta el proceso de unión con capturas, e inicia sesión en el cliente con un usuario del dominio creado en el apartado 3, comprobando en ambos lados —cliente y servidor— que el equipo aparece correctamente unido.

### 7. Automatización de la gestión del dominio mediante un script

Desarrolla un **script PowerShell** con un menú interactivo (que se repita hasta que el usuario elija salir) con, al menos, las siguientes opciones: mostrar información del dominio (nombre de equipo, nombre de dominio, número de OUs/grupos/usuarios), crear una nueva unidad organizativa, listar los miembros de una OU, crear un grupo, y crear un nuevo usuario solicitando sus datos, asignándolo a un grupo indicado por quien ejecuta el script y forzando el cambio de contraseña en el primer inicio de sesión. Documenta el código y un ejemplo de ejecución de cada opción.

### 8. Integración de un cliente Linux en el dominio Active Directory

En la instancia Ubuntu, conéctate por SSH e integra el equipo en el dominio Active Directory utilizando las herramientas adecuadas (`realmd`, `sssd`, `winbind` o equivalentes). Comprueba que el sistema reconoce el "reino" (`realm`) del dominio, inicia sesión en modo consola con un usuario del dominio y documenta el procedimiento completo con capturas y explicaciones breves de cada paso.

### 9. Despliegue alternativo de un servicio de directorio en Linux (OpenLDAP o Samba4)

Sobre una máquina Linux adicional (o reutilizando la misma, en un entorno de pruebas distinto), despliega un segundo servicio de directorio, a elegir entre:

- **OpenLDAP**: crea la estructura base del dominio mediante ficheros **LDIF** (al menos dos OUs, con un grupo y un usuario en cada una), muéstralos con `vim` y aplícalos con `ldapadd`. Realiza al menos dos búsquedas filtradas con `ldapsearch` (por ejemplo, listar solo nombre y correo de los usuarios de una OU).
- **Samba4**: promueve el servidor como controlador de dominio con `samba-tool domain provision`, comprueba el nivel funcional del dominio, la resolución de los registros SRV de LDAP y Kerberos, y añade un equipo Windows adicional al dominio Samba.

Documenta la opción elegida con los comandos ejecutados y las comprobaciones de funcionamiento correspondientes.

### 10. Documentación final e informe de la arquitectura

Redacta un informe breve (2-3 páginas) que recoja: un diagrama o esquema de la arquitectura desplegada (dominio, OUs, GPOs, clientes integrados), los parámetros de red utilizados, un resumen de las comprobaciones realizadas en cada apartado, y un apartado de "incidencias y soluciones" con al menos un problema real encontrado durante la práctica y cómo se resolvió. Entrega este informe junto con el resto de artefactos (capturas, scripts, ficheros LDIF).

## Entregables

1. Capturas de la promoción del controlador de dominio, la zona de búsqueda inversa y su comprobación con `nslookup` (apartados 2 y 4).
2. Capturas del árbol de OUs, usuarios y grupos creados (apartado 3).
3. Capturas de las GPO configuradas y de su efecto comprobado en un cliente (apartado 5).
4. Capturas de la unión del cliente Windows al dominio (apartado 6).
5. Script PowerShell y capturas de ejecución de cada opción del menú (apartado 7).
6. Capturas de la integración del cliente Linux en el dominio (apartado 8).
7. Ficheros LDIF o capturas de `samba-tool`, según la opción elegida en el apartado 9.
8. Informe final de arquitectura e incidencias (apartado 10).

!!! tip "Si no dispones de AWS Academy ni de varias máquinas virtuales"
    La práctica puede resolverse íntegramente en local con **VirtualBox** o **VMware**, usando una única red interna (*Internal Network*) para conectar el controlador de dominio y los clientes, sin necesidad de salida a Internet salvo para las actualizaciones iniciales. En ese caso, sustituye la creación de instancias EC2 del apartado 1 por la creación de las máquinas virtuales correspondientes, manteniendo los 10 apartados y los mismos entregables.
