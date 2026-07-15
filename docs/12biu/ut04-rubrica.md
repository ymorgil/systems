# **📋 UT04 · Rúbrica de evaluación**

Rúbrica de comprobación de la práctica *Monitorización de un pipeline Spark + Airflow con Prometheus y Grafana*. Para cada uno de los 10 apartados se comprueban 4 elementos (Sí/No).

### Apartado 1 · Preparación del entorno

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Prometheus, Grafana y Alertmanager están operativos | | |
| 2 | Airflow está operativo | | |
| 3 | Todos los servicios comparten red con el clúster Spark | | |
| 4 | El `docker-compose.yml` está documentado | | |

### Apartado 2 · Exposición de métricas de Spark

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se activa el sink JMX en `metrics.properties` | | |
| 2 | Se lanza el job con el agente JMX Exporter | | |
| 3 | El puerto de métricas responde correctamente | | |
| 4 | Se documenta el fichero de reglas usado | | |

### Apartado 3 · Configuración del scraping en Prometheus

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | `prometheus.yml` incluye el nuevo target | | |
| 2 | El target aparece como `UP` en la pestaña Targets | | |
| 3 | Se documenta el intervalo de scraping elegido | | |
| 4 | Se justifica ese intervalo | | |

### Apartado 4 · Construcción de un dashboard en Grafana

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe un panel de memoria por executor | | |
| 2 | Existe un panel de tareas activas | | |
| 3 | Existe un panel de tiempo de ejecución de stages | | |
| 4 | Cada panel tiene título y descripción | | |

### Apartado 5 · Definición de una regla de alerta

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | La regla está definida en YAML | | |
| 2 | El umbral elegido es razonable y justificado | | |
| 3 | La regla incluye una duración mínima antes de disparar | | |
| 4 | La regla se ha probado y funciona | | |

### Apartado 6 · Despliegue de un DAG en Airflow

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El DAG lanza correctamente el job de Spark | | |
| 2 | El DAG se ejecuta al menos dos veces con éxito | | |
| 3 | La programación (schedule) está bien configurada | | |
| 4 | Se documenta la estructura del DAG | | |

### Apartado 7 · Provocación de un problema real

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se modifica el volumen de datos o la memoria del executor | | |
| 2 | El cambio provoca un efecto observable real (spill o lentitud) | | |
| 3 | El problema es reproducible | | |
| 4 | Se documenta el cambio realizado | | |

### Apartado 8 · Verificación de la detección

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | La Spark UI muestra el problema | | |
| 2 | Grafana refleja el pico correspondiente | | |
| 3 | La alerta se dispara en Alertmanager | | |
| 4 | Las tres evidencias se aportan como capturas | | |

### Apartado 9 · Análisis histórico del incidente

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se compara una ejecución normal frente a la problemática | | |
| 2 | Se señala el instante exacto de la desviación | | |
| 3 | La comparación usa datos históricos reales de Prometheus | | |
| 4 | La conclusión es coherente con los datos mostrados | | |

### Apartado 10 · Informe final de estabilidad

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se estima un MTTR razonado | | |
| 2 | Se reflexiona sobre Ganglia frente a Prometheus+Grafana | | |
| 3 | Se propone una recomendación concreta de mejora | | |
| 4 | El informe integra evidencias de los apartados anteriores | | |

## Calificación

Cada elemento marcado "Sí" suma un punto (máximo 40). La nota sobre 10 es el total dividido entre 4. Para superar la unidad se exige un mínimo de 20/40 puntos y al menos 2 de los 4 elementos marcados en cada apartado.
