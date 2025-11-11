import Link from "next/link";
import { ThemedSection } from "@/components/themes";
import AutoCuidadoBoard from "@/components/mesa/AutoCuidadoBoard";

export default function MesaPage() {
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
          id="mesa"
          className="mt-12"
          title="Juego de mesa sobre el autocuidado"
          eyebrow="Capítulo 04"
          description="Convertimos las reflexiones en movimiento con un tablero colaborativo. Las casillas proponen retos, preguntas y abrazos que fortalecen el cuidado mutuo."
        >
          <AutoCuidadoBoard />
        </ThemedSection>
      </main>
    </div>
  );
}
