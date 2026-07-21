# 🖥️ AWS (AMAZON WEB SERVICE)

## 5. Amazon Web Services (AWS)

Plataforma de servicios en la nube proporcionada por Amazon que ofrece una amplia gama de servicios web para crear, implementar y gestionar aplicaciones sin necesidad de infraestructura física.

### Características principales
- Plataforma en la nube segura con un amplio conjunto de productos globales basados en la nube.
- Acceso bajo demanda a recursos de cómputo, almacenamiento, red, bases de datos y herramientas de administración.
- Ofrece flexibilidad.
- Solo se paga por los servicios individuales que se necesitan y en la medida que se utilicen.
- Los servicios de AWS trabajan en conjunto como piezas fundamentales.

---

## 6. Infraestructura Global de AWS

### Regiones
- La infraestructura de AWS se basa en **regiones**. AWS cuenta con **22 regiones** en todo el mundo.
- Una región de AWS es una ubicación geográfica física con una o más zonas de disponibilidad.
- Las regiones están aisladas unas de otras para obtener tolerancia a errores y estabilidad.
- Los recursos en una región **no se replican automáticamente** en otras regiones.
- Si las necesidades del negocio lo requieren, es responsabilidad del usuario replicar los datos entre regiones.

### Zonas de Disponibilidad
- Cada región cuenta con varias zonas de disponibilidad.
- Cada zona de disponibilidad es una partición completamente aislada de la infraestructura de AWS.
- Constan de centros de datos discretos.
- Diseñadas para el aislamiento de errores.
- Se interconectan con otras zonas de disponibilidad mediante redes privadas de alta velocidad.
- AWS recomienda replicar los datos y recursos entre las zonas de disponibilidad para obtener mayor resiliencia.

---

## 7. Amazon VPC (Virtual Private Cloud)

Amazon VPC permite crear una red virtual aislada dentro de la nube de AWS con control total sobre:
- Selección del rango de direcciones IP.
- Configuración de subredes.
- Creación de tablas de enrutamiento.
- Gestión de puertas de enlace (gateways) para conectividad interna y externa.

### Características de la VPC
- Aislada de forma lógica de otras VPC.
- Dedicada a la cuenta de AWS del usuario.
- Pertenece a una única región de AWS y puede abarcar varias zonas de disponibilidad.

### Subredes
- Intervalo de direcciones IP que divide una VPC.
- Pertenece a una única zona de disponibilidad.
- Se clasifica como **pública** o **privada**.

### Bloques CIDR
- Al crear una VPC se le asigna un bloque IPv4 de CIDR (rango de direcciones IPv4 privadas).
- No se puede cambiar el rango de dirección después de crear la VPC.
- El tamaño de bloque de CIDR IPv4 más grande es `/16`.
- El tamaño de bloque de CIDR IPv4 más pequeño es `/28`.
- AWS reserva **5 direcciones IP** por cada bloque de CIDR de subred (red, router local, DNS, uso futuro, difusión).

### Direcciones IP
- **IP pública:** Asignada automáticamente a una instancia EC2 en una subred pública. Cambia cada vez que se detiene y vuelve a iniciar la instancia.
- **IP elástica:** Dirección IP estática asignada a una cuenta de AWS. Permanece fija aunque la instancia se detenga y reinicie; puede reasignarse a otras instancias.

### Tablas de Enrutamiento
- Contienen reglas (rutas) que determinan hacia dónde se dirige el tráfico de red de una subred.
- Cada ruta especifica un **destino** (bloque CIDR) y un **objetivo** (gateway o interfaz).
- Por defecto, incluye una ruta local para la comunicación dentro de la VPC.

---

## 8. Servicios de Cómputo

| Servicio | Descripción |
|---------|-------------|
| **Amazon EC2** | Proporciona máquinas virtuales redimensionables. |
| **Amazon ECR** | Almacena y recupera imágenes de Docker. |
| **Amazon ECS** | Servicio de coordinación compatible con Docker. |
| **AWS Elastic Beanstalk** | Forma sencilla de ejecutar y administrar aplicaciones web. |
| **AWS Lambda** | Opción de cómputo sin servidor; solo se paga por el tiempo de cómputo utilizado. |
| **Amazon EKS** | Permite ejecutar Kubernetes administrado en AWS. |
| **AWS Fargate** | Ejecuta contenedores reduciendo la necesidad de administrar servidores o clústeres. |

---

## 9. Amazon EC2 (Elastic Compute Cloud)

Amazon EC2 proporciona máquinas virtuales en la nube con control administrativo total sobre el sistema operativo (Windows o Linux).

### Significado del nombre
- **Elastic:** Puedes aumentar o reducir el número o tamaño de servidores de forma automática.
- **Compute:** Referencia a los recursos de procesamiento (CPU) y memoria (RAM).
- **Cloud:** Las instancias están alojadas en la nube.

### Usos comunes de instancias EC2
- Servidores de aplicaciones, web, bases de datos, juegos, correo, multimedia, catálogos, archivos, cómputo y proxy.

### Amazon Machine Image (AMI)
Una AMI proporciona la información necesaria para lanzar una instancia de EC2 e incluye:
- Plantilla para el volumen raíz (SO y aplicaciones instaladas).
- Permisos de lanzamiento.
- Asignación de dispositivos de bloques.

#### Tipos de AMI disponibles
- **Quick Start:** AMI prediseñadas (Linux y Windows).
- **Mis AMI:** AMI creadas por el usuario.
- **AWS Marketplace:** Catálogo digital con miles de soluciones de software.
- **AMI comunitarias:** Creadas por la comunidad; AWS no las verifica — usar con precaución.

