import React from 'react';
import {
  Flame,
  ShieldCheck,
  Star,
  LogOut,
  Leaf,
  Clock
} from 'lucide-react';

export default function Header({ usuario, onLogout, tiempoRestante }) {
  const datosUsuario = usuario || {
    nombre: 'Explorador',
    nivel: 4,
    estrellas: 0,
    dias_racha: 5,
    avatar: 'fox'
  };

  // Diccionario de avatares
  const avataresMap = {
    fox: '🦊',
    panda: '🐼',
    unicorn: '🦄',
    dragon: '🐲'
  };

  const emojiAvatar = avataresMap[datosUsuario.avatar] || '🦊';

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 text-white shadow-lg">
      
      {/* Decoración de fondo */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-24 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* =========================
              PERFIL
          ========================== */}
          <div className="flex min-w-0 items-center justify-between gap-3">

            <div className="flex min-w-0 items-center gap-3 sm:gap-4">

              {/* Avatar */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-3xl shadow-md backdrop-blur-sm sm:h-16 sm:w-16 sm:text-4xl">
                {emojiAvatar}
              </div>

              {/* Información */}
              <div className="min-w-0">

                <div className="flex min-w-0 items-center gap-2">
                  <h1 className="truncate text-lg font-extrabold tracking-tight sm:text-xl lg:text-2xl">
                    ¡Hola, {datosUsuario.nombre}!
                  </h1>

                  <span className="hidden shrink-0 items-center gap-1 rounded-full border border-amber-200/30 bg-amber-300 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-amber-950 sm:flex">
                    <Leaf className="h-3 w-3" />
                    Activo
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-1.5 text-emerald-100">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-amber-300" />

                  <p className="text-xs font-semibold tracking-wide sm:text-sm">
                    Explorador
                    <span className="mx-1 text-white/40">•</span>
                    Nivel {datosUsuario.nivel}
                  </p>
                </div>

              </div>
            </div>

            {/* Logout móvil */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Cerrar sesión"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-all hover:bg-rose-500 hover:border-rose-400 active:scale-95 md:hidden"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}

          </div>


          {/* =========================
              ESTADÍSTICAS
          ========================== */}
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:w-auto lg:items-center">

            {/* Tiempo */}
            {tiempoRestante && (
              <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur-sm transition-all hover:bg-white/15 sm:px-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/15">
                  <Clock className="h-4 w-4 text-amber-300" />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                    Tiempo
                  </p>

                  <span className="block truncate text-sm font-extrabold tracking-wide text-white sm:text-base">
                    {tiempoRestante}
                  </span>
                </div>

              </div>
            )}


            {/* Estrellas */}
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur-sm transition-all hover:bg-white/15 sm:px-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/15">
                <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                  Estrellas
                </p>

                <span className="block text-base font-extrabold tracking-wide text-white sm:text-lg">
                  {datosUsuario.estrellas}
                </span>
              </div>

            </div>


            {/* Racha */}
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur-sm transition-all hover:bg-white/15 sm:px-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-400/15">
                <Flame className="h-4 w-4 fill-orange-300 text-orange-300" />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                  Racha
                </p>

                <span className="block truncate text-base font-extrabold tracking-wide text-white sm:text-lg">
                  {datosUsuario.dias_racha} días
                </span>
              </div>

            </div>


            {/* Logout PC */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Cerrar sesión"
                className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-all hover:border-rose-400 hover:bg-rose-500 active:scale-95 lg:flex"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}

          </div>

        </div>

      </div>
    </header>
  );
}