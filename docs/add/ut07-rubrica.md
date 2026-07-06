# **📋 UT07 · Rúbrica de evaluación**

Rúbrica de comprobación de la práctica *Automatización de la administración de cuentas y servicios mediante scripts*. Para cada uno de los 10 apartados obligatorios se comprueban **4 elementos**: cada elemento se marca como presente (Sí) o ausente (No). No hay términos medios: o la evidencia está en la entrega, o no lo está.

### Apartado 1 · Script de alta de usuarios en Bash

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | `altas.sh` lee correctamente el fichero de usuarios pasado como parámetro | | |
| 2 | Cada línea del fichero da de alta una cuenta con `useradd` | | |
| 3 | Si el login ya existe, se registra el error en `altaerror.log` con fecha y hora | | |
| 4 | El script continúa procesando el resto del fichero tras un error | | |

### Apartado 2 · Script de baja de usuarios en Bash

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | `bajas.sh` lee correctamente el fichero de logins pasado como parámetro | | |
| 2 | Cada login se elimina con `userdel -r` | | |
| 3 | Si el login no existe, se registra el error en `bajaerror.log` sin detener el script | | |
| 4 | El formato del log de errores es coherente con el del apartado 1 | | |

### Apartado 3 · Depuración dirigida de los scripts de cuentas

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se documenta un error sintáctico detectado con `bash -n` | | |
| 2 | Se documenta un error de ejecución detectado con `bash -x` | | |
| 3 | Ambos errores quedan corregidos en la versión final del script | | |
| 4 | Se añaden `set -e` y `set -u` a la versión final | | |

### Apartado 4 · Script equivalente de altas y bajas en PowerShell

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | `altas.ps1` importa el CSV y crea usuarios con `New-ADUser`/`New-LocalUser` | | |
| 2 | `bajas.ps1` elimina usuarios con `Remove-ADUser`/`Remove-LocalUser` | | |
| 3 | Los errores se exportan a un CSV mediante `Export-Csv -Append` | | |
| 4 | El comportamiento es funcionalmente equivalente al de los scripts de Bash | | |

### Apartado 5 · Depuración dirigida en PowerShell

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se introduce un error controlado en `altas.ps1` | | |
| 2 | Se coloca un punto de interrupción de línea en VSCode o ISE | | |
| 3 | Se ejecuta el script paso a paso hasta el breakpoint | | |
| 4 | Se documenta con captura el valor de una variable en el punto de pausa | | |

### Apartado 6 · Script de administración de un servicio (Bash)

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | `servicio.sh` implementa las cuatro acciones: start, stop, restart, status | | |
| 2 | El script gestiona correctamente el proceso o servicio elegido | | |
| 3 | Se muestra ayuda al invocar `-h` o `--help` | | |
| 4 | El script informa de un parámetro incorrecto en lugar de fallar sin explicación | | |

### Apartado 7 · Script de administración de un servicio (PowerShell)

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | `servicio.ps1` recibe la acción y el nombre del servicio como parámetros | | |
| 2 | Se implementan Start-Service, Stop-Service, Restart-Service y Get-Service | | |
| 3 | El script es funcionalmente equivalente al de Bash del apartado 6 | | |
| 4 | Se gestionan adecuadamente los parámetros no válidos | | |

### Apartado 8 · Extracción de una librería de funciones

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe `funciones.sh` con al menos dos funciones reutilizables, importado con `source` | | |
| 2 | Existe `Funciones.psm1` con al menos dos funciones reutilizables, importado con `Import-Module` | | |
| 3 | Los scripts de los apartados 1, 2, 6 y 7 usan estas funciones en vez de repetir lógica | | |
| 4 | Las funciones están comentadas y explican su propósito y parámetros | | |

### Apartado 9 · Automatización mediante planificación

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe una entrada de `crontab` que planifica uno de los scripts | | |
| 2 | Existe una tarea planificada equivalente en Windows (`Register-ScheduledTask` o Programador de tareas) | | |
| 3 | Se aporta una captura de la tarea programada activa | | |
| 4 | Se explica el problema real que resolvería esa planificación | | |

### Apartado 10 · Documentación final e implantación cruzada

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Todos los scripts tienen cabecera con autor, propósito, sintaxis y códigos de retorno | | |
| 2 | Todos los scripts responden a una invocación de ayuda | | |
| 3 | Existe una tabla comparativa Bash/PowerShell de al menos 5 filas | | |
| 4 | Se entregan todos los artefactos: scripts, librerías, capturas, logs/CSV e informe final | | |

## Calificación

Cada elemento marcado "Sí" suma un punto (máximo 40 puntos). La calificación sobre 10 se obtiene dividiendo el total entre 4. Para superar la unidad es necesario alcanzar al menos 20 de los 40 elementos y tener, como mínimo, 2 de los 4 elementos marcados en cada uno de los 10 apartados (ningún apartado puede quedar completamente vacío).
