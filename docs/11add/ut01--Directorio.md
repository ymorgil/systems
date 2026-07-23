# **🗂️ UT01 · Servicio de directorio**

![Autenticación centralizada: del cliente al servicio de directorio](../assets/img/add/ut01-diagrama.svg)

## Resultado de aprendizaje y criterios de evaluación

**RA1.** Administra el servicio de directorio interpretando especificaciones e integrándolo en una red.

Criterios de evaluación:

a) Se han identificado la función, los elementos y las estructuras lógicas del servicio de directorio.
b) Se ha determinado y creado el esquema del servicio de directorio.
c) Se ha realizado la instalación del servicio de directorio en el servidor.
d) Se ha realizado la configuración y personalización del servicio de directorio.
e) Se ha integrado el servicio de directorio con otros servicios.
f) Se han aplicado filtros de búsqueda en el servicio de directorio.
g) Se ha utilizado el servicio de directorio como mecanismo de acreditación centralizada de los usuarios en una red.
h) Se ha realizado la configuración del cliente para su integración en el servicio de directorio.
i) Se han utilizado herramientas gráficas y comandos para la administración del servicio de directorio.
j) Se ha documentado la estructura e implantación del servicio de directorio.

## 1. Qué es un servicio de directorio y por qué existe

Antes de instalar nada conviene fijar una idea que sostiene toda la unidad: un servicio de directorio no es "una base de datos más", sino una pieza de infraestructura pensada específicamente para almacenar información que **se consulta muchísimo y se modifica poco** (criterio a). Piensa en la diferencia entre la ficha de un empleado (nombre, usuario, departamento, permisos) y una transacción bancaria: la primera se lee constantemente y cambia rara vez; la segunda se escribe una vez y casi nunca se vuelve a tocar. Los servicios de directorio están optimizados para el primer patrón.

En un sistema aislado, la información de usuarios vive en ficheros locales: `/etc/passwd`, `/etc/shadow` y `/etc/group` en Linux, o la base de datos SAM (*Security Accounts Manager*) en un Windows independiente. Este modelo funciona con una o dos máquinas, pero se degrada rápidamente en cuanto la red crece: crear el mismo usuario en veinte equipos, mantener contraseñas sincronizadas, revocar un acceso el mismo día en que alguien deja la organización... son tareas que dejan de ser razonables a mano.

Un servicio de directorio resuelve este problema centralizando la información en un único punto (o en un conjunto de puntos replicados) al que **todas las máquinas de la red consultan** en lugar de mantener su propia copia. Esto tiene una consecuencia muy concreta: un usuario puede iniciar sesión con las mismas credenciales en cualquier equipo integrado en el dominio, y un cambio de contraseña o de permisos se aplica de forma inmediata en toda la red, sin tocar máquina por máquina.

!!! note "Tres funciones que cumple siempre un servicio de directorio"
    Con independencia de la implementación concreta (Active Directory, OpenLDAP, Samba4), un servicio de directorio siempre resuelve tres necesidades: **autenticación** (comprobar que un usuario es quien dice ser), **autorización** (decidir a qué recursos puede acceder una vez autenticado) y **administración centralizada** (un único lugar desde el que crear, modificar y revocar usuarios, grupos y equipos).

Los dos grandes representantes de este mundo que trabajaremos en la unidad son **Active Directory** (el servicio de directorio de Microsoft, basado en el protocolo LDAP y en Kerberos) y **OpenLDAP** (una implementación libre del protocolo LDAP, habitual en entornos Linux), junto con **Samba4**, que permite que un servidor Linux se comporte como un controlador de dominio Active Directory completo, compatible con clientes Windows.

## 2. Active Directory: dominios, árboles y bosques

**Active Directory Domain Services (AD DS)** es la herramienta de administración centralizada de Microsoft para gestionar cuentas de usuario, grupos, equipos, impresoras y directivas de seguridad en una red Windows. Organiza esta información en una jerarquía de tres niveles:

| Nivel | Qué es | Ejemplo |
|---|---|---|
| **Dominio** | Unidad básica de administración: un grupo de objetos (usuarios, grupos, equipos) almacenados en una única base de datos | `centro.local` |
| **Árbol** | Colección de dominios que comparten un espacio de nombres común y una relación de confianza bidireccional | `centro.local` y `aula.centro.local` |
| **Bosque** | Entidad de nivel superior: colección de árboles que comparten confianza mutua y un catálogo global | Varios árboles de dominio de una misma organización |

La **relación de confianza** entre dominios es lo que permite que un usuario autenticado en un dominio acceda a recursos de otro sin volver a introducir credenciales. Puede ser:

- **Unidireccional**: un dominio confía en otro para autenticar usuarios, pero no al revés.
- **Bidireccional**: ambos dominios se confían mutuamente.

El servidor que aloja el servicio AD DS se llama **controlador de dominio (DC)**. Sus funciones principales son autenticar usuarios y equipos, autorizar el acceso a recursos según los permisos configurados, y **replicar** la base de datos del directorio con el resto de controladores de dominio del bosque, de modo que todos mantengan una copia coherente y actualizada. Uno de los controladores de dominio del bosque se designa como **catálogo global (GC)**: contiene información resumida de todos los objetos del bosque y acelera las búsquedas que abarcan varios dominios.

Active Directory se apoya en varios protocolos que conviene identificar (criterio a), porque cada uno resuelve una parte distinta del problema:

| Protocolo | Función dentro de AD DS |
|---|---|
| **LDAP** | Acceso y modificación de la información almacenada en el directorio |
| **Kerberos** | Autenticación de usuarios y equipos mediante tickets |
| **DNS** | Resolución de nombres de dominio y localización de servicios (registros SRV) |
| **RPC** | Comunicación entre el controlador de dominio y clientes/otros servidores |

!!! example "Instalar el primer controlador de dominio de un bosque"
    Para promover un servidor Windows Server a controlador de dominio (criterio c) hace falta, como requisito previo, una **IP estática** en el adaptador de red interno. El asistente de configuración pregunta, entre otras cosas, si se trata de un nuevo bosque, un nuevo dominio en un bosque existente, o un controlador adicional para un dominio ya creado. En el primer despliegue de un dominio se elige siempre **"agregar un nuevo bosque"**, y el asistente instala automáticamente el servicio **DNS** si no existe, ya que un dominio Active Directory no puede funcionar sin resolución de nombres. También conviene fijar en ese momento la **contraseña de restauración de servicios de directorio (DSRM)**, necesaria para restaurar el controlador desde una copia de seguridad; no está relacionada con la cuenta de Administrador del dominio y es individual de cada DC.

## 3. Esquema y objetos del directorio

El **esquema** del servicio de directorio (criterio b) define qué tipos de objetos pueden existir y qué atributos, obligatorios y opcionales, tiene cada uno. En Active Directory, los objetos habituales que gestiona un administrador son:

- **Usuarios**: cuenta con nombre de inicio de sesión, contraseña y permisos de acceso.
- **Grupos**: conjuntos de usuarios (u otros grupos) que comparten permisos, para simplificar la administración de accesos.
- **Equipos**: estaciones de trabajo, servidores o dispositivos móviles unidos al dominio.
- **Unidades organizativas (OU)**: contenedores lógicos que agrupan objetos en una jerarquía que suele reflejar la estructura de la organización (departamentos, aulas, sedes).
- **Controladores de dominio** y **sitios**: representan la infraestructura del propio directorio y su topología física.

Por defecto, un dominio recién creado incluye contenedores como `Builtin` (grupos predefinidos del dominio), `Computers` (equipos añadidos sin OU específica), `Domain Controllers` (los propios DC) y `Users` (usuarios y grupos por defecto). Sin embargo, en cualquier despliegue real se crean **OUs propias**, porque aportan dos cosas que los contenedores por defecto no ofrecen: **delegación de tareas** (dar permisos de administración solo sobre una OU concreta, sin exponer el resto del dominio) y **aplicación de directivas de grupo específicas** para cada rama de la organización.

!!! tip "Cuándo crear una OU nueva"
    Crea una OU cuando un conjunto de usuarios o equipos necesite **políticas distintas** al resto (por ejemplo, una cuota de perfil distinta para Profesores que para Alumnos) o cuando quieras **delegar su administración** a otra persona sin darle permisos sobre el resto del dominio. Si no necesitas ninguna de las dos cosas, probablemente te basta con un grupo de seguridad dentro de una OU ya existente.

En cuanto a los grupos, Active Directory distingue dos clasificaciones que conviene no confundir:

| Clasificación | Tipos | Uso |
|---|---|---|
| Por finalidad | **Distribución** (solo correo, sin seguridad) / **Seguridad** (permisos y derechos) | La mayoría de grupos administrativos son de seguridad |
| Por ámbito | **Dominio local** / **Global** / **Universal** | Determina qué puede contener el grupo y sobre qué recursos se pueden conceder permisos |

Un grupo **global** puede contener usuarios y grupos del propio dominio, y conceder permisos sobre recursos de cualquier dominio del bosque; un grupo de **dominio local** puede contener miembros de cualquier dominio del bosque, pero solo conceder permisos sobre recursos de su propio dominio; un grupo **universal** combina ambas capacidades, a costa de un mayor coste de replicación en el catálogo global.

En el mundo LDAP, el equivalente al esquema de Active Directory es igual de estricto: cada objeto pertenece a una o varias `objectClass` (por ejemplo, `posixAccount` o `posixGroup`), y estas determinan qué atributos son obligatorios (`uid`, `uidNumber`, `homeDirectory` para un usuario POSIX) y cuáles opcionales.

![Árbol de información del directorio (DIT) con unidades organizativas, usuarios y grupos](../assets/img/add/ut01-arbol-dit.svg)

## 4. LDAP: protocolo, estructura jerárquica e identificadores

**LDAP** (*Lightweight Directory Access Protocol*) es, ante todo, un **protocolo**: un conjunto de normas que define cómo se accede a un servicio de directorio, no un software que se instale directamente.

!!! warning "LDAP no se instala: se instala una implementación de LDAP"
    Nadie "instala HTTP"; se instalan servidores web como Apache o Nginx que hablan el protocolo HTTP. Con LDAP ocurre exactamente lo mismo: no existe "tener LDAP instalado", sino tener un **servidor** que implemente el protocolo (normalmente **OpenLDAP**) y/o **clientes** que lo hablen (`ldapsearch`, `ldapadd`...). Confundir el protocolo con el software es el primer error conceptual que conviene evitar en esta unidad.

LDAP organiza la información en una estructura jerárquica en forma de árbol llamada **DIT** (*Directory Information Tree*). En la raíz del árbol se sitúa la base del directorio, que suele corresponder al dominio: para `asir.local`, la base sería `dc=asir,dc=local`. A partir de ahí se crean ramas —normalmente unidades organizativas— que agrupan usuarios, grupos y otros objetos.

Cada entrada del directorio se identifica mediante varios conceptos que aparecerán constantemente en los comandos de esta unidad:

| Identificador | Significado | Ejemplo |
|---|---|---|
| **DC** (*Domain Component*) | Cada parte del nombre de dominio | `dc=asir`, `dc=local` |
| **DN** (*Distinguished Name*) | Identificador único y completo de un objeto, como una ruta absoluta | `cn=juan,ou=usuarios,dc=asir,dc=local` |
| **CN** (*Common Name*) | Nombre del objeto dentro de su rama inmediata (único solo ahí, no en todo el árbol) | `cn=profesor01` |
| **Atributo** | Propiedad que da significado al objeto, definida por el esquema | `uid`, `mail`, `uidNumber` |

Este modelo jerárquico encaja de forma natural con la estructura de una organización (departamentos, aulas, sedes) y permite aplicar permisos y políticas de forma granular por rama del árbol.

Para crear y modificar esta estructura de forma reproducible se utiliza el formato **LDIF** (*LDAP Data Interchange Format*): ficheros de texto plano que describen instrucciones para añadir, modificar o eliminar entradas del directorio. Su valor no es solo práctico sino también profesional: un archivo LDIF puede versionarse, revisarse y reaplicarse, lo que lo convierte en la forma estándar de documentar cambios sobre el directorio (criterio j).

```ldif
dn: ou=Profesorado,dc=nombre,dc=local
objectClass: organizationalUnit
ou: Profesorado

dn: cn=grupo0101,ou=Profesorado,dc=nombre,dc=local
objectClass: posixGroup
cn: grupo0101
gidNumber: 5001
```

## 5. Instalación, administración y filtros de búsqueda en OpenLDAP

**OpenLDAP** es la implementación libre de referencia del protocolo LDAP en Linux (criterio c). Sus componentes principales son:

- **slapd** (*Stand-alone LDAP Daemon*): el demonio que escucha peticiones LDAP y responde según el protocolo.
- **Bibliotecas LDAP**: rutinas que permiten a otras aplicaciones hablar el protocolo.
- **Herramientas cliente**: utilidades de línea de comandos que interactúan con el directorio.

| Comando | Función |
|---|---|
| `ldapadd` | Añade un objeto (normalmente a partir de un fichero LDIF) |
| `ldapmodify` | Modifica atributos existentes: añadir, reemplazar o eliminar un valor |
| `ldapdelete` | Elimina una entrada del directorio |
| `ldapsearch` | Realiza búsquedas y aplica filtros |
| `ldappasswd` | Cambia la contraseña de un usuario |
| `slapcat` | Exporta el contenido de la base de datos en formato LDIF |

La instalación típica en Debian/Ubuntu pasa por los paquetes `slapd` y `ldap-utils`, seguidos de `dpkg-reconfigure slapd` para fijar de forma interactiva el nombre de dominio, la contraseña del administrador y el backend de base de datos. El fichero `/etc/ldap/ldap.conf` define, entre otros, el parámetro `BASE` (la base de búsqueda por defecto) y `URI` (la dirección del servidor LDAP al que se conecta el cliente).

Una vez el directorio tiene contenido, el criterio (f) exige saber **filtrar búsquedas**: `ldapsearch` no se usa nunca sin acotar qué buscar y qué mostrar, porque un directorio real puede tener miles de entradas.

```bash
# Busca todos los usuarios del grupo "profesorado" y muestra solo su nombre y correo
ldapsearch -x -LLL -b "dc=nombre,dc=local" \
  "(&(objectClass=posixAccount)(memberOf=cn=profesorado,ou=grupos,dc=nombre,dc=local))" \
  cn mail
```

| Opción de `ldapsearch` | Efecto |
|---|---|
| `-x` | Autenticación simple, sin SASL |
| `-b` | Base DN desde la que se realiza la búsqueda |
| `-L` / `-LL` / `-LLL` | Salida LDIF, sin comentarios, sin comentarios ni líneas en blanco |
| `(&(...)(...))` | Filtro con operador lógico AND entre condiciones |

!!! example "De la teoría a la búsqueda con sentido"
    Un filtro como `(objectClass=posixAccount)` no dice nada por sí solo si no se combina con un atributo relevante: buscar "todos los usuarios" rara vez es útil en un directorio con cientos de cuentas. El criterio (f) se cumple cuando el filtro responde a una pregunta de negocio real, por ejemplo: *"¿qué usuarios del grupo profesorado tienen definido un correo electrónico?"* → `(&(objectClass=posixAccount)(memberOf=cn=profesorado,...)(mail=*))`.

Para quien prefiera una interfaz gráfica, existen varias herramientas de administración LDAP equivalentes en espíritu a "Usuarios y equipos de Active Directory" (criterio i):

| Herramienta | Tipo | Característica |
|---|---|---|
| **phpLDAPadmin** | Web | Ligera, configuración en `/etc/phpldapadmin/config.php` |
| **LDAP Account Manager (LAM)** | Web | Orientada a la gestión de cuentas y grupos |
| **Apache Directory Studio** | Escritorio (Java) | La más completa, permite editar el esquema |
| **JXplorer** | Escritorio (Java) | Ligera, multiplataforma |

## 6. Integración de clientes Linux con OpenLDAP: NSS y PAM

Configurar el **servidor** LDAP es solo la mitad del trabajo: el criterio (h) exige también configurar el **cliente** para que delegue la autenticación en el directorio en lugar de en los ficheros locales. En Linux esto se apoya en dos mecanismos (criterio e, integración con otros servicios del sistema):

- **NSS** (*Name Service Switch*): decide **dónde** buscar información de usuarios y grupos (UID, GID, directorio personal). Con LDAP configurado, NSS consulta el directorio además de (o en lugar de) los ficheros locales.
- **PAM** (*Pluggable Authentication Modules*): decide **si** un usuario puede autenticarse, comprobando su contraseña contra la fuente configurada —en este caso, contra el servidor LDAP.

