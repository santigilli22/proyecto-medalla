# Cervecería MEDALLA 🍺

![Medalla Logo](./public/logo_medalla.png)

Sitio web oficial de **Cervecería Medalla**, una fábrica de cerveza artesanal premium ubicada en Freyre, Córdoba. Este proyecto es una Single Page Application (SPA) moderna, rápida y responsiva diseñada para mostrar nuestras variedades, historia y puntos de venta.

## 🚀 Tecnologías

Este proyecto está construido con un stack moderno enfocado en performance y experiencia de usuario:

-   **[React](https://react.dev/)**: Biblioteca principal de UI.
-   **[Vite](https://vitejs.dev/)**: Build tool de próxima generación para un desarrollo ultra rápido.
-   **[Tailwind CSS](https://tailwindcss.com/)**: Framework de CSS utility-first para un diseño moderno y adaptable.
-   **[React Leaflet](https://react-leaflet.js.org/)**: Mapas interactivos para localizar puntos de venta.
-   **[Lucide React](https://lucide.dev/)**: Iconografía moderna y ligera.

## ✨ Características Principales

-   **Verificación de Edad**: Modal inicial para asegurar el cumplimiento legal (Age Gate).
-   **Catálogo Interactivo**: Carrusel dinámico con nuestras variedades (Golden, Honey, Red IPA, Rock IPA, Scottish, Stout).
-   **Localizador de Puntos de Venta**: Mapa integrado mostrando bares y comercios donde encontrar Medalla.
-   **Agenda de Eventos**: Sección para próximos eventos y festivales.
-   **Sección Educativa**: Información sobre el proceso de elaboración y alquiler de barriles.
-   **Diseño Responsive**: Totalmente optimizado para móviles, tablets y escritorio.
-   **Activos Optimizados**: Imágenes servidas en formatos modernos (WebP) organizadas eficientemente.

## 📂 Estructura del Proyecto

El proyecto sigue una estructura organizada:

```
medalla/
├── public/
│   └── assets/
│       └── img/
│           └── beers/      # Imágenes de productos organizadas por formato (webp, png)
├── src/
│   ├── components/         # Componentes reutilizables (Navbar, Hero, etc.)
│   ├── data/               # Datos estáticos (cervezas, eventos, puntos de venta)
│   ├── pages/              # Vistas principales (Home)
│   └── styles/             # Estilos globales e index.css
└── package.json            # Dependencias y scripts
```

## 🛠️ Instalación y Uso

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/santigilli22/proyecto-medalla.git
    cd proyecto-medalla
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Iniciar servidor de desarrollo**:
    ```bash
    npm run dev
    ```

4.  **Construir para producción**:
    ```bash
    npm run build
    ```

## 🚀 Despliegue

El proyecto está configurado para desplegarse automáticamente en **GitHub Pages**.

Para desplegar una nueva versión:

```bash
npm run deploy
```

Este comando ejecutará el build y subirá el contenido de la carpeta `dist` a la rama `gh-pages`.

## 📜 Licencia

Todos los derechos reservados © Cervecería Medalla.

---
*Developed by Santiago Gilli*
