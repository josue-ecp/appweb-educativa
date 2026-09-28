import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sumarEstrellas, desbloquearTrofeoAPI } from '../services/api';
import { playSuccessSound, playErrorSound, playWinSound } from '../services/sound';

const questionsData = {
  matematicas: [
    { q: '¿Cuánto es 3 + 4?', options: ['5', '7', '8', '6'], correct: 1 },
    { q: 'Si tengo 5 manzanas y me comes 2, ¿cuántas quedan?', options: ['2', '4', '3', '1'], correct: 2 },
    { q: '¿Cuánto es 2 x 4?', options: ['6', '8', '10', '7'], correct: 1 },
    { q: '¿Qué número va después del 9?', options: ['8', '11', '10', '12'], correct: 2 },
    { q: '¿Cuánto es 10 - 5?', options: ['3', '5', '6', '2'], correct: 1 },
    { q: 'Si tengo 2 bolsas con 3 caramelos cada una, ¿cuántos tengo en total?', options: ['5', '6', '7', '4'], correct: 1 },
    { q: '¿Cuál es el resultado de 15 + 5?', options: ['18', '20', '22', '25'], correct: 1 },
    { q: '¿Cuántos lados tiene un triángulo?', options: ['4', '3', '5', '6'], correct: 1 },
    { q: '¿Cuánto es 4 x 2?', options: ['6', '7', '8', '9'], correct: 2 },
    { q: 'Si reparte 8 galletas entre 2 amigos por igual, ¿cuántas recibe cada uno?', options: ['3', '5', '4', '2'], correct: 2 }
  ],
  ciencia: [
    { q: '¿Qué planeta es conocido como el planeta rojo?', options: ['Venus', 'Marte', 'Júpiter', 'Saturno'], correct: 1 },
    { q: '¿Qué gas necesitan las plantas para hacer la fotosíntesis?', options: ['Oxígeno', 'Dióxido de carbono', 'Nitrógeno', 'Helio'], correct: 1 },
    { q: '¿Cuál es el animal terrestre más rápido del mundo?', options: ['León', 'Guepardo', 'Caballo', 'Tigre'], correct: 1 },
    { q: '¿De qué color son las hojas de las plantas sanas?', options: ['Rojas', 'Azules', 'Verdes', 'Amarillas'], correct: 2 },
    { q: '¿En qué centro del sistema solar se encuentra el Sol?', options: ['En el centro', 'A la orilla', 'Flotando en el espacio', 'Fuera del sistema'], correct: 0 },
    { q: '¿Cuántos huesos tiene aproximadamente el cuerpo humano adulto?', options: ['100', '206', '350', '500'], correct: 1 },
    { q: '¿Qué animal marino es conocido por ser muy inteligente y amigable?', options: ['Tiburón', 'Delfín', 'Medusa', 'Pulpo'], correct: 1 },
    { q: '¿Cuál es el estado del agua cuando cae en forma de nieve?', options: ['Líquido', 'Gaseoso', 'Sólido', 'Plasma'], correct: 2 },
    { q: '¿Qué órgano del cuerpo humano bombea la sangre?', options: ['Cerebro', 'Pulmón', 'Corazón', 'Estómago'], correct: 2 },
    { q: '¿Cómo se llama el satélite natural de la Tierra?', options: ['El Sol', 'La Luna', 'Marte', 'Estrella Polar'], correct: 1 }
  ],
  espanol: [
    { q: '¿Cuál de las siguientes palabras es un animal?', options: ['Mesa', 'Elefante', 'Rápido', 'Azul'], correct: 1 },
    { q: '¿Cuál de estas letras es una vocal?', options: ['B', 'M', 'E', 'S'], correct: 2 },
    { q: '¿Qué palabra está escrita correctamente?', options: ['Avión', 'Avionn', 'Abion', 'Aviohn'], correct: 0 },
    { q: '¿Cuál es el plural de la palabra "perro"?', options: ['perros', 'perra', 'perrote', 'perritos'], correct: 0 },
    { q: '¿Qué signo se usa al final de una pregunta en español?', options: ['¡ !', '¿ ?', '. .', ', ,'], correct: 1 },
    { q: '¿Cuál de estas palabras indica una acción (verbo)?', options: ['Pelota', 'Saltar', 'Rojo', 'Grande'], correct: 1 },
    { q: '¿Qué palabra rima con "gato"?', options: ['Mesa', 'Pato', 'Libro', 'Casa'], correct: 1 },
    { q: '¿Cómo se le llama a la palabra que nombra a una persona, animal o cosa?', options: ['Verbo', 'Sustantivo', 'Adjetivo', 'Adverbio'], correct: 1 },
    { q: '¿Cuál es el antónimo (lo contrario) de la palabra "feliz"?', options: ['Alegre', 'Triste', 'Contento', 'Rápido'], correct: 1 },
    { q: '¿Qué palabra comienza con la letra "M"?', options: ['Zapato', 'Manzana', 'Estrella', 'Sol'], correct: 1 }
  ]
};

