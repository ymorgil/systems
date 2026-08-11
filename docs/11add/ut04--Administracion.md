# **🖧 UT04 · Administración remota**

![Protocolos de acceso remoto y sus puertos: SSH, RDP, VNC y WinRM](../assets/img/add/ut04-diagrama.svg)

## Resultado de aprendizaje y criterios de evaluación

**RA4.** Administra de forma remota el sistema operativo en red valorando su importancia y aplicando criterios de seguridad.

Criterios de evaluación:

a) Se han descrito métodos de acceso y administración remota de sistemas.
b) Se ha diferenciado entre los servicios orientados a sesión y los no orientados a sesión.
c) Se han utilizado herramientas de administración remota suministradas por el propio sistema operativo.
d) Se han instalado servicios de acceso y administración remota.
e) Se han utilizado comandos y herramientas gráficas para gestionar los servicios de acceso y administración remota.
f) Se han creado cuentas de usuario para el acceso remoto.
g) Se han realizado pruebas de acceso y administración remota entre sistemas heterogéneos.
h) Se han utilizado mecanismos de encriptación de la información transferida.
i) Se han documentado los procesos y servicios del sistema administrados de forma remota.

## 1. Por qué administrar en remoto

Un administrador de sistemas rara vez trabaja sentado delante del servidor que gestiona. Los centros de datos modernos alojan cientos de máquinas físicas y virtuales, muchas veces repartidas entre varias sedes o en la nube, por lo que la **administración remota** —acceder y controlar un sistema desde otra ubicación a través de la red— no es una comodidad sino la forma normal de trabajar (criterio a).

Antes de elegir una herramienta concreta conviene fijar dos conceptos que se repiten en todo el tema:

- **Acceso remoto**: la capacidad técnica de conectarse a un sistema situado en otro lugar.
- **Administración remota**: un paso más allá del simple acceso — gestionar y controlar activamente los recursos de ese sistema (usuarios, servicios, actualizaciones) como si se estuviera físicamente delante.

Las ventajas que justifican generalizar este modelo de trabajo son claras: **acceso desde cualquier lugar**, **ahorro de tiempo y desplazamientos**, **conexiones cifradas** que preservan la seguridad, **multitarea** (gestionar varios sistemas desde un único puesto) y **diagnóstico en tiempo real** de incidencias. El precio a pagar es que toda esa superficie de conexión debe protegerse: cada servicio de acceso remoto que se activa es, potencialmente, una puerta de entrada para un atacante si no se configura con cuidado — de ahí que el propio RA4 exija "valorar su importancia y aplicar criterios de seguridad".

!!! note "Interfaces de usuario, la base de cualquier acceso remoto"
    Todo acceso remoto termina apoyándose en alguna interfaz de usuario: **CLI** (línea de comandos, la más habitual en administración por su eficiencia y facilidad de automatizar), **GUI** (gráfica, más intuitiva pero más pesada de transmitir por red), **TUI** (texto con aspecto de menús, típica de consolas de BIOS o instaladores) o interfaces web. En Windows, PowerShell ha sustituido progresivamente a `cmd` como shell de administración; en GNU/Linux, `bash` es el shell por defecto de la mayoría de distribuciones, aunque existen alternativas como `tcsh`, `ksh` o PowerShell Core (multiplataforma).

## 2. Servicios orientados a sesión frente a no orientados a sesión

El criterio (b) exige diferenciar explícitamente dos familias de servicios de acceso remoto, una distinción que en la práctica determina para qué sirve cada herramienta:

| | Orientado a sesión | No orientado a sesión |
|---|---|---|
| Estado de la conexión | Mantiene un estado mientras dura la conexión | Cada petición es independiente, sin estado persistente |
| Autenticación | Una vez, al inicio de la sesión | En cada petición o de forma delegada |
| Uso típico | Trabajo interactivo: shell, escritorio gráfico | Automatización, consultas puntuales, gestión masiva |
| Ejemplos | SSH, RDP, VNC, Telnet | WinRM, WMI, SNMP, la mayoría de APIs REST |
| Qué ocurre si se corta la red | La tarea en curso se interrumpe (salvo uso de `tmux`/`tmate`) | No hay "tarea en curso"; se reintenta la siguiente petición |
| Ejemplo de herramienta de gestión masiva | — | Ansible (SSH sin sesión persistente), Windows Admin Center (WinRM) |

Un administrador que necesita **entrar y trabajar de forma interactiva** en un servidor (revisar logs, editar un fichero de configuración, depurar un problema) usará un servicio orientado a sesión. Un administrador que necesita **lanzar la misma comprobación en 200 equipos** preferirá un mecanismo sin sesión, pensado para ejecutarse de forma desatendida y en paralelo.

**tmux** (multiplexor de terminal) y **tmate** (su variante orientada a compartir sesiones) resuelven precisamente el punto débil de los servicios orientados a sesión: permiten mantener procesos en ejecución aunque se cierre la conexión SSH, y retomar exactamente donde se dejó la sesión.

## 3. SSH y túneles en GNU/Linux

**SSH (Secure Shell)** es el protocolo de referencia para el acceso remoto cifrado por línea de comandos en sistemas Unix/Linux (y, desde Windows 10 / Server 2019, también nativo en Windows mediante **OpenSSH**). Sustituye a Telnet, que viaja en texto plano y debe evitarse salvo que no exista otra alternativa.

| Componente OpenSSH | Función |
|---|---|
| `sshd` | Demonio servidor SSH |
| `ssh` | Cliente SSH |
| `ssh-keygen` | Genera y administra pares de claves de autenticación |
| `ssh-agent` | Mantiene en memoria las claves privadas para no teclear la contraseña en cada conexión |
| `ssh-add` | Añade claves privadas a `ssh-agent` |
| `ssh-keyscan` | Recopila claves públicas de host de varios servidores |

### Autenticación por clave pública

El mecanismo recomendado frente a usuario/contraseña es la autenticación por par de claves asimétricas:

1. Generar el par de claves en el cliente: `ssh-keygen -t ed25519`.
2. Copiar la clave **pública** al servidor con `scp` (Secure Copy, construido sobre SSH): `scp ~/.ssh/id_ed25519.pub usuario@servidor:~/`.
3. Añadir esa clave pública a `~/.ssh/authorized_keys` en el servidor y comprobar que la conexión ya no pide contraseña.

La clave **privada** nunca sale del equipo cliente: es la prueba criptográfica de identidad, y perderla (o que se filtre) equivale a perder el control de todas las cuentas donde se haya autorizado su clave pública.

### Configuración del servidor: `/etc/ssh/sshd_config`

| Directiva | Efecto | Recomendación |
|---|---|---|
| `Port` | Puerto de escucha (22 por defecto) | Cambiarlo reduce el ruido de escaneos automáticos, aunque no sustituye a una buena política de claves |
| `PermitRootLogin` | Permite iniciar sesión SSH directamente como root | `no`: conectar como usuario normal y usar `sudo` |
| `AllowUsers` | Restringe qué usuarios (y desde qué IPs) pueden conectarse | `AllowUsers admin@* tecnico@192.168.5.*` |
| `PasswordAuthentication` | Permite autenticación por contraseña | `no` una vez configuradas las claves, para forzar autenticación por clave |
| `X11Forwarding` | Permite reenviar aplicaciones gráficas remotas a la pantalla local | `yes` solo si es necesario ejecutar apps gráficas remotas |

!!! example "X11 Forwarding"
    Con `X11Forwarding yes` en el servidor y un servidor X en el cliente (por ejemplo **Xming** en Windows), el comando `ssh -X usuario@servidor` permite lanzar una aplicación gráfica Linux (un editor, un navegador) y verla renderizada en la pantalla local, aunque el proceso se ejecute íntegramente en el servidor remoto.

### Túneles SSH: cifrar lo que no viaja cifrado

Un **túnel SSH** (*port forwarding*) aprovecha la conexión SSH ya cifrada para redirigir el tráfico de otro servicio, típicamente uno que por sí mismo no cifra sus datos (una base de datos, un panel web interno, un servidor de correo).

