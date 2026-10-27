'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

export const WEDDING_AUDIO_ID = 'wedding-audio';
export const GENERAL_AUDIO_SRC = '/audio/canon-in-d.mp3';
export const BRIDESMAID_AUDIO_SRC = '/audio/damas-nocturne.mp3';

/**
 * Inicia la reproducción de la música instrumental con un suave fade-in.
 * Si se especifica desiredSrc, se asegura de que el elemento de audio apunte a esa melodía.
 */
export function startWeddingMusic(desiredSrc?: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  const audio = document.getElementById(WEDDING_AUDIO_ID) as HTMLAudioElement | null;
  if (!audio) {
    console.warn('Elemento de audio de boda no encontrado en el DOM');
    return Promise.resolve();
  }

  // Si se solicitó una pista específica y no coincide con la actual, actualizar
  if (desiredSrc && !audio.src.endsWith(desiredSrc)) {
    audio.src = desiredSrc;
    audio.load();
  }

  // Si ya está sonando la pista correcta, no reiniciar
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
  isBridesmaid?: boolean;
  audioSrc?: string;
  trackTitle?: string;
  trackSubtitle?: string;
}

export function MusicPlayer({
  isEnvelopeOpen = true,
  isBridesmaid = false,
  audioSrc,
  trackTitle,
  trackSubtitle,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Determinar la pista y títulos según el rol
  const effectiveSrc = audioSrc || (isBridesmaid ? BRIDESMAID_AUDIO_SRC : GENERAL_AUDIO_SRC);
  const effectiveTitle = trackTitle || (isBridesmaid ? 'Nocturno de Chopin' : 'Canon en Re Mayor');
  const effectiveSubtitle = trackSubtitle || (isBridesmaid ? 'Melodía Damas' : 'Instrumental');

  // Actualizar la fuente del audio si cambia dinámicamente
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.src.endsWith(effectiveSrc)) {
      const wasPlaying = !audio.paused;
      audio.src = effectiveSrc;
      audio.load();
      if (wasPlaying) {
        audio.play().catch(() => {});
      }
    }
  }, [effectiveSrc]);

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
        src={effectiveSrc}
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
          aria-label={isPlaying ? `Pausar música: ${effectiveTitle}` : `Reproducir música: ${effectiveTitle}`}
          title={isPlaying ? `Pausar música: ${effectiveTitle}` : `Reproducir música: ${effectiveTitle}`}
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
                  {effectiveTitle}
                </span>
                <span className="font-sans-clean text-[9px] text-[#9B709E] tracking-wider uppercase leading-none hidden sm:inline">
                  {effectiveSubtitle}
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
                  {effectiveTitle}
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
