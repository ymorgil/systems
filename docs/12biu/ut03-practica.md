# 🧪 Supuesto Práctico UT03 *Integridad y migración de datos entre clústeres* { .card }

!!! info "OBJETIVOS"
    Comprobar de forma práctica los mecanismos de integridad de HDFS (sumas de verificación y réplicas), provocar y detectar una corrupción de datos, migrar datos entre dos clústeres documentando el tratamiento de sus metadatos, y complementar la verificación a nivel de bytes con un control de calidad a nivel de contenido.

    La práctica se estructura en **10 apartados obligatorios**: 4 de integridad en HDFS, 2 de corrupción y recuperación, y 4 de migración y calidad del dato.

!!! info "RECURSOS"
    - El clúster Hadoop desplegado en la UT02 (o uno equivalente).
    - Un segundo clúster (una segunda instancia `docker-compose` con otro rango de puertos) como destino de la migración.
    - Python 3 con `pandas` para el control de calidad de datos.

## **Integridad en HDFS** { .seccion }

### 1. Preparación del entorno

**1.1 Clúster origen**: levanta el clúster Hadoop origen (reutilizando el de la UT02).

**1.2 Clúster destino**: levanta un segundo clúster Hadoop destino con `docker-compose`, en un rango de puertos distinto.

**1.3 Configuración**: documenta la configuración de ambos.

### 2. Selección y carga del conjunto de datos

**2.1 Carga en HDFS**: sube a HDFS, en el clúster origen, un fichero de datos tabular (CSV o Parquet) de al menos varios MB, generado o descargado por ti mismo.

### 3. Comprobación inicial de integridad

**3.1 Bloques y réplicas**: ejecuta `hdfs fsck /datos --files --blocks --locations` y documenta cuántos bloques tiene el fichero y en qué DataNodes vive cada réplica.

**3.2 Checksum**: consulta el checksum del fichero con `hdfs dfs -checksum` y anótalo.

### 4. Documentación de la arquitectura de réplicas

**4.1 Reparto de réplicas**: a partir de la salida del apartado anterior, dibuja o describe (con tus propias palabras, no copiando la salida en bruto) en qué DataNodes y racks quedan repartidas las réplicas de cada bloque.

**4.2 Política *rack-aware***: explica si la distribución es coherente con la política *rack-aware* vista en el temario.

## **Corrupción y recuperación** { .seccion }

### 5. Provocar una corrupción real

**5.1 Bloque físico**: accede directamente al contenedor de un DataNode y localiza en disco el fichero físico de un bloque, fuera de las herramientas de Hadoop.

**5.2 Corrupción**: modifica manualmente un byte con un editor hexadecimal o `dd`, simulando una corrupción real de hardware.

### 6. Detección y recuperación

**6.1 Detección**: vuelve a ejecutar `hdfs fsck /datos` y comprueba que Hadoop marca ese bloque como `CORRUPT`, sirviendo igualmente el fichero completo gracias a las réplicas sanas.

**6.2 Tiempos**: documenta cuánto tarda el sistema en detectar la corrupción y en restablecer el factor de replicación completo.

## **Migración y calidad del dato** { .seccion }

### 7. Migración entre clústeres con DistCp

**7.1 Migración**: copia el conjunto de datos del clúster origen al clúster destino usando `distcp`.

**7.2 Verificación**: verifica en el destino que el checksum de cada fichero migrado coincide con el del origen.

### 8. Reflexión sobre metadatos

**8.1 Copia física sin NameNode**: explica, con tus propias palabras, qué ocurriría si en vez de usar `distcp` se hubiera copiado solo el contenido físico de los discos de los DataNodes sin pasar por el NameNode del destino: ¿sería un clúster funcional?

**8.2 `fsimage` y `edits log`**: relaciona tu respuesta con los conceptos de `fsimage` y `edits log`.

### 9. Control de calidad de contenido más allá del checksum

**9.1 Script de calidad**: con el dataset del apartado 2, escribe un script en Python que compruebe al menos tres reglas de calidad de contenido (por ejemplo: rango razonable de una columna de fechas, ausencia de duplicados en una columna clave, porcentaje de nulos por debajo de un umbral).

**9.2 Informe**: ejecuta el script y genera un informe con el resultado de cada regla.

### 10. Informe final integrador

**10.1 Bytes frente a contenido**: redacta un informe que distinga explícitamente entre "integridad a nivel de bytes" (checksum, detectado en los apartados 3-6) y "calidad a nivel de contenido" (reglas de negocio, apartado 9), explicando por qué un sistema Big Data necesita ambas.

**10.2 Casos concretos**: indica cuál de las dos detectaría cada uno de los siguientes problemas: un bloque con un bit invertido, una columna de fechas con el año 2099, y una columna de identificador con valores repetidos.

!!! example "ENTREGA"
    - En caso de no indicar lo contrario cada apartado tendrá el mismo valor.
    - Para una calificación correcta se han de seguir las instrucciones del documento “**Pautas del curso**”, que se encuentra en el apartado de recursos del Campus.
    - La entrega debe incluir:
        1. Salida de `hdfs fsck` antes y después de la corrupción provocada.
        2. Checksums del fichero en origen y en destino tras la migración.
        3. Script de comprobación de calidad de datos (apartado 9) y su informe de resultados.
        4. Informe final integrador (apartado 10).
    - Entregar un documento **“pdf”** a través del Campus. El nombre del archivo debe ser: “**Apellido1Apellido2Nombre_SPXX**”.
