# **📋 UT05 · Rúbrica de evaluación**

Rúbrica de comprobación de la práctica *Despliegue de un servidor de impresión compartido entre Windows y Linux*. Para cada uno de los 10 apartados obligatorios se comprueban **4 elementos**: cada elemento se marca como presente (Sí) o ausente (No). No hay términos medios: o la evidencia está en la entrega, o no lo está.

### Apartado 1 · Instalación del servidor de impresión Windows

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se ha instalado el rol Servicios de impresión y documentos | | |
| 2 | Se han instalado los subcomponentes Servidor de impresión, Impresión en Internet y Servicio LPD | | |
| 3 | Se comprueban los controladores/impresoras por defecto en modo gráfico | | |
| 4 | Se comprueban los controladores/impresoras por defecto con `Get-Printer`/`Get-PrinterDriver` | | |

### Apartado 2 · Creación de una impresora lógica en Windows

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se agrega el controlador con `Add-PrinterDriver` | | |
| 2 | Se agrega el puerto con `Add-PrinterPort` | | |
| 3 | Se crea la impresora `nombreprint` con `Add-Printer` | | |
| 4 | Se documenta cada comando ejecutado y su resultado | | |

### Apartado 3 · Compartición e integración con Active Directory

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | La impresora se comparte con los clientes del dominio | | |
| 2 | Se crea el grupo `print` con al menos dos usuarios | | |
| 3 | Existe una GPO que despliega la impresora en el grupo `print` | | |
| 4 | Se comprueba el resultado con un usuario del grupo y con otro que no pertenece a él | | |

### Apartado 4 · Instalación de CUPS en el servidor Linux

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | CUPS está instalado y el servicio arrancado/habilitado | | |
| 2 | El acceso a la interfaz web (631) está restringido a los tres equipos del escenario | | |
| 3 | El usuario de administración pertenece al grupo `lpadmin` | | |
| 4 | Se documenta la directiva de acceso usada en `cupsd.conf` | | |

### Apartado 5 · Creación y clasificación de impresoras lógicas en CUPS

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se ha dado de alta una impresora (virtual o física) desde la interfaz web | | |
| 2 | La impresora está clasificada por conexión y por controlador | | |
| 3 | La administración está restringida a un grupo determinado | | |
| 4 | La impresora está compartida con la red | | |

### Apartado 6 · Grupos de impresión (pools/clases)

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe un segundo dispositivo lógico creado | | |
| 2 | Se ha configurado un pool (Windows) o una clase (CUPS) con ambos dispositivos | | |
| 3 | Se envían varios trabajos de prueba al grupo | | |
| 4 | Se comprueba que los trabajos se reparten entre los dispositivos del grupo | | |

### Apartado 7 · Gestión de colas por comandos y herramientas gráficas

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se marca la impresora como predeterminada en el cliente Windows | | |
| 2 | Se comprueba la cola en Windows por navegador (IPP) y por PowerShell (`Get-PrintJob`) | | |
| 3 | Se marca la impresora como predeterminada en el cliente Ubuntu por terminal | | |
| 4 | Se comprueba la cola en Linux con `lpq`/`lpstat` | | |

### Apartado 8 · Compartición entre sistemas heterogéneos con Samba

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Samba está instalado y el recurso de impresora tiene `printable = yes` | | |
| 2 | El acceso está restringido a los usuarios del grupo `print` | | |
| 3 | La configuración se valida con `testparm` y el usuario se crea con `smbpasswd -a` | | |
| 4 | Desde Windows 11 se agrega la impresora compartida y se comprueba su funcionamiento | | |

### Apartado 9 · Pruebas cruzadas y cuotas de uso

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se prueba imprimir desde Windows contra la impresora Linux vía Samba | | |
| 2 | Se comprueba el acceso desde Linux a la impresora Windows (o se documenta por qué no ha sido posible) | | |
| 3 | Se instala PaperCut (o se justifica su ausencia) | | |
| 4 | Se limita el uso del grupo `print` a 100 páginas | | |

### Apartado 10 · Documentación final del servidor de impresión

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El documento recoge comandos y capturas de todos los apartados anteriores | | |
| 2 | Incluye `cupsd.conf` y `smb.conf` comentados | | |
| 3 | Incluye los permisos y grupos creados en ambos sistemas | | |
| 4 | Incluye una tabla resumen de impresoras lógicas, protocolo y sistemas comprobados | | |

## Calificación

Cada elemento marcado "Sí" suma un punto (máximo 40 puntos). La calificación sobre 10 se obtiene dividiendo el total entre 4. Para superar la unidad es necesario alcanzar al menos 20 de los 40 elementos y tener, como mínimo, 2 de los 4 elementos marcados en cada uno de los 10 apartados (ningún apartado puede quedar completamente vacío).
