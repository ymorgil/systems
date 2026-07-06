# **🧪 UT06 · Práctica: interoperabilidad y contenedores en un escenario heterogéneo**

## Objetivo

Diseñar, desplegar y documentar un escenario heterogéneo completo en el que sistemas Windows y Linux comparten recursos en red mediante **NFS** y **Samba** con distintos niveles de seguridad de acceso, verificar la conectividad entre todos los equipos implicados, y desplegar servicios en **contenedores Docker** orquestados con **Kubernetes**. La práctica se estructura en **10 apartados obligatorios**, que cubren de forma conjunta los ocho criterios de evaluación de la RA6: identificación de la necesidad de compartir recursos, niveles de seguridad, comprobación de conectividad, descripción funcional, instalación y configuración, verificación del funcionamiento, trabajo en grupo entre sistemas operativos distintos y documentación.

## Materiales

- Al menos una máquina virtual **Ubuntu Server** (servidor NFS/Samba/Docker).
- Al menos una máquina virtual **Ubuntu Desktop** y una **Windows 11** (clientes).
- Acceso a Internet para descargar paquetes e imágenes Docker.
- `kubectl` y `minikube` instalados en el servidor o en un equipo dedicado para la parte de Kubernetes.
- Red interna en modo NAT o adaptador puente, con un rango común para todos los equipos (por ejemplo `172.29.xx.0/24`, donde *xx* es el número asignado a cada alumno).

## Estructura obligatoria de la práctica

### 1. Diseño del escenario y comprobación de conectividad

Documenta el escenario de red completo: direcciones IP y nombre de host de cada máquina (servidor Ubuntu, cliente Ubuntu Desktop, cliente Windows 11). Antes de instalar ningún servicio, comprueba y captura la conectividad entre **todos** los equipos con `ping`, `ip a` / `ipconfig` y la resolución de nombres, dejando constancia de que la red heterogénea funciona correctamente en ambos sentidos.

### 2. Configuración del servidor NFS

En el servidor Ubuntu, instala `nfs-kernel-server`, crea una carpeta compartida (por ejemplo `/red/nombrenfs`) con los permisos adecuados para que cualquier usuario pueda leer y ejecutar su contenido, y expórtala mediante `/etc/exports` a los clientes de la red. Añade en su interior un script con permisos de ejecución para todos los usuarios que muestre un mensaje de bienvenida personalizado con el nombre de quien lo ejecuta. Reinicia el servicio y documenta cada paso con capturas.

### 3. Montaje y comprobación de NFS desde ambos clientes

Monta la carpeta NFS desde el cliente **Ubuntu Desktop** y desde el cliente **Windows 11**, comprobando el resultado con los comandos vistos en clase (`mount`, `df` en Linux; acceso por ruta UNC o cliente NFS nativo en Windows). Configura el montaje automático al arrancar (`/etc/fstab` en Linux; script en la carpeta de inicio en Windows). Desde cada cliente, añade una línea al script de bienvenida indicando desde qué equipo se accedió, y comprueba que la ejecución es correcta.

### 4. Configuración del servidor Samba con niveles de acceso

En el mismo servidor, instala Samba y configura **dos recursos compartidos** con niveles de seguridad distintos (criterio b): uno de **acceso completo**, visible y modificable por cualquier usuario (`guest ok = yes`), y otro de **acceso restringido**, solo accesible por los miembros de un grupo concreto (`valid users = @grupo`), con usuario y contraseña Samba dados de alta previamente. Configura además la compartición de los directorios personales (`[homes]`). Ejecuta `testparm` antes de reiniciar el servicio y documenta el contenido relevante de `smb.conf`.

### 5. Pruebas de conectividad heterogénea sobre Samba

Accede a ambos recursos Samba desde el cliente **Ubuntu Desktop** (usuario del grupo restringido, mediante `smbclient` y montaje con `cifs-utils`) y desde el cliente **Windows 11** (mediante el explorador de archivos), verificando en cada caso que el recurso de acceso completo es visible para cualquiera y que el restringido solo permite entrar con las credenciales correctas. Añade una línea al script identificando el equipo de acceso y comprueba el comportamiento de los directorios personales compartidos.

### 6. Despliegue de un contenedor Docker con servicio web

Instala Docker en el servidor y despliega un contenedor con un servidor web (por ejemplo, `nginx` sobre `alpine`), exponiendo el puerto del contenedor a un puerto del host mediante `-p`. Verifica el acceso al servicio desde el navegador de un cliente de la red. Crea al menos un volumen para persistir datos y comprueba que sobreviven a la eliminación y recreación del contenedor.

### 7. Construcción de una imagen personalizada

Escribe un `Dockerfile` propio que parta de una imagen base y añada, como mínimo, la instalación de un paquete adicional y la copia de un fichero o script al contenedor. Construye la imagen con `docker build`, ejecútala y documenta las capas generadas (`docker image history`). Si dispones de cuenta en Docker Hub, sube la imagen personalizada a un repositorio propio.

### 8. Orquestación básica con Kubernetes

Instala `kubectl` y `minikube` (o utiliza un clúster ya disponible) y despliega la imagen del apartado anterior mediante un **Deployment** con al menos 2 réplicas, exponiéndolo con un **Service**. Adjunta el manifiesto YAML utilizado y una captura del *dashboard* de Minikube (o de `kubectl get pods,svc`) mostrando los pods en ejecución y el servicio accesible.

### 9. Clustering y almacenamiento en red (alta disponibilidad)

Sobre un escenario Windows Server con al menos dos nodos, crea un **clúster de conmutación por error**: promueve un controlador de dominio, configura discos iSCSI compartidos (uno para el quórum, otro para los datos), une los nodos al dominio y valida la configuración antes de crear el clúster. Documenta el resumen de validación y una captura mostrando los dos nodos y los discos activos en la estructura del clúster.

### 10. Documentación final e informe de interoperabilidad

Redacta un informe final que recoja: el escenario de red completo (apartado 1), las capturas de configuración y prueba de NFS y Samba con sus niveles de acceso (apartados 2-5), el despliegue de contenedores y su orquestación (apartados 6-8), y el resumen del clúster de alta disponibilidad (apartado 9). El informe debe permitir a otra persona reproducir la configuración completa sin necesidad de consultar nada más.

## Entregables

1. Documento con el diseño de red y las capturas de conectividad (apartado 1).
2. Ficheros de configuración relevantes (`/etc/exports`, `smb.conf`) y capturas de las pruebas NFS/Samba desde ambos clientes (apartados 2-5).
3. `Dockerfile` propio, capturas de los contenedores en ejecución y manifiesto YAML de Kubernetes (apartados 6-8).
4. Resumen de validación y creación del clúster de conmutación por error (apartado 9).
5. Informe final de documentación (apartado 10).

!!! tip "Si no dispones de varias máquinas físicas"
    Todo el escenario puede resolverse con máquinas virtuales en VirtualBox o Proxmox VE dentro de un mismo host, usando una red interna o NAT compartida entre ellas. Para la parte de Kubernetes, Minikube permite completar los apartados 8 sin necesidad de un clúster real, manteniendo los 10 apartados y los mismos entregables.
