# 🧪 Supuesto Práctico UT03 *Reto de despliegue en la nube con AWS Academy* { .card }

!!! info "OBJETIVOS"
    En grupos, os convertís en el equipo de digitalización de una organización (elegid vosotros el escenario: una tienda online, una app de gestión de pedidos, una plataforma de sensores IoT en una nave industrial, un sistema de reservas, etc.) que debe decidir cómo desplegar su aplicación en la nube. Para tomar esa decisión con conocimiento de causa, realizaréis los laboratorios reales de AWS Academy trabajados en el aula —Cloud9/CodeWhisperer, creación de una VPC con un servidor web, EC2, Lambda y Elastic Beanstalk—, documentando cada uno como si fuera una prueba de concepto para vuestro escenario elegido.

    **Pregunta esencial**: *¿qué modelo de nube y qué nivel de servicio elegiríais para migrar una aplicación real, y por qué?*

    **Gran idea**: la elección del modelo de nube y del nivel de servicio (IaaS, PaaS o FaaS) no es una decisión únicamente técnica: condiciona el coste, el control, la velocidad de puesta en producción y hasta dónde debe residir el procesamiento de los datos (nube central, edge, fog o mist). Para responder a la pregunta esencial no basta con memorizar definiciones: hay que ponerse en la piel de un equipo que debe desplegar un escenario real en AWS, tomar decisiones de arquitectura, ejecutarlas en una cuenta de AWS Academy y ser capaces de justificar cada elección ante otro equipo de compañeros, que evaluará el resultado con los mismos criterios con los que vosotros evaluaréis el suyo.

    No se trata solo de "completar los laboratorios": el reto exige, además, **clasificar cada laboratorio según su modelo de servicio** (IaaS/PaaS/FaaS) y argumentar por escrito qué ventajas e inconvenientes tendría llevarlo a producción real para vuestro escenario, incluyendo —si el escenario elegido lo justifica, por ejemplo una app IoT con sensores— una reflexión sobre si convendría trasladar parte del procesamiento a edge, fog o mist computing en lugar de mandarlo todo a la nube central.

    La práctica se estructura en **10 apartados obligatorios** repartidos en las fases del reto: **Investigar** (apartado 1), **Actuar** (laboratorios de AWS Academy, apartados 2-6), **Reflexionar** (apartados 7-9) y **Publicar** (apartado 10). La entrega final no es un documento que solo vea el profesor: se sube a un **taller de CAMPUS (módulo Workshop)**, donde cada grupo evaluará el trabajo de otro grupo siguiendo la misma rúbrica con la que será evaluado, antes de recibir la calificación definitiva del docente.

!!! info "RECURSOS"
    - Cuenta activa de AWS Academy Learner Lab (o Cloud Foundations) con acceso a Cloud9, VPC, EC2, Lambda y Elastic Beanstalk.
    - Navegador con acceso a la consola de AWS y a un editor de código (puede ser el propio Cloud9).
    - Editor de texto/documento colaborativo del grupo para ir registrando evidencias y decisiones.
    - Acceso al **taller (Workshop)** habilitado en la plataforma **CAMPUS** del módulo.

## **Investigar: planteamiento del reto** { .seccion }

### 1. Planteamiento del reto y elección de escenario

**1.1 Escenario**: en grupo, elegid y describid por escrito el escenario de aplicación real que vais a "migrar a la nube" a lo largo del reto (por ejemplo, una tienda online, un sistema de gestión de pedidos o una app de sensores IoT).

**1.2 Necesidades**: justificad brevemente por qué habéis elegido ese escenario y qué necesidades tiene (disponibilidad, escalabilidad, coste, tiempo de respuesta) que la nube podría resolver. Este planteamiento inicial será la referencia que usaréis para justificar las decisiones de los apartados siguientes.

## **Actuar: laboratorios de AWS Academy** { .seccion }

!!! info ""
    Documentad cada laboratorio como una prueba de concepto para vuestro escenario del apartado 1, con capturas de cada tarea realizada.

### 2. Laboratorio Cloud9 / CodeWhisperer

**2.1 Laboratorio**: completad el laboratorio de AWS Academy Learner Lab de familiarización con el entorno de desarrollo en la nube Cloud9 y el asistente de código CodeWhisperer, documentando con una captura cada tarea realizada.

**2.2 Valoración**: anotad qué ventaja aporta programar en un IDE alojado en la nube frente a un IDE local para un equipo de desarrollo distribuido como el vuestro.

### 3. Creación de una VPC y despliegue de un servidor web

**3.1 Laboratorio**: completad el laboratorio del módulo 5 de AWS Academy Cloud Foundations: creación de una *Virtual Private Cloud* (VPC) y lanzamiento de un servidor web en su interior.

**3.2 Configuración de red**: documentad con capturas la configuración de subredes, tablas de rutas y grupos de seguridad.

**3.3 Comprobación**: comprobad el acceso al servidor web desplegado desde el navegador.

### 4. Laboratorio EC2

**4.1 Laboratorio**: completad el laboratorio del módulo 6 de AWS Academy Cloud Foundations: lanzamiento, configuración y acceso a una instancia EC2.

**4.2 Instancia**: documentad el tipo de instancia elegido, la AMI utilizada y una captura del acceso final a la instancia (por SSH o por el propio navegador).

