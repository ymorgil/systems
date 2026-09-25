# PowerShell en Dominios (UT01)

!!! warning "Requisitos previos"
    - Trabajamos en el controlador de dominio `WSnombreDC` (ya promovido, apartado 2).
    - Abrimos **Windows PowerShell ISE** o **VS Code** *como administrador*.
    - El fichero se guarda con extensión **`.ps1`**, por ejemplo `nombre-menu-ad.ps1`.

> La clave pedagógica: **primero se prueba cada comando a mano en la consola**, y solo cuando funciona se pega dentro del menú.

## 1. PowerShell en 5 ideas

### Idea 1 · Los comandos
> *Verbo-Sustantivo*

```powershell
Get-Date          # Get = obtener
New-Item          # New = crear
Get-Help New-ADUser -Examples   # la ayuda con ejemplos: ¡el mejor amigo!
```

Si sabes el verbo (`Get`, `New`, `Set`, `Remove`, `Add`) y el objeto (`ADUser`, `ADGroup`...), ya sabes el comando.

### Idea 2 · Las variables 
>  Empiezan por `$`

```powershell
$nombre = "Ana"
Write-Host "Hola $nombre"     # Write-Host = mostrar por pantalla
```

### Idea 3 · Pedir datos 

```powershell
$ou = Read-Host "Nombre de la nueva OU"
```

Lo que escriba el usuario queda guardado en `$ou`.

### Idea 4 · Los parámetros
> Van con guion

```powershell
New-ADGroup -Name "asir2" -GroupScope Global
```

Cada `-Parametro valor` es como rellenar una casilla del asistente gráfico.

### Idea 5 · Contar resultados

```powershell
(Get-ADUser -Filter *).Count     # cuántos usuarios hay
```

Los paréntesis ejecutan primero el comando y `.Count` cuenta cuántos objetos devolvió.

!!! tip "Comentarios"
    Todo lo que va detrás de `#` es un comentario. El enunciado pide el **código comentado**, así que cada bloque debe llevar su explicación con `#`.

---

## 2. Los comandos

Primero cargamos el módulo (en el DC suele estar ya disponible):

```powershell
Import-Module ActiveDirectory
```

| Para qué | Comando | Ejemplo |
|---|---|---|
| Nombre del equipo | `$env:COMPUTERNAME` | `$env:COMPUTERNAME` |
| Datos del dominio | `Get-ADDomain` | `(Get-ADDomain).DNSRoot` → `nombre.aws` |
| Listar OUs | `Get-ADOrganizationalUnit` | `Get-ADOrganizationalUnit -Filter *` |
| Listar grupos | `Get-ADGroup` | `Get-ADGroup -Filter *` |
| Listar usuarios | `Get-ADUser` | `Get-ADUser -Filter *` |
| Crear OU | `New-ADOrganizationalUnit` | `New-ADOrganizationalUnit -Name "Ventas"` |
| Crear grupo | `New-ADGroup` | `New-ADGroup -Name "G_Ventas" -GroupScope Global` |
| Crear usuario | `New-ADUser` | ver abajo |
| Meter usuario en grupo | `Add-ADGroupMember` | `Add-ADGroupMember -Identity "G_Ventas" -Members "ana"` |

### 2.1 La *ruta* (DN)

En AD cada objeto vive en una "dirección" escrita al revés, de lo concreto a lo general:

```text
OU=Ventas,DC=nombre,DC=aws
```

- `DC=nombre,DC=aws` → el dominio `nombre.aws`
- `OU=Ventas` → la unidad organizativa dentro del dominio

No hace falta escribir la parte del dominio a mano, PowerShell nos la da:

```powershell
$dominio = (Get-ADDomain).DistinguishedName   # DC=nombre,DC=aws
$ruta    = "OU=Ventas,$dominio"                # OU=Ventas,DC=nombre,DC=aws
```

Esa `$ruta` es la que usaremos con el parámetro **`-Path`** para decir *dónde* se crea un grupo o un usuario.

### 2.2 Crear un usuario 

```powershell
$clave = Read-Host "Contraseña inicial" -AsSecureString   # la pide oculta

New-ADUser -Name "Ana López" `
           -SamAccountName "alopez" `
           -UserPrincipalName "alopez@nombre.aws" `
           -Path "OU=Ventas,DC=nombre,DC=aws" `
           -AccountPassword $clave `
           -Enabled $true `
           -ChangePasswordAtLogon $true
```

| Parámetro | Significado |
|---|---|
| `-Name` | Nombre visible |
| `-SamAccountName` | Nombre de inicio de sesión |
| `-AccountPassword` | Contraseña (tiene que ser *SecureString*, por eso `-AsSecureString`) |
| `-Enabled $true` | Si no se pone, **la cuenta se crea deshabilitada** |
| `-ChangePasswordAtLogon $true` | Obliga a cambiar la contraseña en el primer inicio ✅ (lo pide el enunciado) |

!!! note "El acento grave `` ` ``"
    Sirve para partir una línea larga en varias. Debe ser **lo último** de la línea (sin espacios detrás).

