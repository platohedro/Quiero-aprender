# Yo Quiero Aprender — Prototipo interactivo

Sitio web para navegar las experiencias creadas por niñas y niños del proyecto Matinée (Platohedro).  
En esta iteración se dio énfasis al **juego de autocuidado**, a una **galería 3D de personajes**, y a la integración estética tipo “sticker” con los logos institucionales.

## ⚙️ Stack
- [Next.js 14](https://nextjs.org/) con App Router.
- [TypeScript](https://www.typescriptlang.org/).
- [Tailwind CSS](https://tailwindcss.com/) + estilos personalizados.
- React Three Fiber (`@react-three/fiber` + `@react-three/drei`) para escenas 3D.

## 📁 Estructura principal
```
app/
  layout.tsx
  page.tsx
components/
  Acuarela.tsx
  GaleriaPersonajes.tsx
  SemillasSonoras.tsx
  mesa/
    AutoCuidadoBoard.tsx
slot/
  Lever.tsx
  Reel.tsx
  Slot777Vertical.tsx
public/
  LOGO_PP.png
  logo TDH.png
  logoALCALDIA.png
styles/
  globals.css
tailwind.config.ts
postcss.config.js
next.config.mjs
tsconfig.json
package.json
```

## 🧩 Experiencias incluidas

| Experiencia | Archivo principal | Detalles |
|-------------|------------------|----------|
| 🌱 **Mi primera semilla sonora** | `components/SemillasSonoras.tsx` | Web Audio API, notas interactuando con semillas. |
| 🎨 **Pintura en acuarela** | `components/Acuarela.tsx` | Canvas 2D; mezcla de colores, opacidad y guardado en PNG. |
| 🖼️ **Galería de personajes 3D** | `components/GaleriaPersonajes.tsx` + `components/galeria/AtrilScene.tsx` | Atril modelado en 3D, personajes en FBX, cámara adaptativa. |
| 🧪 **Laboratorio de lava** | `components/LavaLampLab.tsx` + `components/lava/LavaShaderPanel.tsx` | Simulación interactiva tipo lámpara de lava con shaders personalizados y pasos guiados. |
| 🎲 **Juego de autocuidado** | `components/mesa/AutoCuidadoBoard.tsx` | Tablero rectangular de 45 casillas, tarjetas de consejos y preguntas con lógica basada en el último lanzamiento. |
| 🎰 **Animalario / Slot** | `components/slot/Slot777Vertical.tsx` | Tragamonedas vertical para crear criaturas combinando partes. |

## 🎨 Estilo visual
- Tipografías: **Space Grotesk** (display) e **Inter** (cuerpo).
- Estética “sticker” con sombras offset en colores pastel: `#80C1DD`, `#F2AADC`, `#DCF2AA`, `#C0AAF2`.
- Menú superior compacto con botón “Capítulos” desplegable.
- Logos oficiales:
  - `LOGO_PP.png` en la cabecera (Presupuesto Participativo).
  - `logo TDH.png` y `logoALCALDIA.png` en el footer.

## ▶️ Ejecución
```bash
npm install
npm run dev
# luego visita http://localhost:3000
```

## 🔧 Consideraciones técnicas
- Componentes cliente (`"use client"`) para interacciones, audio, canvas y R3F.
- Tailwind extendido con utilidades personalizadas (`sticker-card`, `sticker-button`).
- El tablero de autocuidado usa animaciones controladas con `useState` y `requestAnimationFrame` para simular el dado.
- Galería 3D: cálculo automático de encuadre según alturas de modelos, luces configuradas y OrbitControls personalizados.

## 🤝 Créditos y enlaces útiles
- Proyecto desarrollado junto a **Platohedro** y financiado por Presupuesto Participativo.
- Recursos de diseño (logos) ubicados en `public/`.
- Contacto: hola@platohedro.org.

---
¡Disfruta explorando y adaptando el prototipo! Si sumas nuevas experiencias o ajustes estéticos, documenta los cambios aquí.
