# **📋 UT03 · Rúbrica de evaluación**

Rúbrica de comprobación de la práctica *Automatización de tareas de mantenimiento con cron y el Programador de tareas*. Para cada uno de los 10 apartados obligatorios se comprueban **4 elementos**: cada elemento se marca como presente (Sí) o ausente (No). No hay términos medios: o la evidencia está en la entrega, o no lo está.

### Apartado 1 · Diagnóstico previo del sistema

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se ejecutan y documentan `uname -a` y `lsb_release -a` en Linux | | |
| 2 | Se ejecuta y documenta `systeminfo` en Windows | | |
| 3 | Se adjuntan capturas del estado inicial de ambos sistemas | | |
| 4 | Se indican los recursos disponibles (memoria, versión) de cada máquina | | |

### Apartado 2 · Creación de un script de mantenimiento en GNU/Linux

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El script recorre todos los archivos de `/var/log` | | |
| 2 | Filtra correctamente las líneas con "error" o "fail" | | |
| 3 | El informe generado indica de qué archivo original proviene cada bloque | | |
| 4 | Se adjunta captura de una ejecución manual con resultados reales o forzados | | |

### Apartado 3 · Planificación periódica con cron

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existen las carpetas `bacnombre` y `scrnombre` en la raíz | | |
| 2 | La tarea cron está programada con periodicidad semanal | | |
| 3 | El nombre de la copia sigue el formato `CopDifSem-<nº semana>` | | |
| 4 | Se documentan y explican los cinco campos de la entrada crontab | | |

### Apartado 4 · Planificación con anacron y con at

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe una tarea mensual de anacron que limpia copias diferenciales antiguas | | |
| 2 | Existe una tarea mensual de anacron de copia total `CopTot-<mes-año>` | | |
| 3 | Se programa una ejecución puntual con `at` | | |
| 4 | Se explica la diferencia entre cron, anacron y at | | |

### Apartado 5 · Comprobación forzada de las tareas planificadas en Linux

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se fuerza el cambio de fecha por CLI y se documenta el comando usado | | |
| 2 | Se muestra `bacnombre` en formato largo con al menos 3 copias | | |
| 3 | Se muestran los ficheros de marca de tiempo de anacron | | |
| 4 | Se explica por qué el cambio de fecha provoca la ejecución de las tareas | | |

### Apartado 6 · Planificación gráfica con el Programador de tareas de Windows

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se crea gráficamente la tarea de limpieza del escritorio al iniciar sesión | | |
| 2 | Se crea una segunda tarea de elección libre, justificada | | |
| 3 | Se documentan con capturas General, Desencadenadores y Acciones de ambas | | |
| 4 | Se documentan las Condiciones aplicadas a cada tarea | | |

### Apartado 7 · Planificación por PowerShell en Windows

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se usan `New-ScheduledTaskAction`, `New-ScheduledTaskTrigger` y `New-ScheduledTaskPrincipal` | | |
| 2 | Una de las tareas inicia PowerShell ISE un minuto después de iniciar sesión | | |
| 3 | Se adjunta el código completo comentado | | |
| 4 | Se adjunta captura de `Get-ScheduledTask` mostrando ambas tareas registradas | | |

### Apartado 8 · Automatización de la creación de cuentas de usuario

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El script lee el listado CSV de materiales correctamente | | |
| 2 | Se crean automáticamente todas las cuentas del listado | | |
| 3 | Cada cuenta queda asignada a su grupo correspondiente | | |
| 4 | Se verifica el resultado listando cuentas y grupos creados | | |

### Apartado 9 · Restricciones de seguridad aplicadas

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Cada cuenta tiene una contraseña temporal distinta | | |
| 2 | Se obliga a cambiar la contraseña en el primer inicio de sesión | | |
| 3 | Se establece una fecha de caducidad para las cuentas | | |
| 4 | Se justifica por escrito el riesgo que mitiga cada restricción | | |

### Apartado 10 · Documentación final de las tareas automáticas

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe una ficha de documentación por cada tarea (mínimo 6) | | |
| 2 | Cada ficha indica sistema, mecanismo, desencadenador y acción | | |
| 3 | Cada ficha indica el usuario de ejecución y la ubicación del log/evidencia | | |
| 4 | Se adjunta el XML exportado con `Export-ScheduledTask` de al menos una tarea | | |

## Calificación

Cada elemento marcado "Sí" suma un punto (máximo 40 puntos). La calificación sobre 10 se obtiene dividiendo el total entre 4. Para superar la unidad es necesario alcanzar al menos 20 de los 40 elementos y tener, como mínimo, 2 de los 4 elementos marcados en cada uno de los 10 apartados (ningún apartado puede quedar completamente vacío).
