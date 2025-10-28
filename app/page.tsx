"use client";
import React, { useEffect, useState } from "react";
import { ThemedSection, TopNav } from "@/components/themes";
import GaleriaPersonajes from "@/components/GaleriaPersonajes";
import Acuarela from "@/components/Acuarela";
import SemillasSonoras from "@/components/SemillasSonoras";
import Slot777Vertical from "@/components/slot/Slot777Vertical";
import LavaLampLab from "@/components/LavaLampLab";
import AutoCuidadoBoard from "@/components/mesa/AutoCuidadoBoard";

function Inicio() {
  const sesiones = [
    {
      id: 'semillas',
      title: 'Mi primera semilla sonora',
      icon: '🌱',
      description: 'Activa loops, mezcla texturas y crea paisajes musicales en segundos.',
    },
    {
      id: 'galeria',
      title: 'Galería de personajes',
      icon: '🧚',
      description: 'Explora criaturas inventadas por lxs peques y arma nuevas historias.',
    },
    {
      id: 'acuarela',
      title: 'Pintura tipo acuarela',
      icon: '🎨',
      description: 'Pinta con manchas vivas que se expanden y se mezclan como agua real.',
    },
    {
      id: 'slot',
      title: 'Animalario',
      icon: '🎰',
      description: 'Gira las columnas y deja que el azar combine escenarios e ideas.',
    },
    {
      id: 'laboratorio',
      title: 'Laboratorio de lava',
      icon: '🧪',
      description: 'Observa burbujas neón que reaccionan a tu ritmo y movimientos.',
    },
    {
      id: 'mesa',
      title: 'Juego de autocuidado',
      icon: '🎲',
      description: 'Recorre un tablero cooperativo para compartir emociones y cuidados.',
    },
  ];

  return (
    <div className="space-y-4 text-brand-ink">
      <p className="text-base leading-relaxed md:text-lg">
        “Yo quiero aprender…” es un libro interactivo creado por más de 100 niñas y niños del proyecto Matinée, una propuesta pedagógica y artística de la Corporación Platohedro. El proceso obtuvo en 2025 el estímulo del Presupuesto Participativo de la Comuna 9 – Buenos Aires, dentro de la línea de narrativas digitales y expresión cultural en Arte, Cultura, Ciencia y Tecnología.
      </p>
      <p className="text-base leading-relaxed md:text-lg">
        El libro reúne seis capítulos que recogen los aprendizajes y exploraciones del año: el cuidado de la semilla, la creación de personajes fantásticos, experimentos científicos con monstruos de lava, un juego sobre autocuidado, pintura en acuarela y un animalario vibrante. Cada capítulo resguarda las experiencias, hallazgos y voces creativas de las niñas y los niños que hacen parte del proyecto.
      </p>
      <p className="text-base leading-relaxed md:text-lg">
        Con “Yo quiero aprender…” buscamos potenciar y expandir los procesos creativos y pedagógicos de las infancias que integran Matinée, un espacio que desde 2007 cultiva el encuentro, la imaginación y el aprendizaje colectivo en Platohedro. Hoy lo conforman más de cien participantes entre 5 y 13 años, quienes semana a semana exploran el arte para conocer el mundo y construir comunidad.
      </p>
      <p className="text-sm text-brand-ink/70 md:text-base">
        Desplázate con calma, respira y deja que cada sesión vaya contando la historia. Encontrarás instrucciones
        suaves en las tarjetas a la izquierda y el laboratorio vivo a la derecha.
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sesiones.map((sesion) => (
          <a
            key={sesion.id}
            href={`#${sesion.id}`}
            className="group relative overflow-hidden rounded-2xl border border-brand-lavender/30 bg-brand-paper/90 shadow-[0_16px_32px_rgba(29,27,41,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-brand-lavender/50 hover:shadow-[0_24px_48px_rgba(29,27,41,0.08)]"
            aria-label={`Ir a ${sesion.title}`}
          >
            <div
              className="absolute inset-x-0 -top-16 h-32 bg-[radial-gradient(circle_at_top,var(--color-sky)_0%,rgba(255,255,255,0.1)_70%)] opacity-80 blur-2xl transition-opacity duration-200 group-hover:opacity-100"
              aria-hidden
            />
            <div className="relative flex items-start gap-4 p-5">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-sky/40 text-2xl text-brand-ink shadow-inner"
                aria-hidden
              >
                {sesion.icon}
              </span>
              <div className="space-y-2">
                <h3 className="font-display text-lg font-semibold text-brand-ink">{sesion.title}</h3>
                <p className="text-sm leading-relaxed text-brand-ink/70">{sesion.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-display font-semibold uppercase tracking-wide text-brand-ink/60">
                  Explorar
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function Sobre() {
  return (
    <div className="space-y-4 text-brand-ink/80">
      <p>
        Yo Quiero Aprender nació dentro de <strong>Platohedro</strong> como un laboratorio que combina pedagogías sensibles, fabricación digital y expresión artística. Esta versión es un prototipo que seguirá creciendo con lo que descubramos junto a lxs niñxs.
      </p>
      <p className="text-sm text-brand-ink/60">
        Próximos pasos: integrar cámaras para subir imágenes reales, conservar combinaciones favoritas y abrir más guías para acompañantes y facilitadorxs.
      </p>
    </div>
  );
}

function Creditos() {
  return (
    <div className="space-y-3 text-brand-paper">
      <p>
        <strong>Diseño y facilitación:</strong> Equipo Yo Quiero Aprender · Conexión Platohedro
      </p>
      <p>
        <strong>Desarrollo y prototipado:</strong> Tecnologías abiertas (Next.js, TypeScript, TailwindCSS) y mucho cariño colaborativo.
      </p>
      <p className="text-sm text-brand-paper/70">
        Escríbenos para sumar ideas, proponer mejoras o llevar Yo Quiero Aprender a tu comunidad:{" "}
        <a className="underline decoration-brand-rose/70" href="mailto:hola@platohedro.org">
          hola@platohedro.org
        </a>
      </p>
    </div>
  );
}

export default function YoQuieroAprenderApp() {
  const [tab, setTab] = useState('inicio');

  useEffect(() => {
    const id = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    if (id) setTab(id);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  }, [tab]);

  const handleSectionChange = (id: string) => {
    if (typeof window !== 'undefined') {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (id !== tab) {
      setTab(id);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sectionIds = [
      'inicio',
      'semillas',
      'galeria',
      'laboratorio',
      'mesa',
      'acuarela',
      'slot',
      'sobre',
      'creditos',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible && visible.target.id) {
          setTab((prev) => (prev === visible.target.id ? prev : visible.target.id));
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: '-25% 0px -35% 0px',
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <TopNav current={tab} onChange={handleSectionChange} />
      <main className="overflow-x-hidden pb-24">
        <ThemedSection id="inicio" title="Bienvenid@s" eyebrow="Explora jugando">
          <Inicio />
        </ThemedSection>
        <ThemedSection
          id="semillas"
          title="El cuidado de la semilla"
          eyebrow="Capítulo 01"
          description="Abrimos el camino preparando el terreno y escuchando a las semillas que despiertan. Cada interacción es un recordatorio de la paciencia, el riego y el afecto necesarios para que la vida brote."
          highlights={[
            { icon: '🌱', title: 'Siembra sonora', text: 'Cada semilla responde con una textura musical distinta que simboliza su crecimiento.' },
            { icon: '🪴', title: 'Rituales de riego', text: 'Diseña rutinas breves que invitan a cuidar, observar y registrar cambios día a día.' },
            { icon: '🎧', title: 'Escucha atenta', text: 'El ejercicio propone bajar el ritmo, identificar sonidos y compartir lo que evocan.' },
          ]}
        >
          <SemillasSonoras />
        </ThemedSection>
        <ThemedSection
          id="galeria"
          title="Creación de personajes fantásticos"
          eyebrow="Capítulo 02"
          description="De las semillas pasamos a imaginar seres singulares. Esta vitrina 3D reúne personajes creados por las niñas y niños, listos para contar historias nuevas."
          highlights={[
            { icon: '🧚', title: 'Universos propios', text: 'Cada personaje conserva su postura, escala y energía original.' },
            { icon: '📸', title: 'Memoria visual', text: 'La galería permite girar y acercar cada creación para reconocer detalles y materiales.' },
            { icon: '🧵', title: 'Historias conectadas', text: 'Invita a tejer relatos colectivos combinando personajes y escenarios.' },
          ]}
        >
          <GaleriaPersonajes />
        </ThemedSection>
        <ThemedSection
          id="laboratorio"
          title="Experimentos de ciencia con monstruos de lava"
          eyebrow="Capítulo 03"
          description="Exploramos la materia en movimiento con un laboratorio digital inspirado en las lámparas de lava. Ideal para observar, formular hipótesis y dejarse maravillar."
          highlights={[
            { icon: '🧪', title: 'Química imaginada', text: 'Simula mezclas viscosas que reaccionan a tus clics y generan criaturas danzantes.' },
            { icon: '🌈', title: 'Paletas neón', text: 'Juega con combinaciones de color que remiten a experimentos lumínicos.' },
            { icon: '🌀', title: 'Observación pausada', text: 'Una experiencia para respirar, enfocarse y narrar lo que sucede dentro del tubo.' },
          ]}
        >
          <LavaLampLab />
        </ThemedSection>
        <ThemedSection
          id="mesa"
          title="Juego de mesa sobre el autocuidado"
          eyebrow="Capítulo 04"
          description="Convertimos las reflexiones en movimiento con un tablero colaborativo. Las casillas proponen retos, preguntas y abrazos que fortalecen el cuidado mutuo."
       
        >
          <AutoCuidadoBoard />
        </ThemedSection>
        <ThemedSection
          id="acuarela"
          title="Pintura en acuarela"
          eyebrow="Capítulo 05"
          description="El agua, el pigmento y el papel se encuentran en una experiencia que celebra los gestos espontáneos. Esta herramienta digital imita manchas, veladuras y texturas húmedas."
         
        >
          <Acuarela />
        </ThemedSection>
        <ThemedSection
          id="slot"
          title="El animalario"
          eyebrow="Capítulo 06"
          description="Cerramos jugando con el azar. Este animalario digital combina cabezas, cuerpos y patas para inventar criaturas improbables que inspiran historias nuevas."
          highlights={[
            { icon: '🎰', title: 'Combinatoria lúdica', text: 'Gira las columnas y descubre mezclas inesperadas de rasgos y texturas.' },
            { icon: '🐾', title: 'Catálogo infinito', text: 'Guarda tus criaturas favoritas para dibujarlas, animarlas o darles voz.' },
            { icon: '🗣️', title: 'Narraciones instantáneas', text: 'Usa cada combinación como disparador para crear relatos colectivos.' },
          ]}
        >
          <Slot777Vertical />
        </ThemedSection>
        <ThemedSection
          id="sobre"
          title="Sobre Yo Quiero Aprender"
          eyebrow="Contexto"
          description="Un laboratorio abierto que sigue mutando gracias a las comunidades que lo activan."
          highlights={[
            { icon: '🚀', title: 'Prototipo vivo', text: 'Documentamos aprendizajes para que cualquiera pueda replicarlo y adaptarlo.' },
            { icon: '🤝', title: 'Trabajo en red', text: 'Colaboramos con artistas, educadorxs y hackers culturales.' },
          ]}
        >
          <Sobre />
        </ThemedSection>
        <ThemedSection
          id="creditos"
          title="Créditos y contacto"
          eyebrow="Gracias"
          highlights={[
            { icon: '📬', title: 'Escríbenos', text: 'Abrimos canales para co-crear nuevas sesiones y recibir comentarios.' },
            { icon: '🛠️', title: 'Tecnología abierta', text: 'Código libre y reutilizable para que puedas adaptarlo a tu realidad.' },
          ]}
        >
          <Creditos />
        </ThemedSection>
      </main>
      <footer className="py-10 text-center text-sm text-gray-600">© {new Date().getFullYear()} Yo Quiero Aprender · Prototipo</footer>
    </div>
  );
}
