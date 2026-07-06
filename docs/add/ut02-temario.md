# **⚙️ UT02 · Procesos del sistema**

![Ciclo de vida de un proceso: nuevo, listo, ejecución, bloqueado y terminado](../assets/img/add/ut02-diagrama.svg)

## Resultado de aprendizaje y criterios de evaluación

**RA2.** Administra procesos del sistema describiéndolos y aplicando criterios de seguridad y eficiencia.

Criterios de evaluación:

a) Se han descrito el concepto de proceso del sistema, tipos, estados y ciclo de vida.
b) Se han utilizado interrupciones y excepciones para describir los eventos internos del procesador.
c) Se ha diferenciado entre proceso, hilo y trabajo.
d) Se han realizado tareas de creación, manipulación y terminación de procesos.
e) Se ha utilizado el sistema de archivos como medio lógico para el registro e identificación de los procesos del sistema.
f) Se han utilizado herramientas gráficas y comandos para el control y seguimiento de los procesos del sistema.
g) Se ha comprobado la secuencia de arranque del sistema, los procesos implicados y la relación entre ellos.
h) Se han tomado medidas de seguridad ante la aparición de procesos no identificados.
i) Se han documentado los procesos habituales del sistema, su función y relación entre ellos.

## 1. Qué es un proceso y por qué el sistema operativo lo necesita

Un **proceso** es un programa en ejecución, junto con todo lo que necesita para llevar a cabo su tarea: tiempo de CPU, un espacio de memoria propio, archivos abiertos y acceso a dispositivos de entrada/salida. La distinción entre "programa" y "proceso" es la primera idea que hay que fijar (criterio a): un programa es un fichero pasivo en disco (código y datos); un proceso es ese mismo programa cargado en memoria, con un estado, un contador de programa y unos recursos asignados por el sistema operativo. Un mismo programa puede dar lugar a varios procesos simultáneos —por ejemplo, dos ventanas de un editor de texto abiertas a la vez— cada uno con su propio espacio de memoria y su propio ciclo de vida.

El sistema operativo administra cuatro grandes bloques de recursos: procesos, memoria, ficheros y dispositivos de E/S (a través de sus controladores o *drivers*). Respecto a los procesos en concreto, sus responsabilidades son:

- **Creación y terminación**: asignar los recursos iniciales, establecer el contexto de ejecución y, al finalizar, liberar todo lo que el proceso tenía reservado.
- **Asignación de recursos**: repartir CPU, memoria y dispositivos de forma equitativa y eficiente entre todos los procesos activos.
- **Gestión de estados** y **cambios de contexto**, para que varios procesos puedan compartir una misma CPU sin interferirse.
- **Planificación**: decidir qué proceso se ejecuta a continuación y durante cuánto tiempo.
- **Gestión de prioridades**, tratamiento de interrupciones y excepciones, sincronización y comunicación entre procesos, y protección y seguridad frente a accesos indebidos.

!!! note "Servicio y demonio: procesos sin interacción directa"
    Un **servicio** (en GNU/Linux, **demonio** o *daemon*) es un proceso que se ejecuta en segundo plano de forma continua, normalmente arrancado de forma automática con el sistema, sin que el usuario interactúe con él directamente. Ejemplos habituales: `sshd` (conexiones SSH remotas), `httpd`/`nginx` (servidor web) o `cron`/`systemd-timer` (tareas programadas). Todo servicio es un proceso, pero no todo proceso es un servicio.

### Tipos de procesos

Según su relación con el usuario y con el propio sistema, un proceso puede clasificarse en varias categorías, no necesariamente excluyentes:

| Tipo | Descripción |
|---|---|
| Primer plano (*foreground*) | Ocupa la terminal o recibe entrada directa del usuario hasta que termina. |
| Segundo plano (*background*) | Se ejecuta sin bloquear la interacción del usuario con el resto del sistema. |
| De sistema | Forma parte del propio sistema operativo (gestión de memoria, planificador, etc.). |
| Interactivo | Espera y responde a la entrada de un usuario (una terminal, un editor). |
| Por lotes (*batch*) | Se ejecuta sin intervención humana, procesando un conjunto de trabajos ya preparado. |
| Huérfano | Su proceso padre ha terminado, pero el proceso hijo sigue en ejecución (en Linux es adoptado por `init`/`systemd`, PID 1). |
| Zombi | Ha terminado su ejecución, pero mantiene una entrada en la tabla de procesos porque el padre todavía no ha recogido su código de salida. |

