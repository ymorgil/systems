# **🧪 UT02 · Práctica: procesamiento distribuido con Apache Spark y PySpark**

## Objetivo

Configurar Apache Spark en Google Colab (o en un clúster Docker propio) y comprobar de forma práctica el modelo de computación distribuida: su capacidad de cómputo paralelo, su tolerancia a fallos, la independencia entre almacenamiento y explotación futura del dato, y su capacidad de escalar añadiendo recursos. La práctica se estructura en **10 apartados obligatorios**.

## Materiales

- Google Colab (o un clúster Hadoop/Spark local mediante Docker Compose).
- Cuenta gratuita de [ngrok](https://ngrok.com/){:target="_blank"} para exponer la Spark UI.
- Python 3 con `pyspark` y `findspark`.

## Estructura obligatoria del notebook (o entrega)

### 1. Preparación del entorno

Descarga Spark precompilado, configura `JAVA_HOME` y `SPARK_HOME`, instala `findspark` y `pyspark`, e inicializa un `SparkContext`/`SparkSession`. Cada paso debe explicarse mediante comentarios en el código, no basta con que "funcione".

### 2. Comprobación del clúster y sus recursos

Antes de ejecutar nada, consulta y documenta cuántos núcleos/particiones tiene disponibles tu `SparkSession` (`spark.sparkContext.defaultParallelism`). Esta comprobación es la primera evidencia de que existe un modelo de cómputo distribuido detrás, aunque se ejecute sobre una sola máquina (criterio a).

### 3. Aproximación de π mediante el método de Montecarlo

Implementa el cálculo de π generando puntos aleatorios. Explica en el notebook el problema matemático (relación entre puntos dentro/fuera de un círculo inscrito en un cuadrado) y cómo Spark reparte el trabajo entre particiones.

### 4. Ejecución a gran escala y medición de tiempos

Ejecuta el cálculo con al menos 1.000.000 de muestras. Mide el tiempo de ejecución con `time` y repite el experimento variando el número de particiones (por ejemplo, 2, 4 y 8), documentando cómo cambia el tiempo total (criterio b: comprobar el poder de procesamiento del modelo distribuido).

### 5. Acceso a la Spark UI

Crea un túnel público con ngrok y accede a la interfaz web de Spark. Incluye una **captura obligatoria** donde se vean los *Jobs* ejecutados, los *Stages* y el DAG de ejecución. Sin esta captura la actividad no se evalúa.

### 6. Análisis teórico razonado

Responde, dentro del notebook, en texto (no en una sola frase): ¿qué es un RDD?, ¿cuál es la diferencia entre una transformación y una acción?, ¿qué ocurre internamente durante un `filter` y un `count`?, ¿qué información aporta el DAG?, ¿cómo se distribuye el trabajo entre particiones?

### 7. Prueba de tolerancia a fallos

Simula un fallo durante la ejecución: reduce el número de núcleos disponibles a mitad del cálculo, o fuerza la pérdida de una partición en memoria. Documenta cómo Spark recalcula esa partición a partir del linaje del RDD sin perder el resultado final (criterio c).

### 8. Persistencia y reutilización posterior del resultado

Guarda el resultado (la estimación de π y los tiempos medidos por configuración) en un fichero Parquet en HDFS, S3 o el sistema de ficheros local. A continuación, en una celda **completamente nueva** (simulando otro día de trabajo), léelo de nuevo y calcula una métrica distinta a partir de él (por ejemplo, el error relativo frente al valor real de π). Esto demuestra que el dato almacenado puede explotarse más tarde sin volver a calcularlo desde cero (criterio d).

### 9. Escalado de recursos

Si usas un clúster Docker propio, añade un *worker* adicional y repite el experimento de la Parte 4 con el mismo número de muestras; si trabajas en Colab, aumenta el paralelismo simulando más particiones de las que hay núcleos físicos y documenta el efecto. Compara el tiempo obtenido antes y después de escalar (criterio e).

### 10. Documentación final y entrega

Recopila en una única celda de cierre: la tabla de tiempos por configuración, las conclusiones de cada criterio de evaluación (a-e) razonadas con tus propios resultados, y un enlace o adjunto a la captura de la Spark UI.

## Entregables

1. Un único notebook de Google Colab (o script + capturas si se usa un clúster Docker).
2. Código comentado explicando cada paso.
3. Captura obligatoria de la Spark UI (Jobs, Stages, DAG).
4. Tabla comparativa de tiempos de ejecución por configuración de particiones/recursos.
5. Respuestas razonadas del apartado 6 y conclusiones del apartado 10.

!!! warning "Sin capturas no hay evaluación"
    Igual que en el resto de prácticas del módulo, no se evaluará ningún notebook sin comentarios en el código ni sin la captura obligatoria de la Spark UI.
