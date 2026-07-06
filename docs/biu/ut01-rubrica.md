# **📋 UT01 · Rúbrica de evaluación**

Rúbrica de comprobación de la práctica *Construcción de un pequeño Data Lake en la nube*. Para cada uno de los 10 apartados obligatorios se comprueban **4 elementos**: cada elemento se marca como presente (Sí) o ausente (No). No hay términos medios: o la evidencia está en la entrega, o no lo está.

### Apartado 1 · Formación de equipos y elección de rol

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se indica si el trabajo es individual o en pareja | | |
| 2 | Si es en pareja, cada integrante tiene un rol diferenciado | | |
| 3 | Los roles se han rotado a mitad de la práctica (si aplica) | | |
| 4 | Queda constancia escrita de quién ha hecho cada parte | | |

### Apartado 2 · Búsqueda y selección del conjunto de datos

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El dataset tiene al menos 50.000 filas | | |
| 2 | Existe al menos una columna de fecha | | |
| 3 | Existe al menos una columna categórica con pocos valores distintos | | |
| 4 | Se documentan la fuente y la licencia de uso del dataset | | |

### Apartado 3 · Preparación del entorno de trabajo

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se ha creado el bucket S3 con nombre único | | |
| 2 | Existe la carpeta `raw/` | | |
| 3 | Existe la carpeta `processed/` | | |
| 4 | La estructura de carpetas queda documentada en el informe | | |

### Apartado 4 · Ingesta del dato en bruto

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El CSV original se sube sin modificar a `raw/` | | |
| 2 | Se anota el tamaño del fichero | | |
| 3 | Se anota el número de filas | | |
| 4 | No se ha sobrescrito ningún dato en bruto previo | | |

### Apartado 5 · Justificación teórica del formato elegido

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe un párrafo de justificación del formato de destino | | |
| 2 | Se compara explícitamente con mantener el CSV original | | |
| 3 | Se menciona el coste de lectura/escaneo | | |
| 4 | Se menciona la compresión obtenida | | |

### Apartado 6 · Transformación y conversión de formato

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se aplican al menos tres transformaciones de limpieza | | |
| 2 | Cada transformación está justificada | | |
| 3 | El resultado se guarda en formato Parquet | | |
| 4 | El Parquet está particionado por una columna relevante | | |

### Apartado 7 · Catalogación y consulta

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe una tabla externa en el Glue Data Catalog | | |
| 2 | Se ejecutan al menos tres consultas SQL en Athena | | |
| 3 | Las consultas tienen sentido de negocio (no `SELECT *`) | | |
| 4 | Se anota el dato escaneado de cada consulta | | |

### Apartado 8 · Documentación del proceso mediante capturas

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Captura de la estructura de carpetas en S3 | | |
| 2 | Captura de la tabla creada en Glue | | |
| 3 | Captura de cada consulta en Athena con su resultado | | |
| 4 | Las capturas están comentadas o explicadas en el texto | | |

### Apartado 9 · Análisis de resultados y comparación cuantitativa

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se compara el tamaño en disco del CSV frente al Parquet | | |
| 2 | Se compara el dato escaneado real frente al estimado sin particionar | | |
| 3 | Se extraen al menos dos conclusiones de negocio | | |
| 4 | Las conclusiones se apoyan en los datos obtenidos, no en opiniones | | |

### Apartado 10 · Entrega final e informe para el cliente

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe un informe final dirigido al cliente | | |
| 2 | El lenguaje del informe es comprensible para un perfil no técnico | | |
| 3 | El informe incluye la comparación CSV vs. Parquet | | |
| 4 | Se entregan todos los artefactos: script, capturas e informe | | |

## Calificación

Cada elemento marcado "Sí" suma un punto (máximo 40 puntos). La calificación sobre 10 se obtiene dividiendo el total entre 4. Para superar la unidad es necesario alcanzar al menos 20 de los 40 elementos y tener, como mínimo, 2 de los 4 elementos marcados en cada uno de los 10 apartados (ningún apartado puede quedar completamente vacío).
