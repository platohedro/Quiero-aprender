import Link from "next/link";
import { ThemedSection } from "@/components/themes";
import LavaLampLab from "@/components/LavaLampLab";

export default function LaboratorioPage() {
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
          id="laboratorio"
          className="mt-12"
          title="Experimentos de ciencia con monstruos de lava"
          eyebrow="Capítulo 03"
          description="Exploramos la materia en movimiento con un laboratorio digital inspirado en las lámparas de lava. Ideal para observar, formular hipótesis y dejarse maravillar."
          highlights={[
            { icon: "🧪", title: "Química imaginada", text: "Simula mezclas viscosas que reaccionan a tus clics y generan criaturas danzantes." },
            { icon: "🌈", title: "Paletas neón", text: "Juega con combinaciones de color que remiten a experimentos lumínicos." },
            { icon: "🌀", title: "Observación pausada", text: "Una experiencia para respirar, enfocarse y narrar lo que sucede dentro del tubo." },
          ]}
        >
          <LavaLampLab />
        </ThemedSection>
      </main>
    </div>
  );
}
