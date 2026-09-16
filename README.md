# Portafolio · Anderson AC

Portafolio personal de Anderson Arboleda Cano, desarrollador web enfocado en backend.
Construido con HTML, CSS y JavaScript puro (sin frameworks).

## Estructura

```
├── index.html          # Página única con todas las secciones
├── css/
│   ├── style.css       # Hoja de estilos (mobile-first, con tokens en :root)
│   └── img/            # Foto de perfil y capturas de proyectos
├── js/
│   ├── main.js         # Animaciones, menú móvil, proyectos, formulario
│   └── imagenes.json   # Datos de los proyectos
└── files/              # CV en PDF
```

## Ejecutar en local

Los proyectos se cargan con `fetch()` desde `js/imagenes.json`, por lo que la página
debe servirse por HTTP (no abrir el archivo directamente con doble clic).

Opciones:

- VS Code → extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*.
- Terminal: `python -m http.server 8000` y abrir `http://localhost:8000`.

## Agregar un proyecto

Edita `js/imagenes.json` y añade un objeto al arreglo `imagenes`:

```json
{
  "id": "3",
  "titulo": "Nombre del proyecto",
  "descripcion": "Qué hace y con qué lo construiste.",
  "imagen": "./css/img/captura.png",
  "tecnologias": ["Node.js", "Express", "MySQL"],
  "link": "https://mi-proyecto.vercel.app/",
  "linkVerCodigo": "https://github.com/usuario/repo"
}
```

La tarjeta se genera automáticamente con su imagen, etiquetas y botones.

## Personalizar colores

Todos los colores están definidos como variables en `:root` al inicio de `css/style.css`
(`--primary`, `--accent`, `--bg`, etc.). Cambiar una variable actualiza todo el sitio.