!!! question "Actividad de 10 minutos"
    Antes de escribir el script, cada alumno/a ejecuta **a mano** en la consola: crear una OU de prueba, un grupo dentro de ella y un usuario metido en ese grupo. Comprueban en *Usuarios y equipos de Active Directory* que aparecen.

---

## 3. El esqueleto del menú

Un menú es siempre lo mismo: **mostrar opciones → leer la elección → hacer algo → repetir hasta "Salir"**.

```powershell
do {
    # 1) Mostrar el menú
    Write-Host "1. Información del dominio"
    Write-Host "2. Crear OU"
    Write-Host "3. Crear grupo"
    Write-Host "4. Crear usuario"
    Write-Host "5. Salir"

    # 2) Leer la opción
    $opcion = Read-Host "Elige una opción"

    # 3) Según la opción, hacer una cosa u otra
    switch ($opcion) {
        "1" { Write-Host "Aquí irá la información" }
        "2" { Write-Host "Aquí se creará la OU" }
        "3" { Write-Host "Aquí se creará el grupo" }
        "4" { Write-Host "Aquí se creará el usuario" }
        "5" { Write-Host "Adiós" }
        default { Write-Host "Opción no válida" }
    }

} while ($opcion -ne "5")    # 4) Repetir mientras la opción NO sea 5
```

Tres piezas nuevas, nada más:

| Pieza | Se lee como |
|---|---|
| `do { ... } while (condición)` | "Haz esto... y repítelo mientras se cumpla la condición" |
| `switch ($opcion) { "1" {...} }` | "Si la opción es 1, haz esto; si es 2, haz aquello..." |
| `-ne` | "no es igual" (*not equal*). También existen `-eq` (igual), `-gt` (mayor) |

!!! success "Punto de control"
    Ejecutad el esqueleto con **F5**. Si el menú aparece y se repite hasta pulsar 5, la parte "difícil" ya está hecha. Ahora solo hay que sustituir cada `Write-Host "Aquí..."` por los comandos del bloque 2.

---

## 4. Las opciones

### 1 · Información del dominio

Hay que mostrar **5 datos**. Cada uno sale de un comando de la tabla del bloque 2:

1. Nombre del equipo → `$env:COMPUTERNAME`
2. Nombre del dominio → `(Get-ADDomain).DNSRoot`
3. Nº de OUs → `(Get-ADOrganizationalUnit -Filter *).Count`
4. Nº de grupos → lo mismo con `Get-ADGroup`
5. Nº de usuarios → lo mismo con `Get-ADUser`

Se muestran con `Write-Host "Texto: $variable"` o directamente `Write-Host "Usuarios: $((Get-ADUser -Filter *).Count)"`.

!!! note ""
    El truco `$( ... )` dentro de unas comillas permite **meter un comando dentro de un texto**.

### 2 · Crear OU

1. Pedir el nombre con `Read-Host`.
2. Crear la OU con `New-ADOrganizationalUnit -Name $nombre`.
3. Mostrar un mensaje de confirmación.

### 3 · Crear grupo

1. Pedir el nombre del grupo **y** la OU donde irá.
2. Construir la ruta: `"OU=$ou,$dominio"` (bloque 2.1).
3. `New-ADGroup` con `-Name`, `-GroupScope Global` y `-Path`.

### 4 · Crear usuario (la más completa)

1. Pedir: nombre, apellido, nombre de inicio de sesión, OU, grupo y contraseña (`-AsSecureString`).
2. Crear el usuario con `New-ADUser` (bloque 2.2) **sin olvidar** `-Enabled $true` y `-ChangePasswordAtLogon $true`.
3. Meterlo en el grupo con `Add-ADGroupMember`.
4. Mensaje de confirmación.

### 5 · Salir

No hace nada: el `while` ya se encarga de terminar el bucle.

---

## 5. Errores

| Error / síntoma | Causa | Solución |
|---|---|---|
| *"la ejecución de scripts está deshabilitada"* | Política de ejecución | `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| *"New-ADUser no se reconoce"* | Módulo no cargado / no es el DC | `Import-Module ActiveDirectory` |
| *"Directory object not found"* | La ruta `-Path` está mal o la OU no existe | Revisar `OU=...,DC=...,DC=...` |
| *"The password does not meet the length, complexity..."* | Contraseña débil | Usar mayúscula, minúscula, número y 8+ caracteres |
| El usuario aparece con una flecha hacia abajo | Cuenta deshabilitada | Falta `-Enabled $true` |
| El menú no termina nunca | La condición del `while` compara con otro número | Revisar `while ($opcion -ne "5")` |

---

## 6. Qué hay que entregar

- [ ] El script **comentado** subido al repositorio de GitHub del módulo y su **enlace** en el PDF.
- [ ] Una **captura por cada opción** del menú funcionando.
- [ ] Una captura en *Usuarios y equipos de AD* donde se vean la OU, el grupo y el usuario creados.
- [ ] Comprobación del cambio de contraseña forzado (primer inicio de sesión o pestaña *Cuenta* del usuario).

