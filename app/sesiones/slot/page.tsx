import Link from "next/link";
import { ThemedSection } from "@/components/themes";
import Slot777Vertical from "@/components/slot/Slot777Vertical";

export default function SlotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFF] to-white">
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f172a]"
        >
          <span aria-hidden>←</span>
          Regresar al libro
        </Link>

        <ThemedSection
          id="slot"
          className="mt-12"
          title="El animalario"
          eyebrow="Capítulo 06"
          description="Cerramos jugando con el azar. Este animalario digital combina cabezas, cuerpos y patas para inventar criaturas improbables que inspiran historias nuevas."
          highlights={[
            { icon: "🎰", title: "Combinatoria lúdica", text: "Gira las columnas y descubre mezclas inesperadas de rasgos y texturas." },
            { icon: "🐾", title: "Catálogo infinito", text: "Guarda tus criaturas favoritas para dibujarlas, animarlas o darles voz." },
            { icon: "🗣️", title: "Narraciones instantáneas", text: "Usa cada combinación como disparador para crear relatos colectivos." },
          ]}
        >
          <Slot777Vertical />
        </ThemedSection>
      </main>
    </div>
  );
}
