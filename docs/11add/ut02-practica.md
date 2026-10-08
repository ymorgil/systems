# 🧪 Supuesto Práctico UT02 *Procesos del sistema* { .card }

!!! info "OBJETIVOS"
    Administrar los procesos y servicios del sistema, tanto en Windows (PowerShell y CMD) como en GNU/Linux (Bash, `ps`, `pstree`, `top`, `htop`, `systemd` y `journald`), aplicando criterios de seguridad y eficiencia: identificar procesos y su jerarquía, crearlos y terminarlos, modificar su prioridad, enviarles señales y consultar sus registros. 

    En la segunda parte se da el salto del equipo individual a la **monitorización centralizada**, desplegando Nagios y la pila Prometheus + Grafana para vigilar varios equipos de la red. 
    
    La práctica se estructura en **10 apartados obligatorios**: 3 de procesos en Windows, 3 de procesos en GNU/Linux y 4 de monitorización.

!!! info "RECURSOS"
    - VMware con máquinas virtuales propias
    - Un **Windows 11** como equipo cliente (`WCnombre`)
    - Un **Ubuntu Desktop 26.04** o superior (`UDnombre`) 
    - Un **Ubuntu Server 26.04** o superior (`USnombre`)
    - Acceso a Internet para instalar paquetes

## **Procesos en Windows 11** { .seccion }

!!! info ""
    Todos los apartados de este bloque se realizan con **PowerShell en modo administrador**. Para que tu nombre aparezca en el prompt, crea en la raíz del sistema una carpeta con tu nombre (`C:\nombre`), accede a ella y ejecuta los comandos desde esa ruta. En cada captura debe verse el **comando** y su **resultado**. Recuerda captura del comando y del resultado.

### 1. Identificación de procesos
Obtener información de los procesos en ejecución del equipo `WCnombre` mediante comandos y la tuberías de PowerShell:

**1.1 Programas de inicio de sesión** mostrar primero el **número** de programas que se ejecutan al iniciar sesión y, a continuación, el **listado** con su nombre y ubicación.

**1.2 Proceso que más CPU consume**  mostrarlo en **formato lista** con todos los valores de sus propiedades.

**1.3 Procesos agrupados por nombre**: mostrar dos columnas (nombre y número de instancias), ordenadas por el número y limitadas a los **5 grupos** con más procesos.

**1.4 Hilos de un proceso**: abrir Chrome (o Edge) con varias pestañas y mostrar, para cada uno de sus procesos, su PID y su **número de hilos**, terminando con el total de hilos del navegador.


### 2. Creación, prioridad y terminación de procesos

**2.1 Crear procesos**: lanzar con `Start-Process` **tres instancias** del Bloc de notas y listar únicamente esos procesos mostrando su PID y su hora de inicio. *(UNA LÍNEA)*

**2.2 Cambiar la prioridad**: asignar a una de las instancias la prioridad **Alta** y a otra **Por debajo de lo normal**, y comprobarlo listando las tres con la columna `PriorityClass`. *(UNA LÍNEA)*

**2.3 Terminar por consumo de memoria**: detener el proceso con **mayor PID** de entre los **10 procesos que menos memoria consumen**. Se harán tres líneas (listar, eliminar y volver a listar), pero solo puntúa la segunda, que debe resolverse en **una única línea** sin usar el resultado de la primera.

**2.4 Terminar desde CMD**: con `tasklist` filtrar los Bloc de notas que queden en ejecución y terminarlos, junto con sus procesos hijos, de forma forzada con `taskkill`. Comprobar el resultado.


### 3. Gestión de servicios

**3.1 Servicios de datos activos**: contar y mostrar el listado de los servicios cuyo nombre para mostrar contenga la palabra **datos** y que además estén **en ejecución**.

**3.2 Servicios por estado**: agrupar todos los servicios del equipo por su estado, mostrando el número de servicios de cada grupo.

**3.3 Servicios automáticos detenidos**: listar los servicios con tipo de inicio **Automático** que actualmente **no** estén en ejecución (nombre, nombre para mostrar y estado).

**3.4 Administrar un servicio**: con el servicio de cola de impresión (`Spooler`), mostrar sus **servicios dependientes**, detenerlo, cambiar su tipo de inicio a **Manual**, volver a iniciarlo y comprobar en una última línea su nombre, estado y tipo de inicio. Si dicho servicio da errores elegir otro y explicarlo.



## **Procesos en GNU/Linux** { .seccion }

### 4. Procesos y jerarquía
**4.1 Opciones de `ps`**: explicar qué es el PID y el PPID, y qué diferencia hay entre las opciones `a`, `x` y `-e`, mostrando el **número de procesos** que devuelve cada una con un ejemplo con columnas personalizadas (`-o pid,ppid,stat,ni,cmd`).

Ejecutar **Firefox en segundo plano** antes de empezar, cada opción se resuelve con una línea de comandos y puede mostrarse en una captura final:

