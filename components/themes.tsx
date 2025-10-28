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
  parallaxAccents?: string[];
};

const SECTION_THEMES: Record<string, SectionTheme> = {
  semillas: {
    background: "bg-[radial-gradient(circle_at_top,var(--color-lime)_0%,rgba(255,255,255,0.92)_55%,var(--color-sky)_100%)]",
    overlay: "bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_100%)]",
    title: "text-brand-ink",
    content: "bg-brand-paper/90 backdrop-blur border border-brand-lime/30 shadow-[0_20px_48px_rgba(29,27,41,0.08)]",
    card: "bg-brand-paper/85 border border-brand-lime/25 shadow-[0_16px_36px_rgba(29,27,41,0.07)]",
    chip: "bg-brand-lime/40 text-brand-ink",
    parallaxSpeed: 0.16,
    cardTitle: "text-brand-ink",
    cardBody: "text-brand-ink/80",
    descriptionText: "text-brand-ink/70",
    parallaxAccents: ["rgba(128,193,221,0.75)", "rgba(220,242,170,0.7)", "rgba(242,170,220,0.6)"],
  },
  galeria: {
    background: "bg-[radial-gradient(circle_at_top,var(--color-lavender)_0%,rgba(255,255,255,0.9)_50%,var(--color-rose)_100%)]",
    overlay: "bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_100%)]",
    title: "text-brand-ink",
    content: "bg-brand-paper/90 backdrop-blur border border-brand-lavender/35 shadow-[0_18px_44px_rgba(29,27,41,0.08)]",
    card: "bg-brand-paper/85 border border-brand-lavender/30 shadow-[0_14px_32px_rgba(29,27,41,0.07)]",
    chip: "bg-brand-lavender/40 text-brand-ink",
    parallaxSpeed: 0.16,
    cardTitle: "text-brand-ink",
    cardBody: "text-brand-ink/80",
    descriptionText: "text-brand-ink/70",
    parallaxAccents: ["rgba(192,170,242,0.7)", "rgba(242,170,220,0.65)", "rgba(128,193,221,0.55)"],
  },
  acuarela: {
    background: "bg-[radial-gradient(circle_at_top,var(--color-sky)_0%,rgba(255,255,255,0.9)_52%,var(--color-lavender)_100%)]",
    overlay: "bg-[linear-gradient(180deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_100%)]",
    title: "text-brand-ink",
    content: "bg-brand-paper/90 backdrop-blur border border-brand-sky/30 shadow-[0_20px_48px_rgba(29,27,41,0.08)]",
    card: "bg-brand-paper/85 border border-brand-sky/25 shadow-[0_16px_36px_rgba(29,27,41,0.07)]",
    chip: "bg-brand-sky/40 text-brand-ink",
    parallaxSpeed: 0.18,
    cardTitle: "text-brand-ink",
    cardBody: "text-brand-ink/80",
    descriptionText: "text-brand-ink/70",
    parallaxAccents: ["rgba(128,193,221,0.72)", "rgba(192,170,242,0.68)", "rgba(242,170,220,0.6)"],
  },
  slot: {
    background: "bg-[radial-gradient(circle_at_top,var(--color-rose)_0%,rgba(255,255,255,0.9)_45%,var(--color-lavender)_100%)]",
    overlay: "bg-[linear-gradient(180deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_100%)]",
    title: "text-brand-ink",
    content: "!bg-brand-paper/95 !border border-brand-rose/40 !shadow-[0_16px_36px_rgba(29,27,41,0.08)] !p-4 sm:!p-5 md:!p-6",
    card: "bg-brand-ink/90 text-brand-paper border border-brand-rose/30 shadow-[0_16px_34px_rgba(29,27,41,0.18)]",
    chip: "bg-brand-rose/40 text-brand-paper",
    parallaxSpeed: 0.12,
    cardTitle: "text-brand-paper",
    cardBody: "text-brand-paper/80",
    descriptionText: "text-brand-paper/80",
    childWrapperWithHighlights: "!border border-brand-rose/25 !bg-brand-paper/90 !shadow-[0_12px_26px_rgba(29,27,41,0.06)] !backdrop-blur",
    outerContainer: "!border border-brand-rose/30 !bg-brand-paper/80 !shadow-[0_18px_42px_rgba(29,27,41,0.08)]",
    parallaxAccents: ["rgba(242,170,220,0.6)", "rgba(192,170,242,0.55)", "rgba(128,193,221,0.45)"],
  },
  laboratorio: {
    background: "bg-[radial-gradient(circle_at_top,var(--color-sky)_0%,rgba(255,255,255,0.92)_55%,var(--color-lime)_100%)]",
    overlay: "bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_100%)]",
    title: "text-brand-ink",
    content: "bg-brand-paper/90 backdrop-blur border border-brand-sky/30 shadow-[0_20px_48px_rgba(29,27,41,0.08)]",
    card: "bg-brand-paper/85 border border-brand-sky/25 shadow-[0_16px_36px_rgba(29,27,41,0.07)]",
    chip: "bg-brand-sky/35 text-brand-ink",
    parallaxSpeed: 0.2,
    cardTitle: "text-brand-ink",
    cardBody: "text-brand-ink/80",
    descriptionText: "text-brand-ink/70",
    parallaxAccents: ["rgba(128,193,221,0.7)", "rgba(220,242,170,0.65)", "rgba(192,170,242,0.55)"],
  },
  mesa: {
    background: "bg-[radial-gradient(circle_at_top,var(--color-rose)_0%,rgba(255,255,255,0.9)_55%,var(--color-lime)_100%)]",
    overlay: "bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_100%)]",
    title: "text-brand-ink",
    content: "bg-brand-paper/90 backdrop-blur border border-brand-rose/30 shadow-[0_20px_48px_rgba(29,27,41,0.08)]",
    card: "bg-brand-paper/85 border border-brand-rose/25 shadow-[0_16px_36px_rgba(29,27,41,0.07)]",
    chip: "bg-brand-rose/35 text-brand-ink",
    parallaxSpeed: 0.18,
    cardTitle: "text-brand-ink",
    cardBody: "text-brand-ink/80",
    descriptionText: "text-brand-ink/70",
    parallaxAccents: ["rgba(242,170,220,0.68)", "rgba(220,242,170,0.63)", "rgba(128,193,221,0.55)"],
  },
  inicio: {
    background: "bg-[radial-gradient(circle_at_top,var(--color-sky)_0%,rgba(255,255,255,0.9)_52%,var(--color-lime)_100%)]",
    overlay: "bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_100%)]",
    title: "text-brand-ink",
    content: "bg-brand-paper/90 backdrop-blur border border-brand-sky/30 shadow-[0_20px_46px_rgba(29,27,41,0.08)]",
    card: "bg-brand-paper/85 border border-brand-sky/25 shadow-[0_16px_34px_rgba(29,27,41,0.07)]",
    chip: "bg-brand-sky/30 text-brand-ink",
    parallaxSpeed: 0.18,
    cardTitle: "text-brand-ink",
    cardBody: "text-brand-ink/80",
    descriptionText: "text-brand-ink/70",
    parallaxAccents: ["rgba(128,193,221,0.72)", "rgba(220,242,170,0.67)", "rgba(192,170,242,0.58)"],
  },
  sobre: {
    background: "bg-[radial-gradient(circle_at_top,var(--color-paper)_0%,rgba(255,255,255,0.85)_55%,var(--color-lavender)_90%)]",
    overlay: "bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_100%)]",
    title: "text-brand-ink",
    content: "bg-brand-paper/92 backdrop-blur border border-brand-lavender/30 shadow-[0_18px_40px_rgba(29,27,41,0.07)]",
    card: "bg-brand-paper/88 border border-brand-lavender/25 shadow-[0_14px_30px_rgba(29,27,41,0.06)]",
    chip: "bg-brand-lavender/30 text-brand-ink",
    parallaxSpeed: 0.16,
    cardTitle: "text-brand-ink",
    cardBody: "text-brand-ink/80",
    descriptionText: "text-brand-ink/70",
    parallaxAccents: ["rgba(192,170,242,0.65)", "rgba(128,193,221,0.55)", "rgba(242,170,220,0.45)"],
  },
  creditos: {
    background: "bg-[radial-gradient(circle_at_top,var(--color-lavender)_0%,rgba(29,27,41,0.85)_55%,var(--color-rose)_100%)]",
    overlay: "bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(29,27,41,0.65)_100%)]",
    title: "text-brand-paper",
    content: "bg-brand-ink/90 text-brand-paper backdrop-blur border border-brand-lavender/35 shadow-[0_20px_50px_rgba(15,15,25,0.55)]",
    card: "bg-brand-ink/80 border border-brand-lavender/35 shadow-[0_16px_38px_rgba(15,15,25,0.45)]",
    chip: "bg-brand-lavender/40 text-brand-paper",
    parallaxSpeed: 0.12,
    cardTitle: "text-brand-paper",
    cardBody: "text-brand-paper/80",
    descriptionText: "text-brand-paper/80",
    parallaxAccents: ["rgba(192,170,242,0.45)", "rgba(242,170,220,0.4)", "rgba(128,193,221,0.35)"],
  },
  default: {
    background: "bg-[radial-gradient(circle_at_top,var(--color-paper)_0%,rgba(255,255,255,0.9)_55%,var(--color-lavender)_100%)]",
    overlay: "bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_100%)]",
    title: "text-brand-ink",
    content: "bg-brand-paper/90 backdrop-blur border border-brand-lavender/30 shadow-[0_20px_46px_rgba(29,27,41,0.08)]",
    card: "bg-brand-paper/85 border border-brand-lavender/25 shadow-[0_16px_34px_rgba(29,27,41,0.07)]",
    chip: "bg-brand-lavender/30 text-brand-ink",
    parallaxSpeed: 0.18,
    cardTitle: "text-brand-ink",
    cardBody: "text-brand-ink/80",
    descriptionText: "text-brand-ink/70",
    parallaxAccents: ["rgba(192,170,242,0.6)", "rgba(128,193,221,0.55)", "rgba(242,170,220,0.5)"],
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
  const baseSpeed = theme.parallaxSpeed ?? 0.18;
  const backgroundRef = useParallax(baseSpeed);
  const accentLayerRef = useParallax(baseSpeed * 1.25);
  const accentColors = theme.parallaxAccents ?? [];
  const accentGradient =
    accentColors.length > 1
      ? `linear-gradient(120deg, ${accentColors
          .map((color, idx) => {
            const pct =
              accentColors.length === 1
                ? 0
                : Math.round((idx / (accentColors.length - 1)) * 100);
            return `${color} ${pct}%`;
          })
          .join(", ")})`
      : accentColors[0] ?? "transparent";
  const highlightItems = highlights ?? [];
  const hasHighlights = highlightItems.length > 0;
  const highlightWrapperClass =
    theme.childWrapperWithHighlights ??
    "rounded-2xl border border-brand-lavender/30 bg-brand-paper/40 p-4 shadow-[0_10px_24px_rgba(29,27,41,0.05)] backdrop-blur";
  const defaultWrapperClass = theme.childWrapper ?? "";
  const childWrapperClass = hasHighlights ? highlightWrapperClass : defaultWrapperClass;

  return (
    <section
      id={id}
      className="relative isolate mx-auto mt-20 flex w-full max-w-6xl scroll-mt-24 flex-col px-4 first:mt-10"
    >
      <div className="absolute inset-0 -z-20 overflow-hidden rounded-[32px]">
        <div
          ref={accentLayerRef}
          className="pointer-events-none absolute left-1/2 top-[-22%] h-[150%] w-[130%] -translate-x-1/2 rounded-[46px] opacity-55 blur-[180px] mix-blend-screen"
          style={{ background: accentGradient }}
        />
        <div ref={backgroundRef} className={`absolute inset-0 ${theme.background}`} />
        <div className={`absolute inset-0 ${theme.overlay ?? ""}`} />
      </div>
      <div
        className={`relative flex flex-col gap-8 rounded-[32px] border border-brand-lavender/30 bg-brand-paper/30 p-6 pb-10 shadow-[0_18px_42px_rgba(29,27,41,0.06)] md:p-10 ${
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
    { id: 'slot', label: 'Ruleta' },
    { id: 'laboratorio', label: 'LavaLab' },
    { id: 'mesa', label: 'Autocuidado' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'creditos', label: 'Créditos' },
  ];
  return (
    <nav className="sticky top-0 z-50 border-b border-brand-lavender/30 bg-brand-paper/80 backdrop-blur shadow-[0_10px_28px_rgba(29,27,41,0.06)]">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 flex-wrap items-center gap-3 py-2 md:flex-nowrap">
          <div className="flex items-center gap-2 text-brand-ink">
          
            <div>
              <p className="text-lg font-semibold uppercase tracking-wide text-brand-ink/70">Yo Quiero Aprender</p>
         
            </div>
          </div>
          <div className="flex-1" />
          <ul
            className="flex w-full max-w-full items-center gap-2 overflow-x-auto rounded-full border border-brand-lavender/30 bg-brand-paper/90 px-2 py-1 text-brand-ink md:max-w-3xl"
            role="tablist"
            aria-label="Secciones"
          >
            {tabs.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => onChange(t.id)}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-display font-semibold tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-lavender ${
                    current === t.id
                      ? 'bg-brand-sky text-brand-ink shadow-[0_8px_18px_rgba(128,193,221,0.45)]'
                      : 'bg-transparent text-brand-ink/70 hover:bg-brand-lavender/40'
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
