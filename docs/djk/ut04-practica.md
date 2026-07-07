# **🤖 UT04 · Práctica: reto de ingeniería de prompt aplicada a la administración de sistemas**

## Objetivo

Resolver, en formato de **Aprendizaje Basado en Retos (ABR)**, un problema técnico real del sector de los sistemas informáticos utilizando IA generativa como herramienta de apoyo, aplicando los criterios de evaluación del RA4: identificar la importancia de la IA en la automatización y optimización de procesos, relacionar la IA con la recogida y el tratamiento de datos, valorar su importancia presente y futura, reconocer los sectores con mayor implantación, identificar las técnicas de aprendizaje empleadas (machine learning, deep learning, NLP) y describir cómo influye la IA en el sector del título. La gran idea que vertebra el reto es que **una IA generativa no da automáticamente la mejor respuesta**: la calidad de lo que devuelve depende directamente de cómo se formula la petición. La **pregunta esencial** que cada grupo deberá responder con evidencias es: **¿cómo conseguir que una IA generativa nos dé respuestas realmente útiles y fiables para resolver un problema técnico real de administración de sistemas?**

La práctica se estructura en **10 apartados obligatorios** y culmina con la publicación de la entrega en un **taller de Moodle (módulo Workshop)**, donde cada grupo evaluará el trabajo de, al menos, otro grupo mediante una rúbrica de evaluación entre iguales.

## Materiales

- Acceso a una IA generativa conversacional (ChatGPT, Claude, Gemini, Copilot o equivalente).
- Un problema técnico real de administración de sistemas elegido por el grupo (ver apartado 1).
- Editor de texto o procesador de documentos para redactar la entrega y capturas de pantalla de cada interacción con la IA.
- Acceso al curso de Moodle con el módulo **Workshop (Taller)** habilitado por el profesorado para esta unidad.
- El apartado 8 del temario de la unidad (*Ingeniería de prompt*), con la plantilla rol/tarea/contexto/instrucciones/formato/detalles que debe aplicarse en la segunda versión del prompt.

## El reto

En grupos de 3 o 4 personas, elegid un **problema técnico real** propio del sector de los sistemas informáticos: optimizar la configuración de un servidor, redactar un script de mantenimiento o copia de seguridad, generar un informe de incidencias a partir de unos logs, diseñar un plan de migración a la nube, u otro problema similar propuesto por el grupo y validado por el profesorado. El reto consiste en resolverlo **iterando con una IA generativa**, mejorando el prompt en, al menos, **3 versiones sucesivas**, hasta conseguir una respuesta que un profesional del sector podría usar con garantías. En paralelo, el grupo deberá analizar un **caso real de aplicación de IA en sistemas informáticos** (Google, Darktrace, Cisco DNA Center, IBM Watson o Microsoft Azure/AWS, todos ellos vistos en el apartado 6 del temario), identificando qué tipo de datos recopila y qué técnica de IA (machine learning, deep learning o NLP) emplea. El resultado final se documenta y se publica como entrega en el **taller de Moodle**, donde recibirá una evaluación entre iguales de, como mínimo, otro grupo de la clase, siguiendo la misma rúbrica que empleará el profesorado.

## Estructura obligatoria de la práctica

### 1. Planteamiento del reto y elección del problema técnico

Formad el grupo de trabajo y elegid un problema técnico real de administración de sistemas que queráis resolver con ayuda de una IA generativa (optimizar un servidor, redactar un script de mantenimiento, generar un informe de incidencias a partir de logs, diseñar un plan de migración a la nube, o uno propio validado por el profesorado). Redactad en dos o tres frases por qué ese problema es relevante para el sector y qué se espera obtener como resultado final (un fichero de configuración, un script, un documento, un plan). Este planteamiento es la "gran idea" concreta de vuestro reto particular.

### 2. Primera versión del prompt (sin plantilla ni contexto)

Escribid una primera petición a la IA generativa tal y como la formularíais de forma espontánea, sin aplicar ninguna plantilla ni aportar contexto detallado (por ejemplo: "hazme un script de backup" o "cómo optimizo mi servidor"). Capturad literalmente el prompt enviado y la respuesta completa obtenida. No corrijáis ni mejoréis nada todavía: el objetivo de este apartado es dejar constancia del punto de partida.

### 3. Segunda versión aplicando la plantilla estándar de prompt

Reformulad la misma petición aplicando la plantilla rol/tarea/contexto/instrucciones/formato/detalles vista en el apartado 8 del temario. Cread un prompt completo que incluya explícitamente cada uno de los seis elementos (rol, tarea, contexto, instrucciones, formato y detalles) referidos a vuestro problema técnico concreto. Capturad el prompt exacto y la respuesta obtenida, y señalad qué elemento de la plantilla creéis que ha aportado la mejora más determinante respecto a la primera versión.

### 4. Tercera versión iterada con restricciones y ejemplos