**4.2 PID mediante `pstree`**: obtener el PID de Firefox **filtrando** el resultado de `pstree`.

**4.3 Procesos padres**: a partir de ese PID, obtener con `pstree` todos los PID de sus **procesos padres** hasta `systemd`.

**4.4 Procesos hijos**: obtener los PID de sus **procesos hijos ordenados por PID** y, en otra línea, devolver el **número de procesos hijos** que tiene el proceso principal.

### 5. Prioridades y señales
**5.1 Lanzar con prioridad**: ejecutar `gparted` en segundo plano con un valor nice de **-10**, indicando su número de trabajo y su PID.
    
**5.2 Cambiar la prioridad**: subirla a la **más alta posible sin** usar `top` ni `htop`, y después bajarla a la **más baja posible con `top`**, mostrando captura del proceso en ambos casos.

**5.3 Pausar y reanudar**: pausar `gparted` enviándole una señal desde **`htop`**, comprobar con `ps` su estado, e indicar **dos maneras** distintas de que el proceso detenido continúe en segundo plano, explicando y mostrando cada una por separado.

**5.4 Procesos prioritarios**: contar y, a continuación, listar todos los procesos del sistema que tengan una **prioridad mayor que la normal**.

### 6. Trabajos y servicios
En (Ubuntu Server):

**6.1 Primer y segundo plano**: lanzar **5 procesos** en segundo plano y listarlos explicando el significado de los símbolos `+` y `-`. Pasar a primer plano el **tercero**, detenerlo y volver a mostrar la lista.

**6.2 Señales**: lanzar `sleep 600` en segundo plano, **detenerlo mediante una señal** y comprobar con `ps` que está detenido; después, sin pasarlo a primer plano, **terminarlo de forma inmediata** también con una señal.

**6.3 Servicios `systemd`**: contar los servicios en estado `running`, `exited` y `failed`, y mostrar las **dependencias** del servicio `ssh`.

**6.4 Script de registros**: crear el script `nombrelogs.sh` que reciba como parámetro un nivel de severidad (`emergente`, `alerta`, `crítico`, `error`, `advertencia`, `noticia`, `información` o `depuración`), muestre por consola la **cantidad de registros de este mes** de dicho nivel y genere en el directorio personal de quien lo ejecuta un **archivo** con el listado de esos registros. Debe validar el parámetro recibido.

En este último punto se ha de mostrar el código comentado del script, enlace al repositorio, un ejemplo de uso explicado y el contenido del archivo generado.

## **Monitorización de sistemas**  { .seccion }
!!! info ""
      - Servidor de monitorización: `USnombre` · IP estática: 172.16.2xx.50
      - Equipo Linux monitorizado: `UDnombre` · IP: 172.16.2xx.60
      - Equipo Windows monitorizado: `WCnombre` · IP: 172.16.2xx.70
      - Usuario administrador de las consolas web: `nombreadmin`

### 7. Nagios Core
En (Ubuntu Server):

**7.1 Instalación y acceso web**: instalar **Nagios Core** junto con los plugins oficiales (`monitoring-plugins`), comprobar con `systemctl` que el servicio está **activo y habilitado** en el arranque, crear el usuario `nombreadmin` con `htpasswd` y acceder a la interfaz `http://172.16.2xx.50/nagios4`.

**7.2 Validación y estado inicial**: comprobar la configuración con `nagios4 -v` mostrando que **no hay errores ni advertencias**, y mostrar en las vistas *Hosts* y *Services* el propio servidor (`localhost`) con todas sus comprobaciones en estado **OK**.

<!-- OCULTO HASTA TERMINAR

### 8. Monitorización con Nagios
Añadir dos equipos Ubuntu y Windows :

**8.1 Definición de hosts**: instalar en `Ubuntu` el agente **NRPE** y definir en Nagios un host con los servicios de **carga del sistema**, **uso del disco raíz** y **número total de procesos**. Definir también el equipo `Windows` y comprobar su disponibilidad mediante `ping` y el puerto **3389 (RDP)**. Mostrar los ficheros `.cfg` creados en el servidor y el `nrpe.cfg` del equipo monitorizado.

**8.2 Vigilancia de un proceso**: crear un servicio con `check_procs` que pase a **CRITICAL** cuando el proceso `firefox` no esté en ejecución en `Ubuntu`, mostrando el cambio de estado al cerrar y volver a abrir Firefox. Mostrar el mapa de red (*Map*) con los **tres equipos** y la vista *Services* con todas las comprobaciones.

### 9. Prometheus y Grafana
En `USnombre` (Ubuntu Server), mediante paquetes del sistema o mediante **Docker Compose**:

**9.1 Prometheus y node_exporter**: instalar **Prometheus** y acceder a su interfaz en el puerto **9090**. Instalar **node_exporter**, añadirlo al fichero `prometheus.yml` y comprobar en *Status → Targets* que tanto Prometheus como node_exporter están en estado **UP**.

