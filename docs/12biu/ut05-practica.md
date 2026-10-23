# 🧪 Supuesto Práctico UT05 *Cuadro de mando de negocio con Power BI* { .card }

!!! info "OBJETIVOS"
    Aplicar el proceso KDD completo, desde la selección de datos estructurados y no estructurados hasta la construcción y validación de un cuadro de mando en Power BI, simulando la implantación de un modelo de Inteligencia de Negocio real.

    La práctica se estructura en **10 apartados obligatorios**: 3 de definición y selección de datos, 4 de preparación, modelado y minería, y 3 de cuadro de mando y validación.

!!! info "RECURSOS"
    - Power BI Desktop (gratuito).
    - El data lake construido en la UT01 (o, en su defecto, un dataset abierto nuevo con al menos dos fuentes distintas).
    - Una fuente de datos no estructurada o semiestructurada complementaria (por ejemplo, un fichero JSON de reseñas o menciones en redes sociales, o un texto libre a analizar).

## **Definición y selección de datos** { .seccion }

### 1. Formación de equipo y definición del objetivo de negocio

**1.1 Equipo**: trabaja individualmente o en pareja.

**1.2 Pregunta de negocio**: antes de tocar ningún dato, redacta en una frase la **pregunta de negocio** que el cuadro de mando debe responder (por ejemplo: "¿en qué categorías de producto y meses del año deberíamos reforzar el stock?").

### 2. Selección de fuentes de datos

**2.1 Fuentes**: selecciona al menos dos fuentes de datos estructuradas (pueden ser las de la UT01) y una fuente no estructurada o semiestructurada relacionada con la misma pregunta de negocio.

**2.2 Justificación**: justifica por qué cada fuente aporta valor a la pregunta planteada.

### 3. Preparación del entorno

**3.1 Power BI Desktop**: instala y configura Power BI Desktop.

**3.2 Modo de conexión**: si vas a conectar contra el data lake de la UT01, documenta si usarás modo importación o DirectQuery y justifica la elección.

## **Preparación, modelado y minería** { .seccion }

### 4. Ingesta y conexión de datos

**4.1 Conexión**: conecta Power BI a cada una de las fuentes seleccionadas mediante Power Query.

**4.2 Conectores**: documenta los conectores utilizados en cada caso.

### 5. Limpieza y transformación con Power Query

**5.1 Transformaciones**: aplica en Power Query al menos tres transformaciones justificadas (tipos de datos, columnas calculadas, eliminación de filas inválidas, combinación de tablas de distintas fuentes).

### 6. Modelado de datos y medidas DAX

**6.1 Modelo relacional**: diseña un modelo relacional (idealmente en esquema de estrella) entre las tablas cargadas.

**6.2 Medidas DAX**: crea al menos tres medidas DAX con significado de negocio (no simples sumas triviales; por ejemplo, una variación porcentual respecto al periodo anterior).

### 7. Minería de datos básica

**7.1 Técnica**: aplica al menos una técnica sencilla de minería sobre los datos (una segmentación manual tipo RFM, una agrupación por categorías con `TOPN`, o un cálculo de tendencia).

**7.2 KDD**: explica qué pregunta del proceso KDD responde esta fase.

## **Cuadro de mando y validación** { .seccion }

### 8. Construcción del cuadro de mando

**8.1 Visualizaciones**: diseña un informe de Power BI con al menos cuatro visualizaciones distintas que respondan directamente a la pregunta de negocio del apartado 1.

**8.2 Filtro interactivo**: incluye al menos un filtro interactivo (segmentación de datos).

### 9. Validación del modelo

**9.1 Verificación independiente**: elige tres cifras clave del cuadro de mando y verifícalas de forma independiente (una consulta manual sobre el origen, un cálculo en una hoja de cálculo, o una consulta SQL directa).

**9.2 Resultado**: documenta si coinciden y, si no, investiga por qué.

### 10. Presentación final y reflexión de negocio

**10.1 Presentación**: presenta el cuadro de mando terminado respondiendo explícitamente a la pregunta de negocio planteada en el apartado 1.

**10.2 Reflexión**: incluye una reflexión escrita sobre qué decisión concreta tomaría una empresa real a partir de este análisis, y qué información adicional necesitaría para tomarla con más confianza.

!!! example "ENTREGA"
    - En caso de no indicar lo contrario cada apartado tendrá el mismo valor.
    - Para una calificación correcta se han de seguir las instrucciones del documento “**Pautas del curso**”, que se encuentra en el apartado de recursos del Campus.
    - La entrega debe incluir:
        1. Fichero `.pbix` del informe de Power BI.
        2. Documentación de las fuentes de datos y transformaciones aplicadas (apartados 2, 4 y 5).
        3. Las tres medidas DAX creadas, con una breve explicación de cada una.
        4. Informe de validación (apartado 9) y reflexión final de negocio (apartado 10).
    - Entregar un documento **“pdf”** a través del Campus, junto con el fichero `.pbix`. El nombre del archivo debe ser: “**Apellido1Apellido2Nombre_SPXX**”.
