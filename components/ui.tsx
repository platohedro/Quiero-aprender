"use client";
import React from "react";

export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 w-full max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
      <div className="rounded-2xl border border-gray-300 p-4 md:p-6 bg-white/70 backdrop-blur shadow-md">
        {children}
      </div>
    </section>
  );
}
