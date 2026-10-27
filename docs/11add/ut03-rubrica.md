# **📋 UT03 · Rúbrica de evaluación**

Rúbrica de comprobación de la práctica *Automatización de tareas de mantenimiento*. Para cada uno de los 10 apartados se comprueban **2 elementos**: cada elemento se marca como presente (Sí) o ausente (No). No hay términos medios: o la evidencia está en la entrega, o no lo está.

### Apartado 1 · Vista personalizada de advertencias en el Visor de eventos

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | La vista `nombrewarning` filtra los niveles Advertencia y Error de los últimos 30 días en los registros de Windows | | |
| 2 | Se adjunta captura de la vista con al menos un evento (forzado con `eventcreate` u otro método si era necesario) | | |

### Apartado 2 · Script de inicios de sesión entre dos fechas

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El script recibe las dos fechas con `param()` y filtra el registro Seguridad (ID 4624) con `Get-WinEvent`, excluyendo a SYSTEM | | |
| 2 | Se adjunta captura con al menos 7 registros que muestran día, hora y usuario | | |

### Apartado 3 · Script con menú de registros de eventos

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El menú se genera dinámicamente (`Get-EventLog -List` / `Get-WinEvent -ListLog`), numera cada tipo y sale con 0 | | |
| 2 | Al elegir un tipo muestra el número total de eventos y los 12 últimos registros (captura con al menos dos tipos) | | |

### Apartado 4 · Script de desinstalación de programas desde un listado

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El script lee `programas.txt` de su propio directorio y desinstala cada programa (`apt purge`/`apt remove`), avisando si no está instalado | | |
| 2 | Se adjuntan capturas del fichero, de la ejecución y de la comprobación antes/después (`dpkg -l`) | | |

### Apartado 5 · Creación de un script de mantenimiento en GNU/Linux

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El script recorre `/var/log` y filtra las líneas con "error" o "fail" (`grep`/`awk`) | | |
| 2 | El informe indica el archivo de origen de cada bloque y se adjunta captura de una ejecución manual | | |

### Apartado 6 · Programación de tareas en Windows Server

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se crea una tarea con la interfaz gráfica y otra solo con PowerShell (`New-ScheduledTaskAction`, `New-ScheduledTaskTrigger`, `Register-ScheduledTask`), ambas justificadas | | |
| 2 | Se muestra el estado *Ready* de la tarea gráfica en el Programador de tareas y el de la otra con `Get-ScheduledTask` | | |

### Apartado 7 · Monitorización del espacio en disco con cron

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El script usa `df` y registra fecha, hora, partición y porcentaje cuando se supera el 80 % | | |
| 2 | La entrada de `crontab -e` es correcta (`*/15 8-14 * * 1-5` o equivalente), se explican sus campos y se muestran líneas nuevas en el registro | | |

### Apartado 8 · Copias de seguridad con cron y anacron

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existen `/bacnombre` y `/scrnombre`; `crontab` hace la diferencial semanal `CopDifSem-$(date +%V)` y `/etc/anacrontab` tiene la limpieza mensual de diferenciales y la total `CopTot-$(date +%B-%Y)` | | |
| 2 | Se fuerza el cambio de fecha por CLI (`date -s`) explicándolo, y se muestran `ls -l` de `/bacnombre` con al menos 3 copias y las marcas de `/var/spool/anacron` | | |

### Apartado 9 · Sincronización de copias con rsync y un temporizador de systemd

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El script usa `rsync -a --delete` hacia `/bacnombre/espejo`; el `.service` lo ejecuta y el `.timer` (`OnCalendar=*-*-* 22:00:00`) está habilitado y aparece en `systemctl list-timers` | | |
| 2 | Se lanza el servicio (`systemctl start`) dos veces: la segunda solo transfiere cambios y refleja los borrados, y las ejecuciones aparecen en `journalctl` | | |

### Apartado 10 · Prueba de estrés y monitorización con sysstat

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | `sysstat` está activo y se lanza una prueba de estrés (`stress`/`stress-ng`) de al menos 5 minutos | | |
| 2 | Se genera un JSON válido con CPU y memoria del periodo (`sadf -j` u otro método) y se interpretan los datos | | |

## Calificación

Cada elemento marcado "Sí" suma un punto (máximo 20 puntos). La calificación sobre 10 se obtiene dividiendo el total entre 2. Para superar la unidad es necesario alcanzar al menos 10 de los 20 elementos y tener, como mínimo, 1 de los 2 elementos marcados en cada uno de los 10 apartados (ningún apartado puede quedar completamente vacío).
