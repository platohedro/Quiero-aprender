"use client";
import React, { useEffect, useState } from "react";

export type Parte = { id: string; label?: string; bg?: string; src?: string; alt?: string };

export default function ReelAnimated({
  items,
  activeIndex,
  size = 190,
  isSpinning = false,
  spinDuration = 0,
  frameless = false,
}: {
  items: Parte[];
  activeIndex: number;
  size?: number;
  isSpinning?: boolean;
  spinDuration?: number;
  frameless?: boolean;
}) {
  const [currentTransform, setCurrentTransform] = useState(0);
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (isSpinning && spinDuration > 0) {
      // Empieza la animación rápida
      setAnimationClass("animate-spin-fast");
      
      // Después de un tiempo, cambia a desaceleración
      const timeout = setTimeout(() => {
        setAnimationClass("animate-spin-slow");
        
        // Finalmente para en la posición correcta
        setTimeout(() => {
          setAnimationClass("");
          setCurrentTransform(-activeIndex * size);
        }, spinDuration * 0.7); // 70% del tiempo total para desacelerar
        
      }, spinDuration * 0.3); // 30% del tiempo inicial rápido
      
      return () => clearTimeout(timeout);
    } else if (!isSpinning) {
      // Cuando no está girando, posición normal
      setAnimationClass("");
      setCurrentTransform(-activeIndex * size);
    }
  }, [isSpinning, spinDuration, activeIndex, size]);

  const frameWrapperClass = frameless ? "relative" : "relative rounded-2xl p-2 shadow-inner";
  const frameWrapperStyle: React.CSSProperties = frameless
    ? { width: size, height: size }
    : {
        backgroundImage:
          "linear-gradient(135deg, #dfe3e6 0%, #f7f7f8 40%, #c9d1d6 60%, #eef1f4 100%)",
        width: size,
        height: size,
      };

  const viewportClass = frameless
    ? "rounded-[24px] border border-[#1b2b2c]/60 bg-[#03161a]/90 w-full h-full"
    : "rounded-xl bg-gradient-to-b from-gray-900 to-black p-1 border border-gray-700 shadow-inner w-full h-full";

  const innerViewportClass = frameless
    ? "relative overflow-hidden rounded-[18px] bg-[#020b0f] w-full h-full"
    : "relative overflow-hidden rounded-lg bg-black/80 w-full h-full";

  // Duplicar items para efecto continuo
  const extendedItems = [...items, ...items, ...items];

  return (
    <>
      <style jsx>{`
        @keyframes spin-fast {
          from { transform: translateY(0px); }
          to { transform: translateY(-${items.length * size * 2}px); }
        }
        @keyframes spin-slow {
          from { transform: translateY(-${items.length * size * 2}px); }
          to { transform: translateY(-${activeIndex * size}px); }
        }
        .animate-spin-fast {
          animation: spin-fast 0.3s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
      
      <div className={frameWrapperClass} style={frameWrapperStyle}>
        <div className={viewportClass}>
          <div className={innerViewportClass} aria-label="Tambor del tragamonedas">
            <div
              className={`will-change-transform ${animationClass}`}
              style={{ 
                transform: animationClass ? undefined : `translateY(${currentTransform}px)`,
                transition: animationClass ? undefined : 'transform 0.5s ease-out'
              }}
            >
              {extendedItems.map((it, index) => (
                <div
                  key={`${it.id}-${index}`}
                  className="flex items-center justify-center text-center"
                  style={{ height: size, width: size, background: it.bg || '#fff' }}
                >
                  {it.src ? (
                    <img src={it.src} alt={it.alt || it.label || 'Parte'} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="font-semibold px-3 drop-shadow-[0_1px_0_rgba(0,0,0,0.4)]">{it.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
