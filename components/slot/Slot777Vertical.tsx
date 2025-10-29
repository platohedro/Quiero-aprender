"use client";

import React, { useEffect, useRef, useState } from "react";
import ReelAnimated, { Parte } from "./ReelAnimated";

// Carga dinámica basada en la convención: animalN.1 / animalN.2 / animalN.3
// y en las carpetas: /caja1 (cabezas), /caja2 (cuerpos), /caja3 (pies)
// Esto permite escalar fácilmente al agregar más animales con el mismo patrón.
const buildDataset = (count: number, part: 1 | 2 | 3): Parte[] => {
  const folder = part === 1 ? "/caja1" : part === 2 ? "/caja2" : "/caja3";
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return {
      id: `${part === 1 ? "c" : part === 2 ? "b" : "p"}${n}`,
      label: part === 1 ? `Cabeza ${n}` : part === 2 ? `Cuerpo ${n}` : `Pies ${n}`,
      bg: "#0f1a24",
      // Ajuste: los archivos ahora siguen el patrón animalN.PART.png
      src: `${folder}/animal${n}.${part}.png`,
      alt: `Animal ${n} parte ${part}`,
    } as Parte;
  });
};

// Detectar cuántos animales hay disponibles inspeccionando la carpeta de cabezas.
// Para simplicidad en el cliente, establecemos un máximo basado en archivos presentes conocidos.
// Con las imágenes actuales (1 y 2). Futuro: subir hasta 15 siguiendo el patrón N.1/N.2/N.3.
const TOTAL_ANIMALES = 2; // actualizar cuando agregues más (p. ej. 15)

const CABEZAS: Parte[] = buildDataset(TOTAL_ANIMALES, 1);
const CUERPOS: Parte[] = buildDataset(TOTAL_ANIMALES, 2);
const PIES: Parte[] = buildDataset(TOTAL_ANIMALES, 3);

const machineSlots = [
  { key: "head" as const, dataset: CABEZAS, duration: 1500 },
  { key: "body" as const, dataset: CUERPOS, duration: 2200 },
  { key: "feet" as const, dataset: PIES, duration: 2900 },
];

const FALLBACK_WINDOW_SIZE = 250;
const WINDOW_SIZE_MIN = 220;
const WINDOW_SIZE_MAX = 280;
const BUTTON_WIDTH_RATIO = 0.5;