export default function PreguntasView({ subject, onBack, onStar }) {
  const list = questionsData[subject] || questionsData.matematicas;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = list[currentIndex];

  const handleSelect = async (index) => {
    if (selectedOption !== null || isSubmitting) return;
    setSelectedOption(index);

    const correct = index === currentQ.correct;
    setIsCorrect(correct);

    if (correct) {
      playSuccessSound(); // 🎵 Sonido alegre de acierto
      setIsSubmitting(true);
      setScore(s => s + 1);
      await sumarEstrellas(5);
      if (onStar) onStar();
      setIsSubmitting(false);

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      playErrorSound(); // 🎵 Sonido sutil de error
    }
  };

  const nextQuestion = async () => {
    if (isSubmitting) return;
    setSelectedOption(null);
    setIsCorrect(null);

    if (currentIndex + 1 < list.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsSubmitting(true);
      setCompleted(true);
      playWinSound(); // 🎵 Sonido festivo de victoria al terminar

      const savedCompletadas = JSON.parse(localStorage.getItem('materias_completadas') || '{}');
      savedCompletadas[subject] = true;
      localStorage.setItem('materias_completadas', JSON.stringify(savedCompletadas));

      if (subject === 'matematicas') {
        await desbloquearTrofeoAPI('mente_brillante', 25);
      } else if (subject === 'ciencia') {
        await desbloquearTrofeoAPI('cientifico_supremo', 40);
      } else if (subject === 'espanol') {
        await desbloquearTrofeoAPI('maestro_palabras', 40);
      }

      setIsSubmitting(false);
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.4 }
      });
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setCompleted(false);
    setIsSubmitting(false);
  };

  if (completed) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center my-auto h-full space-y-6 max-w-md mx-auto animate-fadeIn">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-5xl shadow-inner border-4 border-amber-300 animate-bounce">
          🏆
        </div>
        <h2 className="text-3xl font-black text-slate-800">¡Misión Cumplida!</h2>
        <p className="text-slate-600 font-medium text-sm md:text-base">
          Has completado todas las misiones de este mundo. ¡Tu insignia y tu trofeo ya están activados!
        </p>
        <div className="bg-amber-50 border-2 border-amber-200 px-8 py-4 rounded-3xl w-full shadow-sm">
          <p className="text-xs font-black text-amber-800 uppercase tracking-wider mb-1">Puntuación Final</p>
          <p className="text-3xl font-black text-amber-600">{score} / {list.length} Correctas</p>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={handleRetry}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Reintentar Reto y Mejorar Puntaje 🔄
          </button>

          <button
            onClick={onBack}
            className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 text-sm cursor-pointer"
          >
            Volver al Mapa de Aventura 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 flex flex-col h-full space-y-6 max-w-2xl mx-auto w-full animate-fadeIn transition-all duration-300">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors shadow-sm flex items-center gap-2 text-xs md:text-sm font-bold cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <span className="text-xs md:text-sm font-black bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
          Misión {currentIndex + 1} de {list.length}
        </span>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-[-10px] bottom-[-10px] text-7xl opacity-10 pointer-events-none">✨</div>
        <h3 className="text-lg md:text-2xl font-black leading-snug relative z-10">{currentQ.q}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 flex-1">
        {currentQ.options.map((opt, idx) => {
          let btnStyle = "bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50";
          
          if (selectedOption !== null) {
            if (idx === currentQ.correct) {
              btnStyle = "bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]";
            } else if (idx === selectedOption) {
              btnStyle = "bg-rose-500 border-rose-600 text-white shadow-lg shadow-rose-500/20 scale-[1.02]";
            } else {
              btnStyle = "bg-slate-50 border-slate-200 text-slate-300 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              disabled={selectedOption !== null || isSubmitting}
              onClick={() => handleSelect(idx)}
              className={`p-4 md:p-5 rounded-2xl border-2 font-black text-sm md:text-base text-left transition-all duration-300 flex items-center justify-between shadow-sm transform hover:-translate-y-0.5 active:scale-95 cursor-pointer disabled:cursor-not-allowed ${btnStyle}`}
            >
              <span>{opt}</span>
              {selectedOption !== null && idx === currentQ.correct && (
                <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 animate-bounce" />
              )}
              {selectedOption !== null && idx === selectedOption && idx !== currentQ.correct && (
                <XCircle className="w-6 h-6 text-white flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {selectedOption !== null && (
        <button
          onClick={nextQuestion}
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-orange-950 font-black rounded-2xl shadow-lg shadow-orange-500/20 transition-all transform hover:scale-[1.01] active:scale-95 animate-bounce text-base cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Guardando progreso...
            </>
          ) : (
            currentIndex + 1 < list.length ? 'Siguiente Misión 🚀' : 'Ver Resultados 🏆'
          )}
        </button>
      )}
    </div>
  );
}