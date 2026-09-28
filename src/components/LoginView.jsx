import React, { useState } from 'react';
import { User, Mail, Lock, Star, ShieldCheck, Trees, Leaf } from 'lucide-react';
import confetti from 'canvas-confetti';
import { registrarUsuario, loginUsuario, loginAdminAPI } from '../services/api';

export default function LoginView({ onLoginSuccess, onAdminLoginSuccess }) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState('fox');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const avatares = [
    { id: 'fox', emoji: '🦊', label: 'Zorro' },
    { id: 'panda', emoji: '🐼', label: 'Panda' },
    { id: 'unicorn', emoji: '🦄', label: 'Unicornio' },
    { id: 'dragon', emoji: '🐲', label: 'Dragón' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!correo || !contrasena || (!isAdminMode && isRegisterMode && !nombre)) {
      setErrorMsg('¡Por favor completa todos los campos requeridos 🍃!');
      return;
    }

    setLoading(true);
    let resultado;

    if (isAdminMode) {
      resultado = await loginAdminAPI({ correo, contrasena });
    } else if (isRegisterMode) {
      resultado = await registrarUsuario({ nombre, correo, contrasena, avatar: personajeSeleccionado });
    } else {
      resultado = await loginUsuario({ correo, contrasena });
    }

    setLoading(false);

    if (resultado.success) {
      confetti({ particleCount: 220, spread: 130, origin: { y: 0.6 } });
      if (isAdminMode) {
        if (onAdminLoginSuccess) onAdminLoginSuccess(resultado.admin);
      } else {
        if (onLoginSuccess) onLoginSuccess(resultado.usuario);
      }
    } else {
      setErrorMsg(resultado.message || 'Ups, algo falló en el camino. Verifica tus datos.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-teal-400 to-emerald-600 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden select-none">
      
      {/* Estilos CSS Avanzados para Múltiples Animaciones */}
      <style>{`
        @keyframes moveClouds {
          0% { transform: translateX(-200px); }
          100% { transform: translateX(1400px); }
        }
        @keyframes swayTree {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes flyButterfly {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          25% { transform: translate(150px, -40px) rotate(15deg); }
          50% { transform: translate(300px, 10px) rotate(-10deg); }
          75% { transform: translate(450px, -30px) rotate(10deg); }
          100% { transform: translate(650px, 0px) rotate(0deg); }
        }
        @keyframes floatLeaf {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-600px) translateX(100px) rotate(360deg); opacity: 0; }
        }
        .cloud-fast { animation: moveClouds 20s linear infinite; }
        .cloud-slow { animation: moveClouds 35s linear infinite; animation-delay: -10s; }
        .cloud-mid { animation: moveClouds 26s linear infinite; animation-delay: -5s; }
        
        .tree-1 { animation: swayTree 3.8s ease-in-out infinite; transform-origin: bottom center; }
        .tree-2 { animation: swayTree 4.5s ease-in-out infinite; animation-delay: -1s; transform-origin: bottom center; }
        .tree-3 { animation: swayTree 4.2s ease-in-out infinite; animation-delay: -2s; transform-origin: bottom center; }
        
        .butterfly-1 { animation: flyButterfly 12s ease-in-out infinite; }
        .butterfly-2 { animation: flyButterfly 15s ease-in-out infinite reverse; animation-delay: -5s; }
        
        .particle-leaf {
          position: absolute;
          animation: floatLeaf linear infinite;
        }
      `}</style>

      {/* Sol Brillante Interactivo */}
      <div className="absolute top-10 right-16 w-32 h-32 bg-amber-200 rounded-full blur-xs shadow-[0_0_90px_rgba(254,240,138,0.95)] pointer-events-none animate-pulse"></div>

      {/* Múltiples Nubes en Diferentes Capas */}
      <div className="absolute top-10 left-[-150px] text-white/90 text-6xl cloud-fast pointer-events-none">☁️</div>
      <div className="absolute top-24 left-[-200px] text-white/75 text-5xl cloud-slow pointer-events-none">☁️</div>
      <div className="absolute top-40 left-[-180px] text-white/60 text-6xl cloud-mid pointer-events-none">☁️</div>

      {/* Mariposas Volando Dinámicamente por la Pantalla */}
      <div className="absolute bottom-40 left-[-50px] text-3xl butterfly-1 pointer-events-none z-10">🦋</div>
      <div className="absolute bottom-60 right-[-50px] text-3xl butterfly-2 pointer-events-none z-10" style={{ animationDelay: '-3s' }}>🦋</div>

      {/* Partículas de Hojas Flotando */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="particle-leaf text-xl left-[10%] bottom-[-30px]" style={{ animationDuration: '7s', animationDelay: '0s' }}>🍃</div>
        <div className="particle-leaf text-2xl left-[30%] bottom-[-30px]" style={{ animationDuration: '9s', animationDelay: '2s' }}>🍂</div>
        <div className="particle-leaf text-xl left-[55%] bottom-[-30px]" style={{ animationDuration: '6s', animationDelay: '1s' }}>🍃</div>
        <div className="particle-leaf text-2xl left-[75%] bottom-[-30px]" style={{ animationDuration: '10s', animationDelay: '3s' }}>🌿</div>
        <div className="particle-leaf text-xl left-[90%] bottom-[-30px]" style={{ animationDuration: '8s', animationDelay: '1.5s' }}>🍃</div>
      </div>

      {/* Capas de Colinas del Bosque en el Fondo */}
      <div className="absolute bottom-0 inset-x-0 h-56 bg-emerald-700 rounded-t-[50%] scale-150 pointer-events-none z-0 shadow-inner"></div>
      <div className="absolute bottom-0 inset-x-0 h-44 bg-emerald-600 rounded-t-[40%] scale-125 pointer-events-none z-0"></div>
      
      {/* Fila de Árboles y Pinos Animados a los Lados */}
      <div className="absolute bottom-20 left-4 md:left-16 text-6xl tree-1 pointer-events-none z-0">🌲</div>
      <div className="absolute bottom-24 left-14 md:left-32 text-5xl tree-2 pointer-events-none z-0">🌳</div>
      <div className="absolute bottom-20 left-28 md:left-48 text-6xl tree-3 pointer-events-none z-0">🌲</div>

      <div className="absolute bottom-20 right-6 md:right-16 text-6xl tree-2 pointer-events-none z-0">🌲</div>
      <div className="absolute bottom-24 right-16 md:right-36 text-5xl tree-1 pointer-events-none z-0">🌳</div>
      <div className="absolute bottom-20 right-30 md:right-52 text-6xl tree-3 pointer-events-none z-0">🌲</div>

      {/* Tarjeta Contenedora Principal Estilo Bosque Encantado */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-[0_25px_70px_rgba(6,78,59,0.35)] p-6 sm:p-8 md:p-10 border-4 border-emerald-100 relative z-20 space-y-6 transition-all duration-300">
        
        {/* Insignia Superior con Selector de Rol */}
        <div className="flex justify-between items-center bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-3.5 rounded-2xl border-2 border-emerald-200 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg transform -rotate-6 animate-pulse">
              <Trees className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-black text-emerald-950 tracking-wider uppercase">🌿 Aventurilandia</h3>
              <p className="text-[11px] font-extrabold text-emerald-700">{isAdminMode ? 'Portal del Profesor 🛡️' : '¡Aprende Jugando! 🎮'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setIsAdminMode(!isAdminMode); setErrorMsg(''); }}
            className={`text-[10px] font-black px-3 py-2 rounded-xl uppercase tracking-wider transition cursor-pointer shadow-sm ${
              isAdminMode 
                ? 'bg-emerald-800 text-white shadow-emerald-900/40' 
                : 'bg-white text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {isAdminMode ? 'Modo Alumno 🍃' : 'Soy Profesor 🛡️'}
          </button>
        </div>

        {/* Títulos dinámicos */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isAdminMode ? '🛡️ Acceso Docente' : (isRegisterMode ? '🌟 ¡Crea tu Aventura!' : '🚀 ¡Hola, Explorador!')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-bold">
            {isAdminMode 
              ? 'Ingresa tus credenciales para administrar los mundos del saber.' 
              : (isRegisterMode ? 'Elige tu guía del bosque y comienza a ganar estrellas.' : '¡Prepárate para explorar el bosque encantado!')}
          </p>
        </div>

        {/* Alerta de Error */}
        {errorMsg && (
          <div className="bg-rose-100 border-2 border-rose-300 text-rose-800 text-xs font-black p-3.5 rounded-2xl text-center shadow-sm animate-bounce">
            {errorMsg}
          </div>
        )}

        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          
          {/* Selector de Avatar */}
          {!isAdminMode && isRegisterMode && (
            <div className="space-y-2 animate-fadeIn">
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider text-center">
                Elige tu compañero del bosque:
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {avatares.map((av) => (
                  <button
                    type="button"
                    key={av.id}
                    onClick={() => setPersonajeSeleccionado(av.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-3 transition-all transform cursor-pointer ${
                      personajeSeleccionado === av.id
                        ? 'border-emerald-600 bg-emerald-50 shadow-md scale-110 ring-4 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl mb-1 filter drop-shadow-md">{av.emoji}</span>
                    <span className="text-[10px] font-black text-slate-700 truncate w-full text-center">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Campo Nombre */}
          {!isAdminMode && isRegisterMode && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Tu Nombre de Explorador</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-emerald-600"><User className="w-4 h-4" /></span>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Lucas el Valiente"
                  autoComplete="off"
                  name="nombre_heroe_new"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 font-bold text-slate-800 text-xs sm:text-sm outline-none transition bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Campo Correo Electrónico */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              {isAdminMode ? 'Correo del Profesor' : 'Correo Electrónico'}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-emerald-600"><Mail className="w-4 h-4" /></span>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder={isAdminMode ? 'admin@aventurilandia.com' : 'tucorreo@example.com'}
                autoComplete="off"
                name="correo_usuario_login"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 font-bold text-slate-800 text-xs sm:text-sm outline-none transition bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Campo Contraseña Secreta */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Contraseña Secreta</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-emerald-600"><Lock className="w-4 h-4" /></span>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                name="password_usuario_secure"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 font-bold text-slate-800 text-xs sm:text-sm outline-none transition bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Botón de Acción Principal */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5 disabled:opacity-50 mt-4 cursor-pointer border-3 border-white/50 ${
              isAdminMode 
                ? 'bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 shadow-emerald-900/40' 
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-emerald-500/40'
            }`}
          >
            {isAdminMode ? <ShieldCheck className="w-5 h-5" /> : <Leaf className="w-5 h-5 animate-bounce" />} 
            {loading ? 'Entrando al Bosque...' : (isAdminMode ? '🛡️ Ingresar al Panel Docente' : (isRegisterMode ? '¡Comenzar la Aventura! 🍃' : '¡Entrar al Bosque! 🚀'))}
          </button>
        </form>

        {/* Pie de Intercambio de Modo */}
        {!isAdminMode && (
          <div className="text-center pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-1.5">
            <p className="text-xs font-extrabold text-slate-500">
              {isRegisterMode ? '¿Ya tienes una cuenta?' : '¿Nuevo explorador?'}
            </p>
            <button
              type="button"
              onClick={() => { setIsRegisterMode(!isRegisterMode); setErrorMsg(''); }}
              className="text-xs font-black text-emerald-600 hover:text-emerald-700 hover:underline transition cursor-pointer"
            >
              {isRegisterMode ? 'Inicia sesión aquí 🍃' : 'Crea tu cuenta gratis ✨'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}