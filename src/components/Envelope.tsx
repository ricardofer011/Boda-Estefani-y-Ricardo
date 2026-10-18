'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { WaxSeal } from './WaxSeal';
import { Sparkles } from 'lucide-react';

interface EnvelopeProps {
  onOpenComplete: () => void;
  coupleNames: string;
}

export function Envelope({ onOpenComplete, coupleNames }: EnvelopeProps) {
  // Estados de animación rápida y fluida:
  // 'idle' | 'sparkle-seal' | 'opening-flap' | 'rising-card' | 'transition-out'
  const [stage, setStage] = useState<
    'idle' | 'sparkle-seal' | 'opening-flap' | 'rising-card' | 'transition-out'
  >('idle');

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsReducedMotion(true);
    }
  }, []);

  // Efecto 3D de inclinación interactiva con el movimiento del ratón
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stage !== 'idle' || isReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / (rect.height / 2)) * 6,
      y: (x / (rect.width / 2)) * 6,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Sonido suave de arpa celestial
  const playOpenChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const notes = [587.33, 739.99, 880.0, 1174.66];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.03, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.0);
      });
    } catch {
      // Ignorar si el navegador bloquea audio
    }
  };

  // Animación rápida, dinámica y elegante (1.2 segundos total)
  const handleOpenClick = () => {
    if (stage !== 'idle') return;

    if (isReducedMotion) {
      onOpenComplete();
      return;
    }

    playOpenChime();

    // Ráfaga de confeti dorado desde el centro
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#D4AF37', '#EED99E', '#B89355', '#FFFFFF'],
        ticks: 150,
        gravity: 0.9,
        scalar: 0.85,
      });
    } catch {
      // Ignorar
    }

    // 1. Sello y cinta se desvanecen inmediatamente
    setStage('sparkle-seal');

    // 2. La solapa superior se abre en 3D (140ms)
    setTimeout(() => {
      setStage('opening-flap');
    }, 140);

    // 3. La tarjeta asciende hacia la luz (340ms)
    setTimeout(() => {
      setStage('rising-card');
    }, 340);

    // 4. Transición fluida al contenido completo (800ms)
    setTimeout(() => {
      setStage('transition-out');
    }, 800);

    // 5. Finalizar (1200ms)
    setTimeout(() => {
      onOpenComplete();
    }, 1200);
  };

  const isFlapOpen = stage === 'opening-flap' || stage === 'rising-card' || stage === 'transition-out';
  const isCardEmerging = stage === 'rising-card' || stage === 'transition-out';
  const isRibbonGone = stage !== 'idle';

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#FAF7F2] select-none overflow-hidden transition-all duration-700 ${
        stage === 'transition-out' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Fondo de papel fino con partículas y destellos */}
      <div className="absolute inset-0 paper-texture pointer-events-none opacity-90" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-radial from-transparent via-[#EDE4D4]/50 to-[#DFD3BF]/70 pointer-events-none"
        aria-hidden="true"
      />

      {/* Partículas luminosas tenues */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/6 w-2 h-2 rounded-full bg-[#DFC088]/40 blur-[1px] animate-pulse" />
        <div className="absolute top-1/3 right-1/5 w-3 h-3 rounded-full bg-[#B89355]/30 blur-[2px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-2.5 h-2.5 rounded-full bg-[#EED99E]/40 blur-[1px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-[#DFC088]/40 blur-[1px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Contenedor central */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md flex flex-col items-center">
        {/* Encabezado ceremonial con tipografía de lujo */}
        <div className="text-center mb-5 sm:mb-7 transition-transform duration-500">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#DFC088]/50 mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B89355] animate-pulse" />
            <span className="font-serif-luxury text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#8C6A35] font-semibold">
              Una invitación especial para ti
            </span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#2A2118] font-normal tracking-wide gold-text-gradient">
            {coupleNames}
          </h1>
          <div className="h-[1px] w-20 mx-auto mt-2 bg-gradient-to-r from-transparent via-[#B89355]/60 to-transparent" />
        </div>

        {/* ==================================================================== */}
        {/* ESTRUCTURA DEL SOBRE TOTALMENTE CERRADO Y REALISTA */}
        {/* ==================================================================== */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-[320px] h-[215px] sm:w-[390px] sm:h-[260px]"
          style={{
            perspective: '1400px',
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: stage === 'idle' ? 'transform 0.15s ease-out' : 'transform 0.5s ease-in-out',
          }}
        >
          {/* Sombra de contacto suave en la superficie */}
          <div
            className="absolute inset-x-6 -bottom-5 h-8 bg-[#2A2118]/25 blur-lg rounded-full pointer-events-none transition-all duration-500"
            style={{
              transform: isCardEmerging ? 'scale(1.15) translateY(10px)' : 'scale(1)',
              opacity: isCardEmerging ? 0.35 : 0.2,
            }}
            aria-hidden="true"
          />

          {/* CUERPO PRINCIPAL DEL SOBRE (Base sólida de papel marfil) */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#FBF8F2] to-[#EFE7D8] border border-[#DFC088]/60 shadow-2xl overflow-hidden pointer-events-none">
            {/* Forro interior dorado visible solo cuando la solapa se abre */}
            <div
              className={`absolute inset-2 rounded-lg bg-[#FCFAF6] border border-[#DFC088]/40 flex items-center justify-center transition-opacity duration-300 ${
                isFlapOpen ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(184, 147, 85, 0.08) 2px, transparent 2px)`,
                backgroundSize: '16px 16px',
              }}
            >
              <div className="w-16 h-16 rounded-full border border-[#DFC088]/40 flex items-center justify-center opacity-30">
                <span className="font-serif-luxury text-2xl text-[#8C6A35] font-light tracking-widest">
                  E&R
                </span>
              </div>
            </div>
          </div>

          {/* TARJETA INTERIOR (100% oculta cuando el sobre está cerrado) */}
          <div
            className={`absolute inset-x-3.5 bottom-2.5 h-[195px] sm:h-[240px] rounded-lg bg-[#FCFAF6] border border-[#B89355]/50 shadow-xl p-4 transition-all duration-500 ease-out card-paper-texture pointer-events-none ${
              isCardEmerging
                ? '-translate-y-36 sm:-translate-y-48 scale-105 z-35 opacity-100 shadow-2xl'
                : 'translate-y-4 opacity-0 z-10'
            }`}
          >
            {/* Filo dorado doble */}
            <div className="w-full h-full border border-[#B89355]/30 rounded-md flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
              {isCardEmerging && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none animate-shimmer"
                  style={{ transform: 'skewX(-20deg)' }}
                />
              )}

              <span className="text-[#8C6A35] text-[10px] font-serif-luxury tracking-[0.25em] uppercase mb-1 font-semibold">
                Nuestra Boda Católica
              </span>
              <p className="font-serif-luxury text-xl sm:text-2xl text-[#2A2118] font-normal gold-text-gradient leading-tight">
                Estefani & Ricardo
              </p>
              <div className="w-10 h-[1px] bg-[#B89355]/60 my-2" />
              <p className="font-sans-clean text-[10px] sm:text-xs text-[#6B5B4D] tracking-widest uppercase">
                12 • Diciembre • 2026
              </p>
              <p className="font-serif-luxury text-[11px] text-[#8C6A35] mt-1">
                Iglesia Las Mercedes • Santo Domingo
              </p>
            </div>
          </div>

          {/* BOLSILLO DELANTERO DEL SOBRE (Cubre de forma sólida y continua la mitad inferior) */}
          <div
            className="absolute inset-x-0 bottom-0 h-[125px] sm:h-[155px] z-20 pointer-events-none"
            style={{
              clipPath: 'polygon(0% 100%, 0% 0%, 50% 32%, 100% 0%, 100% 100%)',
              background: 'linear-gradient(to top, #E8DFCE, #FAF6EE)',
              borderBottom: '1px solid rgba(184, 147, 85, 0.45)',
              filter: 'drop-shadow(0 -3px 8px rgba(42, 33, 24, 0.08))',
            }}
          />

          {/* CINTA DE SEDA DORADA (Belly Band) */}
          <div
            className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 z-22 transition-all duration-300 ease-in-out pointer-events-none ${
              isRibbonGone
                ? 'opacity-0 scale-x-125 filter blur-xs'
                : 'opacity-100 scale-x-100 shadow-md'
            }`}
            style={{
              background: 'linear-gradient(to bottom, #FAF5EB, #E8DAC2, #FAF5EB)',
              borderTop: '1px solid rgba(184, 147, 85, 0.5)',
              borderBottom: '1px solid rgba(184, 147, 85, 0.5)',
            }}
          >
            <div className="absolute inset-x-0 top-0.5 h-[1px] bg-[#D4AF37]/45" />
            <div className="absolute inset-x-0 bottom-0.5 h-[1px] bg-[#D4AF37]/45" />
          </div>

          {/* SOLAPA SUPERIOR TRIANGULAR QUE SE ABRE EN 3D */}
          <div
            className="absolute inset-x-0 top-0 h-[125px] sm:h-[152px] transition-transform duration-500 ease-in-out pointer-events-none"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              background: isFlapOpen
                ? 'linear-gradient(to bottom, #E8DFCE, #F5EFE4)'
                : 'linear-gradient(to bottom, #FAF6EE, #EFE6D6)',
              transformOrigin: 'top center',
              transform: isFlapOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
              zIndex: isFlapOpen ? 5 : 25,
              borderTop: '1px solid rgba(184, 147, 85, 0.5)',
              filter: isFlapOpen ? 'none' : 'drop-shadow(0 5px 10px rgba(42, 33, 24, 0.12))',
            }}
          />

          {/* ================================================================== */}
          {/* SELLO DE CERA REAL: EN EL MEDIO, ULTRA ELEGANTE, ACTÚA COMO EL BOTÓN */}
          {/* ================================================================== */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-300 ease-out flex items-center justify-center pointer-events-auto"
            style={{
              transform: `translate(-50%, -50%) ${stage !== 'idle' ? 'scale(1.1) opacity(0)' : 'scale(1)'}`,
            }}
          >
            <WaxSeal
              size={82}
              initials="E & R"
              isBroken={stage !== 'idle'}
              onClick={handleOpenClick}
            />
          </div>
        </div>

        {/* ==================================================================== */}
        {/* INDICACIÓN ELEGANTE Y ENLACE DE ACCESIBILIDAD */}
        {/* ==================================================================== */}
        <div className="mt-6 sm:mt-7 flex flex-col items-center gap-2.5 w-full">
          <div
            onClick={handleOpenClick}
            role="button"
            tabIndex={0}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF4E6]/90 border border-[#DFC088]/40 shadow-xs cursor-pointer hover:bg-[#FAF4E6] active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B89355] animate-pulse" />
            <span className="font-serif-luxury text-xs tracking-[0.2em] uppercase text-[#8C6A35] font-semibold">
              Toca el sello para abrir
            </span>
          </div>

          <button
            onClick={onOpenComplete}
            className="text-[11px] font-sans-clean text-[#8C7A6B] hover:text-[#2A2118] tracking-wider underline underline-offset-4 decoration-[#B89355]/30 hover:decoration-[#B89355] transition-colors cursor-pointer pt-1"
          >
            Saltar animación y ver invitación directamente
          </button>
        </div>
      </div>
    </div>
  );
}
