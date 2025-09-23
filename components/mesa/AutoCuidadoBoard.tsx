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
  {x: 80, y: 520, number: 'INICIO', color: '#EF4444', special: 'start', text: null}, // 0

  // Lado inferior - hacia la derecha (15 casillas)
  {x: 140, y: 520, number: '1', color: '#F97316', special: null, text: null}, // 1
  {x: 200, y: 520, number: '2', color: '#F59E0B', special: null, text: null}, // 2
  {x: 260, y: 520, number: '3', color: '#EAB308', special: null, text: null}, // 3
  {x: 320, y: 520, number: '4', color: '#84CC16', special: null, text: null}, // 4
  {x: 380, y: 520, number: '5', color: '#22C55E', special: 'habit', text: null}, // 5
  {x: 440, y: 520, number: '6', color: '#10B981', special: null, text: null}, // 6
  {x: 500, y: 520, number: '7', color: '#14B8A6', special: null, text: null}, // 7
  {x: 560, y: 520, number: '8', color: '#06B6D4', special: null, text: null}, // 8
  {x: 620, y: 520, number: '9', color: '#0EA5E9', special: 'challenge', text: null}, // 9
  {x: 680, y: 520, number: '10', color: '#3B82F6', special: null, text: null}, // 10
  {x: 740, y: 520, number: '11', color: '#6366F1', special: null, text: null}, // 11

  // Lado derecho - subiendo (11 casillas)
  {x: 740, y: 470, number: '12', color: '#8B5CF6', special: null, text: null}, // 12
  {x: 740, y: 420, number: '13', color: '#A855F7', special: 'habit', text: null}, // 13
  {x: 740, y: 370, number: '14', color: '#C084FC', special: null, text: null}, // 14
  {x: 740, y: 320, number: '15', color: '#E879F9', special: null, text: null}, // 15
  {x: 740, y: 270, number: '16', color: '#F0ABFC', special: null, text: null}, // 16
  {x: 740, y: 220, number: '17', color: '#22D3EE', special: 'challenge', text: null}, // 17
  {x: 740, y: 170, number: '18', color: '#06B6D4', special: null, text: null}, // 18
  {x: 740, y: 120, number: '19', color: '#0891B2', special: null, text: null}, // 19
  {x: 740, y: 70, number: '20', color: '#0E7490', special: null, text: null}, // 20

  // Esquina superior derecha
  {x: 740, y: 40, number: '21', color: '#155E75', special: 'habit', text: null}, // 21

  // Lado superior - hacia la izquierda (11 casillas)
  {x: 680, y: 40, number: '22', color: '#FDE047', special: null, text: null}, // 22
  {x: 620, y: 40, number: '23', color: '#FACC15', special: null, text: null}, // 23
  {x: 560, y: 40, number: '24', color: '#EAB308', special: 'challenge', text: null}, // 24
  {x: 500, y: 40, number: '25', color: '#CA8A04', special: null, text: null}, // 25
  {x: 440, y: 40, number: '26', color: '#A16207', special: null, text: null}, // 26
  {x: 380, y: 40, number: '27', color: '#92400E', special: null, text: null}, // 27
  {x: 320, y: 40, number: '28', color: '#78350F', special: 'habit', text: null}, // 28
  {x: 260, y: 40, number: '29', color: '#451A03', special: null, text: null}, // 29
  {x: 200, y: 40, number: '30', color: '#7C2D12', special: null, text: null}, // 30
  {x: 140, y: 40, number: '31', color: '#991B1B', special: null, text: null}, // 31
  {x: 80, y: 40, number: '32', color: '#B91C1C', special: 'challenge', text: null}, // 32

  // Lado izquierdo - bajando (11 casillas)
  {x: 80, y: 70, number: '33', color: '#DC2626', special: null, text: null}, // 33
  {x: 80, y: 120, number: '34', color: '#EF4444', special: null, text: null}, // 34
  {x: 80, y: 170, number: '35', color: '#F87171', special: 'habit', text: null}, // 35
  {x: 80, y: 220, number: '36', color: '#FCA5A5', special: null, text: null}, // 36
  {x: 80, y: 270, number: '37', color: '#FECACA', special: null, text: null}, // 37
  {x: 80, y: 320, number: '38', color: '#FEE2E2', special: null, text: null}, // 38
  {x: 80, y: 370, number: '39', color: '#FEF2F2', special: 'challenge', text: null}, // 39
  {x: 80, y: 420, number: '40', color: '#FB923C', special: null, text: null}, // 40
  {x: 80, y: 470, number: '41', color: '#F97316', special: null, text: null}, // 41

  // Últimas casillas hacia la meta
  {x: 140, y: 470, number: '42', color: '#EA580C', special: 'habit', text: null}, // 42
  {x: 200, y: 470, number: '43', color: '#DC2626', special: null, text: null}, // 43
  {x: 260, y: 470, number: '44', color: '#B91C1C', special: null, text: null}, // 44

  // META
  {x: 320, y: 470, number: 'META', color: '#10B981', special: 'finish', text: null}, // 45
];

