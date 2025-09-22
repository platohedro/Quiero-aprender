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
      title: '777 Vertical',
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
    <div className="space-y-4 text-slate-800">
      <p className="text-base md:text-lg leading-relaxed">
        Yo Quiero Aprender es una <strong>ruta interactiva</strong> pensada para niñas y niños curiosos. Cada parada reúne arte, música y juego para acompañar procesos creativos en casa o en talleres.
      </p>
      <p className="text-sm md:text-base text-slate-600">
        Desplázate con calma, respira y deja que cada sesión vaya contando la historia. Encontrarás instrucciones suaves en las tarjetas a la izquierda y el laboratorio vivo a la derecha.
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sesiones.map((sesion) => (
          <a
            key={sesion.id}
            href={`#${sesion.id}`}
            className="group relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-white/85 shadow-[0_16px_35px_rgba(16,185,129,0.12)] transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_24px_50px_rgba(16,185,129,0.22)]"
            aria-label={`Ir a ${sesion.title}`}
          >
            <div className="absolute inset-x-0 -top-16 h-32 bg-gradient-to-br from-emerald-200/60 via-emerald-100/40 to-white/0 blur-2xl transition-opacity duration-200 group-hover:opacity-80" aria-hidden />
            <div className="relative flex items-start gap-4 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl shadow-inner" aria-hidden>
                {sesion.icon}
              </span>
              <div className="space-y-2">
                <h3 className="font-display text-lg font-semibold text-emerald-900">
                  {sesion.title}
                </h3>
                <p className="text-sm text-emerald-900/80 leading-relaxed">
                  {sesion.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-display font-semibold uppercase tracking-wide text-emerald-700">
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
    <div className="space-y-4 text-slate-700">
      <p>
        Yo Quiero Aprender nació dentro de <strong>Platohedro</strong> como un laboratorio que combina pedagogías sensibles, fabricación digital y expresión artística. Esta versión es un prototipo que seguirá creciendo con lo que descubramos junto a lxs niñxs.
      </p>
      <p className="text-sm text-slate-600">
        Próximos pasos: integrar cámaras para subir imágenes reales, conservar combinaciones favoritas y abrir más guías para acompañantes y facilitadorxs.
      </p>
    </div>
  );
}

function Creditos() {
  return (
    <div className="space-y-3 text-slate-200">
      <p>
        <strong>Diseño y facilitación:</strong> Equipo Yo Quiero Aprender · Conexión Platohedro
      </p>
      <p>
        <strong>Desarrollo y prototipado:</strong> Tecnologías abiertas (Next.js, TypeScript, TailwindCSS) y mucho cariño colaborativo.
      </p>
      <p className="text-sm text-slate-400">
        Escríbenos para sumar ideas, proponer mejoras o llevar Yo Quiero Aprender a tu comunidad: <a className="underline decoration-amber-300/70" href="mailto:hola@platohedro.org">hola@platohedro.org</a>
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
      'acuarela',
      'slot',
      'laboratorio',
      'mesa',
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
          title="Mi primera semilla sonora"
          eyebrow="Sesión 01"
          description="Comenzamos sembrando ritmos suaves. Las semillas despiertan sonidos vivos que pueden mezclarse para crear paisajes colectivos."
          highlights={[
            { icon: '🌱', title: 'Sonidos que germinan', text: 'Activa loops suaves y experimenta con capas para construir tu primera banda sonora.' },
            { icon: '👐', title: 'Exploración libre', text: 'Arrastra, combina y escucha cómo cada semilla transforma el ambiente.' },
            { icon: '🎧', title: 'Atención plena', text: 'Invita a escuchar con calma, reconocer texturas y compartir lo que imaginan.' },
          ]}
        >
          <SemillasSonoras />
        </ThemedSection>
        <ThemedSection
          id="galeria"
          title="Galería de personajes imaginarios"
          eyebrow="Sesión 02"
          description="Vamos dando cara a las historias. Aquí viven criaturas fantásticas creadas por lxs peques, listas para inspirar nuevos relatos."
          highlights={[
            { icon: '🧚', title: 'Amigxs con historia', text: 'Cada personaje guarda un gesto, un color y una emoción para recordar.' },
            { icon: '📸', title: 'Memoria visual', text: 'Observa, describe y enlaza la galería con las experiencias de la sesión anterior.' },
            { icon: '🧵', title: 'Tejido colectivo', text: 'Conecta personajes entre sí y construye nuevas escenas en grupo.' },
          ]}
        >
          <GaleriaPersonajes />
        </ThemedSection>
        <ThemedSection
          id="acuarela"
          title="Pintura tipo acuarela digital"
          eyebrow="Sesión 03"
          description="Del sonido pasamos a la imagen fluida. Las manchas se expanden y los colores se mezclan como si tocaras papeles húmedos."
          highlights={[
            { icon: '🎨', title: 'Manchas vivas', text: 'Pinta con herramientas acuosas que se mueven, respiran y transforman la pantalla.' },
            { icon: '💧', title: 'Calma y respiración', text: 'Observa cómo el agua digital reacciona a la presión y al tiempo que esperas.' },
            { icon: '🖌️', title: 'Pinceles experimentales', text: 'Selecciona trazos con textura, brillo o degradados y mezcla tus propias paletas.' },
          ]}
        >
          <Acuarela />
        </ThemedSection>
        <ThemedSection
          id="slot"
          title="777 Vertical: azar creativo"
          eyebrow="Sesión 04"
          description="Giramos las columnas y dejamos que la suerte combine personajes, fondos y objetos. Perfecto para improvisar historias rápidas."
          highlights={[
            { icon: '🎰', title: 'Azar juguetón', text: 'Gira la máquina cuantas veces quieras hasta descubrir combinaciones que te sorprendan.' },
            { icon: '🔁', title: 'Secuencias infinitas', text: 'Guía a lxs peques para conectar resultados al azar con relatos colaborativos.' },
            { icon: '💡', title: 'Historias instantáneas', text: 'Usa cada tirada como disparador para dibujar, cantar o actuar en minutos.' },
          ]}
        >
          <Slot777Vertical />
        </ThemedSection>
        <ThemedSection
          id="laboratorio"
          title="Laboratorio de lava"
          eyebrow="Experimento sensorial"
          description="Luces neón, burbujas y movimientos hipnóticos. Este laboratorio invita a observar la magia líquida con atención plena."
          highlights={[
            { icon: '🧪', title: 'Magia líquida', text: 'Simula una lámpara de lava interactiva que cambia según el ritmo de tus clicks.' },
            { icon: '🌈', title: 'Paleta vibrante', text: 'Explora combinaciones neón que evocan ciencia ficción amable.' },
            { icon: '🤲', title: 'Experiencia segura', text: 'Ideal para momentos de pausa o meditación guiada con niñxs.' },
          ]}
        >
          <LavaLampLab />
        </ThemedSection>
        <ThemedSection
          id="mesa"
          title="Juego de mesa: autocuidado"
          eyebrow="Sesión comunitaria"
          description="Cerramos el recorrido trasladando lo aprendido a un tablero colaborativo que invita a cuidarnos mutuamente."
          highlights={[
            { icon: '🎲', title: 'Cooperación', text: 'Avanza en equipo superando retos que invitan a escucharnos.' },
            { icon: '💞', title: 'Cuidado colectivo', text: 'Cada casilla es una excusa para compartir cómo nos sentimos.' },
            { icon: '🪴', title: 'Rutinas amables', text: 'Construyan juntos hábitos y recordatorios para sostener el bienestar.' },
          ]}
        >
          <AutoCuidadoBoard />
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
