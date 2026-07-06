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