| Fichero | Papel en la integración LDAP |
|---|---|
| `/etc/nsswitch.conf` | Añadir `ldap` como fuente en las líneas `passwd`, `group` y `shadow` |
| `/etc/pam.d/common-password` | Eliminar `use_authtok` para permitir el cambio de contraseña vía LDAP |
| `/etc/pam.d/common-session` | Añadir `pam_mkhomedir.so` para crear el directorio personal en el primer inicio de sesión |

En los paquetes de Ubuntu, esta integración pasa por instalar `libnss-ldap`, `libpam-ldap` y `ldap-utils`, y responder al asistente con la URI del servidor (`ldap://`, no `ldapi://`), el DN base del dominio y la versión del protocolo (LDAPv3).

!!! warning "Autenticación gráfica y gestores de sesión modernos"
    En Ubuntu 24.04 el gestor de sesión por defecto ya no es LightDM sino **GDM3**, que además utiliza **Wayland** en lugar de X11 por defecto. Wayland es más restrictivo y puede impedir el inicio de sesión gráfico de usuarios autenticados por LDAP aunque el inicio de sesión en consola funcione con normalidad. Si aparece este problema, la solución habitual es desactivar Wayland (`WaylandEnable=false` en `/etc/gdm3/custom.conf`) o volver a LightDM si se necesita ese comportamiento clásico.

Una combinación habitual en entornos educativos es LDAP junto con **NFS**, de modo que el directorio `/home` de cada usuario se sirva desde el servidor y esté disponible, con el mismo contenido, en cualquier cliente donde inicie sesión (perfiles móviles de usuario). Esto exige compartir una carpeta del servidor vía `/etc/exports`, indicar en la cuenta LDAP la ruta del `/home` remoto, y montar esa carpeta en el cliente mediante `/etc/fstab`.

## 7. Samba4 como controlador de dominio Active Directory

A partir de la versión 4, **Samba** dejó de ser "solo" un servidor de archivos e impresión compatible con Windows para incorporar una **implementación completa de Active Directory**, integrando LDAP, Kerberos y DNS en una misma infraestructura sobre Linux. Esto permite que un servidor Ubuntu actúe como controlador de dominio para clientes Windows y Linux por igual, sin depender de un Windows Server (criterio c).

El despliegue típico de un dominio Samba4 requiere fijar de antemano varios parámetros (criterio d, configuración y personalización):

| Parámetro | Ejemplo |
|---|---|
| Nombre del controlador | `nombre-dc-smb` |
| Nombre DNS del dominio | `nombre.sistemas` |
| Reino Kerberos | `NOMBRE.SISTEMAS` (en mayúsculas por convención) |
| Nombre NetBIOS | `NOMBRE` |
| IP fija del servidor | `172.16.31.200` |
| Reenviador DNS | `172.16.31.1` |

El procedimiento de instalación sigue, en líneas generales, esta secuencia:

1. Fijar IP estática y nombre de host, y actualizar el sistema.
2. Instalar los paquetes `samba`, `smbclient`, `krb5-config` y `winbind`.
3. Renombrar (o hacer copia de) el `smb.conf` por defecto, para partir de una configuración limpia.
4. Promover el servidor con `samba-tool domain provision`, en modo interactivo, aceptando o ajustando los valores sugeridos.
5. Copiar el `krb5.conf` generado en `/var/lib/samba/private/` a la ruta de sistema (`/etc/krb5.conf`).
6. Ajustar la resolución de nombres: deshabilitar `systemd-resolved` como gestor de `resolv.conf` y sustituirlo por uno apuntando al propio servidor.
7. Activar el servicio `samba-ad-dc`.

Tras la instalación, el criterio (i) exige comprobar el funcionamiento con las mismas herramientas de línea de comandos que en cualquier otro despliegue LDAP/Kerberos:

```bash
# Nivel funcional del dominio (equivalente a la versión de Windows Server que emula)
samba-tool domain level show

# Comprobación de los registros SRV de LDAP y Kerberos
nslookup -type=SRV _ldap._tcp.nombre.sistemas
nslookup -type=SRV _kerberos._udp.nombre.sistemas

# Integridad de la configuración de Samba
testparm
```

!!! tip "Un fallo habitual: compatibilidad NT1 con clientes Windows antiguos"
    Al conectar con `smbclient` desde según qué configuraciones puede aparecer un error de negociación de protocolo con clientes que aún dependen de SMBv1. La solución más rápida es activar explícitamente el protocolo **NT1** en `smb.conf`, aunque a medio plazo lo recomendable es migrar cualquier cliente heredado a un protocolo SMB más moderno y seguro.

## 8. Directivas de grupo (GPO): configuración y personalización centralizada

Las **directivas de grupo** (*Group Policy Objects*, GPO) son el mecanismo por excelencia de Active Directory para aplicar configuración y personalización de forma centralizada (criterio d) a los usuarios y equipos de una o varias unidades organizativas, sin tener que tocar máquina por máquina.

Una GPO puede vincularse a distintos niveles del dominio —todo el dominio, una OU concreta, o incluso bloquearse para que no se herede en un contenedor determinado (por ejemplo, en `Domain Controllers`, para no aplicar sobre los propios controladores las políticas pensadas para clientes)—. Algunos ejemplos de configuración habitual:

| Configuración | Ubicación en la GPO | Efecto |
|---|---|---|
| Página de inicio del navegador | Configuración de usuario → Preferencias | Fuerza una URL de inicio para todos los usuarios afectados |
| Límite de tamaño de perfil | Configuración de usuario → Directivas → Sistema → Perfiles de usuario | Restringe el espacio del perfil local (por ejemplo, 40 MB para Profesorado, 20 MB para Alumnado) |
| Restricción del panel de control | Configuración de usuario → Plantillas administrativas → Panel de control | Impide el acceso a la configuración del equipo a un colectivo concreto |

!!! example "Una GPO distinta por unidad organizativa"
    Un caso típico de examen y de práctica profesional consiste en aplicar políticas **diferenciadas** según la OU: al Profesorado se le permite un perfil de hasta 40 MB, mientras que al Alumnado se le limita a 20 MB y, además, se le bloquea el acceso al panel de control. Esto no se consigue con una única GPO en el dominio, sino creando una GPO distinta vinculada a cada OU, lo que demuestra por qué el diseño de la jerarquía de OUs (apartado 3) no es un detalle menor: **la jerarquía de OUs es, en la práctica, la jerarquía de políticas aplicables**.

![Directiva de grupo que limita a 40 MB el tamaño del perfil local de la OU Profesorado](../assets/img/add/01/01-23.png)

Tras crear o modificar una GPO conviene comprobar su aplicación real (no basta con que la consola indique "Habilitado"): iniciar sesión con un usuario afectado y verificar el comportamiento esperado (la página de inicio correcta, el aviso de cuota superada, el panel de control bloqueado).

![Directiva de grupo que prohíbe el acceso a Configuración de PC y al Panel de control en la OU Alumnado](../assets/img/add/01/01-31.png)

## 9. Integración del servicio de directorio con otros servicios de red

El criterio (e) exige entender que un servicio de directorio nunca funciona aislado: se apoya en, y da soporte a, otros servicios de infraestructura.

- **DNS**: es la base sobre la que se localizan los propios servicios del directorio. Cuando un cliente necesita encontrar un controlador de dominio o un servidor LDAP, lo habitual y profesional es que lo **descubra mediante DNS** (registros SRV), no que se configure la IP "a mano" en cada cliente. Un servidor DNS mal configurado, aunque el directorio esté bien instalado, provoca fallos de autenticación difíciles de diagnosticar si no se empieza por comprobar la resolución de nombres.
- **DHCP**: en redes con Active Directory es habitual que el propio servidor DHCP entregue, entre sus opciones de ámbito, la dirección del servidor DNS del dominio, de modo que los clientes que reciben IP dinámica queden automáticamente apuntando al DNS correcto.
- **Kerberos**: proporciona la autenticación subyacente tanto en Active Directory como en Samba4, mediante un sistema de tickets (TGT) que evita transmitir la contraseña en cada petición de servicio.
- **NFS**: como se ha visto en el apartado 6, permite combinar LDAP con perfiles móviles de usuario.
- **Enrutamiento / NAT**: en topologías con dos adaptadores de red (LAN interna y WAN externa), el servicio de enrutamiento permite que los clientes del dominio salgan a Internet a través del propio controlador, típicamente mediante traducción de direcciones (NAT).

| Servicio integrado | Qué aporta al directorio |
|---|---|
| DNS | Localización de servicios (SRV), resolución de nombres internos |
| DHCP | Asignación dinámica de IP y de la configuración de DNS del dominio |
| Kerberos | Autenticación mediante tickets, sin transmitir contraseñas en claro |
| NFS | Perfiles de usuario centralizados y accesibles desde cualquier cliente |
| Enrutamiento/NAT | Salida a Internet de los clientes del dominio |

## 10. Documentación del servicio de directorio

El último criterio de la unidad, el (j), es el que con más frecuencia se pasa por alto en la práctica: **documentar** la estructura e implantación del servicio de directorio no es un trámite posterior, sino parte del trabajo de administración en sí mismo. Un directorio sin documentar es, a efectos prácticos, un directorio que solo entiende quien lo creó.

Una documentación mínima y razonable debería incluir:

- El **nombre de dominio** elegido y su justificación (`nombre.sistemas`, `dc=nombre,dc=local`...).
- El **diagrama de la jerarquía de OUs**, grupos y su propósito.
- Las **GPO aplicadas**, a qué OU están vinculadas y qué configuran.
- Los **parámetros de red** del controlador (IP fija, DNS, reenviador).
- Los **procedimientos de comprobación** utilizados (capturas de `nslookup`, `testparm`, `samba-tool domain level show`, inicio de sesión de prueba).
- Un **registro de incidencias** y su solución (por ejemplo, el problema de Wayland con GDM3, o la necesidad de activar NT1 en Samba).

!!! tip "La documentación como parte de la evaluación"
    En la [práctica de esta unidad](ut01-practica.md) y en su [rúbrica](ut01-rubrica.md) la documentación no es un apartado aislado: aparece transversalmente en casi todos los bloques, porque sin capturas y explicación del procedimiento no hay forma de comprobar que el criterio (j) —y, en la práctica, casi ningún otro criterio— se ha cumplido realmente.

## 11. Glosario rápido de la unidad

- **DIT** (*Directory Information Tree*): estructura jerárquica en árbol donde LDAP organiza las entradas del directorio.
- **DN / CN / DC**: identificador completo de una entrada, nombre dentro de su rama, y componente del nombre de dominio.
- **OU**: contenedor lógico para agrupar objetos y aplicar delegación de tareas y directivas de grupo.
- **GPO**: objeto de directiva de grupo, mecanismo de Active Directory para configuración centralizada.
- **NSS / PAM**: mecanismos de Linux para localizar información de cuentas y para autenticar, respectivamente.
- **Kerberos**: protocolo de autenticación basado en tickets, usado por Active Directory y Samba4.
- **LDIF**: formato de texto para representar y transferir entradas de un directorio LDAP.
- **Catálogo global (GC)**: controlador de dominio que almacena información resumida de todo el bosque.

## 12. Autoevaluación rápida

1. Explica, sin usar la palabra "Windows", qué problema resuelve un servicio de directorio frente a mantener `/etc/passwd` en cada máquina. (apartado 1)
2. ¿Qué diferencia hay entre un dominio, un árbol y un bosque en Active Directory? (apartado 2)
3. Escribe el DN completo de un usuario `mrodriguez` que pertenece a la OU `Profesorado` del dominio `iesnorte.local`. (apartado 4)
4. ¿Por qué no es correcto decir "tengo LDAP instalado"? (apartado 4)
5. ¿Qué papel juega NSS y qué papel juega PAM en la integración de un cliente Linux con LDAP? (apartado 6)
6. Propón una GPO distinta para dos OUs con necesidades de seguridad diferentes, igual que se hizo con Profesorado y Alumnado. (apartado 8)
7. ¿Por qué el DNS es una pieza crítica incluso cuando el problema que se detecta parece ser "de autenticación"? (apartado 9)

## 13. Ejemplo de síntesis

!!! example "De la instalación al cliente integrado"
    Un centro educativo decide sustituir la gestión manual de cuentas por un dominio Samba4: (1) **instala** el controlador de dominio (`samba-tool domain provision`) con el dominio `iesnorte.sistemas`; (2) **diseña el esquema** creando las OUs `Profesorado` y `Alumnado`, cada una con sus grupos y usuarios; (3) **configura y personaliza** GPOs distintas para cada OU (cuota de perfil, restricciones de panel de control); (4) **integra** el directorio con DNS (registros SRV) y con NFS para perfiles móviles; (5) **añade clientes** Windows (unión directa al dominio) y Linux (`realmd` + `sssd`); (6) **documenta** todo el proceso con capturas y un breve informe de la arquitectura. Cada uno de estos seis pasos corresponde a uno o varios de los diez criterios de evaluación de esta unidad.

## Para profundizar

Esta unidad se ha construido a partir del material de clase de Administración de Sistemas Operativos 2025/26, incluyendo la resolución práctica de la actividad de directivas de grupo (GPO), servicio IIS y escritorio remoto sobre Windows Server, así como los manuales de referencia sobre LDAP en GNU/Linux y sobre la configuración de Samba4 como controlador de dominio recogidos en la unidad original. El resto de enlaces y materiales de apoyo está recopilado en la página de [Recursos](99-recursos.md).

##
##

# **🗂️ UT01 · Servicio de directorio**

## Teoría

### Active Directory (Windows / AWS)

# 5.1 Active Directory con AWS

Controlador de dominio
Gestión de objetos del dominio
Servicio DNS
Servicio DHCP
Servicio de enrutamiento
Añadir equipo al dominio
Conceptos de la nube
Amazon Web Services
Amazon VPC
Servicios de computo



# CONTROLADOR DE DOMINIO
Configuración del servidor con los siguientes pasos:
Dos Adaptadores de red, una para la red externa WAN y otro para la red interna LAN.
Cambiar nombre del servidor para identificarlo.
Actualizar servidor a la ultima versión disponible.











# ACTIVE DIRECTORY
Herramienta de administración centralizada que se utiliza para gestionar los recursos de red, como cuentas de usuarios, grupos, equipos, impresoras, aplicaciones, servicios en una red, directivas de seguridad,… estás son almacenadas en la base de  datos SAM (Security Accounts Manager)
El servicio de directorio de Active Directory almacena esta información en una estructura jerárquica, lo que facilita la gestión y el control de los recursos de la red. La información almacenada en Active Directory incluye información de autenticación y autorización, así como información de configuración y administración.





# ACTIVE DIRECTORY Características
Servicio de directorio centralizado: almacena información sobre los recursos de red en un único lugar, lo que facilita su administración y control.
Autenticación y autorización: proporciona un mecanismo de autenticación y autorización para los usuarios y recursos de la red, lo que permite el acceso seguro y controlado a los recursos.
Políticas de grupo: permite la creación de políticas de grupo que se pueden aplicar a usuarios y equipos, lo que permite la administración centralizada de la configuración de la red.
Soporte para múltiples dominios: es capaz de manejar múltiples dominios en una misma red, lo que permite la administración de diferentes áreas de la red de manera independiente.
Escalabilidad: es altamente escalable y puede manejar redes de cualquier tamaño, desde pequeñas empresas hasta grandes corporaciones.
Integración con otras tecnologías de Microsoft: se integra con otras tecnologías de Microsoft, como Exchange Server y SharePoint, para proporcionar una experiencia de red más completa.

# ACTIVE DIRECTORY
AD tiene tres niveles principales: dominios, árboles y bosques.
Dominios: es la unidad básica de administración de Active Directory esta formada por un grupo de objetos relacionados entre sí y almacenados en una única base de datos. (usuarios, grupos, equipos, impresoras…)
Árbol: colección de uno o más dominios que comparten una relación de confianza bidireccional. Todos los dominios en un árbol comparten un espacio de nombres de dominio común. Ejemplo: dominio1.sistemas y dominio2.sistemas forman un árbol si están en la misma estructura jerárquica de Active Directory.
Bosque: es la entidad de nivel superior en la jerarquía y representa una colección de árboles de dominios. Los dominios dentro de un bosque comparten una relación de confianza, lo que permite una administración centralizada y la transparencia para los usuarios y recursos en todo el bosque.

# ACTIVE DIRECTORY
Relación de confianza entre dominios es un mecanismo que permite que los usuarios de un dominio accedan a recursos en otro dominio sin tener que proporcionar credenciales adicionales. En una relación de confianza, un dominio confía en otro para autenticar a los usuarios y proporcionarles acceso a los recursos compartidos. Los dos tipos de relaciones de confianza principales son los:
Unidireccional, un dominio confía en otro para autenticar a los usuarios, pero el dominio confiado no confía en el dominio que solicita la autenticación.
Bidireccional, ambos dominios se confían mutuamente y pueden autenticar a los usuarios del otro dominio.



