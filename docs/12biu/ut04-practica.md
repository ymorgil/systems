# **🧪 UT04 · Práctica: monitorización de un pipeline Spark + Airflow con Prometheus y Grafana**

## Objetivo

Desplegar una pila de monitorización (Prometheus + Grafana + Alertmanager) sobre el clúster Spark de la UT02, orquestado por un DAG sencillo de Airflow, provocar un problema real de rendimiento y comprobar que el sistema lo detecta, lo visualiza y genera una alerta a tiempo. La práctica se estructura en **10 apartados obligatorios**.

## Materiales

- El clúster Spark/Hadoop de la UT02 (Docker Compose).
- Imágenes Docker de Prometheus, Grafana y Alertmanager.
- Una instancia de Apache Airflow (puede desplegarse con `docker-compose` usando la imagen oficial).

## Estructura obligatoria de la práctica

### 1. Preparación del entorno

Levanta, junto al clúster Spark, los contenedores de Prometheus, Grafana, Alertmanager y Airflow mediante `docker-compose`. Documenta el fichero de composición utilizado.

### 2. Exposición de métricas de Spark

Activa el *sink* JMX en `metrics.properties` y lanza un job de Spark con el agente JMX Exporter, exponiendo sus métricas en un puerto (por ejemplo, 9091). Verifica accediendo directamente a ese puerto que se reciben métricas en formato Prometheus.

### 3. Configuración del scraping en Prometheus

Configura `prometheus.yml` para que haga *scraping* periódico del puerto expuesto en el apartado anterior. Verifica en la pestaña *Targets* de Prometheus que el objetivo aparece como `UP`.

### 4. Construcción de un dashboard en Grafana

Crea un dashboard con al menos tres paneles: uso de memoria por executor, número de tareas activas y tiempo de ejecución de *stages*. Cada panel debe tener un título y una descripción de qué representa.

### 5. Definición de una regla de alerta

En Alertmanager, define una regla que dispare una alerta cuando el uso de memoria de un executor supere un umbral razonable (por ejemplo, el 80%) durante más de un minuto. Documenta la regla en YAML y explica la lógica elegida.

### 6. Despliegue de un DAG en Airflow

Crea un DAG sencillo en Airflow que lance el job de Spark instrumentado del apartado 2 de forma programada (por ejemplo, cada 10 minutos con fines de prueba). Verifica en la interfaz de Airflow que el DAG se ejecuta correctamente al menos dos veces.

### 7. Provocación de un problema real

Modifica el job de Spark para procesar un volumen de datos notablemente mayor del habitual (o reduce artificialmente la memoria asignada al executor), de forma que aparezca *spill* a disco o un tiempo de ejecución anómalamente alto.

### 8. Verificación de la detección

Comprueba, con capturas, que: (1) la Spark UI muestra el *spill* o la tarea lenta, (2) el dashboard de Grafana refleja el pico de uso de memoria, y (3) la alerta definida en el apartado 5 se dispara y queda registrada en Alertmanager.

### 9. Análisis histórico del incidente

Usando el histórico de Prometheus, compara la gráfica de memoria/tiempo de ejecución de una ejecución "normal" frente a la ejecución problemática del apartado 7, señalando el instante exacto en que empieza la desviación.

### 10. Informe final de estabilidad

Redacta un informe que incluya: una estimación del MTTR (tiempo entre que se dispara la alerta y que se soluciona el problema, real o simulado), una reflexión sobre si Ganglia hubiera permitido detectar lo mismo con la misma rapidez, y una recomendación concreta para evitar que el incidente se repita.

## Entregables

1. Fichero `docker-compose.yml` y configuración de Prometheus/Alertmanager.
2. Capturas del dashboard de Grafana (apartado 4) y de la alerta disparada (apartado 8).
3. Capturas de la ejecución del DAG en Airflow (apartado 6).
4. Informe final de estabilidad (apartado 10).
