# 🪐 Modelos de Colisión - Minijuego Canvas 2D

Un minijuego interactivo desarrollado con HTML5 Canvas y JavaScript puro (Vanilla JS). El proyecto simula físicas de rebote elástico y colisiones matemáticas entre múltiples círculos renderizados en tiempo real, combinando conceptos de geometría y cinemática con un diseño UI moderno.

## ✨ Características Principales

* **Físicas de Colisión:** Detección de colisiones precisas y rebotes elásticos basados en el cálculo de distancias euclidianas.
* **Interactividad y Partículas:** Al hacer clic sobre los círculos, estos explotan generando un sistema de partículas dinámico con desvanecimiento (fade-out).
* **Progresión de Niveles:** El juego cuenta con 5 niveles de dificultad. Al limpiar la pantalla, el nivel aumenta, incrementando la velocidad de los nuevos círculos.
* **Sistema de Puntuación:** Marcador en tiempo real que suma puntos por cada objetivo eliminado.
* **Diseño UI "Glassmorphism":** Interfaz de usuario elegante con menús superpuestos (Overlay) estilo cristal esmerilado, tanto para la pantalla de inicio como para la de victoria.
* **Totalmente Responsivo:** El canvas y la interfaz se adaptan proporcionalmente al tamaño de la ventana del navegador.

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica y API de Canvas (`<canvas>`).
* **CSS3:** Estilos personalizados, animaciones, variables y efecto *backdrop-filter* para el Glassmorphism.
* **Bootstrap 5:** Framework CSS para agilizar la maquetación de la barra de navegación y los modales superpuestos.
* **JavaScript (ES6):** Lógica orientada a objetos (Clases `Circle` y `Particle`), manejo del DOM, `requestAnimationFrame` y cálculos matemáticos.

## 📁 Estructura del Proyecto

```text
app-canvas-interct/
├── assets/
│   ├── css/
│   │   └── styles.css       # Estilos visuales y diseño Glassmorphism
│   ├── image/
│   │   ├── fondo.jpg        # Imagen de fondo de la aplicación
│   │   └── icon.png         # Favicon del sitio
│   └── js/
│       └── main.js          # Lógica principal, física y renderizado del Canvas
├── index.html               # Estructura principal de la aplicación
└── README.md                # Documentación del proyecto