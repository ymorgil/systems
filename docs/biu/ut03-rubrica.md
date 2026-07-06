# **📋 UT03 · Rúbrica de evaluación**

Rúbrica de comprobación de la práctica *Verificación de integridad y migración de datos entre clústeres*. Para cada uno de los 10 apartados se comprueban 4 elementos (Sí/No).

### Apartado 1 · Preparación del entorno

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El clúster origen está operativo | | |
| 2 | El clúster destino está operativo en un rango de puertos distinto | | |
| 3 | Ambas configuraciones están documentadas | | |
| 4 | Los dos clústeres son accesibles simultáneamente | | |

### Apartado 2 · Selección y carga del conjunto de datos

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El fichero subido tiene un tamaño significativo (varios MB) | | |
| 2 | Se sube correctamente a HDFS en el clúster origen | | |
| 3 | El formato del fichero es coherente con lo visto en el temario | | |
| 4 | Se documenta el origen del dataset | | |

### Apartado 3 · Comprobación inicial de integridad

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se ejecuta `hdfs fsck` con las opciones `--files --blocks --locations` | | |
| 2 | Se documenta el número de bloques del fichero | | |
| 3 | Se consulta y anota el checksum del fichero | | |
| 4 | La salida se adjunta como evidencia | | |

### Apartado 4 · Documentación de la arquitectura de réplicas

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se identifica en qué DataNodes vive cada réplica | | |
| 2 | Se describe la distribución con palabras propias (no solo la salida en bruto) | | |
| 3 | Se relaciona la distribución con la política *rack-aware* | | |
| 4 | La explicación es coherente con lo observado | | |

### Apartado 5 · Provocar una corrupción real

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se accede al fichero físico del bloque fuera de las herramientas Hadoop | | |
| 2 | Se modifica realmente un byte del fichero | | |
| 3 | La modificación se realiza sobre una réplica identificada previamente | | |
| 4 | El proceso queda documentado paso a paso | | |

### Apartado 6 · Detección y recuperación

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | `hdfs fsck` marca el bloque como `CORRUPT` | | |
| 2 | El fichero sigue siendo accesible pese a la corrupción | | |
| 3 | Se documenta el tiempo de detección | | |
| 4 | Se documenta el tiempo de restablecimiento del factor de replicación | | |

### Apartado 7 · Migración entre clústeres con DistCp

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se ejecuta `distcp` entre origen y destino | | |
| 2 | La migración se completa sin errores | | |
| 3 | Se consulta el checksum en destino | | |
| 4 | El checksum coincide con el de origen | | |

### Apartado 8 · Reflexión sobre metadatos

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se explica correctamente el papel de `fsimage` | | |
| 2 | Se explica correctamente el papel del `edits log` | | |
| 3 | Se razona qué ocurriría copiando solo los datos físicos | | |
| 4 | La conclusión es coherente con la arquitectura de HDFS explicada en el temario | | |

### Apartado 9 · Control de calidad de contenido

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se implementan al menos tres reglas de calidad | | |
| 2 | Cada regla está justificada | | |
| 3 | El script se ejecuta correctamente sobre el dataset | | |
| 4 | Se genera un informe con el resultado de cada regla | | |

### Apartado 10 · Informe final integrador

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se distingue explícitamente integridad de bytes vs. calidad de contenido | | |
| 2 | Se explica qué detecta cada mecanismo con los tres ejemplos propuestos | | |
| 3 | El informe está redactado de forma clara y ordenada | | |
| 4 | Se entregan todos los artefactos de los apartados anteriores | | |

## Calificación

Cada elemento marcado "Sí" suma un punto (máximo 40). La nota sobre 10 es el total dividido entre 4. Para superar la unidad se exige un mínimo de 20/40 puntos y al menos 2 de los 4 elementos marcados en cada apartado.
