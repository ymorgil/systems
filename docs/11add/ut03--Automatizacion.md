# **🤖 UT03 · Automatización de tareas**

![Anatomía de una tarea automatizada: desencadenante, condiciones, acción y registro](../assets/img/add/ut03-diagrama.svg)

## Resultado de aprendizaje y criterios de evaluación

**RA3.** Gestiona la automatización de tareas del sistema, aplicando criterios de eficiencia y utilizando comandos y herramientas gráficas.

Criterios de evaluación:

a) Se han descrito las ventajas de la automatización de las tareas repetitivas en el sistema.
b) Se han utilizado los comandos del sistema para la planificación de tareas.
c) Se han establecido restricciones de seguridad.
d) Se han realizado planificaciones de tareas repetitivas o puntuales relacionadas con la administración del sistema.
e) Se ha automatizado la administración de cuentas.
f) Se han instalado y configurado herramientas gráficas para la planificación de tareas.
g) Se han utilizado herramientas gráficas para la planificación de tareas.
h) Se han documentado los procesos programados como tareas automáticas.

## 1. Por qué automatizar: ventajas y tareas candidatas

Antes de programar una sola tarea conviene fijar la idea que sostiene toda la unidad (criterio a): automatizar consiste en realizar acciones y procesos **sin intervención humana constante**, y esto no es un capricho técnico sino una decisión de gestión. Un administrador de sistemas que revisa manualmente cada noche si las copias de seguridad se han hecho, o que crea a mano cada cuenta de un grupo de 30 alumnos nuevos, está desperdiciando tiempo en tareas mecánicas que un script o un planificador puede ejecutar de forma más fiable.

Las ventajas de automatizar se pueden resumir en cinco ejes:

| Ventaja | Qué aporta |
|---|---|
| **Eficiencia** | Optimiza procesos y reduce el tiempo dedicado a tareas manuales |
| **Consistencia** | Garantiza que la tarea se ejecuta siempre de la misma manera, sin errores humanos |
| **Ahorro de tiempo** | Libera tiempo del administrador para tareas estratégicas |
| **Mejora de la calidad** | Reduce errores y mejora la fiabilidad de las operaciones |
| **Agilidad** | Permite responder rápido a demandas cambiantes (picos de carga, incidentes) |

No todas las tareas son buenas candidatas a automatizar. Conviene fijarse en cuatro características:

- **Repetitividad**: la tarea se repite en el tiempo y puede programarse a intervalos regulares (revisión de antivirus semanal, comprobación de errores de disco mensual, apagado de servidores, auditorías, copias de seguridad, sincronización horaria).
- **Requisitos de tiempo**: debe ejecutarse en un momento concreto o con un plazo estricto (enviar un informe cada día 1 de mes a las 8:00).
- **Predictibilidad**: tiene un conjunto de pasos y decisiones claro, sin ambigüedad ("si ocurre X, haz Y").
- **Respuesta a un evento**: se dispara ante un suceso del sistema (enviar un correo al administrador si se llena el disco, lanzar un programa al iniciar sesión un usuario concreto, detener un servicio ante una alerta de rendimiento).

!!! note "Formas habituales de automatización"
    No toda automatización pasa por un planificador de tareas: también se automatiza mediante **scripts** (copias de seguridad, gestión de usuarios y permisos), **archivos de respuesta** para instalar software sin intervención manual, **administración remota** (aplicar el mismo cambio a varios sistemas desde un punto central) y la propia **automatización de actualizaciones** (descarga e instalación de parches). El planificador de tareas (`cron`, `at`, Task Scheduler) es solo el mecanismo que decide *cuándo* se dispara cada una de estas acciones.

## 2. Información y diagnóstico del sistema como base de la automatización

Antes de decidir qué automatizar hace falta saber diagnosticar el estado del sistema: qué procesos consumen recursos, qué eventos se han registrado, qué software está instalado. Esta información es la que después alimentará los scripts y las condiciones de las tareas programadas.

### Comandos de diagnóstico en Windows

| Comando | Qué muestra |
|---|---|
| `systeminfo` | Información amplia de hardware, software y configuración; se puede redirigir a fichero (`systeminfo > misistema.txt`) |
| `wmic os get` / `wmic cpu get` / `wmic diskdrive get` | Sistema operativo, CPU, discos |
| `wmic process list` / `wmic service list` | Procesos y servicios en ejecución |
| `wmic useraccount list` | Cuentas de usuario del sistema |
| `findstr` | Búsqueda de patrones de texto en archivos o en la salida de otro comando |
| `Get-EventLog` (PowerShell) | Consulta de los registros de eventos del sistema |

### Comandos de diagnóstico en GNU/Linux

| Comando/ruta | Qué muestra |
|---|---|
| `uname -a` | Kernel, versión, arquitectura y hardware |
| `lsb_release -a` | Distribución y versión |
| `/proc/cpuinfo`, `/proc/meminfo` | Información de CPU y memoria en tiempo real (interfaz virtual con el kernel) |
| `/var/log/syslog`, `/var/log/auth.log` | Eventos del sistema y de autenticación |
| `top`, `htop`, `glances` | Monitorización de procesos y recursos en tiempo real |
| `lshw`, `lscpu`, `lsusb`, `lspci`, `dmidecode` | Diagnóstico detallado de hardware |

Los registros de eventos (`/var/log` en Linux, Visor de eventos en Windows) dependen de demonios concretos: en Linux, **`journald`** (parte de systemd, formato binario) y **`rsyslog`/`syslog`** (texto plano); en Windows, el propio subsistema de logs del Visor de eventos. Estos ficheros son, precisamente, la fuente de datos que muchos scripts de mantenimiento (filtrar errores, generar informes) van a recorrer de forma automática.

!!! example "De la información al script"
    Un script típico de mantenimiento recorre `/var/log`, busca las líneas que contienen "error" o "fail", y genera un informe agregado. Ese script, ejecutado manualmente, ya aporta valor; ejecutado cada noche mediante `cron`, se convierte en una tarea automatizada que documenta por sí sola el estado del sistema sin que nadie tenga que acordarse de lanzarlo.

## 3. Planificación de tareas en GNU/Linux: cron, crontab y at

El mecanismo de planificación por excelencia en Linux es el demonio **`crond`** (criterio b): se activa en el arranque del sistema, lee las tareas de cada usuario en `/var/spool/cron/crontabs`, construye una lista ordenada por tiempos y comprueba cada minuto si toca ejecutar alguna.

### Gestión del crontab de usuario

```bash
crontab -e          # editar el crontab del usuario actual
crontab -l           # listar las tareas programadas
crontab -r           # borrar todas las tareas del usuario
crontab -u usuario   # actuar sobre el crontab de otro usuario (requiere permisos)
```

También existe un crontab global en `/etc/crontab`, gestionado por el superusuario, en el que se puede indicar el usuario con el que se ejecuta cada tarea.

### Sintaxis de una entrada crontab

![Sintaxis de una entrada crontab: minuto, hora, día del mes, mes, día de la semana y comando](../assets/img/add/ut03-crontab-sintaxis.svg)

```
m h dom mon dow  comando
```

| Campo | Rango | Significado |
|---|---|---|
| `m` | 0-59 | Minuto |
| `h` | 0-23 | Hora |
| `dom` | 1-31 | Día del mes |
| `mon` | 1-12 | Mes |
| `dow` | 0-7 (0 y 7 = domingo) | Día de la semana |
| `comando` | ruta absoluta | Programa o script a ejecutar; `cron` no analiza su contenido, solo lo pasa a la shell |

Operadores admitidos en cada campo:

- `*`: cualquier valor.
- `,`: lista de valores (`1,15,30`).
- `-`: rango (`1-5`).
- `/`: intervalo (`*/15`, cada 15 unidades).
- Nombres abreviados de día/mes (`Mon`, `Tue`, `Jan`, `Feb`).
- `#`: comentario, la línea se ignora.
- `@`: atajos habituales, como `@reboot` (al arrancar el sistema).

