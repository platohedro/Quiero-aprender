# Yo Quiero Aprender — Prototipo interactivo (Next.js + TypeScript + TailwindCSS)

Aplicación que integra varias experiencias creativas. Cada juego es un componente independiente.
Incluye **toda la estructura**: App Router, Tailwind, componentes y sesión extra de **Mesa (Autocuidado)**.

## 📁 Estructura
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
styles/
  globals.css
tailwind.config.ts
postcss.config.js
next.config.mjs
tsconfig.json
package.json
```

## 🧩 Sesiones / Juegos

### 🌱 Mi primera semilla (SemillasSonoras.tsx)
- **Tecnología**: Web Audio API (oscilador + envolvente).
- **Interacción**: click → reproduce tono por semilla.
- Reemplazable por audios .mp3/.wav en `public/` cuando quieras.

### 🎨 Pintura tipo acuarela (Acuarela.tsx)
- **Tecnología**: Canvas 2D API.
- **Controles**: color, tamaño, opacidad.
- **Funciones**: Limpiar lienzo y **Guardar PNG** (toBlob / toDataURL).

### 🎰 Tragamonedas vertical (slot/*)
- **Reels cuadrados** (por defecto `260px`).
- **Vertical**: CABEZA → CUERPO → PIES (arriba→abajo).
- **Palanca (Lever.tsx)**: pomo arriba, se **hala hacia abajo**; al terminar, **regresa sola**.
- **Estética**: tapiz de madera, bordes metálicos, marquesina.

### 🎲 Juego de mesa: Autocuidado (mesa/AutoCuidadoBoard.tsx)
- Tablero de 24 casillas con categorías: **ASEO**, **ALIMENTACIÓN**, **DESCANSO**, **EMOCIONES**, **MOVIMIENTO** y **ESPECIAL**.
- Al caer en una casilla, **robas una carta** de esa categoría (avanza/retrocede).  
- Caso especial ASEO: pregunta “¿Te bañaste hoy?” → **Sí +4 / No −2**.

### 🖼️ Galería de personajes (GaleriaPersonajes.tsx)
- Tarjetas mock; lista para conectar a imágenes reales de los niños.

## ▶️ Cómo ejecutar
```bash
npm install
npm run dev
# abrir http://localhost:3000
```

## 🔧 Notas técnicas
- App Router de Next.js (`app/`), componentes cliente con `"use client"` donde hay hooks/DOM.
- TailwindCSS habilitado (ver `tailwind.config.ts` y `styles/globals.css`).
- Tipado con TypeScript estricto.
