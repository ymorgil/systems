# **☁️ UT03 · Práctica: reto de despliegue en la nube con AWS Academy**

## Gran idea y pregunta esencial

La elección del modelo de nube y del nivel de servicio (IaaS, PaaS o FaaS) no es una decisión únicamente técnica: condiciona el coste, el control, la velocidad de puesta en producción y hasta dónde debe residir el procesamiento de los datos (nube central, edge, fog o mist). La pregunta esencial que guía este reto es: **¿qué modelo de nube y qué nivel de servicio elegiríais para migrar una aplicación real, y por qué?**

Para responderla no basta con memorizar definiciones: hay que ponerse en la piel de un equipo que debe desplegar un escenario real en AWS, tomar decisiones de arquitectura, ejecutarlas en una cuenta de AWS Academy y ser capaces de justificar cada elección ante otro equipo de compañeros, que evaluará el resultado con los mismos criterios con los que vosotros evaluaréis el suyo.

## El reto

En grupos, os convertís en el equipo de digitalización de una organización (elegid vosotros el escenario: una tienda online, una app de gestión de pedidos, una plataforma de sensores IoT en una nave industrial, un sistema de reservas, etc.) que debe decidir cómo desplegar su aplicación en la nube. Para tomar esa decisión con conocimiento de causa, realizaréis los laboratorios reales de AWS Academy trabajados en el aula —Cloud9/CodeWhisperer, creación de una VPC con un servidor web, EC2, Lambda y Elastic Beanstalk—, documentando cada uno como si fuera una prueba de concepto para vuestro escenario elegido.

No se trata solo de "completar los laboratorios": el reto exige, además, **clasificar cada laboratorio según su modelo de servicio** (IaaS/PaaS/FaaS) y argumentar por escrito qué ventajas e inconvenientes tendría llevarlo a producción real para vuestro escenario, incluyendo —si el escenario elegido lo justifica, por ejemplo una app IoT con sensores— una reflexión sobre si convendría trasladar parte del procesamiento a edge, fog o mist computing en lugar de mandarlo todo a la nube central.

La entrega final no es un documento que solo vea el profesor: se sube a un **taller de Moodle (módulo Workshop)**, donde cada grupo evaluará el trabajo de otro grupo siguiendo la misma rúbrica con la que será evaluado, antes de recibir la calificación definitiva del docente.

## Materiales

- Cuenta activa de AWS Academy Learner Lab (o Cloud Foundations) con acceso a Cloud9, VPC, EC2, Lambda y Elastic Beanstalk.
- Navegador con acceso a la consola de AWS y a un editor de código (puede ser el propio Cloud9).
- Editor de texto/documento colaborativo del grupo para ir registrando evidencias y decisiones.
- Acceso al taller (Workshop) habilitado en el aula virtual Moodle del módulo.

## Estructura obligatoria de la práctica

### 1. Planteamiento del reto y elección de escenario

En grupo, elegid y describid por escrito el escenario de aplicación real que vais a "migrar a la nube" a lo largo del reto (por ejemplo, una tienda online, un sistema de gestión de pedidos o una app de sensores IoT). Justificad brevemente por qué habéis elegido ese escenario y qué necesidades tiene (disponibilidad, escalabilidad, coste, tiempo de respuesta) que la nube podría resolver. Este planteamiento inicial será la referencia que usaréis para justificar las decisiones de los apartados siguientes.

### 2. Laboratorio Cloud9 / CodeWhisperer

Completad el laboratorio de AWS Academy Learner Lab de familiarización con el entorno de desarrollo en la nube Cloud9 y el asistente de código CodeWhisperer. Documentad con una captura cada tarea realizada y anotad qué ventaja aporta programar en un IDE alojado en la nube frente a un IDE local para un equipo de desarrollo distribuido como el vuestro.

### 3. Creación de una VPC y despliegue de un servidor web

Completad el laboratorio del módulo 5 de AWS Academy Cloud Foundations: creación de una *Virtual Private Cloud* (VPC) y lanzamiento de un servidor web en su interior. Documentad con capturas la configuración de subredes, tablas de rutas y grupos de seguridad, y comprobad el acceso al servidor web desplegado desde el navegador.

### 4. Laboratorio EC2

