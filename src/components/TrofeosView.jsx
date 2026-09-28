import React, { useEffect, useState } from 'react';
import { Trophy, Award, Star, Lock, CheckCircle2, Sparkles, Loader2, Leaf, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getTrofeosAPI, desbloquearTrofeoAPI } from '../services/api';
import { playWinSound } from '../services/sound';

export default function TrofeosView({ stars, onStarUnlocked }) {
  const [trofeosDesbloqueados, setTrofeosDesbloqueados] = useState([]);
  const [loading, setLoading] = useState(true);

  const achievements = [
    {
      slug: 'primeros_pasos',
      title: 'Primeros Pasos en el Bosque',
      desc: 'Completa tu primera lección o gana tus primeras estrellas.',
      reward: 10,
      icon: <Star className="w-6 h-6 text-amber-500 fill-amber-400" />,
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
    },
    {
      slug: 'mente_brillante',
      title: 'Mente de Roble (Matemáticas)',
      desc: 'Responde correctamente las preguntas del mundo de Matemáticas.',
      reward: 25,
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
    },
    {
      slug: 'explorador_estelar',
      title: 'Guardián del Senda',
      desc: 'Acumula más de 100 estrellas en tu perfil de explorador.',
      reward: 50,
      icon: <Trophy className="w-6 h-6 text-amber-600 fill-amber-500" />,
      bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300'
    },
    {
      slug: 'cientifico_supremo',
      title: 'Sabio de la Naturaleza',
      desc: 'Completa todas las misiones del mundo de Ciencia.',
      reward: 40,
      icon: <Lock className="w-6 h-6 text-slate-400" />,
      bg: 'bg-slate-50 border-slate-200 opacity-80'
    },
    {
      slug: 'maestro_palabras',
      title: 'Cantor del Bosque',
      desc: 'Completa todas las lecciones del mundo de Español.',
      reward: 40,
      icon: <Lock className="w-6 h-6 text-slate-400" />,
      bg: 'bg-slate-50 border-slate-200 opacity-80'
    }
  ];

  useEffect(() => {
    async function cargarYVerificarTrofeos() {
      try {
        setLoading(true);
        const slugs = await getTrofeosAPI();
        setTrofeosDesbloqueados(slugs);

        // Respaldo aislado en localStorage por ID de usuario
        const usuarioActual = JSON.parse(localStorage.getItem('appweb_usuario') || '{}');
        const userId = usuarioActual.id || 'default';
        if (slugs && Array.isArray(slugs)) {
          localStorage.setItem(`trofeos_inventario_${userId}`, JSON.stringify(slugs));
        }

        let nuevoDesbloqueo = false;

        if (stars >= 1 && !slugs.includes('primeros_pasos')) {
          await desbloquearTrofeoAPI('primeros_pasos', 10);
          nuevoDesbloqueo = true;
        }
        if (stars >= 100 && !slugs.includes('explorador_estelar')) {
          await desbloquearTrofeoAPI('explorador_estelar', 50);
          nuevoDesbloqueo = true;
        }
        
        if (nuevoDesbloqueo) {
          const slugsActualizados = await getTrofeosAPI();
          setTrofeosDesbloqueados(slugsActualizados);
          if (onStarUnlocked) onStarUnlocked();
          playWinSound();
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
        }
      } catch (error) {
        console.error("Error al verificar trofeos:", error);
      } finally {
        setLoading(false);
      }
    }
    cargarYVerificarTrofeos();
  }, [stars]);

  const logrosConEstado = achievements.map((item) => ({
    ...item,
    unlocked: trofeosDesbloqueados.includes(item.slug)
  }));

  const unlockedCount = logrosConEstado.filter(a => a.unlocked).length;
  const progresoPorcentaje = Math.round((unlockedCount / achievements.length) * 100);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] space-y-4 animate-fadeIn">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
        <p className="text-sm font-bold text-slate-600">Buscando tus medallas en el gran árbol...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full animate-fadeIn transition-all duration-500 pb-12">
      
      {/* Cabecera Temática Estilo Bosque Encantado */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-white/25">
        <div className="absolute right-[-10px] bottom-[-10px] text-8xl opacity-10 pointer-events-none">
          <Trophy className="w-48 h-48 text-white" />
        </div>

        <div className="relative z-10 space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm border border-white/20">
            <Leaf className="w-3.5 h-3.5 text-amber-300" /> Sala de Logros Naturales
          </div>
          <h2 className="text-2xl md:text-3xl font-black">Tus Trofeos y Medallas</h2>
          <p className="text-emerald-100 text-xs md:text-sm font-medium max-w-md">
            ¡Colecciona medallas mágicas explorando el bosque y demuestra que eres un maestro del conocimiento!
          </p>
        </div>

        {/* Insignia de Progreso Mejorada */}
        <div className="relative z-10 flex flex-col items-center justify-center bg-white/15 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/25 shadow-inner shrink-0">
          <span className="text-3xl font-black text-amber-300">{unlockedCount} / {achievements.length}</span>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">Desbloqueados ({progresoPorcentaje}%)</span>
        </div>
      </div>

      {/* Grid de Logros Mejorado */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" /> Vitrina de Medallas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {logrosConEstado.map((item, idx) => (
            <div
              key={item.slug}
              style={{ animationDelay: `${idx * 100}ms` }}
              className={`rounded-3xl p-5 md:p-6 border-2 transition-all duration-300 flex items-start gap-4 shadow-sm transform hover:-translate-y-1 animate-fadeIn relative overflow-hidden ${
                item.unlocked ? item.bg + ' shadow-md border-emerald-300' : 'bg-slate-50 border-slate-200/80 opacity-75'
              }`}
            >
              {item.unlocked && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-bl-full pointer-events-none"></div>
              )}

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-300 hover:rotate-6 ${
                item.unlocked ? 'bg-white shadow-md border border-emerald-100' : 'bg-slate-200 text-slate-400'
              }`}>
                {item.unlocked ? item.icon : <Lock className="w-6 h-6 text-slate-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-black text-slate-800 text-base truncate">{item.title}</h4>
                  {item.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500 text-white px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                      <CheckCircle2 className="w-3 h-3" /> ¡Conseguido!
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" /> Bloqueado
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 font-medium mb-3 leading-relaxed">
                  {item.desc}
                </p>

                <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 bg-amber-50/80 px-3 py-1 rounded-xl w-fit border border-amber-200/60 shadow-xs">
                  <span>★</span> <span>Recompensa: +{item.reward} Estrellas</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}