# Ejercicios Bash

Colección de ejercicios para la UT07 (Scripting en Bash), ordenados de menor a mayor dificultad en 6 niveles.

- **Nivel 1** (ejercicios 1–20): Scripts secuenciales sencillos, comandos básicos.
- **Nivel 2** (ejercicios 21–40): Scripts secuenciales con filtros: `cut`, `awk`, `grep`, `sed`, `tr`, `sort`.
- **Nivel 3** (ejercicios 41–60): Estructuras condicionales: `if`, `if-else`, `elif`, `case`.
- **Nivel 4** (ejercicios 61–80): Estructuras de bucles: `for`, `while`, `until`.
- **Nivel 5** (ejercicios 81–90): Funciones.
- **Nivel 6** (ejercicios 91–100): Scripts reales.

**ENTREGA**

El alumnado debe crear un repositorio propio en GitHub llamado **`addscripts`**, con una carpeta **`bash`** en la raíz. Dentro de esa carpeta se subirá la solución de cada uno de los 100 ejercicios, con el nombre `ej001.sh` … `ej100.sh`, respetando.

**CALIFICACIÓN**

La **redacción de los scripts** no es lo único que se evalúa. Se valorará por igual:

- **Comentarios**: cada script debe explicar qué hace, con comentarios claros en las partes clave (declaración de variables, condiciones, bucles, etc.).
- **Indentado**: el código debe estar correctamente indentado y ser legible, siguiendo una estructura consistente en todo el repositorio.
- Un script que funcione pero sin comentarios ni indentado no se considerará completo.


## 🟢 1 · Scripts secuenciales sencillos (comandos básicos)

### 1 — Hola mundo
Crea el script `hola.sh` que muestre por pantalla el mensaje `Hola mundo, soy tu primer script`.

### 2 — ¿Quién y dónde?
Script que muestre el nombre del usuario que lo ejecuta, la fecha y hora actuales y el directorio en el que se encuentra.

### 3 — Saludo personalizado
Pide al usuario su nombre por teclado y muéstrale un saludo utilizando esa variable.

### 4 — Estructura de carpetas
Crea la carpeta `practicas` con las subcarpetas `teoria`, `ejercicios` y `entregas` en una sola orden, y muestra después la estructura creada.

### 5 — Copia de /etc/passwd
Copia el fichero `/etc/passwd` al directorio actual con el nombre `copia_passwd.txt` y muestra sus permisos y tamaño.

### 6 — Calculadora secuencial
Pide dos números por teclado y muestra su suma, resta, multiplicación y división entera usando `$(( ))`.

### 7 — Calendario y actividad
Muestra el calendario del mes actual, el tiempo que lleva encendida la máquina y los usuarios conectados.

### 8 — Fichero con contenido
Crea el fichero `notas.txt`, añádele tres líneas de texto con `echo` y redirección, y muéstralo numerando las líneas.

### 9 — Datos de la máquina
Muestra el nombre de la máquina, el número de usuarios conectados y la versión del kernel.

### 10 — Variables
Define las variables `NOMBRE`, `MODULO` y `NOTA`, y muéstralas dentro de una frase completa.

### 11 — Información de un fichero
Pide el nombre de un fichero y muestra su tamaño legible y el tipo de contenido (`ls -lh` y `file`).

### 12 — Principio y final
Muestra las 10 primeras y las 10 últimas líneas de `/etc/passwd`, con un mensaje separador entre ambas.

### 13 — Renombrar y mover
Crea el fichero `borrador.txt`, renómbralo a `definitivo.txt` y muévelo a una carpeta `entregado` creada por el script.

### 14 — Los comandos
Muestra la ruta de los ejecutables de `bash`, `ls` y `grep`, y el tipo de comando que es `cd`.

### 15 — Redirecciones
Guarda el listado largo de `/etc` en `listado.txt`, los errores de listar `/root` en `errores.txt`, y muestra cuántas líneas tiene cada fichero.

### 16 — Variables especiales
Muestra el PID del script (`$$`), su nombre (`$0`) y el número de parámetros recibidos (`$#`).

### 17 — Parámetros inverso
Script que reciba dos palabras como parámetros y las muestre en orden inverso al recibido.

### 18 — Disco y memoria
Muestra el espacio libre de los sistemas de ficheros y el estado de la memoria, ambos en formato legible.

### 19 — Enlaces
Crea un fichero `original.txt`, un enlace simbólico `enlace_blando` y un enlace duro `enlace_duro` hacia él, y compáralos con `ls -li`.

