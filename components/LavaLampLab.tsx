"use client";
import React, { useState, useRef } from "react";

type Ingredient = {
  id: string;
  name: string;
  color: string;
  icon: string;
  added: boolean;
};

type RecipeStep = {
  ingredient: string;
  description: string;
  effect: string;
};

const INGREDIENTS: Ingredient[] = [
  { id: 'water', name: 'Agua', color: '#3b82f6', icon: '💧', added: false },
  { id: 'oil', name: 'Aceite', color: '#fbbf24', icon: '🛢️', added: false },
  { id: 'dye', name: 'Colorante', color: '#ef4444', icon: '🎨', added: false },
  { id: 'tablet', name: 'Pastilla', color: '#8b5cf6', icon: '💊', added: false },
];

const RECIPE_STEPS: RecipeStep[] = [
  { ingredient: 'water', description: '1. Llenar el frasco con agua', effect: 'Base líquida transparente' },
  { ingredient: 'oil', description: '2. Agregar aceite lentamente', effect: 'Capa flotante dorada' },
  { ingredient: 'dye', description: '3. Echar unas gotas de colorante', effect: 'Color vibrante se dispersa' },
  { ingredient: 'tablet', description: '4. Añadir pastilla efervescente', effect: '¡Burbujas de lava!' },
];

const Z_LEVELS = {
  waterBase: 1,
  waterTint: 2,
  waterWaves: 3,
  oilLayer: 4,
  oilSeparator: 5,
  oilTint: 6,
  oilBubbles: 7,
  dyeEffects: 8,
  lavaOverlay: 9,
  labels: 10,
  indicators: 11,
  dropping: 12,
} as const;

const WATER_HEIGHT_PX = 24;
const OIL_HEIGHT_PX = 20;
const WATER_TOP_OFFSET = `${WATER_HEIGHT_PX}px`;
const OIL_BOTTOM_OFFSET = `${WATER_HEIGHT_PX}px`;
const OIL_TOP_OFFSET = `${WATER_HEIGHT_PX + OIL_HEIGHT_PX}px`;

const DYE_DROPS = [
  { left: '24%', top: '12px', delay: '0s' },
  { left: '36%', top: '18px', delay: '0.2s' },
  { left: '48%', top: '22px', delay: '0.4s' },
  { left: '60%', top: '16px', delay: '0.6s' },
  { left: '72%', top: '24px', delay: '0.8s' },
  { left: '84%', top: '20px', delay: '1s' },
];

const DYE_SWIRLS = [
  { offset: -14, size: 12, delay: '0s' },
  { offset: -6, size: 16, delay: '0.6s' },
  { offset: 6, size: 20, delay: '1.2s' },
  { offset: 14, size: 24, delay: '1.8s' },
];