// TARJETAS DE HÁBITOS según el boceto
const HABIT_CARDS = [
  {
    id: 1,
    title: 'ENJUAGUE BUCAL',
    icon: '🫗',
    description: 'Usar enjuague bucal después del cepillado fortalece tus dientes',
    action: 'Avanza 3 casillas',
    color: '#22D3EE'
  },
  {
    id: 2, 
    title: 'VISITA AL DENTISTA',
    icon: '🦷',
    description: 'Ir al dentista cada 6 meses previene problemas dentales',
    action: 'Avanza 4 casillas',
    color: '#3B82F6'
  },
  {
    id: 3,
    title: 'CEPILLADO NOCTURNO',
    icon: '🪥', 
    description: 'Cepillarse antes de dormir elimina las bacterias del día',
    action: 'Avanza 2 casillas',
    color: '#FDE047'
  },
  {
    id: 4,
    title: 'HILO DENTAL',
    icon: '🧵', 
    description: 'El hilo dental limpia entre los dientes donde no llega el cepillo',
    action: 'Avanza 3 casillas',
    color: '#10B981'
  }
];

// PREGUNTAS según el boceto
const QUESTION_CARDS = [
  {
    id: 1,
    question: '¿Te cepillaste los dientes hoy?',
    yesAdvance: 3,
    noGoBack: 2
  },
  {
    id: 2,
    question: '¿Usaste hilo dental?',
    yesAdvance: 2,
    noGoBack: 1
  },
  {
    id: 3,
    question: '¿Evitaste dulces hoy?',
    yesAdvance: 4,
    noGoBack: 2
  }
];

const total = BOARD_PATH.length;

