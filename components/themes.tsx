"use client";
import React, { useEffect, useRef, useState } from "react";

type SectionTheme = {
  background: string;
  overlay?: string;
  title: string;
  content: string;
  card: string;
  chip: string;
  accent?: string;
  parallaxSpeed?: number;
  cardTitle: string;
  cardBody: string;
  descriptionText?: string;
  childWrapper?: string;
  childWrapperWithHighlights?: string;
  outerContainer?: string;
};

const SECTION_THEMES: Record<string, SectionTheme> = {
  semillas: {
    background: "bg-gradient-to-br from-emerald-100 via-lime-100 to-amber-100",
    overlay: "bg-gradient-to-b from-emerald-200/40 via-white/40 to-amber-200/40",
    title: "text-green-900 drop-shadow-[0_3px_12px_rgba(21,128,61,0.25)]",
    content: "bg-white/80 backdrop-blur border-green-200/70 shadow-[0_24px_50px_rgba(34,197,94,0.20)]",
    card: "bg-white/80 border-green-200/80 shadow-[0_16px_35px_rgba(22,163,74,0.18)]",
    chip: "bg-emerald-100 text-emerald-700",
    parallaxSpeed: 0.18,
    cardTitle: "text-emerald-900",
    cardBody: "text-emerald-900/80",
    descriptionText: "text-emerald-900",
  },
  galeria: {
    background: "bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100",
    overlay: "bg-gradient-to-b from-orange-200/40 via-white/30 to-amber-200/40",
    title: "text-orange-900 drop-shadow-[0_3px_12px_rgba(251,191,36,0.4)]",
    content: "bg-white/85 backdrop-blur border-amber-200/70 shadow-[0_24px_50px_rgba(251,191,36,0.25)]",
    card: "bg-white/85 border-amber-200/80 shadow-[0_16px_35px_rgba(251,191,36,0.22)]",
    chip: "bg-amber-100 text-amber-700",
    parallaxSpeed: 0.16,
    cardTitle: "text-orange-900",
    cardBody: "text-amber-900/80",
    descriptionText: "text-amber-900",
  },
  acuarela: {
    background: "bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100",
    overlay: "bg-gradient-to-b from-sky-200/40 via-white/30 to-pink-200/40",
    title: "text-purple-900 drop-shadow-[0_3px_12px_rgba(147,51,234,0.25)]",
    content: "bg-white/85 backdrop-blur border-purple-200/70 shadow-[0_24px_60px_rgba(147,51,234,0.25)]",
    card: "bg-white/80 border-purple-200/80 shadow-[0_16px_35px_rgba(147,51,234,0.18)]",
    chip: "bg-purple-100 text-purple-700",
    parallaxSpeed: 0.2,
    cardTitle: "text-purple-900",
    cardBody: "text-purple-900/80",
    descriptionText: "text-purple-900",
  },
  slot: {
    background: "bg-transparent",
    overlay: "",
    title: "text-emerald-400 drop-shadow-[0_0_18px_rgba(16,185,129,0.7)]",
    content: "!bg-transparent !border-none !shadow-none !p-4 sm:!p-5 md:!p-6",
    card: "bg-gray-900/80 border-emerald-400/40 shadow-[0_12px_28px_rgba(16,185,129,0.3)]",
    chip: "bg-emerald-500/20 text-emerald-300",
    parallaxSpeed: 0.1,
    cardTitle: "text-emerald-100",
    cardBody: "text-emerald-100/85",
    descriptionText: "text-emerald-200",
    childWrapperWithHighlights: "!border-none !bg-transparent !shadow-none !backdrop-blur-none !p-0 md:!p-0",
    outerContainer: "!border-none !bg-transparent !shadow-none !p-0 md:!p-0",
  },
  laboratorio: {
    background: "bg-gradient-to-br from-sky-50 via-white to-indigo-50",
    overlay: "bg-gradient-to-b from-sky-200/30 via-white/40 to-indigo-200/30",
    title: "text-sky-700 drop-shadow-sm",
    content: "bg-white/85 backdrop-blur border-sky-200/70 shadow-[0_24px_50px_rgba(56,189,248,0.18)]",
    card: "bg-white/85 border-sky-200/70 shadow-[0_16px_35px_rgba(14,165,233,0.18)]",
    chip: "bg-sky-100 text-sky-700",
    parallaxSpeed: 0.22,
    cardTitle: "text-sky-900",
    cardBody: "text-sky-900/80",
  },
  mesa: {
    background: "bg-gradient-to-br from-rose-100 via-pink-100 to-red-100",
    overlay: "bg-gradient-to-b from-rose-200/35 via-white/30 to-red-200/35",
    title: "text-rose-900 drop-shadow-[0_3px_12px_rgba(244,114,182,0.25)]",
    content: "bg-white/85 backdrop-blur border-rose-200/70 shadow-[0_24px_55px_rgba(244,114,182,0.28)]",
    card: "bg-white/85 border-rose-200/70 shadow-[0_16px_35px_rgba(236,72,153,0.22)]",
    chip: "bg-rose-100 text-rose-700",
    parallaxSpeed: 0.18,
    cardTitle: "text-rose-900",
    cardBody: "text-rose-900/80",
  },
  inicio: {
    background: "bg-gradient-to-br from-sky-100 via-emerald-100 to-amber-100",
    overlay: "bg-gradient-to-b from-white/60 via-white/20 to-emerald-200/30",
    title: "text-slate-900 drop-shadow-[0_3px_10px_rgba(15,118,110,0.25)]",
    content: "bg-white/85 backdrop-blur border-emerald-200/70 shadow-[0_20px_45px_rgba(15,118,110,0.18)]",
    card: "bg-white/85 border-emerald-200/70 shadow-[0_16px_30px_rgba(15,118,110,0.16)]",
    chip: "bg-emerald-200/60 text-emerald-700",
    parallaxSpeed: 0.2,
    cardTitle: "text-emerald-900",
    cardBody: "text-emerald-900/80",
  },
  sobre: {
    background: "bg-gradient-to-br from-slate-100 via-white to-slate-50",
    overlay: "bg-gradient-to-b from-white/70 via-white/20 to-slate-200/30",
    title: "text-slate-800",
    content: "bg-white/85 backdrop-blur border-slate-200/70 shadow-[0_12px_35px_rgba(100,116,139,0.18)]",
    card: "bg-white/85 border-slate-200/70 shadow-[0_16px_28px_rgba(71,85,105,0.16)]",
    chip: "bg-slate-100 text-slate-700",
    parallaxSpeed: 0.16,
    cardTitle: "text-slate-900",
    cardBody: "text-slate-700",
  },
  creditos: {
    background: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    overlay: "bg-gradient-to-b from-white/10 via-transparent to-slate-900/60",
    title: "text-white drop-shadow-[0_0_12px_rgba(148,163,184,0.7)]",
    content: "bg-slate-900/80 text-slate-100 backdrop-blur border-slate-600/60 shadow-[0_24px_50px_rgba(15,23,42,0.5)]",
    card: "bg-slate-900/80 border-slate-700/60 shadow-[0_16px_35px_rgba(15,23,42,0.45)]",
    chip: "bg-slate-700/60 text-slate-200",
    parallaxSpeed: 0.12,
    cardTitle: "text-slate-100",
    cardBody: "text-slate-100/80",
    descriptionText: "text-slate-100/85",
  },
  default: {
    background: "bg-gradient-to-br from-slate-100 via-white to-slate-100",
    overlay: "bg-gradient-to-b from-white/70 via-white/20 to-slate-200/40",
    title: "text-slate-900",
    content: "bg-white/85 backdrop-blur border-slate-200/70 shadow-lg",
    card: "bg-white/85 border-slate-200/60 shadow",
    chip: "bg-slate-100 text-slate-700",
    parallaxSpeed: 0.18,
    cardTitle: "text-slate-900",
    cardBody: "text-slate-700",
  },
};

type ThemedSectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  eyebrow?: string;
  description?: string;
  highlights?: Array<{ id?: string; title: string; text: string; icon?: string }>;
};

function useParallax(speed: number) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === "undefined") return;

    let raf = 0;

    const update = () => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const offset = rect.top * speed;
      node.style.transform = `translateY(${offset}px)`;
      raf = 0;
    };

    const handleScroll = () => {
      if (raf !== 0) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", update);
    };
  }, [speed]);

  return ref;
}

function RevealCard({
  theme,
  title,
  text,
  icon,
  index,
}: {
  theme: SectionTheme;
  title: string;
  text: string;
  icon?: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group overflow-hidden rounded-2xl border p-4 transition-all duration-500 ease-out ${theme.card} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <span className={`mt-1 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/30 text-lg font-semibold ${theme.chip}`}>
            {icon}
          </span>
        ) : null}
        <div className="space-y-1">
          <h3 className={`text-base font-display font-semibold tracking-wide ${theme.cardTitle}`}>{title}</h3>
          <p className={`text-sm leading-relaxed ${theme.cardBody}`}>{text}</p>
        </div>
      </div>
    </div>
  );
}

export function ThemedSection({ id, title, children, eyebrow, description, highlights }: ThemedSectionProps) {
  const theme = SECTION_THEMES[id as keyof typeof SECTION_THEMES] || SECTION_THEMES.default;
  const backgroundRef = useParallax(theme.parallaxSpeed ?? 0.18);
  const highlightItems = highlights ?? [];
  const hasHighlights = highlightItems.length > 0;
  const highlightWrapperClass =
    theme.childWrapperWithHighlights ??
    "rounded-2xl border border-white/10 bg-white/30 p-4 shadow-sm backdrop-blur";
  const defaultWrapperClass = theme.childWrapper ?? "";
  const childWrapperClass = hasHighlights ? highlightWrapperClass : defaultWrapperClass;

  return (
    <section
      id={id}
      className="relative isolate mx-auto mt-20 flex w-full max-w-6xl scroll-mt-24 flex-col px-4 first:mt-10"
    >
      <div className="absolute inset-0 -z-20 overflow-hidden rounded-[32px]">
        <div ref={backgroundRef} className={`absolute inset-0 ${theme.background}`} />
        <div className={`absolute inset-0 ${theme.overlay ?? ""}`} />
      </div>
      <div
        className={`relative flex flex-col gap-8 rounded-[32px] border border-white/10 bg-white/5 p-6 pb-10 shadow-[0_18px_45px_rgba(15,23,42,0.08)] md:p-10 ${
          theme.outerContainer ?? ''
        }`}
      >
        <div>
          {eyebrow ? (
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${theme.chip}`}>
              {eyebrow}
            </span>
          ) : null}
          <h2 className={`mt-4 text-2xl font-display font-bold md:text-3xl ${theme.title}`}>{title}</h2>
          {description ? (
            <p
              className={`mt-3 max-w-2xl text-base md:text-lg leading-relaxed ${
                theme.descriptionText ?? 'text-slate-700/80 dark:text-slate-200/80'
              }`}
            >
              {description}
            </p>
          ) : null}
        </div>
        {hasHighlights ? (
          <div className="-mx-2 flex gap-4 overflow-x-auto pb-1 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible xl:grid-cols-3">
            {highlightItems.map((highlight, idx) => (
              <div className="min-w-[220px] flex-1 md:min-w-0" key={highlight.id ?? `${highlight.title}-${idx}`}>
                <RevealCard
                  theme={theme}
                  title={highlight.title}
                  text={highlight.text}
                  icon={highlight.icon}
                  index={idx}
                />
              </div>
            ))}
          </div>
        ) : null}
        <div className={`rounded-[28px] border p-5 md:p-8 ${theme.content} ${childWrapperClass}`}>
          {children}
        </div>
      </div>
    </section>
  );
}

export function TopNav({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  const tabs = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'semillas', label: 'Semillas' },
    { id: 'galeria', label: 'Galería' },
    { id: 'acuarela', label: 'Acuarela' },
    { id: 'slot', label: '777 Vertical' },
    { id: 'laboratorio', label: 'Laboratorio' },
    { id: 'mesa', label: 'Autocuidado' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'creditos', label: 'Créditos' },
  ];
  return (
    <nav className="sticky top-0 z-50 bg-amber-50/80 backdrop-blur border-b border-amber-200/70 shadow-[0_12px_30px_rgba(251,191,36,0.25)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-16 flex-wrap items-center gap-3 py-2 md:flex-nowrap">
          <div className="flex items-center gap-2 text-amber-900">
            <span className="text-2xl" aria-hidden>🌞</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide">Yo Quiero Aprender</p>
              <p className="text-base font-bold leading-tight">Arte · Ciencia · Juego</p>
            </div>
          </div>
          <div className="flex-1" />
          <ul
            className="flex w-full max-w-full items-center gap-2 overflow-x-auto rounded-full border border-amber-200/60 bg-white/70 px-2 py-1 text-amber-900 md:max-w-3xl"
            role="tablist"
            aria-label="Secciones"
          >
            {tabs.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => onChange(t.id)}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-display font-semibold tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
                    current === t.id
                      ? 'bg-amber-500 text-amber-950 shadow-[0_8px_18px_rgba(251,191,36,0.45)]'
                      : 'bg-transparent text-amber-800 hover:bg-amber-200/70'
                  }`}
                  aria-current={current === t.id ? 'page' : undefined}
                  role="tab"
                  aria-selected={current === t.id}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
