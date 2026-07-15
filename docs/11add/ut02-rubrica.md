# **📋 UT02 · Rúbrica de evaluación**

Rúbrica de comprobación de la práctica *Planificación de procesos y gestión con línea de comandos en Windows y Linux*. Para cada uno de los 10 apartados obligatorios se comprueban **4 elementos**: cada elemento se marca como presente (Sí) o ausente (No). No hay términos medios: o la evidencia está en la entrega, o no lo está.

### Apartado 1 · Planificación por prioridad expropiativo

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se presenta el diagrama de Gantt completo de la planificación | | |
| 2 | Se muestra la cola de listos en cada instante relevante | | |
| 3 | Se respeta correctamente la expropiación ante la llegada de procesos de mayor prioridad | | |
| 4 | Se calculan los tiempos de espera y de retorno de cada proceso | | |

### Apartado 2 · Planificación por SRT (Shortest Remaining Time)

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se presenta el diagrama de Gantt completo de la planificación SRT | | |
| 2 | Se muestra la cola de listos en cada instante relevante | | |
| 3 | Se respeta correctamente la expropiación por menor tiempo restante | | |
| 4 | Se compara, con datos, el resultado frente al algoritmo de prioridad del apartado 1 | | |

### Apartado 3 · Programas de inicio de sesión en Windows

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se muestra el número total de programas de inicio | | |
| 2 | Se muestra el listado completo con nombre y ubicación | | |
| 3 | Se indica el comando o cmdlet de PowerShell utilizado | | |
| 4 | La captura o salida se corresponde con el equipo utilizado | | |

### Apartado 4 · Gestión de procesos por consumo de memoria en Windows

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se listan correctamente los 10 procesos que menos memoria consumen | | |
| 2 | El proceso de mayor PID se elimina en una única línea de comando | | |
| 3 | Se repite el listado tras la eliminación para comprobar el resultado | | |
| 4 | Los tres pasos quedan documentados por separado y en orden | | |

### Apartado 5 · Agrupación de procesos y servicios en Windows

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Los procesos se agrupan por nombre en columnas nombre/número | | |
| 2 | El resultado está ordenado por número de instancias y limitado a 5 grupos | | |
| 3 | Se cuentan y muestran los servicios relacionados con "datos" | | |
| 4 | El filtro incluye correctamente solo los servicios activos | | |

### Apartado 6 · PID, jerarquía y prioridad en GNU/Linux

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se explica correctamente qué es el PID y la diferencia entre `a e` y `x` | | |
| 2 | Se indica el número de trabajo y el PID de `gparted` en segundo plano | | |
| 3 | Se cambia la prioridad a la más alta posible con `top` (con evidencia) | | |
| 4 | Se cambia la prioridad a la más baja posible con `htop` (con evidencia) | | |

### Apartado 7 · Nice, PRI y prioridad de procesos

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se explica qué es el valor nice y su rango | | |
| 2 | Se indica quién puede modificar el nice y con qué restricciones | | |
| 3 | Se explica la diferencia entre nice y PRI | | |
| 4 | Se listan correctamente los procesos con prioridad mayor que la normal | | |

### Apartado 8 · Procesos huérfanos y zombis con `pstree`

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se obtiene el PID del proceso principal filtrando la salida de `pstree` | | |
| 2 | Se obtienen los PID de los procesos padres y de los hijos ordenados por PID | | |
| 3 | Se provoca y se identifica un proceso huérfano | | |
| 4 | Se provoca y se identifica un proceso zombi | | |

### Apartado 9 · Primer/segundo plano, señales y servicios en Ubuntu Server

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se muestran 5 procesos en segundo plano explicando `+` y `-` | | |
| 2 | Se pasa a primer plano y se detiene el tercer proceso correctamente | | |
| 3 | Se gestiona mediante señales un proceso de larga duración (detener y terminar) | | |
| 4 | El script de menú de servicios `systemd` funciona para todas las opciones pedidas | | |

### Apartado 10 · Arranque, logs y seguridad ante procesos no identificados

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se documenta correctamente la secuencia de arranque con `systemctl`/`journalctl` | | |
| 2 | El script en Bash calcula correctamente los registros por nivel de severidad | | |
| 3 | El script valida los datos de entrada (fecha) | | |
| 4 | Se incluye un checklist de seguridad ante procesos no identificados | | |

## Calificación

Cada elemento marcado "Sí" suma un punto (máximo 40 puntos). La calificación sobre 10 se obtiene dividiendo el total entre 4. Para superar la unidad es necesario alcanzar al menos 20 de los 40 elementos y tener, como mínimo, 2 de los 4 elementos marcados en cada uno de los 10 apartados (ningún apartado puede quedar completamente vacío).
