# **📋 UT01 · Rúbrica de evaluación**

Rúbrica de comprobación de la práctica *Despliegue de un dominio Active Directory con GPO e integración de un cliente Linux*. Para cada uno de los 10 apartados obligatorios se comprueban **4 elementos**: cada elemento se marca como presente (Sí) o ausente (No). No hay términos medios: o la evidencia está en la entrega, o no lo está.

### Apartado 1 · Despliegue de las instancias y preparación de la red

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se han desplegado las tres instancias/máquinas (DC, cliente Windows, cliente Linux) | | |
| 2 | El grupo de seguridad/firewall permite RDP hacia las máquinas Windows | | |
| 3 | El grupo de seguridad/firewall permite SSH hacia la máquina Linux | | |
| 4 | El futuro controlador de dominio tiene IP estática configurada | | |

### Apartado 2 · Instalación de AD DS y promoción a controlador de dominio

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se ha instalado el rol de Servicios de dominio de Active Directory | | |
| 2 | Se ha promovido el servidor como nuevo bosque/dominio | | |
| 3 | Se anota o documenta la contraseña de restauración DSRM | | |
| 4 | Existen capturas de los pasos clave del asistente de promoción | | |

### Apartado 3 · Creación de la estructura de OUs, usuarios y grupos

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se han creado al menos dos unidades organizativas con sentido propio | | |
| 2 | Cada OU contiene al menos dos usuarios | | |
| 3 | Cada OU contiene al menos un grupo de seguridad | | |
| 4 | Existe una captura del árbol completo en Usuarios y equipos de AD | | |

### Apartado 4 · Configuración de zona de búsqueda inversa y comprobación de DNS

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se ha creado la zona de búsqueda inversa | | |
| 2 | Se comprueba la resolución directa con `nslookup` | | |
| 3 | Se comprueba la resolución inversa con `nslookup` | | |
| 4 | Ambas resoluciones aparecen en una única captura | | |

### Apartado 5 · Diseño y aplicación de directivas de grupo (GPO) diferenciadas

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existen al menos dos GPO distintas, una por OU | | |
| 2 | Las configuraciones de cada GPO son diferentes y justificadas | | |
| 3 | Se comprueba el efecto de cada GPO iniciando sesión con un usuario afectado | | |
| 4 | El comportamiento observado queda documentado con capturas | | |

### Apartado 6 · Unión de un cliente Windows al dominio

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El cliente Windows está configurado en la misma red que el controlador | | |
| 2 | El cliente aparece unido correctamente al dominio | | |
| 3 | Se ha iniciado sesión con un usuario del dominio en el cliente | | |
| 4 | La unión se comprueba tanto en cliente como en servidor | | |

### Apartado 7 · Automatización de la gestión del dominio mediante un script

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El script muestra un menú interactivo repetible hasta salir | | |
| 2 | Incluye la opción de mostrar información del dominio (OUs, grupos, usuarios) | | |
| 3 | Incluye la creación de OU, grupo y usuario (con cambio de contraseña forzado) | | |
| 4 | Existen capturas de ejecución de cada opción del menú | | |

### Apartado 8 · Integración de un cliente Linux en el dominio Active Directory

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se han utilizado herramientas adecuadas (realmd, sssd, winbind) | | |
| 2 | El sistema reconoce el reino (realm) del dominio | | |
| 3 | Se ha iniciado sesión en modo consola con un usuario del dominio | | |
| 4 | El procedimiento está documentado con capturas y explicaciones | | |

### Apartado 9 · Despliegue alternativo de un servicio de directorio en Linux

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se ha desplegado OpenLDAP o Samba4 siguiendo el procedimiento correcto | | |
| 2 | Existe la estructura base documentada (LDIF o `samba-tool provision`) | | |
| 3 | Se realizan al menos dos comprobaciones de funcionamiento (búsquedas o SRV) | | |
| 4 | Los comandos ejecutados quedan documentados | | |

### Apartado 10 · Documentación final e informe de la arquitectura

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | El informe incluye un diagrama o esquema de la arquitectura desplegada | | |
| 2 | Se documentan los parámetros de red utilizados | | |
| 3 | Se resumen las comprobaciones realizadas en cada apartado | | |
| 4 | Existe un apartado de incidencias y soluciones con al menos un caso real | | |

## Calificación

Cada elemento marcado "Sí" suma un punto (máximo 40 puntos). La calificación sobre 10 se obtiene dividiendo el total entre 4. Para superar la unidad es necesario alcanzar al menos 20 de los 40 elementos y tener, como mínimo, 2 de los 4 elementos marcados en cada uno de los 10 apartados (ningún apartado puede quedar completamente vacío).
