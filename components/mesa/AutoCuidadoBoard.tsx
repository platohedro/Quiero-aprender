"use client";
import React, { useEffect, useState } from "react";

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

// TABLERO CON 45 CASILLAS - DISTRIBUCIÓN RECTANGULAR COMPLETA
const BOARD_PATH = [
  // INICIO - Esquina inferior izquierda
  {x: 80, y: 560, number: 'INICIO', color: '#EF4444', special: 'start', text: null}, // 0

  // Lado inferior - hacia la derecha (15 casillas)
  {x: 140, y: 560, number: '1', color: '#F97316', special: null, text: null}, // 1
  {x: 200, y: 560, number: '2', color: '#F59E0B', special: null, text: null}, // 2
  {x: 260, y: 560, number: '3', color: '#EAB308', special: null, text: null}, // 3
  {x: 320, y: 560, number: '4', color: '#84CC16', special: null, text: null}, // 4
  {x: 380, y: 560, number: '5', color: '#22C55E', special: 'advice', text: null}, // 5
  {x: 440, y: 560, number: '6', color: '#10B981', special: null, text: null}, // 6
  {x: 500, y: 560, number: '7', color: '#14B8A6', special: null, text: null}, // 7
  {x: 560, y: 560, number: '8', color: '#06B6D4', special: null, text: null}, // 8
  {x: 620, y: 560, number: '9', color: '#0EA5E9', special: 'challenge', text: null}, // 9
  {x: 680, y: 560, number: '10', color: '#3B82F6', special: null, text: null}, // 10
  {x: 740, y: 560, number: '11', color: '#6366F1', special: null, text: null}, // 11

  // Lado derecho - subiendo (11 casillas)
  {x: 740, y: 470, number: '12', color: '#8B5CF6', special: null, text: null}, // 12
  {x: 740, y: 420, number: '13', color: '#A855F7', special: 'advice', text: null}, // 13
  {x: 740, y: 370, number: '14', color: '#C084FC', special: null, text: null}, // 14
  {x: 740, y: 320, number: '15', color: '#E879F9', special: null, text: null}, // 15
  {x: 740, y: 270, number: '16', color: '#F0ABFC', special: null, text: null}, // 16
  {x: 740, y: 220, number: '17', color: '#22D3EE', special: 'challenge', text: null}, // 17
  {x: 740, y: 170, number: '18', color: '#06B6D4', special: null, text: null}, // 18
  {x: 740, y: 120, number: '19', color: '#0891B2', special: null, text: null}, // 19
  {x: 740, y: 70, number: '20', color: '#0E7490', special: null, text: null}, // 20

  // Esquina superior derecha
  {x: 740, y: 20, number: '21', color: '#155E75', special: 'advice', text: null}, // 21

  // Lado superior - hacia la izquierda (11 casillas)
  {x: 680, y: 20, number: '22', color: '#FDE047', special: null, text: null}, // 22
  {x: 620, y: 20, number: '23', color: '#FACC15', special: null, text: null}, // 23
  {x: 560, y: 20, number: '24', color: '#EAB308', special: 'challenge', text: null}, // 24
  {x: 500, y: 20, number: '25', color: '#CA8A04', special: null, text: null}, // 25
  {x: 440, y: 20, number: '26', color: '#A16207', special: null, text: null}, // 26
  {x: 380, y: 20, number: '27', color: '#92400E', special: null, text: null}, // 27
  {x: 320, y: 20, number: '28', color: '#78350F', special: 'advice', text: null}, // 28
  {x: 260, y: 20, number: '29', color: '#451A03', special: null, text: null}, // 29
  {x: 200, y: 20, number: '30', color: '#7C2D12', special: null, text: null}, // 30
  {x: 140, y: 20, number: '31', color: '#991B1B', special: null, text: null}, // 31
  {x: 80, y: 20, number: '32', color: '#B91C1C', special: 'challenge', text: null}, // 32

  // Lado izquierdo - bajando (11 casillas)
  {x: 80, y: 70, number: '33', color: '#DC2626', special: null, text: null}, // 33
  {x: 80, y: 120, number: '34', color: '#EF4444', special: null, text: null}, // 34
  {x: 80, y: 170, number: '35', color: '#F87171', special: 'advice', text: null}, // 35
  {x: 80, y: 220, number: '36', color: '#FCA5A5', special: null, text: null}, // 36
  {x: 80, y: 270, number: '37', color: '#FECACA', special: null, text: null}, // 37
  {x: 80, y: 320, number: '38', color: '#FEE2E2', special: null, text: null}, // 38
  {x: 80, y: 370, number: '39', color: '#FEF2F2', special: 'challenge', text: null}, // 39
  {x: 80, y: 420, number: '40', color: '#FB923C', special: null, text: null}, // 40
  {x: 80, y: 470, number: '41', color: '#F97316', special: null, text: null}, // 41

  // Últimas casillas hacia la meta
  {x: 140, y: 470, number: '42', color: '#EA580C', special: 'advice', text: null}, // 42
  {x: 200, y: 470, number: '43', color: '#DC2626', special: null, text: null}, // 43
  {x: 260, y: 470, number: '44', color: '#B91C1C', special: null, text: null}, // 44

  // META
  {x: 320, y: 470, number: 'META', color: '#10B981', special: 'finish', text: null}, // 45
];

