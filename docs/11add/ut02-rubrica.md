# **📋 UT02 · Soluciones**

# 1.1
(Get-CimInstance Win32_StartupCommand | Measure-Object).Count; Get-CimInstance Win32_StartupCommand | Select-Object Name, Location

# 1.2
Get-Process | Sort-Object CPU -Descending | Select-Object -First 1 | Format-List *

# 1.3
Get-Process | Group-Object Name | Sort-Object Count -Descending | Select-Object -First 5 Name, Count

# 1.4
Get-Process chrome | Select-Object Id, @{n='Hilos';e={$_.Threads.Count}}; (Get-Process chrome | ForEach-Object {$_.Threads.Count} | Measure-Object -Sum).Sum

# 2.1
1..3 | ForEach-Object { Start-Process notepad }; Get-Process notepad | Select-Object Id, StartTime

# 2.2
$n = Get-Process notepad; $n[0].PriorityClass = 'High'; $n[1].PriorityClass = 'BelowNormal'; Get-Process notepad | Select-Object Id, PriorityClass

# 2.3
# listar
Get-Process | Sort-Object WorkingSet | Select-Object -First 10 Id, Name, WorkingSet
# eliminar
Get-Process | Sort-Object WorkingSet | Select-Object -First 10 | Sort-Object Id -Descending | Select-Object -First 1 | Stop-Process -Force
# listar
Get-Process | Sort-Object WorkingSet | Select-Object -First 10 Id, Name, WorkingSet
# volver a listar
Get-Process | Sort-Object WorkingSet | Select-Object -First 10 Id, Name, WorkingSet

# 2.4
tasklist /FI "IMAGENAME eq notepad.exe"
taskkill /F /T /IM notepad.exe
tasklist /FI "IMAGENAME eq notepad.exe"

# 3.1
(Get-Service | Where-Object {$_.DisplayName -like '*datos*' -and $_.Status -eq 'Running'}).Count; Get-Service | Where-Object {$_.DisplayName -like '*datos*' -and $_.Status -eq 'Running'}

# 3.2
Get-Service | Group-Object Status | Select-Object Name, Count

# 3.3
Get-Service | Where-Object {$_.StartType -eq 'Automatic' -and $_.Status -ne 'Running'} | Select-Object Name, DisplayName, Status

# 3.4
Get-Service Spooler | Select-Object -ExpandProperty DependentServices
Stop-Service Spooler -Force
Set-Service Spooler -StartupType Manual
Start-Service Spooler
Get-Service Spooler | Select-Object Name, Status, StartType


# 4.1
# PID: identificador único del proceso | PPID: PID de su proceso padre
ps a --no-headers | wc -l      # a: procesos de todos los usuarios con terminal
ps x --no-headers | wc -l      # x: procesos del usuario actual, con o sin terminal
ps -e --no-headers | wc -l     # -e: todos los procesos del sistema
ps -eo pid,ppid,stat,ni,cmd

# 4.2
pstree -p | grep -o 'firefox([0-9]*)' | head -1 | grep -o '[0-9]*'

# 4.3
PID=$(pstree -p | grep -o 'firefox([0-9]*)' | head -1 | grep -o '[0-9]*')
pstree -sp $PID | head -1 | sed "s/($PID).*//" | grep -oP '\(\K[0-9]+(?=\))'

# 4.4
pstree -pT $PID | grep -oP '\(\K[0-9]+(?=\))' | grep -vx $PID | sort -n
pstree -pT $PID | grep -oP '\(\K[0-9]+(?=\))' | grep -vx $PID | wc -l

# **📋 UT02 · Rúbrica de evaluación**