## 2. Interrupciones, excepciones y el bloque de control de proceso

El criterio (b) exige describir los eventos internos del procesador que permiten a un sistema multitarea reaccionar a lo que ocurre a su alrededor sin tener que estar constantemente "preguntando" a cada dispositivo si tiene algo pendiente (una técnica ineficiente conocida como *polling*).

Una **interrupción** es un evento que desvía temporalmente la ejecución normal de la CPU para atender una tarea más urgente. Puede originarse:

- **A nivel de hardware**: un dispositivo (teclado, disco, tarjeta de red) necesita atención inmediata de la CPU.
- **A nivel de software**: un proceso realiza una llamada al sistema (*system call*) para solicitar un servicio del núcleo, como abrir un fichero o reservar memoria.

Una **excepción** es un tipo particular de interrupción, generada por la propia CPU a causa de un error del proceso en ejecución: una instrucción no permitida, una división por cero o un acceso a una dirección de memoria fuera de rango. A diferencia de una interrupción de hardware, la excepción está directamente causada por el código que se está ejecutando en ese instante.

!!! example "Del teclado a la pantalla, en un abrir y cerrar de interrupción"
    Cuando el usuario pulsa una tecla, el controlador de teclado genera una interrupción hardware. La CPU suspende momentáneamente el proceso en ejecución, salta a la rutina de tratamiento de esa interrupción (guardada en la tabla de vectores de interrupción), procesa el carácter recibido y, terminada la rutina, retoma exactamente donde lo había dejado el proceso interrumpido. Todo esto ocurre en microsegundos y de forma transparente para el usuario.

### El bloque de control de proceso (BCP)

Para poder suspender y reanudar procesos sin perder información, el sistema operativo mantiene, por cada proceso, un **bloque de control de proceso (BCP)**: la estructura de datos que almacena su PID, su estado actual, el valor de sus registros de CPU, su prioridad, los punteros a memoria asignada, la lista de ficheros abiertos y demás información necesaria para administrarlo. El BCP es lo que hace posible que un sistema operativo gestione decenas o cientos de procesos de forma concurrente sin confundir el contexto de unos con el de otros.

## 3. Proceso, hilo y trabajo: tres unidades distintas de ejecución

El criterio (c) pide diferenciar tres conceptos que suelen confundirse:

| Concepto | Qué es | Comparte con otros | Ejemplo |
|---|---|---|---|
| **Proceso** | Programa en ejecución con su propio espacio de memoria aislado | Nada por defecto: cada proceso tiene su memoria propia | Un navegador abierto |
| **Hilo (*thread*)** | Subunidad de ejecución dentro de un proceso | Memoria, ficheros abiertos y recursos del proceso al que pertenece | Cada pestaña de Chrome puede ejecutarse como un hilo/proceso independiente |
| **Trabajo (*job*)** | Unidad de trabajo por lotes, formada por uno o varios procesos, sin interacción con el usuario | — | Un script de cierre contable nocturno |

Un **hilo** mantiene su propio contador de programa y su propia pila de ejecución, pero comparte con el resto de hilos del mismo proceso el espacio de memoria, los descriptores de fichero y otros recursos. Esto hace que crear un hilo y cambiar de un hilo a otro sea considerablemente más barato, en tiempo de CPU, que crear un proceso completo o cambiar de un proceso a otro.

**Concurrencia frente a paralelismo.** La concurrencia es la capacidad de un sistema para gestionar varias tareas a la vez, intercalando su ejecución mediante planificación y cambios de contexto, sin que necesariamente se ejecuten de forma simultánea. El paralelismo, en cambio, implica ejecutar realmente varias tareas al mismo tiempo, aprovechando distintos núcleos o procesadores físicos. Un servidor web típico combina ambas técnicas: concurrencia para atender miles de peticiones que llegan casi a la vez, y paralelismo para procesar varias de ellas simultáneamente en distintos núcleos.

