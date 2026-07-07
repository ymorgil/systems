# **🪪 UT05 · Práctica: reto de identidad digital, certificados y firma electrónica**

## Objetivo

Resolver, en grupos de 2-3 personas, un caso de consultoría real (aunque ficticio): un cliente —particular, autónomo o pyme— necesita realizar sus trámites administrativos y comerciales de forma 100% digital, segura y con validez legal, sin desplazarse nunca a una oficina. La práctica desarrolla la **gran idea** de que la identidad digital y la firma electrónica son la base de la confianza en la administración electrónica y en el comercio digital, y da respuesta razonada a la **pregunta esencial**: ¿cómo puede una persona o una pequeña empresa realizar todos sus trámites de forma completamente digital, eligiendo en cada caso el mecanismo de identificación adecuado, obteniéndolo, instalándolo correctamente y firmando documentos con la misma validez legal que una firma manuscrita?

La práctica se estructura en **10 apartados obligatorios**, que recogen de forma fiel los contenidos trabajados en el temario de esta unidad (RA5): DNI electrónico, certificados digitales de la FNMT, sistema Cl@ve en sus cuatro modalidades, instalación de certificados en el navegador, acceso a sedes electrónicas y firma digital de documentos con Autofirma.

## Materiales

- Acceso a internet y a la [sede electrónica de la FNMT](https://www.sede.fnmt.gob.es/).
- Navegador **Chrome** o **Firefox**, con acceso a su almacén de certificados.
- La aplicación oficial **[Autofirma](https://firmaelectronica.gob.es/)** instalada en el equipo de trabajo.
- Un documento PDF de ejemplo, sin datos personales reales ni sensibles, para la firma de prueba.
- Opcionalmente, un **DNIe** y un lector de tarjetas (o un móvil con NFC compatible), si algún miembro del grupo dispone de él y da su consentimiento para usarlo con datos ocultos en las capturas.

## Estructura obligatoria de la práctica

### 1. Elección y ficha del perfil de cliente

Constituir el grupo (2-3 personas) y elegir uno de los tres perfiles de cliente ficticio: **particular** (trámites puntuales: renta, cita previa, Seguridad Social, DGT), **autónomo** (presentación de impuestos, facturación electrónica, firma frecuente de documentos) o **pyme** (representación legal ante la Administración, gestión de varios empleados y, opcionalmente, sede electrónica propia). Redactar una breve ficha de cliente (2-3 líneas) que describa de forma concreta qué trámites necesita resolver, con qué frecuencia y con qué urgencia.

### 2. Comparativa razonada de mecanismos de identificación electrónica

Analizar el **DNIe**, el **certificado digital FNMT**, **Cl@ve Permanente**, **Cl@ve PIN**, **Cl@ve Móvil** y **Cl@ve Firma**, explicando para cada uno cómo se obtiene, su coste, su validez temporal y su nivel de seguridad. Concluir con una recomendación clara y justificada: qué mecanismo se propone como principal y cuál como alternativa de respaldo para el perfil de cliente elegido en el apartado 1.

### 3. Tipos de certificado digital y Autoridad de Certificación

Explicar el papel de la **FNMT** como Autoridad de Certificación de referencia en España y diferenciar los tres tipos principales de certificado digital: de **persona física**, de **persona jurídica** (representante) y de **servidor SSL/TLS**, indicando cuál correspondería al perfil de cliente elegido y por qué.

### 4. Simulación documentada de obtención de un certificado FNMT

Elegir, de forma coherente con el perfil de cliente, una de las cuatro vías oficiales de solicitud de certificado de la FNMT (videoidentificación, acreditación presencial con código de solicitud, mediante DNIe, o desde Cl@ve) y documentar el proceso paso a paso con capturas de pantalla propias, usando **datos ficticios o difuminados** en ningún caso datos personales reales ni sensibles.

### 5. Instalación del certificado en el almacén del navegador

Instalar un certificado de prueba (o el certificado de un miembro del grupo, con su consentimiento y ocultando los datos sensibles en las capturas) en el almacén de certificados de **Chrome** o **Firefox**, documentando el asistente de importación y la selección del almacén de destino.

### 6. Acceso a una sede electrónica real con certificado digital

Acceder a una sede electrónica real (por ejemplo, la de la Agencia Tributaria, la Seguridad Social o un ayuntamiento), seleccionando **"Certificado Digital"** como método de identificación y comprobando que el navegador reconoce y ofrece el certificado instalado en el apartado anterior.

### 7. Firma digital de un PDF con Autofirma y validación

Instalar **Autofirma**, firmar un documento PDF de ejemplo (sin datos sensibles de terceros) con el certificado disponible, y **validar** posteriormente la firma generada, bien reabriendo el documento y comprobando el panel de firmas del lector de PDF, bien utilizando el validador oficial de firma electrónica de la Administración.

### 8. Análisis de riesgos y medidas de mitigación

Identificar, para el perfil de cliente elegido, al menos los siguientes riesgos: pérdida o robo del certificado, caducidad no controlada, suplantación de identidad, phishing de sedes electrónicas falsas y uso de redes o equipos no seguros. Para cada riesgo, indicar su probabilidad en el caso concreto trabajado y una medida de mitigación específica.

### 9. Reflexión sobre validez legal e impacto profesional

Explicar, con argumentos propios, en qué se apoya la validez legal de la firma electrónica en España (Reglamento eIDAS y normativa nacional), qué diferencia hay entre firma simple, avanzada y cualificada, y responder de forma explícita a: en qué situaciones profesionales el grupo cree que le tocará resolver dudas sobre identidad digital y firma electrónica, y qué consejo daría a una persona de su entorno que aún no usa ningún mecanismo de identificación digital.

### 10. Documentación final y publicación en el taller de Moodle

Recopilar los apartados 1 a 9 en un único informe de consultoría dirigido al cliente ficticio (no un resumen de apuntes), y subirlo al **taller de Moodle (Workshop)** dentro del plazo fijado, para su posterior **evaluación entre iguales** antes de la calificación del profesorado.

## Entregables

1. Ficha de cliente y comparativa razonada de mecanismos de identificación (apartados 1-3).
2. Capturas propias, con datos ficticios o difuminados, del proceso de solicitud del certificado FNMT (apartado 4).
3. Evidencia de la instalación del certificado en el navegador y del acceso a una sede electrónica real (apartados 5-6).
4. PDF firmado con Autofirma y evidencia de la validación de la firma (apartado 7).
5. Tabla de análisis de riesgos con medidas de mitigación (apartado 8).
6. Reflexión final sobre validez legal e impacto profesional (apartado 9).
7. Informe único de consultoría, entregado en el taller de Moodle (apartado 10).

!!! warning "Ningún dato personal real ni clave privada en las capturas"
    En todas las capturas de pantalla de la práctica (solicitud del certificado, instalación en el navegador, acceso a la sede electrónica, firma con Autofirma) deben ocultarse o sustituirse por datos ficticios el DNI, el nombre completo, el correo electrónico y cualquier otro dato personal real. Bajo ningún concepto debe compartirse una clave privada, un PIN, ni el archivo `.p12`/`.pfx` de un certificado real. El profesorado supervisará este punto antes de autorizar la publicación en el taller de Moodle.
