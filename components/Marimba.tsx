"use client";
import React, { useRef } from "react";

type KeyDef = { id: string; label: string; freq: number; color: string };

const KEYS: KeyDef[] = [
  { id: "k1", label: "Do", freq: 261.63, color: "#BFF49F" },
  { id: "k2", label: "Re", freq: 293.66, color: "#A7E3FF" },
  { id: "k3", label: "Mi", freq: 329.63, color: "#F2AADC" },
  { id: "k4", label: "Fa", freq: 349.23, color: "#C0AAF2" },
  { id: "k5", label: "Sol", freq: 392.0, color: "#FFD580" },
  { id: "k6", label: "La", freq: 440.0, color: "#9FE3C0" },
  { id: "k7", label: "Si", freq: 493.88, color: "#FFB3B3" },
];

function useAudio() {
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

function MarimbaKey({ k }: { k: KeyDef }) {
  const { get } = useAudio();

  const strike = () => {
    const ctx = get();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Slightly woody timbre: triangle + lowpass decay
    osc.type = "triangle";
    osc.frequency.value = k.freq;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(4000, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 0.25);

    // Envelope: quick attack, short decay
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.65);
  };

  return (
    <button
      onClick={strike}
      className="relative flex flex-col items-center justify-end rounded-xl border-2 border-black p-3 shadow-[6px_6px_0_rgba(0,0,0,0.2)] transition active:translate-y-[2px] active:shadow-[3px_3px_0_rgba(0,0,0,0.25)]"
      style={{ background: k.color, minHeight: 140 }}
      aria-label={`Tecla ${k.label}`}
    >
      <span className="pointer-events-none select-none font-display text-sm text-black/80">{k.label}</span>
    </button>
  );
}

export default function Marimba() {
  return (
    <div className="mt-6">
      <p className="mb-3 text-sm text-brand-ink/70">
        Toca las teclas para crear ritmos. Mantén un pulso y explora combinaciones.
      </p>
      <div className="grid grid-cols-7 gap-3 sm:gap-4">
        {KEYS.map((k) => (
          <MarimbaKey key={k.id} k={k} />
        ))}
      </div>
    </div>
  );
}

