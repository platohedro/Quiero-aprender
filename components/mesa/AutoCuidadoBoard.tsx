"use client";
import React, { useEffect, useState } from "react";
type Categoria = "CEPILLADO"|"HILO"|"ENJUAGUE"|"AGUA"|"AZUCAR"|"DENTISTA";

function FancyDie({ value, rolling }: { value: 1|2|3|4|5|6; rolling: boolean }) {
  useEffect(()=>{ console.assert(value>=1 && value<=6, 'Die must be 1..6'); },[value]);
  const pip = (x:number,y:number)=> (<circle cx={x} cy={y} r={6} />);
  const faces: Record<1|2|3|4|5|6, JSX.Element> = {
    1: (<g>{pip(32,32)}</g>),
    2: (<g>{pip(16,16)}{pip(48,48)}</g>),
    3: (<g>{pip(16,16)}{pip(32,32)}{pip(48,48)}</g>),
    4: (<g>{pip(16,16)}{pip(48,16)}{pip(16,48)}{pip(48,48)}</g>),
    5: (<g>{pip(16,16)}{pip(48,16)}{pip(32,32)}{pip(16,48)}{pip(48,48)}</g>),
    6: (<g>{pip(16,16)}{pip(48,16)}{pip(16,32)}{pip(48,32)}{pip(16,48)}{pip(48,48)}</g>),
  };
  return (
    <div className={`h-16 w-16 md:h-20 md:w-20 rounded-xl shadow-xl border-4 border-white bg-gradient-to-br from-sky-50 to-cyan-200 flex items-center justify-center ${rolling? 'animate-[spin_0.6s_linear_infinite]':''}`}>
      <svg viewBox="0 0 64 64" className="h-12 w-12 fill-cyan-900 drop-shadow-sm">{faces[value]}</svg>
    </div>
  );
}

