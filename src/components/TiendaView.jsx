import React, { useState, useEffect } from 'react';
import { Store, Sparkles, Star, ShieldCheck, Lock, Loader2, CheckCircle2, Gift, Trees, Gem, Leaf } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { sumarEstrellas, getMochilaAPI, desbloquearAccesorioAPI } from '../services/api';
import { playSuccessSound, playWinSound, playErrorSound } from '../services/sound';

// Inicializa Stripe con tu llave pública (asegúrate de colocar tu pk_test aquí o vía variable de entorno)
const stripePromise = loadStripe('pk_test_51R894YRsY0EF16lUosBbpX992DrQLogjnxYjESTrDDN8yMJhTT7NsAUxqsaAXf9mEMaOjFI8MRjGlwHaCKqYP5u400q3QAYWGQ');

export default function TiendaView({ stars, onUpdateUser }) {
  const [loadingId, setLoadingId] = useState(null);
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(null);
  
  // Catálogo de artículos con temática del bosque encantado
  const [itemsTienda, setItemsTienda] = useState([
    { id: 'sombrero_explorador', name: 'Sombrero de Explorador', icon: '🤠', desc: '¡Ideal para buscar tesoros secretos entre los matorrales!', cost: 30, unlocked: false, tag: 'Popular' },
    { id: 'lentes_cientifico', name: 'Lentes de Científico', icon: '👓', desc: 'Para ver más allá de los árboles y descubrir runas mágicas.', cost: 30, unlocked: false, tag: 'Especial' },
    { id: 'capa_super', name: 'Capa de Hojas Mágicas', icon: '🍃', desc: 'Te da el poder de volar suavemente por los senderos.', cost: 30, unlocked: false, tag: 'Mágico' },
    { id: 'medalla_oro', name: 'Medalla de Oro del Bosque', icon: '🥇', desc: 'Brilla intensamente con la luz del sol en la copa de los árboles.', cost: 40, unlocked: false, tag: 'Legendario' },
    { id: 'mascota_robot', name: 'Robot del Saber', icon: '🤖', desc: 'Tu compañero fiel para resolver cualquier acertijo natural.', cost: 50, unlocked: false, tag: 'Épico' }
  ]);

  // Paquetes variados de estrellas para recarga con Stripe Elements
  const paquetesEstrellas = [
    { id: 'paquete_25', cantidad: 25, precio: 25.00, icono: '🌿', titulo: 'Brotes de Estrella', desc: 'Ideal para un empujón rápido.' },
    { id: 'paquete_60', cantidad: 60, precio: 49.00, icono: '⭐', titulo: 'Saquito Luminoso', desc: '¡Una dosis perfecta de aventura!', popular: false },
    { id: 'paquete_130', cantidad: 130, precio: 99.00, icono: '🌟', titulo: 'Cofre del Roble', desc: '¡El favorito de los exploradores!', popular: true },
    { id: 'paquete_300', cantidad: 300, precio: 199.00, icono: '👑', titulo: 'Tesoro del Gran Árbol', desc: '¡Suministro masivo para leyendas!', popular: false }
  ];

  // Cargar estado de compra desde la Base de Datos al iniciar
  useEffect(() => {
    async function cargarEstadoTienda() {
      try {
        const slugsDesbloqueados = await getMochilaAPI();
        if (slugsDesbloqueados && Array.isArray(slugsDesbloqueados)) {
          setItemsTienda(prev => prev.map(item => ({
            ...item,
            unlocked: slugsDesbloqueados.includes(item.id)
          })));
        }
      } catch (error) {
        console.error("Error al cargar estado de la tienda:", error);
      }
    }
    cargarEstadoTienda();
  }, []);

  // Función para comprar un artículo usando estrellas
  const comprarItem = async (item) => {
    if (item.unlocked) return;

    if (stars < item.cost) {
      playErrorSound();
      alert(`¡Te faltan estrellas! Necesitas ${item.cost} estrellas para conseguir ${item.name} 🌟`);
      return;
    }

    try {
      setLoadingId(item.id);
      playSuccessSound();

      await sumarEstrellas(-item.cost);
      if (onUpdateUser) onUpdateUser();

      await desbloquearAccesorioAPI(item.id);

      setItemsTienda(prev => prev.map(a => 
        a.id === item.id ? { ...a, unlocked: true } : a
      ));

      setLoadingId(null);
      playWinSound();
      confetti({ particleCount: 180, spread: 100, origin: { y: 0.5 } });

    } catch (error) {
      console.error("Error al comprar en la tienda:", error);
      setLoadingId(null);
      playErrorSound();
      alert('Hubo un error al procesar la compra.');
    }
  };

  const unlockedTotal = itemsTienda.filter(i => i.unlocked).length;

  return (
    <div className="p-3 sm:p-6 md:p-8 space-y-8 max-w-4xl mx-auto w-full animate-fadeIn pb-16">
      
      {/* Cabecera Mágica de la Tienda */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-[2.5rem] p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-3 border-white/30">
        <div className="absolute -right-10 -top-10 w-36 h-36 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute left-10 -bottom-10 w-28 h-28 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-amber-300 text-amber-950 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-md transform -rotate-1">
            <Sparkles className="w-4 h-4 text-amber-800 animate-spin" /> Mercado Secreto del Bosque
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm">Tienda de Explorador ⛺</h2>
          <p className="text-emerald-100 text-xs sm:text-sm font-medium max-w-md leading-relaxed">
            ¡Canjea tus estrellas por equipo mágico o adquiere paquetes de estrellas con tarjeta animada 3D!
          </p>
        </div>

        {/* Badge Flotante de Estrellas del Usuario */}
        <div className="relative z-10 bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border-2 border-white/30 shadow-inner flex items-center gap-3 transform hover:scale-105 transition-transform">
          <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow-md">
            <Star className="w-6 h-6 text-white fill-white animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-100">Mis Estrellas</p>
            <span className="font-black text-xl text-white">{stars} 🌟</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN: ÁRBOL DE CRISTALES ESTELARES */}
      <div className="bg-gradient-to-br from-teal-900 via-emerald-900 to-slate-900 rounded-[2.5rem] p-6 md:p-8 text-white shadow-xl relative overflow-hidden border-3 border-emerald-500/40">
        <div className="absolute right-[-10px] bottom-[-10px] text-8xl opacity-10 pointer-events-none">
          <Trees className="w-64 h-64 text-emerald-300" />
        </div>
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 bg-emerald-500/30 px-4 py-1.5 rounded-full w-fit text-xs font-black uppercase tracking-wider backdrop-blur-md border border-emerald-400/40 text-emerald-200">
              <Leaf className="w-4 h-4 text-emerald-300" /> Árbol de Cristales (Pago Seguro)
            </div>
            <span className="text-[11px] font-bold text-teal-200 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
              💳 Tarjeta 3D interactiva en tiempo real
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-black">Selecciona tu Paquete de Estrellas</h3>
            <p className="text-emerald-100 text-xs md:text-sm font-medium max-w-lg leading-relaxed">
              Elige el suministro perfecto para desbloquear todos los accesorios y convertirte en el guardián supremo del bosque.
            </p>
          </div>

          {/* Grid Organizado de 4 Paquetes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {paquetesEstrellas.map((paquete) => (
              <div 
                key={paquete.id}
                className={`bg-emerald-950/60 backdrop-blur-md rounded-3xl p-5 border-2 transition-all duration-300 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:-translate-y-1 ${
                  paquete.popular ? 'border-amber-400 shadow-amber-500/10' : 'border-emerald-500/30 hover:border-emerald-400'
                }`}
              >
                {paquete.popular && (
                  <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-[9px] font-black px-3 py-0.5 rounded-bl-xl uppercase tracking-wider shadow-sm">
                    ⭐ ¡Más Vendido!
                  </div>
                )}

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                    {paquete.icono}
                  </div>
                  <div>
                    <h4 className="font-black text-base text-white">{paquete.titulo}</h4>
                    <p className="text-xs text-emerald-200/80 font-medium mt-0.5">{paquete.desc}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-emerald-800/50 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block leading-none">{paquete.cantidad} Estrellas</span>
                    <span className="font-black text-base text-white">${paquete.precio.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => setPaqueteSeleccionado(paquete)}
                    className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-3.5 py-2 rounded-xl shadow-md transition transform hover:scale-105 active:scale-95 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    Adquirir 💳
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL DE CHECKOUT CON STRIPE ELEMENTS Y TARJETA 3D */}
      {paqueteSeleccionado && (
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            paquete={paqueteSeleccionado} 
            onClose={() => setPaqueteSeleccionado(null)} 
            onUpdateUser={onUpdateUser} 
          />
        </Elements>
      )}

      {/* Catálogo del Mercado del Bosque */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
            <Gift className="w-6 h-6 text-emerald-600 animate-bounce" /> Tesoros Disponibles
          </h3>
          <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-200 px-4 py-1.5 rounded-2xl shadow-xs">
            🎒 {unlockedTotal} de {itemsTienda.length} Coleccionados
          </span>
        </div>

        {/* Grid de Artículos Estilo Tarjetas Mágicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {itemsTienda.map((item, idx) => (
            <div
              key={item.id}
              style={{ animationDelay: `${idx * 80}ms` }}
              className={`rounded-[2rem] p-5 md:p-6 border-3 transition-all duration-300 flex items-center gap-4 shadow-md hover:shadow-xl animate-fadeIn relative overflow-hidden group ${
                item.unlocked 
                  ? 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/70 border-emerald-300' 
                  : 'bg-white border-slate-200 hover:border-emerald-400 transform hover:-translate-y-1'
              }`}
            >
              {/* Etiqueta flotante de rareza */}
              <div className="absolute top-3 right-4">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs ${
                  item.tag === 'Legendario' ? 'bg-amber-400 text-amber-950 animate-pulse' :
                  item.tag === 'Épico' ? 'bg-purple-100 text-purple-800' :
                  item.tag === 'Mágico' ? 'bg-cyan-100 text-cyan-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {item.tag}
                </span>
              </div>

              {/* Icono del artículo */}
              <div className={`w-18 h-18 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-4xl shadow-inner border-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${
                item.unlocked ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                {item.icon}
              </div>

              {/* Información y botones */}
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="font-black text-slate-800 text-base md:text-lg truncate">{item.name}</h4>
                <p className="text-xs text-slate-500 font-medium mb-3 leading-snug line-clamp-2">
                  {item.desc}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-black bg-amber-100 text-amber-950 px-3 py-1 rounded-xl shadow-xs border border-amber-200">
                    <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" /> {item.cost} Estrellas
                  </span>

                  {item.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ¡En Casillero!
                    </span>
                  ) : (
                    <button
                      disabled={loadingId === item.id || stars < item.cost}
                      onClick={() => comprarItem(item)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
                    >
                      {loadingId === item.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Canjeando...
                        </>
                      ) : (
                        <>✨ ¡Comprar!</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}