Para coordinar esa concurrencia sin que los procesos o hilos interfieran entre sí, el sistema operativo ofrece varios mecanismos:

- **Exclusión mutua**: garantiza que solo un proceso o hilo accede a un recurso compartido (la llamada *sección crítica*) en un instante dado.
- **Sincronización**: semáforos, mutex y monitores, que evitan condiciones de carrera cuando varios procesos comparten un mismo recurso.
- **Comunicación entre procesos (IPC)**: paso de mensajes, tuberías (*pipes*) y sockets, para que procesos distintos puedan intercambiar información de forma controlada.

## 4. Estados y ciclo de vida de un proceso

El criterio (a) pide describir explícitamente los estados y el ciclo de vida de un proceso. Existen varios modelos, según el nivel de detalle que se necesite:

| Modelo | Estados que añade |
|---|---|
| 2 estados | No-ejecutado / Ejecución |
| 3 estados | Se separa "no-ejecutado" en Preparado y Bloqueado (a la espera de un suceso) |
| **5 estados** | Se añaden Nuevo (alta) y Terminado (baja) — el modelo de referencia de esta unidad |
| 7 estados | Se añaden Suspendido-bloqueado y Suspendido-preparado, en memoria secundaria, para liberar RAM (con el coste de la operación de intercambio o *swap*) |

El modelo de **5 estados**, el más habitual como referencia docente, define:

- **Nuevo**: el proceso se está creando; todavía no ha sido admitido por el planificador.
- **Listo**: tiene todos los recursos que necesita salvo la CPU, y compite por ella en la cola de listos.
- **Ejecución**: está usando activamente la CPU en ese instante.
- **Bloqueado**: espera un evento externo (por ejemplo, el resultado de una operación de E/S) y no puede avanzar aunque se le asignara la CPU.
- **Terminado**: ha finalizado su ejecución y libera los recursos que tenía reservados.

Las transiciones entre estos estados no son libres: solo puede pasarse de Listo a Ejecución (mediante el **despacho** del planificador) y de Ejecución a Listo (por expropiación o fin de quantum), de Ejecución a Bloqueado (al solicitar un recurso que no está disponible de inmediato) y de Bloqueado a Listo (cuando el evento esperado ocurre) — nunca directamente de Bloqueado a Ejecución.

![Ciclo de vida de un proceso: nuevo, listo, ejecución, bloqueado y terminado](../assets/img/add/ut02-diagrama.svg)

### El cambio de contexto

El **cambio de contexto** es el mecanismo por el cual el sistema operativo suspende el proceso que está en ejecución (pasándolo a Listo o a Bloqueado) para que otro proceso pueda continuar. Implica, en orden: guardar el estado del proceso saliente en su BCP, seleccionar el siguiente proceso según el algoritmo de planificación, restaurar el estado guardado de ese proceso, actualizar las estructuras internas del sistema y, finalmente, reanudar su ejecución. Un cambio de contexto no es gratuito: consume ciclos de CPU que no se dedican a ningún proceso de usuario, de ahí que un planificador demasiado agresivo (cambios de contexto muy frecuentes) pueda perjudicar el rendimiento global del sistema.

## 5. Planificación de procesos y algoritmos

El **planificador** (*scheduler*) decide qué proceso accede a la CPU y durante cuánto tiempo, siguiendo una de estas dos políticas:

- **No expropiativa** (*non-preemptive*): el proceso mantiene la CPU hasta que la libera voluntariamente (termina o pasa a espera de E/S).
- **Expropiativa** (*preemptive*): el sistema operativo puede retirarle la CPU en cualquier momento, típicamente al agotarse un *quantum* de tiempo o al llegar un proceso de mayor prioridad.

