# **📋 UT03 · Rúbrica de evaluación**

Rúbrica de comprobación de la práctica *Automatización de tareas de mantenimiento*. Para cada uno de los 5 apartados se comprueban **2 elementos**: cada elemento se marca como presente (Sí) o ausente (No). No hay términos medios: o la evidencia está en la entrega, o no lo está.

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

<!--
APARTADOS OCULTOS (6-14): no se evalúan en esta versión del supuesto.

### Apartado 6 · Diagnóstico previo del sistema

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | En Linux se documentan `uname -a`, `lsb_release -a` y `/proc/meminfo` | | |
| 2 | En Windows se documentan `systeminfo` y `Get-CimInstance Win32_OperatingSystem` (o `wmic os get`) | | |

### Apartado 7 · Planificación periódica con cron

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Con `crontab -e` se programa la copia diferencial semanal `CopDifSem-<nº semana>` en `bacnombre` | | |
| 2 | Se documentan y explican los cinco campos de la entrada crontab | | |

### Apartado 8 · Planificación con anacron y con at

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | En `/etc/anacrontab` hay dos tareas mensuales: limpieza de diferenciales y copia total `CopTot-<mes-año>` | | |
| 2 | Se programa una ejecución puntual con `at` y se explica la diferencia entre cron, anacron y at | | |

### Apartado 9 · Comprobación forzada de las tareas planificadas en Linux

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se cambia la fecha por CLI (`date -s` / `timedatectl`) y se documenta el comando usado | | |
| 2 | Se muestra `ls -l` de `bacnombre` con al menos 3 copias y las marcas de tiempo de `/var/spool/anacron` | | |

### Apartado 10 · Planificación gráfica con el Programador de tareas de Windows

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se crean gráficamente la tarea de limpieza del escritorio y una tarea libre, con el desencadenador justificado | | |
| 2 | Se documentan con capturas las pestañas General, Desencadenadores, Acciones y Condiciones de ambas | | |

### Apartado 11 · Planificación por PowerShell en Windows

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se usan `New-ScheduledTaskAction`, `New-ScheduledTaskTrigger`, `New-ScheduledTaskPrincipal` y `Register-ScheduledTask`, y una tarea inicia PowerShell ISE con un minuto de retardo | | |
| 2 | Se adjunta el código comentado y captura de `Get-ScheduledTask` con ambas tareas registradas | | |

### Apartado 12 · Automatización de la creación de cuentas de usuario

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El script lee el CSV y crea todas las cuentas en su grupo (`useradd`/`chpasswd` o `New-LocalUser`/`New-ADUser`) | | |
| 2 | Se verifica el resultado listando las cuentas creadas y sus grupos | | |

### Apartado 13 · Restricciones de seguridad aplicadas

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Cada cuenta tiene contraseña temporal distinta y cambio obligatorio en el primer inicio (`chage -d 0` / `-ChangePasswordAtLogon`) | | |
| 2 | Se establece la caducidad de las cuentas y se justifica el riesgo que mitiga cada restricción | | |

### Apartado 14 · Documentación final de las tareas automáticas

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Hay una ficha por tarea (mínimo 6) con sistema, mecanismo, desencadenador, acción, usuario y evidencia | | |
| 2 | Se adjunta el XML exportado con `Export-ScheduledTask` de al menos una tarea | | |

-->

## Calificación

Cada elemento marcado "Sí" suma un punto (máximo 10 puntos), que es directamente la calificación sobre 10. Para superar la unidad es necesario alcanzar al menos 5 de los 10 elementos y tener, como mínimo, 1 de los 2 elementos marcados en cada uno de los 5 apartados (ningún apartado puede quedar completamente vacío).
