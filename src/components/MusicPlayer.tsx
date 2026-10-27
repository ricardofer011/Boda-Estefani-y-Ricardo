'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Arpegio romántico clásico (acordes inspirados en Canon en Re Mayor)
  // Frecuencias en Hz: Re, La, Si, Fa#, Sol, Re, Sol, La
  const chordFrequencies = [
    [293.66, 369.99, 440.0, 587.33], // D Mayor
    [220.0, 277.18, 329.63, 440.0],  // A Mayor
    [246.94, 293.66, 369.99, 493.88], // B menor
    [185.0, 220.0, 277.18, 369.99],  // F# menor
    [196.0, 246.94, 293.66, 392.0],  // G Mayor
    [146.83, 220.0, 293.66, 369.99], // D Mayor
    [196.0, 246.94, 293.66, 392.0],  // G Mayor
    [220.0, 277.18, 329.63, 440.0],  // A Mayor
  ];

  const playRomanticNote = (ctx: AudioContext, freq: number, startTime: number, duration: number) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Filtro suave acústico
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, startTime);

      // Envolvente acústica tipo arpa/caja de música
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.035, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn('Audio playback note skipped:', e);
    }
  };

  const startSynthesizedMelody = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    isPlayingRef.current = true;
    let chordIndex = 0;

    const playLoop = () => {
      if (!isPlayingRef.current || !ctx) return;

      const chord = chordFrequencies[chordIndex % chordFrequencies.length];
      const now = ctx.currentTime;

      // Reproducir notas en arpegio ascendente suave
      chord.forEach((freq, i) => {
        playRomanticNote(ctx, freq, now + i * 0.45, 2.2);
      });

      chordIndex++;
      timerRef.current = setTimeout(playLoop, 2100);
    };

    playLoop();
  };

  const stopSynthesizedMelody = () => {
    isPlayingRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      audioContextRef.current.suspend();
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopSynthesizedMelody();
      setIsPlaying(false);
    } else {
      startSynthesizedMelody();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      stopSynthesizedMelody();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Pausar música instrumental' : 'Reproducir música instrumental'}
        title={isPlaying ? 'Pausar música' : 'Reproducir música instrumental de fondo'}
        className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#FCF9FD]/90 backdrop-blur-md border border-[#AB86B1]/45 shadow-lg text-[#2A1C28] hover:border-[#784A67] transition-all cursor-pointer active:scale-95"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-[#9B709E] animate-pulse" />
            <div className="flex items-end gap-[2px] h-3">
              <span className="w-0.5 h-3 bg-[#9B709E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-2 bg-[#9B709E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-3 bg-[#9B709E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="font-serif-luxury text-xs text-[#5C3759] font-medium hidden sm:inline">
              Música activada
            </span>
          </>
        ) : (
          <>
            <Music className="w-4 h-4 text-[#784A67]" />
            <span className="font-serif-luxury text-xs text-[#6A5365] font-medium hidden sm:inline">
              Música ambiental
            </span>
            <VolumeX className="w-3.5 h-3.5 text-[#6A5365] sm:hidden" />
          </>
        )}
      </button>
    </div>
  );
}
