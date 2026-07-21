# 🖥️ Virtualización

La virtualización es una tecnología que permite ejecutar varios sistemas o entornos 
completamente aislados sobre una misma máquina física. En lugar de necesitar un 
ordenador diferente para cada sistema, el hardware se comparte de forma eficiente 
y segura entre múltiples entornos virtuales.

En esta sección veremos tres formas distintas de virtualizar, cada una pensada 
para un contexto diferente:

- **VirtualBox** es la opción más cercana y accesible. Se instala como un programa 
más en tu ordenador y te permite crear máquinas virtuales sin necesidad de 
hardware adicional ni configuraciones complejas. Es perfecta para aprender, 
hacer pruebas o montar un laboratorio en tu propio equipo sin miedo a 
"romper" nada.

- **VMware** es el gran competidor de VirtualBox en el terreno de la virtualización de escritorio. Ofrece un rendimiento algo más pulido y mejor soporte de gráficos 3D y snapshots, lo que lo hace muy popular tanto en entornos domésticos como profesionales. Su versión de pago (Workstation Pro) incluye funciones avanzadas de redes virtuales y clonación, mientras que existen versiones gratuitas (como VMware Workstation Player) más limitadas pero suficientes para empezar a practicar sin coste.

- **Proxmox VE** da un paso más allá. En lugar de instalarse dentro de un sistema 
operativo, se instala directamente sobre el hardware, lo que le da mucho más 
control y rendimiento. Es una plataforma profesional de código abierto muy 
utilizada en homelabs y empresas, que permite gestionar tanto máquinas virtuales 
como contenedores desde una cómoda interfaz web.

- **Amazon Web Services (AWS)** lleva la virtualización a la nube. En lugar de 
gestionar hardware propio, AWS pone a tu disposición una infraestructura global 
donde puedes crear y destruir servidores virtuales en segundos, almacenar datos, 
desplegar aplicaciones y mucho más, pagando solo por lo que utilizas. **EC2**, su 
servicio de máquinas virtuales, es el más conocido, pero AWS ofrece un ecosistema 
mucho más amplio que iremos explorando.

> **En definitiva: VirtualBox y VMware para aprender en local, Proxmox para montar tu propia 
infraestructura, y AWS cuando necesitas potencia, escala o acceso desde cualquier 
lugar del mundo.**

## Consejos de virtualización

> ✅ **Toma un snapshot antes de cualquier práctica destructiva**

> ✅ **Asigna solo los recursos que necesitas** — no pongas 8 GB de RAM a una VM si tu equipo solo tiene 8 GB en total

> ✅ **Apaga las VMs cuando no las uses** — consumen CPU y RAM incluso en reposo

> ✅ **Guarda las ISOs** en una carpeta organizada para reutilizarlas

> ✅ **Usa nombres descriptivos** para tus VMs: `Ubuntu-Server-Practica1` es mejor que `Nueva VM`

> ⚠️ **No suspendas el equipo host** con VMs encendidas sin pausarlas antes

> ⚠️ **No muevas o renombres los archivos `.vmdk`** fuera de la aplicación o la VM dejará de funcionar