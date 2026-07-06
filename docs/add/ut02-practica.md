# **🧪 UT02 · Práctica: planificación de procesos y gestión con línea de comandos en Windows y Linux**

## Objetivo

Aplicar los algoritmos clásicos de planificación de procesos sobre una tabla de ejemplo, y practicar el control y seguimiento de procesos y servicios mediante herramientas gráficas y de línea de comandos, tanto en Windows (PowerShell) como en GNU/Linux (Bash), incluyendo la identificación de procesos huérfanos y zombis y la gestión de prioridades y señales. La práctica se estructura en **10 apartados obligatorios**, alineados con los criterios de evaluación de la UT (estados y ciclo de vida, planificación, hilos, creación/terminación de procesos, registro en el sistema de archivos, herramientas de control, arranque del sistema y seguridad).

## Materiales

- Una máquina virtual Windows (con PowerShell en modo administrador) y una máquina virtual GNU/Linux (Ubuntu Desktop o Server, o Fedora), con acceso a terminal.
- `htop` instalado en la máquina Linux (`apt install htop` o equivalente).
- Un editor de texto para redactar los diagramas de planificación y las respuestas teóricas.
- Carpeta con el nombre del alumnado creada en la raíz del sistema (Windows), para que aparezca en el prompt de PowerShell.

## Estructura obligatoria de la práctica

### 1. Planificación por el algoritmo de prioridad expropiativo

A partir de una tabla de procesos con instante de llegada, prioridad y ráfaga de CPU, planifica su ejecución aplicando el algoritmo de **prioridad expropiativo**. Entrega el diagrama de Gantt resultante y la evolución de la cola de listos en cada instante en que se produce un cambio (llegada de un proceso nuevo o expropiación).

### 2. Planificación por el algoritmo SRT (Shortest Remaining Time)

Sobre la misma tabla de procesos del apartado 1, planifica su ejecución con el algoritmo **SRT expropiativo**. Entrega el diagrama de Gantt y la cola de listos en cada instante relevante, y compara en un breve párrafo los resultados (tiempo medio de espera y de retorno) frente al algoritmo de prioridad del apartado anterior.

### 3. Identificación de programas de inicio de sesión en Windows

Con PowerShell, cuenta y muestra los programas que se ejecutan al iniciar sesión en el equipo. Presenta primero el número total y, a continuación, el listado completo con su nombre y ubicación.

### 4. Gestión de procesos por consumo de memoria en Windows

Detén el proceso de mayor PID entre los 10 procesos que **menos** memoria consumen, en tres pasos: (1) listar esos 10 procesos, (2) eliminar el de mayor PID mediante una única línea de comando, (3) repetir el listado para comprobar el resultado. Documenta cada paso con su salida.

### 5. Agrupación de procesos y servicios en Windows

Muestra los procesos agrupados por nombre (columnas nombre y número de instancias), ordenados por el número de instancias y limitados a los 5 grupos con más procesos. A continuación, cuenta y muestra los servicios relacionados con la palabra **datos** que además estén en estado activo.

### 6. Identificación de PID, jerarquía de procesos y prioridad en GNU/Linux

En una máquina GNU/Linux: explica qué es el PID de un proceso y qué diferencia hay entre las opciones `a e` y `x` de `ps`, con un ejemplo y una captura. A continuación, ejecuta `gparted` en segundo plano, indica su número de trabajo y su PID, y cambia su prioridad a la más alta posible usando `top` y a la más baja posible usando `htop`, documentando cada cambio con capturas.

### 7. Nice, PRI y prioridad de procesos

Explica qué es el número **nice** de un proceso, qué rango de valores admite, quién puede modificarlo y en qué se diferencia de **PRI**. A continuación, cuenta y lista los procesos del sistema que tienen una prioridad mayor que la normal, usando el comando o herramienta que consideres más adecuada.

### 8. Procesos huérfanos y zombis: identificación con `pstree`

Ejecuta `gparted` (o cualquier aplicación gráfica disponible) en segundo plano y, mediante `pstree`, obtén: el PID del proceso filtrando el resultado, los PID de sus procesos padres, los PID de sus procesos hijos ordenados por PID, y el número total de procesos hijos del proceso principal. Adicionalmente, provoca de forma controlada un proceso huérfano (lanzando un proceso hijo y terminando su padre) y un proceso zombi (un proceso que termina sin que su padre recoja su estado con `wait()`), identifica ambos con `ps` y explica cómo los reconocerías en una salida real.

### 9. Primer y segundo plano, señales y servicios en Ubuntu Server

En un equipo Ubuntu Server: muestra una lista de 5 procesos en segundo plano (explicando el significado de los símbolos `+` y `-`), pasa a primer plano el tercero de la lista y detenlo; a continuación, lanza un proceso de larga duración (por ejemplo `sleep 600`) en segundo plano, detenlo mediante señales y comprueba el resultado, y termínalo de forma inmediata sin pasarlo a primer plano. Finalmente, escribe un script con un menú de opciones (`loaded`, `active`, `inactive`, `dead`, `running`) que liste los servicios `systemd` que cumplen la condición elegida.

### 10. Secuencia de arranque, registro de logs y seguridad ante procesos no identificados

Documenta con tus propias palabras la secuencia de arranque de la máquina GNU/Linux utilizada (BIOS/UEFI, cargador de arranque, kernel, `systemd` como PID 1, arranque de servicios y entorno de usuario), apoyándote en `systemctl list-units` y en `journalctl -b`. Escribe además un script en Bash que reciba año, mes y día por parámetro y devuelva el número de registros de error por cada nivel de severidad de `journald` (emergencia, alerta, crítico, error, advertencia, aviso, información, depuración) ocurridos desde esa fecha hasta la actual, validando los datos de entrada. Cierra el apartado con un breve checklist de seguridad: qué comprobarías si detectas, en cualquiera de las dos máquinas, un proceso que no reconoces.

## Entregables

1. Diagramas de Gantt y colas de listos de los apartados 1 y 2, con la comparación de tiempos medios.
2. Capturas de PowerShell de los apartados 3, 4 y 5, con los comandos utilizados junto a cada resultado.
3. Capturas de terminal GNU/Linux de los apartados 6 a 9, incluyendo la salida de `pstree`, `top`/`htop` y el script de servicios.
4. Script en Bash del apartado 10, junto con su salida de ejemplo y el checklist de seguridad redactado.
5. Documento único en PDF con todos los apartados numerados del 1 al 10, entregado a través del campus virtual.

!!! tip "Antes de entregar"
    Repasa que cada uno de los 10 apartados tenga, al menos, una captura o evidencia y el comando exacto ejecutado (no solo la descripción de lo que "habría que hacer"). Si trabajas en PowerShell, comprueba que el prompt muestra la carpeta con tu nombre, tal y como se pide en el apartado 3; si trabajas en Linux, verifica que las capturas de `pstree`, `top` y `htop` sean legibles y correspondan realmente al proceso indicado en el enunciado (`gparted` u otra aplicación equivalente).
