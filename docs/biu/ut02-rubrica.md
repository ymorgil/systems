# **📋 UT02 · Rúbrica de evaluación**

Rúbrica de comprobación de la práctica *Procesamiento distribuido con Apache Spark y PySpark*. Para cada uno de los 10 apartados se comprueban 4 elementos (Sí/No).

### Apartado 1 · Preparación del entorno

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Spark se descarga y configura correctamente (`JAVA_HOME`, `SPARK_HOME`) | | |
| 2 | Se instalan `findspark` y `pyspark` | | |
| 3 | Se inicializa correctamente el `SparkContext`/`SparkSession` | | |
| 4 | Cada paso está comentado explicando qué hace | | |

### Apartado 2 · Comprobación del clúster y sus recursos

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se consulta el paralelismo por defecto disponible | | |
| 2 | El resultado se documenta explícitamente en el notebook | | |
| 3 | Se relaciona el número de particiones con el número de núcleos | | |
| 4 | Se explica por qué esto evidencia cómputo distribuido | | |

### Apartado 3 · Aproximación de π mediante Montecarlo

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se implementa correctamente el algoritmo de Montecarlo | | |
| 2 | Se explica el problema matemático subyacente | | |
| 3 | Se explica cómo Spark reparte el trabajo entre particiones | | |
| 4 | El código está comentado | | |

### Apartado 4 · Ejecución a gran escala y medición de tiempos

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se ejecuta con al menos 1.000.000 de muestras | | |
| 2 | Se mide el tiempo de ejecución | | |
| 3 | Se repite variando el número de particiones (al menos 3 configuraciones) | | |
| 4 | Se documentan los tiempos obtenidos en una tabla | | |

### Apartado 5 · Acceso a la Spark UI

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se crea el túnel público con ngrok | | |
| 2 | Se accede correctamente a la interfaz web de Spark | | |
| 3 | La captura muestra Jobs y Stages | | |
| 4 | La captura muestra el DAG de ejecución | | |

### Apartado 6 · Análisis teórico razonado

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se responde correctamente qué es un RDD | | |
| 2 | Se explica la diferencia entre transformación y acción | | |
| 3 | Se explica qué ocurre durante `filter` y `count` | | |
| 4 | Se explica qué muestra el DAG y cómo se reparte el trabajo | | |

### Apartado 7 · Prueba de tolerancia a fallos

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se provoca una simulación real de fallo (no solo se describe) | | |
| 2 | Se observa la recuperación mediante el linaje del RDD | | |
| 3 | El resultado final es correcto pese al fallo simulado | | |
| 4 | Se documenta el proceso con evidencias (logs o capturas) | | |

### Apartado 8 · Persistencia y reutilización posterior del resultado

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El resultado se guarda en Parquet en HDFS/S3/local | | |
| 2 | Se recupera en una celda independiente | | |
| 3 | Se calcula una métrica nueva sin recomputar desde el origen | | |
| 4 | Se explica por qué esto demuestra independencia almacenamiento/uso | | |

### Apartado 9 · Escalado de recursos

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se añade un worker o se incrementa el paralelismo disponible | | |
| 2 | Se repite el experimento con la nueva configuración | | |
| 3 | Se compara el tiempo antes/después de escalar | | |
| 4 | La comparación se documenta con datos, no solo impresiones | | |

### Apartado 10 · Documentación final y entrega

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe una tabla resumen de tiempos por configuración | | |
| 2 | Se incluyen conclusiones razonadas para cada criterio (a-e) | | |
| 3 | Se adjunta la captura de la Spark UI | | |
| 4 | El notebook se entrega como una única pieza autocontenida | | |

## Calificación

Cada elemento marcado "Sí" suma un punto (máximo 40). La nota sobre 10 es el total dividido entre 4. Para superar la unidad se exige un mínimo de 20/40 puntos y al menos 2 de los 4 elementos marcados en cada apartado. El apartado 5 (captura de la Spark UI) es de cumplimiento obligatorio: si sus 4 elementos están en "No", la práctica no se evalúa, independientemente de la puntuación del resto.
