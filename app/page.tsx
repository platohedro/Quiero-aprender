"use client";
import React, { CSSProperties, useEffect, useState } from "react";
import { ThemedSection, TopNav } from "@/components/themes";
import GaleriaPersonajes from "@/components/GaleriaPersonajes";
import Acuarela from "@/components/Acuarela";
import SemillasSonoras from "@/components/SemillasSonoras";
import Marimba from "@/components/Marimba";
import Slot777Vertical from "@/components/slot/Slot777Vertical";
import LavaLampLab from "@/components/LavaLampLab";
import AutoCuidadoBoard from "@/components/mesa/AutoCuidadoBoard";
import ScrollToTopButton from "@/components/ScrollToTopButton";

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

  const shadowColors = ["#80C1DD", "#F2AADC", "#DCF2AA", "#C0AAF2"];

  return (
    <div className="space-y-6 text-[#1f2937]">
      <h2 className="text-base leading-relaxed md:text-lg font-semibold">
        ¡Hola! Somos las niñas y los niños de Matinée
      </h2>
      <p className="text-base leading-relaxed md:text-lg">
        Este libro se llama “Yo quiero aprender…” y lo hicimos nosotras y nosotros, más de cien niñas y niños que hacemos parte de Matinée, un espacio donde jugamos, imaginamos y aprendemos juntos en Platohedro.
      </p>
      <p className="text-base leading-relaxed md:text-lg">
        En el 2025 recibimos una gran noticia: nuestro proyecto ganó el estímulo del Presupuesto Participativo de la Comuna 9 – Buenos Aires, en la línea de Narrativas digitales y expresión cultural en Arte, Cultura, Ciencia y Tecnología. ¡Gracias a eso pudimos crear este libro digital que ahora estás leyendo! 💫
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sesiones.map((sesion, index) => (
          <a
            key={sesion.id}
            href={`#${sesion.id}`}
            className="group sticker-card block"
            aria-label={`Ir a ${sesion.title}`}
            style={{ "--shadow-color": shadowColors[index % shadowColors.length] } as CSSProperties}
          >
            <div className="relative flex items-start gap-4">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black text-2xl text-[#0f172a]"
                style={{ backgroundColor: shadowColors[index % shadowColors.length] }}
                aria-hidden
              >
                {sesion.icon}
              </span>
              <div className="space-y-2">
                <h3 className="font-display text-lg font-semibold text-[#0f172a]">{sesion.title}</h3>
                <p className="text-sm leading-relaxed text-[#374151]">{sesion.description}</p>
                <span className="inline-flex items-center gap-2 text-xs font-display font-semibold uppercase tracking-[0.3em] text-[#0f172a]">
                  Explorar
                  <span className="transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-110">→</span>
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
    <div className="space-y-4 text-[#1f2937]">
      <p>
        Yo Quiero Aprender nació dentro de <strong>Platohedro</strong> como un laboratorio que combina pedagogías sensibles, fabricación digital y expresión artística. Esta versión es un prototipo que seguirá creciendo con lo que descubramos junto a lxs niñxs.
      </p>
      <p className="text-sm text-[#475569]">
        Próximos pasos: integrar cámaras para subir imágenes reales, conservar combinaciones favoritas y abrir más guías para acompañantes y facilitadorxs.
      </p>
    </div>
  );
}

function Creditos() {
  return (
    <div className="space-y-3 text-[#0f172a]">
      <p>
        <strong>Diseño y facilitación:</strong> Equipo Yo Quiero Aprender · Conexión Platohedro
      </p>
      <p>
        <strong>Desarrollo y prototipado:</strong> Tecnologías abiertas (Next.js, TypeScript, TailwindCSS) y mucho cariño colaborativo.
      </p>
      <p className="text-sm text-[#475569]">
        Escríbenos para sumar ideas, proponer mejoras o llevar Yo Quiero Aprender a tu comunidad:{" "}
        <a className="underline decoration-2 underline-offset-4" href="mailto:hola@platohedro.org">
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
        <ThemedSection
          id="galeria"
          title="Creación de personajes fantásticos"
          eyebrow="Capítulo 02"
          description="De las semillas pasamos a imaginar seres singulares. Esta vitrina 3D reúne personajes creados por las niñas y niños, listos para contar historias nuevas."
        
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
      <footer className="py-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Yo Quiero Aprender · Prototipo</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://www.terredeshommes.ch/es"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-[28px] border-2 border-black bg-white px-4 py-2 shadow-[6px_6px_0_#BFF49F]"
            >
              <img src="/logo TDH.png" alt="Terre des Hommes Schweiz" className="h-16 w-auto" />
            </a>
            <a
              href="https://www.medellin.gov.co"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-[28px] border-2 border-black bg-white px-4 py-2 shadow-[6px_6px_0_#C0AAF2]"
            >
              <img
                src="/ALCALDIA.png"
                alt="Alcaldía de Medellín"
                className="h-24 w-auto"
              />
            </a>
          </div>
        </div>
      </footer>
      <ScrollToTopButton />
    </div>
  );
}