**9.2 Grafana**: instalar **Grafana**, acceder por el puerto **3000**, cambiar la contraseña por defecto y crear el usuario `nombreadmin`. Añadir Prometheus como *Data source* e importar el dashboard **Node Exporter Full (ID 1860)**, mostrando las métricas del servidor.

### 10. Gráficas en Grafana
En `USnombre` (Ubuntu Server), ampliar la monitorización y crear el dashboard **`nombre-dashboard`**:

**10.1 Equipos y paneles**: instalar `node_exporter` en `UDnombre` y **windows_exporter** en `WCnombre` (puerto **9182**), añadirlos a `prometheus.yml` y comprobar que los **tres targets** están **UP**. Crear un panel con el **porcentaje de uso de CPU** de `UDnombre` y `WCnombre` en la misma gráfica, y otros dos de **memoria disponible (%)** y **tráfico de red** (recibido y enviado) de `UDnombre`, indicando las consultas **PromQL** utilizadas.

**10.2 Prueba de carga**: generar carga de CPU en `UDnombre` (por ejemplo con `stress` o `yes > /dev/null &`) y mostrar en el dashboard el **pico producido** y su desaparición tras **terminar el proceso con una señal**.






## continuará...

<!-- OCULTO HASTA TERMINAR



### 8. Monitorización de equipos con Nagios
Añadir a Nagios los equipos `UDnombre` y `WCnombre`, de forma que se supervise tanto su disponibilidad como el estado de sus procesos:

!!! success ""
    1. **Host Linux con NRPE**: instalar en `UDnombre` el agente **NRPE** y definir en Nagios un host con los servicios de **carga del sistema**, **uso del disco raíz** y **número total de procesos**.
    2. **Host Windows**: definir el equipo `WCnombre` en Nagios y comprobar su disponibilidad mediante `ping` y el puerto **3389 (RDP)**.
    3. **Vigilancia de un proceso**: crear un servicio con `check_procs` que pase a **CRITICAL** cuando el proceso `firefox` no esté en ejecución en `UDnombre`. Mostrar el cambio de estado al cerrar y volver a abrir Firefox.
    4. **Mapa y evidencias**: mostrar el mapa de red (*Map*) con los tres equipos y la vista *Services* con todas las comprobaciones.

En este apartado se han de mostrar los ficheros `.cfg` creados en el servidor y el `nrpe.cfg` del equipo monitorizado.

### 9. Instalación de Prometheus y Grafana
En el equipo `USnombre`, desplegar la pila **Prometheus + node_exporter + Grafana**, mediante paquetes del sistema o mediante **Docker Compose**:

!!! success ""
    1. **Prometheus**: instalarlo y acceder a su interfaz en el puerto **9090**, mostrando en *Status → Targets* que el propio Prometheus está en estado **UP**.
    2. **node_exporter**: instalarlo en `USnombre`, añadirlo al fichero `prometheus.yml` y comprobar que el nuevo target aparece **UP**.
    3. **Grafana**: instalarlo, acceder por el puerto **3000**, cambiar la contraseña por defecto y crear el usuario `nombreadmin`.
    4. **Origen de datos**: añadir Prometheus como *Data source* en Grafana e importar el dashboard **Node Exporter Full (ID 1860)**, mostrando las métricas del servidor.

### 10. Añadir equipos y crear gráficas específicas en Grafana
Ampliar la monitorización a los equipos de la red y construir un dashboard propio llamado **`nombre-dashboard`**:

!!! success ""
    1. **Añadir equipos**: instalar `node_exporter` en `UDnombre` y **windows_exporter** en `WCnombre` (puerto 9182), añadirlos a `prometheus.yml` y comprobar que los tres targets están **UP**.
    2. **Gráfica de CPU**: crear un panel con el **porcentaje de uso de CPU** de `UDnombre` y `WCnombre` en la misma gráfica, indicando la consulta **PromQL** utilizada.
    3. **Gráficas de memoria y red**: crear un panel de **memoria disponible (%)** y otro de **tráfico de red** (recibido y enviado) de `UDnombre`.
    4. **Prueba de carga**: generar carga de CPU en `UDnombre` (por ejemplo con `stress` o `yes > /dev/null &`) y mostrar en el dashboard el pico producido y su desaparición tras **terminar el proceso con una señal**.

!!! example "ENTREGA"
    - En caso de no indicar lo contrario cada apartado tendrá el mismo valor.
    - Para una calificación correcta se han de seguir las instrucciones del documento: “**Pautas del curso**”, que se encuentra en el apartado de recurso del Campus.
    - Entregar un documento **“pdf”** a través del Campus. El nombre del archivo debe ser: “**Apellido1Apellido2Nombre_SPXX**”
-->