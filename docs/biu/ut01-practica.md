# **🧪 UT01 · Práctica: construcción de un pequeño Data Lake en la nube**

## Objetivo

Diseñar y construir una solución mínima de almacenamiento Big Data en AWS, aplicando todo el ciclo visto en el temario: ingestión de un dataset en bruto, elección de un formato de almacenamiento adecuado, transformación de los datos y presentación de resultados mediante consultas SQL serverless. La práctica se estructura en **10 apartados obligatorios**, que se corresponden con los cinco criterios de evaluación de la UT (diseño, ingestión, formato, procesamiento y presentación).

## Materiales

- Cuenta de AWS (nivel gratuito es suficiente).
- Un dataset CSV de datos abiertos de al menos 50.000 filas (consulta la página de [Recursos](99-recursos.md)).
- Python 3 con `pandas` y `pyarrow` (o `awswrangler`), local o en Google Colab.

## Estructura obligatoria de la práctica

### 1. Formación de equipos y elección de rol

La práctica puede realizarse de forma individual o en parejas. Si se realiza en pareja, cada integrante debe asumir un rol claro: una persona centrada en la infraestructura (S3, Glue) y otra en la transformación de datos (script Python), rotando roles a mitad de la práctica.

### 2. Búsqueda y selección del conjunto de datos

Localiza un dataset CSV de datos abiertos (portal estatal, autonómico o Kaggle) de al menos 50.000 filas. Debe tener al menos una columna de fecha y una columna categórica con pocos valores distintos (para poder particionar más adelante). Documenta la fuente y su licencia de uso.

### 3. Preparación del entorno de trabajo

Crea un bucket S3 con nombre único (`biu-datalake-<tus-iniciales>`) y la siguiente estructura de carpetas, separando siempre el dato en bruto del procesado:

```
s3://biu-datalake-xxx/raw/<dataset>/
s3://biu-datalake-xxx/processed/<dataset>/
```

### 4. Ingesta del dato en bruto

Sube el CSV original, sin modificarlo, a la carpeta `raw/`. Esta carpeta representa la "zona de aterrizaje" (*landing zone*): nunca se escribe encima de un dato en bruto. Anota el tamaño del fichero y el número de filas.

### 5. Justificación teórica del formato de almacenamiento elegido

Antes de tocar el dato, redacta un párrafo (5-10 líneas) explicando qué formato de almacenamiento de destino vas a usar (Parquet) y por qué, comparándolo con mantener el CSV original, en términos de coste de lectura y de compresión.

### 6. Transformación y conversión de formato

Con `pandas`, carga el CSV y aplica al menos tres transformaciones de limpieza justificadas (nulos, tipos de fecha, duplicados). Guarda el resultado en formato Parquet, particionado por al menos una columna relevante, y súbelo a `processed/`:

```python
import pandas as pd

df = pd.read_csv("raw_dataset.csv")
# ... limpieza ...
df.to_parquet(
    "s3://biu-datalake-xxx/processed/<dataset>/",
    partition_cols=["anio"],
    index=False,
)
```

### 7. Catalogación y consulta

Da de alta una tabla externa sobre `processed/` usando **AWS Glue Data Catalog** (a mano o mediante un *crawler*). Desde **Amazon Athena**, ejecuta al menos tres consultas SQL con sentido de negocio (una agregación por la columna de partición, un `TOP 10` sobre una categoría, y una consulta que combine filtro y agregación).

### 8. Documentación del proceso mediante capturas

Recoge capturas de: la estructura de carpetas en S3, la tabla creada en Glue, y cada una de las tres consultas ejecutadas en Athena junto con el **dato escaneado** que muestra cada una (para poder compararlo con lo que se habría escaneado consultando directamente el CSV sin particionar).

### 9. Análisis de resultados y comparación cuantitativa

Compara el tamaño en disco del CSV original frente al Parquet resultante, y el dato escaneado por Athena en cada consulta frente a una estimación de lo que escanearía sobre el CSV sin particionar ni convertir. Extrae al menos dos conclusiones de negocio de las consultas ejecutadas (no solo técnicas).

### 10. Entrega final e informe para el cliente

Redacta un informe breve (máximo una página), dirigido a "el cliente" en lenguaje no técnico, con las conclusiones de negocio de las tres consultas y una comparación honesta entre el coste/rendimiento de trabajar con CSV frente a Parquet particionado. Entrega el informe junto con el script/notebook y las capturas del apartado 8.

## Entregables

1. Script o notebook con el proceso de limpieza y conversión a Parquet.
2. Capturas de S3, Glue y Athena (apartado 8).
3. Las tres consultas SQL ejecutadas junto con su resultado y el dato escaneado.
4. Informe final para el cliente (apartado 10).

!!! tip "Si no dispones de cuenta AWS"
    La misma práctica puede resolverse de forma equivalente con **DuckDB** en local (sustituyendo S3 por el sistema de ficheros y Athena por `duckdb.sql(...)` sobre los ficheros Parquet), manteniendo los 10 apartados y los mismos entregables.
