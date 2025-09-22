"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Acuarela() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const paperTextureRef = useRef<HTMLCanvasElement | null>(null);
  const [painting, setPainting] = useState(false);
  const [color, setColor] = useState('#1d4ed8');
  const [size, setSize] = useState(18);
  const [opacity, setOpacity] = useState(0.3);
  const [wetness, setWetness] = useState(0.8);
  const [flow, setFlow] = useState(0.9);
  const lastPos = useRef<{x: number, y: number} | null>(null);
  const velocity = useRef<number>(0);
  const [cursorStyle, setCursorStyle] = useState('');

  // Crear textura de papel
  const createPaperTexture = (width: number, height: number) => {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = width;
    textureCanvas.height = height;
    const ctx = textureCanvas.getContext('2d');
    if (!ctx) return null;
    
    // Fondo base
    ctx.fillStyle = '#fefefe';
    ctx.fillRect(0, 0, width, height);
    
    // Agregar granulado del papel
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const grain = Math.random() * 15 - 7;
      data[i] = Math.max(0, Math.min(255, data[i] + grain));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
    }
    
    ctx.putImageData(imageData, 0, 0);
    return textureCanvas;
  };

  // Crear cursor personalizado de pincel realista
  const createBrushCursor = () => {
    const brushWidth = Math.max(8, Math.min(size / 2, 20));
    const tipSize = Math.max(4, Math.min(size / 3, 12));
    
    const svg = `
      <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <!-- Mango del pincel -->
        <rect x="15" y="8" width="4" height="20" fill="#8B4513" rx="2"/>
        <rect x="15" y="6" width="4" height="4" fill="#D2691E" rx="1"/>
        
        <!-- Ferrule (parte metálica) -->
        <rect x="14" y="26" width="6" height="6" fill="#C0C0C0" rx="1"/>
        
        <!-- Cerdas del pincel -->
        <ellipse cx="17" cy="35" rx="${brushWidth/2}" ry="8" fill="#4A4A4A" opacity="0.8"/>
        
        <!-- Punta con color -->
        <ellipse cx="17" cy="40" rx="${tipSize/2}" ry="4" fill="${color}" opacity="0.7"/>
        
        <!-- Área de efecto (invisible, solo para referencia) -->
        <circle cx="17" cy="42" r="${size/4}" fill="none" stroke="${color}" stroke-width="1" opacity="0.3" stroke-dasharray="2,2"/>
        
        <!-- Punto de precisión -->
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
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Aplicar textura de papel
    const paperTexture = createPaperTexture(canvas.width, canvas.height);
    if (paperTexture) {
      ctx.drawImage(paperTexture, 0, 0);
    }
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    setPainting(true);
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPos.current = {x, y};
    velocity.current = 0;
    
    ctx.beginPath();
    draw(e);
  };

  const end = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    setPainting(false);
    ctx.closePath();
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const drawWatercolorStroke = (fromX: number, fromY: number, toX: number, toY: number, pressure: number = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rgb = hexToRgb(color);
    if (!rgb) return;

    const pigment = (alpha: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    const darkerPigment = (alpha: number) => {
      const darken = (channel: number) => Math.max(0, channel - 22);
      return `rgba(${darken(rgb.r)}, ${darken(rgb.g)}, ${darken(rgb.b)}, ${alpha})`;
    };

    const distance = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
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

      // Capa base con gradiente suave y centro más luminoso
      ctx.save();
      ctx.translate(x + jitterX, y + jitterY);
      ctx.rotate(angle + (Math.random() - 0.5) * 0.15);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = currentOpacity * 0.55;

      const baseGradient = ctx.createRadialGradient(0, 0, thickness * 0.2, 0, 0, Math.max(elongated, thickness));
      baseGradient.addColorStop(0, pigment(0.25 * currentFlow));
      baseGradient.addColorStop(0.5, pigment(0.18 * currentFlow));
      baseGradient.addColorStop(1, pigment(0.42 * currentFlow));

      ctx.fillStyle = baseGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, elongated, thickness, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Borde oscurecido para el efecto de acumulación de pigmento
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = currentOpacity * (0.35 + currentWetness * 0.4);
      ctx.lineWidth = Math.max(2, thickness * 0.65);

      ctx.strokeStyle = darkerPigment(0.6);
      ctx.beginPath();
      ctx.ellipse(0, 0, elongated * (0.9 + Math.random() * 0.15), thickness * (0.9 + Math.random() * 0.15), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Bloom interno que aclara ligeramente zonas húmedas
      if (currentWetness > 0.6 && Math.random() < 0.45) {
        const bloomRadius = baseSize * (0.35 + Math.random() * 0.4);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.05 + currentWetness * 0.05;
        const bloom = ctx.createRadialGradient(x, y, bloomRadius * 0.1, x, y, bloomRadius);
        bloom.addColorStop(0, 'rgba(255,255,255,0.5)');
        bloom.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(x, y, bloomRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Bordes irregulares y sangrado suave
      if (currentWetness > 0.55 && Math.random() < 0.5) {
        const bleedCount = 2 + Math.floor(currentWetness * 4);
        for (let i = 0; i < bleedCount; i++) {
          const bleedAngle = angle + (Math.random() - 0.5) * Math.PI * 0.8;
          const bleedDistance = elongated * (0.7 + Math.random() * 0.9);
          const bleedX = x + Math.cos(bleedAngle) * bleedDistance;
          const bleedY = y + Math.sin(bleedAngle) * bleedDistance;
          const bleedSize = thickness * (0.25 + Math.random() * 0.4);

          ctx.save();
          ctx.globalCompositeOperation = 'multiply';
          ctx.globalAlpha = currentOpacity * 0.18;
          const bleedGradient = ctx.createRadialGradient(bleedX, bleedY, bleedSize * 0.2, bleedX, bleedY, bleedSize);
          bleedGradient.addColorStop(0, pigment(0.4));
          bleedGradient.addColorStop(1, pigment(0));
          ctx.fillStyle = bleedGradient;
          ctx.beginPath();
          ctx.arc(bleedX, bleedY, bleedSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Granulado suave que genera textura dentro del trazo
      const grainPoints = Math.floor(6 + currentWetness * 8);
      for (let g = 0; g < grainPoints; g++) {
        if (Math.random() > 0.3) continue;
        const grainAngle = Math.random() * Math.PI * 2;
        const grainRadius = Math.random() * baseSize * 0.45;
        const gx = x + Math.cos(grainAngle) * grainRadius;
        const gy = y + Math.sin(grainAngle) * grainRadius;
        const grainSize = 0.8 + Math.random() * 1.8;

        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
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
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calcular velocidad del movimiento
    if (lastPos.current) {
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      velocity.current = Math.sqrt(dx * dx + dy * dy);
      
      // Crear trazo continuo desde la última posición
      const pressure = Math.min(1, Math.max(0.3, 1 - velocity.current / 15));
      drawWatercolorStroke(lastPos.current.x, lastPos.current.y, x, y, pressure);
    } else {
      // Primer punto del trazo
      drawWatercolorStroke(x, y, x, y, 1);
    }

    lastPos.current = {x, y};
  };

  const clear = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    
    // Recrear textura de papel
    const paperTexture = createPaperTexture(canvas.width, canvas.height);
    if (paperTexture) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(paperTexture, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const savePNG = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    try {
      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.download = `matinee-acuarela-${Date.now()}.png`;
          a.href = url;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }, 'image/png');
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `matinee-acuarela-${Date.now()}.png`;
      a.href = dataUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('savePNG error', err);
      const dataUrl = canvas.toDataURL('image/png');
      window.open(dataUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" 
         style={{
           background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #312e81 25%, #581c87 50%, #7c2d12 75%, #0c0a09 100%)',
           backgroundAttachment: 'fixed'
         }}>
      
      {/* Estrellas de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`
            }}
          />
        ))}
      </div>
      
      {/* Planetas y elementos espaciales */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Planeta grande púrpura */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 opacity-70 animate-pulse">
          <div className="absolute top-4 left-6 w-8 h-4 bg-purple-300 rounded-full opacity-50"></div>
          <div className="absolute bottom-6 right-4 w-6 h-6 bg-purple-700 rounded-full opacity-40"></div>
        </div>
        
        {/* Luna pequeña */}
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 opacity-80 animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}>
          <div className="absolute top-2 left-3 w-3 h-3 bg-gray-400 rounded-full"></div>
          <div className="absolute bottom-3 right-2 w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
        
        {/* Planeta con anillos */}
        <div className="absolute bottom-32 right-16 w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-red-500 opacity-75 animate-pulse" style={{animationDelay: '2s'}}>
          <div className="absolute -inset-4 border-4 border-yellow-300 rounded-full opacity-60" style={{transform: 'rotateX(75deg)'}}></div>
          <div className="absolute -inset-6 border-2 border-orange-200 rounded-full opacity-40" style={{transform: 'rotateX(75deg)'}}></div>
        </div>
        
        {/* Planeta pequeño verde */}
        <div className="absolute bottom-40 left-32 w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 opacity-70 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '4s'}}>
          <div className="absolute top-3 left-4 w-4 h-2 bg-green-300 rounded-full opacity-60"></div>
          <div className="absolute bottom-4 right-3 w-3 h-3 bg-emerald-700 rounded-full opacity-50"></div>
        </div>
        
        {/* Cometas */}
        <div className="absolute top-1/3 left-1/4 w-8 h-2 bg-gradient-to-r from-cyan-400 to-transparent rounded-full opacity-80 animate-ping" style={{animationDelay: '1.5s'}}>
          <div className="absolute -left-2 -top-1 w-4 h-4 bg-cyan-300 rounded-full"></div>
        </div>
        
        <div className="absolute top-2/3 right-1/3 w-10 h-2 bg-gradient-to-r from-pink-400 to-transparent rounded-full opacity-70 animate-ping" style={{animationDelay: '3s'}}>
          <div className="absolute -left-2 -top-1 w-4 h-4 bg-pink-300 rounded-full"></div>
        </div>
        
        {/* Nave espacial */}
        <div className="absolute top-1/2 right-10 opacity-60 animate-bounce" style={{animationDelay: '2.5s', animationDuration: '5s'}}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <ellipse cx="20" cy="25" rx="12" ry="8" fill="#E5E7EB"/>
            <ellipse cx="20" cy="23" rx="8" ry="5" fill="#60A5FA"/>
            <circle cx="20" cy="20" r="6" fill="#DBEAFE" opacity="0.8"/>
            <rect x="18" y="30" width="4" height="6" fill="#F59E0B" opacity="0.9"/>
            <rect x="16" y="32" width="8" height="3" fill="#FBBF24" opacity="0.7"/>
          </svg>
        </div>
        
        {/* Alien divertido */}
        <div className="absolute bottom-20 left-16 opacity-70 animate-pulse" style={{animationDelay: '1s'}}>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <ellipse cx="25" cy="30" rx="15" ry="12" fill="#10B981"/>
            <circle cx="20" cy="25" r="5" fill="#000" opacity="0.8"/>
            <circle cx="30" cy="25" r="5" fill="#000" opacity="0.8"/>
            <circle cx="21" cy="23" r="2" fill="#FFF"/>
            <circle cx="31" cy="23" r="2" fill="#FFF"/>
            <path d="M15 35 Q25 40 35 35" stroke="#065F46" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        {/* Galaxia espiral */}
        <div className="absolute top-10 right-1/4 opacity-50 animate-spin" style={{animationDuration: '20s'}}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M30 10 Q45 30 30 50 Q15 30 30 10" fill="url(#galaxyGradient)" opacity="0.6"/>
            <defs>
              <radialGradient id="galaxyGradient" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#A855F7"/>
                <stop offset="50%" stopColor="#3B82F6"/>
                <stop offset="100%" stopColor="transparent"/>
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        
        {/* Título inspirador */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl mb-4 animate-pulse">
            🚀 Pinta tu Galaxia 🌟
          </h1>
          <p className="text-white text-lg md:text-xl font-medium opacity-90 drop-shadow-lg">
            Crea mundos mágicos con acuarela interestelar
          </p>
          <div className="flex justify-center gap-4 mt-4 text-2xl animate-bounce">
            <span style={{animationDelay: '0s'}}>🛸</span>
            <span style={{animationDelay: '0.5s'}}>👽</span>
            <span style={{animationDelay: '1s'}}>🌙</span>
            <span style={{animationDelay: '1.5s'}}>⭐</span>
            <span style={{animationDelay: '2s'}}>🪐</span>
          </div>
        </div>
        
        {/* Panel de acuarela */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 max-w-4xl w-full">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <label className="flex items-center gap-3 text-sm font-medium text-white drop-shadow-lg">🎨 Color
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-10 rounded-lg border-2 border-white/50 shadow-lg cursor-pointer" />
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-white drop-shadow-lg">📏 Tamaño
                <input type="range" min={5} max={80} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-24 accent-purple-400" />
                <span className="text-sm text-white/90 bg-black/20 px-2 py-1 rounded-lg w-8 text-center">{size}</span>
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-white drop-shadow-lg">💧 Opacidad
                <input type="range" min={0.1} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-24 accent-blue-400" />
                <span className="text-sm text-white/90 bg-black/20 px-2 py-1 rounded-lg w-12 text-center">{opacity.toFixed(2)}</span>
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-white drop-shadow-lg">🌊 Humedad
                <input type="range" min={0.4} max={1} step={0.05} value={wetness} onChange={(e) => setWetness(Number(e.target.value))} className="w-24 accent-cyan-400" />
                <span className="text-sm text-white/90 bg-black/20 px-2 py-1 rounded-lg w-12 text-center">{wetness.toFixed(2)}</span>
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-white drop-shadow-lg">💨 Flujo
                <input type="range" min={0.5} max={1} step={0.05} value={flow} onChange={(e) => setFlow(Number(e.target.value))} className="w-24 accent-pink-400" />
                <span className="text-sm text-white/90 bg-black/20 px-2 py-1 rounded-lg w-12 text-center">{flow.toFixed(2)}</span>
              </label>
              <button onClick={clear} className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">🗑️ Limpiar</button>
              <button onClick={savePNG} className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">💾 Guardar PNG</button>
            </div>
            
            <div ref={containerRef} className="w-full rounded-2xl border-4 border-white/30 overflow-hidden shadow-2xl backdrop-blur-sm">
              <canvas
                ref={canvasRef}
                className="w-full h-[420px] touch-none"
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
      </div>
    </div>
  );
}