!!! example "Ejemplo comentado"
    ```
    */15 2 * * 1-5  /scripts/backup_home.sh
    ```
    Cada 15 minutos, entre las 2:00 y las 2:59, de lunes a viernes, ejecuta el script de copia de seguridad de `/home`.

### El comando `at`: tareas puntuales

Frente a `cron` (tareas repetitivas), **`at`** programa una única ejecución futura de una orden, útil para apagar el sistema a una hora concreta o lanzar una copia puntual. La tarea queda en una cola y se ejecuta aunque la sesión se cierre.

```bash
at 23:00                # abre el prompt de at para introducir el/los comando(s)
atq                      # lista los trabajos pendientes
atrm <número>            # elimina un trabajo por su identificador
```

### `anacron`: garantizar la ejecución si el equipo estuvo apagado

Si el sistema está apagado en el momento en que `cron` debía ejecutar una tarea, esa ejecución se pierde. **`anacron`** resuelve este problema revisando, en el siguiente arranque, qué tareas periódicas (`daily`, `weekly`, `monthly`; no admite `hourly`) no se han ejecutado en el plazo previsto, y lanzándolas en cuanto es posible.

- Configuración: `/etc/anacrontab`.
- Marca de tiempo por tarea: `/var/spool/anacron`.
- Variables declaradas: `SHELL`, `PATH`, `HOME`, `LOGNAME`.

Cada línea de `/etc/anacrontab` define: **periodo** (`@daily`, `@weekly`, `@monthly` o un número de días), **retraso en minutos** (evita que todas las tareas se disparen a la vez tras el arranque), **nombre único de la tarea** (sin `/`, usado para el fichero de marca de tiempo) y **la tarea** a ejecutar.

| Mecanismo | Tipo de ejecución | Si el equipo está apagado |
|---|---|---|
| `cron` | Repetitiva, a intervalos exactos | La ejecución se pierde |
| `anacron` | Repetitiva (daily/weekly/monthly) | Se ejecuta en el siguiente arranque |
| `at` | Puntual, una sola vez | La ejecución se pierde (salvo que el sistema esté encendido a esa hora) |

## 4. El Programador de tareas de Windows (Task Scheduler)

El equivalente funcional de `cron` en Windows es el **Programador de tareas**, accesible tanto en modo gráfico como por PowerShell (criterios b, f y g). Una tarea se configura en cuatro bloques:

![Arquitectura del Programador de tareas de Windows: General, Desencadenadores, Acciones y Condiciones/Configuración](../assets/img/add/ut03-programador-tareas.svg)

| Bloque | Contenido |
|---|---|
| **General** | Nombre, descripción, usuario de ejecución, opción de ejecutar con o sin sesión iniciada, nivel de privilegios |
| **Desencadenadores** | Cuándo se activa: programación por hora/fecha, al iniciar sesión, al iniciar el sistema, al estar inactivo, al producirse un evento, al crear/modificar la tarea, al conectar/desconectar sesión, al bloquear/desbloquear sesión |
| **Acciones** | Qué hace la tarea: iniciar un programa, enviar un correo, mostrar un mensaje |
| **Condiciones** | Restricciones adicionales: inactividad del equipo, estado de energía (portátiles), exigencia de red activa |
| **Configuración** | Ejecutar a petición, ejecutar en cuanto sea posible si se perdió el disparo (equivalente a `anacron`), reintentar tras fallo, detener si tarda demasiado, reglas si la tarea ya estaba en ejecución |

!!! tip "El equivalente de anacron en Windows"
    La opción "ejecutar la tarea lo antes posible si se ha perdido un inicio programado" cumple exactamente la misma función que `anacron` en Linux: evita que una tarea crítica (por ejemplo, una copia de seguridad) se pierda simplemente porque el equipo estaba apagado a la hora prevista.

### Automatización desde PowerShell

Las mismas tareas que se crean gráficamente se pueden gestionar por comandos, lo que facilita documentarlas y reproducirlas (criterio b y h):

```powershell
New-ScheduledTask        # crea la definición de una nueva tarea
Get-ScheduledTask        # lista las tareas programadas existentes
Get-ScheduledTaskInfo    # estado y configuración de una tarea concreta
Set-ScheduledTask        # modifica una tarea ya creada
Enable-ScheduledTask     # habilita una tarea deshabilitada
Disable-ScheduledTask    # deshabilita una tarea sin borrarla
Export-ScheduledTask     # exporta la definición a un archivo XML (documentación)
```

Para crear una tarea completa por script se combinan cinco variables:

```powershell
$action    = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-File C:\scripts\limpieza.ps1"
$trigger   = New-ScheduledTaskTrigger -Daily -At "03:00"
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$settings  = New-ScheduledTaskSettingsSet -StartWhenAvailable -RestartCount 3
$task      = New-ScheduledTask -Action $action -Trigger $trigger -Principal $principal -Settings $settings

Register-ScheduledTask -TaskName "LimpiezaNocturna" -InputObject $task
```

`Export-ScheduledTask` es especialmente útil de cara al criterio h (documentación), porque permite conservar en un XML la definición exacta de cada tarea creada, tanto si se creó por interfaz gráfica como por script.

## 5. Automatización de la administración de cuentas de usuario

El criterio e exige, específicamente, automatizar la administración de cuentas: el alta masiva de usuarios (por ejemplo, todo un grupo-clase) es el caso de uso más habitual, porque hacerlo a mano es lento y propenso a errores de escritura.

![Flujo de automatización de cuentas de usuario: listado de entrada, script de alta, restricciones y documentación](../assets/img/add/ut03-automatizacion-cuentas.svg)

El patrón habitual es: partir de un listado (CSV o texto plano) con un usuario por línea, recorrerlo con un script y dar de alta cada cuenta con los parámetros adecuados.

**En GNU/Linux**, con un bucle sobre un fichero de texto:

```bash
#!/bin/bash
while IFS=';' read -r usuario nombre grupo; do
    useradd -m -c "$nombre" -g "$grupo" "$usuario"
    echo "${usuario}:CambiarAhora1" | chpasswd
    chage -d 0 "$usuario"   # obliga a cambiar la contraseña en el primer inicio de sesión
done < listado_altas.csv
```

**En Windows**, con PowerShell y el módulo de Active Directory (o `New-LocalUser` en local):

```powershell
Import-Csv listado_altas.csv -Delimiter ';' | ForEach-Object {
    New-ADUser -Name $_.nombre -SamAccountName $_.usuario `
        -AccountPassword (ConvertTo-SecureString "CambiarAhora1" -AsPlainText -Force) `
        -ChangePasswordAtLogon $true -Enabled $true -Path "OU=$($_.grupo),DC=instituto,DC=local"
}
```

En ambos casos el script resuelve la parte repetitiva (crear N cuentas idénticas en estructura), pero deja explícitas las restricciones de seguridad, que se tratan en el siguiente apartado.

## 6. Restricciones de seguridad en tareas y cuentas automatizadas

Automatizar sin criterios de seguridad multiplica el daño de un error: un script que se ejecuta cada noche con privilegios de administrador y contiene un fallo puede propagar ese fallo de forma silenciosa durante semanas. El criterio c exige establecer restricciones concretas:

| Ámbito | Restricción recomendada |
|---|---|
| Ejecución de la tarea | Ejecutar con el usuario de menor privilegio posible que la tarea necesite, no siempre `SYSTEM`/`root` |
| Contraseñas iniciales | Contraseña temporal aleatoria, nunca la misma para todo el lote de cuentas |
| Cambio de contraseña | Forzar el cambio en el primer inicio de sesión (`chage -d 0`, `ChangePasswordAtLogon`) |
| Caducidad de cuentas | Establecer fecha de expiración en cuentas temporales (prácticas, becarios, alumnado en prácticas de empresa) |
| Permisos y grupos | Asignar solo los grupos estrictamente necesarios, revisando pertenencias heredadas |
| Scripts con credenciales | No dejar contraseñas en texto plano dentro del script; usar gestores de secretos o variables protegidas |
| Tareas con acceso a red | Restringir la condición "requiere red" a las tareas que realmente la necesiten, para reducir superficie de ataque |
| Registro de la actividad | Toda tarea automatizada debe dejar constancia en un log de qué hizo, cuándo y con qué resultado |

