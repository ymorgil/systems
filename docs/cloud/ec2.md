# Laboratorio EC2 — Amazon Elastic Compute Cloud

> Recursos del curso disponibles en:
> - [AWS Academy Learner Lab](https://awsacademy.instructure.com//courses/167830)
> - [AWS Academy Cloud Foundations](https://awsacademy.instructure.com//courses/140698)

---

## Información General

**Amazon Elastic Compute Cloud (Amazon EC2)** es un servicio web que proporciona capacidad de cómputo con tamaño modificable en la nube. Está diseñado para simplificar el uso del cómputo en la nube a escala web para los desarrolladores.

- Permite obtener y configurar capacidad con una fricción mínima.
- Proporciona control completo sobre los recursos informáticos.
- Reduce el tiempo para arrancar nuevas instancias de servidor a solo minutos.
- Permite escalar la capacidad de forma ascendente o descendente según las necesidades.
- Modelo de pago: **solo se paga por la capacidad que se utiliza realmente**.

---

## Objetivos del Laboratorio

Al completar este laboratorio, deberías poder:

1. Iniciar un servidor web con **protección de terminación** habilitada.
2. **Supervisar** la instancia de EC2.
3. Modificar el **grupo de seguridad** para permitir acceso HTTP (puerto 80).
4. **Modificar el tamaño** de la instancia y habilitar la **protección de detención**.
5. Explorar los **límites de EC2**.
6. Probar la **protección de detención**.
7. **Detener** la instancia de EC2.

> **Duración estimada:** 35 minutos

---

## Tarea 1: Lanzar una Instancia de Amazon EC2

### Acceso a la Consola de AWS

1. En AWS Academy, selecciona **Start Lab** y espera a que el círculo junto a AWS cambie a **verde**.
2. Haz clic en el enlace **AWS** para abrir la Consola de administración.
3. Verifica que estás en la región **Norte de Virginia (us-east-1)**.
4. Ve a **Servicios → Informática → EC2**.
5. Selecciona **Lanzar instancia → Lanzar instancia**.

---

### Paso 1: Nombre y Etiquetas

- **Nombre de la instancia:** `Web Server`

> Las etiquetas permiten clasificar recursos de AWS por finalidad, propietario o entorno. Cada etiqueta consta de una **clave** y un **valor**. En este caso: clave `Name`, valor `Web Server`.

---

### Paso 2: Imagen de Máquina de Amazon (AMI)

- Selecciona **Amazon Linux** (valor predeterminado).
- Mantén **Amazon Linux 2023 AMI**.

Una AMI proporciona la información necesaria para lanzar una instancia e incluye:

| Componente | Descripción |
|------------|-------------|
| Plantilla del volumen raíz | Sistema operativo y aplicaciones instaladas |
| Permisos de lanzamiento | Controla qué cuentas de AWS pueden usar la AMI |
| Asignación de dispositivos de bloques | Volúmenes que se adjuntan al lanzar la instancia |

---

### Paso 3: Tipo de Instancia

- Tipo seleccionado: **t2.micro** (predeterminado)
  - 1 CPU virtual
  - 1 GiB de memoria

> EC2 ofrece tipos optimizados para diferentes casos prácticos: CPU, memoria, almacenamiento y redes.

---

### Paso 4: Par de Claves (Inicio de Sesión)

- Par de claves: **vockey**

> Amazon EC2 usa criptografía de clave pública para cifrar/descifrar la información de inicio de sesión. AWS almacena la clave pública; tú guardas la clave privada.

---

### Paso 5: Configuración de Red

1. Selecciona **Editar** junto a "Configuración de red".
2. En **VPC**, selecciona `Lab VPC`.
3. Mantén la subred **PublicSubnet1** (la instancia tendrá IP pública por defecto).
4. En **Firewall (grupos de seguridad)**, selecciona **Crear grupo de seguridad**:
   - **Nombre:** `Web Server security group`
   - **Descripción:** `Security group for my web server`
5. **Elimina** la regla de entrada existente (se agregará más adelante).

> Un grupo de seguridad funciona como un **firewall virtual** que controla el tráfico entrante y saliente de una o más instancias.

---

### Paso 6: Configurar Almacenamiento

- Mantén la configuración predeterminada: **8 GiB** (volumen raíz EBS).

> Amazon EC2 almacena datos en un disco virtual asociado a la red llamado **Elastic Block Store (EBS)**.

---

### Paso 7: Detalles Avanzados

1. Expande **Detalles avanzados**.
2. En **Protección de terminación**, selecciona **Habilitar**.
3. En el campo **Datos de usuario**, pega el siguiente script:

```bash
#!/bin/bash
dnf install -y httpd
systemctl enable httpd
systemctl start httpd
echo '<html><h1>Hello From Your Web Server!</h1></html>' > /var/www/html/index.html
```

Este script hace lo siguiente al iniciar la instancia:

- Instala el servidor web Apache (`httpd`).
- Configura el servidor para que inicie automáticamente en cada arranque.
- Ejecuta el servidor web.
- Crea una página web sencilla.

> La **protección de terminación** impide que la instancia sea eliminada accidentalmente.

---

### Paso 8: Lanzar la Instancia

1. Haz clic en **Lanzar instancia**.
2. Selecciona **Ver todas las instancias**.
3. Selecciona la instancia `Web Server` y revisa la pestaña **Detalles**.

Espera hasta que la instancia muestre:
- **Estado de instancia:** En ejecución ✅
- **Comprobaciones de estado:** 2/2 comprobaciones superadas ✅

---

## Tarea 2: Supervisar la Instancia

### Comprobaciones de Estado

Ve a la pestaña **Comprobaciones de estado** para ver:
- ✅ Accesibilidad del sistema
- ✅ Accesibilidad de la instancia

> Amazon EC2 realiza comprobaciones automatizadas para identificar problemas de hardware y software.

### Métricas de CloudWatch

Ve a la pestaña **Supervisión** para ver las métricas de Amazon CloudWatch.

> La supervisión básica (cada 5 minutos) está habilitada por defecto. Se puede habilitar supervisión detallada (cada 1 minuto).

### Registro del Sistema

En **Acciones → Monitoreo y solución de problemas → Obtener registro del sistema**:
- Muestra el resultado de la consola de la instancia.
- Útil para diagnosticar problemas de kernel o configuración de servicios.
- Verifica que el paquete HTTP se instaló correctamente desde los datos de usuario.

### Captura de Pantalla de la Instancia

En **Acciones → Monitoreo y solución de problemas → Obtener captura de pantalla de la instancia**:
- Muestra el estado visual de la consola de la instancia.
- Útil cuando no se puede acceder por SSH o RDP.

---

## Tarea 3: Actualizar el Grupo de Seguridad y Acceder al Servidor Web

### Verificar el Acceso Inicial

1. En la pestaña **Detalles**, copia la **Dirección IPv4 pública**.
2. Abre una nueva pestaña del navegador y pega la IP.

> **¿Por qué no funciona?** El grupo de seguridad no permite tráfico entrante en el **puerto 80 (HTTP)**. El servidor web está activo, pero el firewall lo bloquea.

### Agregar Regla de Entrada HTTP

1. En el panel izquierdo, ve a **Grupos de seguridad**.
2. Selecciona **Web Server security group**.
3. Pestaña **Reglas de entrada → Editar reglas de entrada → Agregar regla**:

| Campo | Valor |
|-------|-------|
| Tipo | HTTP |
| Fuente | Anywhere-IPv4 |

4. Haz clic en **Guardar reglas**.
5. Vuelve a la pestaña del navegador y recarga la página.

Deberías ver: **Hello From Your Web Server!** 🎉

---

## Tarea 4: Modificar el Tamaño de la Instancia y Volumen EBS

### Detener la Instancia

1. Selecciona la instancia `Web Server`.
2. **Estado de la instancia → Detener instancia → Detener**.
3. Espera a que el estado muestre: **Detenida**.

> Una instancia detenida **no genera cargos de cómputo**, pero sí mantiene los cargos de almacenamiento EBS.

### Cambiar el Tipo de Instancia

1. **Acciones → Configuración de la instancia → Cambiar tipo de instancia**.
2. Selecciona **t2.small** (el doble de memoria que t2.micro).
3. Haz clic en **Aplicar**.

### Habilitar Protección de Detención

1. **Acciones → Configuración de la instancia → Cambiar la protección de detención**.
2. Selecciona **Habilitar** y haz clic en **Guardar**.

### Modificar el Volumen EBS

1. Pestaña **Almacenamiento → ID del volumen** (selecciona el volumen).
2. **Acciones → Modificar volumen**.
3. Cambia el tamaño de **8 GiB** a **10 GiB**.
4. Haz clic en **Modificar → Modificar** (para confirmar).

### Reiniciar la Instancia

1. Panel izquierdo → **Instancias**.
2. Selecciona `Web Server`.
3. **Estado de la instancia → Iniciar instancia**.

> La instancia ahora corre como **t2.small** con **10 GiB** de almacenamiento.

---

## Tarea 5: Explorar los Límites de EC2

1. En el buscador de servicios, busca y selecciona **Service Quotas**.
2. Ve a **Servicios de AWS** y busca `ec2`.
3. Selecciona **Amazon Elastic Compute Cloud (Amazon EC2)**.
4. En la barra de búsqueda de cuotas, busca `running on-demand`.

> Hay límites en el número y tipos de instancias que se pueden ejecutar por región. Si es propietario de una cuenta de AWS, puede solicitar un **aumento de límites**.

---

## Tarea 6: Probar la Protección de Detención

### Intentar Detener la Instancia (con protección activa)

1. Selecciona la instancia `Web Server`.
2. **Estado de la instancia → Detener instancia → Detener**.

Aparecerá el mensaje:

> *"Failed to stop the instance. The instance may not be stopped. Modify its 'disableApiStop' instance attribute and try again."*

Esto confirma que la **protección de detención** funciona correctamente.

### Desactivar la Protección y Detener

1. **Acciones → Configuración de la instancia → Cambiar protección de detención**.
2. **Desmarca** la casilla Habilitar.
3. Haz clic en **Guardar**.
4. Vuelve a seleccionar **Estado de la instancia → Detener instancia → Detener**.

La instancia se detendrá correctamente. ✅

---

## Resumen de Conceptos Clave

| Concepto | Descripción |
|---------|-------------|
| **AMI** | Plantilla para lanzar instancias EC2 |
| **Tipo de instancia** | Define CPU, RAM, almacenamiento y red |
| **Par de claves** | Permite acceso seguro mediante criptografía pública/privada |
| **VPC / Subred** | Red virtual donde se ejecuta la instancia |
| **Grupo de seguridad** | Firewall virtual que controla el tráfico |
| **EBS** | Almacenamiento en bloque duradero para EC2 |
| **Datos de usuario** | Script que se ejecuta al lanzar la instancia |
| **Protección de terminación** | Impide eliminar la instancia accidentalmente |
| **Protección de detención** | Impide detener la instancia accidentalmente |
| **CloudWatch** | Servicio de supervisión y métricas |
| **Service Quotas** | Límites de recursos por región en AWS |

---

## Recursos Adicionales

- [Lanzar una instancia EC2](https://docs.aws.amazon.com/es_es/AWSEC2/latest/UserGuide/EC2_GetStarted.html)
- [Tipos de instancias de Amazon EC2](https://aws.amazon.com/es/ec2/instance-types/)
- [Imágenes de máquina de Amazon (AMI)](https://docs.aws.amazon.com/es_es/AWSEC2/latest/UserGuide/AMIs.html)
- [Grupos de seguridad](https://docs.aws.amazon.com/es_es/AWSEC2/latest/UserGuide/ec2-security-groups.html)
- [Amazon EBS](https://docs.aws.amazon.com/es_es/AWSEC2/latest/UserGuide/AmazonEBS.html)
- [Métricas de Amazon CloudWatch para EC2](https://docs.aws.amazon.com/es_es/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html)
- [Protección de terminación](https://docs.aws.amazon.com/es_es/AWSEC2/latest/UserGuide/terminating-instances.html#Using_ChangingDisableAPITermination)
- [Límites de servicio de EC2](https://docs.aws.amazon.com/es_es/AWSEC2/latest/UserGuide/ec2-resource-limits.html)

---

*© 2023, Amazon Web Services, Inc. y sus filiales. Todos los derechos reservados.*
