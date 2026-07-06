# **🐚 Bash · Estructuras de control y funciones**

![Los cuatro tipos de estructura de control en un script Bash: secuencial, condicional, repetitiva y función](../assets/img/05script/bash-flujo-control.svg)

Un script de Bash no es más que una lista de comandos guardada en un archivo, pero lo que convierte esa lista en un **programa** capaz de tomar decisiones y adaptarse a distintas situaciones son sus **estructuras de control**. Este apartado las presenta separadas por tipo —secuenciales, condicionales, repetitivas y funciones— porque cada una resuelve un problema distinto y conviene tenerlas bien diferenciadas antes de empezar a combinarlas en scripts reales de administración de sistemas.

## Estructuras secuenciales

Una estructura **secuencial** es, simplemente, la ejecución de instrucciones **una detrás de otra, en el orden en que aparecen en el archivo**, sin saltos ni repeticiones. Es la estructura por defecto de cualquier script: si no se usa ningún condicional ni ningún bucle, el intérprete de Bash lee el archivo de arriba abajo y ejecuta cada línea exactamente una vez.

```bash
#!/bin/bash
# Script secuencial: informe básico del sistema

echo "== Informe del sistema =="
echo "Fecha: $(date)"
echo "Usuario actual: $(whoami)"
echo "Directorio actual: $(pwd)"
echo "Espacio en disco:"
df -h /
echo "== Fin del informe =="
```

Al ejecutar este script (`bash informe.sh`), Bash procesa cada línea en el orden exacto en que está escrita: primero imprime el título, luego la fecha, luego el usuario, y así sucesivamente hasta la última línea. No hay ninguna decisión ni ninguna repetición: **cada instrucción se ejecuta una única vez**, en el orden en que el autor la escribió.

!!! note "La secuencia también incluye el orden de las variables"
    Un error habitual de quien empieza con Bash es usar una variable antes de haberla asignado (por ejemplo, `echo "Hola, $nombre"` antes de la línea `nombre="Ana"`). Como Bash ejecuta de forma secuencial y no "adivina" declaraciones futuras, en ese caso `$nombre` estaría vacía en el momento de imprimirse.

Esta estructura, aunque parezca trivial, es la base sobre la que se apoyan las otras tres: dentro de un `if`, de un `for` o del cuerpo de una función, el bloque de instrucciones que se ejecuta **también es una secuencia** de comandos, uno detrás de otro.

## Estructuras condicionales

Una estructura **condicional** permite que el script tome un camino u otro **según se cumpla o no una condición**. Es la herramienta que convierte un script de "hacer siempre lo mismo" en un script que reacciona a la situación real del sistema (¿existe el archivo?, ¿el proceso sigue vivo?, ¿el disco está lleno?).

### La sentencia if / elif / else

```bash
#!/bin/bash
# Comprueba el espacio libre en la partición raíz

uso=$(df / | tail -1 | awk '{print $5}' | tr -d '%')

if [ "$uso" -ge 90 ]; then
    echo "CRÍTICO: el disco está al ${uso}% de uso"
elif [ "$uso" -ge 75 ]; then
    echo "AVISO: el disco está al ${uso}% de uso"
else
    echo "OK: el disco está al ${uso}% de uso"
fi
```

La estructura evalúa las condiciones **en orden**: si la primera (`if`) es verdadera, ejecuta ese bloque y no comprueba las siguientes; si es falsa, pasa a la primera condición `elif` que encuentre; si ninguna se cumple, ejecuta el bloque `else`. Puede haber tantos `elif` como se necesiten, y tanto `elif` como `else` son opcionales.

### Operadores de test más habituales

Los corchetes `[ ]` son en realidad el comando `test` con una sintaxis alternativa. Los operadores más usados en administración de sistemas son:

