
## 🖥️ PowerShell

### ¿Qué es PowerShell?
PowerShell es un lenguaje de scripting y una interfaz de línea de comandos desarrollado por Microsoft. Se basa en .NET y permite automatizar tareas del sistema, administrar configuraciones y ejecutar comandos de manera eficiente.

### Sistemas operativos compatibles
PowerShell está disponible en:
- **Windows** (preinstalado desde Windows 7 y Server 2008 R2)
- **Linux** (mediante PowerShell Core)
- **macOS** (mediante PowerShell Core)

### Características principales
- **Basado en objetos**: A diferencia de otros intérpretes de comandos, PowerShell maneja objetos en lugar de texto.
- **Cmdlets**: Comandos especializados para realizar tareas específicas.
- **Automatización**: Permite la creación de scripts avanzados para gestionar sistemas y redes.
- **Integración con .NET**: Facilita la extensibilidad y el acceso a recursos del sistema.
- **Remoting**: Ejecuta comandos en máquinas remotas de manera segura.

---

## 5. Sintaxis Básica de PowerShell

### Variables
Las variables en PowerShell se definen con el prefijo `$`.
```powershell
$nombre = "Juan"
$edad = 30
Write-Output "Nombre: $nombre, Edad: $edad"
```

## Estructuras de Control

### Condicional `if-else`
```powershell
$numero = 10
if ($numero -gt 5) {
    Write-Output "El número es mayor que 5"
} else {
    Write-Output "El número es 5 o menor"
}
```

### Bucle `for`
```powershell
for ($i = 1; $i -le 5; $i++) {
    Write-Output "Iteración $i"
}
```

### Bucle `while`
```powershell
$contador = 1
while ($contador -le 3) {
    Write-Output "Contador: $contador"
    $contador++
}
```

## Funciones
Las funciones en PowerShell se definen con **function**.

```powershell
function Saludar {
    param([string]$nombre)
    Write-Output "Hola, $nombre!"
}
Saludar "Carlos"
```

---

## 6. Comandos Comunes de PowerShell

PowerShell es una potente herramienta de línea de comandos que permite administrar sistemas y automatizar tareas. A continuación, se presentan algunos de los comandos más utilizados en PowerShell junto con ejemplos prácticos de cómo se usan.

### **Get-Command**
El comando `Get-Command` se utiliza para obtener una lista de todos los cmdlets, funciones y alias disponibles en PowerShell.

### Ejemplo:
```powershell
Get-Command *proceso*
```

### **Set-Item**
El comando Set-Item se utiliza para cambiar el valor de un elemento, como un archivo, una carpeta o una variable.

```powershell
#Este comando cambiará el contenido de "archivo.txt" al texto "Nuevo contenido del archivo"
Set-Item -Path "C:\\Mis Archivos\\archivo.txt" -Value "Nuevo contenido del archivo"

#Este comando cambiará el valor de la variable $miVariable a "Nuevo valor"
$miVariable = "Valor inicial"
Set-Item -Path Variable:\\miVariable -Value "Nuevo valor"
```

### **Get-Help**
El comando Get-Help se utiliza para obtener información detallada sobre cualquier cmdlet, función o comando en PowerShell.

```powershell
Get-Help Get-Command    #Mostrará detalles de cómo usar el cmdlet Get-Command
Get-Help Get-Command -Examples    #Mostrará ejemplos de uso del cmdlet
```

### **Get-Item**
El comando Get-Item se utiliza para obtener información sobre un archivo, carpeta o registro.

```powershell
Get-Item -Path "C:\\Mis Archivos\\archivo.txt"
```

### **Set-Location**
El comando Set-Location se utiliza para cambiar el directorio actual.

```powershell
Set-Location -Path "C:\\Mis Archivos"
```

### **Get-Process**
El comando Get-Process se utiliza para obtener información sobre los procesos que se están ejecutando en el sistema.

```powershell
Get-Process    #General

Get-Process -Name "notepad"    #Un proceso específico
```

### **Stop-Process**
El comando Stop-Process se utiliza para detener un proceso en ejecución.

```powershell
Stop-Process -Name "notepad"
```

### **Get-Service**
El comando Get-Service se utiliza para obtener información sobre los servicios de Windows que están instalados en el sistema.

```powershell
Get-Service    #General

Get-Service -Name "wuauserv"    #Un servicio específico
```

### **Start-Service**
El comando Start-Service se utiliza para iniciar un servicio detenido.

```powershell
Start-Service -Name "wuauserv"
```

### **New-Item**
El comando New-Item se utiliza para crear nuevos archivos o carpetas.

```powershell
New-Item -Path "C:\\Mis Archivos" -Name "NuevoArchivo.txt" -ItemType "File"    #Archivo
New-Item -Path "C:\\Mis Archivos" -Name "NuevaCarpeta" -ItemType "Directory"    #Carpeta
```

---

## 7. Comparativa entre Bash y PowerShell
A continuación se muestra una breve comparación entre Bash y PowerShell, destacando las principales diferencias y similitudes.

| Característica                | **Bash**                                          | **PowerShell**                                    |
| ----------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| **Sistema operativo principal** | Principalmente Linux y macOS, pero también en Windows con WSL | Principalmente Windows, pero también disponible en Linux y macOS |
| **Paradigma de programación**  | Basado en comandos y scripts, estilo UNIX        | Basado en objetos y scripting, más orientado a .NET |
| **Sintaxis**                   | Simples comandos textuales y scripts de shell    | Sintaxis basada en cmdlets y objetos              |
| **Manipulación de texto**      | Manipulación de texto simple con herramientas como `awk`, `sed`, etc. | Manipulación de texto con objetos y cmdlets como `Select-String` |
| **Comandos**                   | Utiliza comandos tradicionales de Unix/Linux (ls, cat, grep, etc.) | Utiliza cmdlets, que son comandos estructurados como `Get-Command` |
| **Tipo de datos**              | Maneja cadenas y variables básicas               | Maneja objetos completos, incluidos tipos complejos como arrays y tablas |
| **Pipe (tuberías)**            | Los pipes pasan texto entre los comandos         | Los pipes pasan objetos entre cmdlets             |
| **Compatibilidad**             | Compatible con la mayoría de herramientas UNIX/Linux | Alta compatibilidad con el ecosistema de Windows y cmdlets .NET |
| **Redirección**                | Redirección de salida estándar con `>` y `>>`    | Redirección usando `Out-File`, `Out-String` y otros cmdlets |
| **Automatización de tareas**   | Utiliza scripts sencillos y herramientas externas para la automatización | Potente motor de scripting orientado a tareas de administración de sistemas |
| **Interactividad**             | Terminal de línea de comandos tradicional         | Consola interactiva con soporte para comandos y objetos |
| **Extensibilidad**             | Ampliable con scripts y herramientas de terceros | Extensible con módulos adicionales, soporte para extensiones en .NET |
| **Orientación**                | Orientado a tareas de administración y scripting en sistemas basados en UNIX | Orientado a la administración de sistemas, especialmente en entornos Windows |
| **Ejemplo de comando básico**  | `ls -l` para listar archivos en directorio       | `Get-ChildItem` para listar archivos en directorio |

### Conclusión
- **Bash** es más adecuado para tareas en sistemas Unix/Linux y aquellos que prefieren la simplicidad y la velocidad.
- **PowerShell** es más adecuado para usuarios de Windows o aquellos que trabajan en entornos de administración de sistemas complejos y necesitan trabajar con objetos y un ecosistema .NET.



### 📌 Recursos 
- [Bash Cheat Sheet – Devhints](https://devhints.io/bash)