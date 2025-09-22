"use client";
import React, { useEffect, useRef, useState } from "react";

export default function LeverImproved({ onPull, disabled, returnSignal }: { onPull: () => void; disabled?: boolean; returnSignal?: number }) {
  const MAX = 120;
  const [pos, setPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startPosRef = useRef(0);

  const clamp = (v: number, min = 0, max = MAX) => Math.max(min, Math.min(max, v));

  // Resistencia progresiva - más difícil de mover cerca del final
  const applyResistance = (rawPos: number): number => {
    if (rawPos <= MAX * 0.7) return rawPos;
    const excess = rawPos - MAX * 0.7;
    const maxExcess = MAX * 0.3;
    const resistanceFactor = 1 - (excess / maxExcess) * 0.5;
    return MAX * 0.7 + excess * resistanceFactor;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    draggingRef.current = true;
    setIsDragging(true);
    startYRef.current = e.clientY;
    startPosRef.current = pos;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || disabled) return;
    const dy = e.clientY - startYRef.current;
    const rawNext = startPosRef.current + dy;
    const next = clamp(applyResistance(rawNext));
    setPos(next);
  };

  // Animación elástica mejorada
  const animateWithSpring = (target = 0, duration = 900) => {
    const startPos = pos;
    const startTime = Date.now();
    const distance = target - startPos;

    const easeOutElastic = (t: number): number => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    };

    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutElastic(progress);
      const currentPos = startPos + distance * easedProgress;
      
      setPos(currentPos);
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setPos(target);
      }
    };
    
    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (returnSignal === undefined) return;
    animateWithSpring(0);
  }, [returnSignal]); // eslint-disable-line

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    const threshold = MAX * 0.62;
    
    if (!disabled && pos >= threshold) {
      try { navigator.vibrate?.(20); } catch {}
      onPull();
    } else {
      // Si no llegó al threshold, regresa con animación
      animateWithSpring(0, 600);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setPos(MAX * 0.95);
      try { navigator.vibrate?.(20); } catch {}
      onPull();
    }
  };

  return (
    <div
      className={`relative h-56 w-24 select-none ${disabled ? 'opacity-60' : ''}`}
      aria-label="Palanca del tragamonedas"
      role="slider"
      aria-valuemin={0}
      aria-valuemax={MAX}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0 rounded-2xl p-3" style={{ backgroundImage: 'linear-gradient(135deg,#cfd6dc 0%,#f7f9fb 35%,#b3bcc4 70%,#e9edf1 100%)' }}>
        <div className="relative h-full w-full rounded-xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-700 shadow-inner">
          <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-1.5 rounded-full bg-gradient-to-b from-gray-400 to-gray-200 border border-zinc-600" />
          <div className="absolute left-1/2 -translate-x-1/2 top-6 h-6 w-6 rounded-full border border-zinc-700" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #c5cdd4 40%, #a9b2ba 70%, #5b646d 100%)' }} />

          <div
            className={`absolute left-1/2 -translate-x-1/2 top-6 h-[140px] w-4 cursor-grab transition-transform duration-100 ${
              isDragging ? 'cursor-grabbing scale-105' : 'hover:scale-102'
            }`}
            style={{ 
              transform: `translateY(${pos}px) ${isDragging ? 'rotate(1deg)' : ''}`,
              filter: isDragging ? 'brightness(1.1)' : ''
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div 
              className={`absolute top-0 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full border-4 border-red-700 shadow-lg transition-all duration-150 ${
                isDragging ? 'shadow-xl border-red-600' : ''
              }`} 
              style={{ 
                backgroundImage: isDragging 
                  ? 'radial-gradient(circle at 30% 30%, #ffb3ba 0%, #ff3f5d 40%, #d81f3e 100%)'
                  : 'radial-gradient(circle at 30% 30%, #ff9aa7 0%, #ff1f3d 40%, #b80f26 100%)'
              }} 
            />
            <div 
              className="absolute left-1/2 -translate-x-1/2 top-10 h-[116px] w-3 rounded-full border border-zinc-600 shadow transition-all duration-150" 
              style={{ 
                backgroundImage: 'linear-gradient(180deg,#e6edf3 0%,#b7c0c8 50%,#e6edf3 100%)',
                transform: isDragging ? 'scaleX(1.1)' : ''
              }} 
            />
          </div>
        </div>
      </div>
      <div className="sr-only">Jala la palanca hacia abajo para activar. Tras terminar los reels, vuelve sola a su lugar.</div>
    </div>
  );
}