### 20 — Edad aproximada
Pide el año de nacimiento del usuario y calcula su edad aproximada usando el año actual obtenido con `date`.

## 🟡 2 · Scripts secuenciales con filtros (`cut`, `awk`, `grep`, `sed`…)

### 21 — Usuarios con cut
Muestra únicamente los nombres de usuario de `/etc/passwd` utilizando `cut`.

### 22 — Usuario y shell con awk
Muestra el nombre de usuario y su shell separados por una tabulación, utilizando `awk -F:`.

### 23 — Contador wc
Pide el nombre de un fichero y muestra por separado su número de líneas, de palabras y de caracteres.

### 24 — Filtrando con grep
Muestra los usuarios de `/etc/passwd` que utilizan `bash` como shell, y cuántos son.

### 25 — Duplicados
A partir de un fichero de nombres (créalo en el script), muéstralo ordenado alfabéticamente y sin duplicados.

### 26 — Mayúsculas con tr
Pide una frase por teclado y muéstrala en mayúsculas y después sin espacios.

### 27 — Sustituciones con sed
Crea un fichero con varias líneas que contengan la palabra `Windows` y sustituye todas sus apariciones por `Linux`, mostrando el resultado.

### 28 — UID más alto
Muestra la línea de `/etc/passwd` correspondiente al usuario con el UID más alto (ordena numéricamente por el campo 3).

### 29 — Top de memoria
Muestra los 5 procesos que más memoria consumen: usuario, PID y %MEM, usando `ps aux`, `sort` y `awk`.

### 30 — Contando entradas
Muestra cuántos ficheros y cuántos directorios hay en el directorio actual (sin contar ocultos).

### 31 — Mi IP
Muestra únicamente la dirección IP principal de la máquina filtrando la salida de `ip a` (o `hostname -I`).

### 32 — Trocear la fecha
A partir de `date +%d/%m/%Y`, extrae y muestra por separado el día, el mes y el año usando `cut`.

### 33 — Los 5 más pesados
Muestra los 5 ficheros o carpetas que más ocupan dentro del HOME del usuario.

### 34 — Líneas concretas
Muestra únicamente las líneas 5 a 10 de `/etc/passwd` (hazlo de dos formas: `head`+`tail` y `sed -n`).

### 35 — Contar vocales
Pide el nombre de un fichero y muestra cuántas vocales contiene en total (usa `tr` y `wc`).

### 36 — Informe con tee
Genera un informe con el nombre de la máquina, la lista de usuarios humanos y su total, mostrándolo por pantalla y guardándolo a la vez en `informe.txt` con `tee`.

### 37 — Suma con awk
Suma el tamaño en bytes de todos los ficheros del directorio actual usando `ls -l` y `awk`.

### 38 — Buscar y contar
Pide una palabra y un fichero, y muestra cuántas líneas del fichero la contienen y cuáles son (con número de línea).

### 39 — Mis procesos
Muestra los procesos del usuario actual mostrando solo PID y comando, ordenados por PID.

### 40 — Shells del sistema
Muestra la lista de shells distintas que aparecen en `/etc/passwd` y cuántos usuarios usa cada una.

## 🟠 3 · Estructuras condicionales (`if`, `if-else`, `case`)

### 41 — Positivo o negativo
Pide un número y muestra si es positivo, negativo o cero.

### 42 — Par o impar
Pide un número y muestra si es par o impar usando el operador módulo.

### 43 — ¿Existe el fichero?
Script que reciba un nombre de fichero como parámetro y muestre si existe o no. Si no recibe parámetro, mostrará un error de uso y terminará con `exit 1`.

### 44 — ¿Fichero o directorio?
Recibe una ruta como parámetro e indica si es un fichero regular, un directorio o no existe (usa `if / elif / else`).

### 45 — Permisos
Recibe un fichero como parámetro y comprueba, uno a uno, si tienes permiso de lectura, de escritura y de ejecución sobre él.

### 46 — El mayor de dos
Pide dos números y muestra cuál es mayor, o si son iguales.

### 47 — Validar parámetros
Script que exige exactamente dos parámetros: si no los recibe muestra la sintaxis correcta y sale con código 1; si los recibe, los muestra numerados.

### 48 — ¿Existe el usuario?
Pide un nombre de usuario y comprueba si existe en el sistema (usa `id` o `grep` sobre `/etc/passwd`).

### 49 — Calificaciones
Pide una nota de 0 a 10 y muestra la calificación: insuficiente, suficiente, bien, notable o sobresaliente. Controla que la nota sea válida.