| Algoritmo | Tipo | Idea principal | Limitación |
|---|---|---|---|
| **FCFS** (First Come First Served) | No expropiativo | Se ejecutan en el orden de llegada | Un proceso largo bloquea a todos los que llegan después (*efecto convoy*) |
| **SJF** (Shortest Job First) | No expropiativo | Primero el proceso con menor tiempo de ejecución estimado | No adecuado para sistemas interactivos; requiere estimar la duración de antemano |
| **SRT** (Shortest Remaining Time) | Expropiativo | Variante de SJF: siempre se ejecuta el de menor tiempo restante | Puede provocar inanición de procesos largos |
| **Prioridad** | Ambas variantes | Se ejecuta primero el proceso de mayor prioridad (FCFS como desempate) | Riesgo de inanición de procesos de baja prioridad si no hay envejecimiento |
| **RR** (Round Robin) | Expropiativo | A cada proceso se le asigna un *quantum* fijo; si no termina, vuelve al final de la cola | Un quantum mal elegido (muy corto o muy largo) degrada el rendimiento |
| **Colas multinivel** | Combinado | Varias colas con políticas distintas, para tratar de forma diferenciada procesos interactivos, por lotes o de tiempo real | Mayor complejidad de implementación y ajuste |

![Round Robin: cola circular de procesos con quantum fijo](../assets/img/add/ut02-planificacion.svg)

!!! tip "Cómo abordar un ejercicio de planificación"
    Ante una tabla de procesos con llegada, prioridad y ráfaga de CPU, dibuja siempre un diagrama de Gantt junto con la evolución de la cola de listos en cada instante relevante. En los algoritmos expropiativos (SRT, prioridad expropiativa, RR), presta especial atención al instante exacto de llegada de un nuevo proceso: puede desplazar al que está en ejecución antes de que termine su ráfaga o su quantum.

Windows, las distribuciones GNU/Linux y Android implementan variantes propias de estos algoritmos clásicos combinadas con colas multinivel y prioridades dinámicas (el planificador de Linux, por ejemplo, usa el llamado *Completely Fair Scheduler* o su sucesor EEVDF en núcleos recientes, que reparte el tiempo de CPU tratando de dar a cada proceso una fracción "justa" según su peso/prioridad).

## 6. Secuencia de arranque del sistema

El criterio (g) exige comprobar la secuencia de arranque y los procesos implicados. Desde que se enciende el equipo hasta que aparece el entorno de usuario, ocurren, en orden:

1. **Encendido y POST** (*Power-On Self-Test*): la BIOS o UEFI comprueba que el hardware básico (CPU, memoria, disco) funciona correctamente.
2. **Carga del cargador de arranque**: `bootmgr` en Windows, `GRUB` en la mayoría de distribuciones GNU/Linux; localiza y carga el núcleo del sistema operativo.
3. **Inicialización del núcleo**: `ntoskrnl.exe` en Windows, el kernel Linux en sistemas GNU/Linux; se cargan los módulos y controladores necesarios para reconocer el hardware disponible.
4. **Inicialización de servicios y procesos esenciales**: en Windows arranca `services.exe` (Service Control Manager); en GNU/Linux arranca el **PID 1** (`systemd` en la mayoría de distribuciones actuales), que a su vez lanza el resto de servicios según sus dependencias.
5. **Arranque del entorno de usuario**: gestor de sesión gráfico o consola de acceso, programas de inicio, servicios de red — el sistema queda listo para el usuario.

!!! note "PID 0 y PID 1 en GNU/Linux"
    El **PID 0** corresponde al proceso `idle`/`swapper`, el primero que crea el propio núcleo durante el arranque para ocupar los ciclos de CPU libres; no aparece en la salida de `ps` ni de `top`. El **PID 1** es **systemd** (o `init` en sistemas más antiguos), el primer proceso de espacio de usuario tras la inicialización del kernel: es responsable de arrancar y supervisar todos los demás procesos, y actúa como padre adoptivo de cualquier proceso huérfano.

**systemd** es, en la mayoría de distribuciones modernas, el sistema de inicio y gestor de servicios por defecto. Entre sus características destacan el arranque paralelo de servicios, la gestión unificada mediante `systemctl`, el control de recursos mediante **cgroups**, el registro centralizado con **journald** y el soporte de dependencias explícitas entre unidades.

