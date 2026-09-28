import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Calculator, Atom, Sparkles, Compass, Trophy, Star, PlayCircle, CheckCircle2, Loader2, Trees, Leaf } from 'lucide-react';
import { getMaterias } from '../services/api';

export default function AventuraView({ onStart }) {
  const [subjects, setSubjects] = useState([]);
  const [completadas, setCompletadas] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtenemos el usuario actual del localStorage para usar su ID único
    const usuarioActual = JSON.parse(localStorage.getItem('appweb_usuario') || '{}');
    const userId = usuarioActual.id || 'default';

    // Cargamos las materias completadas específicas de este usuario
    const savedCompletadas = JSON.parse(localStorage.getItem(`materias_completadas_${userId}`) || '{}');
    setCompletadas(savedCompletadas);

    async function cargarMaterias() {
      try {
        setLoading(true);
        const data = await getMaterias();
        if (data && data.length > 0) {
          const materiasConEstilos = data.map((materia) => {
            let icon = <BookOpen className="w-8 h-8 text-white" />;
            let bg = 'from-emerald-400 via-teal-500 to-cyan-600';
            let shadow = 'shadow-teal-500/30';
            let borderColor = 'border-emerald-200 hover:border-emerald-500';
            let tagColor = 'bg-emerald-100 text-emerald-800';

            // Estilos personalizados según el slug si existen
            if (materia.slug === 'matematicas') {
              icon = <Calculator className="w-8 h-8 text-white" />;
              bg = 'from-amber-400 via-orange-500 to-amber-600';
              shadow = 'shadow-orange-500/30';
              borderColor = 'border-amber-200 hover:border-amber-400';
              tagColor = 'bg-amber-100 text-amber-800';
            } else if (materia.slug === 'ciencia') {
              icon = <Atom className="w-8 h-8 text-white" />;
              bg = 'from-teal-400 via-emerald-500 to-green-600';
              shadow = 'shadow-emerald-500/30';
              borderColor = 'border-teal-200 hover:border-teal-400';
              tagColor = 'bg-teal-100 text-teal-800';
            } else if (materia.slug === 'espanol') {
              icon = <BookOpen className="w-8 h-8 text-white" />;
              bg = 'from-cyan-400 via-sky-500 to-indigo-600';
              shadow = 'shadow-sky-500/30';
              borderColor = 'border-sky-200 hover:border-sky-400';
              tagColor = 'bg-sky-100 text-sky-800';
            }

            // Usamos directamente la etiqueta superior guardada en la base de datos (con fallback por seguridad)
            const worldName = materia.etiqueta_superior || materia.etiqueta || 'MUNDO DE AVENTURA';

            return {
              id: materia.slug,
              title: materia.titulo,
              desc: materia.descripcion,
              badge: `${materia.total_misiones} Misiones`,
              icon,
              bg,
              shadow,
              borderColor,
              tagColor,
              worldName
            };
          });

          setSubjects(materiasConEstilos);
        }
      } catch (error) {
        console.error("Error al cargar materias:", error);
      } finally {
        setLoading(false);
      }
    }
    cargarMaterias();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] space-y-4 animate-fadeIn">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
        <p className="text-sm font-bold text-slate-600">Preparando los senderos del bosque...</p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 md:p-8 space-y-6 md:space-y-8 max-w-4xl mx-auto w-full animate-fadeIn transition-all duration-500 pb-12">
      
      {/* Banner Principal Estilo Bosque Encantado */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-7 md:p-8 text-white shadow-xl relative overflow-hidden border-2 border-white/30">
        <div className="absolute right-[-20px] bottom-[-20px] text-8xl opacity-10 pointer-events-none transform rotate-12">
          <Trees className="w-56 h-56 text-white" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="bg-amber-300 text-amber-950 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-sm inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-amber-950" /> Senda del Saber • Nivel 1
            </span>
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/30 text-[11px] sm:text-xs font-black shadow-sm">
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> ¡Racha Activa!
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm">¡Elige tu próxima misión!</h2>
            <p className="text-emerald-100 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
              Explora los mundos de la naturaleza, supera los retos del bosque y gana muchas estrellas. ¡Puedes reintentar cuando quieras!
            </p>
          </div>

          <div className="space-y-2 pt-2 max-w-md">
            <div className="flex justify-between text-xs font-black text-emerald-100">
              <span>Progreso del Bosque</span>
              <span className="text-amber-300">45% Completado</span>
            </div>
            <div className="w-full bg-black/30 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/20 shadow-inner">
              <div className="bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-400 h-full rounded-full w-[45%] shadow-md"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Sección de Mundos / Materias */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-1">
          <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Mundos de Aventura
          </h3>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-2xl shadow-xs flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5" /> Toca un mundo para entrar 🍃
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {subjects.map((sub, idx) => {
            const estaCompletado = completadas[sub.id];

            return (
              <div
                key={sub.id}
                onClick={() => onStart(sub.id)}
                style={{ animationDelay: `${idx * 100}ms` }}
                className={`group bg-white rounded-[1.75rem] sm:rounded-[2rem] p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 ${sub.borderColor} cursor-pointer flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1.5 active:scale-95 animate-fadeIn`}
              >
                {estaCompletado && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md z-20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ¡Completado!
                  </div>
                )}

                <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-50/50 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${sub.bg} flex items-center justify-center shadow-md ${sub.shadow} transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300`}>
                      {sub.icon}
                    </div>
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full ${sub.tagColor} shadow-xs border border-black/5`}>
                      {sub.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{sub.worldName}</span>
                    <h4 className="font-black text-slate-800 text-base sm:text-lg md:text-xl group-hover:text-emerald-700 transition-colors">
                      {sub.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {sub.desc}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                  <span className="text-xs font-black text-emerald-600 group-hover:underline flex items-center gap-1.5">
                    <PlayCircle className="w-4 h-4 text-emerald-500" /> {estaCompletado ? 'Reintentar Reto' : 'Jugar Ahora'}
                  </span>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white text-emerald-600 flex items-center justify-center transition-all shadow-xs transform group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}