!!! warning "El riesgo de la automatización sin control"
    Un script de limpieza mal probado que borra "todo lo antiguo" en `/home` sin excluir directorios críticos, ejecutado automáticamente cada noche, puede destruir datos durante días antes de que alguien lo note. La regla práctica es: **toda tarea automática debe probarse primero en modo simulación o sobre datos de prueba**, y solo entonces programarse en producción.

## 7. Herramientas gráficas para la planificación de tareas

Los criterios f y g exigen explícitamente instalar, configurar y usar herramientas gráficas de planificación, más allá de la línea de comandos:

| Herramienta | Sistema | Descripción |
|---|---|---|
| **Programador de tareas** | Windows | Interfaz gráfica nativa, ya vista en el apartado 4 |
| **Webmin** | GNU/Linux | Interfaz web de administración; permite programar tareas de forma remota, entre otras muchas funciones de administración |
| **`msinfo32`** | Windows | Información de sistema, no planificación directa, pero complementaria al diagnóstico previo a automatizar |
| **Visor de eventos** | Windows | Permite programar una tarea que se ejecute como respuesta directa a un evento registrado |

**Webmin**, aunque no nace como herramienta de automatización pura, se cita específicamente en el temario porque resulta la interfaz gráfica más versátil disponible en GNU/Linux para gestionar tareas `cron` sin usar la terminal, especialmente útil cuando se administra el servidor de forma remota.

## 8. Monitorización como complemento de la automatización

Automatizar tareas sin supervisarlas es solo la mitad del trabajo: hay que saber si la automatización sigue funcionando. Herramientas como **Nagios**, **Zabbix**, **Prometheus + Grafana** o **Pandora FMS** permiten comprobar en tiempo real si un servicio automatizado (un backup, una sincronización) se ha ejecutado y ha tenido éxito, generando alertas cuando algo falla.

| Herramienta | Plataforma | Enfoque |
|---|---|---|
| Nagios | Multiplataforma (arquitectura de plugins) | Alertas, gráficos, muy personalizable |
| Zabbix | Multiplataforma | Flexible y escalable, incluye Windows |
| Prometheus + Grafana | Linux, contenedores | Métricas + visualización |
| Pandora FMS | Multiplataforma | Supervisión de Windows y Linux |

Estas herramientas cierran el ciclo que abre la automatización: **programar → ejecutar → registrar → supervisar**, de modo que un fallo en una tarea automática se detecta y se corrige antes de que se convierta en un incidente mayor.

## 9. Documentación de las tareas automáticas

El criterio h es, con frecuencia, el que peor se cumple en la práctica: se programa la tarea, funciona, y nadie deja constancia de por qué existe ni de qué hace exactamente. Una ficha mínima de documentación debería recoger:

| Campo | Ejemplo |
|---|---|
| Nombre de la tarea | `CopDifSem-28` |
| Sistema y mecanismo | GNU/Linux, `cron` |
| Disparador | Semanal, lunes 02:00 |
| Acción | Copia de seguridad diferencial de `/home` |
| Usuario de ejecución | `root` (justificado: necesita leer todo `/home`) |
| Restricciones aplicadas | Solo lectura sobre `/home`, escritura restringida a `/bacnombre` |
| Última revisión | Fecha y responsable |
| Ubicación del log | `/var/log/backup.log` |

En Windows, `Export-ScheduledTask` genera automáticamente un XML con la definición completa de la tarea, que puede archivarse como parte de esta documentación sin tener que redactarla a mano desde cero.

## Para profundizar

Esta unidad se ha construido a partir de los apuntes de clase de Administración de Sistemas Operativos y de la práctica **SP31 - Automatización de tareas**, que trabaja sobre PowerShell (Windows Server), Manjaro y Fedora. El resto de enlaces de referencia del módulo está recopilado en la página de [Recursos](99-recursos.md).

##
##
# **🤖 UT03 · Automatización de tareas**

RA3. Gestiona la automatización de tareas del sistema, aplicando criterios de eficiencia y utilizando comandos y herramientas gráficas. Criterios de evaluación:

- Se han descrito las ventajas de la automatización de las tareas repetitivas en el sistema.
- Se han utilizado los comandos del sistema para la planificación de tareas.
- Se han establecido restricciones de seguridad.
- Se han realizado planificaciones de tareas repetitivas o puntuales relacionadas con la administración del sistema.
- Se ha automatizado la administración de cuentas.
- Se han instalado y configurado herramientas gráficas para la planificación de tareas.
- Se han utilizado herramientas gráficas para la planificación de tareas.
- Se han documentado los procesos programados como tareas automáticas.

## Teoría

### Información del sistema

#### Estructura de directorios

Una estructura de directorios es una organización de archivos de manera lógica y eficiente que permite agrupar archivos relacionados y facilita la navegación y administración de la información almacenada en el sistema. Principales características:

- **Directorio raíz**: nivel superior de la jerarquía; todos los demás directorios y archivos están contenidos dentro de él. En sistemas basados en Unix/Linux se representa con el símbolo `/`, mientras que en Windows se suele usar la letra de unidad `C:`.
- **Directorios padres e hijos**: los directorios pueden contener otros directorios, que a su vez pueden contener más directorios y archivos. El que contiene se llama "directorio padre" y el contenido "directorio hijo".
- **Rutas**: especifican la ubicación de un archivo o directorio en la jerarquía. Una ruta absoluta comienza desde el directorio raíz; una ruta relativa se refiere a la ubicación respecto al directorio actual.
- **Directorios especiales**: tienen funciones específicas, por ejemplo `C:\Program Files` en Windows almacena programas instalados, y `/usr/bin` en Unix/Linux contiene archivos ejecutables.
- **Nombres de archivos y directorios**: pueden contener letras, números y caracteres especiales. La mayoría de los sistemas operativos son sensibles a mayúsculas y minúsculas en los nombres.
- **Permisos de acceso**: controlan quién puede acceder, leer, escribir o ejecutar archivos y directorios, ayudando a mantener la seguridad y privacidad de los datos.

**Estructura de directorios en Windows** (organizada en forma de árbol):

- `C:` unidad principal, contiene los directorios principales del sistema operativo y otros programas.
- `C:\Windows`: archivos del sistema operativo, ejecutables, bibliotecas compartidas y otros componentes esenciales.
- `C:\Program Files`: directorio predeterminado para la instalación de programas (con `(x86)` para aplicaciones de 32 bits).
- `C:\Users`: perfiles de usuario, documentos, descargas, imágenes y otros archivos personales.
  - `\Public`: carpeta compartida por todos los usuarios del sistema.
  - `\Default`: carpeta oculta con el perfil base de los nuevos usuarios.
  - `\[NombreUsuario]`: carpetas que definen al usuario.

**FHS (Filesystem Hierarchy Standard)** es un conjunto de estándares que define la estructura de directorios y la organización de archivos en sistemas basados en Unix y Linux. Su objetivo es establecer una estructura coherente y predecible que facilite la portabilidad de software y la administración, evitando la variabilidad que existía entre distribuciones.

Según FHS, los directorios se pueden clasificar según su uso:

- **Compartibles**: se pueden acceder desde distintos equipos (`/home`).
- **No compartibles**: acceso y modificación limitados al administrador del sistema (`/etc`, `/boot`).
- **Variables**: su contenido puede variar sin intervención del administrador (`/var/log/messages`, `/home`).
- **Estáticos**: solo se modifican con intervención del administrador (`/etc/passwd`, `/etc/shadow`, `/usr`, `/opt`, `/etc`, `/boot`).

