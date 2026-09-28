import React from 'react';
import { Sparkles, Flame, UserCheck, ShieldCheck, Star, LogOut, Trees, Leaf, Clock } from 'lucide-react';

export default function Header({ usuario, onLogout, tiempoRestante }) {
  const datosUsuario = usuario || {
    nombre: 'Explorador',
    nivel: 4,
    estrellas: 0,
    dias_racha: 5,
    avatar: 'fox'
  };

  // Diccionario de emojis para los avatares disponibles
  const avataresMap = {
    fox: '🦊',
    panda: '🐼',
    unicorn: '🦄',
    dragon: '🐲'
  };

  // Obtenemos el emoji correspondiente o un zorro por defecto
  const emojiAvatar = avataresMap[datosUsuario.avatar] || '🦊';

  return (
    <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-5 md:p-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
      {/* Círculos decorativos de fondo con efectos de luz natural */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/15 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute left-10 -bottom-10 w-28 h-28 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        
        {/* Perfil del Usuario con Avatar Dinámico */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-300 to-emerald-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/50 transform -rotate-2 hover:rotate-0 transition-transform select-none">
              {emojiAvatar}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black tracking-wide drop-shadow-sm">¡Hola, {datosUsuario.nombre}!</h1>
                <span className="bg-amber-300 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Leaf className="w-2.5 h-2.5" /> Activo
                </span>
              </div>
              
              {/* Barra de Rango / Nivel */}
              <div className="flex items-center gap-2">
                <p className="text-xs text-emerald-100 font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-200" /> Explorador Nivel {datosUsuario.nivel}
                </p>
              </div>
            </div>
          </div>

          {/* Botón de Salir para móviles */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Cerrar Sesión"
              className="md:hidden p-2.5 bg-white/15 hover:bg-rose-500/80 rounded-2xl border border-white/20 transition-all text-white shadow-sm flex items-center justify-center cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Marcadores de Temporizador, Estrellas, Rachas y Botón de Salir (PC) */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          
          {/* ⏱️ TEMPORIZADOR VISIBLE EN TIEMPO REAL */}
          {tiempoRestante && (
            <div className="bg-amber-500/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-amber-400/30 shadow-inner transform hover:scale-105 transition-transform font-mono text-amber-100">
              <div className="w-7 h-7 rounded-xl bg-amber-400/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-amber-200 uppercase tracking-wide leading-none">Tiempo</p>
                <span className="font-black text-sm md:text-base tracking-wide text-white">{tiempoRestante}</span>
              </div>
            </div>
          )}

          {/* Estrellas */}
          <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/25 shadow-inner transform hover:scale-105 transition-transform">
            <div className="w-7 h-7 rounded-xl bg-amber-400/20 flex items-center justify-center">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wide leading-none">Estrellas</p>
              <span className="font-black text-base md:text-lg tracking-wide text-white">{datosUsuario.estrellas}</span>
            </div>
          </div>

          {/* Rachas */}
          <div className="bg-amber-500/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-amber-400/30 shadow-inner transform hover:scale-105 transition-transform">
            <div className="w-7 h-7 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-200 uppercase tracking-wide leading-none">Racha</p>
              <span className="font-black text-base md:text-lg tracking-wide text-amber-100">{datosUsuario.dias_racha} días</span>
            </div>
          </div>

          {/* Botón de Cerrar Sesión para PC */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Cerrar Sesión"
              className="hidden md:flex p-3 bg-white/15 hover:bg-rose-600 rounded-2xl border border-white/20 transition-all text-white shadow-md items-center justify-center group cursor-pointer"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
}