| Componente de systemd | Función |
|---|---|
| `systemctl` | Iniciar, detener, reiniciar, habilitar y deshabilitar servicios |
| `cgroups` | Agrupar procesos y limitar sus recursos (CPU, memoria, disco) |
| `tmpfiles.d` | Gestionar archivos temporales (limpieza de `/tmp`, permisos, rutas) |
| Unidades (*units*) | Ficheros de configuración en `/etc/systemd/system/`: `.service`, `.socket`, `.mount`, `.timer` |
| `journald` | Almacenar y consultar los logs del sistema (sustituye a `syslog` clásico) |
| `logind` | Gestionar sesiones de usuario: inicio de sesión, suspensión, hibernación, bloqueo de pantalla |

## 7. El sistema de archivos como registro de procesos

El criterio (e) pide utilizar el sistema de archivos como medio lógico para el registro e identificación de procesos. En GNU/Linux esto es literal: el sistema de archivos virtual `/proc` expone, en tiempo real, un directorio numerado por PID (`/proc/1234/`) con información detallada de cada proceso (línea de comandos, estado, mapa de memoria, ficheros abiertos), que es precisamente la fuente de datos que consultan comandos como `ps` o `top`. En Windows, ese "registro" equivalente se materializa en los ficheros de log de servicios y en el propio Visor de eventos, además de la información que expone el Administrador de tareas.

Para consultar el historial y el comportamiento de servicios ya en ejecución, GNU/Linux centraliza los registros con **journald**, que sustituye al tradicional `syslog` y clasifica cada mensaje en siete niveles de prioridad:

| Nivel | N.º | Significado |
|---|---|---|
| `emerg` | 0 | Sistema inutilizable |
| `alert` | 1 | Acción requerida de inmediato |
| `crit` | 2 | Condición crítica |
| `err` | 3 | Condición de error |
| `warning` | 4 | Advertencia |
| `notice` | 5 | Condición normal pero significativa |
| `info` | 6 | Mensaje informativo |
| `debug` | 7 | Mensaje de depuración |

```bash
journalctl                    # todos los logs del sistema
journalctl -u nginx.service   # logs de una unidad concreta
journalctl -f                 # en tiempo real (follow)
journalctl -b                 # desde el último arranque
journalctl --since "2026-01-01 00:00:00"
journalctl --until "2026-12-31 23:59:59"
journalctl -p err             # filtra por nivel de prioridad
```

## 8. Gestión de procesos en Windows: herramientas gráficas y línea de comandos

El criterio (f) exige usar tanto herramientas gráficas como comandos para el control y seguimiento de procesos. En Windows, la vía gráfica principal es el **Administrador de tareas** (clic derecho en la barra de tareas, o `Ctrl + Shift + Esc`), organizado en las pestañas Procesos, Rendimiento, Historial de aplicaciones, Inicio, Usuarios, Detalles y Servicios.

![Listado de procesos en el Administrador de tareas / PowerShell](../assets/img/add/02/02-03.png)

Desde el símbolo del sistema clásico:

```powershell
tasklist                          # lista los procesos con su PID
tasklist /SVC                     # muestra los servicios asociados a cada proceso
tasklist /FI "username eq john"   # filtra por una condición
tasklist /V                       # información ampliada

taskkill /pid 1234           # elimina el proceso con PID 1234
taskkill /im firefox.exe     # cierre "ordenado" por nombre
taskkill /im firefox.exe /f  # terminación inmediata y forzosa
```

Y en PowerShell, la herramienta de administración recomendada hoy en día en cualquier entorno Windows Server:

```powershell
Get-Process | more          # salida paginada
Get-Process -Name fi*       # filtra por nombre que empiece por "fi"

Stop-Process -id 1234              # detiene por PID
Stop-Process -name fi*             # detiene por nombre
Stop-Process -id 1234 -Confirm     # pidiendo confirmación

Get-Help <cmdlet> -Detailed   # ayuda detallada
Get-Help <cmdlet> -Examples   # solo ejemplos
Get-Help <cmdlet> -Full       # ayuda completa
Get-Help <cmdlet> -Online     # documentación en línea
```

