import React from 'react';

export default function CreditCardVisual({ numero, nombre, exp, cvc, isFlipped }) {
  const numeroFormateado = numero || '4242 •••• •••• 4242';
  const nombreFormateado = nombre || 'JOSUE CEH';
  const expFormateada = exp || '12/28';

  return (
    <div className="w-full max-w-sm mx-auto h-52 mb-6 select-none" style={{ perspective: '1000px' }}>
      <div 
        className="relative w-full h-full duration-700 transition-transform" 
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
        }}
      >
        
        {/* FRENTE DE LA TARJETA */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-2xl flex flex-col justify-between border border-emerald-400/40 overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Brillo holográfico decorativo */}
          <div className="absolute -right-16 -top-16 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-black tracking-widest text-emerald-300 uppercase">Aventurilandia Pay</span>
            </div>
            {/* Chip de la tarjeta */}
            <div className="w-11 h-8 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 rounded-lg shadow-md border border-amber-300/50 flex items-center justify-center">
              <div className="w-8 h-5 border border-amber-600/40 rounded grid grid-cols-2 gap-0.5 p-0.5">
                <div className="border-r border-b border-amber-600/40"></div>
                <div className="border-b border-amber-600/40"></div>
              </div>
            </div>
          </div>

          <div className="space-y-1 relative z-10">
            <p className="text-[9px] uppercase tracking-widest text-emerald-300/80 font-bold">Número Seguro</p>
            <p className="font-mono text-xl tracking-widest font-black text-amber-200 drop-shadow-sm">{numeroFormateado}</p>
          </div>

          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-emerald-300/80 font-bold">Titular</p>
              <p className="font-bold text-xs tracking-wider truncate max-w-[190px] uppercase">{nombreFormateado}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-emerald-300/80 font-bold">Expira</p>
              <p className="font-mono font-bold text-xs text-emerald-200">{expFormateada}</p>
            </div>
          </div>
        </div>

        {/* REVERSO DE LA TARJETA (Al voltear por el CVC) */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 rounded-3xl p-6 text-white shadow-2xl flex flex-col justify-between border border-emerald-400/40"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="w-full h-11 bg-black/80 -mx-6 mt-3 shadow-inner"></div>
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-widest text-emerald-300/80 text-right">Código CVC</p>
            <div className="bg-white/95 text-slate-900 font-mono font-black py-1.5 px-3 rounded-xl text-right w-20 ml-auto shadow-inner text-sm tracking-widest">
              {cvc || '•••'}
            </div>
          </div>
          <div className="text-[10px] text-emerald-300 text-center font-bold tracking-wide bg-black/30 py-1.5 rounded-xl border border-emerald-500/20">
            🛡️ Encriptación de Grado Bancario Stripe
          </div>
        </div>

      </div>
    </div>
  );
}