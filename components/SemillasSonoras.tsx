"use client";
import React, { useEffect, useRef, useState } from "react";
type Semilla = { id: string; nombre: string; img: string; audioMp3?: string; audioM4a?: string };

function useSemillasFromManifest() {
  const [items, setItems] = useState<Semilla[]>([]);
  useEffect(() => {
    let mounted = true;
    fetch("/api/semillas")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const arr = (data?.semillas ?? []) as Semilla[];
        setItems(arr);
      })
      .catch(() => setItems([]));
    return () => {
      mounted = false;
    };
  }, []);
  return items;
}

function useAudioController() {
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const currentIdRef = useRef<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlayingState, setIsPlayingState] = useState<boolean>(false);
  const playTokenRef = useRef<number>(0);
  const ensure = () => {
    // Singleton global para garantizar única instancia en toda la app
    const w = window as any;
    if (!w.__globalSingleAudio) {
      w.__globalSingleAudio = new Audio();
      w.__globalSingleAudio.preload = "auto";
      w.__globalSingleAudio.crossOrigin = "anonymous";
    }
    if (!playerRef.current) {
      playerRef.current = w.__globalSingleAudio as HTMLAudioElement;
      playerRef.current.onended = () => {
        currentIdRef.current = null;
        setCurrentId(null);
        setIsPlayingState(false);
      };
      playerRef.current.onplay = () => setIsPlayingState(true);
      playerRef.current.onpause = () => setIsPlayingState(false);
    }
    w.__semillasAudio = playerRef.current;
    return playerRef.current!;
  };
  const play = (id: string, sources: string[]) => {
    const a = ensure();
    // Invalida cualquier reproducción en curso
    playTokenRef.current += 1;
    const token = playTokenRef.current;
    try {
      a.pause();
      a.currentTime = 0;
      // limpiar src para cortar descargas/decodificación en curso y evitar solapes
      a.src = "";
    } catch {}
    const trySrc = (i: number) => {
      if (token !== playTokenRef.current) return; // abortado por otra reproducción
      if (i >= sources.length) return;
      a.src = sources[i];
      // Ejecutar en siguiente tick para asegurar que el navegador procese el cambio de src
      setTimeout(() => {
        if (token !== playTokenRef.current) return;
        // Seguridad adicional: pausa antes de play en caso de race extrañas
        try { a.pause(); } catch {}
        a.play()
          .then(() => {
            if (token !== playTokenRef.current) return;
            currentIdRef.current = id;
            setCurrentId(id);
          })
          .catch(() => {
            if (token !== playTokenRef.current) return;
            trySrc(i + 1);
          });
      }, 0);
    };
    trySrc(0);
  };
  const toggle = (id: string, sources: string[]) => {
    const a = ensure();
    if (currentIdRef.current === id && !a.paused) {
      a.pause(); a.currentTime = 0; currentIdRef.current = null; return;
    }
    play(id, sources);
  };
  const stop = () => { const a = ensure(); try { a.pause(); a.currentTime = 0; } catch {}; currentIdRef.current = null; setCurrentId(null); setIsPlayingState(false); };
  const setVolume = (v: number) => { const a = ensure(); a.volume = v; };
  const isPlaying = (id: string) => currentId === id && isPlayingState;
  return { toggle, stop, setVolume, isPlaying, currentIdRef, currentId, isPlayingState };
}

function SeedTile({ s }: { s: Semilla }) {
  const { toggle, stop, setVolume, isPlaying, currentIdRef } = useAudioController();

  const play = () => {
    const mp3 = s.audioMp3 || `/aduios_semillas/${s.id}.MP3`;
    const m4a = s.audioM4a || `/aduios_semillas/${s.id}.m4a`;
    toggle(s.id, [mp3, m4a]);
  };

  const playing = isPlaying(s.id);

  return (
    <div className="group relative overflow-hidden rounded-3xl border-2 border-black/10 bg-white shadow-[6px_6px_0_#C0AAF2]">
      <div className="flex items-center gap-5 p-5">
        <div className="relative h-24 w-24">
          <img
            src={s.img}
            alt={s.nombre}
            className="h-24 w-24 rounded-full object-cover ring-2 ring-black/10"
          />
          {playing && (
            <>
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  boxShadow: '0 0 0 6px rgba(192,170,242,0.95)',
                  transformOrigin: '50% 50%'
                }}
                aria-hidden
              />
              <span
                className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-brand-sky/30 via-brand-lavender/30 to-brand-rose/30"
                style={{
                  animation: 'ping-fast 0.8s cubic-bezier(0, 0, 0.2, 1) infinite',
                  opacity: 0.45
                }}
                aria-hidden
              />
            </>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-lg font-semibold text-[#0f172a] break-words leading-tight">{s.nombre}</div>
          <div className="text-sm text-brand-ink/60">Toca para escuchar</div>
        </div>
      </div>
      <div className="border-t border-black/5 px-5 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            defaultValue={1}
            onChange={(e) => {
              const a = (window as any).__semillasAudio as HTMLAudioElement | null;
              if (a && currentIdRef.current === s.id) a.volume = Number(e.target.value);
            }}
            className="h-2 w-full max-w-[260px] cursor-pointer appearance-none rounded-lg bg-gray-200"
            aria-label={`Volumen de ${s.nombre}`}
          />
          <button
            onClick={play}
            className="h-9 rounded-xl border border-black/10 bg-black/80 px-3 text-white text-xs hover:bg-black flex items-center gap-2"
            aria-label={playing ? `Pausar ${s.nombre}` : `Reproducir ${s.nombre}`}
            title={playing ? "Pausar" : "Reproducir"}
          >
            <span aria-hidden>
              {playing ? (
                // icono pause
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
              ) : (
                // icono play
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              )}
            </span>
            <span className="sr-only">{playing ? "Pausar" : "Reproducir"}</span>
          </button>
          <button
            onClick={stop}
            className="h-9 rounded-xl border border-black/10 bg-white px-3 text-xs hover:bg-gray-50 flex items-center gap-2"
            aria-label={`Detener ${s.nombre}`}
            title="Detener"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6 6h12v12H6z"/></svg>
            <span className="sr-only">Detener</span>
          </button>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand-sky via-brand-lavender to-brand-rose" />
    </div>
  );
}

// Animación rápida para el pulso del círculo
// Usamos una regla @keyframes inyectada vía style tag cuando el componente se monta.
if (typeof document !== 'undefined' && !document.getElementById('semillas-ping-fast')) {
  const style = document.createElement('style');
  style.id = 'semillas-ping-fast';
  style.textContent = `@keyframes ping-fast { 0% { transform: scale(1); opacity: .3; } 70% { transform: scale(1.15); opacity: 0; } 100% { transform: scale(1.15); opacity: 0; } }`;
  document.head.appendChild(style);
}

export default function SemillasSonoras() {
  const semillas = useSemillasFromManifest();
  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-brand-ink/70">
        Toca una semilla para escuchar su sonido. Más adelante podemos reemplazar estas notas por
        grabaciones propias.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {semillas.map((s) => (
          <SeedTile key={s.id} s={s} />
        ))}
      </div>
    </div>
  );
}
