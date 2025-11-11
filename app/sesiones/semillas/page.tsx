import Link from "next/link";
import { ThemedSection } from "@/components/themes";
import SemillasSonoras from "@/components/SemillasSonoras";
import Marimba from "@/components/Marimba";

export default function SemillasPage() {
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
          id="semillas"
          className="mt-12"
          title="El cuidado de la semilla"
          eyebrow="Capítulo 01"
          description="Abrimos el camino preparando el terreno y escuchando a las semillas que despiertan. Cada interacción es un recordatorio de la paciencia, el riego y el afecto necesarios para que la vida brote."
          highlights={[
            { icon: "🌱", title: "Siembra sonora", text: "Cada semilla responde con una textura musical distinta que simboliza su crecimiento." },
            { icon: "🪴", title: "Rituales de riego", text: "Diseña rutinas breves que invitan a cuidar, observar y registrar cambios día a día." },
            { icon: "🎧", title: "Escucha atenta", text: "El ejercicio propone bajar el ritmo, identificar sonidos y compartir lo que evocan." },
          ]}
        >
          <div className="space-y-12">
            <div>
              <h4 className="mb-2 font-display text-base font-semibold text-[#0f172a]">Galería de semillas sonoras</h4>
              <SemillasSonoras />
            </div>
            <div>
              <h4 className="mb-2 font-display text-base font-semibold text-[#0f172a]">Marimba</h4>
              <Marimba />
            </div>
          </div>
        </ThemedSection>
      </main>
    </div>
  );
}
