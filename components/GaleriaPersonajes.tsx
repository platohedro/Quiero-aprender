"use client";
import React from "react";

export type Personaje = { id: string; nombre: string; colores: string[]; descripcion: string };

const MOCK_PERSONAJES: Personaje[] = [
  { id: 'p1', nombre: 'Luna Tigresa', colores: ['#ff6b6b', '#ffe66d', '#4ecdc4'], descripcion: 'Valiente y brillante.' },
  { id: 'p2', nombre: 'Robotito Azul', colores: ['#5dade2', '#d6eaf8', '#273746'], descripcion: 'Curioso explorador.' },
  { id: 'p3', nombre: 'Sapo Disco', colores: ['#58d68d', '#daf7a6', '#1d8348'], descripcion: 'Baila sin parar.' },
  { id: 'p4', nombre: 'Zorro Sol', colores: ['#f39c12', '#fdebd0', '#d35400'], descripcion: 'Astuto y cálido.' },
  { id: 'p5', nombre: 'Avi Koala', colores: ['#a29bfe', '#dfe6e9', '#6c5ce7'], descripcion: 'Sueña alto.' },
  { id: 'p6', nombre: 'Sirena Pico', colores: ['#00cec9', '#81ecec', '#0984e3'], descripcion: 'Canta al mar.' },
];

export default function GaleriaPersonajes() {
  return (
    <div>
      <p className="mb-4 text-gray-700">Galería provisional. Luego conectamos imágenes reales.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      </div>
    </div>
  );
}