// TARJETAS DE CONSEJOS DE AUTOCUIDADO
const ADVICE_CARDS = [
  {
    id: 1,
    title: 'Pausa Digital',
    icon: '📴',
    description: 'Tómate 10 minutos sin pantallas para estirar el cuerpo y relajar tus ojos.',
    prompt: '¿Te gustaría intentarlo hoy?'
  },
  {
    id: 2,
    title: 'Agua Fresca',
    icon: '💧',
    description: 'Bebe un vaso de agua y respira profundo para recargar tu energía.',
    prompt: '¿Quieres seguir este consejo?'
  },
  {
    id: 3,
    title: 'Diario Agradecido',
    icon: '📓',
    description: 'Escribe algo que agradezcas hoy para cuidar tu mente y emociones.',
    prompt: '¿Lo harías ahora mismo?'
  },
  {
    id: 4,
    title: 'Movimiento Activo',
    icon: '🤸‍♂️',
    description: 'Haz 5 saltos o una mini rutina para activar tu cuerpo.',
    prompt: '¿Te animas a moverte?'
  },
  {
    id: 5,
    title: 'Tiempo Al Aire Libre',
    icon: '🌳',
    description: 'Asómate a una ventana o sal un momento para respirar aire fresco.',
    prompt: '¿Te gusta este consejo?'
  }
];

// PREGUNTAS DE AUTOCUIDADO
const QUESTION_CARDS = [
  {
    id: 1,
    question: '¿Tomaste al menos 5 vasos de agua hoy?',
    reflection: 'Hidratarte mantiene tu cuerpo en equilibrio.'
  },
  {
    id: 2,
    question: '¿Dedicaste tiempo para moverte o hacer ejercicio?',
    reflection: 'El movimiento despierta tu cuerpo y tu mente.'
  },
  {
    id: 3,
    question: '¿Dormiste al menos 8 horas anoche?',
    reflection: 'Dormir bien te ayuda a pensar con claridad.'
  },
  {
    id: 4,
    question: '¿Tomaste un descanso cuando te sentiste cansado?',
    reflection: 'Respetar tus pausas te mantiene con energía.'
  },
  {
    id: 5,
    question: '¿Hablaste con alguien sobre cómo te sientes?',
    reflection: 'Compartir tus emociones es parte del autocuidado.'
  }
];

const SVG_WIDTH = 1900;
const SVG_HEIGHT = 1400;
const SCALE_X = 2.4;
const SCALE_Y = 2.4;
const SQUARE_WIDTH = 110;
const SQUARE_HEIGHT = 90;

const scalePoint = (point: { x: number; y: number }) => ({
  x: point.x * SCALE_X,
  y: point.y * SCALE_Y,
});

const total = BOARD_PATH.length;