### 50 — Cadenas
Pide dos cadenas: comprueba si la primera está vacía y si ambas son iguales o distintas.

### 51 — ¿Eres root?
Comprueba si el script se está ejecutando como root; si no, avisa de que hacen falta privilegios y termina con código 1.

### 52 — Día de la semana (case)
Pide un número del 1 al 7 y muestra el día de la semana correspondiente usando `case`, con opción por defecto para valores no válidos.

### 53 — Vocal o consonante 
Pide una letra y di si es vocal o consonante usando `case` con patrones. Controla que se introduzca una única letra.

### 54 — Opciones de comando 
Script que admita las opciones `-f` (fecha), `-u` (usuario), `-d` (directorio) y `-h` (ayuda) como primer parámetro, resolviéndolas con `case`.

### 55 — ¿Servicio activo?
Recibe el nombre de un servicio y comprueba con `systemctl is-active` si está activo, mostrando un mensaje distinto en cada caso.

### 56 — Año bisiesto
Pide un año y determina si es bisiesto (divisible entre 4 y no entre 100, salvo que lo sea entre 400).

### 57 — Tipo de extensión
Recibe un nombre de fichero e indica según su extensión si es un texto (`.txt`), un script (`.sh`), una imagen (`.jpg/.png`) o un tipo desconocido.

### 58 — Rango de edad
Pide la edad y comprueba con operadores lógicos si está en edad laboral (entre 16 y 67 incluidos).

### 59 — ¿Hay internet?
Comprueba con un solo `ping` a `8.8.8.8` si hay conexión, decidiendo según el código de salida `$?`.

### 60 — Mini calculadora (case)
Pide dos números y una operación (`+`, `-`, `x`, `/`) y resuélvela con `case`, controlando la división por cero.

## 🔵 4 · Estructuras de bucles (`for`, `while`, `until`)

### 61 — Contando con for
Muestra los números del 1 al 10 usando un bucle `for`.

### 62 — Tabla de multiplicar
Pide un número y muestra su tabla de multiplicar completa (del 1 al 10).

### 63 — Saludos en serie
Recorre con `for` una lista de nombres definida en el script y saluda a cada uno.

### 64 — Recorrer ficheros
Recorre los ficheros del directorio actual mostrando su nombre y tamaño en líneas del tipo `fichero.txt ocupa 120 bytes`.

### 65 — Cuenta atrás
Cuenta atrás de 10 a 0 mostrando un número por segundo y termina con el mensaje `¡Despegue!`.

### 66 — Leer línea a línea
Lee un fichero línea a línea con `while read` y muéstralo numerando cada línea manualmente (sin usar `cat -n`).

### 67 — Suma hasta N
Pide un número N y suma todos los enteros de 1 a N con un bucle `while`.

### 68 — Contraseña con until
Pide una contraseña con `until` hasta que el usuario escriba `secreto`, contando los intentos.

### 69 — Menú repetitivo
Menú con `while` + `case` con las opciones: 1) fecha, 2) usuarios conectados, 3) directorio actual y 0) salir. Se repetirá hasta pulsar 0.

### 70 — Comprobar parámetros
Recorre con `for` todos los parámetros recibidos (`"$@"`) e indica para cada uno si es un fichero existente o no.

### 71 — Adivina el número
Genera un número aleatorio del 1 al 100 con `$RANDOM` y deja que el usuario lo adivine en bucle, indicando si el número buscado es mayor o menor.

### 72 — Creación en lote
Crea con un bucle los ficheros `fich01.txt` a `fich10.txt` (usa `printf "%02d"` para el número) y comprueba al final cuántos se han creado.

### 73 — Todas las tablas
Muestra las tablas de multiplicar del 1 al 10 con dos bucles anidados, separando cada tabla con una línea.

### 74 — Suma 
Lee números en bucle: los negativos se ignoran (`continue`) y el 0 finaliza (`break`). Al terminar, muestra la suma de los positivos introducidos.

### 75 — Usuarios humanos
Recorre los usuarios de `/etc/passwd` y muestra solo los que tienen UID mayor o igual a 1000, con su UID.

### 76 — Renombrado masivo
Añade el prefijo `bak_` a todos los ficheros `.txt` del directorio actual usando un bucle `for` y `mv`.

### 77 — Factorial
Pide un número y calcula su factorial con un bucle `while`.

### 78 — Recorrer /etc/passwd
Lee `/etc/passwd` con `while read` cambiando `IFS` a `:` y muestra `El usuario X usa la shell Y` con formato de columnas.

