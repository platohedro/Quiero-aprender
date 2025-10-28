"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PALETTE } from "@/components/palette";

const ACUARELAS_GALERIA = [
  "/acuarelas/IMG_20251010_094306.jpg",
  "/acuarelas/IMG_20251010_094440.jpg",
  "/acuarelas/IMG_20251010_094620.jpg",
  "/acuarelas/IMG_20251010_094743.jpg",
  "/acuarelas/IMG_20251010_094953.jpg",
  "/acuarelas/IMG_20251010_095143.jpg",
  "/acuarelas/IMG_20251010_095312.jpg",
  "/acuarelas/IMG_20251010_095436.jpg",
  "/acuarelas/IMG_20251010_095537.jpg",
  "/acuarelas/IMG_20251010_100303.jpg",
  "/acuarelas/IMG_20251010_100507.jpg",
  "/acuarelas/IMG_20251010_101055.jpg",
  "/acuarelas/IMG_20251010_101954.jpg",
] as const;

export default function Acuarela() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const paperTextureRef = useRef<HTMLCanvasElement | null>(null);
  const [painting, setPainting] = useState(false);
  const [color, setColor] = useState<string>(PALETTE.sky);
  const [size, setSize] = useState(18);
  const [opacity, setOpacity] = useState(0.3);
  const [wetness, setWetness] = useState(0.8);
  const [flow, setFlow] = useState(0.9);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const velocity = useRef<number>(0);
  const [cursorStyle, setCursorStyle] = useState("");

  const createPaperTexture = (width: number, height: number) => {
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = width;
    textureCanvas.height = height;
    const ctx = textureCanvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#fdfdfd";
    ctx.fillRect(0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const grain = Math.random() * 14 - 7;
      data[i] = Math.max(0, Math.min(255, data[i] + grain));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
    }

    ctx.putImageData(imageData, 0, 0);
    return textureCanvas;
  };

  const createBrushCursor = () => {
    const brushWidth = Math.max(8, Math.min(size / 2, 20));
    const tipSize = Math.max(4, Math.min(size / 3, 12));
    const svg = `
      <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="8" width="4" height="20" fill="#8B4513" rx="2"/>
        <rect x="15" y="6" width="4" height="4" fill="#D2691E" rx="1"/>
        <rect x="14" y="26" width="6" height="6" fill="#C0C0C0" rx="1"/>
        <ellipse cx="17" cy="35" rx="${brushWidth / 2}" ry="8" fill="#4A4A4A" opacity="0.8"/>
        <ellipse cx="17" cy="40" rx="${tipSize / 2}" ry="4" fill="${color}" opacity="0.7"/>
        <circle cx="17" cy="42" r="${size / 4}" fill="none" stroke="${color}" stroke-width="1" opacity="0.3" stroke-dasharray="2,2"/>
        <circle cx="17" cy="42" r="1" fill="${color}" opacity="0.9"/>
      </svg>
    `;
    const encodedSvg = encodeURIComponent(svg);
    return `url("data:image/svg+xml,${encodedSvg}") 17 42, crosshair`;
  };

  useEffect(() => {
    setCursorStyle(createBrushCursor());
  }, [size, color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    canvas.width = Math.max(600, Math.floor(rect.width));
    canvas.height = 420;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paperTexture = createPaperTexture(canvas.width, canvas.height);
    if (paperTexture) {
      paperTextureRef.current = paperTexture;
      ctx.drawImage(paperTexture, 0, 0);
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setPainting(true);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPos.current = { x, y };
    velocity.current = 0;

    ctx.beginPath();
    draw(e);
  };

  const end = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setPainting(false);
    ctx.closePath();
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const drawWatercolorStroke = (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    pressure = 1,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rgb = hexToRgb(color);
    if (!rgb) return;

    const pigment = (alpha: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    const darkerPigment = (alpha: number) => {
      const darken = (channel: number) => Math.max(0, channel - 22);
      return `rgba(${darken(rgb.r)}, ${darken(rgb.g)}, ${darken(rgb.b)}, ${alpha})`;
    };

    const distance = Math.hypot(toX - fromX, toY - fromY);
    const steps = Math.max(1, Math.floor(distance / 2));
    const angle = Math.atan2(toY - fromY, toX - fromX);

    for (let step = 0; step <= steps; step++) {
      const t = step / steps;
      const x = fromX + (toX - fromX) * t;
      const y = fromY + (toY - fromY) * t;

      const strokeProgress = t;
      const easedPressure = pressure * (0.75 + Math.sin(strokeProgress * Math.PI) * 0.25);
      const currentWetness = wetness * (0.85 + Math.random() * 0.25);
      const currentFlow = flow * (0.9 + Math.random() * 0.15);
      const currentOpacity = opacity * (0.8 + currentFlow * 0.3);

      const baseSize = size * easedPressure;
      const elongated = baseSize * (0.55 + currentFlow * 0.9);
      const thickness = baseSize * (0.35 + (1 - currentWetness) * 0.45);

      const jitterStrength = 0.12 * currentWetness + 0.05 * (1 - currentFlow);
      const jitterX = (Math.random() - 0.5) * baseSize * jitterStrength;
      const jitterY = (Math.random() - 0.5) * baseSize * jitterStrength;

      ctx.save();
      ctx.translate(x + jitterX, y + jitterY);
      ctx.rotate(angle + (Math.random() - 0.5) * 0.15);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = currentOpacity * 0.55;

      const baseGradient = ctx.createRadialGradient(
        0,
        0,
        thickness * 0.2,
        0,
        0,
        Math.max(elongated, thickness),
      );
      baseGradient.addColorStop(0, pigment(0.25 * currentFlow));
      baseGradient.addColorStop(0.5, pigment(0.18 * currentFlow));
      baseGradient.addColorStop(1, pigment(0.42 * currentFlow));

      ctx.fillStyle = baseGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, elongated, thickness, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = currentOpacity * (0.35 + currentWetness * 0.4);
      ctx.lineWidth = Math.max(2, thickness * 0.65);

      ctx.strokeStyle = darkerPigment(0.6);
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        elongated * (0.9 + Math.random() * 0.15),
        thickness * (0.9 + Math.random() * 0.15),
        0,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.restore();

      if (currentWetness > 0.6 && Math.random() < 0.45) {
        const bloomRadius = baseSize * (0.35 + Math.random() * 0.4);
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.05 + currentWetness * 0.05;
        const bloom = ctx.createRadialGradient(x, y, bloomRadius * 0.1, x, y, bloomRadius);
        bloom.addColorStop(0, "rgba(255,255,255,0.5)");
        bloom.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(x, y, bloomRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (currentWetness > 0.55 && Math.random() < 0.5) {
        const bleedCount = 2 + Math.floor(currentWetness * 4);
        for (let i = 0; i < bleedCount; i++) {
          const bleedAngle = angle + (Math.random() - 0.5) * Math.PI * 0.8;
          const bleedDistance = elongated * (0.7 + Math.random() * 0.9);
          const bleedX = x + Math.cos(bleedAngle) * bleedDistance;
          const bleedY = y + Math.sin(bleedAngle) * bleedDistance;
          const bleedSize = thickness * (0.25 + Math.random() * 0.4);

          ctx.save();
          ctx.globalCompositeOperation = "multiply";
          ctx.globalAlpha = currentOpacity * 0.18;
          const bleedGradient = ctx.createRadialGradient(
            bleedX,
            bleedY,
            bleedSize * 0.2,
            bleedX,
            bleedY,
            bleedSize,
          );
          bleedGradient.addColorStop(0, pigment(0.4));
          bleedGradient.addColorStop(1, pigment(0));
          ctx.fillStyle = bleedGradient;
          ctx.beginPath();
          ctx.arc(bleedX, bleedY, bleedSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      const grainPoints = Math.floor(6 + currentWetness * 8);
      for (let g = 0; g < grainPoints; g++) {
        if (Math.random() > 0.3) continue;
        const grainAngle = Math.random() * Math.PI * 2;
        const grainRadius = Math.random() * baseSize * 0.45;
        const gx = x + Math.cos(grainAngle) * grainRadius;
        const gy = y + Math.sin(grainAngle) * grainRadius;
        const grainSize = 0.8 + Math.random() * 1.8;

        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        ctx.globalAlpha = currentOpacity * 0.25;
        ctx.fillStyle = darkerPigment(0.6);
        ctx.beginPath();
        ctx.arc(gx, gy, grainSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!painting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (lastPos.current) {
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      velocity.current = Math.hypot(dx, dy);
      const pressure = Math.min(1, Math.max(0.3, 1 - velocity.current / 15));
      drawWatercolorStroke(lastPos.current.x, lastPos.current.y, x, y, pressure);
    } else {
      drawWatercolorStroke(x, y, x, y, 1);
    }

    lastPos.current = { x, y };
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paperTexture =
      paperTextureRef.current ?? createPaperTexture(canvas.width, canvas.height);
    if (paperTexture) {
      paperTextureRef.current = paperTexture;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(paperTexture, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const savePNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.download = `matinee-acuarela-${Date.now()}.png`;
          a.href = url;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }, "image/png");
        return;
      }
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = `matinee-acuarela-${Date.now()}.png`;
      a.href = dataUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("savePNG error", err);
      const dataUrl = canvas.toDataURL("image/png");
      window.open(dataUrl, "_blank");
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `linear-gradient(160deg, rgba(128,193,221,0.25) 0%, rgba(192,170,242,0.32) 35%, rgba(242,170,220,0.32) 65%, rgba(29,27,41,0.85) 100%)`,
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-1/2 top-16 h-48 w-48 -translate-x-1/2 rounded-full bg-brand-sky/35 blur-[120px]" />
        <div className="absolute bottom-20 left-1/6 h-40 w-40 rounded-full bg-brand-lime/30 blur-3xl" />
        <div className="absolute top-1/3 right-10 h-32 w-32 rounded-full bg-brand-rose/35 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 h-48 w-48 rounded-full bg-brand-lavender/25 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center gap-12 px-6 py-16">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-brand-lavender/40 bg-brand-paper/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-ink/60">
            Sesión 3 · Acuarela
          </span>
          <h1 className="mt-4 text-4xl font-display font-bold text-brand-ink md:text-5xl">
            Pinta tu galaxia
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-brand-ink/70">
            Explora mezclas suaves, transparencias y veladuras mientras experimentas con un
            lienzo digital que imita la acuarela tradicional.
          </p>
        </div>

        <div className="w-full max-w-4xl rounded-3xl border border-brand-lavender/40 bg-brand-paper/90 p-6 shadow-[0_24px_55px_rgba(29,27,41,0.08)] md:p-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-brand-lavender/30 bg-brand-lavender/15 p-4">
              <label className="flex items-center gap-3 text-sm font-medium text-brand-ink">
                🎨 Color
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-brand-lavender/50 shadow-sm"
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-brand-ink">
                📏 Tamaño
                <input
                  type="range"
                  min={5}
                  max={80}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-24"
                  style={{ accentColor: PALETTE.lavender }}
                />
                <span className="w-10 rounded-lg bg-brand-paper px-2 py-1 text-center text-xs font-semibold text-brand-ink/70">
                  {size}
                </span>
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-brand-ink">
                💧 Opacidad
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-24"
                  style={{ accentColor: PALETTE.sky }}
                />
                <span className="w-14 rounded-lg bg-brand-paper px-2 py-1 text-center text-xs font-semibold text-brand-ink/70">
                  {opacity.toFixed(2)}
                </span>
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-brand-ink">
                🌊 Humedad
                <input
                  type="range"
                  min={0.4}
                  max={1}
                  step={0.05}
                  value={wetness}
                  onChange={(e) => setWetness(Number(e.target.value))}
                  className="w-24"
                  style={{ accentColor: PALETTE.lime }}
                />
                <span className="w-14 rounded-lg bg-brand-paper px-2 py-1 text-center text-xs font-semibold text-brand-ink/70">
                  {wetness.toFixed(2)}
                </span>
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-brand-ink">
                💨 Flujo
                <input
                  type="range"
                  min={0.5}
                  max={1}
                  step={0.05}
                  value={flow}
                  onChange={(e) => setFlow(Number(e.target.value))}
                  className="w-24"
                  style={{ accentColor: PALETTE.rose }}
                />
                <span className="w-14 rounded-lg bg-brand-paper px-2 py-1 text-center text-xs font-semibold text-brand-ink/70">
                  {flow.toFixed(2)}
                </span>
              </label>
              <div className="flex flex-1 justify-end gap-3">
                <button
                  onClick={clear}
                  className="rounded-full border border-brand-lavender/40 bg-brand-paper px-4 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-lavender/30"
                >
                  🗑️ Limpiar
                </button>
                <button
                  onClick={savePNG}
                  className="rounded-full border border-brand-sky/40 bg-brand-sky px-4 py-2 text-sm font-semibold text-brand-ink transition hover:border-brand-sky/60 hover:bg-brand-sky/90"
                >
                  💾 Guardar PNG
                </button>
              </div>
            </div>

            <div
              ref={containerRef}
              className="w-full overflow-hidden rounded-2xl border border-brand-lavender/40 bg-brand-paper"
            >
              <canvas
                ref={canvasRef}
                className="h-[420px] w-full touch-none"
                style={{ cursor: cursorStyle }}
                onPointerDown={start}
                onPointerMove={draw}
                onPointerUp={end}
                onPointerLeave={end}
                onPointerCancel={end}
              />
            </div>
          </div>
        </div>

        <section className="w-full max-w-5xl rounded-3xl border border-brand-lavender/35 bg-brand-paper/85 p-6 shadow-[0_20px_48px_rgba(29,27,41,0.08)] md:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-display font-semibold text-brand-ink">Galería de inspiración</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-brand-ink/70">
                Observa la manera en que la luz se mezcla con cada pigmento y experimenta nuevas
                combinaciones de color para tus propias piezas.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full border border-brand-lavender/30 bg-brand-lavender/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-ink/60">
              Referencias
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ACUARELAS_GALERIA.map((src, index) => (
              <figure
                key={src}
                className="group overflow-hidden rounded-2xl border border-brand-lavender/30 bg-brand-paper/90 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={src}
                    alt={`Referencia de acuarela ${index + 1}`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 28vw, (min-width: 768px) 45vw, 90vw"
                    priority={index < 2}
                  />
                </div>
                <figcaption className="border-t border-brand-lavender/30 bg-brand-paper/80 px-4 py-3 text-sm font-medium text-brand-ink/75">
                  {`Referencia de acuarela ${index + 1}`}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
