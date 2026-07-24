# 🛢️ Contenedores

## ¿Qué es un contenedor?
No todos los programas son compatibles con todos los sistemas operativos. Cada vez que un programa es compilado, se hace para un sistema determinado (Windows, Linux, Mac, etc.), lo que genera el clásico problema de **incompatibilidad de entornos**.

Para los desarrolladores esto supone un problema constante: en un equipo de trabajo con sistemas heterogéneos, cada uno necesita las mismas dependencias instaladas, con las mismas versiones, lo que desemboca en el conocido problema de **"en mi máquina funciona"**.

![terminal](../assets/img/03cont/con-01.png)

Un contenedor es una **unidad ligera y portátil** que permite empaquetar una aplicación junto con todas sus dependencias (bibliotecas, configuraciones y binarios) en un entorno aislado.

A diferencia de las máquinas virtuales, los contenedores **no incluyen un sistema operativo completo**: comparten el núcleo (kernel) del sistema operativo del anfitrión, lo que los hace más eficientes en consumo de recursos (memoria y CPU).

![terminal](../assets/img/03cont/con-02.png)

**BENEFICIOS DE LOS CONTENEDORES**

- **Portabilidad:** Al empaquetar la aplicación con todas sus dependencias, se elimina la posibilidad de problemas relacionados con configuraciones del SO, bibliotecas o versiones de software. Un contenedor funciona igual en local, en staging y en producción.
- **Eficiencia:** Comparten el núcleo del SO anfitrión en lugar de requerir un sistema operativo completo para cada instancia. El tiempo de arranque es casi instantáneo y el consumo de CPU/memoria/almacenamiento es mínimo comparado con las VMs.
- **Escalabilidad:** Ideales para arquitecturas de microservicios. Cada servicio se ejecuta en su propio contenedor y se puede escalar de forma independiente. Combinados con orquestadores como Kubernetes, permiten la gestión automatizada de la escalabilidad horizontal y vertical.

**BREVE HISTORIA**

| Año | Hito |
|---|---|
| ~1970s | `chroot` en UNIX: primer concepto de aislamiento de procesos |
| 2000s | FreeBSD Jails y tecnologías avanzadas en el kernel de Linux |
| 2013 | Nace **Docker**: democratiza los contenedores con herramientas fáciles de usar y Docker Hub |
| 2014 | Google lanza Kubernetes para orquestación de contenedores |
| 2020+ | Alternativas como **Podman** emergen: sin daemon, ejecución rootless |
| Actualidad | Componente esencial de la infraestructura moderna, microservicios y DevOps |
??? info "Contenedor vs. Máquina Virtual"
    | Característica | Contenedor | Máquina Virtual |
    |---|---|---|
    | Virtualización | Nivel de SO (kernel compartido) | Hardware completo |
    | SO propio | No (comparte el kernel) | Sí, uno por instancia |
    | Peso | Ligero (MB) | Pesado (GB) |
    | Tiempo de inicio | Casi instantáneo | Minutos |
    | Aislamiento | Proceso/aplicación | Sistema completo |
    | Eficiencia de recursos | Alta | Menor |

## ¿Qué es WSL?
**WSL (Windows Subsystem for Linux)** es una característica de Windows que permite ejecutar un entorno Linux real (no una simulación) directamente sobre Windows, sin necesidad de una máquina virtual ni de arranque dual. Gracias a WSL es posible usar herramientas de línea de comandos de Linux, ejecutar scripts Bash y trabajar con aplicaciones Linux integradas en el flujo de trabajo de Windows.

Con **WSL2** (la versión actual), no se trata de un simulador de comandos ni de una imitación de Linux. Por debajo corre un **kernel Linux auténtico**, integrado con Windows de forma muy eficiente. Cuando abres una terminal de Ubuntu en WSL, estás usando Linux real, no una versión "de mentira".

**DESTACAR**