![Túnel SSH: un puerto local se redirige de forma cifrada a un puerto remoto](../assets/img/add/ut04-tunel-ssh.svg)

```bash
# Reenvío local: el puerto 3306 de mi equipo "se convierte" en el puerto 5252 del servidor remoto
ssh -L 3306:localhost:5252 usuario@servidor
```

A partir de ese momento, cualquier cliente MySQL que conecte a `localhost:3306` en la máquina local en realidad está hablando, de forma cifrada, con el puerto 5252 del servidor remoto — sin que ese puerto tenga que estar expuesto directamente a Internet. Herramientas gráficas como **PuTTY** permiten configurar este mismo reenvío desde un asistente, sin recordar la sintaxis del comando.

## 4. Escritorio remoto y WinRM en Windows

### Remote Desktop Services (RDS) y RDP

El protocolo **RDP** (*Remote Desktop Protocol*, puerto 3389/TCP) es la solución nativa de Microsoft para escritorio remoto gráfico completo. Viene instalado en todos los Windows, pero desactivado por defecto en los clientes; en Windows Server, en cambio, es habitual mantenerlo activo bajo el rol **RDS**.

| Componente RDS | Función |
|---|---|
| Remote Desktop Session Host (RDSH) | Ejecuta los escritorios y aplicaciones virtuales en el servidor |
| RemoteApp | Publica una aplicación concreta del servidor como si se ejecutara en local |
| Remote Desktop Gateway (RD Gateway) | Permite el acceso RDP encapsulado sobre HTTPS, sin abrir el 3389 directamente a Internet |
| Remote Desktop Web Access | Acceso a escritorios y aplicaciones RDS desde el navegador |
| Remote Desktop Connection Broker | Equilibra y redirige las conexiones de los usuarios |
| Remote Desktop Licensing | Gestiona las licencias CAL necesarias para RDS |

Al habilitar el escritorio remoto en un equipo Windows hay tres niveles de exigencia de seguridad, de menos a más restrictivo: no permitir conexiones, permitir cualquier versión de cliente RDP, o exigir **autenticación a nivel de red (NLA)** antes de establecer la sesión gráfica — esta última opción es la recomendada salvo que se necesite dar soporte a clientes RDP muy antiguos.

### WinRM: gestión remota sin sesión gráfica

**WinRM** (*Windows Remote Management*) es la implementación de Microsoft del estándar WS-Management y el mecanismo que sostiene **PowerShell Remoting**: permite ejecutar comandos y scripts en un equipo remoto sin abrir una sesión de escritorio, escuchando en los puertos **5985 (HTTP)** y **5986 (HTTPS)**.

```powershell
# Habilitar WinRM en el equipo destino
Enable-PSRemoting -Force

# Ejecutar un comando en un equipo remoto desde el cliente
Invoke-Command -ComputerName srv01 -ScriptBlock { Get-Service }

# Abrir una sesión interactiva remota
Enter-PSSession -ComputerName srv01
```

WinRM es exactamente el tipo de servicio "no orientado a sesión persistente" del apartado 2: cada invocación se autentica y ejecuta de forma independiente, lo que lo hace ideal para automatizar tareas en muchos servidores a la vez (por ejemplo, con **Ansible** también contra Windows, o con **Windows Admin Center**, que usa WinRM por debajo de su interfaz web).

### Otras herramientas nativas de Windows (criterio c)

- **RSAT** (*Remote Server Administration Tools*): instalable en cualquier cliente Windows para administrar roles de Windows Server (AD, DNS, DHCP...) con las mismas consolas gráficas que si se estuviera delante del servidor.
- **Administrador del Servidor** y **consolas MMC**: gestión gráfica de roles y características, especialmente útil con instalaciones Server Core (sin interfaz gráfica local).
- **Windows Admin Center**: consola web centralizada, instalable en un equipo del dominio, que sustituye progresivamente a varias consolas MMC dispersas.
- **Administración remota de IIS**: gestión del servidor web desde el propio navegador.

!!! warning "El cortafuegos, la pieza que siempre falta"
    Ninguna de estas herramientas funciona si el firewall del equipo de destino bloquea el puerto correspondiente. Antes de dar por fallida una conexión remota, la primera comprobación es siempre la regla de firewall (entrante) de la máquina destino, no la configuración del servicio en sí.

## 5. Herramientas de acceso remoto gráfico y de terceros

Junto a las herramientas nativas del sistema operativo, existe un ecosistema de aplicaciones de terceros que facilitan el acceso remoto gráfico, muchas veces resolviendo problemas de NAT o firewall que complican una conexión RDP/VNC directa:

| Herramienta | Protocolo/base | Punto fuerte |
|---|---|---|
| PuTTY | SSH/Telnet | Cliente ligero, muy usado para túneles SSH en Windows |
| NoMachine | NX (propietario) | Experiencia de escritorio remoto muy fluida |
| VNC (TightVNC, RealVNC, UltraVNC) | RFB | Multiplataforma, arquitectura servidor/visor |
| TeamViewer / AnyDesk / RustDesk | Propietario | Atraviesan NAT sin configurar el router; RustDesk es alternativa de código abierto |
| Rdesktop / Remmina | RDP, VNC, SSH, SPICE | Clientes Linux para conectar a escritorios Windows y otros |
| Apache Guacamole | HTML5 (proxy de RDP/VNC/SSH) | Acceso remoto **sin cliente instalado**, solo navegador |

**Apache Guacamole** merece una mención aparte: no es un protocolo nuevo, sino un *gateway* HTML5 que traduce RDP, VNC, SSH y Telnet a una sesión servida por navegador, centralizando la autenticación, el cifrado y el registro de conexiones de todos esos protocolos en un único punto — muy útil cuando se necesita dar acceso puntual a un sistema sin instalar ningún cliente en el equipo del usuario.

## 6. VPN y WireGuard: cifrar la red, no solo la sesión

Una **VPN** (*Virtual Private Network*) construye un túnel cifrado sobre una red pública (típicamente Internet) para conectar dos redes o un dispositivo con una red, como si estuvieran en el mismo segmento local. A diferencia de un túnel SSH puntual (un servicio concreto), una VPN cifra **todo** el tráfico entre los extremos conectados.

| Modalidad de VPN | Escenario | Protocolos habituales |
|---|---|---|
| Punto a punto (*road warrior*) | Un usuario remoto se conecta a la red de la oficina | L2TP, PPTP, WireGuard |
| Sitio a sitio | Dos sedes se conectan de forma permanente | IPsec, OpenVPN |
| LAN de acceso remoto | Varios usuarios remotos acceden a recursos internos concretos | IPsec, OpenVPN, WireGuard |

Entre las soluciones software para GNU/Linux, tres aparecen constantemente: **OpenVPN** (SSL/TLS, muy extendido, algo más pesado), **StrongSwan** (IPsec/IKEv2, buena compatibilidad con clientes VPN nativos de móviles) y **WireGuard**.

### WireGuard como VPN moderna

**WireGuard** se diseñó explícitamente para ser más simple, más rápida y más auditable que IPsec u OpenVPN, usando criptografía moderna (Curve25519, ChaCha20, Poly1305) y un núcleo de código muy reducido (unas 4.000 líneas, frente a las más de 100.000 de OpenVPN/IPsec), lo que facilita auditar su seguridad.

![Arquitectura de una VPN WireGuard: peers con claves propias conectados a través de un servidor central](../assets/img/add/ut04-wireguard.svg)

Conceptos clave de su modelo:

- **Interfaz `wg0`**: la interfaz de red virtual que crea WireGuard en cada extremo, con una IP dentro del rango privado de la VPN (por ejemplo, `10.0.0.1/24` en el servidor).
- **Peer**: cada extremo de la conexión (cliente o servidor) se identifica por un par de claves pública/privada, no por certificados ni usuario/contraseña.
- **Puerto 51820/UDP**: puerto por defecto en el que escucha un servidor WireGuard.
- **`wg show`**: comando que muestra el estado de los peers conectados, el tráfico cursado y el último *handshake*.
- **WireGuard-UI**: interfaz web opcional para gestionar peers (altas, bajas, generación de configuración) sin editar el fichero de configuración a mano.

