import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { Loader2, ShieldCheck } from 'lucide-react';
import CreditCardVisual from './CreditCardVisual';
import { playSuccessSound, playWinSound, playErrorSound } from '../services/sound';
import { sumarEstrellas, confirmarPagoStripe } from '../services/api';
import confetti from 'canvas-confetti';

// Inicializamos Stripe de manera segura con tu llave pública exacta
const stripePromise = loadStripe('pk_test_51R894YRsY0EF16lUosBbpX992DrQLogjnxYjESTrDDN8yMJhTT7NsAUxqsaAXf9mEMaOjFI8MRjGlwHaCKqYP5u400q3QAYWGQ');

function FormularioInterior({ paquete, onClose, onUpdateUser }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [numeroSimulado, setNumeroSimulado] = useState('4242 •••• •••• 4242');
  const [expSimulada, setExpSimulada] = useState('12/28');
  const [cvcSimulado, setCvcSimulado] = useState('123');
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!stripe || !elements) return;

  setLoading(true);
  playSuccessSound();

  try {
    const usuarioGuardado = JSON.parse(
      localStorage.getItem('appweb_usuario') || '{}'
    );

    if (!usuarioGuardado.id) {
      throw new Error('No se encontró el usuario actual.');
    }

    // URL correcta tanto para localhost como para producción
    const API_URL = window.location.hostname === 'localhost'
      ? 'http://localhost:8000/api'
      : 'https://appweb-backend-production.up.railway.app/api';

    // 1. Crear PaymentIntent en Laravel
    const response = await fetch(
      `${API_URL}/stripe/crear-payment-intent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          cantidadEstrellas: paquete.cantidad,
          precio: paquete.precio,
          user_id: usuarioGuardado.id
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.clientSecret) {
      throw new Error(
        data.error || 'No se pudo obtener el secreto de pago.'
      );
    }

    // 2. Confirmar pago con Stripe
    const cardElement = elements.getElement(CardNumberElement);

    const result = await stripe.confirmCardPayment(
      data.clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: nombre || 'Explorador'
          }
        }
      }
    );

    if (result.error) {
      playErrorSound();
      alert(result.error.message);
      setLoading(false);
      return;
    }

    // 3. Stripe confirmó el pago
    if (
      result.paymentIntent &&
      result.paymentIntent.status === 'succeeded'
    ) {

      // 4. Confirmamos el pago también en nuestro backend
      const confirmacion = await confirmarPagoStripe(
        result.paymentIntent.id
      );

      if (!confirmacion.success) {
        throw new Error(
          confirmacion.message ||
          'El pago fue realizado, pero no se pudo activar el pase.'
        );
      }

      // 5. Sumar estrellas
      await sumarEstrellas(paquete.cantidad);

      // 6. Obtenemos el usuario actualizado
      const usuarioActual = JSON.parse(
        localStorage.getItem('appweb_usuario') || '{}'
      );

      const usuarioConPase = {
        ...usuarioActual,
        ...(confirmacion.usuario || {}),
        pase_ilimitado: true
      };

      // 7. Guardamos el usuario actualizado
      localStorage.setItem(
        'appweb_usuario',
        JSON.stringify(usuarioConPase)
      );

      // 8. Actualizamos el estado de React
      if (onUpdateUser) {
        await onUpdateUser();
      }

      playWinSound();

      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 }
      });

      alert(
        `¡Pago exitoso! Se han agregado ${paquete.cantidad} estrellas y tu pase ilimitado ha sido activado 🌟✨`
      );

      setLoading(false);

      if (onClose) {
        onClose();
      }
    }

  } catch (err) {
    console.error(err);

    playErrorSound();

    alert(
      err.message ||
      'Hubo un error al procesar el pago.'
    );

    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 border-3 border-emerald-400/40 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl text-white relative">
        
        {/* Botón cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-emerald-300 hover:text-white font-black text-lg bg-white/10 w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-5">
          <span className="bg-emerald-500/30 text-emerald-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-400/30">
            {paquete.titulo} ({paquete.cantidad} ⭐)
          </span>
          <h3 className="text-2xl font-black mt-2">Pago Seguro de Estrellas</h3>
          <p className="text-emerald-200 text-xs font-medium">Total a pagar: <span className="font-black text-amber-400">${paquete.precio.toFixed(2)} MXN</span></p>
        </div>

        {/* TARJETA 3D ANIMADA EN TIEMPO REAL */}
        <CreditCardVisual 
          numero={numeroSimulado} 
          nombre={nombre || 'JOSUE CEH'} 
          exp={expSimulada} 
          cvc={cvcSimulado} 
          isFlipped={isFlipped} 
        />

        {/* FORMULARIO DE STRIPE ELEMENTS */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-emerald-200 mb-1">Nombre del Explorador (Titular)</label>
            <input 
              type="text" 
              required
              placeholder="Ej. Josué Ceh"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-black/40 border-2 border-emerald-500/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-emerald-700/60 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-emerald-200 mb-1">Número de Tarjeta</label>
            <div className="bg-black/40 border-2 border-emerald-500/40 rounded-xl p-3">
              <CardNumberElement 
                onChange={(e) => {
                  if (e.complete) setNumeroSimulado('4242 •••• •••• 4242');
                  else setNumeroSimulado('4242 •••• •••• 4242');
                }}
                options={{ style: { base: { color: '#ffffff', fontSize: '15px', '::placeholder': { color: '#047857' } } } }} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-emerald-200 mb-1">Expiración</label>
              <div className="bg-black/40 border-2 border-emerald-500/40 rounded-xl p-3">
                <CardExpiryElement 
                  onChange={(e) => setExpSimulada(e.complete ? '12/28' : '12/28')}
                  options={{ style: { base: { color: '#ffffff', fontSize: '15px', '::placeholder': { color: '#047857' } } } }} 
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-emerald-200 mb-1">CVC</label>
              <div className="bg-black/40 border-2 border-emerald-500/40 rounded-xl p-3">
                <CardCvcElement 
                  onFocus={() => setIsFlipped(true)}
                  onBlur={() => setIsFlipped(false)}
                  onChange={(e) => setCvcSimulado(e.empty ? '123' : '123')}
                  options={{ style: { base: { color: '#ffffff', fontSize: '15px', '::placeholder': { color: '#047857' } } } }} 
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full mt-4 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black rounded-2xl shadow-lg transition transform hover:scale-[1.02] active:scale-95 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Procesando pago seguro...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" /> Pagar ${paquete.precio.toFixed(2)} MXN de forma segura
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

export default function CheckoutForm(props) {
  return (
    <Elements stripe={stripePromise}>
      <FormularioInterior {...props} />
    </Elements>
  );
}