Los cmdlets principales para procesos son `Get-Process`, `Start-Process`, `Stop-Process`, `Wait-Process` y `Debug-Process`; para servicios, `Get-Service`, `New-Service`, `Start-Service`, `Stop-Service`, `Restart-Service`, `Suspend-Service`, `Resume-Service` y `Set-Service`.

![Servicios agrupados por su estado en Windows](../assets/img/add/02/02-09.png)

## 9. Gestión de procesos en GNU/Linux: `ps`, `top`, `htop` y señales

En GNU/Linux, todo lo que se ejecuta es un proceso: por ejemplo, `ls -l | more` lanza en realidad dos procesos encadenados (`ls` y `more`). El sistema es multiusuario y multitarea, y concede los recursos hardware a cada proceso según la planificación vigente. Cada proceso queda identificado por su **PID** (identificador único) y su **PPID** (identificador del proceso padre), y mantiene su propio espacio de memoria (código, datos y pila) y su propio estado.

La vía gráfica equivalente al Administrador de tareas de Windows es, en GNOME, el **Monitor del sistema** (pestañas Procesos, Recursos y Archivos), y en KDE, **KSysGuard**. La vía de comandos ofrece herramientas más potentes para la administración diaria: `ps`, `pstree`, `top`, `htop` y `pgrep`.

```bash
ps -a          # procesos asociados a una terminal
ps -x          # procesos no controlados por ninguna terminal
ps -e          # todos los procesos del sistema
ps -f          # salida detallada (usuario, terminal, etc.)
ps -l          # información completa de la tabla de procesos
ps -u usuario  # procesos de un usuario concreto
ps -r          # solo procesos en ejecución
```

Columnas habituales de `ps`: **S** (estado), **UID** (propietario), **PID**, **PPID**, **C** (% CPU), **PRI** (prioridad), **NI** (nice), **TTY** (terminal asociada, `?` si no tiene), **TIME** (tiempo de CPU) y **CMD** (comando ejecutado).

```bash
pstree -c        # no compacta subárboles idénticos
pstree -g        # muestra ids de grupos de procesos (implica -c)
pstree -n        # ordena por PID
pstree -p        # muestra el PID junto al nombre
pstree -s PID    # muestra los procesos padres del PID indicado
```

![pstree mostrando la jerarquía de procesos padres e hijos](../assets/img/add/02/02-12.png)

`top` es un monitor interactivo en tiempo real (`-d` ritmo de refresco, `-u usuario`, `-o columna` para ordenar); dentro de `top`, la tecla `h` muestra ayuda, `k` envía una señal a un proceso y `r` cambia su prioridad. `htop` ofrece la misma información con una interfaz más amigable: `F2` configura columnas, `F3`/`F4` filtran, `F5` cambia a vista en árbol, `F7`/`F8` cambian la prioridad y `F9` envía señales. `pgrep` busca procesos por nombre u otros atributos (`-c` cuenta coincidencias, `-n` selecciona el más reciente, `-u usuario` filtra por propietario).

### Primer y segundo plano

Un proceso en **primer plano (*foreground*)** ocupa la terminal hasta que termina; uno en **segundo plano (*background*)** se lanza añadiendo `&` al final del comando, liberando la terminal para seguir trabajando.

```bash
jobs -l    # trabajos en segundo plano + PID
jobs -p    # solo el PID
jobs -r    # trabajos en ejecución
jobs -s    # trabajos detenidos
```

El signo `+` marca el trabajo más reciente movido a segundo plano; el signo `-`, el segundo más reciente. `Ctrl+Z` pausa un proceso en primer plano y lo pasa a segundo plano (detenido); `bg` lo reanuda en segundo plano; `fg` (o `fg +`, `fg %+`) lo recupera a primer plano.

### Señales

Las **señales** son el mecanismo estándar para comunicar eventos o solicitudes a procesos en ejecución.

| Señal | N.º | Significado |
|---|---|---|
| `SIGHUP` | 1 | Cuelgue (*hang up*) |
| `SIGINT` | 2 | Interrupción (`Ctrl+C`) |
| `SIGKILL` | 9 | Terminación forzada, no puede ser ignorada ni gestionada |
| `SIGTERM` | 15 | Finalización suave (señal por defecto de `kill`) |
| `SIGCONT` | 18 | Continuar tras una detención (`Ctrl+Z`) |
| `SIGSTOP` | 19 | Detención forzada, no puede ser gestionada |
| `SIGTSTP` | 20 | Detener (`Ctrl+Z`) |