| Operador | Comprueba | Ejemplo |
|---|---|---|
| `-eq` | Igualdad numérica | `[ "$a" -eq "$b" ]` |
| `-ne` | Distinto numérico | `[ "$a" -ne "$b" ]` |
| `-lt` | Menor que (numérico) | `[ "$a" -lt 10 ]` |
| `-le` | Menor o igual (numérico) | `[ "$a" -le 10 ]` |
| `-gt` | Mayor que (numérico) | `[ "$a" -gt 10 ]` |
| `-ge` | Mayor o igual (numérico) | `[ "$a" -ge 10 ]` |
| `=` / `==` | Igualdad de cadenas | `[ "$nombre" = "root" ]` |
| `!=` | Distinto de cadenas | `[ "$nombre" != "root" ]` |
| `-z` | Cadena vacía | `[ -z "$var" ]` |
| `-n` | Cadena no vacía | `[ -n "$var" ]` |
| `-f` | El archivo existe y es un archivo regular | `[ -f /etc/passwd ]` |
| `-d` | El archivo existe y es un directorio | `[ -d /var/log ]` |
| `-e` | La ruta existe (archivo o carpeta) | `[ -e /tmp/lock ]` |
| `-r` / `-w` / `-x` | Existe y tiene permiso de lectura/escritura/ejecución | `[ -x script.sh ]` |
| `-s` | El archivo existe y no está vacío | `[ -s backup.log ]` |

```bash
#!/bin/bash
archivo="/etc/nginx/nginx.conf"

if [ -f "$archivo" ]; then
    echo "El archivo de configuración existe"
    if [ -r "$archivo" ]; then
        echo "Y además se puede leer"
    fi
else
    echo "No se encuentra $archivo"
fi
```

Los operadores lógicos combinan condiciones: `-a` (Y) y `-o` (O) dentro de un mismo `[ ]`, o bien `&&` y `||` entre corchetes separados (forma recomendada porque evita ambigüedades):

```bash
if [ -f "$archivo" ] && [ -r "$archivo" ]; then
    echo "Existe y se puede leer"
fi
```

!!! tip "[ ] frente a [[ ]]"
    `[ ]` es POSIX (funciona en cualquier shell compatible), pero `[[ ]]` es una extensión propia de Bash más segura y flexible: permite usar `&&`/`||` directamente dentro de los corchetes, soporta *pattern matching* (`[[ $archivo == *.log ]]`) y **no requiere entrecomillar las variables** para evitar errores si están vacías o contienen espacios. Si el script es exclusivamente para Bash (no necesita ser portable a `sh` o `dash`), `[[ ]]` es la opción recomendada.

### La sentencia case

`case` es la alternativa a encadenar muchos `elif` cuando se compara una misma variable contra varios valores posibles, similar al `switch` de otros lenguajes:

```bash
#!/bin/bash
echo "Selecciona una acción: start|stop|restart|status"
read accion

case "$accion" in
    start)
        echo "Iniciando el servicio..."
        ;;
    stop)
        echo "Deteniendo el servicio..."
        ;;
    restart)
        echo "Reiniciando el servicio..."
        ;;
    status)
        echo "Consultando el estado..."
        ;;
    *)
        echo "Acción no reconocida"
        ;;
esac
```

Cada bloque termina con `;;`, y el patrón `*)` al final actúa como un "en cualquier otro caso", igual que el `else` de un `if`. `case` también admite comodines y varios valores separados por `|` en un mismo patrón (`start|begin) ...;;`).

| Estructura | Cuándo usarla |
|---|---|
| `if` / `elif` / `else` | Condiciones basadas en comparaciones, rangos o combinaciones lógicas |
| `case` | Comparar una única variable contra una lista cerrada de valores posibles |

## Estructuras repetitivas

Las estructuras **repetitivas** (bucles) ejecutan un mismo bloque de instrucciones varias veces, evitando repetir código a mano. Bash ofrece tres: `for`, `while` y `until`.

![Comparación de for, while y until: número de vueltas fijo frente a condición evaluada en cada iteración](../assets/img/05script/bash-bucles.svg)

### El bucle for

Recorre una lista de elementos conocida de antemano: un rango de números, los elementos de un array, o la salida de un comando.

```bash
#!/bin/bash
# Recorre un rango de números
for i in {1..5}; do
    echo "Procesando elemento número $i"
done

# Recorre una lista de valores explícita
for servicio in nginx mysql ssh; do
    systemctl is-active --quiet "$servicio" && echo "$servicio: activo" || echo "$servicio: parado"
done

# Sintaxis estilo C, útil para contadores con paso distinto de 1
for ((i = 0; i <= 10; i += 2)); do
    echo "Par: $i"
done

# Recorre los archivos de un directorio
for f in /var/log/*.log; do
    echo "Log encontrado: $f"
done
```

### El bucle while

Repite el bloque **mientras** la condición evaluada al principio de cada vuelta sea verdadera. Se usa cuando no se sabe de antemano cuántas iteraciones harán falta.

