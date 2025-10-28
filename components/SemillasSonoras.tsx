"use client";
import React, { useRef } from "react";
import { PALETTE } from "@/components/palette";

type Semilla = { id: string; nombre: string; color: string; frecuenciaHz: number };

const SEMILLAS: Semilla[] = [
  { id: "s1", nombre: "Fríjol", color: PALETTE.lime, frecuenciaHz: 392 },
  { id: "s2", nombre: "Maíz", color: PALETTE.sky, frecuenciaHz: 523.25 },
  { id: "s3", nombre: "Girasol", color: PALETTE.rose, frecuenciaHz: 659.25 },
  { id: "s4", nombre: "Cacao", color: PALETTE.lavender, frecuenciaHz: 440 },
  { id: "s5", nombre: "Aguacate", color: "rgba(128,193,221,0.65)", frecuenciaHz: 349.23 },
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
      className="group relative overflow-hidden rounded-2xl border border-brand-lavender/30 bg-brand-paper/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-sky/60"
      aria-label={`Semilla ${s.nombre}, reproducir sonido`}
    >
      <div className="flex items-center gap-4 p-4">
        <div
          className="h-16 w-16 rounded-full border border-brand-paper/80 shadow-inner"
          style={{ background: s.color }}
        />
        <div className="text-left">
          <div className="font-semibold text-brand-ink">{s.nombre}</div>
          <div className="text-xs text-brand-ink/60">Toca para oír ({Math.round(s.frecuenciaHz)} Hz)</div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand-sky via-brand-lavender to-brand-rose opacity-0 transition group-active:opacity-100" />
    </button>
  );
}

export default function SemillasSonoras() {
  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-brand-ink/70">
        Toca una semilla para escuchar su sonido. Más adelante podemos reemplazar estas notas por
        grabaciones propias.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {SEMILLAS.map((s) => (
          <SeedTile key={s.id} s={s} />
        ))}
      </div>
    </div>
  );
}
