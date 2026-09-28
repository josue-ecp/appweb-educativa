import React, { useState } from 'react';
import { Target, CheckCircle2, Sparkles, ArrowRight, Brain, Zap, HelpCircle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sumarEstrellas } from '../services/api';

export default function MisionesView({ onAddStars }) {
  const [activeMission, setActiveMission] = useState(null);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [codeAnswer, setCodeAnswer] = useState('');
  const [codeSuccess, setCodeSuccess] = useState(false);
  
  const [memoryStep, setMemoryStep] = useState(0);
  const [triviaAnswered, setTriviaAnswered] = useState(false);
  const [triviaCorrect, setTriviaCorrect] = useState(false);

  const missions = [
    {
      id: 1,
      title: 'El Descifrador Secreto',
      type: 'codigo',
      desc: 'Descubre la palabra secreta ordenando las pistas de lógica del bosque.',
      reward: 20,
      badge: 'Lógica',
      icon: <Brain className="w-6 h-6 text-white" />,
      bg: 'from-amber-400 to-orange-500',
      shadow: 'shadow-orange-500/20'
    },
    {
      id: 2,
      type: 'memoria',
      title: 'Memoria Relámpago',
      desc: 'Memoriza la secuencia de colores de las flores y repítela sin equivocarte.',
      reward: 25,
      badge: 'Memoria',
      icon: <Zap className="w-6 h-6 text-white" />,
      bg: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20'
    },
    {
      id: 3,
      type: 'trivia',
      title: 'Trivia de la Naturaleza',
      desc: 'Responde una pregunta curiosa sobre animales y plantas del bosque.',
      reward: 30,
      badge: 'Curiosidad',
      icon: <HelpCircle className="w-6 h-6 text-white" />,
      bg: 'from-teal-400 to-cyan-600',
      shadow: 'shadow-cyan-500/20'
    }
  ];

  const handleComplete = async (id, reward) => {
    if (loading || completedMissions.includes(id)) return;
    
    setLoading(true);
    const resultado = await sumarEstrellas(reward);
    
    if (resultado.success) {
      setCompletedMissions(prev => [...prev, id]);
      if (onAddStars) {
        onAddStars(resultado.estrellas_totales); // Envía el total nuevo directo al Header
      }
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      setActiveMission(null); // Cierra el reto automáticamente
    } else {
      alert('Hubo un error al guardar las estrellas en el servidor.');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
      {/* Cabecera Temática del Bosque */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex items-center justify-between border-2 border-white/25">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm border border-white/20">
            <Trophy className="w-3.5 h-3.5 text-amber-300" /> Zona de Retos Especiales
          </div>
          <h2 className="text-2xl md:text-3xl font-black">Misiones del Bosque</h2>
          <p className="text-emerald-100 text-xs md:text-sm font-medium max-w-md">
            Supera estos minijuegos lógicos para ganar estrellas extra y potenciar tus habilidades de explorador.
          </p>
        </div>
        <div className="hidden md:flex w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-md items-center justify-center border border-white/20 shadow-inner">
          <Target className="w-10 h-10 text-emerald-200" />
        </div>
      </div>

      {activeMission ? (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-emerald-200 space-y-6 max-w-xl mx-auto w-full">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                {activeMission.icon}
              </span>
              <h3 className="font-black text-slate-800 text-lg">{activeMission.title}</h3>
            </div>
            <button 
              onClick={() => setActiveMission(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 px-3 py-1.5 rounded-2xl transition cursor-pointer"
            >
              Cerrar reto
            </button>
          </div>

          {/* RETO 1: Descifrador */}
          {activeMission.type === 'codigo' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Pista lógica del bosque:</p>
                <p className="text-sm font-bold text-amber-950 mt-1">
                  "Soy una fruta alargada y amarilla que los monos adoran."
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Escribe la respuesta:</label>
                <input 
                  type="text" 
                  value={codeAnswer}
                  onChange={(e) => setCodeAnswer(e.target.value)}
                  placeholder="Ej. plátano"
                  className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-600 font-bold text-sm outline-none transition"
                />
              </div>
              <button
                onClick={() => {
                  if (['platano', 'plátano', 'banana'].includes(codeAnswer.toLowerCase().trim())) {
                    setCodeSuccess(true);
                  } else {
                    alert('¡Inténtalo de nuevo! Pista: Empieza con P.');
                  }
                }}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg transition cursor-pointer"
              >
                Comprobar Código
              </button>

              {codeSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-center space-y-3">
                  <p className="font-black text-sm flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> ¡Código descifrado correctamente!
                  </p>
                  <button
                    disabled={loading}
                    onClick={() => handleComplete(activeMission.id, activeMission.reward)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Guardando...' : `Reclamar +${activeMission.reward} Estrellas`}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* RETO 2: Memoria */}
          {activeMission.type === 'memoria' && (
            <div className="space-y-4 text-center">
              <p className="text-sm font-bold text-slate-700">
                Secuencia de flores: <span className="text-emerald-700 font-black">Azul → Rojo → Amarillo → Verde</span>
              </p>
              <div className="flex justify-center gap-3 py-4">
                <button onClick={() => setMemoryStep(1)} className="w-14 h-14 bg-blue-500 rounded-2xl shadow-md hover:scale-105 transition cursor-pointer"></button>
                <button onClick={() => setMemoryStep(2)} className="w-14 h-14 bg-rose-500 rounded-2xl shadow-md hover:scale-105 transition cursor-pointer"></button>
                <button onClick={() => setMemoryStep(3)} className="w-14 h-14 bg-amber-400 rounded-2xl shadow-md hover:scale-105 transition cursor-pointer"></button>
                <button onClick={() => setMemoryStep(4)} className="w-14 h-14 bg-emerald-500 rounded-2xl shadow-md hover:scale-105 transition cursor-pointer"></button>
              </div>
              <p className="text-xs text-slate-400">Presiona los bloques en el orden correcto.</p>

              {memoryStep === 4 && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl space-y-3">
                  <p className="font-black text-sm">¡Memoria de nivel experto completada!</p>
                  <button
                    disabled={loading}
                    onClick={() => handleComplete(activeMission.id, activeMission.reward)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Guardando...' : `Reclamar +${activeMission.reward} Estrellas`}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* RETO 3: Trivia */}
          {activeMission.type === 'trivia' && (
            <div className="space-y-4">
              <p className="text-base font-black text-slate-800">¿Sabías que los flamencos adquieren su color rosado debido a qué consumen?</p>
              <div className="space-y-2">
                <button 
                  onClick={() => { setTriviaAnswered(true); setTriviaCorrect(false); }}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 text-left font-bold text-sm hover:border-slate-300 transition cursor-pointer"
                >
                  A) Helado de fresa y bayas silvestres
                </button>
                <button 
                  onClick={() => { setTriviaAnswered(true); setTriviaCorrect(true); }}
                  className="w-full p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50 text-left font-bold text-sm text-emerald-900 transition cursor-pointer"
                >
                  B) Camarones y algas ricas en pigmentos naturales
                </button>
              </div>

              {triviaAnswered && triviaCorrect && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-center space-y-3">
                  <p className="font-black text-sm">¡Correcto! Tienes una gran cultura del bosque.</p>
                  <button
                    disabled={loading}
                    onClick={() => handleComplete(activeMission.id, activeMission.reward)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Guardando...' : `Reclamar +${activeMission.reward} Estrellas`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" /> Retos Disponibles Hoy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {missions.map((m) => {
              const isDone = completedMissions.includes(m.id);
              return (
                <div
                  key={m.id}
                  className={`bg-white rounded-3xl p-5 md:p-6 shadow-md border-2 transition-all flex flex-col justify-between ${
                    isDone ? 'border-emerald-200 bg-emerald-50/30 opacity-75' : 'border-slate-100 hover:border-emerald-400'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.bg} flex items-center justify-center shadow-md ${m.shadow}`}>
                        {m.icon}
                      </div>
                      <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        <span className="text-amber-500 font-bold">★</span>
                        <span className="font-black text-xs text-amber-800">+{m.reward}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 uppercase tracking-wider border border-emerald-100">
                      {m.badge}
                    </span>
                    <h4 className="font-black text-slate-800 text-base mt-2 mb-1">
                      {m.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mb-6">
                      {m.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                    {isDone ? (
                      <span className="flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-100 px-3.5 py-2 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" /> Completado
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveMission(m);
                          setCodeSuccess(false);
                          setCodeAnswer('');
                          setMemoryStep(0);
                          setTriviaAnswered(false);
                          setTriviaCorrect(false);
                        }}
                        className="px-5 py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl shadow hover:bg-emerald-700 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        Iniciar Reto <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}