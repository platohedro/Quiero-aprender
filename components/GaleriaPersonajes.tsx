"use client";
import React, { useMemo, useState } from "react";
import AtrilScene from "@/components/galeria/AtrilScene";

export type Personaje = { id: string; nombre: string; colores: string[]; descripcion: string };

type PersonajeEscena = {
  id: string;
  nombre: string;
  descripcion: string;
  model: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  fitHeight?: number;
};

const MOCK_PERSONAJES: Personaje[] = [
  { id: 'p1', nombre: 'Luna Tigresa', colores: ['#ff6b6b', '#ffe66d', '#4ecdc4'], descripcion: 'Valiente y brillante.' },
  { id: 'p2', nombre: 'Robotito Azul', colores: ['#5dade2', '#d6eaf8', '#273746'], descripcion: 'Curioso explorador.' },
  { id: 'p3', nombre: 'Sapo Disco', colores: ['#58d68d', '#daf7a6', '#1d8348'], descripcion: 'Baila sin parar.' },
  { id: 'p4', nombre: 'Zorro Sol', colores: ['#f39c12', '#fdebd0', '#d35400'], descripcion: 'Astuto y cálido.' },
  { id: 'p5', nombre: 'Avi Koala', colores: ['#a29bfe', '#dfe6e9', '#6c5ce7'], descripcion: 'Sueña alto.' },
  { id: 'p6', nombre: 'Sirena Pico', colores: ['#00cec9', '#81ecec', '#0984e3'], descripcion: 'Canta al mar.' },
];

export default function GaleriaPersonajes() {
  const personajesEscena = useMemo<PersonajeEscena[]>(
    () => [
      {
        id: "personaje1",
        nombre: "Primer Personaje",
        descripcion: "Modelo inicial de prueba para la vitrina 3D.",
        model: "/3d/personajes/personaje1.fbx",
        scale: 9,
        fitHeight: 4,
        rotation: [0, Math.PI * 0.05, 0] as [number, number, number],
      },
    ],
    [],
  );

  const [indiceActual, setIndiceActual] = useState(0);
  const personajeActivo = personajesEscena[indiceActual];

  const handleAnterior = () => {
    setIndiceActual((prev) => (prev - 1 + personajesEscena.length) % personajesEscena.length);
  };

  const handleSiguiente = () => {
    setIndiceActual((prev) => (prev + 1) % personajesEscena.length);
  };

  const sceneConfig = useMemo(
    () => ({
      atrilModel: "/3d/atril.fbx",
      characters: personajeActivo
        ? [
            {
              id: personajeActivo.id,
              model: personajeActivo.model,
              position: personajeActivo.position,
              rotation: personajeActivo.rotation,
              scale: personajeActivo.scale,
              fitHeight: personajeActivo.fitHeight,
              alignBottom: true,
            },
          ]
        : [],
    }),
    [personajeActivo],
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-amber-900">{personajeActivo?.nombre}</h3>
              <p className="mt-1 text-sm text-amber-900/80 leading-relaxed">
                {personajeActivo?.descripcion ?? "Selecciona un personaje para verlo sobre el atril."}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-800/70">
              <span>{indiceActual + 1}</span>
              <span className="text-amber-800/40">/</span>
              <span>{personajesEscena.length}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleAnterior}
              className="rounded-full border border-amber-200 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900 transition hover:border-amber-300 hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={handleSiguiente}
              className="rounded-full border border-amber-200 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900 transition hover:border-amber-300 hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
            >
              Siguiente
            </button>
          </div>

          <p className="text-xs text-amber-800/70">
            Los modelos deben guardarse en <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">public/3d/personajes</code>. Ajusta escala, rotación y posición según cada personaje.
          </p>
        </div>
        <AtrilScene {...sceneConfig} />
      </div>

      <p className="text-sm text-gray-600">
        Mientras cargamos los modelos definitivos, mantenemos esta grilla de referencias para seguir imaginando personajes.
      </p>
      {/* <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {MOCK_PERSONAJES.map((p) => (
          <div key={p.id} className="rounded-2xl border shadow-md overflow-hidden bg-white">
             <div className="h-28 flex">
              {p.colores.map((c, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div> 
             <div className="p-3">
              <div className="font-semibold">{p.nombre}</div>
              <div className="text-sm text-gray-600">{p.descripcion}</div>
            </div> 
          </div>
        ))}
      </div> */}
    </div>
  );
}