# ACTIVE DIRECTORY
Controlador de dominio es un servidor que ejecuta el servicio de Active Directory Domain Services (ADDS), las organizaciones tienen varios DC y cada uno tiene una copia del directorio para todo el dominio, sus principales funciones son:
Autenticación: Los controladores de dominio autentican a los usuarios y dispositivos, verificando sus credenciales cuando intentan acceder a la red.
Autorización: Después de la autenticación, los controladores de dominio determinan los recursos y permisos a los que un usuario o dispositivo tiene acceso dentro de la red.
Replicación: proceso mediante el cual se sincroniza la información de la base de datos de Active Directory en varios controladores de dominio en una red de Windows. La replicación garantiza que todos los controladores de dominio tengan la misma información actualizada y consistente sobre los objetos de Active Directory, como usuarios, grupos, equipos y políticas de grupo.



# ACTIVE DIRECTORY
Global Catalog: Uno de los controladores de dominio en cada bosque se designa como un "catálogo global“ que contiene información sobre todos los objetos del bosque y se utiliza para búsquedas y consultas globales. Es el ADDS el que se encarga de almacenar información sobre los usuarios, grupos, equipos y otros objetos de la red en dicho catalogo para su funcionamiento se basa en los siguientes protocolos:
LDAP (Lightweight Directory Access Protocol): principal protocolo de acceso a directorios utilizado por ADDS que se utiliza para acceder y administrar la información almacenada en la base de datos de Active Directory.
Kerberos: protocolo de autenticación predeterminado por ADDS que se utiliza para verificar la identidad de los usuarios y equipos que intentan acceder a los recursos de la red.
DNS: protocolo que se utiliza para resolver nombres de dominio en direcciones IP. DNS es un componente crítico de ADDS, ya que permite a los usuarios y equipos de la red acceder a los recursos mediante nombres de dominio en lugar de direcciones IP.
RPC (Remote Procedure Call): protocolo que se utiliza para la comunicación entre aplicaciones en diferentes sistemas operativos. ADDS utiliza RPC para comunicarse con los clientes y otros servidores de la red.

# CONTROLADOR DE DOMINIO
Una vez terminada a instalación del Active Directory en el  servidor, nos da la posibilidad de promoverlo a controlador de dominio. Hacemos clic  con el ratón para realizarlo y seguimos los pasos del asistente.
A continuación, se muestran las diferentes capturas del asistente de instalación de active directory y después las capturas del asistente de promoción a controlador de dominio para explicarse los pasos seguidos a continuación.

Para tener un controlador de dominio antes debemos  instalar el active directory por ello debemos tener una IP estática (adaptador LAN).
También debemos tener claro el nombre del dominio y agregar el rol de Servicios de dominio de Active Directory.
Administrar
 Agregar roles y características
 Instalación basada en características o roles
 Seleccionar nuestro servidor
 Servicios de dominios de Active Directory

# CONTROLADOR DE DOMINIO

















# CONTROLADOR DE DOMINIO
Configuración de implementación:
Agregar un controlador de dominio a un dominio existente: se usa cuando ya tenemos un dominio  creado y queremos agregar un controlador a dicho dominio. No es nuestro caso, puesto que es nuestra  primera implementación del dominio.
Agregar un nuevo dominio a un bosque existente: tampoco es nuestro caso.
Agregar un nuevo bosque: sería nuestro caso. Este nuevo bosque se crea junto con nuestro primer dominio. Así pues elegimos esta opción.
En el Asistente para configuración de Servicios de dominio de Active Directory también debemos especificar el nombre del dominio raíz: yeray.sistemas



# CONTROLADOR DE DOMINIO
Opciones del controlador:
Nivel funcional determina qué características y funciones pueden implementarse en el bosque o en  el dominio. Permite compatibilidad con servidores anteriores.
Capacidades del Controlador
DNS: Para poder administrar un dominio debemos tener instalado un servidor DNS. Por defecto, al  promover un servidor a controlador de dominio se nos dará la opción de instalarlo.
Catálogo global (GC), esto es así porque el primer controlador de dominio del bosque debe ser un servidor de catálogo global.
Controlador de  dominio de solo lectura (RODC) desactivada debido a que el primer controlador de dominio del bosque no puede ser de solo lectura. Este no permite que se añadan usuarios o equipos al dominio, simplemente lee los datos de otro controlador de  dominio.
Contraseña de restauración de servicios de directorio (DSRM), IMPORTANTE puesto que es necesaria si tuviéramos que hacer una  restauración desde una copia de seguridad del DC. Esta no tiene  relación con la cuenta de administrador del Dominio, no se sincroniza, y es individual para cada DC.



# CONTROLADOR DE DOMINIO
Opciones de DNS: Nos advierte que no se puede crear una delegación para este servidor DNS puesto que es el primero que creamos. Obviamos la advertencia y picamos en Siguiente.
Opciones adicionales: Indica el NetBIOS, que será el que veamos cuando se inicie sesión en el dominio.  Por defecto nos pone la primera parte del nombre del dominio raíz. yeray
Rutas de acceso: Muestra en qué carpetas se almacena la base de datos del active directory. Lo dejamos por defecto y picamos en Siguiente.
Revisar opciones: Muestra un resumen de las opciones escogidas a lo largo del proceso de promoción a controlador de dominio.
Comprobación de requisitos: Comprueba los requisitos previos a la instalación. Si sale un tick verde es que todo está bien y podemos Instalar. Se nos muestras advertencias que obviaremos. Una vez terminada la instalación  el servidor se reiniciará y ya será un controlador de dominio.











# CONTROLADOR DE DOMINIO
Iniciamos sesión y vemos que tenemos instalado el Active directory y el DNS. En el Servidor local  ahora vemos que estamos en un dominio. Asimismo, se han instalado nuevas herramientas para  administrar el dominio (Ir a herramientas y veremos entre otras Usuarios y equipos de active  directory).







# GESTIÓN DE OBJETOS DEL DOMINIO
Usuarios: Representan a las personas que utilizan el sistema. Cada usuario tiene una cuenta de usuario que contiene información como su nombre de inicio de sesión, contraseña y permisos de acceso.
Grupos: Son conjuntos de usuarios que comparten ciertas características o permisos de acceso. Los grupos pueden utilizarse para simplificar la administración de permisos y recursos en una organización.
Equipos: Representan a los dispositivos que se conectan a la red, como estaciones de trabajo, servidores y dispositivos móviles.
Impresoras: Representan las impresoras y otros dispositivos de impresión que se utilizan en la red.
Unidades organizativas (OU): Son contenedores lógicos que se utilizan para agrupar objetos similares en una jerarquía organizativa.
Dominios: Son grupos de objetos de Active Directory que se organizan en una jerarquía lógica y comparten una base de datos común.
Controladores de dominio: Son servidores que alojan una copia de la base de datos de Active Directory y proporcionan servicios de autenticación y autorización para los usuarios y equipos de la red.
Sitios: Representan la topología física de la red, como la ubicación geográfica de los servidores y equipos. Los sitios se utilizan para mejorar el rendimiento y la disponibilidad de los servicios de Active Directory.

# GESTIÓN DE OBJETOS DEL DOMINIO
Builtin: Cuentas de grupo de dominio local creadas de forma predeterminada para el dominio. Se utilizarán para gestionar el control de acceso, permisos de acceso, sobre los recursos del sistema.
Computers: Contenedor por defecto para las cuentas de equipo que se añadan al dominio.
Domain Controllers: Contiene por defecto los controladores de dominio de este dominio
Users: Contiene cuentas de usuario y grupos predeterminados del dominio.

Para administrar los objetos del dominio debemos entrar,  en el Panel del Servidor:  Herramientas  Usuarios y equipos de active  directory.



# GESTIÓN DE OBJETOS DEL DOMINIO
Unidades organizativas (OU): Son contenedores que se utilizan para agrupar objetos similares en una jerarquía organizativa dentro de Active Directory. Se utilizan para facilitar la gestión de la red y los recursos al permitir la delegación de tareas y la aplicación de políticas de grupo específicas a los objetos que se encuentran dentro de ellas. Por ejemplo, si tienes una empresa con diferentes departamentos como ventas, marketing, contabilidad, recursos humanos, etc., puedes crear una OU para cada uno de estos departamentos. Luego, puedes agregar los usuarios, grupos y equipos relevantes a cada OU según su función en el departamento. De esta manera, puedes aplicar políticas de grupo específicas a cada OU, lo que permite una gestión más eficiente de la red y los recursos.

# GESTIÓN DE OBJETOS DEL DOMINIO
Funciones de las Unidades Organizativas:
Delegación de tareas: Se utilizan para delegar tareas de gestión a los administradores específicos para cada departamento o grupo. Al otorgar permisos de administrador solo para la OU relevante, se puede limitar el acceso a los objetos que se encuentran en otras OUs, lo que aumenta la seguridad y reduce la posibilidad de errores de administración.
Aplicación de políticas de grupo: Se utilizan para aplicar políticas de grupo específicas a los objetos que se encuentran dentro de ellas. Las políticas de grupo son un conjunto de reglas que se aplican a los objetos de Active Directory para establecer configuraciones de seguridad, restricciones de acceso y otros ajustes.
Control de acceso: Se utilizan para controlar el acceso a los recursos de la red. Al agrupar los objetos según sus funciones, se puede establecer permisos de acceso específicos para cada grupo de objetos.
Simplificación de la gestión: Se utilizan para simplificar la gestión de los objetos de Active Directory al agruparlos en una estructura organizativa lógica. Esto permite a los administradores de la red encontrar y administrar los objetos de manera más eficiente y reduce la posibilidad de errores de administración.

# GESTIÓN DE OBJETOS DEL DOMINIO
Creación de unidad organizativa





# GESTIÓN DE OBJETOS DEL DOMINIO
Grupos: recopilan cuentas de usuario, de equipo y otros grupos en unidades administrables. Trabajar con grupos en lugar de con usuarios individuales ayuda a simplificar el mantenimiento y la administración de la red. Hay dos tipos de grupos en Active Directory:
Grupos de distribución solo se pueden usar con aplicaciones de correo electrónico (como Exchange Server) para enviar correo electrónico a colecciones de usuarios. Los grupos de distribución no están habilitados para la seguridad.
Grupos de seguridad pueden proporcionar una forma eficaz de asignar acceso a los recursos de la red. Al usar grupos de seguridad, puede:
Asignar derechos de usuario a grupos de seguridad en Active Directory.
Asignar permisos a grupos de seguridad para recursos.

# GESTIÓN DE OBJETOS DEL DOMINIO
Dominio local
Puede contener grupos universales, globales y otros grupos locales de dominio y cuentas de cualquier dominio o bosque.
Puede conceder derechos y permisos sobre los recursos que residen en el dominio en el que esta ubicado el grupo.

Global
Puede contener usuarios, equipos y grupos globales de su propio dominio.
Puede conceder derechos y permisos a los grupos de seguridad global para los recursos de cualquier dominio del bosque.

Universal
Puede contener usuarios, equipos, grupos universales y grupos globales de cualquier dominio del bosque.
Puede conceder derechos y permisos a los grupos de seguridad universales para los recursos de cualquier dominio del bosque.







# GESTIÓN DE OBJETOS DEL DOMINIO
Creación de grupos











# GESTIÓN DE OBJETOS DEL DOMINIO
Usuarios : En un entorno de Active Directory, los usuarios se crean en unidades organizativas (UO) que son contenedores dentro del directorio donde se organizan y gestionan los objetos de la red, incluyendo usuarios, grupos y equipos. No se crean directamente en carpetas de usuario.







# GESTIÓN DE OBJETOS DEL DOMINIO
Miembro de: Para administrar en grupos o dominios al usuario.

General: Información general del usuario.





# GESTIÓN DE OBJETOS DEL DOMINIO
Cuenta:
Horas de inicio de sesión: podemos indicar qué horas puede iniciar sesión el usuario.
Iniciar sesión en: podemos indicar que el usuario sólo  pueda iniciar sesión en un determinado equipo.
Desbloquear cuenta: si la cuenta está bloqueada, estaría marcado. Por ejemplo, si un usuario se equivoca en la  contraseña repetidas veces, la cuenta se bloqueará.  En ese caso el Administrador entrará en dicha cuenta  y marcará la casilla de Desbloquear cuenta (aplicar,  aceptar)
Opciones de cuenta: las mismas opciones que se vieron en la creación de la cuenta.
La cuenta expira: si queremos que expire la cuenta porque es un usuario que va a estar poco  tiempo en el sistema podemos darle una fecha de  expiración.



# SERVICIO DNS
El servicio DNS (Domain Name System) o sistema de nombres de dominios es un sistema para  asignar nombres a equipos y servicios de red que se organizan en una jerarquía de dominios. La asignación de nombres DNS se utiliza en las redes TCP/IP, como Internet, para localizar equipos  y servicios con nombres sencillos. Cuando un usuario escribe un nombre DNS en una aplicación, los  servicios DNS podrán traducir el nombre a otra información asociada con el mismo, como una  dirección IP.
IMPORTANTE: en un directorio activo lo que se instala es un servidor DNS local. Las entradas  existentes en nuestro DNS no serán visibles en Internet y resolverán direcciones de recursos de  nuestra red local (equipos, impresoras, servidores web, etc). Cuando un usuario de  nuestra red intente acceder a un recurso local, podrá utilizar la resolución creada para tal fin en el  DNS local, y acceder así al recurso deseado mediante su nombre en vez de utilizar su dirección IP; si  el usuario desea acceder a algún recurso no perteneciente a nuestra red local, sino situado en  Internet, el DNS local nunca podrá llevar a cabo dicha resolución y trasladará dicha solicitud al siguiente servidor DNS en su jerarquía de servidores DNS, y así  sucesivamente hasta que resuelva dicha resolución.

# SERVICIO DNS
Vamos a ver la consola de administración del servicio DNS que se instaló con el active directory: Herramientas  DNS
Vemos las propiedades del servidor YERAYSERWIN.





# SERVICIO DNS
En la pestaña Interfaces están las direcciones IP  de los servidores DNS que darán servicio a las  consultas DNS. Por defecto veremos que están  seleccionadas todas las direcciones IP.
En realidad queremos que el servidor DNS sólo  atienda las peticiones procedentes de la red  interna, por lo que habría que seleccionar sólo la  192.168.1.220
Una vez seleccionada picamos en el botón Aplicar y luego en Aceptar.



# SERVICIO DNS
En la consola de administrador del servicio DNS vemos que se ha creado una zona de búsqueda directa por defecto para el dominio: yeray.sistemas . Es  una zona creada de modo automático por el propio servicio DNS del equipo YERAYSERWIN para controlar el dominio donde se realizará la resolución de nombres a direcciones IP.





# SERVICIO DNS
La zona de búsqueda inversa permite resolver direcciones IP a nombres. El requisito es que exista un denominado registro PTR ("puntero") vinculado con el nombre y que permita este tipo de búsqueda "inversa" en el sistema de nombre de dominio.
En nuestro caso, si quisiésemos resolver la IP del servidor para obtener su  nombre (búsqueda inversa), no funciona porque necesitamos configurar la Zona de búsqueda  inversa:

La zona de búsqueda directa permite resolver nombres a direcciones IP. Por  ejemplo, si quisiésemos resolver el nombre de nuestro servidor y obtener su IP. En esta zona se irán incluyendo entradas  de modo automático a medida que vayamos integrando equipos en el  dominio “yeray.sistemas”.
Para comprobar abrimos la terminal y utilizamos el comando  nslookup seguido del nombre del servidor. Este comando nos devuelve la IP  del servidor (resuelve el nombre):





# SERVICIO DNS
Para crear una Zona de búsqueda inversa del servidor DNS, pulsamos  con el botón derecho del ratón sobre la carpeta Zona de búsqueda inversa y seleccionando tras ello la opción Zona nueva... en el  desplegable correspondiente. A continuación, comienza un asistente para la creación de la nueva zona inversa:





# SERVICIO DNS













# SERVICIO DNS
Para finalizar solo nos queda crear el puntero PTR y comprobar su funcionamiento:







# SERVICIO DHCP
El servicio DHCP (Dynamic Host Configuration Protocol) es el protocolo de  configuración dinámica de host, un estándar TCP/IP diseñado para simplificar la  administración de la configuración IP de los equipos de nuestra red. El estándar  DHCP permite el uso de servidores DHCP para administrar la asignación dinámica a  los clientes DHCP de la red, de direcciones IP y de otros detalles de configuración  relacionados con el direccionamiento IP, tales como la puerta de enlace o los  servidores DNS, por ejemplo, siempre que los clientes estén configurados para  utilizar un servidor DHCP, en lugar de estar configurados manualmente con una  dirección IP estática.
Instalar servicio
Configurar servicio
Crear Ambito



### Notes:

# SERVICIO DHCP
Instalar servicio