1. **El software profesional serio vive en Linux**
Servidores web, bases de datos, contenedores, herramientas DevOps, entornos de programación en la nube... la inmensa mayoría de la infraestructura tecnológica actual corre sobre Linux. Si vais a trabajar en desarrollo, sistemas o redes, tarde o temprano usaréis Linux a diario.
2. **Podéis practicar sin dejar Windows**
WSL elimina la excusa de "no tengo Linux en casa". El PC que ya tenéis (con Windows 10/11) sirve para practicar Linux de verdad, sin instalar nada exótico ni arriesgar el sistema.
3. **Las herramientas modernas funcionan mejor en Linux**
Docker, Git, Python, Node.js, servidores web como Nginx o Apache... muchas de estas herramientas están pensadas originalmente para Linux y funcionan de forma más nativa, rápida y "de verdad" ahí que en Windows.
4. **Es el puente perfecto para aprender sin miedo**
Antes de dar el salto a un servidor Linux real en producción, WSL permite equivocarse, romper cosas y volver a empezar sin ningún riesgo, todo dentro del mismo portátil con el que ya trabajáis cada día.
5. **Es gratuito y viene integrado en Windows**
No hay que comprar licencias ni descargar imágenes de discos complicadas. Con un solo comando, tenéis un Linux funcional en minutos.

### Activación y puesta en marcha

**👉 Paso 1 — Activar características de Windows**

- Plataforma de máquina virtual
- Subsistema de Windows para Linux
  
![Activación de características de Windows](../assets/img/03cont/con-03.png)

**👉 Paso 2 — Instalación de WSL + Ubuntu 24.04**
 
Abrir **PowerShell** como administrador y ejecutar:
 
```powershell
winget install Microsoft.WSL    # Instalar WSL con winget
wsl --version                   # Comprobar la instalación
wsl --install -d Ubuntu-24.04   # Instalar Ubuntu 24.04
wsl --list --online             # Si no aparece, listar las disponibles
```
!!! note "Primera vez que arranque Ubuntu, el sistema solicitará, Usuario y contraseña para Administrador"

![Activación de características de Windows](../assets/img/03cont/con-05.png)

**👉 Paso 3 — Terminal de Windows**

La **Terminal de Windows** es una herramienta «todo en uno» disponible de forma gratuita en la Microsoft Store. Una vez instalada, basta con buscarla en el menú Inicio para ejecutarla.
 
Su principal ventaja es que permite abrir múltiples pestañas con diferentes entornos (PowerShell, CMD, Ubuntu...) en una sola ventana, con personalización completa de colores y fuentes.

![terminal](../assets/img/03cont/con-04.png)

!!! note "Una vez dentro de Ubuntu:  `sudo apt update && sudo apt upgrade -y && apt autoremove`"

??? abstract "Resumen"
    | Antes de WSL | Con WSL |
    |---|---|
    | Máquina virtual pesada y lenta | Integración ligera y rápida con Windows |
    | Instalar Linux aparte (dual boot) | Un solo comando, sin reiniciar |
    | Simulador de comandos | Kernel Linux real |
    | Cambiar de sistema operativo | Cambiar de ventana |



## 👉👉👉








## Docker
---
Docker es una plataforma de contenedores que permite empaquetar aplicaciones junto con todas sus dependencias en unidades aisladas y portables llamadas **contenedores**. A diferencia de las máquinas virtuales, los contenedores comparten el kernel del sistema operativo, lo que los hace mucho más ligeros y rápidos de arrancar.
 
### **Instalación de Docker Desktop e integración con WSL**
 
#### ``👉 Instalar Docker Desktop con winget``
 
```powershell
winget install Docker.DockerDesktop
```
 
#### ``👉 Configurar la integración con WSL``
 
1. Iniciar **Docker Desktop** desde el menú de inicio.
2. Esperar a que termine la configuración inicial.
3. Ir a: **Settings → Resources → WSL Integration**
4. Activar: **Ubuntu-24.04**
 
##### ``👉Comprobar Docker desde Ubuntu``
 
```bash
docker --version # Verificar la versión instalada
docker run hello-world # Ejecutar un contenedor de prueba
```
 
## Portainer
--- 
**Portainer** es una interfaz gráfica web para gestionar entornos Docker. Sustituye los comandos de terminal por un panel visual desde el que se pueden administrar contenedores, imágenes, redes y volúmenes de forma intuitiva. Es especialmente útil en entornos de desarrollo y aprendizaje, ya que permite ver el estado del sistema en tiempo real sin necesidad de recordar comandos.
 
