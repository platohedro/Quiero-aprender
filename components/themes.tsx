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

function ChaptersDropdown({ 
  current, 
  onChange, 
  isOpen, 
  onToggle 
}: { 
  current: string; 
  onChange: (id: string) => void; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
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

  const handleChapterSelect = (id: string) => {
    onChange(id);
    onToggle();
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="relative whitespace-nowrap rounded-full border-2 border-black bg-white px-4 py-1.5 transition-transform duration-150 hover:-translate-y-1 text-[#334155]"
        style={{ boxShadow: `4px 4px 0 #80C1DD` }}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Capítulos
      </button>
      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+1.25rem)] z-[60] w-[min(640px,calc(100vw-2rem))] rounded-[32px] border-2 border-black bg-white p-5 shadow-[12px_12px_0_#F2AADC]">
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
      )}
    </div>
  );
}

export function TopNav({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const chaptersElement = document.querySelector('[data-chapters-dropdown]');
      if (chaptersElement && !chaptersElement.contains(target)) {
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

  const toggleChapters = () => {
    setChaptersOpen(!chaptersOpen);
  };

  const toggleMobile = () => {
    setMobileOpen((prev) => !prev);
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const primaryTabs = [
    { id: "inicio", label: "Inicio" },
    { id: "sobre", label: "Sobre" },
    { id: "creditos", label: "Créditos" },
  ];

  const allTabs = [
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
  const mobileChapterTabs = allTabs.filter((t) => !["inicio", "sobre", "creditos"].includes(t.id));

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
        <div className="hidden flex-1 items-center justify-center md:flex">
          <ul className="flex items-center gap-2 px-1 py-2 text-sm font-semibold text-[#0f172a]" role="tablist">
            <li className="relative">
              <button
                onClick={() => onChange("inicio")}
                className={`relative whitespace-nowrap rounded-full border-2 border-black bg-white px-4 py-1.5 transition-transform duration-150 hover:-translate-y-1 ${
                  current === "inicio" ? "font-bold text-[#0f172a]" : "text-[#334155]"
                }`}
                style={{ boxShadow: `4px 4px 0 ${SHADOW_COLORS[0]}` }}
                aria-current={current === "inicio" ? "page" : undefined}
                role="tab"
                aria-selected={current === "inicio"}
              >
                Inicio
              </button>
            </li>
            <li className="relative" data-chapters-dropdown>
              <ChaptersDropdown 
                current={current} 
                onChange={onChange} 
                isOpen={chaptersOpen} 
                onToggle={toggleChapters} 
              />
            </li>
            {primaryTabs.slice(1).map((tab, idx) => {
              const isActive = current === tab.id;
              const color = SHADOW_COLORS[(idx + 2) % SHADOW_COLORS.length];
              return (
                <li key={tab.id} className="relative">
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
        <button
          type="button"
          onClick={toggleMobile}
          aria-expanded={mobileOpen}
          aria-label="Abrir menú"
          className="ml-auto inline-flex items-center justify-center rounded-full border-2 border-black bg-white p-2 shadow-[4px_4px_0_#80C1DD] md:hidden"
        >
          {!mobileOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen ? (
        <>
          <div
            className="md:hidden fixed inset-0 z-[60] bg-black/10"
            onClick={() => setMobileOpen(false)}
          />
          <div className="md:hidden fixed left-0 right-0 top-20 z-[70] mx-3 rounded-[32px] border-2 border-black bg-white p-4 shadow-[10px_10px_0_#C0AAF2]">
            <div className="mb-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => { onChange("inicio"); setMobileOpen(false); }}
                className="rounded-full border-2 border-black bg-white px-4 py-2 text-left font-semibold shadow-[4px_4px_0_#80C1DD]"
              >
                Inicio
              </button>
              <button
                onClick={() => { onChange("sobre"); setMobileOpen(false); }}
                className="rounded-full border-2 border-black bg-white px-4 py-2 text-left font-semibold shadow-[4px_4px_0_#F2AADC]"
              >
                Sobre
              </button>
              <button
                onClick={() => { onChange("creditos"); setMobileOpen(false); }}
                className="rounded-full border-2 border-black bg-white px-4 py-2 text-left font-semibold shadow-[4px_4px_0_#DCF2AA]"
              >
                Créditos
              </button>
            </div>
            <p className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.3em] text-[#334155]">Capítulos</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {mobileChapterTabs.map((chapter, idx) => (
                <button
                  key={chapter.id}
                  onClick={() => { onChange(chapter.id); setMobileOpen(false); }}
                  className="sticker-card w-full text-left"
                  style={{ "--shadow-color": SHADOW_COLORS[(idx + 1) % SHADOW_COLORS.length] } as CSSProperties}
                >
                  <div className="flex flex-col gap-1 p-3">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-[#475569]">{`Capítulo ${idx + 1}`}</span>
                    <span className="font-display text-sm text-[#0f172a]">{chapter.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </nav>
  );
}
