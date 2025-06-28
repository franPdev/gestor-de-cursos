# Gestor de Cursos

Aplicación web para administrar, visualizar y gestionar cursos de manera sencilla.

## Características

- Listado de cursos con detalles.
- Búsqueda y filtrado por nombre y categoría (incluye Frontend y Backend).
- Ordenar cursos por título o duración.
- Agregar, editar y eliminar cursos.
- Modal para ver detalles y editar/agregar cursos.
- Interfaz moderna con Bootstrap 5 y Bootstrap Icons.

## Tecnologías utilizadas

- HTML5
- CSS3 (con Bootstrap 5)
- JavaScript (ES6)
- Bootstrap Icons
- [JSON Server](https://www.npmjs.com/package/json-server) para simular una API REST (en desarrollo local)

## Instalación y uso

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/gestor-cursos.git
   cd gestor-cursos
   ```

2. **Instala dependencias y ejecuta JSON Server:**
   ```bash
   npm install -g json-server
   json-server --watch db.json --port 3000
   ```
   > Asegúrate de tener un archivo `db.json` con una colección `cursos`.

3. **Abre el archivo `public/index.html` en tu navegador.**

## Estructura del proyecto

```
crud-cursos/
│
├── public/
│   └── index.html
├── src/
│   └── main.js
├── css/
│   └── style.css
├── images/
│   └── (iconos y favicons)
├── db.json
└── README.md
```

## Personalización

- Puedes agregar más categorías editando el `<select id="filtrar-categoria">` en `index.html` y la función `getIconByCategoria` en `main.js`.
- Los textos y estilos pueden modificarse en `main.js` y `style.css`.

## Autor

Desarrollado por [franPdev](https://github.com/franPdev)

---

¡Gracias por usar Gestor de Cursos!