**Estructura de directorios en GNU/Linux**:

- `/` (raíz): punto de partida de la jerarquía.
- `/bin`: ejecutables esenciales para el funcionamiento básico del sistema.
- `/etc`: archivos de configuración del sistema y de las aplicaciones.
- `/home`: directorio principal de los usuarios.
- `/usr`: recursos compartidos, bibliotecas, encabezados y binarios de programas instalados.
- `/var`: datos variables, registros del sistema, caché y archivos temporales.

**Comparación Windows vs. Linux**:

- *Unidades vs. raíz única*: Windows separa el almacenamiento en unidades (`C:`, `D:`); Linux organiza todo bajo una única raíz (`/`).
- *Nomenclatura*: Windows es insensible a mayúsculas/minúsculas; Linux es sensible.
- *Organización de programas*: en Windows se instalan en `C:\Program Files` (o `(x86)`); en Linux, en varios directorios bajo `/usr`.
- *Directorio de usuario*: `C:\Users` en Windows, `/home` en Linux.
- *Directorios del sistema*: Linux tiene una jerarquía más coherente, lo que facilita la administración.

#### Búsqueda de información del sistema

La búsqueda de información del sistema es fundamental para entender cómo funciona o está configurado, optimizarlo o resolver problemas. Algunas formas de obtenerla:

- Órdenes de línea de comandos o herramientas gráficas del sistema o de terceros (`CPU-Z`, `Speccy`, `HardInfo`).
- **Gestión de tareas y monitoreo**: en Linux, `top`, `htop` o `glances` para monitorear recursos en tiempo real; en Windows, el Administrador de tareas.
- **Archivos de registro y configuración**: en Linux, `/var/log` para eventos y `/etc` para configuración; en Windows, el Visor de eventos (Event Viewer).
- **Herramientas de diagnóstico**: en Linux, `lshw`, `lscpu`, `lsusb`, `lspci` y `dmidecode`; en Windows, el Solucionador de problemas de hardware y dispositivos.

**Órdenes en Windows**:

- `systeminfo`: información amplia del sistema.
- `wmic`: información detallada sobre hardware y software.
- `findstr /?` (símbolo del sistema).
- `Get-EventLog` (PowerShell).

**Órdenes en GNU/Linux**:

- `uname`: información sobre el kernel.
- `lsb_release`: detalles de la distribución.
- Directorio `/proc`.
- Directorio `/var/log`.

**`systeminfo`** (Windows) es una herramienta de línea de comandos que muestra una amplia gama de datos sobre hardware, software, configuración y otros aspectos del sistema operativo. Como la salida puede ser extensa, se puede redirigir a un archivo:

```powershell
systeminfo > misistema.txt
```

**`wmic`** ofrece información detallada sobre diversos aspectos del sistema. Ejemplos:

```powershell
wmic os get               # información del sistema operativo instalado
wmic cpu get               # detalles de la CPU
wmic diskdrive get         # unidades de disco
wmic memorychip get        # módulos de memoria
wmic process list          # procesos en ejecución
wmic service list          # servicios instalados
wmic product get           # programas instalados
wmic useraccount list      # cuentas de usuario
```

**`findstr`** es una herramienta de búsqueda de texto en línea de comandos que permite buscar patrones en archivos o en la salida de otros comandos:

```powershell
findstr "patrón" archivo
```

**`Get-EventLog`** (PowerShell) recupera información de los registros de eventos del sistema, que contienen detalles sobre eventos, errores, advertencias y actividades del sistema operativo y las aplicaciones.

**`uname`** (Linux) muestra información sobre el sistema y el kernel. Opciones principales:

| Opción | Descripción |
| --- | --- |
| `-a` | Muestra toda la información disponible |
| `-s` | Nombre del sistema operativo |
| `-n` | Nombre del nodo o máquina |
| `-r` | Versión del kernel |
| `-v` | Información adicional del kernel |
| `-m` | Tipo de hardware |
| `-p` | Nombre del procesador |
| `-i` | Nombre del hardware de la plataforma |

**`lsb_release`** muestra información sobre la distribución de Linux y su versión:

| Opción | Descripción |
| --- | --- |
| `-a` | Toda la información disponible |
| `-i` | ID de la distribución |
| `-d` | Descripción de la distribución |
| `-r` | Versión de la distribución |
| `-c` | Código de nombre de la distribución |
| `-s` | Solo el resultado específico |

**`/proc`** es un directorio especial que proporciona una interfaz virtual para acceder a información sobre procesos y recursos del sistema en tiempo real; en realidad es una interfaz para interactuar con el kernel:

- `/proc/cpuinfo`: velocidad de reloj, arquitectura y núcleos de la CPU.
- `/proc/meminfo`: uso de memoria física y virtual.
- `/proc/version`: versión del kernel.
- `/proc/<ID>/status`: estado y recursos de un proceso concreto.
- `/proc/sys`: ajustes y parámetros del kernel en tiempo real.

**`/var/log`** contiene subdirectorios y archivos de registro con información sobre eventos, actividades y errores del sistema, aplicaciones y servicios. Depende de dos demonios principales:

- **`journald`**: parte de systemd, gestiona el registro de eventos almacenando logs en formato binario; en sistemas modernos ha reducido el uso de `klogd`.
- **`rsyslog`/`syslog`**: gestiona el registro de eventos y escribe logs en texto plano en `/var/log`, a menudo junto con `journald`.

Logs más importantes:

- `/var/log/syslog` o `/var/log/messages`: mensajes generales del sistema y del kernel.
- `/var/log/auth.log`: registros de autenticación e inicios de sesión (críticos para seguridad).
- `/var/log/dmesg`: mensajes del kernel, especialmente de inicialización de hardware (comando `dmesg`).
- `/var/log/daemon.log`: registros de los demonios en segundo plano.
- `/var/log/kern.log`: registros específicos del kernel generados por `klogd`.
- `/var/log/journal/`: registros binarios de `journald` (si se usa systemd).

#### Herramientas gráficas del sistema

**Windows**: `msinfo32`, Visor de eventos, Monitor de rendimiento (`perfmon`), información de logs/registros.

**GNU/Linux**: `gnome-system-log`, Visor de registros, `sysstat`, `inxi`.

**`msinfo32`** proporciona una interfaz gráfica para acceder a información detallada sobre hardware, software y configuración del sistema. Puede usarse en modo gráfico, en modo texto, o como comando generando un informe (report), incluso limitado a ciertas características. La información se organiza en:

- **Resumen del sistema**: versión del SO, nombre del equipo, fabricante y modelo, versión de BIOS, memoria instalada, etc.
- **Recursos de hardware**: asignaciones del sistema agrupadas por tipo de recurso.
- **Componentes**: información de cada componente, incluida la versión del controlador.
- **Entorno de software**: configuración del sistema, controladores, variables de entorno, programas de arranque automático, servicios, conexiones de red, etc.

**Visor de eventos** permite visualizar y analizar eventos, registros y mensajes generados por el sistema operativo, aplicaciones y servicios; útil para monitorear y diagnosticar problemas. Permite:

- Guardar filtros de eventos como vistas personalizadas reutilizables.
- Programar una tarea que se ejecute como respuesta a un evento.
- Crear y administrar suscripciones a eventos.

Los eventos se organizan en Registros de Windows:

- **Aplicación**: eventos de aplicaciones y servicios que no forman parte del sistema operativo.
- **Seguridad**: eventos relacionados con la seguridad del sistema.
- **Instalación**: instalación de roles y características en Windows.
- **Sistema**: eventos del sistema operativo.
- **Eventos reenviados**: información reenviada por otros sistemas de la red.

**Monitor de rendimiento (`perfmon`)** permite controlar el rendimiento del equipo y extraer estadísticas e informes, para:

- Comprobar y observar cargas de trabajo y uso de recursos propios y compartidos, planificando futuras actualizaciones.
- Observar cambios de las cargas de trabajo al incrementar o disminuir el uso de recursos.
- Comprobar cambios de configuración en los servicios administrados.
- Diagnosticar problemas en los componentes para su análisis y optimización.