export default function LavaLampLab() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(INGREDIENTS);
  const [currentStep, setCurrentStep] = useState(0);
  const [jarContents, setJarContents] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [message, setMessage] = useState('🌟 ¡Bienvenid@ a Lava Lab Junior! Empieza arrastrando el agua al frasco mágico.');
  const [droppingIngredient, setDroppingIngredient] = useState<string | null>(null);

  const dragItem = useRef<string | null>(null);

  const handleDragStart = (e: React.DragEvent, ingredientId: string) => {
    dragItem.current = ingredientId;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragItem.current) return;

    const expectedIngredient = RECIPE_STEPS[currentStep]?.ingredient;
    
    if (dragItem.current === expectedIngredient) {
      // Correcto: agregar ingrediente con animación
      setDroppingIngredient(dragItem.current);
      
      // Delay para mostrar la animación de caída más fluida
      setTimeout(() => {
        setJarContents(prev => [...prev, dragItem.current!]);
        setIngredients(prev => 
          prev.map(ing => 
            ing.id === dragItem.current ? { ...ing, added: true } : ing
          )
        );
        
        const step = RECIPE_STEPS[currentStep];
        setMessage(`🎉 ${step.description} · ${step.effect}`);
        
        if (currentStep < RECIPE_STEPS.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          // Completado
          setIsComplete(true);
          setShowAnimation(true);
          setMessage('🎊 ¡Experimento completado! Observa tu lámpara de lava brillante.');
        }
        
        setDroppingIngredient(null);
      }, 1200);
      
    } else {
      // Incorrecto
      setMessage(`😅 ¡Ups! Primero toca agregar ${RECIPE_STEPS[currentStep]?.ingredient === 'water' ? 'el agua cristalina' : 
        RECIPE_STEPS[currentStep]?.ingredient === 'oil' ? 'el aceite flotante' : 
        RECIPE_STEPS[currentStep]?.ingredient === 'dye' ? 'el colorante mágico' : 'la pastilla efervescente'}.`);
    }
    
    dragItem.current = null;
  };

  const reset = () => {
    setIngredients(INGREDIENTS.map(ing => ({ ...ing, added: false })));
    setCurrentStep(0);
    setJarContents([]);
    setIsComplete(false);
    setShowAnimation(false);
    setDroppingIngredient(null);
    setMessage('🌟 ¡Bienvenid@ a Lava Lab Junior! Empieza arrastrando el agua al frasco mágico.');
  };

  const renderJarContent = () => {
    const layers = [];
    
    // SIEMPRE mostrar el agua si está en jarContents - BASE PERMANENTE
    if (jarContents.includes('water')) {
      layers.push(
        <div
          key="water-base"
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-800 via-blue-700 to-blue-600 shadow-inner"
          style={{
            clipPath: 'polygon(12% 100%, 88% 100%, 85% 0%, 15% 0%)',
            border: '2px solid rgba(59, 130, 246, 1)',
            borderBottom: 'none',
            height: `${WATER_HEIGHT_PX}px`,
            zIndex: Z_LEVELS.waterBase,
          }}
        />
      );
      
      // Ondas en el agua
      layers.push(
        <div
          key="water-waves"
          className="absolute left-0 right-0 bg-blue-400 animate-[waveEffect_2s_ease-in-out_infinite]"
          style={{
            bottom: WATER_TOP_OFFSET,
            clipPath: 'polygon(12% 100%, 88% 100%, 85% 0%, 15% 0%)',
            height: '2px',
            zIndex: Z_LEVELS.waterWaves,
          }}
        />
      );
      
      // Etiqueta del agua
      layers.push(
        <div key="water-label" className="absolute bottom-10 right-3 bg-blue-700 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg" style={{ zIndex: Z_LEVELS.labels }}>
          💧 AGUA
        </div>
      );

      if (droppingIngredient === 'water') {
        layers.push(
          <div
            key="water-splash"
            className="absolute left-1/2 bottom-2 w-20 h-20 -translate-x-1/2 rounded-full bg-blue-300/70 blur-md animate-[fillUp_1.2s_ease-out]"
            style={{ zIndex: Z_LEVELS.dropping }}
          />
        );
        layers.push(
          <div key="water-droplets" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: Z_LEVELS.dropping }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={`water-drop-${i}`}
                className="w-2 h-3 bg-blue-200/80 rounded-full animate-[floatUp_1.2s_ease-out]"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        );
      }
    }
    
    // SIEMPRE mostrar el aceite si está en jarContents - FLOTA SOBRE AGUA
    if (jarContents.includes('oil')) {
      layers.push(
        <div
          key="oil-layer"
          className="absolute left-0 right-0 bg-gradient-to-t from-amber-600 via-yellow-500 to-yellow-400 shadow-md"
          style={{
            bottom: OIL_BOTTOM_OFFSET,
            clipPath: 'polygon(14% 100%, 86% 100%, 83% 0%, 17% 0%)',
            border: '2px solid rgba(245, 158, 11, 1)',
            borderBottom: 'none',
            borderTop: '3px solid rgba(245, 158, 11, 1)',
            height: `${OIL_HEIGHT_PX}px`,
            zIndex: Z_LEVELS.oilLayer,
          }}
        />
      );
      
      // Línea de separación entre agua y aceite
      layers.push(
        <div
          key="oil-separator"
          className="absolute left-0 right-0 bg-orange-600 shadow-lg"
          style={{
            bottom: OIL_BOTTOM_OFFSET,
            clipPath: 'polygon(14% 100%, 86% 100%, 83% 0%, 17% 0%)',
            height: '2px',
            zIndex: Z_LEVELS.oilSeparator,
          }}
        />
      );
      
      // Burbujas en el aceite
      layers.push(
        <div
          key="oil-bubbles"
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ bottom: OIL_TOP_OFFSET, zIndex: Z_LEVELS.oilBubbles }}
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} 
                 className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-[bubbleRise_3s_ease-in-out_infinite]" 
                 style={{
                   left: `${-6 + i * 4}px`,
                    animationDelay: `${i * 0.8}s`,
                    opacity: 0.8
                  }}/>
          ))}
        </div>
      );

      // Etiqueta del aceite
      layers.push(
        <div key="oil-label" className="absolute bottom-32 right-3 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg" style={{ zIndex: Z_LEVELS.labels }}>
          🛢️ ACEITE
        </div>
      );

      if (droppingIngredient === 'oil') {
        layers.push(
          <div
            key="oil-sheen"
            className="absolute left-1/2" 
            style={{
              bottom: `${WATER_HEIGHT_PX + OIL_HEIGHT_PX / 2}px`,
              transform: 'translateX(-50%)',
              zIndex: Z_LEVELS.dropping,
            }}
          >
            <div className="w-24 h-8 rounded-full bg-amber-200/70 blur-md animate-[floatUp_1.2s_ease-out]"></div>
          </div>
        );
        layers.push(
          <div key="oil-sparkles" className="absolute inset-0" style={{ zIndex: Z_LEVELS.dropping }}>
            {[...Array(5)].map((_, i) => (
              <div
                key={`oil-spark-${i}`}
                className="absolute w-1.5 h-1.5 bg-yellow-200 rounded-full animate-[bubbleRise_1.2s_ease-out]"
                style={{
                  left: `${30 + i * 10}%`,
                  bottom: `${WATER_HEIGHT_PX + 4}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        );
      }
    }
    
    // COLORANTE - SE DISUELVE Y MEZCLA VISIBLEMENTE
    if (jarContents.includes('dye')) {
      // Colorante se disuelve en el agua
      if (jarContents.includes('water')) {
        layers.push(
          <div
            key="colored-water"
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 via-red-700 to-pink-500 animate-[colorDiffusion_3s_ease-out]"
            style={{
              clipPath: 'polygon(12% 100%, 88% 100%, 85% 0%, 15% 0%)',
              opacity: 0.7,
              mixBlendMode: 'multiply',
              height: `${WATER_HEIGHT_PX}px`,
              zIndex: Z_LEVELS.waterTint,
            }}
          />
        );
      }
      
      // Colorante también tiñe el aceite
      if (jarContents.includes('oil')) {
        layers.push(
          <div
            key="tinted-oil"
            className="absolute left-0 right-0 bg-gradient-to-t from-orange-800 to-red-600 animate-[colorDiffusion_3s_ease-out]"
            style={{
              bottom: OIL_BOTTOM_OFFSET,
              clipPath: 'polygon(14% 100%, 86% 100%, 83% 0%, 17% 0%)',
              opacity: 0.6,
              mixBlendMode: 'multiply',
              height: `${OIL_HEIGHT_PX}px`,
              zIndex: Z_LEVELS.oilTint,
            }}
          />
        );
      }
      
      // GOTAS DE COLORANTE CAYENDO Y DISOLVIÉNDOSE
      layers.push(
        <div key="dye-drops" className="absolute inset-0 overflow-hidden" style={{ zIndex: Z_LEVELS.dyeEffects }}>
          {DYE_DROPS.map((drop, index) => (
            <div
              key={`drop-${index}`}
              className="absolute bg-gradient-to-b from-red-700 to-purple-800 rounded-full"
              style={{
                width: '6px',
                height: '14px',
                left: drop.left,
                top: drop.top,
                animation: 'dropFall 2.8s ease-in infinite',
                animationDelay: drop.delay,
                opacity: 0.9,
                filter: 'blur(0.4px)'
              }}
            />
          ))}
        </div>
      );
      
      // ESPIRALES DE DISOLUCIÓN MUY VISIBLES
      layers.push(
        <div key="dye-dissolving" className="absolute bottom-12 left-1/2 transform -translate-x-1/2" style={{ zIndex: Z_LEVELS.dyeEffects }}>
          {DYE_SWIRLS.map((swirl, index) => (
            <div
              key={`swirl-${index}`}
              className="absolute rounded-full animate-[colorDiffusion_5s_ease-out_infinite]"
              style={{
                width: `${swirl.size}px`,
                height: `${swirl.size}px`,
                left: `${swirl.offset}px`,
                border: '3px solid rgba(220, 38, 38, 0.8)',
                animationDelay: swirl.delay,
                opacity: 0.75
              }}
            />
          ))}
        </div>
      );
      
      // Efecto cuando se agrega colorante
      if (droppingIngredient === 'dye') {
        layers.push(
          <div key="dye-impact" className="absolute bottom-20 left-1/2 transform -translate-x-1/2" style={{ zIndex: Z_LEVELS.dyeEffects }}>
            {[...Array(15)].map((_, i) => (
              <div key={i} 
                   className="absolute w-2 h-2 bg-red-600 rounded-full animate-[liquidSplash_2s_ease-out]" 
                   style={{
                     left: `${-20 + i * 3}px`,
                     animationDelay: `${i * 0.1}s`,
                     opacity: 0.9
                   }}/>
            ))}
          </div>
        );
      }
      
      // Etiqueta del colorante MUY VISIBLE
      layers.push(
        <div key="dye-label" className="absolute left-4 bg-red-800 text-white text-sm px-3 py-1 rounded-full font-bold shadow-xl border-2 border-red-300" style={{ bottom: '5.5rem', zIndex: Z_LEVELS.labels }}>
          🎨 COLOR
        </div>
      );
    }
    
    // Pastilla - efectos de burbujas y lava ESPECTACULARES
    if (jarContents.includes('tablet')) {
      // EFECTO DE LAVA PRINCIPAL - Base burbujeante MUY VISIBLE
      layers.push(
        <div key="lava-base" className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-red-800 via-orange-600 to-yellow-500 animate-[colorDiffusion_2s_ease-in-out_infinite]" 
             style={{
               clipPath: 'polygon(12% 100%, 88% 100%, 78% 0%, 22% 0%)',
               opacity: 0.55,
               mixBlendMode: 'screen',
               zIndex: Z_LEVELS.lavaOverlay
             }}/>
      );
      
      // Etiqueta de LAVA ACTIVA
      layers.push(
        <div key="lava-label" className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg animate-pulse" style={{ zIndex: Z_LEVELS.indicators }}>
          🌋 LAVA ACTIVA!
        </div>
      );
      
      // Burbujas de lava GRANDES que suben
      layers.push(
        <div key="lava-bubbles-big" className="absolute inset-0 overflow-hidden" style={{ zIndex: Z_LEVELS.lavaOverlay }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={`lava-big-${i}`}
              className="absolute bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-full shadow-lg"
              style={{
                width: `${20 + i * 4}px`,
                height: `${20 + i * 4}px`,
                left: `${15 + i * 10}%`,
                animation: `lavaRise ${2.5 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.9,
                filter: 'blur(1px)'
              }}
            />
          ))}
        </div>
      );
      
      // Burbujas medianas más rápidas
      layers.push(
        <div key="lava-bubbles-medium" className="absolute inset-0 overflow-hidden" style={{ zIndex: Z_LEVELS.lavaOverlay }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={`lava-med-${i}`}
              className="absolute bg-gradient-to-t from-orange-600 to-yellow-300 rounded-full"
              style={{
                width: `${8 + i * 2}px`,
                height: `${8 + i * 2}px`,
                left: `${12 + i * 6}%`,
                animation: `lavaRise ${1.5 + i * 0.2}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.8
              }}
            />
          ))}
        </div>
      );
      
      // Pequeñas burbujas efervescentes MUY rápidas
      layers.push(
        <div key="effervescent-bubbles" className="absolute inset-0 overflow-hidden" style={{ zIndex: Z_LEVELS.lavaOverlay }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={`fizz-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                left: `${10 + i * 4}%`,
                animation: `bubbleRise ${0.8 + i * 0.1}s linear infinite`,
                animationDelay: `${i * 0.05}s`,
                opacity: 0.9
              }}
            />
          ))}
        </div>
      );
      
      // Efecto de ebullición en el fondo
      layers.push(
        <div key="boiling-effect" className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-red-700 to-transparent animate-pulse" 
             style={{
               clipPath: 'polygon(12% 100%, 88% 100%, 85% 0%, 15% 0%)',
               opacity: 0.7,
               animationDuration: '1s',
               zIndex: Z_LEVELS.lavaOverlay
             }}/>
      );
      
      // Ondas de calor desde el fondo
      layers.push(
        <div key="heat-waves" className="absolute bottom-0 left-1/2 transform -translate-x-1/2" style={{ zIndex: Z_LEVELS.lavaOverlay }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} 
                 className="absolute border-2 border-orange-400 rounded-full animate-[fizz_3s_ease-out_infinite]" 
                 style={{
                   width: `${10 + i * 8}px`,
                   height: `${10 + i * 8}px`,
                   left: `${-5 - i * 4}px`,
                   animationDelay: `${i * 0.6}s`,
                   opacity: 0.4
                 }}/>
          ))}
        </div>
      );
      
      // Indicador de temperatura
      layers.push(
        <div key="temp-indicator" className="absolute top-12 right-2 bg-red-700 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-bounce" style={{ zIndex: Z_LEVELS.indicators }}>
          🌡️ HOT!
        </div>
      );

      if (droppingIngredient === 'tablet') {
        layers.push(
          <div key="tablet-impact" className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3" style={{ zIndex: Z_LEVELS.dropping }}>
            {[...Array(6)].map((_, i) => (
              <div
                key={`tablet-spark-${i}`}
                className="w-2 h-2 bg-white/80 rounded-full animate-[fizz_1.2s_ease-out]"
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
        );
      }
    }
    
    // Animación de ingrediente cayendo con efectos mejorados
    if (droppingIngredient) {
      const ingredient = INGREDIENTS.find(ing => ing.id === droppingIngredient);
      if (ingredient) {
        layers.push(
          <div key="dropping" className="absolute inset-0 pointer-events-none" style={{ zIndex: Z_LEVELS.dropping }}>
            <div 
              className="absolute text-5xl animate-[dropIngredient_1.2s_cubic-bezier(0.25,0.46,0.45,0.94)] drop-shadow-lg"
              style={{ left: '40%', top: '-20px', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.35))', zIndex: Z_LEVELS.dropping }}
            >
              {ingredient.icon}
            </div>
            
            {/* Etiqueta del ingrediente que cae */}
            <div 
              className="absolute text-xs bg-black/70 text-white px-2 py-1 rounded-full animate-[dropIngredient_1.2s_cubic-bezier(0.25,0.46,0.45,0.94)]"
              style={{ left: '30%', top: '0px', zIndex: Z_LEVELS.dropping }}
            >
              {ingredient.name}
            </div>
            
            {/* Estela del ingrediente */}
            <div 
              className="absolute w-1.5 bg-gradient-to-b from-white/90 via-sky-200/60 to-transparent rounded-full animate-[dropIngredient_1.2s_cubic-bezier(0.25,0.46,0.45,0.94)]"
              style={{ left: '48%', top: '0px', height: '60px', zIndex: Z_LEVELS.dropping }}
            />
            
            {/* Partículas que siguen al ingrediente */}
            {[...Array(3)].map((_, i) => (
              <div key={i}
                   className="absolute w-1 h-1 bg-white/40 rounded-full animate-[dropIngredient_1.2s_cubic-bezier(0.25,0.46,0.45,0.94)]"
                   style={{
                     left: `${42 + i * 3}%`,
                     top: `${8 + i * 6}px`,
                     animationDelay: `${i * 0.1}s`,
                     zIndex: Z_LEVELS.dropping
                   }}
              />
            ))}
            
            {/* Halo brillante al caer */}
            <div
              className="absolute w-16 h-16 -translate-x-1/2 rounded-full bg-white/60 blur-xl animate-[dropIngredient_1.2s_cubic-bezier(0.25,0.46,0.45,0.94)]"
              style={{ left: '50%', top: '40px', zIndex: Z_LEVELS.dropping }}
            />
          </div>
        );
      }
    }
    
    return layers;
  };

  return (
    <>
      <style jsx>{`
        @keyframes lavaRise {
          0% {
            bottom: 0px;
            opacity: 0.8;
            transform: scale(0.6);
          }
          30% {
            bottom: 60px;
            opacity: 1;
            transform: scale(1.1);
          }
          70% {
            bottom: 120px;
            opacity: 0.9;
            transform: scale(1.3);
          }
          100% {
            bottom: 180px;
            opacity: 0;
            transform: scale(0.4);
          }
        }
        
        @keyframes bubbleRise {
          0% {
            bottom: 0px;
            opacity: 0.9;
            transform: scale(0.8);
          }
          50% {
            bottom: 80px;
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            bottom: 200px;
            opacity: 0;
            transform: scale(0.6);
          }
        }
        
        @keyframes dropFall {
          0% {
            top: 20px;
            opacity: 0.8;
          }
          100% {
            top: 180px;
            opacity: 0;
          }
        }
        
        @keyframes fillUp {
          0% {
            height: 0px;
            opacity: 0;
            transform: scaleY(0);
          }
          20% {
            height: 30px;
            opacity: 0.3;
            transform: scaleY(0.3) scaleX(1.05);
          }
          60% {
            height: 80px;
            opacity: 0.7;
            transform: scaleY(0.8) scaleX(1.02);
          }
          100% {
            height: 96px;
            opacity: 0.85;
            transform: scaleY(1) scaleX(1);
          }
        }
        
        @keyframes floatUp {
          0% {
            bottom: 0px;
            opacity: 0;
            transform: scaleY(0) scaleX(1.2);
          }
          30% {
            bottom: 30px;
            opacity: 0.5;
            transform: scaleY(0.6) scaleX(1.1);
          }
          70% {
            bottom: 80px;
            opacity: 0.8;
            transform: scaleY(0.9) scaleX(1.02);
          }
          100% {
            bottom: 96px;
            opacity: 0.9;
            transform: scaleY(1) scaleX(1);
          }
        }
        
        @keyframes dropIngredient {
          0% {
            top: -40px;
            opacity: 1;
            transform: scale(1.3) rotate(0deg);
          }
          20% {
            top: 20px;
            transform: scale(1.1) rotate(15deg);
          }
          50% {
            top: 100px;
            transform: scale(0.9) rotate(-10deg);
          }
          80% {
            top: 160px;
            transform: scale(0.7) rotate(5deg);
          }
          100% {
            top: 190px;
            opacity: 0;
            transform: scale(0.4) rotate(0deg);
          }
        }
        
        @keyframes liquidSplash {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          30% {
            transform: scale(1.5) rotate(180deg);
            opacity: 0.8;
          }
          60% {
            transform: scale(1.2) rotate(270deg);
            opacity: 0.6;
          }
          100% {
            transform: scale(0.8) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes waveEffect {
          0% {
            transform: scaleX(1) scaleY(1);
            opacity: 0.8;
          }
          50% {
            transform: scaleX(1.1) scaleY(0.9);
            opacity: 1;
          }
          100% {
            transform: scaleX(1) scaleY(1);
            opacity: 0.8;
          }
        }
        
        @keyframes colorDiffusion {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
            filter: blur(0px);
          }
          25% {
            transform: scale(0.5) rotate(90deg);
            opacity: 0.6;
            filter: blur(2px);
          }
          50% {
            transform: scale(1) rotate(180deg);
            opacity: 0.8;
            filter: blur(4px);
          }
          75% {
            transform: scale(1.3) rotate(270deg);
            opacity: 0.6;
            filter: blur(6px);
          }
          100% {
            transform: scale(1.5) rotate(360deg);
            opacity: 0.4;
            filter: blur(8px);
          }
        }
        
        @keyframes fizz {
          0% {
            transform: scale(0) translateY(0px);
            opacity: 0;
          }
          20% {
            transform: scale(0.8) translateY(-10px);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2) translateY(-25px);
            opacity: 1;
          }
          80% {
            transform: scale(1) translateY(-40px);
            opacity: 0.6;
          }
          100% {
            transform: scale(0.6) translateY(-60px);
            opacity: 0;
          }
        }
      `}</style>
      
      <div className="min-h-screen bg-white py-16 px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -left-10 h-64 w-64 rounded-full bg-sky-300/50 blur-3xl"></div>
        <div className="pointer-events-none absolute top-1/2 -right-16 h-72 w-72 rounded-full bg-rose-300/40 blur-3xl"></div>
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-96 bg-white/40 blur-2xl"></div>

        <div className="max-w-6xl mx-auto relative">
        
        {/* Header del laboratorio */}
        <div className="text-center mb-10 p-6 lg:p-8 bg-white/80 rounded-3xl shadow-[0_20px_45px_rgba(79,70,229,0.15)] border-4 border-dashed border-purple-300">
          <div className="flex justify-center gap-4 mb-3 text-4xl">
            <span className="animate-bounce">🧪</span>
            <span className="animate-pulse">🌈</span>
            <span className="animate-bounce">🌋</span>
          </div>
          <h1 className="text-4xl font-black text-purple-700 mb-2 drop-shadow-sm">
            ¡Lava Lab Junior!
          </h1>
          <p className="text-lg text-purple-500 font-semibold">
            Mezcla ingredientes mágicos y descubre cómo nace una lámpara de lava brillante
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Panel de ingredientes */}
          <div className="bg-white/80 rounded-3xl p-6 lg:p-7 border-4 border-dashed border-sky-300 shadow-[0_12px_30px_rgba(56,189,248,0.2)] relative overflow-hidden">
            <div className="pointer-events-none absolute -top-8 -right-12 h-32 w-32 bg-sky-200/70 rotate-12 rounded-full blur-2xl"></div>
            <h2 className="text-2xl font-extrabold text-sky-600 mb-4 text-center tracking-wide">
              🧴 Ingredientes
            </h2>
            <p className="text-sm text-sky-500 text-center mb-4">Arrastra cada ingrediente al frasco siguiendo el orden de la receta.</p>
            <div className="grid grid-cols-2 gap-4">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  draggable={!ingredient.added}
                  onDragStart={(e) => handleDragStart(e, ingredient.id)}
                  className={`p-4 rounded-2xl border-4 text-center cursor-move transition-all duration-300 font-semibold tracking-wide ${
                    ingredient.added 
                      ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                      : 'bg-white border-sky-300 text-sky-600 hover:scale-105 hover:shadow-lg hover:-rotate-1'
                  }`}
                >
                  <div className="text-4xl mb-2 drop-shadow-sm">{ingredient.icon}</div>
                  <div>{ingredient.name}</div>
                  {ingredient.added && <div className="text-emerald-500 text-sm mt-1">¡Listo!</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Área del experimento */}
          <div className="bg-white/80 rounded-3xl p-6 lg:p-7 border-4 border-dashed border-amber-300 shadow-[0_12px_30px_rgba(251,191,36,0.25)] relative">
            <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-amber-200/60 blur-xl"></div>
            <div className="pointer-events-none absolute top-3 right-8 text-3xl animate-bounce">🧫</div>
            <h2 className="text-2xl font-extrabold text-amber-600 mb-4 text-center">
              🥽 ¡Hora de experimentar!
            </h2>
            
            {/* Beaker de laboratorio */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Beaker principal */}
                <div 
                  className="relative w-44 h-56 bg-gradient-to-b from-white/70 via-white/40 to-white/30 shadow-2xl overflow-hidden"
                  style={{
                    clipPath: 'polygon(15% 0%, 85% 0%, 90% 100%, 10% 100%)',
                    backdropFilter: 'blur(1px)',
                    border: '3px solid rgba(200, 220, 255, 0.8)',
                    borderRadius: '8px 8px 12px 12px'
                  }}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {renderJarContent()}
                  
                  {/* Graduaciones del beaker */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="absolute left-0 w-8 h-0.5 bg-blue-300/60" 
                           style={{ bottom: `${20 + i * 22}px` }}>
                        <span className="absolute left-10 text-xs text-blue-400 font-mono">
                          {(i + 1) * 50}ml
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pico vertedor */}
                  <div className="absolute -right-3 top-8 w-6 h-3 bg-gradient-to-r from-blue-100/80 to-transparent" 
                       style={{
                         clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)'
                       }}>
                  </div>
                  
                  {/* Reflejos del vidrio */}
                  <div className="absolute top-4 left-2 w-2 h-16 bg-gradient-to-b from-white/80 to-transparent rounded-full blur-sm"></div>
                  <div className="absolute top-12 right-3 w-1 h-10 bg-gradient-to-b from-white/60 to-transparent rounded-full"></div>
                  
                  {/* Efectos de animación exitosa */}
                  {showAnimation && (
                    <>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-3xl animate-bounce">
                        ✨
                      </div>
                      <div className="absolute -top-4 left-1/4 text-2xl animate-pulse" style={{animationDelay: '0.5s'}}>
                        🧪
                      </div>
                      <div className="absolute -top-4 right-1/4 text-2xl animate-pulse" style={{animationDelay: '1s'}}>
                        🌟
                      </div>
                    </>
                  )}
                </div>
                
                {/* Base del beaker */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-36 h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-full shadow-lg"></div>
              </div>
            </div>

            {/* Mensaje de estado */}
            <div className="bg-purple-100/70 border border-purple-200 rounded-2xl p-4 text-center shadow-inner">
              <p className="text-purple-600 font-semibold text-sm lg:text-base leading-relaxed">{message}</p>
            </div>

            {/* Botón de reset */}
            <div className="mt-4 text-center">
              <button
                onClick={reset}
                className="bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold px-6 py-2 rounded-full transition-transform duration-200 shadow-lg hover:-translate-y-0.5"
              >
                🔄 ¡Quiero empezar otra vez!
              </button>
            </div>
          </div>

          {/* Panel de receta */}
          <div className="bg-white/80 rounded-3xl p-6 lg:p-7 border-4 border-dashed border-purple-300 shadow-[0_12px_30px_rgba(192,132,252,0.25)] relative overflow-hidden">
            <div className="pointer-events-none absolute top-2 left-6 text-3xl animate-pulse">📎</div>
            <h2 className="text-2xl font-extrabold text-purple-600 mb-4 text-center">
              📋 Pasos mágicos
            </h2>
            <div className="space-y-3">
              {RECIPE_STEPS.map((step, index) => (
                <div
                  key={step.ingredient}
                  className={`p-3 rounded-2xl border-4 transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-purple-100 border-purple-300 text-purple-600'
                      : 'bg-white border-slate-200 text-slate-400'
                  } ${index === currentStep ? 'ring-4 ring-offset-2 ring-pink-200 animate-pulse' : ''}`}
                >
                  <div className="font-semibold">{step.description}</div>
                  <div className="text-sm opacity-80">{step.effect}</div>
                  {index < currentStep && (
                    <div className="text-emerald-500 text-sm mt-1 font-semibold">✨ Completado</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popup de éxito */}
        {isComplete && (
          <div className="fixed inset-0 bg-purple-200/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-[0_25px_50px_rgba(124,58,237,0.25)] border-4 border-dashed border-pink-300 animate-[bounce_1.4s_infinite]">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-black text-purple-600 mb-4 drop-shadow-sm">
                ¡Experimento exitoso!
              </h2>
              <p className="text-lg text-rose-500 mb-6 font-semibold leading-relaxed">
                ¡Tu lámpara de lava está burbujeando de emoción! ¡Sigue creando y probando nuevas ideas!
              </p>
              <div className="text-4xl mb-6">🌋✨🧪</div>
              <button 
                onClick={() => setIsComplete(false)}
                className="bg-gradient-to-r from-violet-400 to-pink-400 hover:from-violet-500 hover:to-pink-500 text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                ¡Continuar experimentando!
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
