'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

export const WEDDING_AUDIO_ID = 'wedding-audio';
export const WEDDING_AUDIO_SRC = '/audio/canon-in-d.mp3';

/**
 * Inicia la reproducción de la música instrumental con un suave fade-in.
 * Debe invocarse de forma síncrona o directa ante un evento de interacción del usuario (como tocar el sello del sobre).
 */
export function startWeddingMusic(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  const audio = document.getElementById(WEDDING_AUDIO_ID) as HTMLAudioElement | null;
  if (!audio) {
    console.warn('Elemento de audio de boda no encontrado en el DOM');
    return Promise.resolve();
  }

  // Si ya está sonando, no reiniciar
  if (!audio.paused && audio.currentTime > 0) {
    return Promise.resolve();
  }

  // Comenzar con volumen bajo y desvanecer hacia arriba (fade in celestial)
  audio.volume = 0.05;
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    return playPromise
      .then(() => {
        let currentVol = 0.05;
        const targetVol = 0.55;
        const step = 0.05;
        const interval = 120; // ~1.2 segundos para alcanzar 0.55

        const fadeTimer = setInterval(() => {
          if (!audio || audio.paused) {
            clearInterval(fadeTimer);
            return;
          }
          currentVol = Math.min(targetVol, currentVol + step);
          audio.volume = Number(currentVol.toFixed(2));
          if (currentVol >= targetVol) {
            clearInterval(fadeTimer);
          }
        }, interval);
      })
      .catch((err) => {
        console.warn('Reproducción de audio sujeta a interacción del usuario:', err);
      });
  }

  return Promise.resolve();
}

/**
 * Pausa la música de la boda suavemente.
 */
export function pauseWeddingMusic() {
  if (typeof window === 'undefined') return;
  const audio = document.getElementById(WEDDING_AUDIO_ID) as HTMLAudioElement | null;
  if (audio && !audio.paused) {
    audio.pause();
  }
}

interface MusicPlayerProps {
  isEnvelopeOpen?: boolean;
}

export function MusicPlayer({ isEnvelopeOpen = true }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    // Comprobar estado inicial
    if (!audio.paused && audio.currentTime > 0) {
      setIsPlaying(true);
    }

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      if (audio.volume < 0.1) {
        audio.volume = 0.55;
      }
      audio.play().catch((err) => {
        console.warn('Error al reproducir audio:', err);
      });
    }
  };

  return (
    <>
      {/* Elemento de audio HTML5 pre-cargado */}
      <audio
        id={WEDDING_AUDIO_ID}
        ref={audioRef}
        src={WEDDING_AUDIO_SRC}
        preload="auto"
        loop
        className="hidden"
      />

      {/* Control flotante visual de la música */}
      <div
        className={`fixed bottom-5 right-5 z-40 transition-all duration-700 ${
          isEnvelopeOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={toggleMusic}
          type="button"
          aria-label={isPlaying ? 'Pausar música instrumental' : 'Reproducir música instrumental'}
          title={isPlaying ? 'Pausar música: Johann Pachelbel - Canon in D' : 'Reproducir música instrumental'}
          className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-md border shadow-xl transition-all duration-300 cursor-pointer active:scale-95 ${
            isPlaying
              ? 'bg-[#FCF9FD]/95 border-[#9B709E]/50 text-[#5C3759] shadow-[#5C3759]/15 ring-2 ring-[#DFC6E3]/60'
              : 'bg-[#FCF9FD]/90 border-[#AB86B1]/40 text-[#6A5365] hover:border-[#784A67] shadow-md'
          }`}
        >
          {isPlaying ? (
            <>
              {/* Icono de volumen con aura suave */}
              <div className="relative flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-[#784A67] animate-pulse" />
                <span className="absolute -inset-1 rounded-full bg-[#DFC6E3]/40 animate-ping opacity-40 pointer-events-none" />
              </div>

              {/* Ondas / Ecualizador animado */}
              <div className="flex items-end gap-[3px] h-3.5 px-0.5" aria-hidden="true">
                <span
                  className="w-[2.5px] bg-[#9B709E] rounded-full animate-bounce"
                  style={{ height: '70%', animationDuration: '0.8s', animationDelay: '0ms' }}
                />
                <span
                  className="w-[2.5px] bg-[#784A67] rounded-full animate-bounce"
                  style={{ height: '100%', animationDuration: '0.6s', animationDelay: '150ms' }}
                />
                <span
                  className="w-[2.5px] bg-[#9B709E] rounded-full animate-bounce"
                  style={{ height: '40%', animationDuration: '0.9s', animationDelay: '300ms' }}
                />
                <span
                  className="w-[2.5px] bg-[#AB86B1] rounded-full animate-bounce"
                  style={{ height: '85%', animationDuration: '0.7s', animationDelay: '200ms' }}
                />
              </div>

              {/* Texto de la melodía */}
              <div className="flex flex-col text-left">
                <span className="font-serif-luxury text-[11px] font-semibold text-[#5C3759] leading-tight">
                  Canon en Re Mayor
                </span>
                <span className="font-sans-clean text-[9px] text-[#9B709E] tracking-wider uppercase leading-none hidden sm:inline">
                  Instrumental
                </span>
              </div>

              {/* Indicador de pausa al hacer hover */}
              <Pause className="w-3.5 h-3.5 text-[#784A67] ml-0.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </>
          ) : (
            <>
              <div className="relative flex items-center justify-center">
                <VolumeX className="w-4 h-4 text-[#6A5365]" />
              </div>

              <div className="flex flex-col text-left">
                <span className="font-serif-luxury text-[11px] font-medium text-[#6A5365] leading-tight">
                  Música de fondo
                </span>
                <span className="font-sans-clean text-[9px] text-[#9B709E] tracking-wider uppercase leading-none hidden sm:inline">
                  Tocar para escuchar
                </span>
              </div>

              <Play className="w-3.5 h-3.5 text-[#784A67] ml-0.5 fill-[#784A67]/20 group-hover:fill-[#784A67] transition-all" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