```ini
# Ejemplo simplificado de configuración de un peer cliente (.conf)
[Interface]
PrivateKey = <clave_privada_del_cliente>
Address = 10.0.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = <clave_publica_del_servidor>
Endpoint = vpn.instituto.local:51820
AllowedIPs = 0.0.0.0/0
```

Un caso de uso frecuente en el aula es desplegar WireGuard dentro de un **contenedor LXC de Proxmox**, generar la configuración de un cliente móvil (importable mediante un código QR) y de un cliente de escritorio, y comprobar la conectividad del túnel con `wg show` antes de habilitar el acceso a recursos internos.

## 7. Cifrado de la información transferida

El criterio (h) exige explícitamente utilizar mecanismos de encriptación de la información transferida. Conviene tener claro, unidad tras unidad, **dónde** se aplica ese cifrado en cada tecnología vista:

| Servicio | Mecanismo de cifrado |
|---|---|
| SSH | Cifrado simétrico de la sesión tras un intercambio de claves asimétrico inicial |
| RDP | TLS (a partir de NLA); versiones antiguas sin NLA son bastante menos seguras |
| VNC | Depende de la implementación; muchas variantes no cifran por defecto y requieren un túnel SSH adicional |
| WinRM | HTTPS en el puerto 5986 (el 5985/HTTP debe restringirse a redes de confianza) |
| WireGuard | ChaCha20 (cifrado) + Poly1305 (autenticación) + Curve25519 (intercambio de claves) |
| OpenVPN / StrongSwan | TLS / IPsec según el protocolo |

!!! danger "Telnet y VNC sin cifrar: los ejemplos negativos del tema"
    Telnet transmite usuario y contraseña en texto plano por la red: cualquiera que capture el tráfico (por ejemplo con Wireshark) puede leer las credenciales directamente. Muchas implementaciones de VNC tienen el mismo problema si no se combinan con un túnel SSH (`ssh -L 5900:localhost:5900 usuario@servidor`) o una VPN. La regla general del tema: si un protocolo no cifra por diseño, se cifra transportándolo dentro de otro que sí lo haga.

## 8. Cuentas de acceso remoto

El criterio (f) exige crear cuentas específicas para el acceso remoto, y no reutilizar sin más las cuentas administrativas habituales. Buenas prácticas habituales:

- Crear una cuenta nominal por técnico (nunca una cuenta compartida "admin" para todo el equipo), de forma que quede constancia de quién ha hecho cada conexión.
- Restringir cada cuenta al mínimo de permisos necesario: un técnico de soporte de nivel 1 no necesita ser administrador de dominio para reiniciar un servicio.
- En SSH, combinar `AllowUsers` con autenticación por clave y, si es posible, con una VPN previa (WireGuard) para que el puerto SSH ni siquiera sea visible desde Internet.
- En Windows, añadir explícitamente al grupo **Usuarios de escritorio remoto** solo las cuentas que necesitan RDP, en lugar de conceder el acceso a "Todos" o al grupo de administradores completo.
- Revisar y retirar cuentas de acceso remoto cuando un técnico deja de necesitarlas (bajas, cambios de puesto, fin de un contrato de mantenimiento).

## 9. Pruebas de acceso entre sistemas heterogéneos

El criterio (g) pide expresamente comprobar el acceso remoto **entre sistemas operativos distintos**, no solo Windows-Windows o Linux-Linux. En la práctica esto significa validar combinaciones como:

| Origen | Destino | Mecanismo típico |
|---|---|---|
| Windows | GNU/Linux | SSH (OpenSSH cliente), X11 Forwarding con Xming |
| GNU/Linux | Windows | RDP con Remmina/rdesktop, WinRM desde `pypsrp` o Ansible |
| Windows | Windows | RDP nativo, WinRM/PowerShell Remoting |
| GNU/Linux | GNU/Linux | SSH nativo |
| Móvil (Android/iOS) | Cualquiera | VNC/RDP por app, cliente WireGuard, Guacamole vía navegador |

![Comparativa visual entre servicios orientados a sesión y servicios sin sesión](../assets/img/add/ut04-comparativa-protocolos.svg)

Documentar estas pruebas cruzadas no es un formalismo: en una infraestructura real conviven sistemas operativos distintos (servidores Linux, puestos Windows, portátiles con Ubuntu, tablets Android del personal de campo), y un fallo de acceso remoto que solo se detecta al mezclar sistemas heterogéneos —por ejemplo, un problema de codificación de caracteres entre un cliente RDP de Linux y un servidor Windows— puede pasar completamente desapercibido si solo se prueba dentro de un mismo sistema operativo.

## 10. Instalaciones y actualizaciones remotas

La administración remota no se limita a "entrar" en un sistema ya instalado: también cubre desplegar sistemas operativos completos y mantenerlos actualizados sin intervención manual en cada equipo.

- **PXE** (*Preboot eXecution Environment*): permite arrancar un equipo sin sistema operativo directamente desde la red (DHCP identifica al cliente, TFTP le envía un cargador de arranque mínimo).
- **MDT** (*Microsoft Deployment Toolkit*) y **WDS** (*Windows Deployment Services*): MDT define las secuencias de tareas y la lógica de instalación; WDS actúa como transporte de las imágenes por red vía PXE. Es habitual combinarlos: MDT genera la imagen y la secuencia, WDS la sirve a los clientes.
- **DRBL** y **FOG**: soluciones de despliegue de imágenes para GNU/Linux, con captura y distribución de imágenes de disco a través de la red.
- **WSUS** (*Windows Server Update Services*): centraliza la descarga de actualizaciones de Windows en un único servidor interno, evitando que cada equipo descargue lo mismo desde Internet.
- **apt-mirror** / **Reposync**: equivalentes en GNU/Linux para mantener un repositorio espejo local de paquetes APT o YUM/DNF.

| Aspecto | Instalación desatendida | Instalación remota |
|---|---|---|
| Intervención humana | Mínima o nula durante el proceso | Requiere acceso y supervisión activa por red |
| Escenario típico | Despliegue masivo de un mismo SO | Mantenimiento continuo de servidores ya en producción |
| Ejemplo | Imagen WDS/MDT aplicada a 30 portátiles nuevos | Aplicar un parche WSUS a un servidor concreto |

## 11. Documentación de los servicios administrados en remoto

El criterio (i) cierra el ciclo del RA4: cada servicio de acceso remoto activado debe quedar documentado. Una ficha mínima por servicio debería incluir:

1. **Servicio y versión** (por ejemplo, OpenSSH 9.x, RDS en Windows Server 2022).
2. **Puerto(s) utilizados** y si se han modificado respecto al valor por defecto.
3. **Mecanismo de autenticación** (clave pública, NLA, usuario/contraseña) y de cifrado.
4. **Cuentas autorizadas** y el motivo de la autorización (rol, tarea que justifica el acceso).
5. **Reglas de firewall** asociadas, en el propio equipo y en el perímetro de red.
6. **Fecha de la última prueba de acceso** realizada y su resultado.

Sin este registro, un cambio de personal o una auditoría de seguridad obliga a "redescubrir" qué servicios de acceso remoto existen en la infraestructura — exactamente el escenario que la documentación pretende evitar.

## Para profundizar

