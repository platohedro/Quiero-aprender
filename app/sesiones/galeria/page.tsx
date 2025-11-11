import Link from "next/link";
import { ThemedSection } from "@/components/themes";
import GaleriaPersonajes from "@/components/GaleriaPersonajes";

export default function GaleriaPage() {
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
          id="galeria"
          className="mt-12"
          title="Creación de personajes fantásticos"
          eyebrow="Capítulo 02"
          description="De las semillas pasamos a imaginar seres singulares. Esta vitrina 3D reúne personajes creados por las niñas y niños, listos para contar historias nuevas."
        >
          <GaleriaPersonajes />
        </ThemedSection>
      </main>
    </div>
  );
}