function Modal({ open, title, children, onClose, primaryLabel, onPrimary }: { open: boolean; title: string; children: React.ReactNode; onClose: ()=>void; primaryLabel?: string; onPrimary?: ()=>void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[min(92vw,720px)] rounded-2xl shadow-2xl border border-cyan-700 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-cyan-700 to-sky-500 text-white font-semibold">{title}</div>
        <div className="p-4 bg-white">{children}</div>
        <div className="p-3 bg-slate-50 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg border">Cerrar</button>
          {primaryLabel && <button onClick={onPrimary} className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white">{primaryLabel}</button>}
        </div>
      </div>
    </div>
  );
}

const size=10; const total=size*size;
const indexToLabel=(i:number)=>i+1;
const indexToRC=(i:number)=>{ const n=i; const row=Math.floor(n/size); const col=n%size; const c=(row%2===0)?col:(size-1-col); const r=row; return {r,c}; };

const CABLES: Array<{ from:number; toYes:number; toNo:number; cat:Categoria }> = [
  { from: 4,  toYes: 12, toNo: 2,  cat: 'CEPILLADO' },
  { from: 7,  toYes: 16, toNo: 5,  cat: 'AGUA' },
  { from: 13, toYes: 23, toNo: 9,  cat: 'HILO' },
  { from: 20, toYes: 29, toNo: 14, cat: 'ENJUAGUE' },
  { from: 25, toYes: 36, toNo: 18, cat: 'AZUCAR' },
  { from: 33, toYes: 45, toNo: 24, cat: 'CEPILLADO' },
  { from: 41, toYes: 55, toNo: 34, cat: 'HILO' },
  { from: 52, toYes: 66, toNo: 44, cat: 'AGUA' },
  { from: 60, toYes: 74, toNo: 49, cat: 'ENJUAGUE' },
  { from: 68, toYes: 82, toNo: 57, cat: 'AZUCAR' },
  { from: 76, toYes: 90, toNo: 63, cat: 'DENTISTA' },
  { from: 85, toYes: 97, toNo: 70, cat: 'CEPILLADO' },
];
const ICON: Record<Categoria,string> = { CEPILLADO:'🪥', HILO:'🧵', ENJUAGUE:'🫗', AGUA:'💧', AZUCAR:'🍬', DENTISTA:'🦷' };
const QUESTIONS: Record<Categoria,string> = {
  CEPILLADO: '¿Te cepillaste los dientes 2–3 veces hoy (mañana y noche)?',
  HILO: '¿Pasaste el hilo dental al menos una vez hoy?',
  ENJUAGUE: '¿Usaste enjuague bucal sin alcohol hoy?',
  AGUA: '¿Tomaste agua después de comer para limpiar tu boca?',
  AZUCAR: '¿Evitaste dulces o los comiste con moderación?',
  DENTISTA: '¿Tienes tu control con odontólogo al día (2 veces al año)?',
};
const ADVICE: Record<Categoria,{yes:string[];no:string[]}> = {
  CEPILLADO: { yes:['¡Excelente! Mantén 2–3 veces al día.','Recuerda 2 minutos por cepillado y lengua incluida.'], no:['Pon una alarma mañana y noche.','Usa una canción de 2 minutos mientras te cepillas.'] },
  HILO: { yes:['Sigue pasándolo antes de dormir.','Usa porta-hilo si te resulta más fácil.'], no:['Empieza con 2 dientes por día y ve aumentando.','Pregunta por hilo con cera si te molesta.'] },
  ENJUAGUE: { yes:['Úsalo después del cepillado (sin tragar).','Elige uno sin alcohol para niños.'], no:['Prueba un enjuague suave sin alcohol.','Consulta si te conviene fluorado infantil.'] },
  AGUA: { yes:['Lleva tu botilito siempre.','Da sorbos de agua después de cada comida.'], no:['Toma un vaso de agua después de meriendas.','Ten agua visible en la mesa.'] },
  AZUCAR: { yes:['¡Bien! Sigue eligiendo frutas o snacks sin azúcar.','Si comes dulce, cepíllate después.'], no:['Guarda los dulces para después de las comidas.','Enjuágate o toma agua tras el dulce.'] },
  DENTISTA: { yes:['Agenda tu próximo control en 6 meses.','Lleva tu cepillo para aprender técnica.'], no:['Pide una cita de control.','Lleva tus dudas anotadas para preguntar.'] },
};

export default function AutoCuidadoBoard(){
  const [pos,setPos]=useState(1); const [rolling,setRolling]=useState(false); const [dieVal,setDieVal]=useState<1|2|3|4|5|6>(1);
  const [log,setLog]=useState<string[]>([]);
  const [modal,setModal]=useState<{open:boolean; title?:string; body?:React.ReactNode; onPrimary?:()=>void}>({open:false});

  const resetBoard=()=>{ setPos(1); setRolling(false); setDieVal(1); setModal({open:false}); setLog(l=>['↩️ Volviste a la casilla 1',...l]); };

  const stepMove=async(steps:number)=>{ for(let s=0;s<steps;s++){ await new Promise(r=>setTimeout(r,180)); setPos(p=>Math.min(total,p+1)); } await new Promise(r=>setTimeout(r,50)); };

  const openAdvice=(cat:Categoria,choice:'yes'|'no')=>{ const tips=ADVICE[cat]?.[choice]||[]; setModal({open:true,title:`Consejos de ${cat.toLowerCase()}`,body:(<div className="space-y-2"><p className="text-sm text-slate-700">Sugerencias para tu salud oral:</p><ul className="list-disc pl-5 space-y-1 text-sm">{tips.map((t,i)=>(<li key={i}>{t}</li>))}</ul></div>)}); };
  const askCable=(c:{from:number;toYes:number;toNo:number;cat:Categoria})=>{
    const doChoice=async(choice:'yes'|'no')=>{ setModal({open:false}); openAdvice(c.cat,choice); await new Promise(r=>setTimeout(r,350)); setPos(choice==='yes'?c.toYes:c.toNo); setLog(l=>[`🦷 Cable en ${c.from} (${c.cat}): ${choice==='yes'?'Sí':'No'} → ${choice==='yes'?c.toYes:c.toNo}`,...l]); };
    setModal({open:true,title:`${ICON[c.cat]} ${c.cat}`,body:(<div className="space-y-3"><p className="font-medium">{QUESTIONS[c.cat]}</p><div className="flex gap-2 justify-end"><button onClick={()=>doChoice('no')} className="px-3 py-1.5 rounded-lg border">No</button><button onClick={()=>doChoice('yes')} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white">Sí</button></div></div>)});
  };

  const roll=async()=>{
    if(rolling) return; setRolling(true);
    const start=Date.now();
    const finish=async()=>{
      const finalVal=(1+Math.floor(Math.random()*6)) as 1|2|3|4|5|6; setDieVal(finalVal);
      const landing=Math.min(total,pos+finalVal); setLog(l=>[`🎲 Tiraste ${finalVal}`,...l]);
      await stepMove(finalVal);
      const hit=CABLES.find(c=>c.from===landing);
      if(hit){ setLog(l=>[`🔌 Caíste en cable de ${hit.cat} en casilla ${hit.from}`,...l]); setTimeout(()=>askCable(hit),120); }
      setRolling(false);
    };
    const tick=()=>{ const elapsed=Date.now()-start; setDieVal((1+Math.floor(Math.random()*6)) as 1|2|3|4|5|6); if(elapsed<900){ requestAnimationFrame(tick); } else { finish(); } };
    tick();
  };

  const cells=Array.from({length:total}).map((_,i)=>{ const label=indexToLabel(i); const {r,c}=indexToRC(i); return {i,label,r,c}; });
  const cablesSVG=(<svg viewBox={`0 0 ${size*100} ${size*100}`} className="absolute inset-0 w-full h-full pointer-events-none">
    {CABLES.map((cb,idx)=>{ const a=indexToRC(cb.from-1), b1=indexToRC(cb.toYes-1), b0=indexToRC(cb.toNo-1);
      const toXY=(rc:{r:number;c:number})=>({x:rc.c*100+50,y:rc.r*100+50}); const pA=toXY(a), pY=toXY(b1), pN=toXY(b0);
      return (<g key={idx}>
        <path d={`M ${pA.x} ${pA.y} C ${pA.x} ${pA.y-80}, ${pY.x} ${pY.y+80}, ${pY.x} ${pY.y}`} stroke="#10b981" strokeWidth={10} fill="none" strokeLinecap="round" />
        <path d={`M ${pA.x} ${pA.y} C ${pA.x} ${pA.y+80}, ${pN.x} ${pN.y-80}, ${pN.x} ${pN.y}`} stroke="#ef4444" strokeWidth={10} fill="none" strokeLinecap="round" />
      </g>); })}
  </svg>);
  const pieceRC=indexToRC(pos-1);
  return (<div className="flex flex-col lg:flex-row gap-6">
    <div className="relative w-full max-w-[520px] aspect-square mx-auto" style={{'--cell-size': '10%'} as React.CSSProperties}>
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
        {cells.map(cell=>(<div key={cell.i} className="relative border border-white/60 bg-gradient-to-br from-white to-sky-50 aspect-square">
          <div className="absolute top-0.5 left-0.5 text-[8px] sm:text-[10px] md:text-xs opacity-70">{cell.label}</div>
          <div className="absolute bottom-0.5 right-0.5 text-[10px] sm:text-xs opacity-30">🦷</div>
        </div>))}
      </div>
      {cablesSVG}
      <div className="absolute transition-all duration-200" style={{ 
        left: `${pieceRC.c * 10 + 2}%`, 
        top: `${pieceRC.r * 10 + 2}%`,
        width: '6%',
        height: '6%'
      }}>
        <div className="w-full h-full rounded-full border-2 sm:border-4 border-white bg-cyan-600 shadow-xl grid place-items-center text-white text-xs sm:text-sm">🦷</div>
      </div>
    </div>
    <div className="w-full lg:w-80">
      <div className="rounded-2xl border bg-white/80 backdrop-blur p-3 shadow space-y-3">
        <div className="flex items-center gap-4">
          <button onClick={roll} disabled={rolling || pos>=100} className="px-4 py-2 rounded-xl bg-cyan-600 text-white disabled:opacity-50 shadow-md hover:brightness-110">{rolling? 'Tirando…':'Tirar dado'}</button>
          <button onClick={resetBoard} className="px-3 py-2 rounded-xl border bg-white hover:bg-slate-50">Reiniciar a 1</button>
          <FancyDie value={dieVal} rolling={rolling} />
        </div>
        <div className="text-sm text-slate-700">Posición: {pos} / {total}</div>
        <div className="text-xs text-slate-600">Al caer en un <b>cable</b>, te preguntamos sobre <b>salud oral</b>: si respondes <b>Sí</b> subes (verde), si <b>No</b> bajas (rojo) y recibes consejos.</div>
      </div>
      <div className="mt-3 rounded-2xl border bg-white/80 backdrop-blur p-3 h-48 overflow-auto shadow">
        <div className="text-sm font-semibold mb-2">Registro</div>
        <ul className="space-y-1 text-sm">{log.map((line,i)=>(<li key={i} className="text-slate-800">{line}</li>))}</ul>
      </div>
    </div>
    <Modal open={modal.open} title={modal.title || ''} onClose={()=>setModal({open:false})} primaryLabel={modal.onPrimary? 'Ok': undefined} onPrimary={modal.onPrimary}>
      {modal.body}
    </Modal>
  </div>);
}