```bash
#!/bin/bash
# Espera hasta que un servicio responda, con un máximo de 10 intentos
intentos=0
while [ "$intentos" -lt 10 ]; do
    if curl -s --head http://localhost:8080 > /dev/null; then
        echo "El servicio ya responde"
        break
    fi
    echo "Intento $((intentos + 1)): el servicio aún no responde"
    intentos=$((intentos + 1))
    sleep 2
done
```

Un patrón muy habitual en administración de sistemas es leer un archivo línea a línea con `while` combinado con `read`:

```bash
#!/bin/bash
while read -r linea; do
    echo "Usuario detectado: $linea"
done < /etc/passwd
```

### El bucle until

Es el inverso lógico de `while`: repite el bloque **hasta que** la condición se cumpla, es decir, mientras sea falsa.

```bash
#!/bin/bash
# Reintenta una conexión hasta que tenga éxito
contador=1
until ping -c 1 8.8.8.8 &> /dev/null; do
    echo "Intento $contador: sin conexión todavía..."
    contador=$((contador + 1))
    sleep 3
done
echo "Conexión establecida tras $contador intento(s)"
```

### break y continue

Ambas palabras clave alteran el flujo normal de un bucle desde dentro:

- **`break`**: termina el bucle inmediatamente, saltando a la primera instrucción posterior al `done`.
- **`continue`**: interrumpe la iteración actual y salta directamente a la siguiente vuelta del bucle, sin ejecutar el resto del cuerpo.

```bash
#!/bin/bash
for numero in 1 2 3 4 5 6 7 8 9 10; do
    if [ "$numero" -eq 7 ]; then
        echo "Encontrado el 7, salimos del bucle"
        break
    fi
    if [ $((numero % 2)) -eq 0 ]; then
        continue   # Se salta los números pares
    fi
    echo "Número impar: $numero"
done
```

| Estructura | Cuándo se evalúa la condición | Uso típico |
|---|---|---|
| `for` | Recorre una lista/rango ya conocido | Número de iteraciones fijo o predecible |
| `while` | Antes de cada iteración; continúa si es verdadera | Esperar a que algo ocurra, número de vueltas desconocido |
| `until` | Antes de cada iteración; continúa si es falsa | Reintentar hasta lograr una condición de éxito |
| `break` | — | Abandonar el bucle por completo |
| `continue` | — | Saltar a la siguiente iteración sin terminar el bucle |

!!! warning "Cuidado con los bucles infinitos"
    `while true; do ... done` o un `until` cuya condición nunca cambia dentro del cuerpo del bucle son errores muy habituales que dejan un script colgado consumiendo CPU indefinidamente. Antes de lanzar un bucle de este tipo en un servidor de producción, asegúrate de que existe una condición de salida real (un `break`, un contador máximo de intentos, un `timeout`).

## Funciones

Una **función** agrupa un bloque de instrucciones bajo un nombre, permitiendo reutilizarlo tantas veces como se necesite sin copiar y pegar código. Es la herramienta que permite que un script crezca en tamaño y complejidad sin volverse ilegible.

![Llamada a una función con parámetros posicionales y las dos formas de devolver un resultado](../assets/img/05script/bash-funciones.svg)

### Declaración y llamada

Hay dos sintaxis equivalentes para declarar una función en Bash:

```bash
#!/bin/bash

# Forma 1: con la palabra clave function (más explícita)
function saludar {
    echo "Hola, bienvenido al script"
}

# Forma 2: solo con paréntesis (más portable, estilo POSIX)
despedirse() {
    echo "Adiós, hasta la próxima"
}

saludar
despedirse
```

Una función debe **declararse antes de ser llamada** en el flujo secuencial del script: Bash lee de arriba abajo, así que si se invoca una función en la línea 5 pero se define en la línea 20, el script fallará con un error de "comando no encontrado".

### Parámetros posicionales dentro de una función

Al llamar a una función con argumentos, estos se reciben dentro de ella exactamente igual que los argumentos de línea de comandos de un script: `$1`, `$2`, etc.

```bash
#!/bin/bash

crear_usuario() {
    local nombre="$1"
    local edad="$2"
    echo "Creando usuario: $nombre (edad: $edad)"
    echo "Todos los argumentos recibidos: $@"
    echo "Número de argumentos: $#"
}

crear_usuario "ana" "25"
```

| Variable especial | Significado dentro de una función |
|---|---|
| `$1`, `$2`, `$3`... | Primer, segundo, tercer argumento recibido por la función |
| `$0` | Nombre del script (no cambia dentro de la función) |
| `$#` | Número total de argumentos recibidos |
| `$@` | Todos los argumentos, cada uno como una palabra independiente |
| `$*` | Todos los argumentos como una única cadena de texto |