**Logs y registros en Windows** son cruciales para el monitoreo y diagnóstico, capturando errores, advertencias, actualizaciones y actividades de seguridad. Tipos más comunes:

- **Logs del sistema**: problemas con drivers o fallos en componentes críticos.
- **Logs de seguridad**: inicios de sesión o intentos fallidos.
- **Logs de aplicaciones**: eventos del software instalado.

Se guardan en ubicaciones específicas como `C:\Windows\Logs`, donde destaca el directorio **CBS** (Component-Based Servicing), usado por el componente que gestiona actualizaciones y mantenimiento, esencial para diagnosticar problemas de actualizaciones de Windows.

**`gnome-system-log`** (GNOME) permite revisar en tiempo real los eventos y mensajes del sistema operativo, servicios y aplicaciones (arranque, errores de red, fallos del kernel).

**Visor de Registros** ofrece una interfaz gráfica para ver y analizar registros del sistema y aplicaciones, ideal para quienes prefieren no usar la terminal. Categorías:

- **Sistema**: problemas de hardware o errores del kernel.
- **Seguridad**: intentos de inicio de sesión, cambios de permisos, etc.
- **Aplicaciones**: eventos y errores de aplicaciones instaladas.
- **Hardware**: registros de controladores y hardware detectado.
- **Logs de arranque**: eventos del proceso de arranque.

**`sysstat`** es un conjunto de herramientas que recopila y muestra información de rendimiento del sistema:

- `sar`: informes de actividad del sistema (CPU, memoria, disco, red, etc.).
- `iostat`: estadísticas de entrada/salida (uso de disco y rendimiento).
- `mpstat`: estadísticas de uso de CPU por núcleo/procesador.
- `pidstat`: estadísticas de CPU, memoria y E/S por proceso.
- `nfsiostat`: estadísticas específicas de NFS.

**`inxi`** proporciona información detallada sobre el sistema y su hardware:

| Opción | Descripción |
| --- | --- |
| `-A` | Tarjeta de sonido |
| `-C` | Procesador (CPU) |
| `-D` | Discos duros |
| `-F` | Información completa del sistema |
| `-G` | Tarjeta gráfica |
| `-I` | Información general (actualizaciones, tiempo de actividad) |
| `-N` | Interfaces de red |
| `-S` | Información básica (nombre, kernel, uptime, etc.) |
| `-l` | Particiones |

#### Sistema de archivos virtual

Un **sistema de archivos virtual (VFS)** es una capa de abstracción que permite a los sistemas operativos manejar diferentes tipos de sistemas de archivos de manera uniforme, sin que la aplicación conozca las peculiaridades de cada uno. Características:

- **Abstracción**: interfaz común para interactuar con varios sistemas de archivos.
- **Compatibilidad**: soporte de múltiples tipos (NTFS, FAT, ext3, ext4, entre otros).
- **Montaje**: permite "montar" distintos sistemas de archivos en un mismo punto de acceso.
- **Eficiencia**: mejora la gestión de operaciones de E/S.
- **Flexibilidad**: permite crear sistemas de archivos personalizados sin afectar el sistema operativo subyacente.

Casos de uso: sistemas operativos modernos, sistemas distribuidos, y contenedores/virtualización.

**Principales sistemas de archivos**:

- **FAT / FAT32**: simple y muy compatible, usado en almacenamiento portátil (USB, tarjetas SD); FAT32 limita archivos a 4 GB.
- **exFAT**: supera las limitaciones de FAT32 (archivos hasta 16 exabytes, volúmenes hasta 128 petabytes); ideal para archivos multimedia grandes y multiplataforma (Windows/macOS).
- **NTFS**: sistema principal en Windows moderno, soporta compresión, cifrado y permisos; archivos hasta 16 TB y volúmenes hasta 256 TB, con robusto registro de transacciones.
- **ext2/ext3/ext4**: usado en Linux; ext2 sin journaling, ext3 añade journaling, ext4 mejora rendimiento y capacidad (hasta 16 TB).
- **HFS+**: de Apple, optimizado para macOS, soporta grandes volúmenes y journaling.
- **APFS**: el más reciente de Apple, optimizado para SSD, con instantáneas, copias de seguridad rápidas y cifrado nativo.
- **XFS**: alto rendimiento, journaling y operaciones paralelas.
- **Btrfs**: copia en escritura (COW), instantáneas y verificación de integridad mediante checksums.
- **ZFS**: alta escalabilidad, instantáneas, replicación y robusta integridad de datos (FreeBSD, Linux).
- **ReFS**: de Microsoft, mejora integridad y confiabilidad en almacenamiento a gran escala; checksums y auto-reparación; soporta volúmenes de hasta 35 PB, optimizado para Hyper-V.
- **NFS**: protocolo de sistema de archivos distribuido para acceder a archivos en un servidor remoto.
- **Samba**: interoperabilidad entre Unix/Linux y Windows, traduciendo solicitudes de acceso a archivos.
- **FUSE**: permite crear sistemas de archivos en espacio de usuario sin modificar el kernel.
- **Ceph**: sistema de almacenamiento distribuido en clúster, escalable y con replicación/autorreparación para objetos, bloques y archivos.

#### Software instalado

**`winget`** es el gestor de paquetes preinstalado en Windows, que evita tener que descargar e instalar software individualmente desde múltiples sitios web.

**Chocolatey** es una herramienta de administración de paquetes de terceros para Windows (no viene preinstalada) que facilita instalar, desinstalar y actualizar software mediante el "Chocolatey Community Repository". Requiere privilegios de administrador. Comandos principales:

```powershell
choco install paquete    # instala un paquete
choco upgrade paquete    # actualiza a la última versión
choco uninstall paquete  # desinstala un paquete
choco list               # lista los paquetes instalados
choco search paquete     # busca un paquete en el repositorio
```

