# **📋 UT04 · Rúbrica de evaluación**

Rúbrica de comprobación de la práctica *Acceso remoto seguro entre sistemas heterogéneos con SSH y WireGuard*. Para cada uno de los 10 apartados obligatorios se comprueban **4 elementos**: cada elemento se marca como presente (Sí) o ausente (No). No hay términos medios: o la evidencia está en la entrega, o no lo está.

### Apartado 1 · Despliegue del escenario y plan de direccionamiento

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existen las dos máquinas base (Ubuntu Server y Windows Server) en la misma red | | |
| 2 | Se documentan las direcciones IP de cada equipo | | |
| 3 | Se indica el rol de cada máquina (SSH, RDP/WinRM, WireGuard) | | |
| 4 | Se identifica qué equipo actúa de cliente de escritorio para las pruebas cruzadas | | |

### Apartado 2 · Instalación y configuración de SSH con autenticación por clave

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se genera un par de claves y se copia la pública al servidor | | |
| 2 | La conexión funciona sin solicitar contraseña | | |
| 3 | Se cambia el puerto por defecto y se comprueba la conexión por el nuevo puerto | | |
| 4 | Se configuran `PermitRootLogin no`, `PasswordAuthentication no` y `AllowUsers` | | |

### Apartado 3 · Túnel SSH a un servicio no cifrado

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | MySQL escucha en el puerto 5252 con un usuario de prueba creado | | |
| 2 | Se configura el reenvío de puerto local 3306 → remoto 5252 | | |
| 3 | Se ejecuta un `INSERT` a través del túnel y se verifica en el servidor | | |
| 4 | Se explica por qué este mecanismo cifra un tráfico que por defecto no lo está | | |

### Apartado 4 · Configuración de WireGuard

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe una interfaz `wg0` con dirección y puerto UDP correctamente configurados | | |
| 2 | Se genera la configuración de al menos dos peers (móvil y escritorio) | | |
| 3 | El cliente móvil se conecta mediante configuración por QR | | |
| 4 | `wg show` confirma el estado y el tráfico de ambos peers | | |

### Apartado 5 · Interfaz de gestión de WireGuard

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | WireGuard-UI está instalado y accesible desde el navegador | | |
| 2 | Se crea un nuevo usuario/peer desde la interfaz web | | |
| 3 | Se genera y descarga la configuración de ese peer desde la UI | | |
| 4 | Se documenta el alta con capturas del proceso completo | | |

### Apartado 6 · Acceso remoto en Windows: RDP y WinRM

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | RDP está habilitado exigiendo autenticación a nivel de red (NLA) | | |
| 2 | Se conecta correctamente desde un cliente Windows y desde un cliente Linux | | |
| 3 | WinRM está habilitado y responde a `Invoke-Command` / `Enter-PSSession` | | |
| 4 | Se explica la diferencia entre RDP (con sesión) y WinRM (sin sesión) | | |

### Apartado 7 · Creación de cuentas de acceso remoto

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe una cuenta nominal específica en Linux, distinta de una cuenta genérica | | |
| 2 | Esa cuenta tiene su propio par de claves y está en `AllowUsers` | | |
| 3 | Existe una cuenta nominal específica en Windows, añadida solo al grupo necesario | | |
| 4 | Se comprueba que el acceso remoto funciona con esos permisos mínimos | | |

### Apartado 8 · Pruebas cruzadas entre sistemas heterogéneos

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se documenta la prueba Windows → Linux por SSH | | |
| 2 | Se documenta la prueba Linux → Windows por RDP o WinRM | | |
| 3 | Se documenta el acceso a través del túnel WireGuard | | |
| 4 | Se documenta el acceso desde el dispositivo móvil a través de la VPN | | |

### Apartado 9 · Cifrado y verificación de la información transferida

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Se indica el mecanismo de cifrado de cada servicio configurado | | |
| 2 | Se distingue el algoritmo de intercambio de claves del cifrado simétrico donde aplica | | |
| 3 | Se intenta o se realiza una captura de tráfico comparando cifrado/no cifrado | | |
| 4 | Las conclusiones sobre el cifrado están justificadas, no son una afirmación genérica | | |

### Apartado 10 · Documentación final del entorno administrado en remoto

| # | Elemento a comprobar | Sí | No |
|---|---|---|---|
| 1 | Existe una ficha por cada servicio desplegado (SSH, túnel, WireGuard, RDP, WinRM) | | |
| 2 | Cada ficha indica puerto, autenticación y cifrado | | |
| 3 | Cada ficha indica las cuentas autorizadas y las reglas de firewall aplicadas | | |
| 4 | La documentación permitiría reproducir el acceso sin preguntar nada más | | |

## Calificación

Cada elemento marcado "Sí" suma un punto (máximo 40 puntos). La calificación sobre 10 se obtiene dividiendo el total entre 4. Para superar la unidad es necesario alcanzar al menos 20 de los 40 elementos y tener, como mínimo, 2 de los 4 elementos marcados en cada uno de los 10 apartados (ningún apartado puede quedar completamente vacío).