!!! tip "Entre comillas, $@ y $* se comportan distinto"
    `"$@"` expande cada argumento como una palabra separada, preservando espacios internos de cada uno (el comportamiento casi siempre deseado al reenviar argumentos a otro comando). `"$*"` los concatena todos en una sola cadena separada por el primer carácter de `IFS`. La recomendación práctica es: usa siempre `"$@"` entre comillas dobles salvo que tengas una razón concreta para lo contrario.

### Valores de retorno: return frente a echo capturado

Bash no permite que una función "devuelva" directamente una cadena de texto o un número complejo como en otros lenguajes. Existen dos mecanismos, con propósitos distintos:

- **`return <código>`**: termina la función devolviendo un **código de salida numérico entre 0 y 255**, pensado para indicar éxito (`0`) o el tipo de error (`1`, `2`...). Se consulta inmediatamente después con la variable `$?`.
- **`echo` capturado con `$(...)`**: si la función necesita devolver un **dato** (una cadena, un número, una ruta), la forma habitual es que la función lo imprima con `echo` y quien la llama capture esa salida con `$(nombre_funcion ...)`.

```bash
#!/bin/bash

# return: para indicar éxito/fracaso
comprobar_par() {
    if [ $(( $1 % 2 )) -eq 0 ]; then
        return 0   # éxito: es par
    else
        return 1   # fracaso: es impar
    fi
}

comprobar_par 8
if [ $? -eq 0 ]; then
    echo "8 es par"
fi

# echo + captura: para devolver un valor
obtener_hostname_corto() {
    echo "$(hostname | cut -d'.' -f1)"
}

nombre_equipo=$(obtener_hostname_corto)
echo "El equipo se llama: $nombre_equipo"
```

| Mecanismo | Qué devuelve | Cómo se recupera | Cuándo usarlo |
|---|---|---|---|
| `return <n>` | Un código numérico de 0 a 255 | `$?` justo después de la llamada | Indicar éxito/error, tomar decisiones con `if función; then` |
| `echo "valor"` | Cualquier cadena de texto | `variable=$(funcion)` | Obtener un dato calculado dentro de la función |

### Variables locales con local

Por defecto, cualquier variable definida dentro de una función es **global**: si una función modifica una variable con el mismo nombre que otra ya existente fuera de ella, la sobrescribe, lo que puede provocar errores muy difíciles de rastrear en scripts grandes. La palabra clave `local` restringe el alcance de la variable al cuerpo de la función:

```bash
#!/bin/bash
contador=100

modificar_local() {
    local contador=1
    contador=$((contador + 1))
    echo "Dentro de la función: $contador"
}

modificar_local
echo "Fuera de la función: $contador"
```

Al ejecutar este script, dentro de la función se imprime `2`, pero fuera se sigue imprimiendo `100`: la variable `local` creada dentro de `modificar_local` es completamente independiente de la variable global del mismo nombre.

!!! warning "Olvidar local es una fuente clásica de bugs"
    Un script con varias funciones que no usan `local` puede ver cómo una función "pisa" sin querer una variable que otra parte del script necesitaba conservar. La buena práctica es declarar como `local` **toda** variable que solo tenga sentido dentro de la función, y reservar las variables globales para datos que de verdad deban compartirse entre distintas partes del script.

## Script de ejemplo completo: las cuatro estructuras combinadas

El siguiente script combina las cuatro estructuras vistas en este apartado para resolver una tarea realista de administración: comprobar el estado de una lista de servicios del sistema y generar un pequeño informe.