```bash
kill -l           # lista las señales del sistema
kill -NÚMERO PID  # envía la señal indicada
killall -i cmd         # confirmación interactiva antes de matar
killall -u usuario cmd  # solo procesos de ese usuario
killall -w cmd          # espera a que todos los procesos mueran
```

!!! warning "SIGTERM antes que SIGKILL"
    `SIGTERM` permite que el propio proceso termine de forma controlada, cerrando ficheros y liberando recursos correctamente; es la opción por defecto de `kill` y la que debería probarse siempre primero. `SIGKILL` fuerza la terminación inmediata sin dar opción al proceso a reaccionar, con riesgo de corrupción de datos o ficheros a medio escribir, y debe reservarse para procesos que no responden a ningún otro intento. Antes de recurrir a `SIGKILL`, comprueba con `ps` que el proceso realmente sigue vivo tras el `SIGTERM`.

### Prioridad: `nice` y `renice`

El planificador del núcleo (*kernel scheduler*) ordena los procesos según su prioridad para decidir cuál se ejecuta a continuación. Dos columnas relacionadas, pero distintas:

- **NI (*nice value*)**: rango de −20 a +19; valores negativos indican mayor prioridad, positivos menor prioridad. Un usuario sin privilegios solo puede mover este valor entre 0 y 19 (bajar su propia prioridad); asignar valores negativos exige privilegios de administrador (root).
- **PRI (*priority*)**: rango de 0 a 139, donde los valores más bajos indican mayor prioridad; lo calcula el planificador del núcleo a partir del nice y de otros factores, y no se ajusta directamente por el usuario.

```bash
nice comando                  # ejecuta con prioridad 10 por defecto
nice -n 5 comando             # especifica otra prioridad
renice -u usuario NUEVO_NICE  # cambia el nice a todos los procesos de un usuario
renice -p PID NUEVO_NICE      # cambia el nice de un PID concreto (por defecto)
```

## 10. Estados de un proceso en GNU/Linux y terminología asociada

Además del modelo teórico de cinco estados, en la práctica administrativa de GNU/Linux se manejan estos términos:

| Estado | Significado |
|---|---|
| Pausado | Detenido temporalmente pero en memoria, reanudable (por ejemplo, con `Ctrl+Z`) |
| Detenido | Interrumpido, habitual durante depuración |
| Suspendido | Movido a memoria secundaria (swap) para liberar RAM |
| Parado | Sinónimo genérico de pausado/detenido |
| Terminado/finalizado | Ha concluido su ejecución y liberado sus recursos |

## 11. Seguridad ante procesos no identificados

El criterio (h) exige tomar medidas de seguridad ante la aparición de procesos no identificados: un proceso desconocido, con un nombre que imita a otro legítimo (*typosquatting* de procesos, como `scvhost.exe` en lugar de `svchost.exe`), con un consumo anómalo de CPU o red, o ejecutándose desde una ruta poco habitual, es uno de los primeros indicios de una posible infección o intrusión.

!!! warning "Checklist ante un proceso sospechoso"
    1. **Identifica el proceso**: nombre exacto, PID, PPID, usuario que lo ejecuta y ruta completa del ejecutable (`Get-Process | Select-Object Path` en PowerShell; `ls -l /proc/PID/exe` en Linux).
    2. **Verifica su origen**: ¿está firmado digitalmente? ¿el fabricante es reconocible? ¿la ruta es la habitual del sistema o una carpeta temporal poco frecuente?
    3. **Comprueba su consumo**: un uso anómalo y sostenido de CPU, red o disco es una señal de alerta, especialmente en procesos que deberían estar inactivos.
    4. **Consulta su relación de parentesco**: un proceso hijo de `explorer.exe` o de un navegador que no debería lanzar procesos de red es sospechoso.
    5. **No lo termines a ciegas** antes de documentarlo: capturas, hash del ejecutable y registro del incidente, para poder analizarlo o escalarlo si es necesario.
    6. Ante la duda, aísla el equipo de la red antes de seguir investigando.