export default function AutoCuidadoBoard(){
  const [pos,setPos]=useState(0); 
  const [rolling,setRolling]=useState(false); 
  const [dieVal,setDieVal]=useState<1|2|3|4|5|6>(1);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [log,setLog]=useState<string[]>([]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<typeof QUESTION_CARDS[0] | null>(null);
  const [showAdviceCard, setShowAdviceCard] = useState(false);
  const [currentAdviceCard, setCurrentAdviceCard] = useState<typeof ADVICE_CARDS[0] | null>(null);
  const [playerMovingToCard, setPlayerMovingToCard] = useState(false);
  const [playerAtCardPosition, setPlayerAtCardPosition] = useState<{x: number, y: number} | null>(null);

  const resetBoard = () => { 
    setPos(0); 
    setRolling(false); 
    setDieVal(1); 
    setLastRoll(null);
    setShowQuestion(false);
    setCurrentQuestion(null);
    setShowAdviceCard(false);
    setCurrentAdviceCard(null);
    setPlayerMovingToCard(false);
    setPlayerAtCardPosition(null);
    setLog((l: string[]) => ['🔄 Juego reiniciado', ...l]); 
  };

  const stepMove = async (delta: number) => { 
    const direction = delta >= 0 ? 1 : -1;
    const steps = Math.abs(delta);
    
    for(let s = 0; s < steps; s++) { 
      await new Promise(r => setTimeout(r, 200)); 
      setPos((p: number) => {
        const next = p + direction;
        return Math.min(total - 1, Math.max(0, next));
      }); 
    } 
    await new Promise(r => setTimeout(r, 100)); 
  };

  const movePlayerToCardPile = async (isAdvice: boolean) => {
    setPlayerMovingToCard(true);
    
    // Coordenadas de las pilas de tarjetas (centro del tablero con 45 casillas)
    const advicePilePos = { x: 320, y: 280 }; // Centro izquierda 
    const questionPilePos = { x: 500, y: 280 }; // Centro derecha 
    const targetPos = isAdvice ? advicePilePos : questionPilePos;
    
    // Animar el jugador hacia la pila
    setPlayerAtCardPosition(targetPos);
    
    // Esperar que termine la animación
    await new Promise(r => setTimeout(r, 1000));
    
    // Simular "tomar" la tarjeta
    await new Promise(r => setTimeout(r, 500));
    
    // Volver a la casilla original
    setPlayerAtCardPosition(null);
    setPlayerMovingToCard(false);
  };

  const handleSpecialSquare = async (square: typeof BOARD_PATH[0]) => {
    if (square.special === 'advice') {
      setLog((l: string[]) => [`💡 Casilla ${square.number} - ¡Yendo a buscar un consejo!`, ...l]);
      await movePlayerToCardPile(true);
      // Mostrar consejo aleatorio
      const randomAdvice = ADVICE_CARDS[Math.floor(Math.random() * ADVICE_CARDS.length)];
      setCurrentAdviceCard(randomAdvice);
      setShowAdviceCard(true);
      setLog((l: string[]) => [`📋 Tomaste una tarjeta de consejo`, ...l]);
    } else if (square.special === 'challenge') {
      setLog((l: string[]) => [`❓ Casilla ${square.number} - ¡Yendo a buscar tarjeta de preguntas!`, ...l]);
      await movePlayerToCardPile(false);
      // Mostrar pregunta aleatoria
      const randomQuestion = QUESTION_CARDS[Math.floor(Math.random() * QUESTION_CARDS.length)];
      setCurrentQuestion(randomQuestion);
      setShowQuestion(true);
      setLog((l: string[]) => [`🃏 Tomaste una tarjeta de preguntas`, ...l]);
    }
  };

  const handleQuestionAnswer = async (answer: 'yes' | 'no') => {
    if (!currentQuestion) return;
    
    const stepsToMove = lastRoll ?? dieVal;
    const startingPos = pos;
    const intendedMovement = (answer === 'yes' ? 1 : -1) * stepsToMove;
    const targetIndex = Math.min(total - 1, Math.max(0, startingPos + intendedMovement));
    const actualMovement = targetIndex - startingPos;
    const movementMagnitude = Math.abs(actualMovement);
    const movementLabel = actualMovement >= 0 ? '⬆️ Avanzas' : '⬇️ Retrocedes';
    const movementSign = actualMovement >= 0 ? '+' : '-';
    const movementMessage = movementMagnitude === 0
      ? '🚫 Te quedas en la misma casilla'
      : `${movementLabel} ${movementMagnitude} casillas (${movementSign}${movementMagnitude})`;
    const finalSquareLabel = BOARD_PATH[targetIndex]?.number || targetIndex.toString();
    
    setLog((l: string[]) => [
      `${answer === 'yes' ? '✅' : '❌'} ${currentQuestion.question}`,
      movementMessage,
      `💬 ${currentQuestion.reflection}`,
      `📍 Nueva posición: ${finalSquareLabel}`,
      ...l
    ]);
    
    setShowQuestion(false);
    setCurrentQuestion(null);
    
    if (actualMovement !== 0) {
      await stepMove(actualMovement);
    }
  };

  const handleAdviceChoice = async (choice: 'yes' | 'no') => {
    if (!currentAdviceCard) return;
    
    const stepsToMove = lastRoll ?? dieVal;
    const startingPos = pos;
    const intendedMovement = (choice === 'yes' ? 1 : -1) * stepsToMove;
    const targetIndex = Math.min(total - 1, Math.max(0, startingPos + intendedMovement));
    const actualMovement = targetIndex - startingPos;
    const movementMagnitude = Math.abs(actualMovement);
    const movementLabel = actualMovement >= 0 ? '⬆️ Avanzas' : '⬇️ Retrocedes';
    const movementSign = actualMovement >= 0 ? '+' : '-';
    const movementMessage = movementMagnitude === 0
      ? '🚫 Te quedas en la misma casilla'
      : `${movementLabel} ${movementMagnitude} casillas (${movementSign}${movementMagnitude})`;
    const finalSquareLabel = BOARD_PATH[targetIndex]?.number || targetIndex.toString();
    
    setLog((l: string[]) => [
      `${choice === 'yes' ? '👍' : '👎'} Consejo: ${currentAdviceCard.title}`,
      movementMessage,
      `💬 ${currentAdviceCard.prompt}`,
      `📍 Nueva posición: ${finalSquareLabel}`,
      ...l
    ]);
    
    setShowAdviceCard(false);
    setCurrentAdviceCard(null);
    
    if (actualMovement !== 0) {
      await stepMove(actualMovement);
    }
  };

  const roll = async () => {
    if (rolling) return; 
    setRolling(true);
    const start = Date.now();
    
    const finish = async () => {
      const finalVal = (1 + Math.floor(Math.random() * 6)) as 1|2|3|4|5|6; 
      setDieVal(finalVal);
      setLastRoll(finalVal);
      const startPos = pos; // Guardar posición inicial
      const targetPos = Math.min(total - 1, startPos + finalVal);
      const actualMovement = targetPos - startPos;
      const targetLabel = BOARD_PATH[targetPos]?.number || targetPos.toString();
      
      setLog((l: string[]) => [`🎲 Tiraste ${finalVal} → Objetivo casilla ${targetLabel}`, ...l]);
      
      // Mover al jugador paso a paso
      await stepMove(actualMovement);
      
      // Después del movimiento, verificar la casilla donde quedó
      const landingSquare = BOARD_PATH[targetPos];
      
      setLog((l: string[]) => [`📍 Llegaste a la casilla ${landingSquare?.number || targetPos}`, ...l]);
      
      // Verificar si es casilla especial
      if (landingSquare?.special && landingSquare.special !== 'start' && landingSquare.special !== 'finish') {
        setTimeout(() => handleSpecialSquare(landingSquare), 500);
      }
      
      setRolling(false);
    };
    
    const tick = () => { 
      const elapsed = Date.now() - start; 
      setDieVal((1 + Math.floor(Math.random() * 6)) as 1|2|3|4|5|6); 
      if (elapsed < 900) { 
        requestAnimationFrame(tick); 
      } else { 
        finish(); 
      } 
    };
    
    tick();
  };

  const currentSquare = BOARD_PATH[pos] || BOARD_PATH[0];
  
  // Posición del jugador (casilla actual o animándose hacia una pila de tarjetas)
  const playerPosition = playerAtCardPosition || currentSquare;
  const displayPlayerPosition = scalePoint(playerPosition);
  const pendingMovement = lastRoll ?? dieVal;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-blue-100 p-4 overflow-hidden flex flex-col gap-6">
      {/* CONTROLES Y REGISTRO */}
      <div className="w-full flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-80 space-y-4">
          {/* Panel principal */}
          <div className="bg-white rounded-2xl p-4 shadow-xl border-3 border-green-300">
            <div className="flex items-center gap-2 mb-4">
              <button 
                onClick={roll} 
                disabled={rolling || pos >= total - 1 || showQuestion || showAdviceCard} 
                className="flex-1 px-4 py-2 rounded-xl bg-green-600 text-white disabled:opacity-50 shadow-md hover:bg-green-700 transition-all font-bold text-sm"
              >
                {rolling ? 'TIRANDO...' : 'TIRAR DADO'}
              </button>
              <button 
                onClick={resetBoard} 
                className="px-3 py-2 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 transition-colors"
              >
                🔄
              </button>
            </div>
            
            <div className="flex justify-center mb-4">
              <FancyDie value={dieVal} rolling={rolling} />
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-green-700">
                Posición: {pos === 0 ? 'INICIO' : BOARD_PATH[pos]?.number} 
              </div>
              {pos === total - 1 && (
                <div className="mt-2 text-sm font-bold text-green-600 bg-green-50 p-2 rounded-lg">
                  🎉 ¡LLEGASTE A LA META!
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Registro */}
        <div className="bg-white rounded-2xl p-4 shadow-xl border-3 border-purple-300 lg:flex-1 max-h-96 overflow-auto">
          <h3 className="font-bold text-purple-800 mb-2 text-sm">📝 REGISTRO</h3>
          <div className="space-y-1 text-xs">
            {log.map((line: string, i: number) => (
              <div key={i} className="text-gray-700 border-b border-gray-100 pb-1">
                {line}
              </div>
            ))}
            {log.length === 0 && (
              <div className="text-gray-400 italic">Los movimientos aparecerán aquí...</div>
            )}
          </div>
        </div>
      </div>

      {/* Tablero principal - SOLO EL JUEGO */}
      <div className="relative flex-1 min-h-[720px] bg-white rounded-3xl shadow-[0_25px_60px_rgba(15,23,42,0.1)] border-4 border-blue-300 overflow-visible">
        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
          <div className="relative w-full h-full max-w-[1200px] mx-auto">
            {/* TÍTULO SUPERIOR */}
            

            {/* ÁREA CENTRAL - TEMA AUTOCUIDADO */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-gradient-to-br from-white to-blue-50 rounded-full shadow-[0_30px_60px_rgba(59,130,246,0.25)] border-[12px] border-blue-400 flex flex-col items-center justify-center">
              <div className="text-[6.5rem] mb-4 drop-shadow-sm">🌿</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-800 mb-1 tracking-wide">AUTOCUIDADO</div>
                <div className="text-2xl font-semibold text-blue-600">INTEGRAL</div>
              </div>
            </div>

            {/* CASILLAS DEL TABLERO */}
            <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="absolute inset-0 w-full h-full">
              {/* Líneas conectoras */}
              {BOARD_PATH.map((square, i) => {
                if (i === BOARD_PATH.length - 1) return null;
                const nextSquare = BOARD_PATH[i + 1];
                const { x: x1, y: y1 } = scalePoint(square);
                const { x: x2, y: y2 } = scalePoint(nextSquare);
                return (
                  <line 
                    key={i}
                    x1={x1} 
                    y1={y1} 
                    x2={x2} 
                    y2={y2} 
                    stroke="#64748b" 
                    strokeWidth={5}
                    strokeLinecap="round"
                    opacity={0.35}
                  />
                );
              })}
              
              {/* Casillas */}
              {BOARD_PATH.map((square, i) => {
                const isCurrentPos = pos === i;
                const isSpecial = square.special !== null;
                const { x, y } = scalePoint(square);
                
                return (
                  <g key={i}>
                    <rect 
                      x={x - SQUARE_WIDTH / 2} 
                      y={y - SQUARE_HEIGHT / 2} 
                      width={SQUARE_WIDTH} 
                      height={SQUARE_HEIGHT}
                      rx={22}
                      fill={square.color}
                      stroke="#fff" 
                      strokeWidth={4}
                      filter={isCurrentPos ? 'drop-shadow(0 0 22px rgba(59, 130, 246, 0.9))' : 'drop-shadow(0 10px 20px rgba(15, 23, 42, 0.22))'}
                      className={isCurrentPos ? 'animate-pulse' : ''}
                    />
                    
                    <text 
                      x={x} 
                      y={y} 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      fontSize={square.special ? "28" : "36"} 
                      fontWeight="800" 
                      fill="#1f2937"
                    >
                      {square.number}
                    </text>
                    
                    {square.text && (
                      <text 
                        x={x} 
                        y={y - (SQUARE_HEIGHT / 2) + 20} 
                        textAnchor="middle" 
                        fontSize="14" 
                        fill="#4b5563"
                        fontWeight="600"
                      >
                        {square.text}
                      </text>
                    )}
                    
                    {isSpecial && (
                      <circle 
                        cx={x + (SQUARE_WIDTH / 2) - 18} 
                        cy={y - (SQUARE_HEIGHT / 2) + 18} 
                        r={8} 
                        fill={square.special === 'advice' ? '#22C55E' : square.special === 'challenge' ? '#EF4444' : '#3B82F6'}
                        stroke="#fff" 
                        strokeWidth={2}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* JUGADOR */}
            <div 
              className={`absolute z-20 ${
                playerMovingToCard ? 'transition-all duration-1000 ease-in-out' : 'transition-all duration-700 ease-in-out'
              }`}
              style={{ 
                left: `${(displayPlayerPosition.x / SVG_WIDTH) * 100}%`, 
                top: `${(displayPlayerPosition.y / SVG_HEIGHT) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className={`w-20 h-20 rounded-full border-[6px] border-white bg-gradient-to-br from-yellow-400 to-orange-500 shadow-2xl flex items-center justify-center text-white text-3xl ${
                playerMovingToCard ? 'animate-bounce' : ''
              }`}>
                🧒
              </div>
              {playerMovingToCard && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-sm font-bold text-blue-800 bg-white px-3 py-1 rounded-full shadow-lg">
                  🏃‍♂️ Tomando tarjeta...
                </div>
              )}
            </div>

            {/* PILA DE TARJETAS CONSEJOS */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12 z-30" style={{marginLeft: '-180px'}}>
              <div className="relative scale-[1.35]">
                <div className="absolute w-24 h-32 bg-blue-400 rounded-lg shadow-lg transform translate-x-1 translate-y-1"></div>
                <div className="absolute w-24 h-32 bg-blue-300 rounded-lg shadow-lg transform translate-x-0.5 translate-y-0.5"></div>
                <div className="relative w-24 h-32 bg-blue-500 rounded-lg shadow-xl border-2 border-white flex flex-col items-center justify-center text-white cursor-pointer">
                  <div className="text-sm font-bold text-center mb-1">CONSEJOS</div>
                  <div className="text-3xl mb-1">📋</div>
                  <div className="text-xs text-center px-1 leading-tight opacity-90">
                    Respira
                    Estira
                    Hidrátate
                  </div>
                </div>
              </div>
            </div>

            {/* PILA DE TARJETAS PREGUNTAS */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-6 z-30" style={{marginLeft: '180px'}}>
              <div className="relative scale-[1.35]">
                <div className="absolute w-24 h-32 bg-yellow-400 rounded-lg shadow-lg transform translate-x-1 translate-y-1"></div>
                <div className="absolute w-24 h-32 bg-yellow-300 rounded-lg shadow-lg transform translate-x-0.5 translate-y-0.5"></div>
                <div className="relative w-24 h-32 bg-yellow-500 rounded-lg shadow-xl border-2 border-white flex flex-col items-center justify-center text-white cursor-pointer">
                  <div className="text-sm font-bold text-center mb-1">PREGUNTAS</div>
                  <div className="text-3xl mb-1">❓</div>
                  <div className="text-xs text-center px-1 leading-tight opacity-90">
                    Responde
                    para
                    avanzar
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL DE PREGUNTAS */}
        {showQuestion && currentQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border-4 border-yellow-400 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-center">
                <div className="text-4xl mb-2">❓</div>
                <h3 className="text-xl font-bold">PREGUNTA</h3>
              </div>
              <div className="p-6">
                <p className="text-lg font-medium text-gray-800 text-center">
                  {currentQuestion.question}
                </p>
                <p className="mt-4 text-sm text-gray-600 text-center">
                  {currentQuestion.reflection}
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleQuestionAnswer('no')}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                  >
                    NO
                    <div className="text-xs opacity-80">Retrocedes {pendingMovement} casillas</div>
                  </button>
                  <button
                    onClick={() => handleQuestionAnswer('yes')}
                    className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
                  >
                    SÍ
                    <div className="text-xs opacity-80">Avanzas {pendingMovement} casillas</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE TARJETAS DE CONSEJOS */}
        {showAdviceCard && currentAdviceCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border-4 border-blue-400 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-center">
                <div className="text-5xl mb-2">{currentAdviceCard.icon}</div>
                <h3 className="text-2xl font-bold">{currentAdviceCard.title}</h3>
              </div>
              <div className="p-6">
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-lg text-gray-800 text-center leading-relaxed">
                    {currentAdviceCard.description}
                  </p>
                </div>
                <p className="text-center text-base font-medium text-blue-800 mb-6">
                  {currentAdviceCard.prompt}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAdviceChoice('no')}
                    className="flex-1 px-6 py-4 bg-red-500 text-white rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg"
                  >
                    No me gusta
                    <div className="text-xs opacity-80 mt-1">Retrocedes {pendingMovement} casillas</div>
                  </button>
                  <button
                    onClick={() => handleAdviceChoice('yes')}
                    className="flex-1 px-6 py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg"
                  >
                    ¡Sí, me gusta!
                    <div className="text-xs opacity-80 mt-1">Avanzas {pendingMovement} casillas</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
