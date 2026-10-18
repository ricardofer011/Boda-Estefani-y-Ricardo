'use client';

import React, { useState, useEffect } from 'react';
import { WaxSeal } from './WaxSeal';
import { Sparkles, ArrowRight } from 'lucide-react';

interface EnvelopeProps {
  onOpenComplete: () => void;
  coupleNames: string;
}

export function Envelope({ onOpenComplete, coupleNames }: EnvelopeProps) {
  // Estados de animación: 'idle' | 'breaking-seal' | 'opening-flap' | 'sliding-card' | 'revealing-full'
  const [animStage, setAnimStage] = useState<'idle' | 'breaking-seal' | 'opening-flap' | 'sliding-card' | 'revealing-full'>('idle');
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Detectar si el usuario tiene activada la preferencia de reducción de movimiento
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsReducedMotion(true);
    }
  }, []);

  const handleOpenClick = () => {
    if (animStage !== 'idle') return;

    if (isReducedMotion) {
      onOpenComplete();
      return;
    }

    // Paso 1: El sello de cera se desvanece
    setAnimStage('breaking-seal');

    // Paso 2: La solapa superior se abre en 3D
    setTimeout(() => {
      setAnimStage('opening-flap');
    }, 400);

    // Paso 3: La tarjeta emerge del sobre
    setTimeout(() => {
      setAnimStage('sliding-card');
    }, 1000);

    // Paso 4: Transición progresiva al contenido principal completo
    setTimeout(() => {
      setAnimStage('revealing-full');
    }, 1800);

    // Paso 5: Finalizar transición
    setTimeout(() => {
      onOpenComplete();
    }, 2400);
  };

  const handleSkip = () => {
    onOpenComplete();
  };

  const isFlapOpen = animStage === 'opening-flap' || animStage === 'sliding-card' || animStage === 'revealing-full';
  const isCardSliding = animStage === 'sliding-card' || animStage === 'revealing-full';

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#FAF7F2] transition-opacity duration-700 ${
        animStage === 'revealing-full' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Fondo con textura sutil y viñeta delicada */}
      <div
        className="absolute inset-0 paper-texture pointer-events-none opacity-90"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-radial from-transparent via-[#EFE6D8]/40 to-[#E5DAC8]/60 pointer-events-none"
        aria-hidden="true"
      />

      {/* Contenedor central */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md flex flex-col items-center">
        {/* Mensaje superior */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <p className="font-serif-luxury text-xs sm:text-sm tracking-[0.3em] uppercase text-[#8C6A35] font-semibold mb-1">
            Una invitación especial para ti
          </p>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#2A2118] font-normal tracking-wide">
            {coupleNames}
          </h1>
          <div className="h-[1px] w-16 mx-auto mt-2 bg-gradient-to-r from-transparent via-[#B89355]/60 to-transparent" />
        </div>

        {/* ==================================================================== */}
        {/* ESTRUCTURA DEL SOBRE 3D */}
        {/* ==================================================================== */}
        <div
          className="relative w-[300px] h-[200px] sm:w-[380px] sm:h-[250px] cursor-pointer select-none"
          onClick={handleOpenClick}
          role="button"
          tabIndex={0}
          aria-label="Abrir sobre de invitación"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpenClick();
            }
          }}
          style={{ perspective: '1200px' }}
        >
          {/* Sombra suave de profundidad sobre la superficie */}
          <div
            className="absolute inset-x-4 -bottom-4 h-8 bg-[#2A2118]/15 blur-md rounded-full pointer-events-none"
            aria-hidden="true"
          />

          {/* CUERPO TRASERO DEL SOBRE */}
          <div className="absolute inset-0 rounded-lg bg-[#ECE3D4] border border-[#DFC088]/40 shadow-envelope overflow-hidden">
            {/* Forro interior de lujo con filigrana dorada */}
            <div className="absolute inset-2 rounded bg-[#FAF7F2] border border-[#DFC088]/30 flex items-center justify-center">
              <span className="font-serif-luxury text-4xl sm:text-5xl text-[#DFC088]/35 font-light tracking-widest select-none">
                E & R
              </span>
            </div>
          </div>

          {/* TARJETA INTERIOR DESLIZANTE */}
          <div
            className={`absolute inset-x-3 bottom-2 h-[180px] sm:h-[230px] rounded-md bg-[#FCFAF6] border border-[#B89355]/40 shadow-md p-4 transition-all duration-700 ease-out ${
              isCardSliding
                ? '-translate-y-24 sm:-translate-y-36 scale-105 z-30 shadow-2xl'
                : 'translate-y-0 z-10'
            }`}
          >
            {/* Filo dorado doble en la tarjeta */}
            <div className="w-full h-full border border-[#B89355]/25 rounded flex flex-col items-center justify-center p-3 text-center">
              <span className="text-[#B89355] text-xs font-serif-luxury tracking-widest uppercase mb-1">
                Nuestra Boda
              </span>
              <p className="font-serif-luxury text-xl sm:text-2xl text-[#2A2118] font-normal leading-tight">
                Estefani & Ricardo
              </p>
              <div className="w-8 h-[1px] bg-[#B89355]/50 my-1.5" />
              <p className="font-sans-clean text-[10px] sm:text-xs text-[#6B5B4D] tracking-wider">
                12 • DICIEMBRE • 2026
              </p>
            </div>
          </div>

          {/* SOLAPAS LATERALES Y BOLSILLO DELANTERO DEL SOBRE */}
          {/* Triángulo inferior del bolsillo */}
          <div
            className="absolute inset-x-0 bottom-0 h-[120px] sm:h-[150px] z-20 pointer-events-none"
            style={{
              clipPath: 'polygon(0% 100%, 50% 30%, 100% 100%)',
              background: 'linear-gradient(to top, #F0E8DC, #F6F0E6)',
              borderBottom: '1px solid rgba(184, 147, 85, 0.4)',
              boxShadow: '0 -2px 10px rgba(42, 33, 24, 0.05)',
            }}
          />

          {/* Triángulo lateral izquierdo */}
          <div
            className="absolute inset-y-0 left-0 w-[160px] sm:w-[200px] z-20 pointer-events-none"
            style={{
              clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)',
              background: 'linear-gradient(to right, #ECE3D4, #F4ECE0)',
              borderLeft: '1px solid rgba(184, 147, 85, 0.3)',
            }}
          />

          {/* Triángulo lateral derecho */}
          <div
            className="absolute inset-y-0 right-0 w-[160px] sm:w-[200px] z-20 pointer-events-none"
            style={{
              clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)',
              background: 'linear-gradient(to left, #ECE3D4, #F4ECE0)',
              borderRight: '1px solid rgba(184, 147, 85, 0.3)',
            }}
          />

          {/* SOLAPA SUPERIOR TRIANGULAR QUE SE ABRE */}
          <div
            className="absolute inset-x-0 top-0 h-[115px] sm:h-[145px] transition-transform duration-700 ease-in-out pointer-events-none"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              background: isFlapOpen
                ? 'linear-gradient(to bottom, #ECE3D4, #F4ECE0)'
                : 'linear-gradient(to bottom, #F7F1E7, #EDE4D5)',
              transformOrigin: 'top center',
              transform: isFlapOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
              zIndex: isFlapOpen ? 5 : 25,
              borderTop: '1px solid rgba(184, 147, 85, 0.4)',
              boxShadow: isFlapOpen ? 'none' : '0 4px 10px rgba(42, 33, 24, 0.1)',
            }}
          />

          {/* SELLO DE CERA CENTRADO EN LA PUNTA DE LA SOLAPA */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ease-out"
            style={{
              top: '90px',
            }}
          >
            <WaxSeal
              size={64}
              initials="E & R"
              isBroken={animStage !== 'idle'}
              onClick={handleOpenClick}
            />
          </div>
        </div>

        {/* ==================================================================== */}
        {/* BOTONES DE ACCIÓN: ABRIR O SALTAR */}
        {/* ==================================================================== */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center gap-3 w-full">
          <button
            onClick={handleOpenClick}
            disabled={animStage !== 'idle'}
            className="gold-button w-full sm:w-auto px-8 py-3.5 rounded-full font-serif-luxury text-base tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-transform"
          >
            <span>{animStage === 'idle' ? 'Abrir invitación' : 'Abriendo...'}</span>
            <Sparkles className="w-4 h-4 text-amber-200" />
          </button>

          <button
            onClick={handleSkip}
            className="text-xs sm:text-sm font-sans-clean text-[#6B5B4D] hover:text-[#2A2118] tracking-wider underline underline-offset-4 decoration-[#B89355]/40 hover:decoration-[#B89355] transition-colors pt-1 cursor-pointer"
          >
            Saltar animación y ver invitación
          </button>
        </div>
      </div>
    </div>
  );
}
