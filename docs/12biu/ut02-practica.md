# 🧪 Supuesto Práctico UT02 *Procesamiento distribuido con Apache Spark y PySpark* { .card }

!!! info "OBJETIVOS"
    Configurar Apache Spark en Google Colab (o en un clúster Docker propio) y comprobar de forma práctica el modelo de computación distribuida: su capacidad de cómputo paralelo, su tolerancia a fallos, la independencia entre almacenamiento y explotación futura del dato, y su capacidad de escalar añadiendo recursos.

    La práctica se entrega como un **notebook** (o script + capturas) y se estructura en **10 apartados obligatorios**: 5 de entorno y cómputo distribuido, 2 de análisis y tolerancia a fallos, y 3 de persistencia, escalado y conclusiones.

!!! info "RECURSOS"
    - Google Colab (o un clúster Hadoop/Spark local mediante Docker Compose).
    - Cuenta gratuita de [ngrok](https://ngrok.com/){:target="_blank"} para exponer la Spark UI.
    - Python 3 con `pyspark` y `findspark`.

## **Entorno y cómputo distribuido** { .seccion }

!!! info ""
    Cada paso del notebook debe explicarse mediante comentarios en el código: no basta con que "funcione".

### 1. Preparación del entorno

**1.1 Instalación**: descarga Spark precompilado, configura `JAVA_HOME` y `SPARK_HOME`, e instala `findspark` y `pyspark`.

**1.2 Sesión**: inicializa un `SparkContext`/`SparkSession`, explicando cada paso mediante comentarios en el código.

### 2. Comprobación del clúster y sus recursos

**2.1 Paralelismo disponible**: antes de ejecutar nada, consulta y documenta cuántos núcleos/particiones tiene disponibles tu `SparkSession` (`spark.sparkContext.defaultParallelism`).

**2.2 Interpretación**: explica por qué esta comprobación es la primera evidencia de que existe un modelo de cómputo distribuido detrás, aunque se ejecute sobre una sola máquina (criterio a).

### 3. Aproximación de π mediante el método de Montecarlo

**3.1 Implementación**: implementa el cálculo de π generando puntos aleatorios.

**3.2 Explicación**: explica en el notebook el problema matemático (relación entre puntos dentro/fuera de un círculo inscrito en un cuadrado) y cómo Spark reparte el trabajo entre particiones.

### 4. Ejecución a gran escala y medición de tiempos

**4.1 Ejecución**: ejecuta el cálculo con al menos 1.000.000 de muestras y mide el tiempo de ejecución con `time`.

**4.2 Variación de particiones**: repite el experimento variando el número de particiones (por ejemplo, 2, 4 y 8), documentando cómo cambia el tiempo total (criterio b: comprobar el poder de procesamiento del modelo distribuido).

### 5. Acceso a la Spark UI

**5.1 Túnel**: crea un túnel público con ngrok y accede a la interfaz web de Spark.

**5.2 Captura obligatoria**: incluye una **captura obligatoria** donde se vean los *Jobs* ejecutados, los *Stages* y el DAG de ejecución. Sin esta captura la actividad no se evalúa.

## **Análisis y tolerancia a fallos** { .seccion }

### 6. Análisis teórico razonado
Responde, dentro del notebook, en texto (no en una sola frase):

**6.1 RDD**: ¿qué es un RDD?

**6.2 Transformaciones y acciones**: ¿cuál es la diferencia entre una transformación y una acción? ¿Qué ocurre internamente durante un `filter` y un `count`?

**6.3 DAG y particiones**: ¿qué información aporta el DAG? ¿Cómo se distribuye el trabajo entre particiones?

### 7. Prueba de tolerancia a fallos

**7.1 Simulación del fallo**: simula un fallo durante la ejecución: reduce el número de núcleos disponibles a mitad del cálculo, o fuerza la pérdida de una partición en memoria.

**7.2 Recuperación**: documenta cómo Spark recalcula esa partición a partir del linaje del RDD sin perder el resultado final (criterio c).

## **Persistencia, escalado y conclusiones** { .seccion }

### 8. Persistencia y reutilización posterior del resultado

**8.1 Persistencia**: guarda el resultado (la estimación de π y los tiempos medidos por configuración) en un fichero Parquet en HDFS, S3 o el sistema de ficheros local.

**8.2 Reutilización**: en una celda **completamente nueva** (simulando otro día de trabajo), léelo de nuevo y calcula una métrica distinta a partir de él (por ejemplo, el error relativo frente al valor real de π). Esto demuestra que el dato almacenado puede explotarse más tarde sin volver a calcularlo desde cero (criterio d).

### 9. Escalado de recursos

**9.1 Escalado**: si usas un clúster Docker propio, añade un *worker* adicional y repite el experimento del apartado 4 con el mismo número de muestras; si trabajas en Colab, aumenta el paralelismo simulando más particiones de las que hay núcleos físicos y documenta el efecto.

**9.2 Comparativa**: compara el tiempo obtenido antes y después de escalar (criterio e).

### 10. Documentación final y entrega
Recopila en una única celda de cierre:

**10.1 Tabla de tiempos**: la tabla de tiempos por configuración.

**10.2 Conclusiones**: las conclusiones de cada criterio de evaluación (a-e) razonadas con tus propios resultados.

**10.3 Spark UI**: un enlace o adjunto a la captura de la Spark UI.

!!! warning "SIN CAPTURAS NO HAY EVALUACIÓN"
    Igual que en el resto de prácticas del módulo, no se evaluará ningún notebook sin comentarios en el código ni sin la captura obligatoria de la Spark UI.

!!! example "ENTREGA"
    - En caso de no indicar lo contrario cada apartado tendrá el mismo valor.
    - Para una calificación correcta se han de seguir las instrucciones del documento “**Pautas del curso**”, que se encuentra en el apartado de recursos del Campus.
    - La entrega debe incluir:
        1. Un único notebook de Google Colab (o script + capturas si se usa un clúster Docker).
        2. Código comentado explicando cada paso.
        3. Captura obligatoria de la Spark UI (Jobs, Stages, DAG).
        4. Tabla comparativa de tiempos de ejecución por configuración de particiones/recursos.
        5. Respuestas razonadas del apartado 6 y conclusiones del apartado 10.
    - Entregar a través del Campus. El nombre del archivo debe ser: “**Apellido1Apellido2Nombre_SPXX**”.
