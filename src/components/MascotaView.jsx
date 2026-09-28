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
    fox: { nombre: 'Zorro Místico', emoji: '🦊', desc: 'Ágil y astuto en los senderos del bosque.', bg: 'from-amber-500/20 to-orange-500/20', badge: 'bg-amber-500' },
    panda: { nombre: 'Panda Sabio', emoji: '🐼', desc: 'Amante del bambú y de los acertijos antiguos.', bg: 'from-slate-400/20 to-slate-600/20', badge: 'bg-slate-700' },
    unicorn: { nombre: 'Unicornio Estelar', emoji: '🦄', desc: 'Posee la magia pura de las estrellas fugaces.', bg: 'from-pink-500/20 to-purple-500/20', badge: 'bg-pink-500' },
    dragon: { nombre: 'Dragón de Jade', emoji: '🐲', desc: 'Fieramente leal y guardián de los tesoros.', bg: 'from-emerald-500/20 to-teal-600/20', badge: 'bg-emerald-600' }
  };

  const accesoriosMap = {
    ninguno: { nombre: 'Sin accesorios', icono: '🌿', desc: 'Al natural' },
    sombrero: { nombre: 'Sombrero de Aventurero', icono: '🎩', desc: '+10 Estilo' },
    capa: { nombre: 'Capa del Guardián', icono: '🦸‍♂️', desc: '+15 Valentía' },
    lentes: { nombre: 'Lentes de Sabio', icono: '🕶️', desc: '+10 Sabiduría' }
  };

  // Efecto interactivo al tocar a la mascota (Acariciar)
  const handleCaricia = () => {
    setIsJumping(true);
    playSuccessSound();
    setFelicidad((prev) => Math.min(100, prev + 5));
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    setTimeout(() => setIsJumping(false), 600);
  };

  // Alimentar mascota
  const handleAlimentar = () => {
    playSuccessSound();
    setEnergia((prev) => Math.min(100, prev + 15));
    setFelicidad((prev) => Math.min(100, prev + 10));
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  };

  const handleGuardarCambios = async (nuevaEspecie, nuevoAccesorio, nuevoNombre) => {
    playSuccessSound();
    try {
      const usuarioActualizado = {
        ...usuario,
        mascota_nombre: nuevoNombre !== undefined ? nuevoNombre : nombreMascota,
        mascota_especie: nuevaEspecie || especie,
        mascota_accesorio: nuevoAccesorio !== undefined ? nuevoAccesorio : accesorioEquipado,
        mascota_felicidad: felicidad,
        mascota_energia: energia,
        mascota_nivel: nivelMascota
      };

      if (nuevoNombre !== undefined) {
        setNombreMascota(nuevoNombre);
        setIsEditingName(false);
      }
      if (nuevaEspecie) setEspecie(nuevaEspecie);
      if (nuevoAccesorio !== undefined) setAccesorioEquipado(nuevoAccesorio);

      localStorage.setItem('appweb_usuario', JSON.stringify(usuarioActualizado));
      if (onUpdateUser) onUpdateUser();

      playWinSound();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (error) {
      playErrorSound();
      console.error("Error al actualizar mascota:", error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fadeIn font-sans">
      
      {/* Escenario Principal / Hábitat Mágico del Bosque */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden border-4 border-emerald-500/30 flex flex-col items-center">
        
        {/* Elementos ambientales de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-teal-400/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Cabecera del Refugio */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 relative z-10">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
            <span className="text-xl">🐾</span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">Hábitat Encantado</span>
          </div>

          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-2 rounded-2xl border border-emerald-500/40 shadow-inner">
            <Award className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-emerald-300">Nivel del Compañero</p>
              <p className="text-sm font-black text-white">Nivel {nivelMascota} ⭐</p>
            </div>
          </div>
        </div>

        {/* Avatar Central en Escenario 3D Estilizado */}
        <div className="relative z-10 flex flex-col items-center my-4">
          <div 
            onClick={handleCaricia}
            title="¡Toca a tu mascota para jugar!"
            className="cursor-pointer select-none filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] transform transition-transform hover:scale-105 active:scale-95"
          >
            <MascotaAvatar especie={especie} accesorio={accesorioEquipado} isJumping={isJumping} />
          </div>
          
          <span className="text-[11px] bg-amber-400/90 text-amber-950 font-black px-4 py-1 rounded-full shadow-lg mt-3 uppercase tracking-wider animate-bounce">
            ✨ ¡Tócalo para acariciar! ✨
          </span>

          {/* Nombre editable con estilo */}
          <div className="mt-3 flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-black/60 border-2 border-amber-400 rounded-xl px-4 py-1.5 text-sm font-bold text-white w-40 focus:outline-none shadow-lg text-center"
                />
                <button 
                  onClick={() => handleGuardarCambios(undefined, undefined, tempName)}
                  className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-4 py-1.5 rounded-xl text-xs transition shadow cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg">
                <h3 className="text-xl font-black tracking-wide text-amber-200">{nombreMascota}</h3>
                <button 
                  onClick={() => setIsEditingName(true)}
                  className="text-white/80 hover:text-white p-1 bg-white/10 rounded-xl transition cursor-pointer hover:bg-white/20"
                  title="Cambiar Nombre"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Barras de Estado (Felicidad y Energía) */}
        <div className="w-full max-w-md grid grid-cols-2 gap-4 mt-4 relative z-10 bg-black/30 p-4 rounded-2xl border border-emerald-500/20 backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-emerald-200">
              <span className="flex items-center gap-1"><Smile className="w-3.5 h-3.5 text-rose-400" /> Felicidad</span>
              <span>{felicidad}%</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-500" style={{ width: `${felicidad}%` }}></div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-emerald-200">
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> Energía</span>
              <span>{energia}%</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div className="bg-gradient-to-r from-amber-400 to-yellow-400 h-full rounded-full transition-all duration-500" style={{ width: `${energia}%` }}></div>
            </div>
          </div>
        </div>

        {/* Botón de Alimentar / Cuidar */}
        <div className="mt-4 relative z-10">
          <button
            onClick={handleAlimentar}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 text-xs flex items-center gap-2 cursor-pointer border border-emerald-300/40"
          >
            <Utensils className="w-4 h-4" /> Dar Baya Mágica 🍇 (+ Energía & Felicidad)
          </button>
        </div>

      </div>

      {/* Paneles de Personalización */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Selector de Especie */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-100 space-y-4">
          <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" /> Seleccionar Especie
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(especiesMap).map(([key, data]) => (
              <button
                key={key}
                onClick={() => handleGuardarCambios(key, undefined, undefined)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer transform hover:-translate-y-1 ${
                  especie === key 
                    ? 'border-emerald-500 bg-emerald-50/90 shadow-lg ring-4 ring-emerald-400/20 scale-[1.02]' 
                    : 'border-slate-100 bg-slate-50 hover:bg-emerald-50/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-3xl">{data.emoji}</span>
                  {especie === key && <span className="text-[10px] bg-emerald-500 text-white font-black px-2.5 py-0.5 rounded-full shadow-xs animate-pulse">Activo</span>}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm">{data.nombre}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{data.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selector de Ropa / Accesorios */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-100 space-y-4">
          <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
            <Shirt className="w-5 h-5 text-indigo-500" /> Vestimenta y Accesorios
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(accesoriosMap).map(([key, data]) => (
              <button
                key={key}
                onClick={() => handleGuardarCambios(undefined, key, undefined)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer transform hover:-translate-y-1 ${
                  accesorioEquipado === key 
                    ? 'border-indigo-500 bg-indigo-50/90 shadow-lg ring-4 ring-indigo-400/20 scale-[1.02]' 
                    : 'border-slate-100 bg-slate-50 hover:bg-indigo-50/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-3xl">{data.icono}</span>
                  {accesorioEquipado === key && <span className="text-[10px] bg-indigo-500 text-white font-black px-2.5 py-0.5 rounded-full shadow-xs animate-pulse">Equipado</span>}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm">{data.nombre}</h4>
                  <p className="text-[11px] text-indigo-600 font-bold mt-0.5">{data.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}