Esta misma prudencia se aplica a los procesos huérfanos y zombis: no son, en sí mismos, un problema de seguridad, pero un número creciente y anómalo de procesos zombis puede indicar un fallo de programación grave (un proceso padre que nunca llama a `wait()`), y conviene documentarlo igual que cualquier otro comportamiento anómalo del sistema.

## 12. Documentación de procesos habituales del sistema

El criterio (i) pide documentar los procesos habituales del sistema, su función y su relación entre ellos. Una buena práctica de administración —tanto en Windows como en GNU/Linux— es mantener un pequeño catálogo de referencia de los procesos y servicios que se consideran "normales" en cada máquina, de forma que cualquier desviación resulte fácil de detectar.

| Proceso / servicio | Sistema | Función |
|---|---|---|
| `systemd` (PID 1) | GNU/Linux | Primer proceso de usuario; arranca y supervisa el resto de servicios |
| `sshd` | GNU/Linux | Servidor de conexiones remotas seguras (SSH) |
| `cron` / `systemd-timer` | GNU/Linux | Ejecución de tareas programadas |
| `journald` | GNU/Linux | Registro centralizado de logs del sistema |
| `services.exe` | Windows | Service Control Manager: arranca y supervisa los servicios de Windows |
| `svchost.exe` | Windows | Proceso contenedor genérico de servicios del sistema (varias instancias simultáneas) |
| `explorer.exe` | Windows | Shell gráfico del escritorio |
| `wininit.exe` | Windows | Inicializa procesos de sistema tras el arranque del núcleo |

## 13. Glosario rápido de la unidad

- **Proceso**: programa en ejecución con su propio contexto y recursos asignados.
- **Hilo**: unidad de ejecución dentro de un proceso, que comparte memoria y recursos con sus hilos hermanos.
- **BCP**: bloque de control de proceso; estructura de datos con toda la información de un proceso.
- **Interrupción / excepción**: evento hardware o software que desvía la ejecución normal de la CPU; la excepción está causada por un error del propio proceso.
- **Cambio de contexto**: guardar el estado de un proceso saliente y restaurar el de otro entrante.
- **Quantum**: intervalo fijo de tiempo de CPU asignado en el algoritmo Round Robin.
- **Nice / PRI**: valor ajustable por el usuario (nice) y valor final calculado por el planificador (PRI) que determinan la prioridad de un proceso en GNU/Linux.
- **Demonio / servicio**: proceso en segundo plano sin interacción directa con el usuario.
- **Proceso huérfano / zombi**: proceso cuyo padre ha terminado (huérfano) o proceso terminado cuyo padre no ha recogido su estado de salida (zombi).

## 14. Autoevaluación rápida

1. Explica la diferencia entre un programa y un proceso, y entre un proceso y un hilo. (apartados 1 y 3)
2. ¿Qué diferencia hay entre una interrupción y una excepción? Pon un ejemplo de cada una. (apartado 2)
3. Dibuja el diagrama de los 5 estados de un proceso e indica qué evento provoca cada transición. (apartado 4)
4. Compara FCFS, SJF, RR y prioridad expropiativa: ¿cuál elegirías para un sistema interactivo y por qué? (apartado 5)
5. Enumera, en orden, las fases de la secuencia de arranque de un sistema GNU/Linux con systemd. (apartado 6)
6. ¿Qué comandos usarías en PowerShell y en Bash para localizar el proceso que más CPU consume y terminarlo de forma segura? (apartados 8 y 9)
7. Describe tres señales de alarma que te harían sospechar de un proceso no identificado y qué harías ante ellas. (apartado 11)

## Para profundizar

Esta unidad se ha construido a partir del material de clase de Administración de Sistemas Operativos, con los apuntes ya recopilados en [Procesos del sistema](02-procesos-sistema.md), donde se conservan las actividades, la práctica de aula, la recuperación y la solución de referencia con capturas de PowerShell y terminal GNU/Linux. El resto de enlaces de referencia del módulo está recopilado en la página de [Recursos](99-recursos.md).
