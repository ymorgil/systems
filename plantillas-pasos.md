```bash
mkdocs serve          # probar en local
git add . && git commit -m "cambios"
git push              # guardar código fuente
mkdocs gh-deploy      # publicar cambios
```

Estructura recomendada para una web de clases
Una estructura clara desde el principio ahorra mucho tiempo después.
mi-web-clases/
├── mkdocs.yml              ← configuración principal
└── docs/
    ├── index.md            ← página de inicio
    ├── assets/
    │   ├── img/            ← todas las imágenes
    │   └── pdf/            ← todos los PDFs
    ├── asignatura-1/
    │   ├── index.md        ← intro de la asignatura
    │   ├── tema1.md
    │   ├── tema2.md
    │   └── ejercicios.md
    ├── asignatura-2/
    │   ├── index.md
    │   └── ...
    └── sobre-mi.md         ← página opcional "Sobre el profesor"


# Nivel 1

## **Nievel 2**
---

### **Nivel 3**

#### ``👉 Paso 1 — Nivel 4``

![imagen](../assets/img/cur/pau01.jpg)

[url](https://hub.docker.com/)