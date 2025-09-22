"use client";
import React from "react";

export type Parte = { id: string; label?: string; bg?: string; src?: string; alt?: string };

export default function Reel({ items, activeIndex, size = 260 }: { items: Parte[]; activeIndex: number; size?: number }) {
  const metal: React.CSSProperties = {
    backgroundImage: 'linear-gradient(135deg, #dfe3e6 0%, #f7f7f8 40%, #c9d1d6 60%, #eef1f4 100%)',
    width: size,
    height: size,
  };

  return (
    <div className="relative rounded-2xl p-2 shadow-inner" style={metal}>
      <div className="rounded-xl bg-gradient-to-b from-gray-900 to-black p-1 border border-gray-700 shadow-inner w-full h-full">
        <div className="relative overflow-hidden rounded-lg bg-black/80 w-full h-full" aria-label="Tambor del tragamonedas">
          <div
            className="transition-transform duration-500 ease-out will-change-transform"
            style={{ transform: `translateY(-${activeIndex * size}px)` }}
          >
            {items.map((it) => (
              <div
                key={it.id}
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
  );
}
