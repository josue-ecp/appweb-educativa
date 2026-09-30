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
    <div className="w-full max-w-6xl mx-auto px-3 py-4 sm:px-5 sm:py-6 lg:px-8 space-y-5 sm:space-y-6 pb-10">

      {/* =====================================================
          ENCABEZADO
      ====================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 p-5 sm:p-7 lg:p-8 text-white shadow-lg">

        {/* Decoración */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Información */}
          <div className="min-w-0">

            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-50 backdrop-blur-sm sm:text-xs">
              <Package className="h-3.5 w-3.5" />
              Centro de Premios
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Tu Mochila Mágica
            </h2>

            <p className="mt-2 max-w-xl text-xs leading-relaxed text-emerald-50/80 sm:text-sm">
              Abre cofres sorpresa con tus estrellas y colecciona
              accesorios especiales para tu explorador.
            </p>

          </div>


          {/* Navegación */}
          <div className="w-full lg:w-auto">

            <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-black/15 p-1.5 backdrop-blur-md">

              <button
                onClick={() => setActiveTab('cofre')}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all sm:px-5 sm:text-sm ${
                  activeTab === 'cofre'
                    ? 'bg-white text-emerald-900 shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Gift className="h-4 w-4 shrink-0" />
                <span>Cofre</span>
              </button>

              <button
                onClick={() => setActiveTab('casillero')}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all sm:px-5 sm:text-sm ${
                  activeTab === 'casillero'
                    ? 'bg-white text-emerald-900 shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Casillero</span>

                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${
                  activeTab === 'casillero'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-white/15 text-white'
                }`}>
                  {unlockedCount}/{accesorios.length}
                </span>
              </button>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          COFRE MÁGICO
      ====================================================== */}
      {activeTab === 'cofre' && (
        <section className="animate-fadeIn">

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">

            {/* Barra superior */}
            <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Cofre mágico
                  </p>

                  <p className="text-sm font-bold text-slate-800">
                    Caja Sorpresa del Bosque
                  </p>
                </div>
              </div>


              {/* Estrellas */}
              <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 sm:w-auto sm:justify-start">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 shadow-sm">
                    <Star className="h-4 w-4 fill-white text-white" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700">
                      Disponibles
                    </p>

                    <p className="text-sm font-extrabold text-amber-900">
                      {stars} Estrellas
                    </p>
                  </div>

                </div>

              </div>

            </div>


            {/* Contenido */}
            <div className="flex flex-col items-center px-4 py-8 text-center sm:px-8 sm:py-10">

              <div className="max-w-lg">

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 sm:text-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                  Caja sorpresa
                </span>

                <h3 className="mt-3 text-xl font-extrabold tracking-tight text-slate-800 sm:text-2xl">
                  ¿Te atreves a abrir el Cofre Mágico?
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                  Cada intento cuesta{' '}
                  <span className="font-extrabold text-amber-600">
                    30 Estrellas
                  </span>
                  . Descubre accesorios especiales para tu explorador.
                </p>

              </div>


              {/* Cofre */}
              <button
                type="button"
                onClick={abrirCofre}
                disabled={loading || stars < 30 || premioObtenido !== null}
                aria-label="Abrir cofre mágico"
                className={`my-7 flex h-32 w-32 items-center justify-center rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-7xl shadow-sm transition-all duration-300 sm:h-36 sm:w-36 sm:text-8xl ${
                  isOpening
                    ? 'scale-105 animate-pulse shadow-lg'
                    : 'hover:-translate-y-1 hover:shadow-lg active:scale-95'
                } ${
                  loading || stars < 30 || premioObtenido !== null
                    ? 'cursor-not-allowed opacity-70'
                    : 'cursor-pointer'
                }`}
              >
                🎁
              </button>


              {/* Botón */}
              <button
                onClick={abrirCofre}
                disabled={loading || stars < 30 || premioObtenido !== null}
                className="flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-md shadow-emerald-600/15 transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
              >

                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Abriendo cofre...
                  </>
                ) : stars < 30 ? (
                  <>
                    ⭐ Necesitas 30 Estrellas
                  </>
                ) : premioObtenido !== null ? (
                  <>
                    🎁 Reclama tu premio abajo
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Abrir Cofre
                    <span className="text-emerald-100">
                      • 30 ⭐
                    </span>
                  </>
                )}

              </button>


              {/* Premio */}
              {premioObtenido && !isOpening && (
                <div
                  onClick={guardarPremioEnCasillero}
                  className={`mt-5 flex w-full max-w-md cursor-pointer items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:gap-4 sm:p-4 ${
                    animandoGuardado
                      ? 'translate-y-4 scale-95 opacity-0'
                      : 'animate-fadeIn'
                  }`}
                >

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-white text-3xl shadow-sm sm:h-16 sm:w-16 sm:text-4xl">
                    {premioObtenido.icon}
                  </div>

                  <div className="min-w-0 flex-1">

                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-900">
                      <CheckCircle2 className="h-3 w-3" />
                      Toca para guardar
                    </span>

                    <h4 className="mt-1 truncate text-sm font-extrabold text-slate-900 sm:text-base">
                      {premioObtenido.name}
                    </h4>

                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 sm:text-xs">
                      {premioObtenido.desc}
                    </p>

                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm">
                    <ChevronRight className="h-4 w-4" />
                  </div>

                </div>
              )}

            </div>

          </div>

        </section>
      )}


      {/* =====================================================
          CASILLERO
      ====================================================== */}
      {activeTab === 'casillero' && (
        <section className="animate-fadeIn space-y-4">

          {/* Encabezado */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                <Sparkles className="h-4 w-4 text-emerald-600" />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-800 sm:text-base">
                  Tus accesorios
                </h3>

                <p className="text-[11px] text-slate-400">
                  Colección del explorador
                </p>
              </div>
            </div>

            <span className="self-start rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 sm:self-auto">
              {unlockedCount} de {accesorios.length} desbloqueados
            </span>

          </div>


          {/* Tarjetas */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {accesorios.map((item, idx) => (

              <div
                key={item.id}
                style={{ animationDelay: `${idx * 80}ms` }}
                className={`flex min-w-0 items-center gap-3 rounded-2xl border p-4 transition-all duration-300 ${
                  item.unlocked
                    ? 'border-emerald-100 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md'
                    : 'border-slate-200 bg-slate-50 opacity-70'
                }`}
              >

                {/* Icono */}
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl ${
                    item.unlocked
                      ? 'border border-emerald-100 bg-emerald-50'
                      : 'bg-slate-200'
                  }`}
                >
                  {item.unlocked ? (
                    item.icon
                  ) : (
                    <Lock className="h-5 w-5 text-slate-400" />
                  )}
                </div>


                {/* Información */}
                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-2">

                    <h4 className="min-w-0 truncate text-sm font-extrabold text-slate-800">
                      {item.name}
                    </h4>

                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide ${
                        item.unlocked
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {item.unlocked ? 'Obtenido' : 'Bloqueado'}
                    </span>

                  </div>

                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                    {item.desc}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </section>
      )}

    </div>
  );
}