### Tipos de Instancia
El tipo de instancia determina: memoria (RAM), potencia de procesamiento (CPU), espacio en disco, tipo de disco y rendimiento de red.

#### Categorías
- Instancias de propósito general
- Optimizadas para cómputo
- Optimizadas para memoria
- Optimizadas para almacenamiento
- Con cómputo acelerado

#### Nomenclatura
Ejemplo: `c5.large`
- `c` → familia
- `5` → número de generación
- `large` → tamaño

### Par de Claves (Login)
Amazon EC2 utiliza criptografía de **clave pública/privada**:
- AWS almacena la clave pública.
- El usuario guarda la clave privada.
- Permite acceso seguro a instancias sin contraseña.

---

## 10. Creación de una Instancia EC2

### Paso 1 — Ingresar a AWS Academy
1. Dirígete a [https://www.awsacademy.com](https://www.awsacademy.com).
2. Inicia sesión con las credenciales proporcionadas por el instructor.
3. Accede al entorno de AWS Management Console (generalmente desde LMS).
4. Si es la primera vez, completa los pasos de configuración inicial.

### Paso 2 — Acceder a la consola de administración de AWS
1. Accede a la pestaña **Asignaturas** y entra en tu asignatura.
2. Accede a **Contenidos** y lanza el laboratorio.
3. Dentro del laboratorio, pulsa **Start Lab** y espera a que el círculo junto a AWS cambie de rojo a verde.
4. Pulsa sobre el texto **AWS** para entrar en la consola.

### Paso 3 — Lanzar el asistente de creación de instancias
1. Ve a **Servicios → Informática → EC2**.
2. Desde el menú lateral puedes configurar instancias, imágenes, EBS, redes, etc.
3. Haz clic en el botón **Lanzar instancias** (asistente de creación).

### Configuración del asistente
El asistente incluye los siguientes pasos:

1. **Nombre y etiquetas**
2. **Imagen de máquina de Amazon (AMI)**
3. **Tipo de instancia**
4. **Par de claves (inicio de sesión)**
5. **Configuraciones de red**
6. **Configurar almacenamiento**
7. **Detalles avanzados**

---

## 11. Configuraciones de Red en EC2

En la sección de red del asistente se configura:
- VPC y subred donde se ejecutará la instancia.
- Asignación de IP pública para acceso a internet o configuración privada.
- Habilitación de direcciones IPv6.

### Grupos de Seguridad
Un grupo de seguridad funciona como un **firewall virtual** que controla el tráfico de una o varias instancias.

- Las reglas se pueden modificar en cualquier momento y se aplican automáticamente a todas las instancias asociadas.
- Se pueden definir reglas de **entrada** (origen) y de **salida** (destino).
- Por defecto, incluye una regla de salida que permite todo el tráfico saliente.
- Ejemplo: regla para permitir tráfico SSH a través del puerto 22 (TCP).

---

## 12. Configuración de Almacenamiento

### Opciones de almacenamiento

| Servicio | Tipo | Descripción |
|---------|------|-------------|
| **Instance Store** | Efímero (temporal) | Almacenamiento a nivel de bloques físicamente adjunto al host. Se elimina si la instancia se detiene. |
| **Amazon EBS** (Elastic Block Store) | Persistente en bloques | Almacenamiento duradero de alto rendimiento. Cuatro tipos de volúmenes. Permite cambiar tipo/tamaño sin interrumpir aplicaciones. |
| **Amazon EFS** (Elastic File System) | Sistema de archivos NFS | Elástico, escalable y completamente administrado. Escala a petabytes bajo demanda. |
| **Amazon S3** (Simple Storage Service) | Objetos | Almacenamiento de objetos con escalabilidad, seguridad y alto rendimiento. |

Para cada volumen se especifica:
- Tamaño del disco (en GB).
- Tipo de volumen (SSD o HDD).
- Si el volumen se eliminará al finalizar la instancia.
- Si se debe utilizar cifrado.

---

## 13. Detalles Avanzados — Datos de Usuario

Al crear instancias EC2 se pueden pasar **datos de usuario** que automatizan la configuración en el lanzamiento:
- Aplicar parches y actualizar el sistema operativo.
- Instalar claves de licencia de software.
- Instalar software adicional.

> En instancias Windows, el script debe estar en formato de símbolo del sistema (batch) o Windows PowerShell.

---

## 14. Iniciar y Gestionar la Instancia

### Pestañas de gestión de la instancia

| Pestaña | Descripción |
|---------|-------------|
| **Detalles** | Información general: ID, tipo de instancia, AMI, configuración de red. |
| **Estado y alarmas** | Estado actual y alertas configuradas en Amazon CloudWatch. |
| **Monitoreo** | Métricas de rendimiento: uso de CPU, tráfico de red, estadísticas clave. |
| **Seguridad** | Grupos de seguridad, políticas de acceso, puertos abiertos y reglas de firewall. |
| **Redes** | VPC, subred, interfaces de red y direcciones IP asignadas. |
| **Almacenamiento** | Volúmenes EBS conectados: tipo, tamaño y estado. |
| **Etiquetas** | Pares clave-valor para organizar, identificar y administrar recursos. |

---

## 15. Conectarse a una Instancia

### Instancia Windows (RDP)
1. Inicia la instancia, selecciónala y pulsa **Conectar**.
2. Selecciona la pestaña **Cliente RDP**.
3. Pulsa **Obtener contraseña** y carga la clave privada creada durante la configuración.
4. Descarga el archivo de escritorio remoto y sigue los pasos del asistente para conectarte.
