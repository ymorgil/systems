# **🧪 UT03 · Práctica: automatización de tareas de mantenimiento con cron y el Programador de tareas**

## Objetivo

Diseñar, programar y documentar un conjunto de tareas de mantenimiento automatizadas en un entorno mixto GNU/Linux + Windows Server, aplicando los mecanismos vistos en el temario: scripts de mantenimiento, planificación periódica con `cron`/`anacron`, planificación puntual con `at`, el Programador de tareas de Windows (gráfico y por PowerShell), automatización de la creación de cuentas de usuario y las restricciones de seguridad asociadas a toda esa automatización. La práctica se estructura en **10 apartados obligatorios**, que cubren de forma conjunta los ocho criterios de evaluación de la UT (a-h).

## Materiales

- Una máquina virtual GNU/Linux (Manjaro o Fedora) con acceso a terminal y privilegios de superusuario.
- Una máquina virtual con Windows Server, con PowerShell y el Programador de tareas disponibles.
- Un editor de texto y acceso a un repositorio (GitHub o similar) para entregar los scripts.
- Un listado de al menos 5 usuarios ficticios en formato CSV (`usuario;nombre;grupo`) para la automatización de cuentas.

## Estructura obligatoria de la práctica

### 1. Diagnóstico previo del sistema

Antes de automatizar nada, recopila información base de ambos sistemas: en Linux, ejecuta `uname -a`, `lsb_release -a` y revisa `/proc/meminfo`; en Windows, ejecuta `systeminfo` redirigido a un fichero y `wmic os get`. Documenta con capturas el estado inicial de cada máquina (versión, recursos disponibles) para poder comparar más adelante si alguna tarea automatizada ha modificado el sistema de forma no esperada.

### 2. Creación de un script de mantenimiento en GNU/Linux

Crea un script `mantenimiento.sh` que recorra todos los archivos de `/var/log`, filtre las líneas que contengan las palabras "error" o "fail" (usa `grep` o `awk`), y genere un informe nuevo indicando claramente de qué archivo original proviene cada bloque de líneas encontradas. Prueba el script manualmente antes de programarlo y adjunta una captura de su ejecución con resultados reales (o forzados si no hay errores en los logs).

### 3. Planificación periódica con cron

Crea dos carpetas dependientes de la raíz: `bacnombre` (destino de las copias de seguridad) y `scrnombre` (destino de los scripts). Usando `crontab -e`, programa una tarea **semanal** que realice una copia de seguridad diferencial de `/home` con el nombre `CopDifSem-<nº de semana>`. Documenta la sintaxis exacta de la entrada crontab (los cinco campos de tiempo) y explica qué significa cada campo en tu caso concreto.

### 4. Planificación con anacron y con at

Añade a `/etc/anacrontab` una tarea **mensual** que limpie únicamente las copias diferenciales antiguas del directorio `bacnombre`, y otra tarea **mensual** que realice una copia de seguridad **total** con el nombre `CopTot-<mes y año completos>`. Además, usando el comando `at`, programa una ejecución puntual (una sola vez) de cualquier tarea de mantenimiento a una hora concreta del día siguiente. Explica con tus palabras la diferencia entre `cron` (repetitivo), `anacron` (repetitivo con recuperación tras apagado) y `at` (ejecución única).

### 5. Comprobación forzada de las tareas planificadas en Linux

Fuerza un cambio de fecha del sistema por línea de comandos para provocar la ejecución de los scripts programados en los apartados 3 y 4 (documenta el comando usado y por qué). Muestra el directorio `bacnombre` en formato largo (`ls -l`) con al menos 3 copias de seguridad generadas, y muestra el contenido de los ficheros de marca de tiempo de `anacron` en `/var/spool/anacron` para demostrar que las tareas se registraron correctamente.

### 6. Planificación gráfica con el Programador de tareas de Windows

En el servidor Windows, crea **dos tareas mediante la interfaz gráfica** del Programador de tareas: una que realice la limpieza del escritorio al iniciar sesión (elimina iconos/archivos temporales) y otra de elección libre, justificando en ambos casos qué desencadenador (trigger) se ha elegido y qué beneficio aporta al sistema. Documenta con capturas las pestañas General, Desencadenadores, Acciones y Condiciones de cada tarea creada.

### 7. Planificación por PowerShell en Windows

Crea **dos tareas equivalentes mediante PowerShell**, distintas de las del apartado anterior, usando los cmdlets `New-ScheduledTaskAction`, `New-ScheduledTaskTrigger`, `New-ScheduledTaskPrincipal` y `Register-ScheduledTask`. Una de ellas debe iniciar PowerShell ISE un minuto después de iniciar sesión. Adjunta el código completo comentado y una captura de `Get-ScheduledTask` mostrando que ambas tareas quedan registradas en el sistema.

### 8. Automatización de la creación de cuentas de usuario

A partir del listado CSV de materiales, crea un script (en Linux con `useradd`/`chpasswd`/`chage`, o en Windows con `New-ADUser`/`New-LocalUser` en PowerShell) que dé de alta automáticamente todas las cuentas del listado, asignando cada una a su grupo correspondiente. Verifica el resultado listando las cuentas creadas y sus grupos.

### 9. Restricciones de seguridad aplicadas

Sobre las cuentas creadas en el apartado 8, aplica y documenta al menos tres restricciones de seguridad: contraseña temporal distinta por usuario, obligación de cambiarla en el primer inicio de sesión, y una fecha de caducidad para las cuentas. Redacta un párrafo justificando por qué cada restricción reduce el riesgo de la automatización (por ejemplo, qué pasaría si todas las cuentas compartieran la misma contraseña).

### 10. Documentación final de las tareas automáticas

Elabora una ficha de documentación (tabla) para cada una de las tareas programadas a lo largo de la práctica (mínimo 6 tareas entre Linux y Windows), indicando: nombre, sistema, mecanismo (`cron`/`anacron`/`at`/Task Scheduler/PowerShell), desencadenador, acción, usuario de ejecución y ubicación del log o evidencia de su ejecución. En Windows, adjunta además el XML exportado con `Export-ScheduledTask` de al menos una tarea.

## Entregables

1. Scripts de mantenimiento y de automatización de cuentas (Linux y Windows), comentados.
2. Capturas de la ejecución de cada script y de cada tarea programada (gráfica y por comandos).
3. Ficheros de marca de tiempo de `anacron` y directorio de copias de seguridad (apartado 5).
4. Ficha de documentación de todas las tareas (apartado 10), incluyendo el XML exportado de Windows.
5. Enlace al repositorio con el historial de commits (el último commit debe ser anterior a la fecha límite de entrega).

!!! tip "Antes de programar en producción, simula"
    Prueba siempre primero cada script de forma manual y, si es posible, sobre un directorio o listado de prueba antes de programarlo con `cron`, `anacron` o el Programador de tareas. Un error en un script de limpieza o de alta masiva de usuarios se vuelve mucho más difícil de detectar cuando se ejecuta solo automáticamente, de madrugada y sin supervisión directa.
