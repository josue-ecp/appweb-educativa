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
    <div className="w-full max-w-6xl mx-auto px-3 py-4 sm:px-5 sm:py-6 lg:px-8 space-y-6 pb-10">

      {/* =====================================================
          CABECERA
      ====================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 p-5 text-white shadow-lg sm:p-7 lg:p-8">

        {/* Decoración */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* Información */}
          <div className="min-w-0">

            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-50 backdrop-blur-sm sm:text-xs">
              <Store className="h-3.5 w-3.5" />
              Mercado del Bosque
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Tienda de Explorador
            </h2>

            <p className="mt-2 max-w-xl text-xs leading-relaxed text-emerald-50/80 sm:text-sm">
              Canjea tus estrellas por accesorios especiales o adquiere
              paquetes para continuar tus aventuras.
            </p>

          </div>


          {/* Estrellas */}
          <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3.5 backdrop-blur-md sm:w-auto sm:min-w-[190px]">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 shadow-sm">
              <Star className="h-5 w-5 fill-white text-white" />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                Mis estrellas
              </p>

              <p className="mt-0.5 text-xl font-extrabold tracking-tight text-white">
                {stars}
                <span className="ml-1 text-sm text-amber-200">🌟</span>
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          PAQUETES DE ESTRELLAS
      ====================================================== */}
      <section className="overflow-hidden rounded-3xl bg-slate-900 shadow-lg">

        {/* Encabezado */}
        <div className="border-b border-white/10 p-5 sm:p-6">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

            <div className="min-w-0">

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 sm:text-xs">
                <Gem className="h-3.5 w-3.5" />
                Pago seguro
              </div>

              <h3 className="mt-3 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                Paquetes de Estrellas
              </h3>

              <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                Elige la cantidad de estrellas que necesitas para desbloquear
                accesorios y disfrutar de todas tus aventuras.
              </p>

            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold text-slate-400">
              💳 Pago con tarjeta
            </div>

          </div>

        </div>


        {/* Paquetes */}
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">

          {paquetesEstrellas.map((paquete) => (

            <div
              key={paquete.id}
              className={`group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
                paquete.popular
                  ? 'border-amber-400/60 bg-gradient-to-b from-emerald-800 to-emerald-950 shadow-md shadow-amber-500/5'
                  : 'border-white/10 bg-white/[0.04] hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-white/[0.06]'
              }`}
            >

              {/* Más vendido */}
              {paquete.popular && (
                <div className="absolute right-0 top-0 rounded-bl-xl bg-amber-400 px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-wider text-amber-950">
                  Más vendido
                </div>
              )}


              {/* Icono */}
              <div className="flex items-start justify-between gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-xl shadow-sm transition-transform duration-300 group-hover:scale-105">
                  {paquete.icono}
                </div>

                {paquete.popular && (
                  <span className="mt-5 text-xs text-amber-300">
                    ⭐
                  </span>
                )}

              </div>


              {/* Información */}
              <div className="mt-4 min-w-0">

                <h4 className="truncate text-sm font-extrabold text-white">
                  {paquete.titulo}
                </h4>

                <p className="mt-1 min-h-[32px] text-[11px] leading-relaxed text-slate-400">
                  {paquete.desc}
                </p>

              </div>


              {/* Precio */}
              <div className="mt-4 flex items-end justify-between gap-2 border-t border-white/10 pt-4">

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-amber-300">
                    {paquete.cantidad} estrellas
                  </p>

                  <p className="mt-0.5 text-lg font-extrabold text-white">
                    ${paquete.precio.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => setPaqueteSeleccionado(paquete)}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-3 py-2 text-[10px] font-extrabold text-amber-950 shadow-sm transition-all hover:bg-amber-300 hover:shadow-md active:scale-95 sm:text-xs"
                >
                  Comprar
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          CHECKOUT STRIPE
      ====================================================== */}
      {paqueteSeleccionado && (
        <Elements stripe={stripePromise}>
          <CheckoutForm
            paquete={paqueteSeleccionado}
            onClose={() => setPaqueteSeleccionado(null)}
            onUpdateUser={onUpdateUser}
          />
        </Elements>
      )}


      {/* =====================================================
          ACCESORIOS
      ====================================================== */}
      <section className="space-y-4">

        {/* Encabezado */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2.5">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
              <Gift className="h-4 w-4 text-emerald-600" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-800 sm:text-lg">
                Tesoros disponibles
              </h3>

              <p className="text-[11px] text-slate-400">
                Accesorios para tu explorador
              </p>
            </div>

          </div>

          <span className="self-start rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 sm:self-auto">
            {unlockedTotal} de {itemsTienda.length} coleccionados
          </span>

        </div>


        {/* Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

          {itemsTienda.map((item, idx) => (

            <div
              key={item.id}
              style={{ animationDelay: `${idx * 80}ms` }}
              className={`group relative flex min-w-0 items-center gap-3 rounded-2xl border p-4 transition-all duration-300 ${
                item.unlocked
                  ? 'border-emerald-100 bg-emerald-50/60 shadow-sm'
                  : 'border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md'
              }`}
            >

              {/* Rareza */}
              <span
                className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide ${
                  item.tag === 'Legendario'
                    ? 'bg-amber-100 text-amber-800'
                    : item.tag === 'Épico'
                    ? 'bg-purple-100 text-purple-700'
                    : item.tag === 'Mágico'
                    ? 'bg-cyan-100 text-cyan-700'
                    : item.tag === 'Especial'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {item.tag}
              </span>


              {/* Icono */}
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border text-3xl transition-transform duration-300 group-hover:scale-105 ${
                  item.unlocked
                    ? 'border-emerald-200 bg-white'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                {item.icon}
              </div>


              {/* Información */}
              <div className="min-w-0 flex-1 pt-1">

                <h4 className="pr-14 text-sm font-extrabold text-slate-800 sm:text-base">
                  {item.name}
                </h4>

                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                  {item.desc}
                </p>


                {/* Precio / Acción */}
                <div className="mt-3 flex flex-wrap items-center gap-2">

                  <span className="inline-flex items-center gap-1 rounded-lg border border-amber-100 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-800">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {item.cost}
                  </span>


                  {item.unlocked ? (

                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Coleccionado
                    </span>

                  ) : (

                    <button
                      disabled={loadingId === item.id || stars < item.cost}
                      onClick={() => comprarItem(item)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-extrabold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {loadingId === item.id ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Canjeando
                        </>
                      ) : (
                        <>
                          Comprar
                        </>
                      )}

                    </button>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}