```bash
#!/bin/bash
# comprobar_servicios.sh
# Combina estructura secuencial, condicional, repetitiva y funciones

# --- Estructura secuencial: preparación inicial ---
servicios=("ssh" "cron" "nginx" "servicio_inexistente")
total_activos=0
total_caidos=0
fecha_informe=$(date "+%Y-%m-%d %H:%M")

# --- Función con parámetro posicional y valor de retorno vía return ---
comprobar_servicio() {
    local nombre="$1"
    if systemctl is-active --quiet "$nombre"; then
        return 0   # activo
    else
        return 1   # caído o inexistente
    fi
}

# --- Función que devuelve un dato mediante echo capturado ---
formatear_linea() {
    local nombre="$1"
    local estado="$2"
    echo "  - ${nombre}: ${estado}"
}

echo "== Informe de servicios (${fecha_informe}) =="

# --- Estructura repetitiva: recorre todos los servicios de la lista ---
for servicio in "${servicios[@]}"; do

    # --- Estructura condicional: decide según el resultado de la función ---
    if comprobar_servicio "$servicio"; then
        formatear_linea "$servicio" "ACTIVO"
        total_activos=$((total_activos + 1))
    else
        formatear_linea "$servicio" "CAÍDO o no instalado"
        total_caidos=$((total_caidos + 1))
    fi
done

# --- Estructura condicional final: resumen con case ---
estado_global="desconocido"
case "$total_caidos" in
    0)
        estado_global="todo correcto"
        ;;
    1|2)
        estado_global="revisar con atención"
        ;;
    *)
        estado_global="crítico, intervención urgente"
        ;;
esac

echo "----------------------------------------"
echo "Activos: $total_activos | Caídos: $total_caidos"
echo "Estado global: $estado_global"
```

Este ejemplo recorre las cuatro piezas del temario en un único script realista: la **secuencia** inicial prepara las variables, el bucle **for** (repetitiva) recorre la lista de servicios, cada vuelta usa un **if** (condicional) para decidir qué hacer según el resultado de una **función** (`comprobar_servicio`, que usa `return` para señalar éxito/fracaso, y `formatear_linea`, que usa `echo` capturado indirectamente al imprimir directamente el resultado), y al final un **case** (otra estructura condicional) resume el resultado global.

## Tabla resumen final de sintaxis

| Estructura | Palabras clave | Cierre |
|---|---|---|
| Condicional simple | `if` ... `then` | `fi` |
| Condicional con alternativas | `if` ... `elif` ... `else` | `fi` |
| Selección múltiple | `case` ... `in` | `esac` |
| Bucle con lista conocida | `for` ... `in` ... `do` | `done` |
| Bucle con condición previa | `while` ... `do` | `done` |
| Bucle con condición invertida | `until` ... `do` | `done` |
| Función (forma 1) | `function nombre { ... }` | `}` |
| Función (forma 2, POSIX) | `nombre() { ... }` | `}` |

!!! tip "Indentación y legibilidad"
    Bash no obliga a indentar el código como Python, pero un script sin indentación consistente es mucho más difícil de depurar cuando hay condicionales y bucles anidados. La convención más extendida es usar 2 ó 4 espacios por nivel de anidamiento y mantenerla igual en todo el proyecto.

## Glosario rápido

- **Estructura secuencial**: ejecución de instrucciones en el orden en que aparecen, sin saltos ni repeticiones.
- **Estructura condicional**: bloque de código que se ejecuta solo si se cumple (o no) una condición (`if`, `case`).
- **Estructura repetitiva (bucle)**: bloque de código que se ejecuta varias veces (`for`, `while`, `until`).
- **Función**: bloque de código con nombre propio, reutilizable y que puede recibir parámetros.
- **Parámetro posicional**: argumento recibido por un script o función, referenciado como `$1`, `$2`...
- **Variable local**: variable cuyo alcance queda restringido al cuerpo de la función donde se declara con `local`.
- **Código de salida**: valor numérico (0-255) que indica si un comando o función terminó con éxito (0) o con error (distinto de 0).

## Autoevaluación rápida

1. ¿Qué diferencia hay entre una estructura secuencial y el cuerpo de un bucle `for`? (apartado "Estructuras secuenciales")
2. ¿Cuándo usarías `case` en lugar de encadenar varios `elif`? (apartado "Estructuras condicionales")
3. Escribe un bucle `until` que reintente una conexión con `ping` hasta que tenga éxito. (apartado "Estructuras repetitivas")
4. ¿Por qué `return` no sirve para devolver una cadena de texto desde una función, y qué alternativa existe? (apartado "Funciones")
5. Explica, con un ejemplo, qué problema evita declarar una variable como `local` dentro de una función. (apartado "Funciones")

## Para profundizar

Este apartado se apoya en el manual oficial de Bash (`man bash`, sección *SHELL GRAMMAR* y *FUNCTIONS*) y en la [Bash Guide de Greg's Wiki](https://mywiki.wooledge.org/BashGuide){:target="_blank"}, una referencia clásica y muy detallada sobre buenas prácticas de scripting en Bash, incluyendo el uso correcto de comillas, el comportamiento de `$@` frente a `$*` y los errores más comunes al combinar estructuras de control anidadas.
