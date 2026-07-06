# **🧪 UT03 · Práctica: verificación de integridad y migración de datos entre clústeres**

## Objetivo

Comprobar de forma práctica los mecanismos de integridad de HDFS (sumas de verificación y réplicas), provocar y detectar una corrupción de datos, migrar datos entre dos clústeres documentando el tratamiento de sus metadatos, y complementar la verificación a nivel de bytes con un control de calidad a nivel de contenido. La práctica se estructura en **10 apartados obligatorios**.

## Materiales

- El clúster Hadoop desplegado en la UT02 (o uno equivalente).
- Un segundo clúster (una segunda instancia `docker-compose` con otro rango de puertos) como destino de la migración.
- Python 3 con `pandas` para el control de calidad de datos.

## Estructura obligatoria de la práctica

### 1. Preparación del entorno

Levanta el clúster Hadoop origen (reutilizando el de la UT02) y un segundo clúster Hadoop destino con `docker-compose`, en un rango de puertos distinto. Documenta la configuración de ambos.

### 2. Selección y carga del conjunto de datos

Sube a HDFS, en el clúster origen, un fichero de datos tabular (CSV o Parquet) de al menos varios MB, generado o descargado por ti mismo.

### 3. Comprobación inicial de integridad

Ejecuta `hdfs fsck /datos --files --blocks --locations` y documenta cuántos bloques tiene el fichero y en qué DataNodes vive cada réplica. Consulta el checksum del fichero con `hdfs dfs -checksum` y anótalo.

### 4. Documentación de la arquitectura de réplicas

A partir de la salida del apartado anterior, dibuja o describe (con tus propias palabras, no copiando la salida en bruto) en qué DataNodes y racks quedan repartidas las réplicas de cada bloque, y explica si la distribución es coherente con la política *rack-aware* vista en el temario.

### 5. Provocar una corrupción real

Accede directamente al contenedor de un DataNode y localiza en disco el fichero físico de un bloque, fuera de las herramientas de Hadoop. Modifica manualmente un byte con un editor hexadecimal o `dd`, simulando una corrupción real de hardware.

### 6. Detección y recuperación

Vuelve a ejecutar `hdfs fsck /datos` y comprueba que Hadoop marca ese bloque como `CORRUPT`, sirviendo igualmente el fichero completo gracias a las réplicas sanas. Documenta cuánto tarda el sistema en detectar la corrupción y en restablecer el factor de replicación completo.

### 7. Migración entre clústeres con DistCp

Copia el conjunto de datos del clúster origen al clúster destino usando `distcp`. Verifica en el destino que el checksum de cada fichero migrado coincide con el del origen.

### 8. Reflexión sobre metadatos

Explica, con tus propias palabras, qué ocurriría si en vez de usar `distcp` se hubiera copiado solo el contenido físico de los discos de los DataNodes sin pasar por el NameNode del destino: ¿sería un clúster funcional? Relaciona tu respuesta con los conceptos de `fsimage` y `edits log`.

### 9. Control de calidad de contenido más allá del checksum

Con el dataset del apartado 2, escribe un script en Python que compruebe al menos tres reglas de calidad de contenido (por ejemplo: rango razonable de una columna de fechas, ausencia de duplicados en una columna clave, porcentaje de nulos por debajo de un umbral). Ejecuta el script y genera un informe con el resultado de cada regla.

### 10. Informe final integrador

Redacta un informe que distinga explícitamente entre "integridad a nivel de bytes" (checksum, detectado en los apartados 3-6) y "calidad a nivel de contenido" (reglas de negocio, apartado 9), explicando por qué un sistema Big Data necesita ambas y cuál de las dos detectaría cada uno de los siguientes problemas: un bloque con un bit invertido, una columna de fechas con el año 2099, y una columna de identificador con valores repetidos.

## Entregables

1. Salida de `hdfs fsck` antes y después de la corrupción provocada.
2. Checksums del fichero en origen y en destino tras la migración.
3. Script de comprobación de calidad de datos (apartado 9) y su informe de resultados.
4. Informe final integrador (apartado 10).
