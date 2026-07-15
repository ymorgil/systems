# **🧪 UT07 · Práctica: automatización de la administración de cuentas y servicios mediante scripts**

## Objetivo

Diseñar, depurar, adaptar y documentar un conjunto de guiones de administración de sistemas que resuelvan un mismo problema —alta y baja de usuarios, gestión de un servicio y automatización de una tarea repetitiva— primero en **Bash** y después en **PowerShell**, aplicando las técnicas de depuración vistas en el temario y reutilizando funciones a través de librerías propias. La práctica se estructura en **10 apartados obligatorios**, que cubren de forma conjunta los nueve criterios de evaluación del RA7.

## Materiales

- Una máquina virtual GNU/Linux (o WSL) con Bash y acceso de administración (`sudo`).
- Una máquina virtual Windows con PowerShell 5.1 o superior y, si es posible, un controlador de dominio con el módulo `ActiveDirectory` (puede sustituirse por `Microsoft.PowerShell.LocalAccounts` si no se dispone de dominio).
- Editor de texto con resaltado de sintaxis (VSCode recomendado) o PowerShell ISE.
- Un fichero de datos propio (mínimo 5 registros) con nombre, apellidos y login para las altas masivas.

## Estructura obligatoria de la práctica

### 1. Script de alta de usuarios en Bash

Escribe `altas.sh`, que reciba como parámetro un fichero de texto con un usuario por línea (`Nombre:Apellido1:Apellido2:login`) y dé de alta cada cuenta con `useradd`. Si el login ya existe, el script debe registrar el error en `altaerror.log` con fecha y hora, **sin detener** el procesamiento del resto del fichero.

### 2. Script de baja de usuarios en Bash

Escribe `bajas.sh`, que reciba un fichero con un login por línea y elimine cada cuenta con `userdel -r`. Si el login no existe en el sistema, debe registrarse en `bajaerror.log` sin detener la ejecución, siguiendo el mismo formato de log que en el apartado 1.

### 3. Depuración dirigida de los scripts de cuentas

Introduce deliberadamente **dos errores** en una copia de `altas.sh` (uno sintáctico: por ejemplo, un `fi` que falta; y uno de ejecución: por ejemplo, una variable sin comillas que rompe con nombres compuestos) y documenta, con capturas, cómo `bash -n` detecta el primero y `bash -x` permite localizar el segundo. Corrige ambos y añade `set -e` y `set -u` a la versión final.

### 4. Script equivalente de altas y bajas en PowerShell

Escribe `altas.ps1` y `bajas.ps1`, funcionalmente equivalentes a los apartados 1 y 2, que lean un CSV (`sAMAccountName`, nombre, apellidos, departamento) y usen `New-ADUser`/`Remove-ADUser` (o `New-LocalUser`/`Remove-LocalUser` si no hay dominio disponible). Los errores deben registrarse en un CSV de errores (`Export-Csv -Append`), no en un fichero de texto plano.

### 5. Depuración dirigida en PowerShell

Repite el ejercicio del apartado 3 pero en PowerShell: introduce un error en `altas.ps1`, colócale un punto de interrupción de línea en VSCode o en el ISE, ejecuta el script paso a paso y documenta con una captura el valor de una variable en el momento en que el script se detiene en el breakpoint.

### 6. Script de administración de un servicio (Bash)

Escribe `servicio.sh`, con las acciones `start`, `stop`, `restart` y `status` sobre un proceso o servicio a tu elección (puede ser un servicio real gestionado con `systemctl` o un daemon propio controlado por fichero PID, como el ejemplo `servicio-alerta.sh` del temario). El script debe mostrar ayuda al invocarse con `-h` o `--help`.

### 7. Script de administración de un servicio (PowerShell)

Escribe `servicio.ps1`, funcionalmente equivalente al apartado 6, que reciba la acción (`start`/`stop`/`restart`/`status`) y el nombre de un servicio de Windows como parámetros, y utilice `Get-Service`/`Start-Service`/`Stop-Service`/`Restart-Service`.

### 8. Extracción de una librería de funciones

A partir de los scripts anteriores, extrae a un fichero aparte al menos **dos funciones reutilizables** por lenguaje: en Bash, un fichero `funciones.sh` (por ejemplo, una función de validación de login y otra de registro en log) importado con `source`; en PowerShell, un módulo `Funciones.psm1` (por ejemplo, una función de validación de contraseña y otra de comprobación de existencia de usuario) importado con `Import-Module`. Reescribe los scripts de los apartados 1, 2, 6 y 7 para que usen estas funciones en lugar de repetir la lógica.

### 9. Automatización mediante planificación

Planifica la ejecución periódica de uno de los scripts de administración de servicios (apartado 6 o 7): en Bash, mediante una entrada de `crontab`; en PowerShell, mediante `Register-ScheduledTask` o el Programador de tareas gráfico. Documenta con una captura la tarea programada activa y explica, en un párrafo, qué problema resolvería en un entorno real (por ejemplo, comprobar cada 15 minutos que un servicio crítico sigue en ejecución y reiniciarlo si no lo está).

### 10. Documentación final e implantación cruzada

Redacta una cabecera de documentación (autor, propósito, sintaxis, códigos de retorno) y una función de ayuda (`-h`/`--help` en Bash, parámetro `-Help` o comentario de ayuda basado en comentarios `.SYNOPSIS` en PowerShell) para **todos** los scripts anteriores. Cierra la práctica con una tabla comparativa propia (mínimo 5 filas) que resuma qué comando o cmdlet de Bash equivale a cuál de PowerShell en cada una de las tareas resueltas, evidenciando el criterio de implantación en sistemas libres y propietarios.

## Entregables

1. Los seis scripts funcionales: `altas.sh`, `bajas.sh`, `servicio.sh`, `altas.ps1`, `bajas.ps1`, `servicio.ps1`, ya refactorizados para usar las librerías del apartado 8.
2. Las librerías `funciones.sh` y `Funciones.psm1`.
3. Capturas de los apartados 3, 5 y 9 (depuración sintáctica, depuración con breakpoint y tarea planificada activa).
4. Los ficheros de log/CSV de error generados durante las pruebas de los apartados 1, 2 y 4.
5. Documento breve (máximo 2 páginas) con la tabla comparativa Bash/PowerShell del apartado 10 y una reflexión personal sobre qué apartado ha costado más depurar y por qué.

!!! tip "Antes de entregar"
    Ejecuta `bash -n` sobre cada script de Bash y comprueba en PowerShell que no aparecen errores al cargar los módulos con `Import-Module -Verbose`. Un script que no se puede ni analizar sintácticamente invalida automáticamente el apartado correspondiente, con independencia de lo elaborada que sea el resto de la entrega.
