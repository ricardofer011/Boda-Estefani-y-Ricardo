import React from 'react';

interface WaxSealProps {
  className?: string;
  size?: number; // en px, default 80
  initials?: string;
  onClick?: () => void;
  isBroken?: boolean;
}

export function WaxSeal({
  className = '',
  size = 80,
  initials = 'E & R',
  onClick,
  isBroken = false,
}: WaxSealProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Tocar el sello para abrir la invitación de Estefani y Ricardo"
      className={`relative inline-flex items-center justify-center select-none cursor-pointer group focus:outline-hidden transition-all duration-300 ${
        isBroken
          ? 'opacity-0 scale-110 pointer-events-none filter blur-xs'
          : 'opacity-100 scale-100 hover:scale-106 active:scale-95'
      } ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* 1. Halo áureo sutil y elegante al interactuar */}
      <div
        className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 via-[#F7E7B4]/40 to-[#B89355]/25 blur-md opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 animate-pulse pointer-events-none"
        aria-hidden="true"
      />

      {/* 2. Sombra de contacto suave sobre el papel del sobre */}
      <div
        className="absolute inset-0 rounded-full blur-[5px] bg-[#2A2118]/40 translate-y-1 scale-105 pointer-events-none"
        aria-hidden="true"
      />

      {/* 3. Medallón de cera artesanal en oro noble pulido */}
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #FFF2CF 0%, #E7C273 28%, #BF8F3D 68%, #875C1D 100%)',
          boxShadow: `
            inset 0 2px 4px rgba(255, 255, 255, 0.75),
            inset 0 -2px 4px rgba(60, 40, 10, 0.4),
            0 8px 20px rgba(42, 33, 24, 0.3)
          `,
          border: '1.5px solid rgba(255, 245, 210, 0.75)',
        }}
      >
        {/* Reflejo de luz diagonal fino */}
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/25 to-transparent rounded-full pointer-events-none"
          style={{ transform: 'rotate(25deg)' }}
        />

        {/* 4. Disco interior rehundido con anillo concéntrico de joyería */}
        <div
          className="w-[80%] h-[80%] rounded-full flex flex-col items-center justify-center relative p-1"
          style={{
            background: 'radial-gradient(circle at 38% 34%, #E9C679 0%, #C89B4F 45%, #9E702D 90%, #7A531C 100%)',
            boxShadow: `
              inset 0 1.5px 3px rgba(50, 30, 8, 0.35),
              0 1px 2px rgba(255, 255, 255, 0.5)
            `,
            border: '1px solid rgba(255, 248, 220, 0.7)',
          }}
        >
          {/* Anillo interior fino para elegancia clásica */}
          <div className="absolute inset-1 rounded-full border border-dashed border-[#FDF2D0]/50 pointer-events-none" />

          {/* Monograma real E & R en relieve dorado nítido */}
          <span
            className="font-serif-luxury font-bold tracking-widest text-center select-none leading-none z-10"
            style={{
              fontSize: `${size * 0.27}px`,
              color: '#3B290E',
              textShadow: '0 1px 1px rgba(255, 255, 255, 0.7), 0 -1px 1px rgba(0, 0, 0, 0.4)',
              letterSpacing: '0.12em',
            }}
          >
            {initials}
          </span>

          {/* Pequeño diamante noble en la base */}
          <span
            className="text-[7px] leading-none text-[#5A3F14] select-none opacity-75 mt-1 z-10"
            style={{
              textShadow: '0 1px 1px rgba(255, 255, 255, 0.5)',
            }}
          >
            ◆
          </span>
        </div>
      </div>
    </button>
  );
}