### Notes:

# SERVICIO DHCP
2. Configurar servicio





### Notes:

# SERVICIO DHCP
3-. Agregar ámbito.
Un ámbito es un rango de direcciones IP que serán las que asignará el servicio DHCP a las máquinas clientes de forma dinámica. Antes de instalar el servidor DHCP debemos tener claro el rango de direcciones IP  que vamos a usar para asignar a nuestros clientes y debemos de tener en cuenta:
El rango de las IP´s no debemos incluir la IP del servidor.
Se pueden excluir ciertas IP´s del ámbito, por ejemplo, las correspondientes a  impresoras en red, que queremos que sean siempre las mismas.





### Notes:

# SERVICIO DHCP





















### Notes:

# SERVICIO DHCP

Nota: Cuando se enciende un equipo y está en la misma red que un servidor DHCP, automáticamente el servidor DHCP le asigna una IP.

Conjunto de direcciones: es el rango de direcciones IP
Concesiones de direcciones: aparecen los equipos clientes que tienen asignada dirección IP a través del DHCP
Reservas: direcciones IP reservadas.
Opciones de ámbito: nos aparecerá cuál es el enrutador, cuál el  servidor DNS y cuál es el nombre de dominio DNS.



### Notes:

# SERVICIO DE ENRUTAMIENTO
El Acceso Remoto permite conectividad a usuarios remotos o conectividad entre sitios mediante conexiones de acceso telefónico o de red privada virtual (VPN). Con este rol se pueden instalar los servicios que vemos en la imagen.
El servicio de enrutamiento nos permite que los clientes se conecten a internet. Tenemos dos tarjeta de red (LAN y WAN). Los clientes conectarían a través de la LAN al servidor, mediante el servicio de enrutamiento pasarían de la LAN a la WAN y saldrían a internet.







### Notes:

# SERVICIO DE ENRUTAMIENTO
Cada vez que se instale un nuevo rol o servicio el siguiente paso será su configuración a través del menú de herramientas, donde en primer lugar lo habilitaremos y a continuación lo configuraremos

En el Administrador del servidor saldrá un aviso. Si picamos sobre él nos indicará que se requiere configurar el DirectAccess y VPN.
Puesto que no lo necesitamos, abrimos el asistente para introducción y lo cerramos y picamos en Aceptar.









### Notes:

# SERVICIO DE ENRUTAMIENTO











### Notes:

# SERVICIO DE ENRUTAMIENTO


