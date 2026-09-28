import React, { useState } from 'react';
import { PlusCircle, BookOpen, HelpCircle } from 'lucide-react';
import { crearMundoCompletoAPI } from '../../services/api';
import confetti from 'canvas-confetti';

export default function MundoCompletoCrud() {
  const [slug, setSlug] = useState('');
  const [titulo, setTitulo] = useState('');
  const [etiqueta, setEtiqueta] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  // Inicializamos un arreglo de 10 preguntas vacías por defecto
  const [preguntas, setPreguntas] = useState(
    Array.from({ length: 10 }, () => ({
      pregunta: '',
      opcion_1: '',
      opcion_2: '',
      opcion_3: '',
      respuesta_correcta: ''
    }))
  );

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const handlePreguntaChange = (index, campo, valor) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index][campo] = valor;
    setPreguntas(nuevasPreguntas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slug || !titulo || !etiqueta || !descripcion) {
      setMensaje({ success: false, text: 'Por favor completa todos los datos generales del mundo.' });
      return;
    }

    // Validar que las preguntas tengan contenido básico
    for (let i = 0; i < preguntas.length; i++) {
      const p = preguntas[i];
      if (!p.pregunta || !p.opcion_1 || !p.opcion_2 || !p.opcion_3 || !p.respuesta_correcta) {
        setMensaje({ success: false, text: `La pregunta #${i + 1} está incompleta.` });
        return;
      }
    }

    setLoading(true);
    const resultado = await crearMundoCompletoAPI({
      slug,
      titulo,
      etiqueta_superior: etiqueta,
      descripcion,
      preguntas
    });
    setLoading(false);

    if (resultado.success) {
      confetti({ particleCount: 180, spread: 100, origin: { y: 0.6 } });
      setMensaje({ success: true, text: '¡Mundo y sus 10 misiones publicadas correctamente!' });
      setSlug('');
      setTitulo('');
      setEtiqueta('');
      setDescripcion('');
    } else {
      setMensaje({ success: false, text: resultado.message || 'Error al guardar en la base de datos.' });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-[2.5rem] shadow-sm">
        <h2 className="text-xl md:text-2xl font-black text-slate-900">✨ Creación de Mundo y Misiones</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Configura la información del mundo y define sus 10 preguntas interactivas en un solo lugar.</p>
      </div>

      {mensaje && (
        <div className={`p-4 rounded-2xl text-xs font-black text-center shadow-sm ${mensaje.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
          {mensaje.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECCIÓN 1: DATOS GENERALES */}
        <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-10 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" /> 1. Información del Mundo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Identificador (Slug único)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                placeholder="Ej. geografia"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold text-xs outline-none focus:border-indigo-600 transition"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Etiqueta Superior (Subtítulo)</label>
              <input
                type="text"
                value={etiqueta}
                onChange={(e) => setEtiqueta(e.target.value)}
                placeholder="Ej. ISLA DE LA GEOGRAFÍA"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold text-xs outline-none focus:border-indigo-600 transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Título del Mundo</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Geografía Asombrosa"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold text-xs outline-none focus:border-indigo-600 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Descripción Breve</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Breve reseña del mundo..."
              rows="3"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold text-xs outline-none focus:border-indigo-600 transition resize-none"
            ></textarea>
          </div>
        </div>

        {/* SECCIÓN 2: BANCO DE LAS 10 PREGUNTAS */}
        <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-10 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600" /> 2. Definir las 10 Preguntas de la Misión
          </h3>

          <div className="space-y-6">
            {preguntas.map((p, index) => (
              <div key={index} className="p-5 bg-slate-50/80 rounded-3xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    Pregunta #{index + 1}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={p.pregunta}
                    onChange={(e) => handlePreguntaChange(index, 'pregunta', e.target.value)}
                    placeholder={`Escribe el enunciado de la pregunta ${index + 1}...`}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-bold text-xs outline-none focus:border-indigo-600 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={p.opcion_1}
                    onChange={(e) => handlePreguntaChange(index, 'opcion_1', e.target.value)}
                    placeholder="Opción 1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs outline-none focus:border-indigo-600"
                  />
                  <input
                    type="text"
                    value={p.opcion_2}
                    onChange={(e) => handlePreguntaChange(index, 'opcion_2', e.target.value)}
                    placeholder="Opción 2"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs outline-none focus:border-indigo-600"
                  />
                  <input
                    type="text"
                    value={p.opcion_3}
                    onChange={(e) => handlePreguntaChange(index, 'opcion_3', e.target.value)}
                    placeholder="Opción 3"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase">Respuesta Correcta (Exacta)</label>
                  <input
                    type="text"
                    value={p.respuesta_correcta}
                    onChange={(e) => handlePreguntaChange(index, 'respuesta_correcta', e.target.value)}
                    placeholder="Debe coincidir exactamente con una de las opciones"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200 text-emerald-900 font-bold text-xs outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2.5"
        >
          <PlusCircle className="w-5 h-5" /> {loading ? 'Publicando Mundo...' : 'Guardar Mundo con sus 10 Preguntas 🚀'}
        </button>

      </form>
    </div>
  );
}