### **Instalación**
 
La forma más sencilla de instalar Portainer en Docker Desktop es a través de las extensiones. Hay que abrir Docker Desktop, ir a la sección **Extensions** en el menú lateral izquierdo y buscar «Portainer» en el buscador. Al hacer clic en instalar, la aplicación descarga la imagen necesaria y configura el contenedor de gestión automáticamente.
 
Una vez instalado, aparecerá el icono de Portainer en la barra lateral. Al acceder por primera vez, el sistema solicitará crear una contraseña de administrador de al menos 12 caracteres. A continuación, hay que seleccionar el entorno **local** para conectar Portainer al motor de Docker del equipo.
 
### **Funcionalidades principales**
 
Portainer ofrece una interfaz muy intuitiva: desde el panel de control se puede monitorizar el consumo de CPU y RAM de cada contenedor, revisar los logs en tiempo real y acceder directamente a la consola de un servicio con un solo clic. También permite gestionar redes y volúmenes de forma visual, lo que resulta muy práctico frente a la interfaz más limitada de Docker Desktop.
 
Una de sus funciones más potentes son los **Stacks**, que permiten desplegar aplicaciones completas copiando y pegando el contenido de un archivo `docker-compose.yml` directamente en el navegador. Esto simplifica enormemente el despliegue de proyectos complejos sin necesidad de gestionar archivos locales de forma constante.








---
title: "Docker: VSC"
weight: 3
---
# Ejercicio: Programar en Contenedores Docker con VS Code