Asistente para la instalación
Seleccionamos Traducción de direcciones de red (NAT), que permitirá a los clientes de la red interna la salida a Internet utilizando la dirección IP del adaptador de red “WAN”, que configuraremos a continuación.
Indicar cual será el adaptador de red que permitirá la salida hacia Internet, en nuestro caso seleccionaremos el adaptador de red "WAN“.
Por último, nos indica la necesidad de configurar los servicios DNS y DHCP para que funcione correctamente el enrutamiento
Vemos cómo el servicio de enrutamiento y acceso remoto ya está configurado (vemos una flecha verde encima del servidor.









### Notes:

# AÑADIR EQUIPO AL DOMINIO
Para conectar una máquina al dominio, por ejemplo, un cliente Windows hay que configurar el adaptador de red como red interna (en la máquina  virtual).
En VirtualBox: Adaptador de red: Red interna. El nombre de la red interna debe ser el mismo que de la máquina donde tenemos el servidor.
Después en Windows debemos configurar el adaptador de red de forma  que tenga una dirección IP que esté dentro de la red donde está el servidor. De puerta de enlace vamos a utilizar la IP  estática de nuestro servidor. Si esta todo bien configurado y hacemos ping entre las maquinas debe de haber respuesta.





# AÑADIR EQUIPO AL DOMINIO
Windows
Antes de añadir el equipo al dominio modificamos el nombre del equipo para que sea fácil de identificar a yeraywin11, reiniciamos y lo añadimos al dominio:
Sistema  Información  Dominio o grupo de trabajo



# AÑADIR EQUIPO AL DOMINIO









# AÑADIR EQUIPO AL DOMINIO
Comprobaciones en cliente y en servidor:
Una vez reiniciemos nos da la opción con Otra cuenta de iniciar sesión en el dominio. Debemos  ingresar el nombre de usuario (creado en servidor) y su contraseña.







# AÑADIR EQUIPO AL DOMINIO
A continuación, configuramos la red del equipo dinámicamente para comprobar el funcionamiento del servicio de DHCP del servidor:





# AÑADIR EQUIPO AL DOMINIO

También comprobamos el DHCP en el servidor en concesiones de direcciones:

Para finalizar comprobamos el enrutamiento haciendo un ipconfig y un ping a al web de Google en una sola captura, y si el resultado es correcto quiere decir que la configuración esta completada.





# AÑADIR EQUIPO AL DOMINIO
A continuación añadiremos un equipo Fedora al dominio, al iniciarlo en la misma red que el dominio ya el servicio DHCP no asigna una IP dentro del rango, solo tendremos que comprobar.
A continuación, comprobaremos si se reconoce el reino con las opciones del comando real.







# AÑADIR EQUIPO AL DOMINIO
Para evitar problemas deshabilitaremos las reglas de seguridad de SELinux, editando el fichero /etc/selinux/config cambiando la última línea como se muestra en la captura:



# AÑADIR EQUIPO AL DOMINIO


Reiniciamos el sistema y comprobamos que podemos hacer ping tanto al servidor como al dominio.

# AÑADIR EQUIPO AL DOMINIO
Añadimos un nuevo usuario en fedora, dicho usuario tendremos que asegurarnos que este marcado como usuario de inicio de sesión corporativo:
Para asegurarnos que el nombre de la máquina esta unido al dominio teclearemos:







# AÑADIR EQUIPO AL DOMINIO
Finalizamos iniciando sesión con el usuario del dominio que hemos agregado al equipo:





# CONCEPTOS DE LA NUBE
La informática en la nube es la entrega bajo demanda de potencia de cómputo, bases de datos, almacenamiento, aplicaciones y otros recursos de TI, a través de Internet con un sistema de precios de pago por uso, esta visión permite dejar de considerar la infraestructura como hardware y, en cambio, verla (y usarla) como software. Algunas definiciones importantes son:
Servicios bajo demanda: Acceso instantáneo a recursos informáticos como almacenamiento, servidores y aplicaciones, sin la necesidad de gestión directa por parte del usuario.
Elasticidad: Capacidad de escalar recursos hacia arriba o hacia abajo según las necesidades del usuario, permitiendo un uso eficiente de los recursos.
Modelo de pago por uso: Los usuarios pagan solo por los recursos informáticos que consumen.
Servicios basados en la nube: Incluyen infraestructura como servicio (IaaS), plataforma como servicio (PaaS) y software como servicio (SaaS), cada uno ofreciendo diferentes niveles de control y gestión.
Virtualización: Uso de software para simular hardware y permitir la ejecución de múltiples máquinas virtuales en un solo servidor físico, optimizando la utilización de recursos.
Escalabilidad: Capacidad de aumentar o reducir recursos informáticos de forma rápida y eficiente para satisfacer las demandas cambiantes del usuario.



# CONCEPTOS DE LA NUBE
Infraestructura como hardware
Soluciones de hardware:
Requieren espacio, personal, seguridad física, planificación e inversión de capital
Tienen un ciclo largo de adquisición de hardware
Le exigen aprovisionar capacidad mediante la predicción de los picos máximos teóricos
Infraestructura como software
Soluciones de software:
Son flexibles
Pueden cambiar de forma más rápida, sencilla y rentable que las soluciones de hardware
Eliminan las tareas pesadas innecesarias



# CONCEPTOS DE LA NUBE
Infraestructura como servicio (IaaS): permiten acceder a las características de redes, a los equipos (virtuales o en hardware dedicado) y al espacio de almacenamiento de datos.
La IaaS le ofrece el mayor nivel de flexibilidad y control de administración en relación con sus recursos de TI.
Plataforma como servicio (PaaS): reducen necesidad de administrar la infraestructura y le permiten centrarse en la implementación y la administración de sus aplicaciones.
Software como servicio (SaaS): Producto completo que el proveedor de servicios ejecuta y administra.





# CONCEPTOS DE LA NUBE
Infraestructura local: la implementación de recursos en las instalaciones mediante herramientas de administración de recursos y virtualización se denomina a veces nube local.
Híbrida: es una manera de conectar la infraestructura y las aplicaciones entre los recursos basados en la nube y los recursos existentes situados fuera de ella. Este modelo permite a una organización extender y aumentar su infraestructura en la nube mientras conecta los recursos de la nube a los sistemas internos.
Nube: una aplicación basada en la nube se encuentra completamente implementada en la nube, de modo que todas las partes de la aplicación se ejecutan en la nube.







# AMAZON WEB SERVICES
Plataforma de servicios en la nube proporcionada por Amazon, que ofrece una amplia gama de servicios web que permiten a las empresas y desarrolladores crear, implementar y gestionar aplicaciones sin la necesidad de infraestructura física. Además, ofrece soluciones como infraestructura como servicio (IaaS), plataforma como servicio (PaaS) y software como servicio (SaaS), brindando herramientas para almacenamiento, bases de datos, análisis, inteligencia artificial, seguridad y redes. Características:
Plataforma en la nube segura que ofrece un amplio conjunto de  productos globales basados en la nube.
Proporciona acceso bajo demanda a recursos informáticos, de almacenamiento, de red, de base de datos y otros recursos de TI y herramientas de administración.
Ofrece flexibilidad.
Solo paga por los servicios individuales que necesita, en la medida en que los utilice.
Los servicios de AWS trabajan en conjunto como piezas fundamentales.

# AMAZON WEB SERVICES


CATEGORÍAS

# AMAZON WEB SERVICES



# AMAZON WEB SERVICES





# AMAZON WEB SERVICES
La infraestructura de la nube de AWS se basa en regiones. AWS cuenta con 22 regiones en todo el mundo.
Una región de AWS es una ubicación geográfica física con una o varias zonas de disponibilidad.
Las zonas de disponibilidad, a su vez, constan de uno o varios centros de datos.
Para obtener tolerancia a errores y estabilidad, las regiones están aisladas unas de otras. Los recursos en una región no se replican automáticamente en otras regiones. Cuando almacena datos en una región específica, no se replica fuera de esa región.
Si las necesidades del negocio así lo requieren, es su responsabilidad replicar los datos en las regiones.


Irlanda
Londres
Fráncfort
París
Londres
3 zonas de disponibilidad

# AMAZON WEB SERVICES
Cada región cuenta con varias zonas de disponibilidad.
Cada zona de disponibilidad es una partición completamente aislada de la infraestructura de AWS.
Las zonas de disponibilidad constan de centros de datos discretos.
Están diseñadas para el aislamiento de errores.
Se interconectan con otras zonas de disponibilidad mediante redes privadas de alta velocidad.
Usted elige sus zonas de disponibilidad.
AWS recomienda replicar los datos y recursos entre las zonas de disponibilidad para obtener mayor resiliencia.

   Nube de AWS


Región eu-west-1


Zona de disponibilidad eu-west-1a
Centro de datos


Centro de datos


Centro de datos


Zona de disponibilidad eu-west-1b
Zona de disponibilidad eu-west-1c

# AMAZON VPC
Amazon VPC (Virtual Private Cloud) es un servicio de AWS que permite a los usuarios crear una red virtual aislada dentro de la nube de AWS. Con Amazon VPC, se puede tener un control total sobre el entorno de red, incluyendo:
La selección del rango de direcciones IP
La configuración de subredes
La creación de tablas de enrutamiento
La gestión de puertas de enlace (gateways) para conectividad interna y externa.
Esto ofrece una mayor seguridad y flexibilidad, ya que los usuarios pueden definir políticas de acceso y configurar firewalls, lo que permite alojar servicios web y aplicaciones en un entorno seguro y escalable.


Amazon VPC

# AMAZON VPC
VPC:
Se encuentra aislada de forma lógica de otras VPC
Dedicada a su cuenta de AWS
Pertenece a una única región de AWS y puede abarcar varias zonas de disponibilidad
Subredes:
Intervalo de direcciones IP que divide una VPC
Pertenece a una única zona de disponibilidad
Se clasifica como pública o privada

  Nube de AWS


  Región


Zona de disponibilidad 1
Zona de disponibilidad 2
 VPC




   Subred


   Subred

# AMAZON VPC
Al crear una VPC, se le asigna un bloque IPv4 de CIDR (un rango de direcciones IPv4 privadas).
No puede cambiar el rango de dirección después de crear la VPC.
El tamaño de bloque de CIDR IPv4 más grande es /16.
El tamaño de bloque de CIDR IPv4 más pequeño es /28.
También se admite IPv6 (con un límite de tamaño de bloque diferente).
Los bloques de CIDR de las subredes no pueden superponerse.

Al crear una subred, esta necesitasu propio bloque de CIDR. Para cada bloque de CIDR que especifique, AWS reserva cinco direcciones IP dentro de ese bloque y esas direcciones no están disponibles para usarse:
Direcciones de red
Enrutador local de la VPC (comunicaciones internas)
Resolución del sistema de nombres de dominio (DNS)
Uso futuro
Dirección de difusión de red

# AMAZON VPC
VPC con un bloque de CIDR IPv4 de 10.0.0.0/16 tiene 65.536 direcciones IP en total. La VPC tiene cuatro subredes del mismo tamaño. Solamente hay 251 direcciones IP disponibles para su uso en cada subred.





# AMAZON VPC
IP pública: Es una dirección IP asignada automáticamente a una instancia EC2 cuando se lanza en una subred pública. Esta IP permite que la instancia sea accesible desde internet. Sin embargo, la IP pública cambia cada vez que se detiene y vuelve a iniciar la instancia.
IP elástica: Es una dirección IP estática asignada a una cuenta de AWS, que puede ser asociada a una instancia EC2 y permanecer fija, incluso si la instancia se detiene y reinicia. Las IPs elásticas se pueden reasignar a otras instancias dentro de la misma cuenta, lo que brinda flexibilidad y estabilidad en la conectividad.
   Subred 10.0.1.0/24






Interfaz de red elástica

# AMAZON VPC
Una tabla de enrutamiento contiene una serie de reglas (llamadas rutas ) que determinan hacia dónde se dirige el tráfico de red de su subred. Cada ruta especifica un destino y un objetivo. El destino es el bloque de CIDR de destino, a donde desea que vaya el tráfico de su subred. El objetivo es el objetivo a través del cual se envía el tráfico de destino. De forma predeterminada, cada tabla de enrutamiento que crea contiene una ruta local para la comunicación dentro de la VPC. Puede personalizar las tablas de enrutamiento al agregar rutas. No puede eliminar la entrada de ruta local, que se utiliza para las comunicaciones internas.



# SERVICIOS DE COMPUTO
Amazon Elastic Compute Cloud (Amazon EC2), proporciona máquinas virtuales redimensionables.
Amazon Elastic Container Registry (Amazon ECR) se utiliza para almacenar y recuperar imágenes de Docker.
Amazon Elastic Container Service (Amazon ECS) es un servicio de coordinación compatible con Docker.
AWS Elastic Beanstalk proporciona una forma sencilla de ejecutar y administrar aplicaciones web.
AWS Lambda es una opción de cómputo sin servidor. Solo paga por el tiempo de cómputo que utilice.
Amazon Elastic Kubernetes Service (Amazon EKS) le permite ejecutar Kubernetes administrado en AWS.
AWS Fargate proporciona una forma de ejecutar contenedores que reducen la necesidad de administrar servidores o clústeres.



# SERVICIOS DE COMPUTO



# Amazon Elastic Compute Cloud (Amazon EC2)
Ejecutar servidores en las instalaciones es una tarea costosa. Se debe adquirir hardware y esta adquisición puede basarse en planes de proyecto en lugar de en la realidad de cómo se utilizan los servidores.
Crear un centro de datos, así como mantenerlo o dotarlo de personal, es una tarea costosa. Las organizaciones también necesitan aprovisionar de forma permanente una cantidad suficiente de hardware para gestionar los picos de tráfico y las cargas de trabajo máximas.
Una vez creadas las implementaciones en las instalaciones tradicionales, es posible que la capacidad del servidor no se utilice y esté inactiva durante una parte significativa del tiempo que los servidores están en ejecución, lo que supone un desperdicio.
Amazon Elastic Compute Cloud (Amazon EC2) proporciona máquinas virtuales en las que puede alojar los mismos tipos de aplicaciones que podría ejecutar en un servidor en las instalaciones locales tradicionales. Proporciona capacidad de cómputo segura y modificable en la nube. Las instancias EC2 pueden admitir diversas cargas de trabajo. Los usos comunes de las instancias de EC2 incluyen los siguientes, entre otros:
Servidores de aplicaciones
Servidores web
Servidores de bases de datos
Servidores de juegos
Servidores de correo
Servidores multimedia
Servidores de catálogos
Servidores de archivos
Servidores de cómputo
Servidores proxy

# Amazon Elastic Compute Cloud (Amazon EC2)
Elastic se refiere al hecho de que puede aumentar o reducir fácilmente el número de servidores que ejecuta para dar soporte a una aplicación de forma automática, y también puede aumentar o disminuir el tamaño de los servidores existentes.
Compute se refiere a la razón por la cual la mayoría de los usuarios ejecutan servidores en primer lugar, que es alojar aplicaciones en ejecución o procesar datos, acciones que requieren recursos de cómputo, incluida la potencia de procesamiento (CPU) y la memoria (RAM).
Cloud se refiere al hecho de que las instancias de EC2 que ejecuta están alojadas en la nube.

Amazon EC2 proporciona máquinas virtuales en la nube y le proporciona un control administrativo total sobre el sistema operativo Microsoft Windows o Linux que se ejecuta en la instancia.
Puede iniciar en cuestión de minutos cualquier cantidad de instancias con cualquier capacidad en cualquier zona de disponibilidad y en cualquier parte del mundo.
Las instancias se lanzan desde las Amazon Machine Images (AMI), que son en efecto plantillas de máquinas virtuales.

# Creación de una instancia
Paso 1: Ingresar a AWS Academy
Dirígete a la página de AWS Academy.
https://www.awsacademy.com
Inicia sesión con tus credenciales proporcionadas por tu instructor o institución. Esto te dará acceso al panel de AWS Academy con las herramientas y recursos necesarios.
Una vez dentro de AWS Academy, busca la opción que te permita acceder al entorno de AWS Management Console. Generalmente, pinchando en LMS.
Si es la primera vez que ingresas, es posible que debas completar algunos pasos de configuración inicial, como elegir una región predeterminada.





# Creación de una instancia
Paso 2: Acceder a la consola de administración  de AWS.
Accedemos a la pestaña Asignaturas y entramos en nuestra asignatura.
Una vez dentro accedemos a contenidos y picamos en el lanzamiento del laboratorio.
Dentro del laboratorio en la parte superior picamos en Start Lab y esperamos que el circulo que esta al lado de AWS pase de color rojo a color verde para pulsar sobre el texto de AWS.







# Creación de una instancia
Paso 2: Lanzar el asistente de creación de instancias.
Picamos en la pestaña servicios, la categoría de informática y dentro de ella elegimos las instancias EC2.
Una vez dentro podemos ver un menu de configuraciones en el lateral izquierdo para configurar instancias, imágenes, EBS, redes …
Nos fijaremos en el botón destacado que es el asistente para crear instancias.





# Creación de una instancia
El asistente de lanzamiento de instancias de Amazon EC2 es una interfaz guiada en la consola de AWS que facilita la creación y configuración de instancias. Este ayuda a los usuarios a lanzar nuevas instancias (servidores virtuales) de manera simplificada, proporcionando una serie de pasos fáciles de seguir.
Nombre y etiquetas
Imágenes de aplicaciones y sistemas operativos (Imagen de máquina de Amazon)
Tipo de instancia
Par de claves (inicio de sesión)
 Configuraciones de red
Configurar almacenamiento
Detalles avanzados



# Imagen de máquina de Amazon


Imágenes de aplicaciones y sistemas operativos (Imagen de máquina de Amazon) Amazon Machine Image (AMI) proporciona la información necesaria para lanzar una instancia de EC2. Debe especificar una AMI de origen al lanzar una instancia.
Una AMI incluye los siguientes componentes:
Una plantilla para el volumen raíz de la instancia. Un volumen raíz suele contener un sistema operativo (SO) y todo lo que se instaló en ese SO (aplicaciones, bibliotecas, etc.).
Permisos de lanzamiento que controlan qué cuentas de AWS pueden utilizar la AMI.
Una asignación de dispositivos de bloques que especifica los volúmenes que deben adjuntarse a la instancia (si hay) cuando se lanza.

# Imagen de máquina de Amazon
Puede elegir muchas AMI:
Quick Start: AMI prediseñadas para iniciar las instancias. Estas AMI incluyen muchas opciones de Linux y Windows.
Mis AMI: estas AMI son las AMI que ha creado.
AWS Marketplace: catálogo digital que enumera miles de soluciones de software. Estas AMI pueden ofrecer casos prácticos específicos para ayudarlo a comenzar rápidamente.
AMI comunitarias: creadas por personas de todo el mundo. AWS no comprueba estas AMI, así que úselas bajo su propio riesgo. Las AMI comunitarias pueden ofrecer muchas soluciones diferentes a diversos problemas, pero úselas con cuidado. Evite usarlas en cualquier entorno corporativo o de producción.



# Tipo de instancia


El tipo de instancia que elija determina lo siguiente:
Memoria (RAM)
Potencia de procesamiento (CPU)
Espacio en disco y tipo de disco (almacenamiento)
Rendimiento de red
Categorías de tipos de instancia:
Instancias de propósito general
Optimizadas para cómputo
Optimizadas para memoria
Optimizadas para almacenamiento
Con cómputo acelerado
Los tipos de instancia ofrecen familia, generación y tamaño

# Tipo de instancia
Nombre del tipo de instancia Ejemplo: c5.large
c es el nombre de la familia
5 es el número de la generación
large es el tamaño





# Par de claves (inicio de sesión)
Amazon EC2 utiliza la criptografía, un par de claves que consisten en una clave pública que AWS almacena y un archivo de clave privada que usted almacena para cifrar y descifrar la información de inicio de sesión.
El conjunto de clave pública y clave privada se denomina par de claves. La clave pública para cifrar un dato y luego el destinatario usa la clave privada para descifrar los datos esto permite acceder de forma segura a sus instancias mediante una clave privada en lugar de una contraseña.





# Configuraciones de red


En el apartado de configuración de red del asistente de Amazon EC2, seleccionas la red virtual (VPC) y la subred en la que tu instancia se ejecutará, determinando si será accesible públicamente o solo dentro de la red privada.
También puedes optar por asignar una IP pública para que la instancia pueda conectarse a internet o permanecer privada. Además, es posible habilitar direcciones IPv6 y gestionar cómo se comporta la instancia al ser detenida o reiniciada, todo esto para ajustar la conectividad y accesibilidad según las necesidades del proyecto



# Configuraciones de red
Un grupo de seguridad funciona como un firewall virtual que controla el tráfico de una o varias instancias. Al lanzar una instancia, puede especificar uno o varios grupos de seguridad. De lo contrario, se utiliza el grupo de seguridad predeterminado.
Las reglas de un grupo de seguridad se pueden modificar en cualquier momento; las nuevas reglas se aplican automáticamente a todas las instancias que estén asociadas al grupo de seguridad. Cuando AWS decide si permite que el tráfico llegue a una instancia, se evalúan todas las reglas de todos los grupos de seguridad asociados a la instancia. Después de lanzar una instancia, puede cambiar sus grupos de seguridad.
Al definir una regla, puede especificar la fuente permitida de la comunicación de red (reglas de entrada) o el destino (reglas de salida). El origen puede ser una dirección IP, un intervalo de direcciones IP, otro grupo de seguridad… De forma predeterminada, un grupo de seguridad incluye una regla de salida que permite todo el tráfico saliente. Puede quitar la regla y agregar reglas salientes que solo permitan tráfico saliente específico.
En la regla de ejemplo, la regla permite el tráfico de Secure Shell (SSH) a través del puerto 22 del Protocolo de control de transmisión (TCP).



# Configurar almacenamiento
Configurar el volumen raíz
 Dónde está instalado el sistema operativo invitado
Adjuntar volúmenes de almacenamiento adicionales (opcional)
Es posible que la AMI ya incluya más de un volumen
Para cada volumen, especifique lo siguiente:
Tamaño del disco (en GB)
El tipo de volumen
Hay disponibles diferentes tipos de unidades de estado sólido (SSD) y unidades de disco duro (HDD)
Si el volumen se eliminará al finalizar la instancia
Si se debe utilizar el cifrado



# Configurar almacenamiento
Amazon EC2 Instance Store proporciona almacenamiento efímero o temporal a nivel de bloques para su instancia. Este almacenamiento está ubicado en los discos que se adjuntan físicamente a la computadora host. Instance Store funciona bien cuando debe almacenar temporalmente información que cambia con frecuencia, como búferes, cachés, datos temporales y otro contenido temporal. También puede utilizar Instance Store para los datos que se replican en una flota de instancias, tales como un grupo de servidores web con balanceo de carga. Si se detienen las instancias, ya sea por un error del usuario o por un mal funcionamiento, se eliminarán los datos del almacén de instancias.
Amazon Elastic Block Store (Amazon EBS) es un servicio de almacenamiento en bloque duradero fácil de usar y de alto rendimiento que se ha diseñado con el objetivo de utilizarse con Amazon EC2 para cargas de trabajo de alto rendimiento y de transacciones intensivas. Con Amazon EBS, puede elegir entre cuatro tipos de volúmenes diferentes para equilibrar el precio y el rendimiento óptimos. Puede cambiar los tipos de volúmenes o aumentar el tamaño del volumen sin interrumpir las aplicaciones críticas, de modo que pueda disponer de un almacenamiento rentable cuando lo necesite.
Amazon Elastic File System (Amazon EFS) proporciona un sistema de archivos de Network File System (NFS) elástico sencillo, escalable y completamente administrado para su uso con servicios en la nube de AWS y recursos en las instalaciones. Está preparado para escalar a petabytes bajo demanda sin interrumpir las aplicaciones. Crece y se reduce automáticamente a medida que agrega y elimina archivos, lo que minimiza la necesidad de aprovisionar y administrar la capacidad para adaptarse al crecimiento.
Amazon Simple Storage Service (Amazon S3) es un servicio de almacenamiento de objetos que ofrece escalabilidad, disponibilidad de datos, seguridad y rendimiento. Puede almacenar y proteger cualquier cantidad de datos para diversos casos de uso, como sitios web, aplicaciones móviles, copia de seguridad y restauración, archivado, aplicaciones para empresas, dispositivos de Internet de las cosas (IoT) y análisis de big data.

# Detalles avanzados
Al crear las instancias de EC2, tiene la opción de pasar datos de usuario a la instancia. Los datos de usuario pueden automatizar la finalización de las instalaciones y configuraciones en el lanzamiento de la instancia. Por ejemplo, un script de datos de usuario podría aplicar parches y actualizar el sistema operativo de la instancia, buscar e instalar claves de licencia de software, o instalar software adicional.
En una instancia de Windows, el script de datos de usuario debe escribirse en un formato compatible con una ventana del símbolo del sistema (comandos por lotes) o con Windows PowerShell.





# Iniciar instancia
Al finalizar el asistente lanzamos la instancia y esperamos unos minutos hasta que finalice su inicialización:







# Iniciar instancia

Detalles: Proporciona información general sobre la instancia, incluyendo su ID, tipo de instancia, AMI utilizada, y configuraciones de red, como las direcciones IP y la subred en la que se encuentra.
Estado y alarmas: estado actual de la instancia y cualquier alerta o alarma configurada a través de Amazon CloudWatch. Incluye información sobre el estado de los sistemas y eventos de la instancia.
Monitoreo: Ofrece métricas de rendimiento de la instancia, como el uso de CPU, el tráfico de red y otras estadísticas clave. Esta pestaña permite observar cómo está funcionando la instancia en tiempo real.
Seguridad: Detalla las configuraciones de seguridad asociadas a la instancia, como los grupos de seguridad que se aplican y las políticas de acceso. Aquí se puede revisar qué puertos están abiertos y qué reglas de firewall están configuradas.
Redes: Proporciona información sobre la configuración de red de la instancia, incluyendo la VPC y subred en las que se encuentra, así como detalles sobre las interfaces de red y direcciones IP asignadas.
Almacenamiento: Muestra los volúmenes de almacenamiento conectados a la instancia, como los volúmenes EBS (Elastic Block Store). Aquí puedes ver detalles sobre el tipo de almacenamiento, el tamaño y el estado de cada volumen.
Etiquetas: Permite ver y gestionar las etiquetas (pares clave-valor) asociadas a la instancia. Las etiquetas son útiles para organizar, identificar y administrar recursos dentro de AWS.



# Conectar con instancia
Conectarse con la instancia de Windows:
Iniciamos la instancia, la seleccionamos y picamos en el botón conectar.
Al ser un Windows, seleccionamos Cliente RDP, el siguiente paso será Obtener contraseña donde se nos pedirá cargar la clave que hemos creado en la creación de la instancia.
Por último, Seleccionamos el archivo de escritorio remoto y seguimos los pasos del asistente



# Conectar con instancia















# Conectar con instancia



### Servicio de directorio en Linux (LDAP / Samba)

# 5.2 SERVICIO DE DIRECTORIO DE LINUX
Dominios
LDAP
Instalar y configurar
Añadir cliente en OpenLDAP
Dominios Samba
Configurar Samba
Comprobar dominio Samba



# DOMINIOS
Un dominio suele asociarse directamente a un controlador de dominio, (Active Directory de Windows) a políticas centralizadas y a una gestión unificada de usuarios y equipos. En Linux, sin embargo, el concepto de dominio existe, pero se articula de una forma más modular, más flexible y, en muchos casos, más transparente.
Un dominio, en términos generales, no es más que un conjunto de sistemas, usuarios y recursos que comparten una infraestructura común de autenticación, autorización y, normalmente, resolución de nombres. En Linux no existe una única “pieza” que lo haga todo, sino que el dominio se construye combinando servicios: DNS, LDAP, Kerberos, servicios de archivos, políticas de acceso y mecanismos de integración entre sistemas.
Resumiendo, en Linux no se “instala un dominio”, sino que se diseña y se construye, obligando  a entender qué hace cada servicio, cómo se comunica con los demás y qué papel juega dentro de la arquitectura global.

# DOMINIOS
En un sistema local, los usuarios están definidos en /etc/passwd, las contraseñas (o hashes) en /etc/shadow, los grupos en /etc/group, y los permisos se gestionan directamente en el sistema de archivos. Este modelo funciona perfectamente para un un número muy reducido de máquinas, pero se vuelve ineficiente y difícil de mantener en cuanto el número de sistemas crece.
Crear usuarios manualmente en cada máquina, mantener contraseñas sincronizadas, asegurar que los permisos son coherentes y revocar accesos cuando un usuario deja la organización se convierte rápidamente en una tarea poco realista. Aquí es donde aparece la necesidad de un dominio. Este permite centralizar la información de usuarios y grupos, de modo que las máquinas cliente no almacenan esa información localmente, sino que la consultan a un servicio central. Esto implica que un usuario puede iniciar sesión en diferentes equipos con las mismas credenciales, que los cambios se aplican de forma inmediata y que la administración se simplifica enormemente.

# DOMINIOS
El DNS es la base sobre la que se apoyan prácticamente todos los servicios de red. Cuando hablamos de un dominio como sistemas.local, estamos definiendo un ámbito dentro del cual los nombres de máquinas, servicios y recursos tienen significado. En un entorno de dominio Linux, el DNS no solo sirve para traducir nombres a direcciones IP, sino también para localizar servicios, especialmente cuando se utilizan tecnologías como LDAP o Kerberos.
Un dominio necesita un DNS coherente y bien configurado. Cuando un cliente Linux quiere autenticarse contra un servidor LDAP, necesita saber dónde está ese servidor. Puede configurarse manualmente, pero lo habitual y lo profesional es que lo descubra mediante DNS. Los servicios no viven aislados, sino que se apoyan unos en otros.
Crear un dominio Linux implica:
Definir un nombre de dominio coherente, tanto a nivel DNS como a nivel organizativo. Este nombre será el identificador lógico del dominio y aparecerá en múltiples configuraciones.
Configurar un servidor DNS que gestione ese dominio y resuelva correctamente los nombres de los sistemas implicados.
Instalar y configurar un servicio de directorio, normalmente LDAP, que almacenará la información de usuarios, grupos y, en algunos casos, equipos.
Configurar los sistemas cliente para que utilicen ese servicio de directorio en lugar de (o además de) los ficheros locales para la autenticación.

# LDAP
LDAP (Lightweight Directory Access Protocol), protocolo de acceso a servicios de directorio. Un servicio de directorio es una estructura jerárquica diseñada para almacenar información que se consulta mucho y se modifica poco, como usuarios, grupos, equipos, políticas o servicios.
LDAP actúa como el corazón del sistema de autenticación centralizada. En lugar de que cada máquina tenga su propia lista de usuarios, todas consultan al servidor LDAP cuando necesitan autenticar a alguien y este puede almacenar cualquier tipo de información estructurada: direcciones de correo, certificados, claves públicas, información organizativa, etc. Sin embargo, en el ámbito de sistemas, su uso principal es la gestión centralizada de identidades.



# LDAP Arquitectura
Con arquitectura LDAP, nos referimos a cómo se organizan los distintos componentes, la arquitectura en Linux es modular, lo que significa que cada servicio cumple una función concreta y puede ser sustituido, escalado o reforzado de forma independiente. Esta modularidad es una de las grandes fortalezas del ecosistema Linux en entornos profesionales.
El núcleo lo constituye el servidor de directorio LDAP, que actúa como repositorio central de identidades. Este servidor no autentica por sí mismo en el sentido tradicional, sino que almacena la información necesaria para que otros sistemas puedan hacerlo: usuarios, grupos, identificadores numéricos, shells, rutas de directorios personales y atributos organizativos.
El DNS juega un papel estructural, ya que permite localizar los servicios del dominio de forma dinámica y coherente. En arquitecturas bien diseñadas, los clientes no se configuran con direcciones IP “a mano”, sino que descubren los servicios mediante nombres de dominio.

# LDAP Arquitectura
En los sistemas cliente, la arquitectura se completa con componentes de capas de autentificación y de integración entre el sistema operativo y el dominio como NSS y PAM.
La idea consiste en disponer de un servidor que facilite la autenticación de los clientes, de modo que éstos recurran al servidor cada vez que un usuario necesite identificarse. De esta forma, la cuenta de usuario no es específica de un equipo cliente, sino que será válida en cualquier equipo de la red que haya sido debidamente configurado.



# LDAP Arquitectura
NSS (Name Service Switch) mecanismo que utiliza Linux para localizar información de usuarios y grupos. Permite al sistema saber si un usuario existe y obtener sus datos (UID, GID, directorio personal, etc.), consultando distintas fuentes como archivos locales o un servidor LDAP. En un entorno con LDAP, NSS se encarga de “preguntar” al directorio por los usuarios en lugar de buscarlos solo en el sistema local.

PAM (Pluggable Authentication Modules) es el responsable de la autenticación. Su función es comprobar si el usuario puede iniciar sesión, validando la contraseña y aplicando las políticas de seguridad configuradas. Cuando se usa LDAP, PAM consulta al directorio para verificar las credenciales y decidir si se permite o no el acceso al sistema.
Es el método que utilizan la mayoría de las aplicaciones y herramientas de Linux que necesitan relacionarse, de algún modo, con la autenticación de los usuarios.





# LDAP Arquitectura
Una de las ventajas que aporta LDAP cuando lo combinamos con NFS es que podemos guardar el perfil de una cuenta de usuario en el servidor NFS. De este modo, cuando un usuario se autentica en cualquier equipo de la red usando su cuenta LDAP, podrá acceder de forma automática a una carpeta compartida donde se guardan los perfiles de las cuentas. (Perfiles móviles de usuario)
A continuación, se muestran los pasos a seguir
Crear una carpeta en el servidor para guardar la carpeta /home de los usuarios móviles (el equivalente a /home/usuario de cada usuario, pero en el servidor).
Modificar el archivo /etc/exports para compartir el directorio anterior con permisos de lectura/escritura para todos los usuarios.
Modificar las cuentas de usuario LDAP para indicar que la carpeta donde deben tener su perfil se encuentra dentro de la carpeta que crearemos en el siguiente paso.
Crear una carpeta en los equipos cliente para montar los perfiles móviles (el equivalente a /home/usuario de cada usuario en cada cliente).
Modificar el archivo /etc/fstab de cada cliente para que monte la carpeta que hemos creado en el paso 1 en el punto de montaje establecido en el paso 4 y reiniciar el equipo.



# LDAP
CARACTERÍSTICAS
Centralización. Todos los usuarios y grupos se gestionan desde un único punto, lo que reduce errores, simplifica tareas y mejora la trazabilidad. Cualquier cambio en el directorio se refleja inmediatamente en todos los sistemas integrados, sin necesidad de intervención manual en cada equipo.
Escalabilidad es posible añadir réplicas del servidor LDAP, balancear carga, segmentar el directorio por unidades organizativas y adaptar el sistema a nuevas necesidades sin interrumpir el servicio.
Interoperabilidad estándar ampliamente soportado, lo que permite que sistemas muy distintos puedan integrarse en el mismo dominio.
Seguridad, permite aplicar controles de acceso precisos y coherentes. La autenticación centralizada facilita la revocación inmediata de permisos, algo crítico cuando un usuario deja de pertenecer a la organización.
Coherencia de identidad. Cada usuario tiene un único identificador dentro del dominio, lo que evita problemas habituales como duplicidades de UID o inconsistencias en permisos.
USOS
Gestión centralizada de usuarios en entornos Linux. En aulas, centros educativos o empresas con múltiples equipos, un dominio LDAP permite que el alumnado o el personal utilice las mismas credenciales en cualquier máquina, manteniendo su entorno de trabajo y sus permisos.
Integración de servicios. Servidores web, servicios de bases de datos, plataformas de aprendizaje, sistemas de control de versiones o aplicaciones corporativas pueden delegar la autenticación en LDAP.
En entornos educativos, para unificar el acceso a recursos, como servidores de archivos, escritorios remotos o plataformas virtuales.
En el ámbito empresarial, como base para infraestructuras híbridas, donde conviven distintos sistemas y tecnologías. LDAP actúa como nexo común, permitiendo que la identidad del usuario sea reconocida y validada en todos los servicios de la organización.

# LDAP
Versiones de LDAP :
LDAPv1: Fue la primera versión del protocolo, pero resultó ser poco práctica debido a limitaciones y falta de características clave. No se utilizó ampliamente en la implementación.
LDAPv2: Esta versión mejoró algunas deficiencias de la versión anterior, pero aún tenía limitaciones significativas en términos de seguridad y capacidades.
LDAPv3: Esta es la versión más ampliamente adoptada y utilizada de LDAP. Introdujo numerosas mejoras y características nuevas, incluyendo:
Mecanismos de autenticación y seguridad mejorados, como TLS/SSL para cifrado de datos.
Soporte para búsquedas más flexibles y eficientes.
Capacidad para manejar datos binarios y Unicode.
Soporte para extensiones, lo que permitió a los desarrolladores agregar funcionalidad adicional al protocolo.
Esquema mejorado para describir los tipos de datos y atributos.

# LDAP estructura
LDAP utiliza una estructura jerárquica en forma de árbol, conocida como DIT (Directory Information Tree).
En la parte superior del árbol se encuentra la raíz del directorio, que suele corresponder al dominio. Por ejemplo, para el dominio asir.local, la base del directorio podría ser dc=asir, dc=local. A partir de ahí, se crean ramas que organizan la información de forma lógica.
Normalmente, se crean ramas para usuarios, grupos, equipos y otros objetos. Cada entrada del directorio tiene un nombre distinguido o DN, que indica su posición exacta dentro del árbol. Este DN es fundamental para localizar y gestionar los objetos.

Este modelo jerárquico encaja muy bien con la idea de dominio, ya que refleja la estructura organizativa de una empresa o centro educativo. Además, permite aplicar políticas y permisos de forma granular.



# LDAP Identificadores
DC (Domain Component) representa una parte del nombre de dominio. Cada DC corresponde a un nivel del dominio DNS. Por ejemplo, en dc=asir,dc=local, asir y local son componentes del dominio. Los DC suelen utilizarse para definir la base del directorio y su correspondencia con el dominio de red.
DN (Distinguished Name) es el identificador único y completo de un objeto dentro del directorio LDAP. Podría compararse con una ruta absoluta en un sistema de archivos. El DN indica exactamente dónde se encuentra un objeto dentro del DIT. Por ejemplo, un usuario podría tener un DN como cn=juan,ou=usuarios,dc=asir,dc=local. Este DN no solo identifica al usuario, sino también su posición jerárquica dentro del directorio.
CN (Common Name) es el nombre común del objeto dentro de su contexto. En el caso de usuarios, suele ser el nombre del usuario; en el caso de grupos, el nombre del grupo; y en otros objetos, un identificador descriptivo. El CN no tiene por qué ser único en todo el directorio, pero sí debe ser único dentro de su rama inmediata.
Atributos son las propiedades que describen a un objeto dentro del directorio LDAP. Un objeto, por sí solo, no es más que una entrada dentro del DIT; son los atributos los que le dan significado. Por ejemplo, un usuario tendrá atributos como nombre, identificador numérico, grupo principal, shell por defecto o directorio personal.
Están definidos por los esquemas LDAP, que establecen qué atributos son obligatorios y cuáles son opcionales para cada tipo de objeto. Por ejemplo, un usuario de tipo posixAccount debe tener un UID y un GID, mientras que otros atributos pueden ser opcionales.
Están asociados directamente al objeto dentro del DIT. No existen de forma independiente.

# LDAP
LDIF (LDAP Data Interchange Format) es un formato de archivo de texto utilizado para representar y transferir datos en sistemas que utilizan el protocolo LDAP.
Estos archivos contienen instrucciones para crear, modificar o eliminar entradas en un directorio. Cada instrucción está escrita en forma de texto plano y sigue una estructura predefinida. Un archivo LDIF puede contener varias instrucciones que describen acciones como agregar nuevos objetos, modificar atributos existentes o eliminar entradas.
Su importancia radica en que permite trabajar con LDAP de forma reproducible y automatizable, algo esencial en entornos profesionales. Gracias a LDIF, es posible versionar cambios, reutilizar configuraciones y aplicar modificaciones de forma controlada.





# LDAP
LDAP es un protocolo, es decir, un conjunto de normas que define cómo se accede a un servicio de directorio, no es un software que se instale. OpenLDAP, en cambio, es una implementación concreta de ese protocolo.
Nadie “instala HTTP”; se instalan servidores web como Apache o Nginx que usan el protocolo HTTP. Con LDAP ocurre exactamente lo mismo. Por tanto, no existe eso de “tener LDAP instalado”. Lo que existe es tener un software que implemente el protocolo LDAP. Cuando alguien dice “tengo LDAP instalado”, en realidad lo que tiene instalado es:
Un servidor LDAP,normalmente OpenLDAP(implementación concreta de ese protocolo)
Y/o clientes LDAP (herramientas que hablan el protocolo LDAP)



# OPENLDAP
OpenLDAP es un software de código abierto y multiplataforma que implementa el protocolo LDAP, diseñado para crear y gestionar servicios de directorio. Técnicamente, incluye varios componentes, entre los que destacan:
slapd (Stand-alone LDAP Daemon): el demonio o servidor LDAP que escucha peticiones de clientes LDAP y responde según el protocolo.
Bibliotecas LDAP: implementaciones de las rutinas necesarias para que aplicaciones y herramientas puedan comunicarse con el servidor.
Herramientas cliente: utilidades como ldapsearch, ldapadd, ldapmodify, etc., que permiten consultar y modificar el directorio LDAP desde la línea de comandos mediante archivos ldif.
https://www.openldap.org/



# LDAP
| Comando | Descripción |
| --- | --- |
| ldapadd | Agrega un objeto al directorio LDAP. |
| ldapmodify | Modifica un objeto en el directorio LDAP. El protocolo permite tres modificaciones diferentes, añadir nuevo valor, reemplazar valor o eliminar valor. |
| ldapdelete | Elimina un objeto del directorio LDAP. |
| ldapsearch | Busca objetos en el directorio LDAP. |
| ldapcompare | Compara los atributos de dos objetos en el directorio LDAP. |
| ldapbind | Se conecta a un servidor LDAP. |
| ldapunbind | Se desconecta de un servidor LDAP. |
| ldappasswd | Cambia la contraseña de un usuario. |
| ldapurl | Convierte una URL LDAP en un nombre de objeto LDAP. |
| ldapschema | Obtiene el esquema de un servidor LDAP. |

# INSTALAR Y CONFIGURAR
Instalaremos los siguientes paquetes:
slapd: Representa el servidor LDAP en el proyecto OpenLDAP.
ldap-utils: Contiene herramientas de línea de comandos que te permiten interactuar con servidores LDAP, realizar búsquedas, administrar entradas, entre otras operaciones.
dpkg-reconfigure slapd: Cuando ejecutas este comando en la terminal, se abrirá un asistente interactivo que te guiará a través de la configuración del servidor LDAP. Este te hará una serie de preguntas relacionadas con la configuración del servidor, como el nombre del dominio, la contraseña de administrador, el tipo de backend de base de datos (por ejemplo, HDB o BDB), entre otros aspectos.





# INSTALAR Y CONFIGURAR
El archivo de configuración /etc/ldap/ldap.conf permite definir parámetros globales para las interacciones LDAP en el sistema.
BASE: La base de búsqueda predeterminada para las consultas LDAP. (dc)
URI: La URL del servidor LDAP al que se conectará el sistema.



# INSTALAR Y CONFIGURAR
El comando slapcat es una herramienta de línea de comandos utilizada en sistemas con OpenLDAP para exportar contenido de la base de datos del servidor LDAP en formato LDIF. Opciones:
-l archivo: Redirige la salida a un archivo en lugar de mostrarla en la consola.
-f archivo: Utiliza un archivo de configuración alternativo.





# INSTALAR Y CONFIGURAR
El siguiente paso consistirá en comenzar a incluir contenido. Como cabe esperar, lo primero que debemos hacer es configurar la estructura básica del directorio. Es decir, debemos crear la estructura jerárquica del árbol (DIT – Directory Information Tree). Para este caso es yeraym.asir

A continuación, se muestra un archivo LDIF que define la estructura de dos unidades organizativas (OU). Este archivo se utilizará con el comando ldapadd para añadir dichas unidades organizativas a la estructura del dominio dentro del directorio LDAP.





# INSTALAR Y CONFIGURAR
A continuación, añadir la información a la base de datos OpenLDAP. Esto se hace con el comando ldapadd:
-x autenticación simple sin SASL (Simple Authentication and Security Layer).
-D nombre distinguido con el que nos conectamos a LDAP (ponemos el del administrador).
-W pide la contraseña de forma interactiva.
-f fichero a cargar. En este caso: estructura base.ldif



# INSTALAR Y CONFIGURAR
A continuación, añadimos algunos usuarios más:





# INSTALAR Y CONFIGURAR
Comprobaciones:





# INSTALAR Y CONFIGURAR
ldapmodify: permite añadir entradas o realizar modificaciones. Posibilita modificar entradas de un directorio LDAP aceptando la introducción de datos a través de un fichero o de la línea de comandos si no se especifica.





# INSTALAR Y CONFIGURAR
ldapsearch: realiza consultas. Por ejemplo, a continuación, se muestran los nombres comunes y los correos de todos los usuarios del dominio:
-L → salida en formato LDIF / -LL → elimina comentarios / -LLL → elimina también las líneas en blanco
-b → define desde dónde buscar (Base DN)



# INSTALAR Y CONFIGURAR
ldapdelete: permite borrar entradas del directorio mediante un fichero o desde línea de comando.



# INSTALAR Y CONFIGURAR
Para gestionar LDAP mediante una interfaz gráfica, puedes considerar varias opciones de software que facilitan la administración de manera visual:
Apache Directory Studio: Herramienta de administración LDAP ampliamente utilizada que proporciona una interfaz gráfica intuitiva para administrar directorios LDAP.
PHPLDAPAdmin: Herramienta basada en web que te permite administrar directorios LDAP a través de una interfaz web.
JXplorer: Herramienta Java gratuita y de código abierto que proporciona una interfaz gráfica para la administración de directorios LDAP.
LDAP Account Manager (LAM): Herramienta que ofrece una interfaz web para administrar cuentas y grupos en un directorio LDAP.





# INSTALAR Y CONFIGURAR
Antes de establecer conexión con el dominio se debe configurar el phpldapadmin. El archivo /etc/phpldapadmin/config.php es el archivo de configuración de phpldapadmin. El método setValue te permite configurar diversas opciones que afectan la forma en que se interactúa con tu servidor LDAP. Algunas opciones que puedes configurar utilizando setValue:
server
'name': Nombre del servidor.
'host': Dirección IP o nombre del servidor LDAP.
'port': Puerto del servidor LDAP.
'base': Base DN para búsquedas y operaciones.
'tls': Habilitar o deshabilitar TLS/SSL.



# INSTALAR Y CONFIGURAR





# AÑADIR CLIENTE EN OPENLDAP
En Ubuntu, necesitaremos ajustar el comportamiento de los servicios NSS y PAM en cada cliente que debamos configurar. Comenzamos por instalar los siguientes paquetes:
libnss-ldap: Permitirá que NSS obtenga de LDAP información administrativa de los usuarios (Información de las cuentas, de los grupos, información de la máquina, los alias, etc.)
libpam-ldap: Que facilitará la autenticación con LDAP a los usuarios que utilicen PAM.
ldap-utils: Facilita la interacción de LDAP desde cualquier máquina de la red.



# AÑADIR CLIENTE EN OPENLDAP
En el primar paso, nos solicita la dirección URi del servidor LDAP. En nuestro caso, escribiremos la dirección IP del servidor y sustituiremos el protocolo ldapi://	por	 ldap://
En el siguiente paso, debemos indicar el nombre global único (Distinguished Name – DN).
Inicialmente aparece en valor dc=example,dc=net pero nosotros lo sustituiremos por dc=nombre,dc=sistemas.





# AÑADIR CLIENTE EN OPENLDAP
El asistente nos pide el número de versión del protocolo LDAP que estamos utilizando. De forma predeterminada aparece seleccionada la versión 3.

Indicaremos si las utilidades que utilicen PAM deberán comportarse del mismo modo que cuando cambiamos contraseñas locales. Esto hará que las contraseñas se guarden en un archivo independiente que sólo podrá ser leído por el superusuario.





# AÑADIR CLIENTE EN OPENLDAP
Después, el sistema nos pregunta si queremos que sea necesario identificarse para realizar consultas en la base de datos de LDAP.

Nombre de la cuenta LDAP que tendrá privilegios para realizar cambios en las contraseñas.





# AÑADIR CLIENTE EN OPENLDAP
La contraseña que usará la cuenta (como siempre, habrá que escribirla por duplicado para evitar errores tipográficos). Deberá coincidir con la que escribimos en el apartado Instalar OpenLDAP en el servidor.
Para completar la tarea, deberemos cambiar algunos parámetros en los archivos de configuración del cliente. En concreto, deberemos editar:
/etc/nsswitch.conf
/etc/pam.d/common-password
/etc/pam.d/common-session.



# AÑADIR CLIENTE EN OPENLDAP
/etc/nsswitch.conf
Se incluyen las fuentes desde las que se obtiene la información del servicio de nombres en diferentes categorías y en qué orden. Cada categoría de información se identifica bajo un nombre.
Localizamos las líneas que comienzan por passwd, group y shadow y les añadimos el texto ldap, para indicar el nuevo origen para autenticar las cuentas.



# AÑADIR CLIENTE EN OPENLDAP
/etc/pam.d/common-password
Proporciona un conjunto común de reglas PAM para la comprobación de contraseñas. En particular, la opción use_authtok, que impide utilizar un segundo método de autenticación cuando ya ha sido aplicado otro anterior, aunque éste haya sido insatisfactorio.
Deberemos eliminar la opción use_authtok



# AÑADIR CLIENTE EN OPENLDAP
/etc/pam.d/common-sesión
Ofrece un conjunto de reglas PAM para el inicio de sesión, tanto si éste es interactivo como si es no interactivo. Aquí será donde indiquemos que se debe crear un directorio home durante el primer inicio de sesión, también para los usuarios autenticados mediante LDAP.
Este comportamiento lo conseguiremos añadiendo al final del archivo la siguiente línea:
session optional       pam_mkhomedir.so skel=/etc/skel umask=077



# AÑADIR CLIENTE EN OPENLDAP
Una vez terminada la instalación, ya podemos activar el servicio libnss-ldap.

La forma más sencilla de comprobar que podemos iniciar sesión en el servidor usando LDAP consiste en arrancar el sistema en modo texto (o arrancarlo en modo gráfico y usar la combinación de teclas alt + ctrl + f1 para ir a una consola de texto) y escribir las credenciales de un usuario LDAP.





# AÑADIR CLIENTE EN OPENLDAP
La mayoría de las veces necesitarás que los clientes puedan iniciar sesión en la interfaz gráfica. El problema es que el gestor de sesiones que utiliza Ubuntu es LightDM. Este es quien se encarga de presentarnos la pantalla de autenticación y, en el caso de LightDM, sólo incluye en la lista aquellos usuarios que ya conoce.
Si necesitas que muchos usuarios puedan iniciar sesión en un determinado cliente, quizás la solución más sencilla consista en obligar a LightDM a preguntar por el nombre de la cuenta, antes de pedir la contraseña. Para hacer esto, debemos editar el archivo /usr/share/lightdm/lightdm.conf.d/50-ubuntu.conf



### Notes:
En Ubuntu 24.04 ya no se utiliza LightDM por defecto, sino GDM3, que además inicia sesión gráfica con Wayland, un sistema más restrictivo que suele causar problemas con usuarios autenticados por LDAP/OpenLDAP. Por eso, aunque el inicio de sesión funcione en modo consola, puede fallar en entorno gráfico. La solución recomendada es desactivar Wayland editando el archivo /etc/gdm3/custom.conf y activando la opción WaylandEnable=false, o bien volver a usar LightDM como gestor de inicio de sesión si se desea el comportamiento clásico.

# DOMINIOS SAMBA
Un dominio Samba permite a un servidor Linux actuar como elemento central de autenticación y gestión de recursos en una red, ofreciendo compatibilidad con entornos Windows. Samba implementa los protocolos necesarios para que equipos Windows y Linux puedan compartir usuarios, grupos, archivos y otros servicios de forma integrada. En este contexto, Samba no se limita a la compartición de recursos, sino que puede asumir el rol de controlador de dominio, gestionando identidades y accesos de manera centralizada.
A partir de Samba 4, el servicio incorpora una implementación completa de Active Directory, integrando servicios como LDAP, Kerberos y DNS dentro de una misma infraestructura. Esto permite definir un dominio en el que los usuarios y equipos se autentican contra un único punto, utilizando credenciales comunes independientemente del sistema operativo.
El uso de dominios Samba es habitual en entornos corporativos donde se requiere compatibilidad con clientes Windows sin depender exclusivamente de servidores Windows. Samba permite desplegar dominios funcionales sobre Linux, manteniendo control centralizado sobre usuarios y recursos, y ofreciendo una solución flexible, escalable y alineada con estándares ampliamente utilizados en redes empresariales.

# DOMINIOS SAMBA
Procedimiento para implementar un Controlador de dominio en Ubuntu, donde los equipos clientes con Windows puedan iniciar sesión y utilizar sus recursos sin notar la diferencia con un servidor Windows Server. Antes de comenzar tendremos en cuenta las siguientes configuraciones bases y prepararemos el servidor para seguir con la instalación de paquetes
Nombre del controlador de dominio de Active Directory: nombre-dc-smb
Nombre DNS del dominio de Active Directory: nombre.sistemas
Nombre del Reino Kerberos: nombre.sistemas
Nombre NetBIOS del dominio: nombre
Dirección IP fija del servidor: 172.16.31.200
Rol del servidor: Domain Controller (DC)
Reenviador DNS:172.16.31.1



# DOMINIOS SAMBA
Actualizar el sistema

Establecer un nombre adecuado para el servidor: nombre-dc-smb





# DOMINIOS SAMBA
Lo siguiente será configurar las características de red según las necesidades del servidor. Recuerda que un servidor debe tener IP fija.

Necesitaremos disponer de los siguientes paquetes preinstalados antes de comenzar con el proceso de configuración, aunque todos ellos están el los repositorios:
samba: servidor de archivos, impresión y autenticación para SMB/CIFS.
smbclient: clientes de línea de comandos para SMB/CIFS.
krb5-config: Archivos de configuración para Kerberos Version 5.
winbind: Servicio para resolver información sobre usuarios y grupos de servidores Windows NT.





# DOMINIOS SAMBA
En la instalación de Kerberos, nos preguntará por el reino (realm), se refiere al nombre del dominio:
Después nos solicita el nombre de los servidores de Kerberos para nuestro reino. En este caso, se refiere a los controladores de dominio que tengamos definidos. En nuestro ejemplo sólo tenemos uno:
Por último, nos solicita el servidor administrativo para nuestro reino de Kerberos, como sólo tenemos uno:







# CONFIGURAR SAMBA
Debemos cambiar de nombre el archivo smb.conf que contiene la configuración predeterminada, para evitar que Samba intente usarlo durante el proceso de configuración y estar seguros de que todos los datos del nuevo archivo de configuración se producen desde cero. Además, también podremos recuperarlo en caso de que algo salga mal.

Ahora ya estamos listos para promover nuestro equipo como controlador de un dominio Samba 4 que actúe como un reemplazo completo de un servidor de dominio de Active Directory.



# CONFIGURAR SAMBA
Para promover nuestro equipo como controlador de un dominio lograrlo, usaremos el comando samba-tool domain provision, y lo haremos de forma interactiva, para que sea el propio comando el que nos sugiera sus valores predeterminados. Así, si éstos coinciden con los que nosotros esperamos, será muy probable que los pasos anteriores hayan sido los correctos.





# CONFIGURAR SAMBA
Con el anterior comando se genero el archivo de configuración de Kerberos en la ruta /var/lib/samba/private/krb5.conf. Solo tenemos que copiarlo a la ubicación adecuada.

Seguimos ajustando la resolución de nombres, y comenzaremos deteniendo los servicios implicados y deshabilitándolos para que no vuelvan a iniciarse si reiniciamos el equipo.





# CONFIGURAR SAMBA
Aseguramos de que el servicio samba-ad-dc se podrá iniciar sin dificultades, evitando cualquier enmascaramiento que pueda existir y eliminamos el archivo resolv.conf que, en realidad, será un enlace a ../run/systemd/resolve/stub-resolv.conf y generamos uno nuevo con escribiremos los valores adecuados para nuestro dominio y por último activamos el servicio:







# COMPROBAR DOMINIO SAMBA
Una vez finalizada la instalación vamos a proceder a la comprobación del dominio de Samba realizando las siguientes tareas:
Consultar el nivel del dominio y crear un nuevo usuario.
Confirmar que el servidor DNS funciona de forma adecuada
Comprobar el funcionamiento de Kerberos
Comprobación de inicio de sesión en el servidor y su integridad
Añadir un equipo con Windows al dominio y comprobar en servidor.

# COMPROBAR DOMINIO SAMBA
El comando samba-tool domain level show te permite verificar el nivel funcional del dominio en tu controlador de dominio Samba. En este caso equivale a una instalación Windows Server 2008 R2.
A continuación, crearemos un nuevo usuario en el dominio llamado nombre01.



# COMPROBAR DOMINIO SAMBA
Comprobaciones del servidor DNS interno del propio Samba, mas concretamente de los registros SRV encargados de almacenar, dentro de la base de datos DNS, la relación entre el nombre de un servicio y el nombre DNS del ordenador que ofrece dicho servicio.
Comprobar el servicio LDAP sobre el protocolo TCP.
Comprobar el registro SRV para el protocolo Kerberos sobre UDP.
Comprobar la resolución del nombre de nuestro servidor.



# COMPROBAR DOMINIO SAMBA
Ahora nos aseguramos de que se resuelven correctamente los nombres y las IPs del dominio. Al ejecutar nslookup sin argumentos, aparece un signo ‘mayor que‘ a modo de prompt, donde podemos ir escribiendo argumentos.



# COMPROBAR DOMINIO SAMBA
Para comprobar el funcionamiento de Kerberos podemos usar el comando smbclient para comprobar los servicios que puede obtener un determinado usuario.





# COMPROBAR DOMINIO SAMBA
El fallo se soluciona activando el NT1 en la configuración de samba





# COMPROBAR DOMINIO SAMBA
Comprobar el inicio de sesión en el servidor verificando la integridad del archivo de configuración de Samba con el comando testparm



# COMPROBAR DOMINIO SAMBA







# COMPROBAR DOMINIO SAMBA









## Actividades y prácticas

### Práctica

**Implementación de un Dominio Windows en AWS**

1.  **Creación de las instancias EC2 y configuración inicial.** Iniciar
    sesión en AWS y desplegar tres instancias EC2 de tipo **t2.micro**,
    configurando adecuadamente la red y generando un **grupo de
    seguridad que permita acceso mediante RDP (puerto 3389)** para las
    máquinas Windows y SSH para la máquina Ubuntu. Las instancias
    Windows deberán utilizar una **AMI compatible con Windows Server**,
    y la instancia Linux una **AMI de Ubuntu 24.04**.
    
    1.  **Instancia 1:** *WS22nombreseraws* – Windows Server 2022. Será
        el servidor principal.
    
    2.  **Instancia 2:** *WS22nombrecliaws* – Windows Server 2022 para
        unir al dominio.
    
    3.  **Instancia 3:** *UD24nombre* – Ubuntu Desktop/Server 24.04 para
        integrar en el dominio.
        
        Cada máquina debe crearse en la misma VPC, con subred adecuada y
        con conectividad mediante Internet Gateway para permitir la
        administración remota.

2.  **Configuración del servidor Windows: dominio y DNS.** En la
    instancia *WS22nombreseraws*, se instalará el servicio de **Active
    Directory Domain Services** y se promoverá a controlador de dominio.
    El dominio raíz tendrá el formato:  
    **nombre.aws.** Tras la instalación, se comprobará mediante símbolo
    de sistema que el sistema pertenece al dominio. Además, deberá
    configurarse una **zona de búsqueda inversa** en el servidor DNS y
    verificarse su funcionamiento mostrando en una misma captura una
    resolución directa y otra inversa mediante nslookup. (**Dos
    capturas**)

3.  **Unión de la segunda instancia Windows al dominio.** La instancia
    WS22nombrecliaws también debe crearse con una AMI compatible con
    Windows Server. Tras configurarla y conectarse por RDP, deberá
    unirse al dominio creado previamente. Es necesario ajustar el
    conjunto de opciones de DHCP para que los equipos del dominio
    utilicen el DNS del controlador de dominio. La unión debe
    documentarse con capturas y explicación del procedimiento.

4.  **Configuración de la instancia Ubuntu y acceso al dominio.** En la
    instancia UD24nombre, creada con Ubuntu 24.04, el alumno deberá
    conectarse mediante **Termius** y proceder a agregarla al dominio
    Windows utilizando las herramientas adecuadas (realmd, sssd, etc.).
    Todos los pasos deberán documentarse con capturas claras y breves
    explicaciones.

5.  **Automatización, políticas del dominio y recursos compartidos.**
    Será necesario crear un **script PowerShell** que incluya un menú
    con las siguientes opciones, permitiendo salir con la opción 0:
    
    1.  Mostrar la información del dominio (nombre del equipo, nombre
        del dominio y número de OUs, grupos y usuarios).
    
    2.  Crear una nueva Unidad Organizativa.
    
    3.  Ver los miembros de una Unidad Organizativa.
    
    4.  Crear un nuevo grupo.
    
    5.  Crear una nueva cuenta de usuario solicitando sus
        características, asignándolo a un grupo indicado por el usuario
        y obligando a cambiar la contraseña en el primer inicio de
        sesión.
        
        *Capturas del código, y de un ejemplo de su utilización*

**Implementación de un Dominio LDAP**

6.  **Creación de la estructura LDAP mediante LDIF.** Crear mediante
    archivos **LDIF** la estructura base del dominio
    **nombre2025.ldap**. Esto incluye generar un árbol con dos unidades
    organizativas principales (**Alumnado** y **Profesorado**) y mostrar
    los archivos LDIF utilizando el editor de texto ***vim***. Además,
    se deberán añadir cuatro usuarios genéricos (nombrealu1, nombrealu2,
    nombrepro1, nombrepro2), cada uno perteneciente a un grupo
    específico (asir1, asir2, informática1, informática2). Estos grupos
    deberán crearse mediante LDIF, asociando los grupos *asir1* y
    *asir2* a la OU de Alumnado, y los grupos *informática1* e
    *informática2* a la OU de Profesorado. Se mostrará el proceso
    completo, con comandos y capturas del editor.

7.  **Automatización en LDAP mediante un script shell.** En este
    apartado se desarrollará un script llamado **nombreldap.sh** que
    incluya un menú interactivo con tres opciones:


1.  Eliminar correo de un usuario del dominio.

2.  Modificar el correo de un usuario, solicitando los datos e
    incluyendo el valor “prueba@nombre2024.ldap” en una de las pruebas.

3.  Realizar búsquedas, permitiendo consultar un usuario concreto o
    mostrar un listado de todos los usuarios mostrando únicamente nombre
    y correo.

> Una vez implementado, deberán realizarse pruebas obligatorias: listar
> todos los usuarios del dominio, eliminar el correo de *nombrealu1*,
> modificar el de *nombrealu2*, y volver a listar para comprobar los
> cambios.

8.  Administración **del dominio LDAP mediante interfaces web.** El
    alumnado deberá instalar y configurar dos herramientas web de
    administración LDAP:
    
    1.  **phpLDAPadmin**, desde la cual deberá crearse el usuario
        *nombrephp* que pertenezca al grupo *asir1*, y mostrar el árbol
        de dominio.
    
    2.  **LDAP Account Manager (LAM)**, desde la cual deberá crearse el
        usuario *nombrelam* que pertenezca al grupo informática1, y
        mostrar el árbol de dominio.

9.  **Integración de Ubuntu Cliente con LDAP para acceso en modo texto y
    gráfico.** Se tendrán que realizar todas las configuraciones
    necesarias en una máquina Ubuntu Cliente para permitir que los
    usuarios del dominio LDAP puedan iniciar sesión tanto en modo texto
    como en modo gráfico.
    
    1.  Primero, deberá iniciarse sesión en modo consola, explicando qué
        terminal se ha utilizado y el motivo.
    
    2.  Posteriormente, se verificará el inicio de sesión en modo
        gráfico creando un archivo dentro del directorio personal del
        usuario del dominio, comprobando así que el home se crea
        correctamente y que la autenticación LDAP funciona en ambos
        entornos.

**Implementación de un Dominio Samba en Ubuntu**

10. **Implementación de un Controlador de Dominio con Samba y unión de
    un Windows.** Configurar un servidor Ubuntu como **Controlador de
    Dominio Samba** utilizando los siguientes datos personalizados:


  - Nombre del controlador: *nombre-dc-smb*

  - Dominio DNS : *nombre25.sistemas*

  - Reino Kerberos: *nombre25.sistemas*

  - Nombre NetBIOS: *nombre*

  - IP estática: *172.16.2xx.200*

  - Reenviador DNS: *172.16.2xx.1*

  - Rol: *DomainController*

Una vez instalado Samba y configurado el dominio, deben realizarse
comprobaciones completas del funcionamiento del controlador.
Posteriormente, se añadirá un Windows 11 llamado **nombrewin11** al
dominio Samba, verificando en ambos lados (cliente y servidor) que
aparece correctamente unido y realizando un inicio de sesión en Windows
con un usuario del dominio Samba. (*Mismas capturas que en la
presentación*)

**RECURSOS:**

  - Contenidos de la unidad de trabajo.

  - Máquinas virtuales base.

  - Conexión a internet.

**CALIFICACIÓN Y DOCUMENTACIÓN:**

  - > En caso de no indicar lo contrario cada apartado tendrá el mismo
    > valor.

  - > Para una calificación correcta se han de seguir las instrucciones
    > del documento: “**Pautas de informe**”, que se encuentra en el
    > apartado de recurso del Campus.

  - > Entregar un documento “*pdf*” a
    > través del Campus. El nombre del archivo debe ser:
    > “**Apellido1Apellido2Nombre\_SPXX”**

## Recuperación

**  
PREGUNTAS TEÓRICAS:**

1.  Explicar los diferentes tipos de relaciones de confianza que hay
    entre los dominios.

2.  Definir las siguientes herramientas: **NSS y PAM**
    
    **PREGUNTAS PRÁCTICAS:**
    
    En el **Windows Server con el dominio “nombre.rec”** hacer los
    siguientes apartados:

3.  Configura una zona de búsqueda inversa en el servidor DNS y
    comprueba su correcto funcionamiento. Explicación del proceso y en
    una sola captura mostrar el cmd con una búsqueda directa y otra
    inversa.

4.  Crear un script con un menú que me permita crear unidades
    organizativas, grupos o usuario del dominio. El menu se repetirá
    hasta que el usuario pulse 0, y también se le pedirá al usuario
    todos los parámetros para la creación de los objetos. Captura del
    script y de un ejemplo de funcionamiento de cada una de las opciones
    del menú.

5.  Instala y configura el servicio DHCP y el enrutamiento en el Windows
    Server dentro del siguiente rango de direcciones IP: desde
    192.169.x.200 hasta 192.169.x.250, teniendo en cuenta que la
    impresora del dominio tiene una IP fija 192.169.x.222. (xx es el
    número pincel, explicaciones y capturas)

6.  Agrega al dominio un equipo de Windows cliente con el nombre
    “**nombrewin11**”, recuerda configurar el adaptador de red de la
    máquina cliente para que esté en la misma red que el servidor.
    Captura de la ventana informativa de que se ha añadido equipo al
    dominio e iniciar sesión con un usuario del dominio y comprobar que
    esta en el dominio tanto en cliente como en servidor.
    
    En un **Ubuntu Server** hacer los siguientes apartados:

7.  Crear un árbol de directorio para el dominio **nombre.recldap**
    mediante el uso de archivo ldif

8.  Crea una estructura básica de **dos unidades organizativas**
    (unidad01, unidad02)

9.  Añadir 2 grupos a cada unidad organizativa (grupo0101, grupo0102,
    grupo0201, grupo0202) a cada uno de los grupos añade un usuario del
    dominio.

10. Eliminar el correo de uno de los usuarios y modificar el correo de
    otro de ellos por el siguiente: <recuperación@nombre.recldap>. En
    esta sección para la comprobación se han de hacer dos búsquedas que
    devuelvan un listado que solo muestre los campos nombre de los
    usuarios y correos electrónicos, será una antes y otra después de
    hacer los cambios.

**RECURSOS:**

  - > Máquinas virtuales base. La de Windows Server debe tener el
    > dominio **nombre.rec** ya creado para aprovechar el tiempo.

**CALIFICACIÓN Y DOCUMENTACIÓN:**

  - > En caso de no indicar lo contrario cada apartado tendrá el mismo
    > valor.

  - > Para una calificación correcta se han de seguir las instrucciones
    > del documento: “**Pautas de informe**”, que se encuentra en el
    > apartado de recurso del Campus.

  - > Entregar un documento “*pdf*” a
    > través del Campus. El nombre del archivo debe ser:
    > “***Apellido1Apellido2Nombre\_UTXXREC”***

### Solución

Resolución paso a paso de la actividad de Políticas de grupo (GPO).

[Tarea 5.2: Políticas de grupo (GPO) de active directory, servicio de
IIS y de escritorio remoto en Windows Server 2012 R2
2](#tarea-5.2-políticas-de-grupo-gpo-de-active-directory-servicio-de-iis-y-de-escritorio-remoto-en-windows-server-2012-r2)

[Tarea 5.2.1 Políticas de grupo en active directory
2](#tarea-5.2.1-políticas-de-grupo-en-active-directory)

[a) Establecer página de inicio en Internet Explorer.
5](#establecer-página-de-inicio-en-internet-explorer.)

[b) Establecer para los Profesores un límite en el almacenamiento de 40
MB.
10](#establecer-para-los-profesores-un-límite-en-el-almacenamiento-de-40-mb.)

[c) Establecer para los Alumnos un límite en el almacenamiento de 20MB.
13](#establecer-para-los-alumnos-unas-gpo.)

[Tarea 5.2.2 IIS 14](#tarea-5.2.2-iis)

[Tarea 5.2.3 Escritorio remoto 15](#tarea-5.2.3-escritorio-remoto)

# Tarea 5.2: Políticas de grupo (GPO) de active directory, servicio de IIS y de escritorio remoto en Windows Server 2012 R2

## Tarea 5.2.1 Políticas de grupo en active directory 

1.  Para trabajar con las políticas de grupo en active directory
    primeramente crearemos dos unidades organizativas en nuestro dominio
    ieselrincon.local: Profesores y Alumnos.

> ![](../assets/img/add/01/01-01.png)

1.  Creamos las unidades organizativas, repetimos este proceso para cada
    una de ellas:

> ![](../assets/img/add/01/01-02.png)
> 
> ![](../assets/img/add/01/01-03.png)

2.  Comprobamos que las unidades organizativas están creadas:

> ![](../assets/img/add/01/01-04.png)

2.  Dentro de la unidad administrativa Profesores se crearán dos
    usuarios: profesor01 y profesor02. Dentro de la unidad
    administrativa Alumnos se crearán dos usuarios: alumno01 y alumno02.

> ![](../assets/img/add/01/01-05.png)

![](../assets/img/add/01/01-06.png)
![](../assets/img/add/01/01-07.png)

1.  Repetimos los pasos anteriores hasta crear los tres usuarios
    restantes, comprobamos:

> ![](../assets/img/add/01/01-08.png)
> 
> ![](../assets/img/add/01/01-09.png)

### Establecer página de inicio en Internet Explorer.

1.  Vamos a Administración de directivas de grupo

> ![](../assets/img/add/01/01-10.png)

3.  Al picar sobre una política de grupo (ya sea Default Domain Policy o
    cualquier otra), aparece el siguiente mensaje. Le damos No volver a
    mostrar este mensaje y picamos en Aceptar.

> ![](../assets/img/add/01/01-11.png)

1.  En la pestaña de Configuración. Nos aparecerá la siguiente venta en
    la que picamos en Agregar para agregar la consola de seguridad a los
    sitios de confianza y cerramos.

![](../assets/img/add/01/01-12.png)
![](../assets/img/add/01/01-13.png)

2.  En la pestaña Configuración se encuentran las configuraciones de
    política de grupo que se crean por defecto.

> ![](../assets/img/add/01/01-14.png)

4.  Para empezar a aplicar políticas de grupo que afectarán al dominio,
    si no queremos que se apliquen a nuestro servidor, debemos Bloquear
    la herencia de las GPO en Domain Controllers: botón derecho del
    ratón situándonos en Domain Controllers y picar en Bloquear
    herencia. A continuación, creamos una Política de grupo y lo
    vinculamos aquí:

> ![](../assets/img/add/01/01-15.png)

5.  Creamos una política de grupo para establecer para todos los
    usuarios la página de inicio.

> ![](../assets/img/add/01/01-16.png)
> 
> ![](../assets/img/add/01/01-17.png)
> 
> Como podemos ver en las imágenes habilitamos la configuración de la
> página principal, ponemos la web de inicio aplicamos y luego
> aceptamos.

6.  Conexión al cliente win10 y abrimos el Explorer y comprobamos que la
    web de inicio es la del www.ieselrincon.org.
    
    ![](../assets/img/add/01/01-18.png)

### Establecer para los Profesores un límite en el almacenamiento de 40 MB. 

1.  En la consola de Administración de directivas de grupo, creamos una
    GPO en la unidad organizativa Profesores: se sitúa el ratón sobre
    Profesores, botón derecho Crear un GPO en este dominio y vincularlo
    aquí …

> ![](../assets/img/add/01/01-19.png)

1.  Le ponemos nombre a la directiva. Picamos en Aceptar

> ![](../assets/img/add/01/01-20.png)

2.  Vemos que se ha creado el objeto Directiva de grupo Profesores en el
    contenedor Profesores en la consola de Administración de directivas
    de grupo.

> ![](../assets/img/add/01/01-21.png)

3.  Para limitar el tamaño del perfil local de los usuarios que están en
    la UO Profesores a 40MB. Debemos ir a Configuración de usuario
    Directivas Sistema Perfiles de usuario y hacemos doble click en
    Limitar el tamaño del perfil

> ![](../assets/img/add/01/01-22.png)
> 
> Habilitamos la directiva y asignamos al tamaño máximo 40000KB.
> 
> ![](../assets/img/add/01/01-23.png)

4.  Comprobamos que está habilitada la directiva:

> ![](../assets/img/add/01/01-24.png)

7.  El siguiente paso será conectarse como profesor y generar
    documentación hasta exceder de 40MB y comprobar que nos muestra el
    aviso.

> ![](../assets/img/add/01/01-25.png)

### Establecer para los Alumnos unas GPO. 

1.  En la consola de Administración de directivas de grupo, creamos una
    GPO en la unidad organizativa Alumnos: se sitúa el ratón sobre
    Alumnos, botón derecho Crear un GPO en este dominio y vincularlo
    aquí …

> ![](../assets/img/add/01/01-26.png)

1.  Le ponemos nombre a la directiva. Picamos en Aceptar

> ![](../assets/img/add/01/01-27.png)

2.  Vemos que se ha creado el objeto Directiva de grupo Alumnos en el
    contenedor Alumnos en la consola de Administración de directivas de
    grupo.

> ![](../assets/img/add/01/01-28.png)

3.  Para limitar el tamaño del perfil local de los usuarios que están en
    la UO Alumnos a 20MB. Debemos ir a Configuración de usuario
    Directivas Sistema Perfiles de usuario y hacemos doble click en
    Limitar el tamaño del perfil

> ![](../assets/img/add/01/01-29.png)
> 
> Habilitamos la directiva y asignamos al tamaño máximo 20000KB.
> 
> ![](../assets/img/add/01/01-30.png)

4.  Para impedir el acceso a la configuración del PC y al panel de
    control. Debemos ir a Configuración de usuario Directivas Plantillas
    administrativas Panel de control y hacemos doble click en Prohibir
    el acceso a Configuración de PC y a Panel de control

> ![](../assets/img/add/01/01-31.png)
> 
> ![](../assets/img/add/01/01-32.png)

5.  A continuación, entramos con el perfil de Alumno y comprobamos las
    políticas de seguridad:

> ![](../assets/img/add/01/01-33.png)

## Tarea 5.2.2 IIS 

1.  El IIS se instaló al instalar el servicio de enrutamiento y acceso
    remoto. La tarea consiste en, desde un equipo cliente con Windows
    10, conectarse a la página de inicio del servidor IIS.


8.  Desde una máquina cliente que esté en la misma red que el servidor,
    abrimos un Internet Explorer y tecleamos la IP del servidor o su
    nombre (si está también está instalado el servicio DNS en el
    servidor). Nos debe mostrar la página de inicio del servidor IIS.

> ![](../assets/img/add/01/01-34.png)

## Tarea 5.2.3 Escritorio remoto 

En el servidor habilita el escritorio remoto y conectar desde una
máquina con Windows 10 de forma remota.

1.  En el servidor Windows Server 2012 R2 vamos a Servidor local en el
    Panel del servidor. Vemos que el Escritorio remoto está
    Deshabilitado por defecto.

> ![](../assets/img/add/01/01-35.png)

9.  Picamos es deshabilitado y en la ventana que aparece, no están
    permitidas las conexiones remotas a este equipo. Picamos en Permitir
    las conexiones remotas a este equipo para habilitar el escritorio
    remoto

> ![](../assets/img/add/01/01-36.png)

10. Comprobamos en el Servidor local si se a habilitado:

> ![](../assets/img/add/01/01-37.png)

11. Conexión vía escritorio remoto desde un cliente Windows 10.
    Accedemos a nuestra maquina cliente e intentamos acceder al
    servidor. Buscamos la conexión a escritorio remoto.

> ![](../assets/img/add/01/01-38.png)

12. Una vez abierta la aplicación ponemos la IP del servidor:

> ![](../assets/img/add/01/01-39.png)

13. Para poder conectar hay que Desactivar firewall del servidor, desde
    el panel de control:
    
    ![](../assets/img/add/01/01-40.png)

14. Una vez desactivado el Firewall del servidor me permite la conexión
    al mismo desde el cliente:

> ![](../assets/img/add/01/01-41.png)

15. Se nos pide las credenciales del usuario para conectarse. Si
    utilizásemos este usuario no nos podríamos conectar remotamente
    porque no está autorizado para hacerlo.

> ![](../assets/img/add/01/01-42.png)

16. Intentamos conectarnos con el usuario ymorgil y comprobamos que
    efectivamente se nos deniega la conexión de escritorio remoto por no
    estar el usuario autorizado.

> ![](../assets/img/add/01/01-43.png)
> 
> ![](../assets/img/add/01/01-44.png)

17. Al conectar y pedirnos las credenciales, debemos picar en Más
    opciones, luego picar en Usar otra cuenta.
    
    Luego escribir el usuario Administrador y su contraseña. Finalmente
    picamos en Aceptar

> ![](../assets/img/add/01/01-45.png)

18. Ya estamos conectados al servidor vía escritorio remoto. Para cerrar
    sesión picamos en la X y nos aparecerá la ventana advirtiéndonos de
    que la sesión remota se desconectará. Y a continuación podemos ver
    el servidor cuando está siendo accedido.

> ![](../assets/img/add/01/01-46.png)
> 
> ![](../assets/img/add/01/01-47.png)

## Referencias

### Curso de LDAP en GNU/Linux (60 horas)

Manual completo (55 páginas) de Tecno-Redes Sistemas VCG, con licencia Creative Commons BY-NC-SA. Índice de contenidos: objetivos y requisitos del curso, introducción a LDAP (qué es, por qué usarlo, cómo se almacena y referencia la información, X.500, diferencias entre LDAP v2 y v3), instalación y configuración de SLAPD en Debian, administración de usuarios y grupos mediante archivos LDIF, autenticación de clientes y listas de acceso (ACL) en LDAP.

### Configuración de Samba4 como controlador de dominios

Manual de Juan Manuel Rodríguez Begines (junio 2014) sobre la implementación de un dominio Active Directory con Samba4 sobre Debian. Cubre: instalación y puesta en marcha de Samba4 como AD DC, configuración de DNS, Kerberos y NTP, autenticación integrada con SSSD, NSS y PAM, unión de clientes Linux y Windows al dominio, y publicación de recursos compartidos con NFSv4.