**4.3 Relación con el escenario**: relacionad esta elección con las necesidades de vuestro escenario del apartado 1.

### 5. Laboratorio AWS Lambda

**5.1 Función**: cread y probad una función Lambda sencilla relacionada con vuestro escenario (por ejemplo, procesar un evento, generar una notificación o transformar un dato de entrada).

**5.2 Evidencias**: documentad el código de la función, el evento de prueba utilizado y una captura de la ejecución con su resultado (*log*/salida).

**5.3 Comparativa**: explicad en qué se diferencia este modelo de "no gestionar servidores" respecto al laboratorio de EC2.

### 6. Laboratorio AWS Elastic Beanstalk

**6.1 Despliegue**: desplegad una aplicación web completa mediante Elastic Beanstalk, dejando que el propio servicio gestione el aprovisionamiento de la infraestructura, el balanceo de carga y el escalado automático.

**6.2 Evidencias**: documentad con capturas el asistente de creación del entorno, la aplicación desplegada funcionando y la configuración de escalado aplicada.

## **Reflexionar: modelos de servicio, costes y edge** { .seccion }

### 7. Clasificación de cada laboratorio por modelo de servicio

**7.1 Tabla de clasificación**: elaborad una tabla que recoja cada uno de los cinco laboratorios anteriores (Cloud9, VPC+servidor web, EC2, Lambda, Elastic Beanstalk) y los clasifique según su modelo de servicio (IaaS/PaaS/FaaS, dentro de XaaS donde corresponda).

**7.2 Responsabilidades**: indicad en cada fila qué parte de la infraestructura gestiona AWS y cuál queda bajo vuestra responsabilidad como equipo.

### 8. Análisis de costes y rentabilidad del escenario en la nube

**8.1 Comparativa de costes**: para vuestro escenario del apartado 1, redactad un análisis de costes comparando, al menos de forma aproximada, el coste de mantener la aplicación con instancias EC2 permanentes frente a un modelo más orientado a PaaS/FaaS (Elastic Beanstalk o Lambda).

**8.2 Condiciones de uso**: señalad en qué condiciones de uso (tráfico constante vs. picos puntuales) resultaría más rentable cada opción.

### 9. Reflexión sobre edge/fog/mist computing si aplica al escenario

**9.1 Escenario con dispositivos**: si vuestro escenario incluye dispositivos conectados, sensores o necesidades de respuesta en tiempo real (por ejemplo, una app IoT), redactad una reflexión justificando si convendría trasladar parte del procesamiento a edge, fog o mist computing en lugar de enviarlo todo a la nube central, y qué ventaja concreta (latencia, ancho de banda, autonomía ante caídas de red) aportaría esa decisión.

**9.2 Escenario sin dispositivos**: si el escenario elegido no lo justifica, explicad por qué no sería necesario y en qué tipo de escenario sí lo sería.

## **Publicar: taller de CAMPUS** { .seccion }

### 10. Documentación final y publicación en el taller de CAMPUS

**10.1 Documento único**: recopilad todas las evidencias y justificaciones de los apartados anteriores en un único documento (o presentación) por grupo.

**10.2 Publicación**: subidlo al **taller de CAMPUS (Workshop)** habilitado para esta práctica dentro del plazo de entrega.

**10.3 Evaluación entre iguales**: una vez cerrada la fase de entrega, participad en la fase de **evaluación entre iguales**, valorando el trabajo asignado de otro grupo con la misma rúbrica que se usará para calificar el vuestro.

!!! tip "EL TALLER NO ACABA AL SUBIR EL TRABAJO"
    La evaluación entre iguales del taller de CAMPUS forma parte del reto, no es un trámite posterior: revisar el trabajo de otro grupo con la misma rúbrica os obliga a mirar con ojo crítico también el vuestro. Antes de entregar, releed cada apartado como si fuerais quienes lo van a evaluar, y comprobad que cualquier decisión de arquitectura (modelo de servicio, coste, edge/fog/mist) queda justificada por escrito y no solo "ejecutada".

!!! example "ENTREGA"
    - En caso de no indicar lo contrario cada apartado tendrá el mismo valor.
    - Para una calificación correcta se han de seguir las instrucciones del documento “**Pautas del curso**”, que se encuentra en el apartado de recursos del Campus.
    - La entrega debe incluir:
        1. Documento de planteamiento del escenario elegido (apartado 1).
        2. Evidencias (capturas, código, configuraciones) de los cinco laboratorios de AWS Academy: Cloud9/CodeWhisperer, VPC+servidor web, EC2, Lambda y Elastic Beanstalk.
        3. Tabla de clasificación de cada laboratorio por modelo de servicio (IaaS/PaaS/FaaS).
        4. Análisis de costes y rentabilidad del escenario en la nube.
        5. Reflexión sobre edge/fog/mist computing aplicada (o justificadamente descartada) al escenario.
        6. Documento final único subido al taller de CAMPUS dentro del plazo de entrega.
        7. Evaluación entre iguales completada en la fase de revisión del taller (Workshop) de CAMPUS.
    - Entregar un documento **“pdf”** a través del **taller (Workshop) de CAMPUS**. El nombre del archivo debe ser: “**GrupoXX_SPXX**”.
