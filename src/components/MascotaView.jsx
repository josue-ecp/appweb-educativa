import React, { useState } from 'react';
import { Sparkles, Edit3, Shirt, Heart, Zap, Award, Smile, Utensils, Shield, Star } from 'lucide-react';
import MascotaAvatar from './MascotaAvatar';
import { playSuccessSound, playWinSound, playErrorSound } from '../services/sound';
import confetti from 'canvas-confetti';

export default function MascotaView({ usuario, onUpdateUser }) {
  const [nombreMascota, setNombreMascota] = useState(usuario.mascota_nombre || 'Spirit');
  const [especie, setEspecie] = useState(usuario.mascota_especie || 'fox');
  const [accesorioEquipado, setAccesorioEquipado] = useState(usuario.mascota_accesorio || 'ninguno');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(nombreMascota);
  const [isJumping, setIsJumping] = useState(false);

  // Nuevos estados interactivos de cuidado de mascota
  const [felicidad, setFelicidad] = useState(usuario.mascota_felicidad || 85);
  const [energia, setEnergia] = useState(usuario.mascota_energia || 90);
  const [nivelMascota, setNivelMascota] = useState(usuario.mascota_nivel || 3);

  const especiesMap = {
    fox: {
      nombre: 'Zorro Místico',
      emoji: '🦊',
      desc: 'Ágil y astuto en los senderos del bosque.',
      bg: 'from-amber-500/20 to-orange-500/20',
      badge: 'bg-amber-500'
    },
    panda: {
      nombre: 'Panda Sabio',
      emoji: '🐼',
      desc: 'Amante del bambú y de los acertijos antiguos.',
      bg: 'from-slate-400/20 to-slate-600/20',
      badge: 'bg-slate-700'
    },
    unicorn: {
      nombre: 'Unicornio Estelar',
      emoji: '🦄',
      desc: 'Posee la magia pura de las estrellas fugaces.',
      bg: 'from-pink-500/20 to-purple-500/20',
      badge: 'bg-pink-500'
    },
    dragon: {
      nombre: 'Dragón de Jade',
      emoji: '🐲',
      desc: 'Fieramente leal y guardián de los tesoros.',
      bg: 'from-emerald-500/20 to-teal-600/20',
      badge: 'bg-emerald-600'
    }
  };

  const accesoriosMap = {
    ninguno: {
      nombre: 'Sin accesorios',
      icono: '🌿',
      desc: 'Al natural'
    },
    sombrero: {
      nombre: 'Sombrero de Aventurero',
      icono: '🎩',
      desc: '+10 Estilo'
    },
    capa: {
      nombre: 'Capa del Guardián',
      icono: '🦸‍♂️',
      desc: '+15 Valentía'
    },
    lentes: {
      nombre: 'Lentes de Sabio',
      icono: '🕶️',
      desc: '+10 Sabiduría'
    }
  };

  // Efecto interactivo al tocar a la mascota (Acariciar)
  const handleCaricia = () => {
    setIsJumping(true);
    playSuccessSound();
    setFelicidad((prev) => Math.min(100, prev + 5));
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 }
    });

    setTimeout(() => setIsJumping(false), 600);
  };

  // Alimentar mascota
  const handleAlimentar = () => {
    playSuccessSound();
    setEnergia((prev) => Math.min(100, prev + 15));
    setFelicidad((prev) => Math.min(100, prev + 10));

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleGuardarCambios = async (
    nuevaEspecie,
    nuevoAccesorio,
    nuevoNombre
  ) => {
    playSuccessSound();

    try {
      const usuarioActualizado = {
        ...usuario,
        mascota_nombre:
          nuevoNombre !== undefined ? nuevoNombre : nombreMascota,
        mascota_especie: nuevaEspecie || especie,
        mascota_accesorio:
          nuevoAccesorio !== undefined
            ? nuevoAccesorio
            : accesorioEquipado,
        mascota_felicidad: felicidad,
        mascota_energia: energia,
        mascota_nivel: nivelMascota
      };

      if (nuevoNombre !== undefined) {
        setNombreMascota(nuevoNombre);
        setIsEditingName(false);
      }

      if (nuevaEspecie) setEspecie(nuevaEspecie);
      if (nuevoAccesorio !== undefined) {
        setAccesorioEquipado(nuevoAccesorio);
      }

      localStorage.setItem(
        'appweb_usuario',
        JSON.stringify(usuarioActualizado)
      );

      if (onUpdateUser) onUpdateUser();

      playWinSound();

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (error) {
      playErrorSound();
      console.error('Error al actualizar mascota:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-0 pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-12 space-y-5 sm:space-y-6 animate-fadeIn font-sans overflow-x-hidden">

      {/* =========================================================
          HÁBITAT PRINCIPAL
      ========================================================= */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 text-white shadow-2xl relative overflow-hidden border-2 sm:border-4 border-emerald-500/30 flex flex-col items-center">

        {/* Elementos ambientales de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="absolute -right-16 -top-16 w-40 h-40 sm:w-56 sm:h-56 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="absolute -left-16 -bottom-16 w-40 h-40 sm:w-56 sm:h-56 bg-teal-400/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* =====================================================
            CABECERA DEL HÁBITAT
        ===================================================== */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 relative z-10">

          <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 w-full sm:w-fit">

            <span className="text-lg sm:text-xl">
              🐾
            </span>

            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300">
              Hábitat Encantado
            </span>

          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 bg-black/40 backdrop-blur-md px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl border border-emerald-500/40 shadow-inner w-full sm:w-fit">

            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />

            <div className="text-left">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-300">
                Nivel del Compañero
              </p>

              <p className="text-xs sm:text-sm font-black text-white">
                Nivel {nivelMascota} ⭐
              </p>
            </div>

          </div>

        </div>

        {/* =====================================================
            MASCOTA
        ===================================================== */}
        <div className="relative z-10 flex flex-col items-center my-3 sm:my-5 w-full">

          <div
            onClick={handleCaricia}
            title="¡Toca a tu mascota para jugar!"
            className="cursor-pointer select-none filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] transform transition-transform hover:scale-105 active:scale-95 touch-manipulation"
          >
            <MascotaAvatar
              especie={especie}
              accesorio={accesorioEquipado}
              isJumping={isJumping}
            />
          </div>

          {/* Mensaje para acariciar */}
          <span className="text-[9px] sm:text-[11px] bg-amber-400/90 text-amber-950 font-black px-3 sm:px-4 py-1.5 rounded-full shadow-lg mt-4 uppercase tracking-wide text-center">
            ✨ ¡Tócalo para acariciar! ✨
          </span>

          {/* =================================================
              NOMBRE DE LA MASCOTA
          ================================================= */}
          <div className="mt-4 flex items-center justify-center w-full">

            {isEditingName ? (

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-w-sm">

                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-black/60 border-2 border-amber-400 rounded-xl px-4 py-2 text-sm font-bold text-white w-full sm:w-40 focus:outline-none shadow-lg text-center"
                />

                <button
                  onClick={() =>
                    handleGuardarCambios(
                      undefined,
                      undefined,
                      tempName
                    )
                  }
                  className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-5 py-2 rounded-xl text-xs transition shadow cursor-pointer w-full sm:w-auto touch-manipulation"
                >
                  Guardar
                </button>

              </div>

            ) : (

              <div className="flex items-center justify-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shadow-lg max-w-full">

                <h3 className="text-lg sm:text-xl font-black tracking-wide text-amber-200 truncate max-w-[70vw] sm:max-w-xs">
                  {nombreMascota}
                </h3>

                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-white/80 hover:text-white p-1.5 bg-white/10 rounded-xl transition cursor-pointer hover:bg-white/20 shrink-0 touch-manipulation"
                  title="Cambiar Nombre"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

              </div>

            )}

          </div>

        </div>

        {/* =====================================================
            ESTADOS DE LA MASCOTA
        ===================================================== */}
        <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-5 relative z-10 bg-black/30 p-3.5 sm:p-4 rounded-2xl border border-emerald-500/20 backdrop-blur-md">

          {/* Felicidad */}
          <div className="space-y-1.5">

            <div className="flex justify-between gap-2 text-[11px] sm:text-xs font-bold text-emerald-200">

              <span className="flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-rose-400" />
                Felicidad
              </span>

              <span>
                {felicidad}%
              </span>

            </div>

            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">

              <div
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${felicidad}%` }}
              ></div>

            </div>

          </div>

          {/* Energía */}
          <div className="space-y-1.5">

            <div className="flex justify-between gap-2 text-[11px] sm:text-xs font-bold text-emerald-200">

              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Energía
              </span>

              <span>
                {energia}%
              </span>

            </div>

            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">

              <div
                className="bg-gradient-to-r from-amber-400 to-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${energia}%` }}
              ></div>

            </div>

          </div>

        </div>

        {/* =====================================================
            BOTÓN ALIMENTAR
        ===================================================== */}
        <div className="mt-5 relative z-10 w-full sm:w-auto">

          <button
            onClick={handleAlimentar}
            className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 text-[11px] sm:text-xs flex items-center gap-2 cursor-pointer border border-emerald-300/40 touch-manipulation"
          >

            <Utensils className="w-4 h-4 shrink-0" />

            <span>
              Dar Baya Mágica 🍇 (+ Energía & Felicidad)
            </span>

          </button>

        </div>

      </div>

      {/* =========================================================
          PANELES DE PERSONALIZACIÓN
      ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">

        {/* =====================================================
            SELECTOR DE ESPECIE
        ===================================================== */}
        <div className="bg-white rounded-[1.5rem] sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-xl border border-emerald-100 space-y-4 min-w-0">

          <h3 className="font-black text-slate-800 text-sm sm:text-base flex items-center gap-2">

            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse shrink-0" />

            <span>
              Seleccionar Especie
            </span>

          </h3>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">

            {Object.entries(especiesMap).map(([key, data]) => (

              <button
                key={key}
                onClick={() =>
                  handleGuardarCambios(
                    key,
                    undefined,
                    undefined
                  )
                }
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer transform hover:-translate-y-1 active:scale-[0.98] touch-manipulation min-w-0 ${
                  especie === key
                    ? 'border-emerald-500 bg-emerald-50/90 shadow-lg ring-4 ring-emerald-400/20 scale-[1.02]'
                    : 'border-slate-100 bg-slate-50 hover:bg-emerald-50/30'
                }`}
              >

                <div className="flex justify-between items-center gap-2">

                  <span className="text-2xl sm:text-3xl shrink-0">
                    {data.emoji}
                  </span>

                  {especie === key && (

                    <span className="text-[9px] sm:text-[10px] bg-emerald-500 text-white font-black px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs animate-pulse whitespace-nowrap">
                      Activo
                    </span>

                  )}

                </div>

                <div className="min-w-0">

                  <h4 className="font-black text-slate-800 text-xs sm:text-sm break-words">
                    {data.nombre}
                  </h4>

                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight break-words">
                    {data.desc}
                  </p>

                </div>

              </button>

            ))}

          </div>

        </div>

        {/* =====================================================
            SELECTOR DE ACCESORIOS
        ===================================================== */}
        <div className="bg-white rounded-[1.5rem] sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-xl border border-emerald-100 space-y-4 min-w-0">

          <h3 className="font-black text-slate-800 text-sm sm:text-base flex items-center gap-2">

            <Shirt className="w-5 h-5 text-indigo-500 shrink-0" />

            <span>
              Vestimenta y Accesorios
            </span>

          </h3>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">

            {Object.entries(accesoriosMap).map(([key, data]) => (

              <button
                key={key}
                onClick={() =>
                  handleGuardarCambios(
                    undefined,
                    key,
                    undefined
                  )
                }
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer transform hover:-translate-y-1 active:scale-[0.98] touch-manipulation min-w-0 ${
                  accesorioEquipado === key
                    ? 'border-indigo-500 bg-indigo-50/90 shadow-lg ring-4 ring-indigo-400/20 scale-[1.02]'
                    : 'border-slate-100 bg-slate-50 hover:bg-indigo-50/30'
                }`}
              >

                <div className="flex justify-between items-center gap-2">

                  <span className="text-2xl sm:text-3xl shrink-0">
                    {data.icono}
                  </span>

                  {accesorioEquipado === key && (

                    <span className="text-[9px] sm:text-[10px] bg-indigo-500 text-white font-black px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs animate-pulse whitespace-nowrap">
                      Equipado
                    </span>

                  )}

                </div>

                <div className="min-w-0">

                  <h4 className="font-black text-slate-800 text-xs sm:text-sm break-words">
                    {data.nombre}
                  </h4>

                  <p className="text-[10px] sm:text-[11px] text-indigo-600 font-bold mt-0.5 break-words">
                    {data.desc}
                  </p>

                </div>

              </button>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}