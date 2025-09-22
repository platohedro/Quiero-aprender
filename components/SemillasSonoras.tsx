"use client";
import React, { useRef } from "react";

type Semilla = { id: string; nombre: string; color: string; frecuenciaHz: number };

const SEMILLAS: Semilla[] = [
  { id: 's1', nombre: 'Fríjol', color: '#8B4513', frecuenciaHz: 392 },
  { id: 's2', nombre: 'Maíz', color: '#facc15', frecuenciaHz: 523.25 },
  { id: 's3', nombre: 'Girasol', color: '#f59e0b', frecuenciaHz: 659.25 },
  { id: 's4', nombre: 'Cacao', color: '#6b4423', frecuenciaHz: 440 },
  { id: 's5', nombre: 'Aguacate', color: '#16a34a', frecuenciaHz: 349.23 },
];

function useAudioContext() {
  const ctxRef = useRef<AudioContext | null>(null);
  const get = () => {
    if (!ctxRef.current) {
      const Ctx: typeof window.AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      ctxRef.current = new Ctx();
    }
    return ctxRef.current!;
  };
  return { get };
}

function SeedTile({ s }: { s: Semilla }) {
  const { get } = useAudioContext();

  const play = () => {
    const ctx = get();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = s.frecuenciaHz;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.65);
  };

  return (
    <button
      onClick={play}
      className="group relative overflow-hidden rounded-2xl border shadow bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
      aria-label={`Semilla ${s.nombre}, reproducir sonido`}
    >
      <div className="p-4 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full border" style={{ background: s.color }} />
        <div className="text-left">
          <div className="font-semibold">{s.nombre}</div>
          <div className="text-xs text-gray-500">Toca para oír ({Math.round(s.frecuenciaHz)} Hz)</div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 via-yellow-300 to-amber-400 opacity-0 group-active:opacity-100 transition" />
    </button>
  );
}

export default function SemillasSonoras() {
  return (
    <div>
      <p className="mb-4 text-gray-700">Toca una semilla para escuchar su sonido. (WebAudio; luego podemos usar archivos .mp3/.wav propios.)</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {SEMILLAS.map((s) => (
          <SeedTile key={s.id} s={s} />
        ))}
      </div>
    </div>
  );
}
