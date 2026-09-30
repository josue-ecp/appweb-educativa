import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundMusic() {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('aventurilandia_music_muted') === 'true';
  });

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.25;
    audio.muted = isMuted;

    const iniciarMusica = async () => {
      if (isMuted || !audio.paused) return;

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        // El navegador puede bloquear el autoplay hasta que exista interacción.
      }
    };

    const primeraInteraccion = () => {
      iniciarMusica();

      window.removeEventListener('click', primeraInteraccion);
      window.removeEventListener('touchstart', primeraInteraccion);
      window.removeEventListener('keydown', primeraInteraccion);
    };

    window.addEventListener('click', primeraInteraccion);
    window.addEventListener('touchstart', primeraInteraccion);
    window.addEventListener('keydown', primeraInteraccion);

    iniciarMusica();

    return () => {
      window.removeEventListener('click', primeraInteraccion);
      window.removeEventListener('touchstart', primeraInteraccion);
      window.removeEventListener('keydown', primeraInteraccion);
    };
  }, [isMuted]);

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isMuted) {
      setIsMuted(false);
      localStorage.setItem('aventurilandia_music_muted', 'false');

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('No se pudo reproducir la música:', error);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      setIsMuted(true);
      localStorage.setItem('aventurilandia_music_muted', 'true');
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/aventurilandia.mp3"
        loop
        preload="auto"
      />

      <button
        onClick={toggleMusic}
        aria-label={isMuted ? 'Activar música' : 'Desactivar música'}
        title={isMuted ? 'Activar música' : 'Desactivar música'}
        className="
          fixed
          bottom-4
          right-4
          z-[9999]
          w-11
          h-11
          sm:w-12
          sm:h-12
          rounded-full
          flex
          items-center
          justify-center
          bg-white/95
          backdrop-blur-sm
          border
          border-slate-200
          shadow-lg
          text-slate-700
          hover:bg-slate-50
          hover:scale-105
          active:scale-95
          transition-all
        "
      >
        {isMuted ? (
          <VolumeX size={20} />
        ) : (
          <Volume2 size={20} />
        )}

        {!isMuted && isPlaying && (
          <span
            className="
              absolute
              -top-1
              -right-1
              w-3
              h-3
              rounded-full
              bg-emerald-500
              border-2
              border-white
              animate-pulse
            "
          />
        )}
      </button>
    </>
  );
}