export default function AutoCuidadoBoard(){
  const [pos,setPos]=useState(0); 
  const [rolling,setRolling]=useState(false); 
  const [dieVal,setDieVal]=useState<1|2|3|4|5|6>(1);
  const [log,setLog]=useState<string[]>([]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<typeof QUESTION_CARDS[0] | null>(null);
  const [showHabitCard, setShowHabitCard] = useState(false);
  const [currentHabitCard, setCurrentHabitCard] = useState<typeof HABIT_CARDS[0] | null>(null);
  const [playerMovingToCard, setPlayerMovingToCard] = useState(false);
  const [playerAtCardPosition, setPlayerAtCardPosition] = useState<{x: number, y: number} | null>(null);

  const resetBoard = () => { 
    setPos(0); 
    setRolling(false); 
    setDieVal(1); 
    setShowQuestion(false);
    setCurrentQuestion(null);
    setShowHabitCard(false);
    setCurrentHabitCard(null);
    setPlayerMovingToCard(false);
    setPlayerAtCardPosition(null);
    setLog((l: string[]) => ['🔄 Juego reiniciado', ...l]); 
  };

  const stepMove = async (steps: number) => { 
    for(let s = 0; s < steps; s++) { 
      await new Promise(r => setTimeout(r, 200)); 
      setPos((p: number) => Math.min(total - 1, p + 1)); 
    } 
    await new Promise(r => setTimeout(r, 100)); 
  };

  const movePlayerToCardPile = async (isHabit: boolean) => {
    setPlayerMovingToCard(true);
    
    // Coordenadas de las pilas de tarjetas (centro del tablero con 45 casillas)
    const habitPilePos = { x: 320, y: 280 }; // Centro izquierda 
    const questionPilePos = { x: 500, y: 280 }; // Centro derecha 
    const targetPos = isHabit ? habitPilePos : questionPilePos;
    
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
    if (square.special === 'habit') {
      setLog((l: string[]) => [`🦷 Casilla ${square.number} - ¡Yendo a buscar tarjeta de hábitos!`, ...l]);
      await movePlayerToCardPile(true);
      // Mostrar tarjeta de hábito aleatoria
      const randomHabit = HABIT_CARDS[Math.floor(Math.random() * HABIT_CARDS.length)];
      setCurrentHabitCard(randomHabit);
      setShowHabitCard(true);
      setLog((l: string[]) => [`📋 Tomaste una tarjeta de hábitos`, ...l]);
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

  const handleQuestionAnswer = (answer: 'yes' | 'no') => {
    if (!currentQuestion) return;
    
    const movement = answer === 'yes' ? currentQuestion.yesAdvance : -currentQuestion.noGoBack;
    const newPos = answer === 'yes' 
      ? Math.min(total - 1, pos + movement)
      : Math.max(0, pos + movement);
    
    setLog((l: string[]) => [
      `${answer === 'yes' ? '✅' : '❌'} ${currentQuestion.question}`,
      `${answer === 'yes' ? '⬆️' : '⬇️'} ${answer === 'yes' ? '+' : ''}${movement} casillas`,
      ...l
    ]);
    
    setPos(newPos);
    setShowQuestion(false);
    setCurrentQuestion(null);
  };

  const handleHabitCardClose = () => {
    if (!currentHabitCard) return;
    
    // Extraer el número de casillas a avanzar desde la acción
    const advanceMatch = currentHabitCard.action.match(/Avanza (\d+)/);
    const advancement = advanceMatch ? parseInt(advanceMatch[1]) : 2;
    
    const newPos = Math.min(total - 1, pos + advancement);
    
    setLog((l: string[]) => [
      `✅ ${currentHabitCard.title}`,
      `⬆️ +${advancement} casillas`,
      ...l
    ]);
    
    setPos(newPos);
    setShowHabitCard(false);
    setCurrentHabitCard(null);
  };

  const roll = async () => {
    if (rolling) return; 
    setRolling(true);
    const start = Date.now();
    
    const finish = async () => {
      const finalVal = (1 + Math.floor(Math.random() * 6)) as 1|2|3|4|5|6; 
      setDieVal(finalVal);
      const startPos = pos; // Guardar posición inicial
      const targetPos = Math.min(total - 1, startPos + finalVal);
      
      setLog((l: string[]) => [`🎲 Tiraste ${finalVal} → Avanzando a casilla ${targetPos}`, ...l]);
      
      // Mover al jugador paso a paso
      await stepMove(finalVal);
      
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

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-100 via-green-50 to-blue-100 p-4 overflow-hidden flex gap-4">
      {/* CONTROLES EXTERNOS - Izquierda */}
      <div className="w-64 space-y-4 flex-shrink-0">
        {/* Panel principal */}
        <div className="bg-white rounded-2xl p-4 shadow-xl border-3 border-green-300">
          <div className="flex items-center gap-2 mb-4">
            <button 
              onClick={roll} 
              disabled={rolling || pos >= total - 1 || showQuestion || showHabitCard} 
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

        {/* Registro */}
        <div className="bg-white rounded-2xl p-4 shadow-xl border-3 border-purple-300 flex-1 max-h-96 overflow-auto">
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
      <div className="relative flex-1 bg-white rounded-3xl shadow-2xl border-4 border-blue-300 overflow-hidden">
        
        {/* TÍTULO SUPERIOR */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-blue-800">
          ASEO BUCAL INFANTIL
        </div>

        {/* ÁREA CENTRAL - DIENTE GRANDE (AJUSTADA AL NUEVO ESPACIADO) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-white to-blue-50 rounded-full shadow-2xl border-8 border-blue-400 flex flex-col items-center justify-center">
          <div className="text-8xl mb-4">🦷</div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-800 mb-2">ASEO BUCAL</div>
            <div className="text-xl font-semibold text-blue-600">INFANTIL</div>
          </div>
        </div>

        {/* CASILLAS DEL TABLERO - Siguiendo el path rectangular */}
        <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full">
          {/* Líneas conectoras */}
          {BOARD_PATH.map((square, i) => {
            if (i === BOARD_PATH.length - 1) return null;
            const nextSquare = BOARD_PATH[i + 1];
            return (
              <line 
                key={i}
                x1={square.x} 
                y1={square.y} 
                x2={nextSquare.x} 
                y2={nextSquare.y} 
                stroke="#64748b" 
                strokeWidth={4}
                strokeLinecap="round"
                opacity={0.3}
              />
            );
          })}
          
          {/* Casillas */}
          {BOARD_PATH.map((square, i) => {
            const isCurrentPos = pos === i;
            const isSpecial = square.special !== null;
            
            return (
              <g key={i}>
                {/* Casilla de fondo - MÁS GRANDE */}
                <rect 
                  x={square.x - 40} 
                  y={square.y - 25} 
                  width={80} 
                  height={50}
                  rx={10}
                  fill={square.color}
                  stroke="#fff" 
                  strokeWidth={4}
                  filter={isCurrentPos ? 'drop-shadow(0 0 20px rgba(59, 130, 246, 1))' : 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))'}
                  className={isCurrentPos ? 'animate-pulse' : ''}
                />
                
                {/* Número o texto principal - MÁS GRANDE */}
                <text 
                  x={square.x} 
                  y={square.y + 8} 
                  textAnchor="middle" 
                  fontSize={square.special ? "14" : "18"} 
                  fontWeight="bold" 
                  fill="#1f2937"
                >
                  {square.number}
                </text>
                
                {/* Texto secundario */}
                {square.text && (
                  <text 
                    x={square.x} 
                    y={square.y - 8} 
                    textAnchor="middle" 
                    fontSize="8" 
                    fill="#4b5563"
                  >
                    {square.text}
                  </text>
                )}
                
                {/* Indicador de casilla especial */}
                {isSpecial && (
                  <circle 
                    cx={square.x + 20} 
                    cy={square.y - 15} 
                    r={6} 
                    fill={square.special === 'habit' ? '#22C55E' : square.special === 'challenge' ? '#EF4444' : '#3B82F6'}
                    stroke="#fff" 
                    strokeWidth={2}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* JUGADOR - POSICIONADO EXACTAMENTE SOBRE LAS CASILLAS */}
        <div 
          className={`absolute z-20 ${
            playerMovingToCard ? 'transition-all duration-1000 ease-in-out' : 'transition-all duration-700 ease-in-out'
          }`}
          style={{ 
            left: `${(playerPosition.x / 800) * 100}%`, 
            top: `${(playerPosition.y / 600) * 100}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className={`w-16 h-16 rounded-full border-4 border-white bg-gradient-to-br from-yellow-400 to-orange-500 shadow-xl flex items-center justify-center text-white text-2xl ${
            playerMovingToCard ? 'animate-bounce' : ''
          }`}>
            👶
          </div>
          {playerMovingToCard && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-800 bg-white px-2 py-1 rounded-full shadow-lg">
              🏃‍♂️ Tomando tarjeta...
            </div>
          )}
        </div>

        {/* PILA DE TARJETAS HÁBITOS - LADO IZQUIERDO DEL DIENTE */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12 z-30" style={{marginLeft: '-100px', marginTop: '0px'}}>
          {/* Pila de tarjetas apiladas */}
          <div className="relative">
            {/* Tarjeta de fondo */}
            <div className="absolute w-24 h-32 bg-blue-400 rounded-lg shadow-lg transform translate-x-1 translate-y-1"></div>
            <div className="absolute w-24 h-32 bg-blue-300 rounded-lg shadow-lg transform translate-x-0.5 translate-y-0.5"></div>
            {/* Tarjeta principal visible */}
            <div className="relative w-24 h-32 bg-blue-500 rounded-lg shadow-xl border-2 border-white flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform">
              <div className="text-sm font-bold text-center mb-1">HÁBITOS</div>
              <div className="text-3xl mb-1">📋</div>
              <div className="text-xs text-center px-1 leading-tight opacity-90">
                Cepillado
                Hilo dental
                Enjuague
              </div>
            </div>
          </div>
        </div>

        {/* PILA DE TARJETAS PREGUNTAS - LADO DERECHO DEL DIENTE */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-6 z-30" style={{marginLeft: '100px', marginTop: '0px'}}>
          {/* Pila de tarjetas apiladas */}
          <div className="relative">
            {/* Tarjeta de fondo */}
            <div className="absolute w-24 h-32 bg-yellow-400 rounded-lg shadow-lg transform translate-x-1 translate-y-1"></div>
            <div className="absolute w-24 h-32 bg-yellow-300 rounded-lg shadow-lg transform translate-x-0.5 translate-y-0.5"></div>
            {/* Tarjeta principal visible */}
            <div className="relative w-24 h-32 bg-yellow-500 rounded-lg shadow-xl border-2 border-white flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform">
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
                <p className="text-lg font-medium text-gray-800 mb-6 text-center">
                  {currentQuestion.question}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleQuestionAnswer('no')}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                  >
                    NO
                    <div className="text-xs opacity-80">-{currentQuestion.noGoBack} casillas</div>
                  </button>
                  <button
                    onClick={() => handleQuestionAnswer('yes')}
                    className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
                  >
                    SÍ
                    <div className="text-xs opacity-80">+{currentQuestion.yesAdvance} casillas</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE TARJETAS DE HÁBITOS */}
        {showHabitCard && currentHabitCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border-4 border-blue-400 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-center">
                <div className="text-5xl mb-2">{currentHabitCard.icon}</div>
                <h3 className="text-2xl font-bold">{currentHabitCard.title}</h3>
              </div>
              <div className="p-6">
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-lg text-gray-800 text-center leading-relaxed">
                    {currentHabitCard.description}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 mb-6 border-2 border-green-200">
                  <p className="text-center font-bold text-green-700">
                    🎉 {currentHabitCard.action}
                  </p>
                </div>
                <button
                  onClick={handleHabitCardClose}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
                >
                  ¡ENTENDIDO! 
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}