export default function Slot777Vertical() {
  const [running, setRunning] = useState(false);
  const [idxHead, setIdxHead] = useState(0);
  const [idxBody, setIdxBody] = useState(1);
  const [idxFeet, setIdxFeet] = useState(2);
  const [message, setMessage] = useState<string | null>(null);
  const [spinningReels, setSpinningReels] = useState({ head: false, body: false, feet: false });
  const [showCongrats, setShowCongrats] = useState(false);
  const [completeAnimal, setCompleteAnimal] = useState<string | null>(null);

  const machineRef = useRef<HTMLDivElement>(null);
  const [machineWidth, setMachineWidth] = useState(0);
  const [windowSize, setWindowSize] = useState(FALLBACK_WINDOW_SIZE);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const measure = () => {
      const width = machineRef.current?.offsetWidth ?? 0;
      if (!width) return;
      setMachineWidth(width);
      const height = width * 0.6;
      const size = Math.max(
        WINDOW_SIZE_MIN,
        Math.min(WINDOW_SIZE_MAX, height * 0.28)
      );
      setWindowSize(size);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => undefined);
        audioContextRef.current = null;
      }
    };
  }, []);

  const playSpinSound = () => {
    if (typeof window === "undefined" || typeof AudioContext === "undefined") return;
    const ctx = audioContextRef.current ?? new AudioContext();
    audioContextRef.current = ctx;
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const duration = 3.2;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < channelData.length; i += 1) {
      const progress = i / channelData.length;
      const envelope = Math.pow(1 - progress, 1.4);
      channelData[i] = (Math.random() * 2 - 1) * envelope;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(2200, ctx.currentTime + 1.6);
    filter.Q.value = 0.9;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.45, ctx.currentTime + 0.12);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    const blip = ctx.createOscillator();
    blip.type = "triangle";
    blip.frequency.setValueAtTime(320, ctx.currentTime + duration - 0.45);
    blip.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + duration - 0.05);
    const blipGain = ctx.createGain();
    blipGain.gain.setValueAtTime(0.0001, ctx.currentTime + duration - 0.45);
    blipGain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + duration - 0.2);
    blipGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + duration + 0.05);
    blip.connect(blipGain).connect(ctx.destination);

    source.start();
    source.stop(ctx.currentTime + duration);
    blip.start(ctx.currentTime + duration - 0.45);
    blip.stop(ctx.currentTime + duration + 0.05);
  };

  const checkCompleteAnimal = (headIdx: number, bodyIdx: number, feetIdx: number) => {
    // Gana si los tres índices son iguales (mismo animal N) y están dentro del rango
    if (headIdx === bodyIdx && bodyIdx === feetIdx) {
      const n = headIdx + 1;
      return `Animal ${n}`;
    }
    return null;
  };

  const getActiveIndex = (slotKey: "head" | "body" | "feet") => {
    if (slotKey === "head") return idxHead;
    if (slotKey === "body") return idxBody;
    return idxFeet;
  };

  const getSpinningState = (slotKey: "head" | "body" | "feet") => {
    if (slotKey === "head") return spinningReels.head;
    if (slotKey === "body") return spinningReels.body;
    return spinningReels.feet;
  };

  const spin = () => {
    if (running) return;
    setRunning(true);
    setMessage(null);
    playSpinSound();

    const roll = (len: number, roundsMin = 8, roundsMax = 14) => {
      const rounds = Math.floor(roundsMin + Math.random() * (roundsMax - roundsMin));
      return (current: number) => (current + rounds) % len;
    };

    const stopHead = roll(CABEZAS.length);
    const stopBody = roll(CUERPOS.length);
    const stopFeet = roll(PIES.length);

    const nextHead = stopHead(idxHead);
    const nextBody = stopBody(idxBody);
    const nextFeet = stopFeet(idxFeet);

    setSpinningReels({ head: true, body: true, feet: true });

    setTimeout(() => {
      setIdxHead(nextHead);
      setSpinningReels(prev => ({ ...prev, head: false }));
    }, 1500);

    setTimeout(() => {
      setIdxBody(nextBody);
      setSpinningReels(prev => ({ ...prev, body: false }));
    }, 2200);

    setTimeout(() => {
      setIdxFeet(nextFeet);
      setSpinningReels(prev => ({ ...prev, feet: false }));
    }, 2900);

    setTimeout(() => {
      const animal = checkCompleteAnimal(nextHead, nextBody, nextFeet);
      if (animal) {
        setCompleteAnimal(animal);
        setShowCongrats(true);
        setMessage(`¡${animal} completo!`);
      } else if (nextHead === nextBody && nextBody === nextFeet) {
        setMessage("¡Jackpot creativo!");
      } else {
        setMessage("¡Nueva criatura creada!");
      }
      setRunning(false);
    }, 3200);
  };

  const framePadding = Math.max(16, windowSize * 0.08);
  const frameOuterSize = windowSize + framePadding;
  const buttonWidth = machineWidth ? Math.min(machineWidth * BUTTON_WIDTH_RATIO, 320) : 240;
  const buttonHeight = machineWidth ? Math.max(60, machineWidth * 0.12) : 66;
  const messageWidth = machineWidth ? Math.min(machineWidth * 0.7, 360) : undefined;

  return (
    <section
      className="relative flex min-h-screen w-full items-center justify-center"
      style={{
        backgroundImage: "url('/FONDO3.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#000000",
      }}
    >
      <style>{`
        @keyframes neonPulse {
          0%, 100% { box-shadow: 0 0 0 3px #C0AAF2, 0 0 18px 4px rgba(192,170,242,0.35); }
          50% { box-shadow: 0 0 0 3px #F2AADC, 0 0 26px 5px rgba(242,170,220,0.55); }
        }
        @keyframes neonPulseSoft {
          0%, 100% { box-shadow: 0 0 0 6px #C0AAF2, inset 0 0 0 4px #F2AADC, inset 0 2px 0 #DCF2AA; }
          50% { box-shadow: 0 0 0 6px #F2AADC, inset 0 0 0 4px #DCF2AA, inset 0 2px 0 #C0AAF2; }
        }
      `}</style>

      <div className="relative flex w-full max-w-[900px] flex-col items-center rounded-[28px] p-3">
        <div
          ref={machineRef}
          className="relative flex w-full max-w-[620px] flex-col items-center gap-4 rounded-[28px] border border-[rgba(192,170,242,0.25)] px-4 py-4"
          style={{
        boxShadow:
              "inset 0 0 0 4px rgba(242,170,220,0.16), inset 0 22px 32px rgba(0,0,0,0.45), inset 0 -26px 38px rgba(0,0,0,0.5)",
          }}
        >
          <div className="w-full">
            <div className="animate-[neonPulse_3.5s_ease-in-out_infinite] rounded-t-[30px] rounded-b-[20px] bg-[linear-gradient(180deg,#C0AAF2_0%,#F2AADC_50%,#80C1DD_100%)] p-[5px]">
              <div
                className="flex h-[50px] w-full items-center justify-center rounded-t-[18px] rounded-b-[12px] px-4"
                style={{
             }}
              >
                <span className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold uppercase tracking-[0.32em] text-[#FFEAC2]">
                  ANIMALARIO 
                </span>
              </div>
            </div>
          </div>

          {message && (
            <div
              className="rounded-full border px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.25em]"
              style={{
                width: messageWidth || "70%",
                borderColor: "#C0AAF2",
                color: "#C0AAF2",
                background: "rgba(192,170,242,0.18)",
                boxShadow: "0 8px 20px rgba(192,170,242,0.3)",
              }}
            >
              {message}
            </div>
          )}

          <div
            className="w-full rounded-[28px] border border-[rgba(192,170,242,0.28)] p-6 shadow-[inset_0_12px_22px_rgba(0,0,0,0.35),inset_0_-20px_32px_rgba(0,0,0,0.52)]"
            style={{
            }}
          >
            <div className="flex flex-col items-center gap-2 sm:gap-2">
              {machineSlots.map((slot, index) => {
                const reelSize = windowSize;
                const outerSize = frameOuterSize;
                return (
                  <div key={slot.key} className="flex flex-col items-center">
                    <div
                      className="animate-[neonPulseSoft_4.2s_ease-in-out_infinite] rounded-[24px] border border-[rgba(192,170,242,0.45)] p-[8px]"
                      style={{
                        width: outerSize,
                        height: outerSize,
                        background:
                          "linear-gradient(180deg,#C0AAF2 0%,#F2AADC 50%,#80C1DD 100%)",
                        boxShadow:
                          "0 0 0 4px rgba(192,170,242,0.35), inset 0 5px 12px rgba(242,170,220,0.4), inset 0 -8px 16px rgba(128,193,221,0.55)",
                      }}
                    >
                      <div
                        className="flex h-full w-full items-center justify-center rounded-[18px] border border-[rgba(192,170,242,0.25)] "
                        style={{ width: reelSize, height: reelSize }}
                      >
                        <ReelAnimated
                          items={slot.dataset}
                          activeIndex={getActiveIndex(slot.key)}
                          size={reelSize}
                          isSpinning={getSpinningState(slot.key)}
                          spinDuration={slot.duration}
                          frameless
                        />
                      </div>
                    </div>
                    <span className="sr-only">Ventana {index + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full pt-1">
            <div className="animate-[neonPulse_3.5s_ease-in-out_infinite] rounded-[20px]  p-[1px]">
              <div
                className="relative flex flex-col items-center justify-center rounded-[20px] py-4"
                style={{
              
           
                }}
              >
                <div className="pointer-events-none absolute top-[16px] left-1/2 h-[3px] w-[62%] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#C0AAF2]/40 via-[#C0AAF2]/90 to-[#C0AAF2]/40" />

                <button
                  type="button"
                  aria-label={running ? "Girando" : "Girar"}
                  disabled={running}
                  onClick={spin}
                className={`flex items-center justify-center rounded-[28px] border-2 border-[#80C1DD] bg-gradient-to-b from-[#80C1DD] to-[#C0AAF2] px-10 text-[22px] font-bold uppercase tracking-[0.32em] text-[#0f172a] shadow-[0_8px_18px_rgba(128,193,221,0.35),0_0_0_4px_rgba(242,170,220,0.35)] transition-transform duration-150 ease-out focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[4px] focus-visible:outline-[#F2AADC] ${
                    running
                      ? "cursor-wait opacity-60"
                      : "hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(128,193,221,0.55),0_0_0_6px_rgba(192,170,242,0.45)] active:translate-y-0.5"
                  }`}
                  style={{ width: buttonWidth, height: buttonHeight }}
                >
                  Girar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border-4 border-amber-300 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-10 text-center text-white shadow-[0_30px_70px_rgba(16,185,129,0.45)]">
            <div className="mb-4 text-6xl">🎉</div>
            <h2 className="text-3xl font-black drop-shadow-lg">¡Felicitaciones!</h2>
            <p className="mt-4 text-lg font-semibold">¡Has completado el {completeAnimal}!</p>
            <div className="mt-6 text-4xl">🐾✨🎊</div>
            <button
              onClick={() => {
                setShowCongrats(false);
                setCompleteAnimal(null);
              }}
              className="rounded-full bg-amber-300 px-8 py-3 text-base font-bold text-black shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-amber-200"
            >
              ¡Continuar jugando!
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
