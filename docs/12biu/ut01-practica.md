# 🧪 Supuesto Práctico UT01 *Construcción de un pequeño Data Lake en la nube* { .card }

!!! info "OBJETIVOS"
    Diseñar y construir una solución mínima de almacenamiento Big Data en AWS, aplicando todo el ciclo visto en el temario: ingestión de un dataset en bruto, elección de un formato de almacenamiento adecuado, transformación de los datos y presentación de resultados mediante consultas SQL serverless.

    La práctica se estructura en **10 apartados obligatorios**, que se corresponden con los cinco criterios de evaluación de la UT (diseño, ingestión, formato, procesamiento y presentación): 4 de diseño e ingesta, 3 de almacenamiento y procesamiento, y 3 de presentación de resultados.

!!! info "RECURSOS"
    - Cuenta de AWS (nivel gratuito es suficiente).
    - Un dataset CSV de datos abiertos de al menos 50.000 filas (consulta la página de [Recursos](99-recursos.md)).
    - Python 3 con `pandas` y `pyarrow` (o `awswrangler`), local o en Google Colab.

## **Diseño e ingesta del dato** { .seccion }

### 1. Formación de equipos y elección de rol
La práctica puede realizarse de forma individual o en parejas.

**1.1 Reparto de roles**: si se realiza en pareja, cada integrante debe asumir un rol claro: una persona centrada en la infraestructura (S3, Glue) y otra en la transformación de datos (script Python).

**1.2 Rotación**: rotad los roles a mitad de la práctica.

### 2. Búsqueda y selección del conjunto de datos

**2.1 Dataset**: localiza un dataset CSV de datos abiertos (portal estatal, autonómico o Kaggle) de al menos 50.000 filas.

**2.2 Columnas necesarias**: debe tener al menos una columna de fecha y una columna categórica con pocos valores distintos (para poder particionar más adelante).

**2.3 Fuente y licencia**: documenta la fuente y su licencia de uso.

### 3. Preparación del entorno de trabajo

**3.1 Bucket S3**: crea un bucket S3 con nombre único (`biu-datalake-<tus-iniciales>`).

**3.2 Estructura de carpetas**: crea la siguiente estructura, separando siempre el dato en bruto del procesado:

```
s3://biu-datalake-xxx/raw/<dataset>/
s3://biu-datalake-xxx/processed/<dataset>/
```

### 4. Ingesta del dato en bruto

**4.1 Subida a `raw/`**: sube el CSV original, sin modificarlo, a la carpeta `raw/`. Esta carpeta representa la "zona de aterrizaje" (*landing zone*): nunca se escribe encima de un dato en bruto.

**4.2 Métricas iniciales**: anota el tamaño del fichero y el número de filas.

## **Almacenamiento y procesamiento** { .seccion }

### 5. Justificación teórica del formato de almacenamiento elegido

**5.1 Justificación**: antes de tocar el dato, redacta un párrafo (5-10 líneas) explicando qué formato de almacenamiento de destino vas a usar (Parquet) y por qué, comparándolo con mantener el CSV original, en términos de coste de lectura y de compresión.

### 6. Transformación y conversión de formato

**6.1 Limpieza**: con `pandas`, carga el CSV y aplica al menos tres transformaciones de limpieza justificadas (nulos, tipos de fecha, duplicados).

**6.2 Conversión a Parquet**: guarda el resultado en formato Parquet, particionado por al menos una columna relevante, y súbelo a `processed/`:

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

**7.1 Catálogo**: da de alta una tabla externa sobre `processed/` usando **AWS Glue Data Catalog** (a mano o mediante un *crawler*).

**7.2 Consultas en Athena**: desde **Amazon Athena**, ejecuta al menos tres consultas SQL con sentido de negocio: una agregación por la columna de partición, un `TOP 10` sobre una categoría, y una consulta que combine filtro y agregación.

## **Presentación de resultados** { .seccion }

### 8. Documentación del proceso mediante capturas

**8.1 S3 y Glue**: recoge capturas de la estructura de carpetas en S3 y de la tabla creada en Glue.

**8.2 Athena**: recoge capturas de cada una de las tres consultas ejecutadas en Athena junto con el **dato escaneado** que muestra cada una (para poder compararlo con lo que se habría escaneado consultando directamente el CSV sin particionar).

### 9. Análisis de resultados y comparación cuantitativa

**9.1 Tamaño en disco**: compara el tamaño en disco del CSV original frente al Parquet resultante.

**9.2 Dato escaneado**: compara el dato escaneado por Athena en cada consulta frente a una estimación de lo que escanearía sobre el CSV sin particionar ni convertir.

**9.3 Conclusiones de negocio**: extrae al menos dos conclusiones de negocio de las consultas ejecutadas (no solo técnicas).

### 10. Entrega final e informe para el cliente

**10.1 Informe**: redacta un informe breve (máximo una página), dirigido a "el cliente" en lenguaje no técnico, con las conclusiones de negocio de las tres consultas y una comparación honesta entre el coste/rendimiento de trabajar con CSV frente a Parquet particionado.

**10.2 Entrega conjunta**: entrega el informe junto con el script/notebook y las capturas del apartado 8.

!!! tip "SI NO DISPONES DE CUENTA AWS"
    La misma práctica puede resolverse de forma equivalente con **DuckDB** en local (sustituyendo S3 por el sistema de ficheros y Athena por `duckdb.sql(...)` sobre los ficheros Parquet), manteniendo los 10 apartados y los mismos entregables.

!!! example "ENTREGA"
    - En caso de no indicar lo contrario cada apartado tendrá el mismo valor.
    - Para una calificación correcta se han de seguir las instrucciones del documento “**Pautas del curso**”, que se encuentra en el apartado de recursos del Campus.
    - La entrega debe incluir:
        1. Script o notebook con el proceso de limpieza y conversión a Parquet.
        2. Capturas de S3, Glue y Athena (apartado 8).
        3. Las tres consultas SQL ejecutadas junto con su resultado y el dato escaneado.
        4. Informe final para el cliente (apartado 10).
    - Entregar un documento **“pdf”** a través del Campus. El nombre del archivo debe ser: “**Apellido1Apellido2Nombre_SPXX**”.
