import React from 'react';
import { Sparkles, ShieldCheck, Zap, Crown, Star } from 'lucide-react';

export default function PlanesModal({ onComprarStripe }) {
  const paquetePlan = {
    id: 'pase_ilimitado',
    titulo: 'Pase Supremo del Bosque',
    cantidad: 130,
    precio: 99.00,
    desc: 'Acceso Ilimitado + 130 Estrellas Mágicas 🌟'
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 border-4 border-amber-400/60 rounded-[3rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl text-white relative overflow-hidden text-center space-y-6">
        
        {/* Efectos de luz natural y destellos del bosque */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Cabecera del Modal */}
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg animate-bounce">
            <Sparkles className="w-4 h-4" /> ¡Tiempo de Aventura Agotado!
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Tu prueba de 15 minutos ha finalizado</h2>
          <p className="text-emerald-200 text-xs sm:text-sm font-medium leading-relaxed max-w-md mx-auto">
            Para continuar explorando el bosque, resolviendo misiones y manteniendo tu racha, adquiere el pase de acceso ilimitado.
          </p>
        </div>

        {/* Tarjeta de Plan Mejorada y Profesional */}
        <div className="bg-gradient-to-br from-emerald-900/90 via-teal-900/90 to-slate-900 border-2 border-amber-400/60 rounded-[2.5rem] p-6 shadow-xl relative z-10 space-y-5 text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-[10px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Crown className="w-3.5 h-3.5" /> Recomendado
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg border-2 border-amber-300/40 flex-shrink-0">
              👑
            </div>
            <div>
              <h4 className="font-black text-lg text-white">{paquetePlan.titulo}</h4>
              <p className="text-xs text-amber-300 font-bold mt-0.5">{paquetePlan.desc}</p>
            </div>
          </div>

          <div className="bg-black/30 rounded-2xl p-3.5 border border-emerald-500/30 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-200">Inversión Mágica:</span>
            <span className="font-black text-xl text-amber-400">${paquetePlan.precio.toFixed(2)} MXN</span>
          </div>

          <button
            onClick={() => onComprarStripe(paquetePlan)}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-amber-950 font-black rounded-2xl shadow-xl transition transform hover:scale-[1.02] active:scale-95 text-sm flex items-center justify-center gap-2 cursor-pointer border border-white/30"
          >
            <Zap className="w-4 h-4 fill-amber-950 animate-pulse" /> ¡Obtener Acceso Ilimitado (Tarjeta 3D 💳)!
          </button>
        </div>

        {/* Pie de seguridad */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-300 font-bold relative z-10">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Pago 100% seguro y encriptado con Stripe. Desbloqueo inmediato.
        </div>

      </div>
    </div>
  );
}