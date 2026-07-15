# **🧪 UT05 · Práctica: cuadro de mando de negocio con Power BI**

## Objetivo

Aplicar el proceso KDD completo, desde la selección de datos estructurados y no estructurados hasta la construcción y validación de un cuadro de mando en Power BI, simulando la implantación de un modelo de Inteligencia de Negocio real. La práctica se estructura en **10 apartados obligatorios**.

## Materiales

- Power BI Desktop (gratuito).
- El data lake construido en la UT01 (o, en su defecto, un dataset abierto nuevo con al menos dos fuentes distintas).
- Una fuente de datos no estructurada o semiestructurada complementaria (por ejemplo, un fichero JSON de reseñas o menciones en redes sociales, o un texto libre a analizar).

## Estructura obligatoria de la práctica

### 1. Formación de equipo y definición del objetivo de negocio

Trabaja individualmente o en pareja. Antes de tocar ningún dato, redacta en una frase la **pregunta de negocio** que el cuadro de mando debe responder (por ejemplo: "¿en qué categorías de producto y meses del año deberíamos reforzar el stock?").

### 2. Selección de fuentes de datos

Selecciona al menos dos fuentes de datos estructuradas (pueden ser las de la UT01) y una fuente no estructurada o semiestructurada relacionada con la misma pregunta de negocio. Justifica por qué cada fuente aporta valor a la pregunta planteada.

### 3. Preparación del entorno

Instala y configura Power BI Desktop. Si vas a conectar contra el data lake de la UT01, documenta si usarás modo importación o DirectQuery y justifica la elección.

### 4. Ingesta y conexión de datos

Conecta Power BI a cada una de las fuentes seleccionadas mediante Power Query. Documenta los conectores utilizados en cada caso.

### 5. Limpieza y transformación con Power Query

Aplica en Power Query al menos tres transformaciones justificadas (tipos de datos, columnas calculadas, eliminación de filas inválidas, combinación de tablas de distintas fuentes).

### 6. Modelado de datos y medidas DAX

Diseña un modelo relacional (idealmente en esquema de estrella) entre las tablas cargadas, y crea al menos tres medidas DAX con significado de negocio (no simples sumas triviales; por ejemplo, una variación porcentual respecto al periodo anterior).

### 7. Minería de datos básica

Aplica al menos una técnica sencilla de minería sobre los datos (una segmentación manual tipo RFM, una agrupación por categorías con `TOPN`, o un cálculo de tendencia). Explica qué pregunta del proceso KDD responde esta fase.

### 8. Construcción del cuadro de mando

Diseña un informe de Power BI con al menos cuatro visualizaciones distintas que respondan directamente a la pregunta de negocio del apartado 1, incluyendo al menos un filtro interactivo (segmentación de datos).

### 9. Validación del modelo

Elige tres cifras clave del cuadro de mando y verifícalas de forma independiente (una consulta manual sobre el origen, un cálculo en una hoja de cálculo, o una consulta SQL directa). Documenta si coinciden y, si no, investiga por qué.

### 10. Presentación final y reflexión de negocio

Presenta el cuadro de mando terminado respondiendo explícitamente a la pregunta de negocio planteada en el apartado 1, e incluye una reflexión escrita sobre qué decisión concreta tomaría una empresa real a partir de este análisis, y qué información adicional necesitaría para tomarla con más confianza.

## Entregables

1. Fichero `.pbix` del informe de Power BI.
2. Documentación de las fuentes de datos y transformaciones aplicadas (apartados 2, 4 y 5).
3. Las tres medidas DAX creadas, con una breve explicación de cada una.
4. Informe de validación (apartado 9) y reflexión final de negocio (apartado 10).