**🎬 Enlace al video original:** [https://youtu.be/9_WkqhLMUZA](https://youtu.be/9_WkqhLMUZA)

Este ejercicio te guiará a través de las tres formas de programar directamente dentro de contenedores Docker utilizando Visual Studio Code para aislar dependencias.

---

## Requisitos Previos

1. **Docker Desktop:** Instalado y en ejecución.
2. **Visual Studio Code:** Con las extensiones:
   - `Docker` (de Microsoft)
   - `Dev Containers` (de Microsoft)

---

## Paso 1: Configuración del Proyecto Base (FastAPI)

Crea una carpeta para tu proyecto y añade los siguientes archivos básicos:

### 1.1. `main.py`

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World desde Docker"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```

### 1.2. `requirements.txt`

```
fastapi
uvicorn
```

---

## Paso 2: Método Manual (Docker Puro)

Este método consiste en construir la imagen y correr el contenedor manualmente enlazando carpetas.

### 2.1. Crear el `Dockerfile`

```dockerfile
FROM python:3.11-slim
WORKDIR /code
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### 2.2. Construir la imagen

```powershell
docker build -t imagen-fastapi .
```

### 2.3. Ejecutar el contenedor con volumen (sincronización de código)

```powershell
# PowerShell (Windows)
docker run -d -p 8000:8000 -v ${PWD}:/code imagen-fastapi

# Linux / Mac
docker run -d -p 8000:8000 -v $(pwd):/code imagen-fastapi
```

> **Nota:** El flag `-v` monta tu carpeta local dentro del contenedor, por lo que cualquier cambio en el código se refleja en tiempo real sin reconstruir la imagen.

---

## Paso 3: Conexión mediante la Extensión "Dev Containers"

Este método permite usar todas las ayudas de VS Code (IntelliSense, autocompletado) directamente dentro del contenedor.

1. Con el contenedor del paso anterior en ejecución, haz clic en el botón **azul** (`><`) de la esquina inferior izquierda de VS Code.
2. Selecciona **"Attach to Running Container"**.
3. Elige el contenedor `imagen-fastapi` de la lista.
4. Se abrirá una nueva ventana de VS Code conectada al contenedor. Abre la carpeta `/code`.
5. **Tip:** Instala la extensión de Python *dentro del contenedor* para tener autocompletado y análisis de errores.

---

## Paso 4: Configuración de Ambiente Nativo (Dev Container Config)

Para proyectos nuevos donde quieres que VS Code configure todo el ambiente automáticamente.

1. Crea una carpeta vacía y ábrela en VS Code.
2. Presiona `Ctrl + Shift + P` y busca:
   ```
   Dev Containers: Add Dev Container Configuration File...
   ```
3. Selecciona **Python 3** (versión 3.11 o similar) de la lista de plantillas.
4. VS Code creará automáticamente una carpeta `.devcontainer/` con un archivo `devcontainer.json`.
5. Haz clic en el botón azul inferior (`><`) y selecciona **"Reopen in Container"**.
6. VS Code construirá la imagen y reabrirá el proyecto ya dentro del contenedor.

---

## Resumen de Comandos Útiles

| Comando | Descripción |
|---|---|
| `docker ps` | Ver contenedores activos |
| `docker stop <ID>` | Detener un contenedor |
| `docker rm <ID>` | Eliminar un contenedor |
| `docker images` | Ver imágenes creadas |
| `docker build -t <nombre> .` | Construir una imagen desde un Dockerfile |
| `docker run -d -p <host>:<cont> <imagen>` | Ejecutar un contenedor en segundo plano |

---

> Tutorial basado en el canal **Píldoras de Programación**.

































# Visual Studio Code usando WSL y Docker

Una vez instalado **WSL**, configurado **Ubuntu** y teniendo **Docker Desktop** integrado con **Visual Studio Code**, el siguiente paso es trabajar directamente desde el entorno Linux y comenzar a ejecutar contenedores.

Este documento describe cómo utilizar Visual Studio Code dentro de Ubuntu y cómo crear y ejecutar un contenedor sencillo con Python, que servirá como base para proyectos más complejos.

## Extensiones necesarias en Visual Studio Code para trabajar con Docker y WSL
Instalar [Visual Studio Code](https://code.visualstudio.com/). Se recomienda instalar las siguientes extensiones:
- Python
- Jupyter
- WSL (si usáis WSL2)
- GitHub Copilot

- **Remote - WSL**  
Permite abrir y trabajar en el entorno Linux (Ubuntu) desde Visual Studio Code utilizando WSL.

- **Docker**  
Permite crear, ejecutar y gestionar contenedores e imágenes Docker directamente desde Visual Studio Code.

- **Python**  
Proporciona soporte para desarrollar, ejecutar y depurar scripts Python dentro del editor.

- **Dev Containers**  
Permite abrir proyectos directamente dentro de contenedores Docker para trabajar en entornos aislados y reproducibles.

- **YAML**  
Facilita la edición y validación de archivos de configuración como `docker-compose.yml`.

- **GitHub Pull Requests and Issues**  
Permite gestionar repositorios, cambios y revisiones de código desde Visual Studio Code.

- **Markdown All in One**  
Mejora la edición de archivos Markdown con herramientas de formato, tablas y atajos de escritura.

## 1. Ejecutar Visual Studio Code en Ubuntu (WSL)

Trabajar desde Ubuntu dentro de WSL permite utilizar herramientas Linux
reales, gestionar dependencias de forma más sencilla y ejecutar
contenedores Docker en un entorno similar a producción.

## 1.1 Abrir Ubuntu (WSL)

``` bash
wsl
```

o bien:

``` bash
ubuntu
```

------------------------------------------------------------------------

## 1.2 Ir al directorio de trabajo

``` bash
cd ~
mkdir proyectos
cd proyectos
```

------------------------------------------------------------------------

## 1.3 Abrir Visual Studio Code desde Ubuntu

``` bash
code .
```

Esto:

-   Abre Visual Studio Code
-   Conecta automáticamente con WSL
-   Permite trabajar como si estuvieras en Linux real

------------------------------------------------------------------------

## 1.4 Comprobar que Docker funciona

``` bash
docker --version
docker run hello-world
```

------------------------------------------------------------------------

## 2. Uso de contenedores Docker desde Visual Studio Code

Los contenedores permiten ejecutar aplicaciones en entornos aislados,
reproducibles y portables.

------------------------------------------------------------------------

## 2.1 Crear un proyecto Python

``` bash
mkdir python-docker
cd python-docker
```

------------------------------------------------------------------------

## 2.2 Crear un script Python

Archivo:

``` bash
nano app.py
```

Contenido:

``` python
print("Hola desde un contenedor Docker con Python")
```

------------------------------------------------------------------------

## 2.3 Crear un Dockerfile

Archivo:

``` bash
nano Dockerfile
```

Contenido:

``` dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY app.py .

CMD ["python", "app.py"]
```

------------------------------------------------------------------------

## 2.4 Construir la imagen

``` bash
docker build -t mi-python .
```

------------------------------------------------------------------------

## 2.5 Ejecutar el contenedor

``` bash
docker run mi-python
```

Salida esperada:

    Hola desde un contenedor Docker con Python

------------------------------------------------------------------------

## Resumen

Se ha aprendido a:

-   Ejecutar VS Code en Ubuntu
-   Crear un script Python
-   Crear un Dockerfile
-   Construir una imagen
-   Ejecutar un contenedor


---
title: "Docker: VSC"
weight: 3
---
# Ejercicio: Programar en Contenedores Docker con VS Code

**🎬 Enlace al video original:** [https://youtu.be/9_WkqhLMUZA](https://youtu.be/9_WkqhLMUZA)

Este ejercicio te guiará a través de las tres formas de programar directamente dentro de contenedores Docker utilizando Visual Studio Code para aislar dependencias.

---

## Requisitos Previos

1. **Docker Desktop:** Instalado y en ejecución.
2. **Visual Studio Code:** Con las extensiones:
   - `Docker` (de Microsoft)
   - `Dev Containers` (de Microsoft)

---

## Paso 1: Configuración del Proyecto Base (FastAPI)

Crea una carpeta para tu proyecto y añade los siguientes archivos básicos:

### 1.1. `main.py`

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World desde Docker"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```

### 1.2. `requirements.txt`

```
fastapi
uvicorn
```

---

## Paso 2: Método Manual (Docker Puro)

Este método consiste en construir la imagen y correr el contenedor manualmente enlazando carpetas.

### 2.1. Crear el `Dockerfile`

```dockerfile
FROM python:3.11-slim
WORKDIR /code
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### 2.2. Construir la imagen

```powershell
docker build -t imagen-fastapi .
```

### 2.3. Ejecutar el contenedor con volumen (sincronización de código)

```powershell
# PowerShell (Windows)
docker run -d -p 8000:8000 -v ${PWD}:/code imagen-fastapi

# Linux / Mac
docker run -d -p 8000:8000 -v $(pwd):/code imagen-fastapi
```

> **Nota:** El flag `-v` monta tu carpeta local dentro del contenedor, por lo que cualquier cambio en el código se refleja en tiempo real sin reconstruir la imagen.

---

## Paso 3: Conexión mediante la Extensión "Dev Containers"

Este método permite usar todas las ayudas de VS Code (IntelliSense, autocompletado) directamente dentro del contenedor.

1. Con el contenedor del paso anterior en ejecución, haz clic en el botón **azul** (`><`) de la esquina inferior izquierda de VS Code.
2. Selecciona **"Attach to Running Container"**.
3. Elige el contenedor `imagen-fastapi` de la lista.
4. Se abrirá una nueva ventana de VS Code conectada al contenedor. Abre la carpeta `/code`.
5. **Tip:** Instala la extensión de Python *dentro del contenedor* para tener autocompletado y análisis de errores.

---

## Paso 4: Configuración de Ambiente Nativo (Dev Container Config)

Para proyectos nuevos donde quieres que VS Code configure todo el ambiente automáticamente.

1. Crea una carpeta vacía y ábrela en VS Code.
2. Presiona `Ctrl + Shift + P` y busca:
   ```
   Dev Containers: Add Dev Container Configuration File...
   ```
3. Selecciona **Python 3** (versión 3.11 o similar) de la lista de plantillas.
4. VS Code creará automáticamente una carpeta `.devcontainer/` con un archivo `devcontainer.json`.
5. Haz clic en el botón azul inferior (`><`) y selecciona **"Reopen in Container"**.
6. VS Code construirá la imagen y reabrirá el proyecto ya dentro del contenedor.

---

## Resumen de Comandos Útiles

| Comando | Descripción |
|---|---|
| `docker ps` | Ver contenedores activos |
| `docker stop <ID>` | Detener un contenedor |
| `docker rm <ID>` | Eliminar un contenedor |
| `docker images` | Ver imágenes creadas |
| `docker build -t <nombre> .` | Construir una imagen desde un Dockerfile |
| `docker run -d -p <host>:<cont> <imagen>` | Ejecutar un contenedor en segundo plano |

---

> Tutorial basado en el canal **Píldoras de Programación**.

































# Visual Studio Code usando WSL y Docker

Una vez instalado **WSL**, configurado **Ubuntu** y teniendo **Docker Desktop** integrado con **Visual Studio Code**, el siguiente paso es trabajar directamente desde el entorno Linux y comenzar a ejecutar contenedores.

Este documento describe cómo utilizar Visual Studio Code dentro de Ubuntu y cómo crear y ejecutar un contenedor sencillo con Python, que servirá como base para proyectos más complejos.

## Extensiones necesarias en Visual Studio Code para trabajar con Docker y WSL
Instalar [Visual Studio Code](https://code.visualstudio.com/). Se recomienda instalar las siguientes extensiones:
- Python
- Jupyter
- WSL (si usáis WSL2)
- GitHub Copilot

- **Remote - WSL**  
Permite abrir y trabajar en el entorno Linux (Ubuntu) desde Visual Studio Code utilizando WSL.

- **Docker**  
Permite crear, ejecutar y gestionar contenedores e imágenes Docker directamente desde Visual Studio Code.

- **Python**  
Proporciona soporte para desarrollar, ejecutar y depurar scripts Python dentro del editor.

- **Dev Containers**  
Permite abrir proyectos directamente dentro de contenedores Docker para trabajar en entornos aislados y reproducibles.

- **YAML**  
Facilita la edición y validación de archivos de configuración como `docker-compose.yml`.

- **GitHub Pull Requests and Issues**  
Permite gestionar repositorios, cambios y revisiones de código desde Visual Studio Code.

- **Markdown All in One**  
Mejora la edición de archivos Markdown con herramientas de formato, tablas y atajos de escritura.

# 1. Ejecutar Visual Studio Code en Ubuntu (WSL)

Trabajar desde Ubuntu dentro de WSL permite utilizar herramientas Linux
reales, gestionar dependencias de forma más sencilla y ejecutar
contenedores Docker en un entorno similar a producción.

## 1.1 Abrir Ubuntu (WSL)

``` bash
wsl
```

o bien:

``` bash
ubuntu
```

------------------------------------------------------------------------

## 1.2 Ir al directorio de trabajo

``` bash
cd ~
mkdir proyectos
cd proyectos
```

------------------------------------------------------------------------

## 1.3 Abrir Visual Studio Code desde Ubuntu

``` bash
code .
```

Esto:

-   Abre Visual Studio Code
-   Conecta automáticamente con WSL
-   Permite trabajar como si estuvieras en Linux real

------------------------------------------------------------------------

## 1.4 Comprobar que Docker funciona

``` bash
docker --version
docker run hello-world
```

------------------------------------------------------------------------

# 2. Uso de contenedores Docker desde Visual Studio Code

Los contenedores permiten ejecutar aplicaciones en entornos aislados,
reproducibles y portables.

------------------------------------------------------------------------

## 2.1 Crear un proyecto Python

``` bash
mkdir python-docker
cd python-docker
```

------------------------------------------------------------------------

## 2.2 Crear un script Python

Archivo:

``` bash
nano app.py
```

Contenido:

``` python
print("Hola desde un contenedor Docker con Python")
```

------------------------------------------------------------------------

## 2.3 Crear un Dockerfile

Archivo:

``` bash
nano Dockerfile
```

Contenido:

``` dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY app.py .

CMD ["python", "app.py"]
```

------------------------------------------------------------------------

## 2.4 Construir la imagen

``` bash
docker build -t mi-python .
```

------------------------------------------------------------------------

## 2.5 Ejecutar el contenedor

``` bash
docker run mi-python
```

Salida esperada:

    Hola desde un contenedor Docker con Python

------------------------------------------------------------------------

# Resumen

Se ha aprendido a:

-   Ejecutar VS Code en Ubuntu
-   Crear un script Python
-   Crear un Dockerfile
-   Construir una imagen
-   Ejecutar un contenedor