### 79 — Mini monitor
Toma 3 muestras de la carga del sistema (una cada 5 segundos) con `uptime` y guárdalas con su hora en `monitor.log`, mostrando el log al final.

### 80 — Pirámide de asteriscos
Pide una altura N y dibuja una pirámide de asteriscos de N filas con bucles anidados.

## 🟣 5 · Funciones

### 81 — Primera función
Define una función `saludar` que reciba un nombre como parámetro y lo salude. Llámala tres veces con nombres distintos.

### 82 — Función que devuelve 
Define una función `suma` que reciba dos números y devuelva el resultado con `echo`, capturándolo desde el programa principal con `$( )`.

### 83 — Máximo de dos números
Define una función `maximo` que muestre el mayor de los dos números recibidos, y otra `es_par` que use `return` para indicar con el código de salida si un número es par, comprobándolo con `$?`.

### 84 — Función reutilizada
Define una función `comprobar_fichero` que indique si la ruta recibida existe y de qué tipo es, y úsala sobre `/etc/passwd`, `/tmp` y un fichero inexistente.

### 85 — Biblioteca de funciones
Crea un fichero `biblioteca.sh` con al menos dos funciones (por ejemplo `linea` y `cabecera`) y un script principal que las cargue con `source` y las utilice.

### 86 — Variables locales
Demuestra la diferencia entre una variable global y una `local` dentro de una función, mostrando su valor antes, dentro y después de la llamada.

### 87 — Factorial recursivo
Implementa el factorial mediante una función recursiva.

### 88 — Validación reutilizable
Define una función `validar_numero` que compruebe con una expresión regular que el dato recibido es un entero, y úsala para validar los dos números que pide el programa antes de operarlos.

### 89 — Función de log
Define una función `log_msg` que reciba un mensaje y lo añada a `actividad.log` con la fecha y hora. Utilízala en varios puntos de un script de ejemplo.

### 90 — Menú con funciones
Construye un menú repetitivo donde cada opción llame a una función distinta (fecha, espacio en disco, usuarios conectados) — misma estructura que el supuesto de examen de la UT07.

## 🔴 6 · Scripts reales

### 91 — Copia de seguridad
Script que reciba una carpeta como parámetro, la comprima en `~/backups/nombre_AAAA-MM-DD.tar.gz` (creando la carpeta si no existe) y elimine los backups con más de 7 días.

### 92 — Alta masiva de usuarios
Script (para root) que lea un fichero con líneas `usuario:grupo` y cree cada usuario en su grupo, creando antes el grupo si no existe y omitiendo los usuarios ya existentes. Debe mostrar un resumen final.

### 93 — Alerta de disco
Script que revise el porcentaje de ocupación de cada partición y avise de las que superen un umbral (parámetro, por defecto 80 %), registrando las alertas en un log.

### 94 — Informe del sistema
Script que genere un informe `informe_HOSTNAME_FECHA.txt` con: sistema operativo, kernel, IP, uptime, disco, memoria y los 5 procesos que más CPU consumen.

### 95 — Vigilante de servicios
Script (para root) que reciba un nombre de servicio, compruebe si está activo y, si está caído, intente reiniciarlo, dejando constancia de todo en `/var/log/vigilante.log`.

### 96 — Limpiador de temporales
Script que busque en una ruta dada ficheros `*.tmp` y `*~`, muestre cuántos son y el espacio que ocupan, y los borre solo si el usuario confirma con `s`.

### 97 — Rotador de logs
Script que recorra los `.log` de una carpeta y, para los que superen un tamaño máximo (parámetro en KB), los comprima con fecha en una subcarpeta `antiguos/` y deje el original vacío.

### 98 — CSamba
Script (para root) que pida el nombre de una carpeta, la cree con todos los permisos, la comparta por Samba para toda la red (añadiendo la sección a `smb.conf`) y reinicie el servicio. Si Samba no está instalado, debe instalarlo.

### 99 — Accesos fallidos
Script que analice un log de autenticación (por defecto `/var/log/auth.log`) y muestre el top 5 de usuarios y de IPs con intentos fallidos de acceso.

### 100 — Programa con menú
Programa `gestor.sh` al estilo del examen de la UT07: menú repetitivo con una función por opción — 1) buscar un fichero en el sistema y contar sus vocales, 2) crear un fichero con nombre y tamaño dados (con valores por defecto), 3) lista de la compra sin duplicados y con contador de elementos, 0) salir. Código comentado, variables con nombres claros e indentación correcta.