Completad el laboratorio del módulo 6 de AWS Academy Cloud Foundations: lanzamiento, configuración y acceso a una instancia EC2. Documentad el tipo de instancia elegido, la AMI utilizada y una captura del acceso final a la instancia (por SSH o por el propio navegador), relacionando esta elección con las necesidades de vuestro escenario del apartado 1.

### 5. Laboratorio AWS Lambda

Cread y probad una función Lambda sencilla relacionada con vuestro escenario (por ejemplo, procesar un evento, generar una notificación o transformar un dato de entrada). Documentad el código de la función, el evento de prueba utilizado y una captura de la ejecución con su resultado (*log*/salida), explicando en qué se diferencia este modelo de "no gestionar servidores" respecto al laboratorio de EC2.

### 6. Laboratorio AWS Elastic Beanstalk

Desplegad una aplicación web completa mediante Elastic Beanstalk, dejando que el propio servicio gestione el aprovisionamiento de la infraestructura, el balanceo de carga y el escalado automático. Documentad con capturas el asistente de creación del entorno, la aplicación desplegada funcionando y la configuración de escalado aplicada.

### 7. Clasificación de cada laboratorio por modelo de servicio

Elaborad una tabla que recoja cada uno de los cinco laboratorios anteriores (Cloud9, VPC+servidor web, EC2, Lambda, Elastic Beanstalk) y los clasifique según su modelo de servicio (IaaS/PaaS/FaaS, dentro de XaaS donde corresponda), indicando en cada fila qué parte de la infraestructura gestiona AWS y cuál queda bajo vuestra responsabilidad como equipo.

### 8. Análisis de costes y rentabilidad del escenario en la nube

Para vuestro escenario del apartado 1, redactad un análisis de costes comparando, al menos de forma aproximada, el coste de mantener la aplicación con instancias EC2 permanentes frente a un modelo más orientado a PaaS/FaaS (Elastic Beanstalk o Lambda), señalando en qué condiciones de uso (tráfico constante vs. picos puntuales) resultaría más rentable cada opción.

### 9. Reflexión sobre edge/fog/mist computing si aplica al escenario

Si vuestro escenario incluye dispositivos conectados, sensores o necesidades de respuesta en tiempo real (por ejemplo, una app IoT), redactad una reflexión justificando si convendría trasladar parte del procesamiento a edge, fog o mist computing en lugar de enviarlo todo a la nube central, y qué ventaja concreta (latencia, ancho de banda, autonomía ante caídas de red) aportaría esa decisión. Si el escenario elegido no lo justifica, explicad por qué no sería necesario y en qué tipo de escenario sí lo sería.

### 10. Documentación final y publicación en el taller de Moodle

Recopilad todas las evidencias y justificaciones de los apartados anteriores en un único documento (o presentación) por grupo, y subidlo al **taller de Moodle (Workshop)** habilitado para esta práctica dentro del plazo de entrega. Una vez cerrada la fase de entrega, participad en la fase de **evaluación entre iguales**, valorando el trabajo asignado de otro grupo con la misma rúbrica que se usará para calificar el vuestro.

## Entregables

1. Documento de planteamiento del escenario elegido (apartado 1).
2. Evidencias (capturas, código, configuraciones) de los cinco laboratorios de AWS Academy: Cloud9/CodeWhisperer, VPC+servidor web, EC2, Lambda y Elastic Beanstalk.
3. Tabla de clasificación de cada laboratorio por modelo de servicio (IaaS/PaaS/FaaS).
4. Análisis de costes y rentabilidad del escenario en la nube.
5. Reflexión sobre edge/fog/mist computing aplicada (o justificadamente descartada) al escenario.
6. Documento final único subido al taller de Moodle dentro del plazo de entrega.
7. Evaluación entre iguales completada en la fase de revisión del taller (Workshop) de Moodle.

!!! tip "El taller no acaba al subir el trabajo"
    La evaluación entre iguales del taller de Moodle forma parte del reto, no es un trámite posterior: revisar el trabajo de otro grupo con la misma rúbrica os obliga a mirar con ojo crítico también el vuestro. Antes de entregar, releed cada apartado como si fuerais quienes lo van a evaluar, y comprobad que cualquier decisión de arquitectura (modelo de servicio, coste, edge/fog/mist) queda justificada por escrito y no solo "ejecutada".