Más información: [chocolatey.org](https://chocolatey.org/)

**Instalación en Linux**: se realiza mediante paquetes, conjuntos de programas con nombre, descripción, versión, distribuidor, checksum y dependencias. Formatos según distribución:

- `.deb`: Debian y derivadas (Ubuntu).
- `.rpm`: distribuciones basadas en RedHat (Fedora, Mandriva, Suse).
- `.package`: autoejecutables, independientes de distribución y entorno de escritorio.

Los paquetes se almacenan en **repositorios**, gestionados en Debian/Ubuntu mediante `apt` y en otras distribuciones mediante gestores como `dnf`.

En Ubuntu, los repositorios se almacenan en el fichero que usa `apt`:

```
/etc/apt/sources.list
```

Editar este fichero requiere privilegios de superusuario; una edición errónea puede dejar el sistema inestable o inoperante. Estructura de una entrada:

- `deb`: tipo de repositorio (Debian y derivados).
- URL del repositorio (por ejemplo `http://es.archive.ubuntu.com/ubuntu`).
- Nombre en clave de la versión (p. ej. `jammy` para Ubuntu 20.04).
- Etiquetas: `main` (mantenido por Canonical), `universe` (comunidad), `restricted` (controladores privativos), `multiverse` (software privativo).

**Comandos de instalación en Linux**: `apt`, `apt-cache`, `apt-get`, `dpkg`, paquetes comprimidos `.tar` y scripts `.sh`, `wget`.

**`apt-cache`** se usa para búsquedas de paquetería y estadísticas de la caché:

```bash
apt-cache showpkg paquete   # información del paquete
apt-cache stats             # estadísticas de la caché
apt-cache unmet             # dependencias no satisfechas
apt-cache show paquete      # todas las versiones del paquete
apt-cache search regexp     # búsqueda en el repositorio (admite regex)
apt-cache depends paquete   # dependencias del paquete
```

**`apt-get`** gestiona la instalación, desinstalación y actualización de paquetes. Se recomienda actualizar antes de instalar:

```bash
apt-get update    # actualiza los listados de repositorios
apt-get upgrade   # actualiza los paquetes instalados
```

Opciones: `-d` (solo descarga), `-f` (arregla dependencias rotas), `-q`/`-qq` (salida silenciosa), `-s` (simulación), `-y` (responde sí a todo), `-b` (descarga fuente y compila), `--no-upgrade`.

Acciones: `dist-upgrade` (actualización total resolviendo dependencias), `install`, `remove`, `--purge` (elimina también ficheros de configuración), `check`, `clean` (borra el repositorio local descargado), `autoclean` (borra solo paquetes obsoletos/inservibles), `autoremove` (elimina dependencias automáticas ya no usadas).

**`dpkg`** gestiona paquetería (instalar, desinstalar, consultar) pero **no gestiona dependencias**. Secuencia habitual:

```bash
dpkg --info paquete.deb   # ver dependencias del paquete descargado
dpkg -i paquete.deb       # instalar el paquete
```

Opciones: `-i` (instalar), `--configure` (reconfigurar), `-r` (borra sin eliminar configuración), `-P`/`--purge` (borra con configuración), `-p` (info de un paquete instalado), `-I` (info de un paquete no instalado), `-V` (verifica integridad), `-L` (lista ficheros), `status` (estado del paquete).

Si faltan dependencias al instalar con `dpkg`, el paquete queda sin configurar. Soluciones:

- **Opción A**: descargar manualmente las dependencias e instalarlas con `dpkg`.
- **Opción B**: ejecutar `apt-get install -f` para forzar la descarga e instalación de dependencias.
- **Opción C**: instalar antes las dependencias con `sudo apt install dependencia1 dependencia2 dependencia3`.

**Paquetes comprimidos descargados de la web**: se descomprimen, se ejecuta el script de instalación (`setup.sh`) en modo superusuario, y para desinstalar se busca `uninstall.sh` en el directorio de instalación:

```bash
sh setup.sh
sh uninstall.sh
```

Tipos de compresión: `.tar`, `.tar.gz`, `.zip`, `.gz`. Para descomprimir `.tar.gz`:

```bash
tar -zxvf fichero.tar.gz
```

- `-z`: comprimido con gzip.
- `-j`: comprimido con bz2.
- `-x`: extrae el contenido.
- `-v`: muestra el contenido mientras extrae.
- `-f`: indica que el siguiente argumento es el fichero a descomprimir.

**`wget`** es una herramienta gratuita de línea de comandos para descargar archivos de Internet mediante HTTP, HTTPS y FTP. Puede reanudar descargas interrumpidas, y al no ser interactiva puede usarse en scripts, trabajos cron y en segundo plano sin que el usuario esté conectado.

### Automatización del sistema

#### Automatización de tareas

Automatizar consiste en realizar acciones y procesos automáticamente, sin intervención humana constante, mejorando la eficiencia y consistencia en la administración y el mantenimiento del sistema. Es importante planificar y probar cuidadosamente la automatización para evitar problemas. Principales objetivos:

- **Eficiencia**: optimizar procesos y reducir el tiempo de tareas manuales.
- **Consistencia**: garantizar que las tareas se realicen de manera uniforme, minimizando errores humanos.
- **Ahorro de tiempo**: liberar tiempo para tareas más estratégicas.
- **Mejora de la calidad**: reducir errores y mejorar la calidad de las operaciones automatizadas.
- **Agilidad**: responder rápidamente a demandas cambiantes.

**Características de las tareas candidatas a automatizar**:

- **Repetitividad**: tareas que se repiten y pueden programarse en momentos específicos o intervalos regulares (revisión antivirus semanal, comprobación de errores de disco mensual, apagado de servidores semanal, auditorías mensuales, tareas de arranque, copias de seguridad, sincronización horaria, etc.).
- **Requisitos de tiempo**: tareas que deben realizarse en momentos específicos o plazos estrictos (por ejemplo, envío de un correo a una hora y fecha determinada).
- **Predictibilidad**: tareas con un conjunto predecible de pasos y decisiones, con reglas claras.
- **Respuesta a un evento**: envío de correo al administrador ante un evento, ejecución de un programa al iniciar sesión un usuario determinado, apagado de un servicio ante una alerta de rendimiento, etc.

Formas de automatización:

- **Scripts**: automatizan copias/respaldo de archivos, gestión de usuarios y permisos, y programación de tareas.
- **Tareas programadas**: ejecución automática en momentos específicos o intervalos regulares (respaldos nocturnos, actualizaciones automáticas).
- **Automatización de instalación**: archivos de respuesta predefinidos para configurar e instalar aplicaciones sin intervención manual.
- **Administración remota**: automatizar tareas en múltiples sistemas desde una ubicación central.
- **Automatización de actualizaciones**: descarga e instalación automática de parches de seguridad.
- **Tareas de mantenimiento**: desfragmentación de discos, limpieza de temporales, etc.
- **Arranque y apagado**: inicio y apagado automático según horarios predefinidos.
- **Copias de seguridad**: automatización mediante scripts y herramientas de respaldo.

#### Automatización de tareas con Windows

El **Programador de tareas (Task Scheduler)** permite programar la ejecución automática de programas, scripts y comandos en momentos específicos o intervalos regulares. Configuración de una tarea:

- **General**: nombre descriptivo, descripción, usuario bajo el que se ejecuta, opción de ejecutar sin sesión iniciada, y privilegios.
- **Desencadenadores**: cuándo y cómo se activa la tarea (nuevo, editar, eliminar). Tipos:
  - Según una programación (hora/fecha, con o sin repetición).
  - Al iniciar la sesión (cualquier usuario o uno específico).
  - Al iniciar el sistema (sin necesidad de inicio de sesión).
  - Al estar inactivo (la definición de "inactivo" se ajusta en "condiciones").
  - Al producirse un evento (asociable desde esta interfaz o desde el Visor de eventos).
  - Al crear o modificar la tarea.
  - Al conectarse/desconectarse de una sesión (local o remota).
  - Al bloquearse/desbloquearse la sesión de trabajo (solo local).
- **Acciones**: qué hace la tarea al activarse (iniciar un programa, enviar un correo, mostrar un mensaje, entre otros); se pueden agregar, editar o eliminar.
- **Condiciones**: restricciones adicionales de ejecución:
  - *Inactivo*: el equipo sin uso durante cierto tiempo, con opción de detener la tarea si el equipo se empieza a usar.
  - *Energía*: opciones para equipos portátiles.
  - *Red*: exige una interfaz de red activa.
- **Configuración**: opciones adicionales:
  - Permitir ejecutar la tarea a petición.
  - Ejecutarla lo antes posible si no hubo inicio programado (equivalente a `anacron` en GNU/Linux).
  - Reiniciar la tarea tras un fallo, tras un tiempo o número de intentos.
  - Detener la tarea si tarda demasiado en ejecutarse.
  - Detener la tarea si no finaliza cuando se solicite (matar el proceso).
  - Reglas si la tarea ya estaba en ejecución al lanzarse de nuevo.

**Cmdlets de PowerShell para tareas programadas**:

```powershell
Disable-ScheduledTask       # deshabilita una tarea programada
Enable-ScheduledTask        # habilita una tarea previamente deshabilitada
Export-ScheduledTask        # exporta una tarea a un archivo XML
Get-ScheduledTask           # información sobre las tareas programadas
Get-ScheduledTaskInfo       # información sobre configuración/estado de una tarea concreta
New-ScheduledTask           # crea una nueva tarea programada
Set-ScheduledTask           # configura opciones de una tarea programada
```

Variables habituales al crear una tarea por script: `$action` (acción a ejecutar), `$trigger` (desencadenante), `$principal` (credenciales de ejecución), `$Settings` (configuración de la tarea) y `$task` (creación de la tarea con las variables anteriores, para después registrarla en el sistema).

#### Automatización de tareas con GNU/Linux

- **Demonio `crond`**: se activa en el arranque del sistema y busca en `/var/spool/cron/crontabs` las tareas programadas de cada usuario. Crea una lista ordenada por tiempos y revisa cada minuto si toca ejecutar alguna. Cada usuario crea sus tareas con `crontab -e`.
- **Demonio `anacrond`**: si el sistema estaba apagado en el momento de una tarea, ésta no se ejecuta con `cron`; `anacrond` revisa las tareas marcadas como asíncronas y las ejecuta lo antes posible (en el siguiente arranque posterior al momento previsto). Útil para tareas críticas que de otro modo no se realizarían.
- **Comando `at`**: plantea una única ejecución de una tarea en el futuro ("tarea aplazada").
- **Interfaz gráfica**: la más versátil es **webmin**, que permite incluso programar tareas a través de la red.

**El archivo `cron`/`crontab`** programa tareas que se ejecutan automáticamente en momentos específicos o a intervalos regulares. Comandos:

```bash
crontab -e          # editar el archivo
crontab -l          # listar las tareas del usuario actual
crontab -r          # borrar las tareas del usuario
crontab -u usuario  # trabajar con las tareas de un usuario concreto
```

También existe un crontab global, normalmente en `/etc/crontab`, administrado por el superusuario, donde se pueden programar tareas para cualquier usuario especificando su nombre.

**Sintaxis de una entrada crontab**:

```
m h dom mon dow  comando
```

- `m`: minuto (0-59).
- `h`: hora (0-23).
- `dom`: día del mes (1-31).
- `mon`: mes (1-12).
- `dow`: día de la semana (0-7, donde 0 es domingo, o `sun`-`sat`).
- `comando`: el comando o script a ejecutar (ruta absoluta); crontab no analiza su contenido, solo lo envía a la shell.

Opciones de configuración en crontab:

- `*`: cualquier valor.
- Números: valores específicos.
- `,`: separa varios valores (`1,15,30`).
- `-`: define rangos (`1-5`).
- `/`: especifica intervalos (`*/15`).
- Nombres abreviados para día de la semana y mes (`Mon`, `Tue`, `Jan`, `Feb`).
- `#`: comentarios (la línea se ignora).
- `?`: "no se aplica" en día de la semana o día del mes.
- `@`: palabras clave para configuraciones comunes, por ejemplo `@reboot` para ejecutar al reiniciar el sistema.

**`anacron`** ejecuta tareas perdidas por inactividad o apagado del sistema en el momento programado:

- Archivo de configuración: `/etc/anacrontab`.
- Atiende tareas `daily`, `weekly` o `monthly`; no atiende trabajos `hourly`.
- Mantiene archivos con marcas de tiempo en `/var/spool/anacron`.

Variables declaradas en `/etc/anacrontab`: `SHELL` (intérprete de comandos), `PATH` (ruta de ejecutables), `HOME` (directorio predeterminado), `LOGNAME` (usuario que ejecuta las tareas).

Cada línea de `/etc/anacrontab` define una tarea con:

1. **Periodo de ejecución**: frecuencia (`@daily`, `@weekly`, `@monthly` o valores numéricos como 1, 7, etc.).
2. **Retraso en minutos**: espera tras ejecutar anacron, para evitar avalanchas de tareas al arrancar.
3. **Nombre de la tarea**: único, sin `/`; se usa para el archivo de marca de tiempo en `/var/spool/anacron`.
4. **La tarea a realizar**.

Ejemplo de comprobación práctica de `anacron`:

1. Crear un script que haga una copia de seguridad diaria de los directorios personales de los usuarios estándar (`/home`), permitiendo volver a una versión concreta en caso de fallo del sistema.
2. Añadir la tarea al archivo `/etc/anacrontab` y reiniciar el equipo.
3. Comprobar el resultado: revisar el directorio de copias de seguridad y los archivos de marcas de tiempo.

**Comando `at`** programa la ejecución de una o varias órdenes una sola vez en un momento futuro. A diferencia de `cron` (tareas repetitivas), `at` se usa para una ejecución puntual (apagar el sistema a una hora, enviar un correo, hacer una copia puntual). La tarea se almacena en una cola y se ejecuta a la hora indicada aunque se cierre la sesión.

```bash
atq     # enumera los trabajos pendientes
atrm    # borra un trabajo por su número
```

**Webmin** es una interfaz web de administración para sistemas Unix y Linux que permite gestionar y configurar diversos aspectos del sistema gráficamente. Aunque no está diseñada específicamente como herramienta de automatización, ofrece características que ayudan en la administración y automatización de tareas.

#### Gestión de la información del sistema

La gestión de la información del sistema es parte fundamental de la administración de sistemas informáticos: implica recopilación, seguimiento y análisis de datos sobre rendimiento, salud y estado del sistema operativo y hardware, permitiendo tomar decisiones informadas, identificar problemas potenciales y mantener el sistema óptimo. Áreas clave: recopilación de datos, monitorización del rendimiento, gestión de eventos y registros, análisis de tendencias, alertas y notificaciones, automatización de tareas, diagnóstico y resolución de problemas, planificación de capacidad, seguridad, auditoría y cumplimiento.

Objetivos:

- **Identificar y solucionar problemas** antes de que afecten a los usuarios finales.
- **Optimizar el rendimiento**, detectando cuellos de botella.
- **Mantener la disponibilidad**, evitando fallas graves que interrumpan el sistema.
- **Planificar recursos** (almacenamiento, memoria, ancho de banda) para evitar problemas de capacidad.

**Windows Server – Monitor de rendimiento**: controla el rendimiento del equipo y extrae estadísticas e informes sobre cargas de trabajo, uso de recursos, cambios de configuración de servicios y problemas en componentes.

**Windows Server – Monitor de confiabilidad**: recopila datos de eventos del sistema, mensajes de error, instalaciones y actualizaciones, generando un gráfico de estabilidad general en una escala de 1 a 10. Permite ver eventos específicos (fallas de aplicaciones, pantallas azules) con detalles como el programa/componente asociado, fecha, hora y acciones recomendadas.

**Herramientas de monitoreo en tiempo real (Windows)**:

- **Network Inventory Advisor**: herramienta comercial para recopilar inventario de sistemas Windows en red.
- **Nagios**: código abierto, recopila y analiza datos de sistemas y aplicaciones en tiempo real.
- **Zabbix**: código abierto, flexible y escalable, para monitorear una amplia gama de sistemas, incluido Windows.
- **Pandora FMS**: código abierto, incluye supervisión de Windows, flexible y escalable.

**Herramientas en GNU/Linux**:

- `ps`, `pstree`, `top`, `htop`: gestión de procesos.
- Herramientas Sysstat.
- `free`, `pmap`, `vmstat`: acerca de la memoria.
- `w`, `who`: acerca de los usuarios.
- `du`, `df`, `hdparm`: información sobre almacenamiento.
- `hardinfo`, `lshw`, `hwinfo`, `lspci`: información del hardware.

**Sysstat** incluye:

- `iostat`: estadísticas de CPU y E/S de dispositivos.
- `mpstat`: rendimiento de cada procesador.
- `pidstat`: estadísticas de procesos/tareas (CPU, memoria, etc.).
- `sar`: guarda e informa detalles de CPU, memoria, E/S, red, kernel, etc.
- `sadf`: exporta los datos de `sar` en distintos formatos (XML, CSV...).

**`nmon`** ofrece información detallada sobre CPU, memoria, disco, red y otros recursos en tiempo real, en consola o guardable en archivo:

- Monitorización en tiempo real.
- Soporte multiplataforma (AIX, Solaris y otros Unix/Linux).
- Visualización gráfica y textual.
- Grabación para seguimiento y detección de patrones a lo largo del tiempo.
- Interfaz intuitiva y accesible.

**Herramientas de monitoreo en tiempo real (GNU/Linux)**:

- **Prometheus**: métricas y visualización, escalable, se integra fácilmente con otras herramientas.
- **Grafana**: visualización de métricas, fácil de usar y con amplias funciones gráficas.
- **Netdata**: monitoreo de rendimiento completo en tiempo real, simple y de bajo impacto.
- **Landscape**: centrado en el monitoreo de sistemas GNU/Linux, fácil de usar.

#### Nagios Core

Para instalar Nagios Core en Ubuntu Server, primero se actualiza el servidor y se instalan las dependencias necesarias. Nagios Core utiliza una arquitectura basada en **plugins**: los usuarios pueden escribir sus propios plugins para componentes personalizados o usar los de la comunidad para componentes populares. Ofrece notificaciones de alerta, gráficos y estadísticas, y una interfaz web para la gestión del sistema; es altamente personalizable y escalable, adecuado desde pequeñas empresas hasta grandes corporaciones.

Pasos generales de instalación (Ubuntu Server):

1. Actualizar los repositorios e instalar las dependencias necesarias (entre ellas Apache y PHP); comprobar en la web oficial la última versión disponible.
2. Configurar Nagios usando Apache como servidor web de la aplicación.
3. Compilar la aplicación; crear un usuario y grupo `nagios`, incluyendo al usuario en el grupo de Apache `www-data`; ejecutar la instalación y los scripts de arranque de Nagios.
4. Instalar los ficheros de configuración de Apache, habilitar los módulos `rewrite` y `CGI`, reiniciar el servicio y permitir el acceso a la web de Nagios.
5. Habilitar el servicio y acceder desde el navegador.
6. Buscar la última versión estable de los **plugins de Nagios** en la web oficial, descargar e instalar sus dependencias.
7. Descargar, descomprimir y compilar la última versión de los plugins.
8. Comprobar en el servidor y en Nagios que todos los plugins están cargados (el demonio debe estar en ejecución).
9. Para monitorizar una máquina Windows, agregarla modificando los ficheros `windows.cfg` y `nagios.cfg`.
10. Reiniciar/recargar Nagios para aplicar la nueva configuración.

> Enlace de descarga oficial usado en la práctica: `https://go.nagios.org/l/975333/2024-10-24/6rmmv`

## Actividades y prácticas

### Práctica

**SP31 Automatización de tareas.**

**Windows Server – PowerShell**:

1. Crear un script **`nombresp31-1lis`** que muestre un menú con 3 opciones: mostrar un listado de los eventos del sistema; mostrar un listado de los errores del sistema surgidos en el último mes; mostrar un listado de los problemas de aplicaciones de esta semana (warning). Se debe adjuntar captura del código y de los distintos listados; si no hay datos, forzar acciones y explicarlas para garantizar al menos un resultado.
2. Crear un script **`nombresp31-3eve`** con un menú (salir con `0`) que muestre los diferentes tipos de registros de eventos del sistema (cada tipo con un número asignado) y liste los 12 últimos registros del tipo elegido.
3. Crear un script **`nombresp31-3ses`** que, recibiendo por parámetros una fecha de inicio y una de fin, muestre un listado de todos los inicios de sesión (excepto los del usuario `system`) realizados entre esas fechas, con día, hora y usuario (mínimo 7 registros).
4. Crear 4 tareas programadas (las 2 primeras gráficamente y las 2 siguientes por CLI):
   - **`nombreT1`**: limpieza del escritorio al iniciar (elimina iconos y archivos).
   - **`nombreT2`**: elección libre, explicando sus beneficios para el sistema.
   - **`nombreT3`**: al iniciar sesión, 1 minuto después se inicia PowerShell ISE.
   - **`nombreT4`**: elección libre, explicando sus beneficios para el sistema.
   
   Todas las tareas deben mostrarse creadas de la misma forma en que se crearon.

**GNU/Linux**:

5. Crear un script **`nombresp31-7log`** en **Manjaro** que recorra todos los archivos de `/var/log`, filtre las líneas con las palabras clave "error" o "fail", y genere un nuevo archivo con los resultados, indicando claramente de qué archivo original proviene cada sección de errores encontrados.
6. Crear un script **`nombresp31-7pro`** que elimine los programas listados en un archivo de texto plano `programas.txt` (situado en el mismo directorio que el script), donde cada línea contiene el nombre de un programa reconocido por el sistema.
7. Crear dos carpetas dependientes del directorio raíz: **`bacnombre`** (destino de las copias de seguridad) y **`scrnombre`** (destino de los scripts). Las copias de seguridad se realizan del directorio `/home`:
   - Con **`cron`**, tarea programada semanal para copia de seguridad diferencial con el nombre `CopDifSem-(N.º semana del año)`.
   - Con **`anacron`**, tarea programada mensual que limpie únicamente las copias diferenciales del directorio.
   - Con **`anacron`**, tarea programada mensual para copia de seguridad total con el nombre `CopTot-(mes completo y año completo)`.
8. Comprobar la configuración anterior forzando un cambio de fechas por CLI para que se ejecuten los scripts (explicarlo), mostrar el directorio de copias en formato largo con al menos 3 copias de seguridad, y mostrar el archivo de marcas de tiempo para comprobar los `anacron`.

**Monitorización**:

9. Instalar la herramienta de monitorización **Zabbix** (última versión), explicando todo el procedimiento con capturas (incluyendo enlaces a soluciones si hay errores). Agregar un cliente y mostrar el dashboard de monitorización con una explicación de 250 palabras de lo observado.
10. Elaborar un manual paso a paso de instalación de **Ganglia** en un sistema Ubuntu, detallando comandos y configuraciones. Acceder al dashboard de Ganglia y redactar una explicación de al menos 250 palabras sobre la información mostrada, cómo interpretar las métricas principales y cómo utilizarlas para analizar el rendimiento del sistema.

> Recursos: contenidos de la unidad, máquinas virtuales base y conexión a internet. Los scripts deben entregarse con captura del código comentado, captura de su ejecución y enlace al repositorio de GitHub (el último commit debe ser anterior a la fecha límite de entrega). Entrega en PDF a través del Campus.

### Recuperación

**Recuperación UT03 - RA3.**

**Preguntas teóricas**:

1. Definir los dos demonios principales del sistema de logs, indicando en qué directorio guarda cada uno los logs generados.
2. Explicar qué se entiende por **trigger** (desencadenante) en la automatización de tareas, con tres ejemplos.

**Preguntas prácticas — Windows Server**:

3. Mostrar un listado de los *warnings* del sistema surgidos en el último mes; si no hay ninguno, forzar uno y volver a listar (debe aparecer al menos uno).
4. Crear una vista personalizada llamada **`Vnombre`** que muestre todas las advertencias generadas en el registro de Windows del mes en curso, con captura de la configuración y del resultado (forzando advertencias si no las hay).
5. Crear gráficamente una tarea programada **`Tnombre`** de elección libre en el servidor, explicando por qué se eligió y en qué beneficia al sistema.
6. Crear una tarea programada en PowerShell **`TPnombre`**, distinta de la anterior, explicando igualmente su elección y beneficio.

**Preguntas prácticas — Fedora**:

Crear dos carpetas dependientes del directorio raíz, **`bacnombre`** y **`scrnombre`**, como destino de scripts y copias de seguridad respectivamente, realizadas sobre el directorio `/home`:

7. Con **`cron`**, tarea programada semanal para copia de seguridad diferencial con el nombre `CopDifSem-(N.º semana del año)`.
8. Con **`anacron`**, tarea programada mensual que limpie únicamente las copias diferenciales del directorio.
9. Con **`anacron`**, tarea programada mensual para copia de seguridad total con el nombre `CopTot-(mes completo y año completo)`.
10. Forzar un cambio de fechas por CLI para que se ejecuten los scripts anteriores (explicarlo), mostrar el directorio de copias en formato largo con al menos 3 copias de seguridad, y mostrar el archivo de marcas de tiempo para comprobar los `anacron`.

> Recursos: máquinas virtuales base. Entrega en PDF a través del Campus.