Partiendo de la respuesta del apartado 3, identificad al menos una carencia, ambigüedad o imprecisión técnica y elaborad una tercera versión del prompt que añada restricciones concretas (límites de longitud, versión de sistema operativo, formato exacto de salida) y, si es posible, un ejemplo del resultado esperado (*few-shot prompting*). Capturad el prompt y la respuesta final obtenida en esta iteración.

### 5. Comparativa razonada de las 3 versiones y sus resultados

Elaborad una tabla comparativa de las tres versiones del prompt (apartados 2, 3 y 4) que recoja, para cada una: longitud y elementos presentes en el prompt, principales carencias de la respuesta obtenida y grado de utilidad real para resolver el problema técnico planteado. Acompañad la tabla de un párrafo que explique, con vuestras palabras, por qué la calidad de la respuesta de una IA generativa depende de cómo se formula la pregunta y no solo del propio modelo utilizado.

### 6. Elección de la mejor respuesta y justificación

Seleccionad la respuesta que consideréis más útil y fiable de las tres iteraciones anteriores (no tiene por qué ser necesariamente la última) y justificad razonadamente por qué la elegís. Indicad también qué revisión o validación técnica humana adicional aplicaríais antes de usar esa respuesta en un entorno de producción real, dejando claro que la IA generativa acelera la propuesta pero no sustituye la comprobación profesional.

### 7. Análisis de un caso real de IA en sistemas informáticos

Elegid uno de los casos reales trabajados en el apartado 6 del temario (Google, Darktrace, Cisco DNA Center, IBM Watson o Microsoft Azure/AWS) y documentad, con vuestras palabras y a partir de fuentes fiables, en qué consiste su aplicación de IA, qué problema del sector de los sistemas informáticos resuelve y qué beneficio concreto (ahorro energético, detección de amenazas, automatización de red, reducción de coste operativo) genera para la organización que lo aplica.

### 8. Identificación del tipo de aprendizaje (ML/DL/NLP) del caso analizado

A partir del caso elegido en el apartado 7, identificad qué tipo de datos recopila el sistema (logs, tráfico de red, texto libre, métricas de consumo energético, etc.) y razonad qué técnica de IA resulta más adecuada para tratarlos: machine learning clásico, deep learning o procesamiento de lenguaje natural (NLP). Justificad la elección apoyándoos en la distinción entre datos estructurados y no estructurados vista en el apartado 4 del temario.

### 9. Reflexión sobre riesgos, sesgos y ética de usar IA en tareas de sistemas

Redactad una reflexión grupal sobre los riesgos de aplicar IA generativa a tareas reales de administración de sistemas: posibles errores o alucinaciones en scripts o configuraciones generadas, exceso de confianza en la respuesta de la IA sin validación humana, sesgos en los datos si el caso analizado en el apartado 7 usa aprendizaje automático, y cuestiones de privacidad si se comparte información sensible de la infraestructura de una organización con una IA externa. Proponed al menos dos buenas prácticas para mitigar estos riesgos.

### 10. Documentación final y publicación en el taller de Moodle

Recopilad todo el trabajo anterior (planteamiento del reto, las tres versiones del prompt con sus capturas, la comparativa, la justificación de la mejor respuesta, el análisis del caso real y la reflexión ética) en un único documento bien estructurado y publicadlo como entrega en el **taller de Moodle (Workshop)** habilitado para esta práctica. Completad, además, la fase de **evaluación entre iguales**: revisad la entrega asignada de, al menos, otro grupo aplicando la misma rúbrica de evaluación, con comentarios constructivos y una valoración justificada de cada apartado.

## Entregables

1. Planteamiento del reto y problema técnico elegido (apartado 1).
2. Primera versión del prompt, sin plantilla, con captura de la respuesta obtenida (apartado 2).
3. Segunda versión del prompt aplicando la plantilla rol/tarea/contexto/instrucciones/formato/detalles, con captura de la respuesta (apartado 3).
4. Tercera versión del prompt con restricciones y/o ejemplos, con captura de la respuesta final (apartado 4).
5. Tabla comparativa razonada de las tres versiones (apartado 5).
6. Justificación de la respuesta elegida como mejor y validación humana propuesta (apartado 6).
7. Análisis del caso real de IA en sistemas informáticos elegido (apartado 7).
8. Identificación razonada del tipo de aprendizaje (ML/DL/NLP) del caso analizado (apartado 8).
9. Reflexión sobre riesgos, sesgos y ética del uso de IA en tareas de sistemas (apartado 9).
10. Documento final publicado como entrega en el taller de Moodle y evidencia de la evaluación entre iguales realizada (apartado 10).

!!! tip "Cómo se gestiona el reto en Moodle"
    Toda la práctica se entrega y se evalúa a través del módulo **Taller (Workshop)** de Moodle: primero se sube el documento final como entrega individual de grupo y, a continuación, se abre la fase de **evaluación entre iguales**, en la que cada grupo revisa y puntúa la entrega de, al menos, otro grupo con la misma rúbrica que aplicará el profesorado. Esta doble mirada —la propia y la de otro grupo— refuerza precisamente la pregunta esencial del reto: aprender a distinguir una respuesta de IA generativa realmente útil y fiable de una que solo lo parece a primera vista.