Esta unidad se apoya en el material de clase de Administración de Sistemas Operativos y en la documentación oficial de Microsoft sobre [OpenSSH en Windows](https://docs.microsoft.com/es-es/windows-server/administration/openssh/openssh_overview){:target="_blank"} y [Windows Admin Center](https://docs.microsoft.com/es-es/windows-server/manage/windows-admin-center/understand/what-is){:target="_blank"}, así como en la documentación de [WireGuard](https://www.wireguard.com/){:target="_blank"} y de [Apache Guacamole](http://guacamole.apache.org/doc/gug/index.html){:target="_blank"}. El resto de enlaces de referencia recopilados durante el curso está en la página de Recursos. Como proyecto real de referencia para la parte de VPN, [wireguard-ui](https://github.com/ngoduykhanh/wireguard-ui){:target="_blank"} ofrece una interfaz web completa de gestión de un servidor WireGuard.

##
##

# **🖧 UT04 · Administración remota**

En esta unidad se trabaja la administración remota de sistemas operativos: interfaces de usuario, escritorio remoto, protocolos de acceso remoto (SSH, VPN), herramientas de administración remota, instalaciones remotas (PXE, DRBL, MDT, WDS) y actualizaciones remotas (WSUS).

RA4. Administra de forma remota el sistema operativo en red valorando su importancia y aplicando criterios de seguridad.

## Teoría

### Administración remota I

#### Interfaces de usuario

Una interfaz de usuario (UI) en un sistema operativo es el medio a través del cual los usuarios interactúan con la computadora y sus recursos. Se han desarrollado para hacer que la interacción con la tecnología sea más intuitiva, eficiente y accesible. Existen varios tipos:

- **Interfaz de Usuario de Texto (TUI):** interfaz diseñada con caracteres ASCII para dibujar botones, tablas, gráficos, etc. (BIOS Legacy).
- **Interfaz de Línea de Comandos (CLI):** interfaz basada en texto que permite interactuar con el sistema operativo a través de comandos escritos. Ofrece un control profundo sobre el sistema y es preferida por muchos debido a su eficiencia y automatización. El CLI puede estar soportado por una TUI o una GUI.
- **Interfaz Gráfica de Usuario (GUI):** interfaz visual que utiliza elementos gráficos (ventanas, iconos, menús). Más amigable para usuarios no técnicos, aunque consume más recursos, por lo que gran parte de las tareas de administración se realizan por terminal (CLI).
- **Interfaz táctil:** diseñada para dispositivos con pantalla táctil (tocar, deslizar, pellizcar).
- **Interfaz de Usuario Web:** accesible a través de navegadores web (Gmail, Google Docs).
- **Interfaz por voz y reconocimiento gestual:** mediante asistentes de voz como Siri, Google Assistant o Cortana.

**En Windows**, PowerShell es un lenguaje de scripting y una interfaz de línea de comandos que ha sustituido al símbolo del sistema (`cmd`), centrada en la automatización y la administración de sistemas. Existe también PowerShell Core, versión de código abierto multiplataforma. Tanto PowerShell como `cmd` pueden ejecutarse a dos niveles:

- **Nivel usuario.**
- **Nivel administrador:** necesario para tareas administrativas del sistema; si se lanza una orden administrativa sin privilegios se obtiene un error de acceso denegado.

**En GNU/Linux** existen varios shells (consultables en `/etc/shell`):

- **Bash:** shell por defecto en la mayoría de distribuciones.
- **Tcsh:** basado en un lenguaje similar a C; shell por defecto de FreeBSD y macOS.
- **Ksh:** shell y lenguaje de programación usado más en UNIX (Solaris, HP-UX) que en Linux, aunque compatible con bash.
- **PowerShell Core:** versión de código abierto, compatible con las principales distros GNU/Linux.

GNU/Linux permite lanzar **consolas virtuales** (sesiones de terminal independientes del entorno gráfico), útiles para solucionar problemas o cuando el entorno gráfico no está disponible. Se referencian con la notación `ttyN`. Acceso mediante combinaciones de teclas: `Ctrl+Alt+F1` a `Ctrl+Alt+F6` cambian entre consolas virtuales, y `Ctrl+Alt+F7` suele volver al entorno gráfico.

**tmux** es un multiplexor de terminal que permite crear varias sesiones de shell, cada una ejecutando un proceso distinto, manteniendo tareas en segundo plano. Combinaciones básicas:

```
Ctrl-b + d   salir de la sesión actual
Ctrl-b + %   dividir la ventana en paneles superior/inferior
Ctrl-b + "   dividir la ventana en dos paneles verticales
Ctrl-b + flecha   moverse a un panel diferente
Ctrl-b + x   cerrar el panel actual
Ctrl-b + c   crear una nueva ventana
Ctrl-b + n   pasar a la siguiente ventana
Ctrl-b + p   volver a la ventana anterior
Ctrl-b + w   listar todas las ventanas de la sesión
```

**tmate** es una herramienta de colaboración en terminal, basada en tmux, que permite compartir sesiones en tiempo real de forma segura; muy útil para soporte remoto y trabajo en equipo.

#### Escritorio remoto

Permite a los usuarios acceder y controlar una computadora o sistema desde otro lugar, a menudo a través de una red. Ventajas principales:

- **Acceso a distancia:** desde cualquier lugar con conexión a Internet.
- **Ahorro de tiempo y costes:** evita desplazamientos físicos.
- **Seguridad:** conexiones habitualmente cifradas.
- **Multitarea:** administración de múltiples sistemas desde una única estación de trabajo.
- **Diagnóstico y resolución de problemas** en tiempo real.

**En Windows**, la herramienta de escritorio remoto (Terminal Server) viene instalada por defecto:

- En clientes Windows: instalada pero desactivada.
- En Windows Server: habilitada por defecto (no se recomienda deshabilitarla). Se gestiona con el rol **RDS (Remote Desktop Services)**.

Opciones de configuración del escritorio remoto:

- No permitir conexiones a este equipo.
- Permitir conexiones remotas (menos seguro), recomendable si no se conoce la versión de escritorio remoto de los clientes.
- Permitir solo conexiones con autenticación a nivel de red (más seguro).

Componentes de **RDS**:

- **Remote Desktop Session Host (RDSH):** ejecución de aplicaciones/escritorios virtuales en servidores remotos.
- **RemoteApp:** acceso a aplicaciones específicas del servidor RDSH como si fueran locales.
- **Remote Desktop Gateway (RD Gateway):** acceso seguro vía RDP sobre HTTPS.
- **Remote Desktop Web Access (RD Web Access):** acceso a aplicaciones y escritorios RDS desde el navegador.
- **Remote Desktop Connection Broker:** administra y equilibra las conexiones de los usuarios.
- **Remote Desktop Licensing (RD Licensing):** gestión de licencias CAL para RDS.

**En GNU/Linux**:

- **telnet:** conexión remota básica en texto plano, insegura (sin cifrar). Solo si no hay otra opción.
- **SSH:** shell segura y cifrada; permite también ejecutar aplicaciones gráficas.
- **X11 Forwarding:** ejecuta aplicaciones gráficas en el sistema remoto mostrando la salida en la pantalla local (`ssh -X` o `ssh -Y`).

Ubuntu, como la mayoría de sistemas operativos, incorpora acceso remoto gráfico (compartición de escritorio), deshabilitado por defecto pero fácil de activar desde el entorno gráfico.

#### Protocolos de acceso remoto

Estándares de comunicación que permiten acceder y controlar sistemas informáticos de forma remota. En una conexión de acceso remoto existen:

- **Cliente:** equipo que inicia la conexión y controla el sistema remoto.
- **Servidor:** equipo remoto que acepta la conexión y gestiona las solicitudes entrantes.

El modelo OSI estructura la comunicación en siete capas. Las más relevantes para el acceso remoto:

- **Capa 2 (Enlace de Datos):** conexiones directas entre dispositivos en LAN, mediante direcciones MAC.
- **Capa 3 (Red):** enrutamiento de datos entre redes distintas mediante direcciones IP.

**Protocolos de nivel 2:**

- **PPP:** facilita la comunicación directa entre dos nodos (conexiones seriales, VPN), con autenticación, compresión y cifrado.
- **PPTP:** protocolo de Microsoft para VPN; encapsula paquetes para crear un túnel seguro, aunque hoy se considera poco seguro.
- **L2TP:** crea túneles VPN; no cifra por sí mismo, se combina con IPsec.
- **HDLC:** comunicación punto a punto a alta velocidad con control de flujo y corrección de errores.

**Protocolos de nivel 3:**

- **IPsec:** cifrado y autenticación de paquetes IP, usado en VPN.
- **GRE:** encapsula paquetes de varios protocolos; se combina con IPsec para VPN seguras.
- **MPLS:** etiqueta paquetes para acelerar decisiones de enrutamiento.
- **VPLS:** LAN virtual sobre una WAN.
- **IKEv2:** junto con IPsec, establece claves de cifrado en VPN; ideal para dispositivos móviles por su reconexión rápida.

**Otros protocolos:**

- **Telnet** (puerto 23): obsoleto, sin cifrar.
- **SSH** (puerto 22): versión cifrada de Telnet, con copia de datos y túneles seguros.
- **VNC:** acceso remoto gráfico multiplataforma; transmite pulsaciones/movimientos al servidor y pantallas al cliente.
- **RDP:** protocolo de Microsoft para escritorio remoto, asociado a usuario/contraseña.
- **NFS:** acceso remoto a ficheros en sistemas UNIX/Linux; la versión más reciente incluye seguridad Kerberos.
- **SMB:** acceso remoto a archivos e impresoras, típico de Windows, compatible con GNU/Linux.
- **SSL:** conexiones seguras a nivel de aplicación (HTTPS) y creación de túneles VPN.

#### Escritorio remoto (SSH)

SSH (Secure Shell) es un protocolo de red que permite la conexión y el acceso remoto cifrado y seguro. Características principales: seguridad (cifrado avanzado), autenticación (usuario/contraseña o clave privada), acceso remoto por línea de comandos, transferencia segura de archivos y compatibilidad multiplataforma.

A partir de Windows 10 y Windows Server 2019, **OpenSSH** está disponible por defecto, permitiendo habilitar servicios SSH tanto en rol de servidor como de cliente. Comandos principales:

```
sshd.exe        componente servidor SSH
ssh.exe         componente cliente SSH
ssh-keygen.exe  genera, administra y convierte claves de autenticación
ssh-agent.exe   almacena claves privadas para autenticación de clave pública
ssh-add.exe     agrega claves privadas a la lista permitida por el servidor
ssh-keyscan.exe recopila claves de host SSH públicas de varios hosts
```

Proceso típico de autenticación por clave:

1. Generar un par de claves SSH en el cliente (con PuTTY o Git Bash). La clave pública se comparte; la clave privada solo la conoce el titular.
2. Copiar la clave pública al servidor mediante `scp` (Secure Copy Protocol, basado en SSH):

   ```bash
   scp [opciones] [origen] [destino]
   ```

3. Iniciar sesión en el servidor remoto y agregar la clave pública a `~/.ssh/authorized_keys`, comprobando el resultado.

**Configuración de SSH en GNU/Linux:**

1. Actualizar e instalar `openssh-server`, habilitándolo con `enable` si se desea que arranque en cada inicio.
2. Configurar `/etc/ssh/sshd_config`:
   - `Port`: por defecto el 22; recomendable cambiarlo como medida de seguridad básica.
   - `AllowUsers`: limita la conexión a usuarios (e IPs) concretos. Ejemplo: `AllowUsers miusuario@* usuario2@192.168.5.*` permite a "miusuario" desde cualquier equipo, y a "usuario2" solo desde la red 192.168.5.0.
   - `PermitRootLogin`: si es `yes`, permite conexión SSH directa como root (poco recomendable); se aconseja `no` y usar `sudo` tras conectar.
3. Para invocar aplicaciones gráficas desde la consola SSH (necesitando un servidor de ventanas adecuado en el cliente), añadir en la configuración:

   ```
   AllowAgentForwarding yes
   X11Forwarding yes
   X11DisplayOffset 10
   X11UseLocalhost yes
   ```

#### Acceso remoto con VPN

Una **Red Privada Virtual (VPN)** crea una conexión segura y cifrada entre dos redes o dispositivos a través de Internet, protegiendo la privacidad de la comunicación y permitiendo acceso seguro a recursos remotos. Se basa en el encapsulado y cifrado de paquetes que viajan por un túnel definido sobre una red pública.

**Características:**

- Cifrado de datos en todas las comunicaciones.
- Seguridad adicional mediante túnel cifrado.
- Acceso remoto seguro para trabajadores remotos, sucursales, etc.
- Autenticación y autorización de usuario/equipo.
- Protección en redes públicas o no seguras.

**Utilidades:** conectar empleados en remoto con la red de la oficina, unir sucursales, acceder a contenido geográficamente bloqueado, navegar de forma segura.

El **tunneling** implica establecer y mantener una conexión lógica entre dos extremos con nodos intermedios; los protocolos VPN deben proporcionar autenticación, compresión de datos, cifrado, direccionamiento dinámico y gestión de claves. Posibilidades de trabajo con VPN:

- **Punto a punto:** dos usuarios remotos establecen un túnel directo (protocolos habituales: L2TP, PPTP).
- **Sitio a sitio:** dos oficinas remotas conectadas mediante dos gateways compatibles (protocolos habituales: IPSec, OpenVPN).
- **LAN a Road Warrior (VPN de acceso remoto):** uno o varios usuarios remotos se conectan contra un gateway para acceder a recursos internos; también sirve para aislar zonas/servicios (DMZ). Servicios cloud como Azure ofrecen gateways VPN de este tipo.

**VPN basada en hardware:** routers que encriptan, seguros y de fácil uso, con gran rendimiento (no consumen ciclos de CPU de un SO), aunque de precio elevado.

**VPN basada en software (Windows):** **RRAS** (Servicio de enrutamiento y acceso remoto), que implementa el acceso remoto VPN y el enrutamiento (también para LAN-LAN, LAN-WAN o NAT).

**VPN basada en software (GNU/Linux):**

- **OpenVPN:** protocolo y aplicación de código abierto basada en SSL/TLS.
- **StrongSwan:** cliente VPN gratuito basado en IPsec, implementa IKEv1 e IKEv2.
- **WireGuard:** VPN extremadamente simple, rápida y moderna, con criptografía de última generación; objetivo de ser más rápida y sencilla que IPsec, con mayor rendimiento que OpenVPN ([wireguard.com](https://www.wireguard.com/)).

#### Herramientas de acceso remoto

Las herramientas gráficas externas ofrecen facilidad de uso, interfaz visual, mayor productividad, compatibilidad multiplataforma y características avanzadas. Principales herramientas:

- **PuTTY:** código abierto, SSH/Telnet. Muy usada para crear túneles SSH que dan seguridad a protocolos inseguros (POP, SMTP, HTTP).
- **NoMachine:** acceso y control remoto con experiencia similar a estar frente a la máquina; protocolo propietario NX; requiere instalar "Server" y "Client".
- **Xming:** servidor X Window System para Windows; ejecuta aplicaciones gráficas Linux/Unix en Windows (protocolo X11).
- **VNC:** control y visualización remota de escritorio; consta de VNC Server y VNC Viewer. Implementaciones: TightVNC, RealVNC, UltraVNC.
- **TeamViewer:** multiplataforma, sin configuración compleja de firewall/router, supera NAT; permite listas de equipos asociados.
- **Rdesktop:** código abierto, conecta a escritorios Windows desde Linux/Unix mediante RDP.
- **Remmina:** código abierto para Linux, interfaz unificada compatible con RDP, VNC, SSH, SPICE, etc.
- **Chrome Remote Desktop:** extensión de Chrome, protocolo propietario, fácil de usar y multiplataforma.
- **Radmin:** orientada a Windows, protocolo propietario, alto rendimiento y cifrado.
- **Termius:** cliente SSH moderno y multiplataforma con pestañas y temas personalizables.

#### Administración remota

La administración remota es esencial en los Centros de Atención de Usuarios (CAU) para un soporte técnico eficiente y continuidad de servicios.

- **Acceso remoto:** capacidad de conectarse y utilizar un sistema de forma remota.
- **Administración remota:** gestión y control de sistemas y recursos por parte del administrador.

**En Windows**, además de RDS y OpenSSH:

- **RSAT (Herramientas de administración remota):** instalable en cualquier cliente Windows para administrar servidores como si se estuviera delante, con interfaz gráfica.
- **Administrador del Servidor:** administración gráfica de servidores Windows Server, útil especialmente con servidores Core.
- **Consolas MMC:** herramientas administrativas asociadas a cada rol (DNS, GPO, AD, visor de eventos...).
- **Centro de Administración de AD:** administración del dominio (y de otros dominios del mismo bosque) desde cualquier equipo.
- **Windows Admin Center:** interfaz web centralizada para gestionar servidores (útil para clusters), instalada en un equipo miembro del dominio.
- **Administración remota con IIS:** consola de administración remota accesible desde el navegador.

> Importante: para usar cualquier herramienta en modo remoto es imprescindible que el cortafuegos esté correctamente configurado, sobre todo en la máquina de destino.

**En GNU/Linux**, además de la consola SSH tradicional:

- **Webmin:** herramienta de administración vía web, independiente de Apache, que trabaja por el puerto 10000. Permite gestionar usuarios, grupos, archivos, red, servicios (Apache, MySQL, SSH), tareas programadas, paquetes y seguridad.
- **Guacamole:** herramienta de acceso remoto basada en web con acceso seguro a escritorios y sistemas Linux/Windows desde el navegador, compatible con RDP, VNC, SSH y Telnet. Permite gestión centralizada de conexiones, autenticación segura, cifrado, redirección de puertos y SSO.

### Administración remota II

#### Instalaciones remotas

Proceso de instalar y configurar software, aplicaciones, sistemas operativos u otros componentes en un dispositivo desde una ubicación distante, sin presencia física. Características: acceso remoto, automatización, configuración inicial, actualizaciones/parches y seguridad.

A la instalación masiva de un paquete se le llama **despliegue**; a los equipos implicados, **ámbito** o **dominio** (por ejemplo: "el ámbito del despliegue del antivirus es el departamento de personal").

| Aspecto | Instalaciones desatendidas | Instalaciones remotas |
|---|---|---|
| Definición | Sin intervención humana directa | Administración desde ubicaciones distintas |
| Control | No requiere supervisión durante la instalación | Requiere acceso y supervisión activa vía red |
| Escenario típico | Instalación en lotes (SO en múltiples equipos) | Administración de servidores en tiempo real |
| Presencia física | No necesaria | No necesaria, pero requiere acceso de red |
| Interacción humana | Mínima o nula | Continua, para supervisar y controlar |
| Aplicaciones comunes | Actualización de SO, imágenes de disco | Supervisión de servidores, parches, mantenimiento |
| Seguridad | Menos preocupación (sin intervención humana) | Fundamental proteger las conexiones remotas |
| Automatización | Tareas repetitivas automatizadas | También se usa, con intervención manual puntual |

**PXE** (Preboot eXecution Environment): protocolo que permite arrancar e instalar el sistema operativo a través de la red. Compuesto por servidor PXE (proporciona el SO) y cliente PXE (solicita la instalación); el equipo debe soportarlo, configurable desde la BIOS. Secuencia: DHCP identifica el equipo en la red, y TFTP envía una versión ligera de arranque ("bootstrap") que instala el sistema operativo.

**DRBL** permite que varios ordenadores funcionen sin disco duro local, arrancando completamente desde la red gracias a un servidor central: el cliente pide por PXE la imagen del sistema operativo, que se carga en RAM. Los ficheros temporales se ejecutan en RAM o en NFS, y solo se escribe en el servidor si este lo permite. Permite clonar, gestionar y mantener decenas de PCs desde un único punto.

Implementación de DRBL: se prepara un servidor Linux con el paquete DRBL (arranque vía PXE y distribución de imágenes con Clonezilla SE); el servidor ofrece DHCP y TFTP, y se configura NFS para servir parte del sistema de archivos. Después se hace un test de arranque, se preparan las imágenes base (equipo maestro clonado con DRBL) y los alumnos arrancan desde red sobre el sistema efímero en RAM. Ventaja: cada sesión empieza limpia y el mantenimiento se reduce, aunque hay que dimensionar bien red y servidor porque la lectura desde red es más lenta que desde disco local.

**Instalaciones remotas en Windows:**

- **Media Creation Tool:** creación de USBs de instalación para despliegues manuales.
- **MDT y WDS:** despliegue automatizado en red o mediante imágenes.
- **Windows ICD:** creación y personalización de imágenes de Windows.
- **Microsoft Endpoint Manager (MEM):** plataforma unificada de gestión de dispositivos y seguridad (Windows, Linux, macOS, iOS, Android) sin estar físicamente delante del equipo:
  - **Autopilot:** un equipo nuevo se configura solo al loguearse el usuario, según las directrices de la empresa.
  - **Intune:** instala software, aplica políticas, configura Wi-Fi/VPN o actualiza Windows sin tocar el equipo.
  - **SCCM:** gestiona despliegues masivos de sistemas operativos en la red corporativa.

  Ejemplo de flujo con Autopilot: el departamento de TI registra los portátiles en Autopilot y define un perfil de despliegue (unión a Azure AD, inscripción en Endpoint Manager). El empleado solo enciende el equipo y lo conecta a Internet; Autopilot aplica el perfil automáticamente, se configuran políticas de seguridad (contraseñas, cifrado, firewall) y se instalan las aplicaciones necesarias, sin intervención manual de TI.

#### Microsoft Deployment Toolkit (MDT)

MDT es un conjunto de herramientas para crear e implementar imágenes de Windows de forma automatizada y estandarizada, mediante secuencias de tareas (instalación del SO, controladores, aplicaciones, configuraciones, actualizaciones). Puede usarse solo (imágenes por USB o medios offline) o combinado con WDS para instalaciones por red. Permite trabajar en modo **Lite Touch (LTI)**, donde el técnico confirma algunas opciones.

Pasos para instalar y utilizar MDT:

1. **Requisitos previos:** Windows Server (2016/2019/2022) o Windows 10/11; Windows ADK (Assessment and Deployment Kit); complemento WinPE Add-on (necesita ADK instalado); recomendable un directorio compartido para la Deployment Share y una red estable. No requiere Active Directory, aunque se integra mejor con él.

   Componentes del **Windows ADK**:
   - **SIM (Windows System Image Manager):** crea y edita archivos de respuesta para instalaciones desatendidas.
   - **DISM:** administra imágenes de Windows (controladores, componentes, actualizaciones).
   - **Windows PE:** entorno mínimo de arranque para instalar, recuperar o preparar Windows.
   - **USMT:** migra perfiles, datos y configuraciones de usuario entre equipos.
   - **Windows Assessment Toolkit:** analiza rendimiento, compatibilidad y fiabilidad.
   - **WinPE Add-on:** complemento que incluye Windows PE.

2. **Instalación de MDT.**
3. **Configuración de MDT (Share y Workbench):**
   - **Deployment Share:** carpeta compartida en red que actúa como almacén central de imágenes, aplicaciones, drivers y scripts del despliegue.
   - **Deployment Workbench:** consola de administración visual de todo el entorno de despliegue (deployment shares, sistemas operativos, aplicaciones, drivers, secuencias de tareas).
4. **Generar imagen de instalación WinPE:** configuración general (ubicación física/UNC, versiones compatibles), Rules (comportamiento del WinPE, `bootstrap.ini`), Windows PE (personalización de imágenes de arranque) y Monitoring (seguimiento del progreso desde la consola).
5. **Agregar una imagen de Windows:** crear carpetas para organizar los sistemas operativos y cargar las imágenes correspondientes.
6. **Agregar secuencia de tareas (Task Sequence):** conjunto de acciones a ejecutar (implementación de Windows, instalación de aplicaciones, Sysprep...). Revisar propiedades: General, Task Sequence y OS Info; finalmente actualizar el punto de despliegue.
7. **Implementación de Windows** en el equipo cliente.

#### Windows Deployment Services (WDS)

WDS es un servicio de Windows Server que despliega sistemas operativos vía red mediante PXE, evitando pendrives o DVDs: los clientes arrancan desde la red, descargan la imagen y continúan la instalación. WDS actúa como "transportador" de imágenes y arranque PXE, mientras que MDT aporta la lógica, secuencias de tareas y personalización; por eso es habitual combinarlos (MDT crea las imágenes y secuencias, WDS las envía por red).

Microsoft ha marcado WDS como en desuso (deprecated) en favor de Autopilot, Endpoint Manager/Intune y despliegues en la nube, pero sigue siendo estable y ampliamente usado, especialmente en laboratorios y entornos on-premise.

**Permite:** arranque de red, imágenes personalizadas, despliegue masivo escalable, administración centralizada y compatibilidad con distintas versiones de Windows.

**Requisitos:** Windows Server 2012 R2 o superior, integrado en un dominio con Active Directory; servidor DHCP activo para responder peticiones PXE; servidor DNS funcional; almacenamiento (partición NTFS independiente) para las imágenes; PXE habilitado sin bloqueos en switches/routers.

Conceptos clave:

- **Imágenes de arranque e instalación**, atendidas o desatendidas (con ficheros de respuesta XML generados con ADK).
- **Imágenes personalizadas (maestras):** creadas a partir de un equipo con las aplicaciones y configuración deseadas, preparadas con **Sysprep** (`C:\windows\system32\sysprep`), aplicable solo sobre una instalación limpia (no una actualización).
- **boot.wim:** imagen de arranque con Windows PE, usada para iniciar el equipo cliente por red y conectarlo al servidor de implementación.
- **install.wim:** imagen que contiene el sistema Windows a instalar (ediciones, características, componentes); se aplica al cliente tras arrancar desde `boot.wim`.

**Requisitos hardware** de ejemplo: disco con el sistema, disco de 20 GB para las imágenes a implantar, unidad óptica con Windows 10 para los equipos de dominio, dos tarjetas de red.

**Instalación y configuración:** agregar el rol WDS; configurar la ubicación de las imágenes (por defecto `C:\RemoteInstall`, recomendable moverla a un disco externo, p. ej. `I:\Imagenes`); configurar el PXE para que responda a todos los equipos e iniciar el servicio; añadir la imagen de arranque (`boot.wim`) y crear un grupo de imágenes para añadir la imagen de instalación (`install.wim`); para instalación desatendida se generan ficheros de respuesta `.xml` (con ADK) que se añaden al volumen de imágenes.

**WDS y MDT** son complementarios: se pueden usar los archivos generados con MDT y añadirlos a los despliegues de WDS para lograr una implementación centralizada y automatizada.

#### Actualizaciones remotas

El sistema operativo necesita mantenimiento continuo (parches de seguridad, mejoras de rendimiento, corrección de fallos). En entornos con muchos equipos, que cada uno descargue sus actualizaciones desde Internet puede saturar la red; por ello se centralizan las descargas en un único servidor interno, reduciendo el consumo de ancho de banda y permitiendo actualizar equipos sin acceso directo a Internet.

**En GNU/Linux**, mediante repositorios espejo (descargar y mantener localmente una copia de los repositorios necesarios, cambiando la ruta en el resto de equipos):

- **apt-mirror:** replica repositorios APT localmente.
- **Reposync:** repositorio YUM/DNF local sincronizado.
- **Landscape:** gestión centralizada de actualizaciones para Ubuntu.
- **Red Hat Satellite:** solución corporativa para distribuir parches y configurar RHEL.
- **Ansible:** automatiza instalaciones de actualizaciones mediante playbooks.

**En Windows**, mediante **WSUS** y, en infraestructuras mayores:

- **SCCM / MECM:** despliegue de parches, sistemas operativos y software.
- **Windows Update for Business:** políticas de actualización en dispositivos unidos a Azure AD.
- **Intune:** gestión de actualizaciones desde la nube.
- **Windows Autopatch:** automatiza el ciclo de parches en entornos corporativos.

#### Windows Server Update Services (WSUS)

WSUS centraliza las actualizaciones de una red para gestionarlas y distribuirlas (parches de seguridad y actualizaciones de otros productos Microsoft como Office, SQL Server, etc.). Se habilita un único servidor que descarga las actualizaciones (requiere el rol IIS) y, mediante GPO, se distribuyen por la red.

Pasos para instalar WSUS:

1. Preparar el servidor: instalar IIS y crear un nuevo disco para almacenar las actualizaciones centralizadas.
2. Configurar qué actualizaciones ofrecerá el servidor a los equipos de la LAN.
3. Comprobar creando una sincronización manual.

## Actividades y prácticas

### Práctica 01 · SP 4.1 Administración remota

Supuesto práctico, realizable en parejas (entrega individual). Cada pareja crea **dos instancias en AWS**:

- **Instancia 01:** Windows Server 2022.
- **Instancia 02:** Ubuntu Server 24.04 LTS.

Cada miembro debe realizar las siguientes conexiones remotas, documentando el proceso con capturas (terminal cliente con `neofetch` a la izquierda y la misma captura de la instancia a la derecha):

1. **Conexión SSH Windows → Instancia 01** (siguiendo [geekland.eu](https://geekland.eu/instalar-cliente-servidor-ssh-en-windows/)): configurar el servidor SSH para arrancar al iniciar Windows, configurar el firewall (sin desactivarlo), cambiar el puerto por defecto del 22 al 2222 y comprobar la conexión con el nuevo puerto.
2. **X11 Forwarding con Xming** desde Windows a la Instancia 02, ejecutando una aplicación gráfica remota (por ejemplo, Gedit) y comprobando que se muestra correctamente.
3. **NoMachine** desde Elementary OS a la Instancia 01, accediendo al escritorio completo.
4. **Túnel SSH con PuTTY** desde Manjaro a la Instancia 02, redirigiendo el puerto local 3306 al puerto remoto 5252 donde corre MySQL; comprobar el túnel con un `INSERT` en una tabla de usuarios.
5. **RustDesk** desde Ubuntu Desktop a la Instancia 02; explicar instalación, configuración y ventajas frente a AnyDesk o TeamViewer.
6. **Guacamole** desde un móvil (real o emulado) a una de las instancias, ejecutando `neofetch` en el dispositivo.
7. **WireGuard en un contenedor de Proxmox:**
   1. Crear un contenedor LXC con WireGuard, configurando la VPN para dos clientes.
   2. Conectar un cliente WireGuard en un dispositivo móvil (Android/iOS), importando la configuración por QR o archivo `.conf`; capturar el estado del túnel y las IPs asignadas.
   3. Conectar un cliente Ubuntu Desktop (modo NAT), verificando la conectividad con `wg show` y pruebas de tráfico.
   4. Instalar **WireGuard-UI** en el contenedor (vía SSH/consola desde Ubuntu Desktop), crear un nuevo usuario desde la interfaz web y generar una configuración de cliente.
8. En un **Windows Server** controlador de dominio (mismas capturas que en la presentación del tema):
   1. Generar con **MDT** un entorno de arranque previo para una imagen cliente de Windows 11.
   2. Instalar y configurar **WDS** con las imágenes de arranque del punto anterior (Lite Touch de MDT).
   3. Instalar y configurar **WSUS**, almacenando las actualizaciones en un disco diferente al del sistema (mostrar sincronización correcta).
   4. Instalar y configurar **RDS** para acceder a **Visual Studio Code** vía **RemoteApp** desde el navegador.
9. Implementar **Windows 11** en una máquina virtual mediante los servicios WDS y MDT configurados, comprobando el funcionamiento de Visual Studio Code vía RemoteApp.
10. En un **Ubuntu Server** (100 GB de disco, IP `192.168.1xx.150`), instalar y configurar **FOG** ([fogproject.org](https://fogproject.org/)):
    1. Capturar una imagen del sistema Linux Mint.
    2. Ampliar el almacenamiento de imágenes en 100 GB más (total 200 GB), comprobando que los cambios permanecen tras reiniciar el servidor.
    3. Migrar la red de clase C privada a clase B privada (`172.16.0.0/16`), adaptando la configuración de FOG.
    4. Desplegar la imagen Linux Mint almacenada en FOG dentro de la nueva red B.

### Práctica 02 · SP 4.2 Administración remota II

**Proxmox:**

1. **WireGuard:**
   1. Crear un contenedor en Proxmox con WireGuard, configurando conexiones VPN para dos clientes.
   2. Conectar un dispositivo móvil (Android/iOS) a la VPN, con capturas del dispositivo conectado y el estado de las redes en WireGuard.
   3. Conectar un Ubuntu Desktop (NAT) al contenedor de Proxmox, con capturas de conexión y tráfico de red.
   4. Instalar **WireGuard-UI** en el contenedor (accediendo desde Ubuntu Desktop) y crear un nuevo usuario desde la interfaz.

**Windows Server 2022 con controlador de dominio** (mismas capturas mínimas que en la presentación del tema):

2. Generar con **MDT** un entorno de arranque previo para una imagen cliente de Windows 11, con capturas de todos los pasos y creación de carpetas.
3. Instalar y configurar **WDS** con las imágenes de arranque generadas.
4. Instalar y configurar **WSUS**, almacenando las actualizaciones en un disco distinto al del sistema (mostrar sincronización correcta).
5. Instalar y configurar **RDS** para acceder a Visual Studio Code vía RemoteApp desde el navegador.
6. En un equipo sin sistema operativo, implementar Windows 11 mediante WDS y MDT configurados en los puntos anteriores.

**GNU/Linux:**

7. En un Ubuntu Server (100 GB de disco, IP `192.168.1xx.150`), instalar y configurar **FOG** ([fogproject.org](https://fogproject.org/)) y capturar una imagen de un equipo con Linux Mint.
8. Ampliar el almacenamiento de imágenes en 100 GB más (total 200 GB en la interfaz web de FOG), explicando el proceso y comprobando que los cambios permanecen tras reiniciar el servidor.
9. Migrar la red de clase C privada a clase B privada (`172.16.0.0/16`), adaptando la configuración correspondiente.
10. Desplegar la imagen Linux Mint almacenada en FOG dentro de la nueva red de clase B, con capturas que lo confirmen.

### Recuperación

Recuperación UT04-RA04.

**Preguntas teóricas:**

1. ¿Qué son las consolas virtuales en Linux, cuál es su notación y cómo se accede a ellas?
2. ¿Cuáles son los requisitos para el correcto funcionamiento del servicio WDS?

**Preguntas prácticas:**

3. Preparar el **equipo remoto**: un Windows Server 2022 en otra red, con adaptador Red NAT e IP `172.16.31.5`, que actuará de servidor para los siguientes apartados.
4. Acceder al equipo remoto desde un Windows cliente por el **puerto 2323**, configurando el firewall de Windows en consecuencia.
5. Acceder al equipo remoto desde Ubuntu Desktop mediante **Remmina**, con explicación completa del proceso y configuraciones.
6. Acceder al equipo remoto desde Ubuntu Desktop mediante el aplicativo **VNC**.
7. Instalar y configurar el servicio **Windows Deployment Services**.
8. Añadir al servicio anterior una imagen de Windows 11 para su despliegue y comprobar que arranca en red desde la IP del servidor cargando la imagen (no es necesario instalar el cliente).
9. En un Ubuntu Server (100 GB de disco, IP `192.168.100.100`), instalar y configurar **FOG** ([fogproject.org](https://github.com/FOGProject/fogproject.git)).
10. Ampliar el almacenamiento de imágenes en 100 GB (total en torno a 200 GB en la interfaz web de FOG), explicando el proceso y comprobando que los cambios permanecen tras reiniciar el servidor.

### Solución

#### SP 4.0 Administración remota — DRBL y MDT

Pasos generales para proveer un **servidor DRBL (Diskless Remote Boot in Linux)** sobre Ubuntu Server:

**Requisitos previos:** servidor con Ubuntu Server instalado, conexión de red funcional y espacio de almacenamiento adecuado para las imágenes de disco.

1. Instalar Ubuntu Server (ISO oficial).
2. Actualizar el sistema:

   ```bash
   sudo apt update
   sudo apt upgrade
   ```

3. Instalar el paquete DRBL y configurar el servidor: el proceso de configuración incluye la instalación del software, la configuración del servidor y la configuración de DRBL propiamente dicha (DHCP, TFTP y NFS quedan gestionados por el paquete).
4. Realizar la prueba de arranque del cliente vía PXE, comprobando las opciones del menú de arranque.
5. Prueba de instalación con **Clonezilla** para la clonación/distribución de imágenes.

A continuación se repite el flujo completo de **MDT** descrito en la teoría: instalación de requisitos previos (ADK, WinPE Add-on), instalación de MDT, configuración de la Deployment Share y el Deployment Workbench, generación de la imagen WinPE, incorporación de una imagen de Windows, creación de la secuencia de tareas y comprobación final de la implementación en el equipo cliente, arrancando con la imagen `boot.wim` generada.

Tras MDT, se documenta igualmente la instalación y configuración de **WSUS** (rol, disco de almacenamiento de actualizaciones y sincronización), siguiendo los mismos pasos descritos en el apartado de teoría.

> Este documento de solución es mayoritariamente gráfico (capturas de pantalla paso a paso); consulta el material original del profesor para el detalle visual completo de cada fase.

#### WireGuard con Proxmox

Solución de referencia (guía gráfica) para el despliegue de WireGuard en un contenedor LXC de Proxmox: creación del contenedor, instalación y configuración de WireGuard para varios clientes, generación de la configuración para un cliente móvil (Android/iOS) y para un cliente Ubuntu Desktop en modo NAT, verificación del túnel con `wg show` y comprobación de tráfico, e instalación de **WireGuard-UI** para la gestión visual de usuarios y configuraciones desde el navegador.

> Documento de referencia principalmente gráfico; consulta el material original para el detalle de cada captura.

## Referencias

### Conexión SSH y túneles (RemoteApp y túnel SSH a MySQL)

Resumen de la solución de referencia sobre servicios de acceso y administración remota:

**RemoteApp sobre RDS:**

1. Instalar el rol de **Servicios de Escritorio Remoto** en el servidor (no es conveniente instalar el rol RDS en un equipo que actúa como controlador de dominio).
2. Asignar a los usuarios que vayan a usar RemoteApp permisos para iniciar sesión remota.
3. Una vez instalado RDS, acceder a la sección de RemoteApp (dentro de Servicios de Escritorio remoto) y agregar la aplicación deseada (por ejemplo, Notepad++) con las características requeridas.
4. Desde el equipo cliente, acceder por navegador a la web de RDS, autenticarse con las credenciales correspondientes.
5. Descargar y abrir el lanzador de la aplicación remota (puede volver a pedir credenciales, con opción de recordarlas). Tras autenticarse, la aplicación remota se abre en el escritorio local como si fuera nativa.

**Túnel SSH para acceder a MySQL remoto:**

1. En la máquina GNU/Linux, instalar el servidor SSH (`openssh`, mediante `apt install` o Synaptic) y el servidor de base de datos (`mysql-server`). No es necesario modificar la configuración de SSH por defecto.
2. Configurar MySQL: crear un usuario con permisos de acceso (dejando el resto de valores por defecto) y cambiar el puerto de escucha del servidor MySQL al **5252**.
3. En el equipo Windows, ejecutar **PuTTY** y configurar un **túnel SSH**, redirigiendo un puerto local (por ejemplo, 3306) hacia el puerto remoto 5252 donde escucha MySQL.
4. Establecer la conexión del túnel con el usuario indicado en el enunciado.
5. Abrir un cliente MySQL apuntando al puerto local del túnel y comprobar que la conexión llega correctamente al servidor GNU/Linux remoto (se puede verificar consultando la información del servidor, que mostrará un sistema distinto al local).

Este mecanismo de túnel SSH es el mismo principio aplicado en la Práctica 01 (apartado 4): redirigir un puerto local hacia un puerto remoto de un servicio que, de otro modo, no sería accesible directamente o no viaja cifrado (por ejemplo, bases de datos, POP, SMTP o HTTP sin TLS).
