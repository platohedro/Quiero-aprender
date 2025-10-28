"use client";
import React, { CSSProperties, useEffect, useRef, useState } from "react";

const SHADOW_COLORS = ["#80C1DD", "#F2AADC", "#DCF2AA", "#C0AAF2"] as const;

type ThemedSectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  eyebrow?: string;
  description?: string;
  highlights?: Array<{ id?: string; title: string; text: string; icon?: string }>;
};

function HighlightCard({ title, text, icon, index }: { title: string; text: string; icon?: string; index: number }) {
  const color = SHADOW_COLORS[index % SHADOW_COLORS.length];
  const stickerStyle = { "--shadow-color": color } as CSSProperties;

  return (
    <article className="sticker-card group flex flex-col gap-3 bg-white" style={stickerStyle}>
      <div className="flex items-start gap-3">
        {icon ? (
          <span
            className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-black text-lg"
            style={{ backgroundColor: color }}
          >
            {icon}
          </span>
        ) : null}
        <div>
          <h3 className="font-display text-lg font-semibold text-[#0f172a]">{title}</h3>
          <p className="text-sm leading-relaxed text-[#1f2937]">{text}</p>
        </div>
      </div>
    </article>
  );
}

export function ThemedSection({ id, title, children, eyebrow, description, highlights = [] }: ThemedSectionProps) {
  return (
    <section id={id} className="mx-auto mt-24 w-full max-w-6xl scroll-mt-28 px-4 first:mt-12">
      <header className="mb-10 max-w-4xl space-y-4">
        {eyebrow ? (
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#111827] shadow-[4px_4px_0_#80C1DD]">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="font-display text-3xl font-bold text-[#0f172a] md:text-4xl">{title}</h2>
        {description ? <p className="text-base leading-relaxed text-[#1f2937] md:text-lg">{description}</p> : null}
      </header>

      {highlights.length > 0 ? (
        <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {highlights.map((item, idx) => (
            <HighlightCard key={item.id ?? item.title} title={item.title} text={item.text} icon={item.icon} index={idx} />
          ))}
        </div>
      ) : null}

      <div
        className="rounded-[32px] border-2 border-black bg-white p-6 md:p-10"
        style={{ boxShadow: "10px 10px 0 #C0AAF2" }}
      >
        {children}
      </div>
    </section>
  );
}

export function TopNav({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  const tabs = [
    { id: "inicio", label: "Inicio" },
    { id: "semillas", label: "Cuidado de la semilla" },
    { id: "galeria", label: "Personajes fantásticos" },
    { id: "laboratorio", label: "Monstruos de lava" },
    { id: "mesa", label: "Juego de autocuidado" },
    { id: "acuarela", label: "Pintura en acuarela" },
    { id: "slot", label: "Animalario" },
    { id: "sobre", label: "Sobre" },
    { id: "creditos", label: "Créditos" },
  ];

  const chapterTabs = tabs.filter(
    (tab) => !["inicio", "sobre", "creditos"].includes(tab.id)
  );

  const [chaptersOpen, setChaptersOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const chaptersButtonRef = useRef<HTMLButtonElement | null>(null);
  const chapterWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        chapterWrapperRef.current &&
        !chapterWrapperRef.current.contains(target)
      ) {
        setChaptersOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setChaptersOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!chapterTabs.some((tab) => tab.id === current)) {
      setChaptersOpen(false);
    }
  }, [current, chapterTabs]);

  const handleChapterSelect = (id: string) => {
    setChaptersOpen(false);
    onChange(id);
  };

  const primaryTabs = [
    { id: "inicio", label: "Inicio" },
    { id: "capitulos", label: "Capítulos" },
    { id: "sobre", label: "Sobre" },
    { id: "creditos", label: "Créditos" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-black/10 bg-[#f4f4f6]/90 backdrop-blur">
      <div className="relative mx-auto flex h-20 w-full max-w-6xl items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white text-xl font-semibold shadow-[4px_4px_0_rgba(17,17,17,0.8)]">
            YQ
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-[#0f172a]">Yo Quiero Aprender</p>
            <p className="text-xs uppercase tracking-[0.3em] text-[#475569]">Proyecto interactivo</p>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <ul className="flex items-center gap-2 px-1 py-2 text-sm font-semibold text-[#0f172a]" role="tablist">
          {primaryTabs.map((tab, idx) => {
            const isChapterButton = tab.id === "capitulos";
            const isActive = isChapterButton
              ? chapterTabs.some((chapter) => chapter.id === current)
              : current === tab.id;
            const color = SHADOW_COLORS[idx % SHADOW_COLORS.length];
            return (
              <li key={tab.id} className="relative">
                {isActive ? (
                  <span
                    className="pointer-events-none absolute inset-0 translate-x-2 translate-y-2 rounded-full"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
                ) : null}
                {isChapterButton ? (
                  <div
                    ref={chapterWrapperRef}
                    className="relative"
                    onMouseEnter={() => setChaptersOpen(true)}
                    onMouseLeave={() => setChaptersOpen(false)}
                    onFocusCapture={() => setChaptersOpen(true)}
                    onBlurCapture={(event) => {
                      const next = event.relatedTarget as Node | null;
                      if (!next || !chapterWrapperRef.current?.contains(next)) {
                        setChaptersOpen(false);
                      }
                    }}
                  >
                    <button
                      ref={chaptersButtonRef}
                      type="button"
                      className={`relative whitespace-nowrap rounded-full border-2 border-black bg-white px-4 py-1.5 transition-transform duration-150 hover:-translate-y-1 ${
                        isActive ? "font-bold text-[#0f172a]" : "text-[#334155]"
                      }`}
                      style={{ boxShadow: `4px 4px 0 ${color}` }}
                      aria-haspopup="true"
                      aria-expanded={chaptersOpen}
                    >
                      {tab.label}
                    </button>
                    {chaptersOpen ? (
                      <div
                        ref={popoverRef}
                        className="absolute right-0 top-[calc(100%+1rem)] z-50 w-[min(640px,calc(100vw-2rem))] rounded-[32px] border-2 border-black bg-white p-5 shadow-[12px_12px_0_#F2AADC]"
                      >
                        <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.3em] text-[#334155]">
                          Capítulos
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {chapterTabs.map((chapter, idx) => {
                            const color = SHADOW_COLORS[(idx + 1) % SHADOW_COLORS.length];
                            const isChapterActive = current === chapter.id;
                            return (
                              <button
                                key={chapter.id}
                                onClick={() => handleChapterSelect(chapter.id)}
                                className={`sticker-card flex w-full flex-col gap-2 text-left text-sm font-semibold ${
                                  isChapterActive ? "ring-2 ring-offset-2 ring-offset-white ring-[#0f172a]" : ""
                                }`}
                                style={{ "--shadow-color": color } as CSSProperties}
                              >
                                <span className="text-xs uppercase tracking-[0.25em] text-[#475569]">{`Capítulo ${idx + 1}`}</span>
                                <span className="font-display text-base text-[#0f172a]">{chapter.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <button
                    onClick={() => onChange(tab.id)}
                    className={`relative whitespace-nowrap rounded-full border-2 border-black bg-white px-4 py-1.5 transition-transform duration-150 hover:-translate-y-1 ${
                      isActive ? "font-bold text-[#0f172a]" : "text-[#334155]"
                    }`}
                    style={{ boxShadow: `4px 4px 0 ${color}` }}
                    aria-current={isActive ? "page" : undefined}
                    role="tab"
                    aria-selected={isActive}
                  >
                    {tab.label}
                  </button>
                )}
              </li>
            );
          })}
          </ul>
        </div>
        <a
          href="https://www.medellin.gov.co/es/presupuesto-participativo/"
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-[32px] border-2 border-black bg-white px-3 py-2 shadow-[6px_6px_0_#80C1DD] md:inline-flex"
        >
          <img src="/LOGO_PP.png" alt="Presupuesto Participativo" className="h-14 w-auto" />
        </a>
      </div>
    </nav>
  );
}
