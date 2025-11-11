import Link from "next/link";
import { ThemedSection } from "@/components/themes";
import Acuarela from "@/components/Acuarela";

export default function AcuarelaPage() {
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
          id="acuarela"
          className="mt-12"
          title="Pintura en acuarela"
          eyebrow="Capítulo 05"
          description="El agua, el pigmento y el papel se encuentran en una experiencia que celebra los gestos espontáneos. Esta herramienta digital imita manchas, veladuras y texturas húmedas."
        >
          <Acuarela />
        </ThemedSection>
      </main>
    </div>
  );
}
