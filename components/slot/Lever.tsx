"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Lever({ onPull, disabled, returnSignal }: { onPull: () => void; disabled?: boolean; returnSignal?: number }) {
  const MAX = 120;
  const [pos, setPos] = useState(0);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startPosRef = useRef(0);

  const clamp = (v: number, min = 0, max = MAX) => Math.max(min, Math.min(max, v));

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    draggingRef.current = true;
    startYRef.current = e.clientY;
    startPosRef.current = pos;
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || disabled) return;
    const dy = e.clientY - startYRef.current;
    const next = clamp(startPosRef.current + dy);
    setPos(next);
  };
  const animateTo = (target = 0) => {
    let current = pos;
    const step = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.6) { setPos(target); return; }
      current = current + diff * 0.25;
      setPos(current);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  useEffect(() => {
    if (returnSignal === undefined) return;
    animateTo(0);
  }, [returnSignal]); // eslint-disable-line

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const threshold = MAX * 0.62;
    if (!disabled && pos >= threshold) {
      try { navigator.vibrate?.(10); } catch {}
      onPull();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setPos(MAX * 0.95);
      try { navigator.vibrate?.(10); } catch {}
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
            className="absolute left-1/2 -translate-x-1/2 top-6 h-[140px] w-4"
            style={{ transform: `translateY(${pos}px)` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full border-4 border-red-700 shadow-lg" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #ff9aa7 0%, #ff1f3d 40%, #b80f26 100%)' }} />
            <div className="absolute left-1/2 -translate-x-1/2 top-10 h-[116px] w-3 rounded-full border border-zinc-600 shadow" style={{ backgroundImage: 'linear-gradient(180deg,#e6edf3 0%,#b7c0c8 50%,#e6edf3 100%)' }} />
          </div>
        </div>
      </div>
      <div className="sr-only">Jala la palanca hacia abajo para activar. Tras terminar los reels, vuelve sola a su lugar.</div>
    </div>
  );
}
