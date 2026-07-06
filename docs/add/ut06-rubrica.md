# **📋 UT06 · Rúbrica de evaluación**

Rúbrica de comprobación de la práctica *Interoperabilidad y contenedores en un escenario heterogéneo*. Para cada uno de los 10 apartados obligatorios se comprueban **4 elementos**: cada elemento se marca como presente (Sí) o ausente (No). No hay términos medios: o la evidencia está en la entrega, o no lo está.

### Apartado 1 · Diseño del escenario y comprobación de conectividad

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se documentan IP y nombre de host de cada equipo del escenario | | |
| 2 | Se incluye captura de `ping` o equivalente entre todos los equipos | | |
| 3 | Se comprueba la resolución de nombres | | |
| 4 | La comprobación de conectividad se realiza antes de instalar los servicios | | |

### Apartado 2 · Configuración del servidor NFS

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se instala `nfs-kernel-server` y se documenta el proceso | | |
| 2 | La carpeta compartida tiene permisos adecuados | | |
| 3 | El fichero `/etc/exports` exporta la carpeta con opciones correctas | | |
| 4 | El script de bienvenida existe y tiene permisos de ejecución para todos | | |

### Apartado 3 · Montaje y comprobación de NFS desde ambos clientes

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El recurso NFS se monta correctamente desde Ubuntu Desktop | | |
| 2 | El recurso NFS se monta o se accede correctamente desde Windows 11 | | |
| 3 | El montaje automático al arrancar está configurado en ambos clientes | | |
| 4 | Cada cliente añade su línea identificativa en el script y se verifica | | |

### Apartado 4 · Configuración del servidor Samba con niveles de acceso

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe un recurso Samba de acceso completo (`guest ok = yes`) | | |
| 2 | Existe un recurso Samba de acceso restringido (`valid users = @grupo`) | | |
| 3 | Se ejecuta `testparm` antes de reiniciar el servicio | | |
| 4 | Se documenta el contenido relevante de `smb.conf` | | |

### Apartado 5 · Pruebas de conectividad heterogénea sobre Samba

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se accede al recurso completo desde Ubuntu Desktop y Windows 11 | | |
| 2 | Se accede al recurso restringido con credenciales válidas desde ambos clientes | | |
| 3 | Se comprueba que un usuario fuera del grupo no puede acceder al restringido | | |
| 4 | Se verifica el acceso a los directorios personales (`homes`) compartidos | | |

### Apartado 6 · Despliegue de un contenedor Docker con servicio web

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Docker está instalado y operativo en el servidor | | |
| 2 | El contenedor expone el servicio web en un puerto accesible desde la red | | |
| 3 | Se crea al menos un volumen para persistencia de datos | | |
| 4 | Se comprueba que los datos persisten tras eliminar y recrear el contenedor | | |

### Apartado 7 · Construcción de una imagen personalizada

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe un `Dockerfile` propio con imagen base declarada mediante `FROM` | | |
| 2 | Se instala al menos un paquete adicional en la imagen | | |
| 3 | Se copia al menos un fichero o script propio a la imagen | | |
| 4 | Se documentan las capas generadas (`docker image history` o equivalente) | | |

### Apartado 8 · Orquestación básica con Kubernetes

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe un manifiesto de Deployment con al menos 2 réplicas | | |
| 2 | Existe un manifiesto de Service que expone la aplicación | | |
| 3 | Se muestra captura de los pods en ejecución (`kubectl get pods` o dashboard) | | |
| 4 | Se comprueba el acceso al servicio desplegado | | |

### Apartado 9 · Clustering y almacenamiento en red

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se configuran discos iSCSI para quórum y para datos | | |
| 2 | Los nodos están unidos correctamente al dominio | | |
| 3 | Se valida la configuración antes de crear el clúster | | |
| 4 | Se muestra el resumen final con los nodos y discos activos | | |

### Apartado 10 · Documentación final e informe de interoperabilidad

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El informe recoge el escenario de red completo | | |
| 2 | Se incluyen las configuraciones y pruebas de NFS y Samba | | |
| 3 | Se incluyen los contenedores, el Dockerfile y el manifiesto de Kubernetes | | |
| 4 | El informe permitiría reproducir la práctica sin consultar nada más | | |

## Calificación

Cada elemento marcado "Sí" suma un punto (máximo 40 puntos). La calificación sobre 10 se obtiene dividiendo el total entre 4. Para superar la unidad es necesario alcanzar al menos 20 de los 40 elementos y tener, como mínimo, 2 de los 4 elementos marcados en cada uno de los 10 apartados (ningún apartado puede quedar completamente vacío).
