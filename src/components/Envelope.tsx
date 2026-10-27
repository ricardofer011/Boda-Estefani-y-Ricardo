'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { WaxSeal } from './WaxSeal';
import { Sparkles } from 'lucide-react';
import { VerifiedGuest } from './RsvpForm';
import { FloralPetalsBackground } from './FloralPetalsBackground';

interface EnvelopeProps {
  onOpenComplete: () => void;
  coupleNames: string;
  guest?: VerifiedGuest | null;
}

export function Envelope({ onOpenComplete, coupleNames, guest }: EnvelopeProps) {
  // Estados de animación rápida y fluida
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
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
      // Ignorar si el navegador bloquea audio sin interacción
    }
  };

  // Ráfaga celestial de crucecitas doradas y perla al abrir el sello
  const fireCrossConfetti = () => {
    try {
      const crossPath =
        'M 10 0 L 14 0 L 14 7 L 22 7 L 22 11 L 14 11 L 14 32 L 10 32 L 10 11 L 2 11 L 2 7 L 10 7 Z';

      const crossShape =
        typeof (confetti as unknown as { shapeFromPath?: (opt: { path: string }) => unknown })
          .shapeFromPath === 'function'
          ? (confetti as unknown as { shapeFromPath: (opt: { path: string }) => unknown }).shapeFromPath({
              path: crossPath,
            })
          : null;

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#5C3759', '#784A67', '#9B709E', '#AB86B1', '#DFC6E3', '#D4AF37', '#FFFFFF'],
        ticks: 180,
        gravity: 0.75,
        scalar: 1.25,
        shapes: crossShape ? [crossShape as confetti.Shape] : undefined,
      });

      setTimeout(() => {
        try {
          confetti({
            particleCount: 30,
            spread: 85,
            origin: { y: 0.48, x: 0.5 },
            colors: ['#9B709E', '#DFC6E3', '#DFC088', '#FFFFFF', '#5C3759'],
            ticks: 200,
            gravity: 0.65,
            scalar: 1.05,
            shapes: crossShape ? [crossShape as confetti.Shape] : undefined,
          });
        } catch {
          // ignore
        }
      }, 160);
    } catch {
      // ignore
    }
  };

  // Apertura cinemática
  const handleOpenClick = () => {
    if (stage !== 'idle') return;

    if (isReducedMotion) {
      onOpenComplete();
      return;
    }

    playOpenChime();
    fireCrossConfetti();

    // 1. Desvanecer sello suavemente (0ms)
    setStage('sparkle-seal');

    // 2. Solapa superior se abre en 3D (140ms)
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

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#FAF6FA] select-none overflow-hidden transition-all duration-700 ${
        stage === 'transition-out' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Fondo de papel fino con partículas */}
      <div className="absolute inset-0 paper-texture pointer-events-none opacity-90" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-radial from-transparent via-[#F4EBF5]/50 to-[#E6D4E8]/70 pointer-events-none"
        aria-hidden="true"
      />

      {/* Lluvia poética de pétalos de rosa y florecillas en caída suave */}
      <FloralPetalsBackground className="z-2" />

      {/* Partículas luminosas tenues */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/6 w-2 h-2 rounded-full bg-[#DFC6E3]/60 blur-[1px] animate-pulse" />
        <div
          className="absolute top-1/3 right-1/5 w-3 h-3 rounded-full bg-[#AB86B1]/40 blur-[2px] animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-2.5 h-2.5 rounded-full bg-[#DFC088]/50 blur-[1px] animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-[#9B709E]/50 blur-[1px] animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      {/* Contenedor central */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md flex flex-col items-center">
        {/* Encabezado ceremonial con tipografía de lujo */}
        <div className="text-center mb-5 sm:mb-6 transition-transform duration-500">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FBF5FC] border border-[#AB86B1]/45 mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#9B709E] animate-pulse" />
            <span className="font-serif-luxury text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#784A67] font-semibold">
              Una invitación especial para ti
            </span>
          </div>

          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-[#2A1C28] font-normal tracking-wide royal-text-gradient">
            {coupleNames}
          </h1>
          <div className="h-[1px] w-20 mx-auto mt-2 bg-gradient-to-r from-transparent via-[#9B709E]/60 to-transparent" />
        </div>

        {/* Membrete personalizado si el invitado ingresó con enlace único */}
        {guest && (
          <div className="mb-4 px-4 py-2 rounded-2xl bg-[#FCF9FD] border border-[#AB86B1]/50 shadow-xs text-center animate-fade-in max-w-xs">
            <span className="font-serif-luxury text-[10px] tracking-widest uppercase text-[#784A67] font-semibold block">
              Invitación Reservada Para:
            </span>
            <p className="font-serif-luxury text-sm sm:text-base font-semibold text-[#2A1C28] truncate mt-0.5">
              {guest.full_name}
            </p>
            <span className="inline-block mt-0.5 px-3 py-0.5 rounded-full bg-[#5C3759] text-[#DFC6E3] text-[11px] font-serif-luxury font-semibold shadow-2xs">
              {guest.max_guests === 1 ? '1 Pase Reservado' : `${guest.max_guests} Pases Reservados`}
            </span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ESTRUCTURA DEL SOBRE TOTALMENTE CERRADO Y PERFECTAMENTE SIMÉTRICO */}
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
          {/* Sombra de contacto realista en la superficie */}
          <div
            className="absolute inset-x-6 -bottom-5 h-8 bg-[#5C3759]/25 blur-lg rounded-full pointer-events-none transition-all duration-500"
            style={{
              transform: isCardEmerging ? 'scale(1.15) translateY(10px)' : 'scale(1)',
              opacity: isCardEmerging ? 0.35 : 0.2,
            }}
            aria-hidden="true"
          />

          {/* CUERPO PRINCIPAL DEL SOBRE (Base de papel fino marfil con forro lila de lujo) */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#FCF9FD] to-[#F1E5F3] border border-[#AB86B1]/50 shadow-2xl overflow-hidden pointer-events-none">
            {/* Forro interior floral lila/malva visible cuando la solapa se abre (idéntico al de la foto física) */}
            <div
              className={`absolute inset-2 rounded-lg bg-gradient-to-br from-[#9B709E] via-[#8E5E91] to-[#784A67] border border-[#DFC088]/40 flex items-center justify-center transition-opacity duration-300 ${
                isFlapOpen ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(223, 192, 136, 0.18) 1.5px, transparent 1.5px)`,
                backgroundSize: '16px 16px',
              }}
            >
              <div className="w-16 h-16 rounded-full border border-[#DFC088]/50 flex items-center justify-center opacity-60">
                <span className="font-serif-luxury text-2xl text-[#FAF6FA] font-light tracking-widest drop-shadow-xs">
                  R&E
                </span>
              </div>
            </div>
          </div>

          {/* TARJETA INTERIOR (100% oculta cuando el sobre está cerrado) */}
          <div
            className={`absolute inset-x-3.5 bottom-2.5 h-[195px] sm:h-[240px] rounded-lg bg-[#FCF9FD] border border-[#AB86B1]/50 shadow-xl p-4 transition-all duration-500 ease-out card-paper-texture pointer-events-none ${
              isCardEmerging
                ? '-translate-y-36 sm:-translate-y-48 scale-105 z-35 opacity-100 shadow-2xl'
                : 'translate-y-4 opacity-0 z-10'
            }`}
          >
            {/* Filo con detalles de orfebrería */}
            <div className="w-full h-full border border-[#AB86B1]/35 rounded-md flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
              {isCardEmerging && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none animate-shimmer"
                  style={{ transform: 'skewX(-20deg)' }}
                />
              )}

              <span className="text-[#784A67] text-[10px] font-serif-luxury tracking-[0.25em] uppercase mb-1 font-semibold">
                Nuestra Boda Católica
              </span>
              <p className="font-serif-luxury text-lg sm:text-xl text-[#2A1C28] font-medium royal-text-gradient leading-tight">
                Ricardo Fernandez
              </p>
              <span className="font-script-romantic text-xl text-[#9B709E] block my-0.5">&</span>
              <p className="font-serif-luxury text-lg sm:text-xl text-[#2A1C28] font-medium royal-text-gradient leading-tight">
                Estefani Cedeño
              </p>
              <div className="w-10 h-[1px] bg-[#9B709E]/50 my-1.5" />
              <p className="font-sans-clean text-[10px] sm:text-xs text-[#6A5365] tracking-widest uppercase">
                12 • Diciembre • 2026 • 11:00 a. m.
              </p>
              <p className="font-serif-luxury text-[11px] text-[#784A67] mt-1 font-medium">
                Iglesia Las Mercedes • Santo Domingo
              </p>
            </div>
          </div>

          {/* SOLAPAS DEL SOBRE CERRADO: GEOMETRÍA SIMÉTRICA DE 4 PUNTOS */}
          {/* 1. Solapa Izquierda */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              clipPath: 'polygon(0% 0%, 51% 50%, 0% 100%)',
              background: 'linear-gradient(to right, #EDE0EF, #FAF5FB)',
              borderLeft: '1px solid rgba(171, 134, 177, 0.4)',
            }}
          />

          {/* 2. Solapa Derecha */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              clipPath: 'polygon(100% 0%, 49% 50%, 100% 100%)',
              background: 'linear-gradient(to left, #EDE0EF, #FAF5FB)',
              borderRight: '1px solid rgba(171, 134, 177, 0.4)',
            }}
          />

          {/* 3. Solapa Inferior */}
          <div
            className="absolute inset-0 z-21 pointer-events-none"
            style={{
              clipPath: 'polygon(0% 100%, 50% 48%, 100% 100%)',
              background: 'linear-gradient(to top, #E8D8EC, #FAF5FB)',
              filter: 'drop-shadow(0 -3px 6px rgba(92, 55, 89, 0.08))',
            }}
          />

          {/* 4. Solapa Superior Triangular (Se abre en 3D hacia arriba) */}
          <div
            className="absolute inset-x-0 top-0 h-[112px] sm:h-[135px] transition-transform duration-500 ease-in-out pointer-events-none"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              background: isFlapOpen
                ? 'linear-gradient(to bottom, #9B709E, #804F83)'
                : 'linear-gradient(to bottom, #FAF5FB, #EADCEE)',
              transformOrigin: 'top center',
              transform: isFlapOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
              zIndex: isFlapOpen ? 5 : 25,
              borderTop: isFlapOpen ? '1.5px solid rgba(223, 192, 136, 0.6)' : '1px solid rgba(171, 134, 177, 0.5)',
              filter: isFlapOpen ? 'none' : 'drop-shadow(0 4px 8px rgba(92, 55, 89, 0.15))',
            }}
          />

          {/* ================================================================== */}
          {/* SELLO DE CERA ARTESANAL: EN EL CENTRO EXACTO                      */}
          {/* ================================================================== */}
          <div
            className="absolute left-1/2 top-1/2 z-40 transition-all duration-300 ease-out flex items-center justify-center pointer-events-auto cursor-pointer"
            style={{
              transform: `translate(-50%, -50%) ${stage !== 'idle' ? 'scale(1.1) opacity(0)' : 'scale(1)'}`,
            }}
            onClick={handleOpenClick}
            role="button"
            tabIndex={0}
            title="Toca el sello para abrir la invitación"
          >
            <WaxSeal size={92} isBroken={stage !== 'idle'} onClick={handleOpenClick} />
          </div>
        </div>

        {/* ==================================================================== */}
        {/* INDICACIÓN SENCILLA Y ENLACE DE ACCESIBILIDAD                        */}
        {/* ==================================================================== */}
        <div className="mt-6 sm:mt-7 flex flex-col items-center gap-2.5 w-full">
          <div
            onClick={handleOpenClick}
            role="button"
            tabIndex={0}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FBF5FC]/90 border border-[#AB86B1]/45 shadow-xs cursor-pointer hover:bg-[#FBF5FC] active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9B709E] animate-pulse" />
            <span className="font-serif-luxury text-xs sm:text-sm tracking-[0.2em] uppercase text-[#5C3759] font-semibold">
              Toca el sello para abrir
            </span>
          </div>

          <button
            onClick={onOpenComplete}
            className="text-[11px] font-sans-clean text-[#784A67] hover:text-[#5C3759] tracking-wider underline underline-offset-4 decoration-[#9B709E]/40 hover:decoration-[#5C3759] transition-colors cursor-pointer pt-1"
          >
            Saltar animación y ver invitación directamente
          </button>
        </div>
      </div>
    </div>
  );
}
