import React, { useState, useEffect } from 'react';
import { Package, Sparkles, Star, Gift, ShieldCheck, Lock, Loader2, CheckCircle2, ChevronRight, Trees, Leaf } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sumarEstrellas, getMochilaAPI, desbloquearAccesorioAPI } from '../services/api';
import { playSuccessSound, playWinSound, playErrorSound } from '../services/sound';

export default function MochilaView({ stars, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('cofre'); // 'cofre' o 'casillero'
  const [loading, setLoading] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [premioObtenido, setPremioObtenido] = useState(null);
  const [animandoGuardado, setAnimandoGuardado] = useState(false);

  // Lista de accesorios disponibles en el Cofre Mágico
  const [accesorios, setAccesorios] = useState([
    { id: 'sombrero_explorador', name: 'Sombrero de Explorador', icon: '🤠', desc: '¡Ideal para buscar tesoros en el bosque!', unlocked: false, cost: 30 },
    { id: 'lentes_cientifico', name: 'Lentes de Científico', icon: '👓', desc: 'Para ver más allá de los árboles', unlocked: false, cost: 30 },
    { id: 'capa_super', name: 'Capa de Hojas Mágicas', icon: '🍃', desc: 'Te hace volar por los senderos', unlocked: false, cost: 30 },
    { id: 'medalla_oro', name: 'Medalla de Oro del Bosque', icon: '🥇', desc: 'Brilla con la luz del sol', unlocked: false, cost: 30 },
    { id: 'mascota_robot', name: 'Robot del Saber', icon: '🤖', desc: 'Te acompaña en tus misiones naturales', unlocked: false, cost: 30 }
  ]);

  // Cargar inventario directamente desde la Base de Datos al iniciar
  useEffect(() => {
    async function cargarInventarioBD() {
      try {
        const slugsDesbloqueados = await getMochilaAPI();
        if (slugsDesbloqueados && Array.isArray(slugsDesbloqueados)) {
          setAccesorios(prev => prev.map(item => ({
            ...item,
            unlocked: slugsDesbloqueados.includes(item.id)
          })));

          // Guardamos respaldo en localStorage aislado por ID de usuario
          const usuarioActual = JSON.parse(localStorage.getItem('appweb_usuario') || '{}');
          const userId = usuarioActual.id || 'default';
          localStorage.setItem(`mochila_inventario_${userId}`, JSON.stringify(slugsDesbloqueados));
        }
      } catch (error) {
        console.error("Error cargando inventario de BD:", error);
      }
    }
    cargarInventarioBD();
  }, []);

  // Función para abrir el Cofre Mágico (Mecánica Gacha)
  const abrirCofre = async () => {
    const COSTO_COFRE = 30;

    if (stars < COSTO_COFRE) {
      playErrorSound();
      alert('¡Te faltan estrellas para abrir el cofre mágico! Sigue ganando en tus misiones 🌟');
      return;
    }

    if (isOpening || loading || premioObtenido !== null) return;

    try {
      setIsOpening(true);
      setLoading(true);
      playSuccessSound();

      await sumarEstrellas(-COSTO_COFRE);
      if (onUpdateUser) onUpdateUser();

      setTimeout(async () => {
        const noDesbloqueados = accesorios.filter(a => !a.unlocked);

        let premio;
        if (noDesbloqueados.length > 0) {
          const randomIndex = Math.floor(Math.random() * noDesbloqueados.length);
          premio = noDesbloqueados[randomIndex];
        } else {
          premio = accesorios[Math.floor(Math.random() * accesorios.length)];
        }

        await desbloquearAccesorioAPI(premio.id);

        const nuevoInventario = accesorios.map(a => 
          a.id === premio.id ? { ...a, unlocked: true } : a
        );
        setAccesorios(nuevoInventario);

        setPremioObtenido(premio);
        setIsOpening(false);
        setLoading(false);
        playWinSound();

        confetti({
          particleCount: 180,
          spread: 100,
          origin: { y: 0.5 }
        });
      }, 1500);

    } catch (error) {
      console.error("Error al abrir el cofre:", error);
      setIsOpening(false);
      setLoading(false);
    }
  };

  const guardarPremioEnCasillero = () => {
    setAnimandoGuardado(true);
    playSuccessSound();

    setTimeout(() => {
      setPremioObtenido(null);
      setAnimandoGuardado(false);
    }, 800);
  };

  const unlockedCount = accesorios.filter(a => a.unlocked).length;

  return (
    <div className="p-3 sm:p-6 md:p-8 space-y-5 md:space-y-6 max-w-4xl mx-auto w-full animate-fadeIn transition-all duration-500 pb-12">
      
      {/* Cabecera Principal Estilizada Bosque Mágico */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-7 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 border-2 border-white/25">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3.5 py-1 rounded-full text-[11px] md:text-xs font-black tracking-wider uppercase backdrop-blur-md border border-white/25 shadow-sm">
            <Package className="w-3.5 h-3.5 text-emerald-200" /> Centro de Premios
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Tu Mochila Mágica</h2>
          <p className="text-emerald-100 text-xs sm:text-sm font-medium max-w-md leading-relaxed">
            ¡Abre cofres sorpresa ocultos en el bosque con tus estrellas y colecciona todos los accesorios secretos!
          </p>
        </div>

        {/* Pestañas de Navegación Móvil / PC */}
        <div className="flex bg-black/20 backdrop-blur-xl p-1.5 rounded-2xl border border-white/20 shadow-inner gap-1 relative z-10 w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab('cofre')}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'cofre' 
                ? 'bg-white text-emerald-900 shadow-md scale-[1.02]' 
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4 text-emerald-600" /> Cofre Mágico
          </button>
          <button
            onClick={() => setActiveTab('casillero')}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'casillero' 
                ? 'bg-white text-emerald-900 shadow-md scale-[1.02]' 
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Casillero <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-black">{unlockedCount}/{accesorios.length}</span>
          </button>
        </div>
      </div>

      {/* CONTENIDO DE LA PESTAÑA 1: COFRE MÁGICO */}
      {activeTab === 'cofre' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border-3 border-emerald-100 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
            
            {/* Badge Flotante de Estrellas */}
            <div className="absolute top-4 right-4 sm:right-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/80 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
              <div className="w-7 h-7 rounded-xl bg-amber-400 flex items-center justify-center shadow-inner">
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-wider text-amber-800">Disponibles</p>
                <p className="text-xs sm:text-sm font-black text-amber-900">{stars} Estrellas</p>
              </div>
            </div>

            <div className="space-y-2 max-w-md mt-10 sm:mt-2">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Caja Sorpresa del Bosque
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800">¿Te atreves a abrir el Cofre Mágico?</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium px-2">
                Cada intento cuesta <span className="font-black text-amber-600">30 Estrellas</span>. ¡Colecciona equipo legendario para tu explorador!
              </p>
            </div>

            {/* Animación del Cofre */}
            <div 
              className={`my-6 sm:my-8 text-7xl sm:text-8xl md:text-9xl transition-transform duration-300 select-none filter drop-shadow-lg ${
                isOpening ? 'animate-bounce scale-110 rotate-6' : 'hover:scale-110 cursor-pointer active:scale-95'
              }`} 
              onClick={abrirCofre}
              title="¡Toca para abrir!"
            >
              🎁
            </div>

            {/* Botón de Acción Principal */}
            <button
              onClick={abrirCofre}
              disabled={loading || stars < 30 || premioObtenido !== null}
              className="w-full max-w-md py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-95 text-sm sm:text-base flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Abriendo cofre mágico...
                </>
              ) : stars < 30 ? (
                <>⭐ ¡Necesitas 30 Estrellas para abrirlo!</>
              ) : premioObtenido !== null ? (
                <>🎁 ¡Reclama tu premio en la tarjeta de abajo!</>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-white" /> Abrir Cofre Mágico (-30 Estrellas) ✨
                </>
              )}
            </button>

            {/* Tarjeta Interactiva de Premio Obtenido */}
            {premioObtenido && !isOpening && (
              <div 
                onClick={guardarPremioEnCasillero}
                className={`mt-6 bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 border-3 border-amber-300 p-4 sm:p-5 rounded-3xl shadow-xl w-full max-w-md flex items-center gap-4 text-left cursor-pointer transform transition-all duration-500 hover:scale-[1.02] active:scale-95 ${
                  animandoGuardado ? 'scale-0 opacity-0 translate-y-10' : 'animate-bounce'
                }`}
              >
                <div className="text-4xl sm:text-5xl bg-white p-3 rounded-2xl shadow-md border border-amber-200 flex-shrink-0 flex items-center justify-center">
                  {premioObtenido.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-300/70 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3" /> ¡Toca para guardar en tu Casillero!
                  </span>
                  <h4 className="font-black text-slate-900 text-base truncate mt-1">{premioObtenido.name}</h4>
                  <p className="text-xs text-slate-700 font-medium">{premioObtenido.desc}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black flex-shrink-0 shadow-md">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* CONTENIDO DE LA PESTAÑA 2: MI CASILLERO */}
      {activeTab === 'casillero' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" /> Tus Accesorios Coleccionados
            </h3>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-2xl shadow-xs">
              {unlockedCount} de {accesorios.length} Desbloqueados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {accesorios.map((item, idx) => (
              <div
                key={item.id}
                style={{ animationDelay: `${idx * 80}ms` }}
                className={`rounded-[1.75rem] p-4 sm:p-5 border-2 transition-all duration-300 flex items-center gap-4 shadow-sm animate-fadeIn ${
                  item.unlocked 
                    ? 'bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 border-emerald-200/80 shadow-md hover:shadow-lg transform hover:-translate-y-1' 
                    : 'bg-slate-100/70 border-slate-200 opacity-70'
                }`}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl shadow-xs transition-transform duration-300 hover:rotate-6 ${
                  item.unlocked ? 'bg-white shadow-md border-2 border-emerald-100' : 'bg-slate-200 text-slate-400'
                }`}>
                  {item.unlocked ? item.icon : <Lock className="w-6 h-6 text-slate-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-black text-slate-800 text-sm sm:text-base truncate">{item.name}</h4>
                    {item.unlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full shadow-xs">
                        <ShieldCheck className="w-3 h-3" /> Casillero
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> Bloqueado
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}