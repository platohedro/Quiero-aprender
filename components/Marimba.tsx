"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type KeyDef = { id: string; label: string; freq: number; color: string };
type Semilla = { id: string; nombre: string; img: string };

const KEYS: KeyDef[] = [
  { id: "k1", label: "Do", freq: 261.63, color: "#BFF49F" },
  { id: "k2", label: "Re", freq: 293.66, color: "#A7E3FF" },
  { id: "k3", label: "Mi", freq: 329.63, color: "#F2AADC" },
  { id: "k4", label: "Fa", freq: 349.23, color: "#C0AAF2" },
  { id: "k5", label: "Sol", freq: 392.0, color: "#FFD580" },
  { id: "k6", label: "La", freq: 440.0, color: "#9FE3C0" },
  { id: "k7", label: "Si", freq: 493.88, color: "#FFB3B3" },
];

function useSemillas() {
  const [items, setItems] = useState<Semilla[]>([]);
  useEffect(() => {
    let mounted = true;
    fetch("/api/semillas")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const semillas = (data?.semillas ?? []).map((s: any) => ({
          id: s.id,
          nombre: s.nombre,
          img: s.img,
        })) as Semilla[];
        setItems(semillas);
      })
      .catch(() => setItems([]));
    return () => {
      mounted = false;
    };
  }, []);
  return items;
}

function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const get = () => {
    if (!ctxRef.current) {
      const Ctx: typeof window.AudioContext =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      ctxRef.current = new Ctx();
    }
    return ctxRef.current!;
  };
  return { get };
}

function MarimbaKey({ k, semilla, get }: { k: KeyDef; semilla?: Semilla; get: () => AudioContext }) {
  const [ping, setPing] = useState(0);

  const strike = () => {
    const ctx = get();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Timbre tipo madera: triángulo + lowpass con decaimiento
    osc.type = "triangle";
    osc.frequency.value = k.freq;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(4200, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 0.22);

    // Envolvente: ataque corto, decaimiento medio
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);

    // marca visual para sugerir golpe
    setPing((p) => p + 1);
  };

  return (
    <button
      onClick={strike}
      className="group relative isolate flex flex-col items-center justify-center outline-none transition active:translate-y-[2px] focus-visible:ring-2 focus-visible:ring-black/40"
      aria-label={`Tecla ${k.label}${semilla ? `, ${semilla.nombre}` : ""}`}
      title={semilla ? `${k.label} – ${semilla.nombre}` : k.label}
      style={{ height: 96 }}
    >
      {semilla ? (
        <img
          src={semilla.img}
          alt={semilla.nombre}
          className="h-24 w-24 rounded-full object-cover ring-2 ring-black/10 shadow-[0_8px_0_rgba(0,0,0,0.12)] transition-transform group-active:translate-y-[2px]"
        />
      ) : (
        <span className="h-24 w-24 rounded-full bg-white ring-2 ring-black/10 shadow-[0_8px_0_rgba(0,0,0,0.12)]" />
      )}
      {/* halo de golpe */}
      <span
        key={ping}
        className="pointer-events-none absolute h-24 w-24 rounded-full border-2 border-black/10"
        style={{ animation: 'ping-fast 0.6s ease-out 1' }}
        aria-hidden
      />
      {/* etiqueta de nota */}
      <span className="mt-1 text-xs font-medium text-brand-ink/70">{k.label}</span>
    </button>
  );
}

export default function Marimba() {
  const semillas = useSemillas();
  const { get } = useAudio();
  // Seleccionamos hasta 7 semillas para mapear con las notas
  const semillasParaTeclas = useMemo(() => semillas.slice(0, 7), [semillas]);

  // atajos de teclado para tocar como instrumento
  useEffect(() => {
    const map = ['a','s','d','f','j','k','l'];
    const onKey = (e: KeyboardEvent) => {
      const idx = map.indexOf(e.key.toLowerCase());
      if (idx >= 0 && idx < KEYS.length) {
        e.preventDefault();
        const ctx = get();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const k = KEYS[idx];
        osc.type = 'triangle';
        osc.frequency.value = k.freq;
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(4200, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 0.22);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
        osc.connect(filter).connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [get]);

  return (
    <div className="mt-6">
      <p className="mb-3 text-sm text-brand-ink/70">Toca las semillas como una marimba. También puedes usar el teclado.</p>

      {/* base con rieles sutiles para sugerir instrumento; solo visibles las semillas */}
      <div className="relative">
        <div className="pointer-events-none absolute -z-10 -bottom-1 left-1 right-1 h-2 rounded-full" style={{ background: 'linear-gradient(#c9a667,#a97d2e)' }} aria-hidden />
        <div className="pointer-events-none absolute -z-10 -bottom-4 left-6 right-6 h-2 rounded-full" style={{ background: 'linear-gradient(#c9a667,#a97d2e)' }} aria-hidden />
        <div className="grid grid-cols-7 items-end gap-4">
          {semillasParaTeclas.map((s, i) => (
            <MarimbaKey key={s.id} k={KEYS[i]} semilla={s} get={get} />
          ))}
        </div>
        <div className="mt-2 text-center text-xs text-brand-ink/50">Usa el teclado: A S D F J K L</div>
      </div>
    </div>
  );
}

// keyframes para el halo de golpe si aún no existen
if (typeof document !== 'undefined' && !document.getElementById('marimba-ping')) {
  const style = document.createElement('style');
  style.id = 'marimba-ping';
  style.textContent = `@keyframes ping-fast { 0% { transform: scale(1); opacity: .4; } 70% { transform: scale(1.18); opacity: 0; } 100% { transform: scale(1.18); opacity: 0; } }`;
  document.head.appendChild(style);
}
