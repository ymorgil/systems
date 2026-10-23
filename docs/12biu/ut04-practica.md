# 🧪 Supuesto Práctico UT04 *Monitorización de un pipeline Spark + Airflow* { .card }

!!! info "OBJETIVOS"
    Desplegar una pila de monitorización (Prometheus + Grafana + Alertmanager) sobre el clúster Spark de la UT02, orquestado por un DAG sencillo de Airflow, provocar un problema real de rendimiento y comprobar que el sistema lo detecta, lo visualiza y genera una alerta a tiempo.

    La práctica se estructura en **10 apartados obligatorios**: 5 de despliegue de la pila de monitorización, 3 de orquestación e incidente, y 2 de análisis y estabilidad.

!!! info "RECURSOS"
    - El clúster Spark/Hadoop de la UT02 (Docker Compose).
    - Imágenes Docker de Prometheus, Grafana y Alertmanager.
    - Una instancia de Apache Airflow (puede desplegarse con `docker-compose` usando la imagen oficial).

## **Pila de monitorización** { .seccion }

### 1. Preparación del entorno

**1.1 Contenedores**: levanta, junto al clúster Spark, los contenedores de Prometheus, Grafana, Alertmanager y Airflow mediante `docker-compose`.

**1.2 Composición**: documenta el fichero de composición utilizado.

### 2. Exposición de métricas de Spark

**2.1 Sink JMX**: activa el *sink* JMX en `metrics.properties` y lanza un job de Spark con el agente JMX Exporter, exponiendo sus métricas en un puerto (por ejemplo, 9091).

**2.2 Verificación**: verifica accediendo directamente a ese puerto que se reciben métricas en formato Prometheus.

### 3. Configuración del scraping en Prometheus

**3.1 `prometheus.yml`**: configura Prometheus para que haga *scraping* periódico del puerto expuesto en el apartado anterior.

**3.2 Target**: verifica en la pestaña *Targets* de Prometheus que el objetivo aparece como `UP`.

### 4. Construcción de un dashboard en Grafana

**4.1 Paneles**: crea un dashboard con al menos tres paneles: uso de memoria por executor, número de tareas activas y tiempo de ejecución de *stages*.

**4.2 Descripción**: cada panel debe tener un título y una descripción de qué representa.

### 5. Definición de una regla de alerta

**5.1 Regla**: en Alertmanager, define una regla que dispare una alerta cuando el uso de memoria de un executor supere un umbral razonable (por ejemplo, el 80%) durante más de un minuto.

**5.2 Documentación**: documenta la regla en YAML y explica la lógica elegida.

## **Orquestación e incidente** { .seccion }

### 6. Despliegue de un DAG en Airflow

**6.1 DAG**: crea un DAG sencillo en Airflow que lance el job de Spark instrumentado del apartado 2 de forma programada (por ejemplo, cada 10 minutos con fines de prueba).

**6.2 Verificación**: verifica en la interfaz de Airflow que el DAG se ejecuta correctamente al menos dos veces.

### 7. Provocación de un problema real

**7.1 Carga anómala**: modifica el job de Spark para procesar un volumen de datos notablemente mayor del habitual (o reduce artificialmente la memoria asignada al executor), de forma que aparezca *spill* a disco o un tiempo de ejecución anómalamente alto.

### 8. Verificación de la detección
Comprueba, con capturas, que:

**8.1 Spark UI**: la Spark UI muestra el *spill* o la tarea lenta.

**8.2 Grafana**: el dashboard de Grafana refleja el pico de uso de memoria.

**8.3 Alertmanager**: la alerta definida en el apartado 5 se dispara y queda registrada en Alertmanager.

## **Análisis y estabilidad** { .seccion }

### 9. Análisis histórico del incidente

**9.1 Comparativa histórica**: usando el histórico de Prometheus, compara la gráfica de memoria/tiempo de ejecución de una ejecución "normal" frente a la ejecución problemática del apartado 7.

**9.2 Inicio de la desviación**: señala el instante exacto en que empieza la desviación.

### 10. Informe final de estabilidad
Redacta un informe que incluya:

**10.1 MTTR**: una estimación del MTTR (tiempo entre que se dispara la alerta y que se soluciona el problema, real o simulado).

**10.2 Ganglia**: una reflexión sobre si Ganglia hubiera permitido detectar lo mismo con la misma rapidez.

**10.3 Recomendación**: una recomendación concreta para evitar que el incidente se repita.

!!! example "ENTREGA"
    - En caso de no indicar lo contrario cada apartado tendrá el mismo valor.
    - Para una calificación correcta se han de seguir las instrucciones del documento “**Pautas del curso**”, que se encuentra en el apartado de recursos del Campus.
    - La entrega debe incluir:
        1. Fichero `docker-compose.yml` y configuración de Prometheus/Alertmanager.
        2. Capturas del dashboard de Grafana (apartado 4) y de la alerta disparada (apartado 8).
        3. Capturas de la ejecución del DAG en Airflow (apartado 6).
        4. Informe final de estabilidad (apartado 10).
    - Entregar un documento **“pdf”** a través del Campus. El nombre del archivo debe ser: “**Apellido1Apellido2Nombre_SPXX**”.
