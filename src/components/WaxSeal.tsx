import React from 'react';

interface WaxSealProps {
  className?: string;
  size?: number; // en px, default 82
  initials?: string;
  onClick?: () => void;
  isBroken?: boolean;
}

export function WaxSeal({
  className = '',
  size = 82,
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
          : 'opacity-100 scale-100 hover:scale-108 active:scale-95'
      } ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* 1. Halo áureo pulsante que invita a interactuar con el sello */}
      <div
        className="absolute -inset-3 rounded-full bg-gradient-to-tr from-[#D4AF37]/35 via-[#F7E7B4]/45 to-[#B89355]/30 blur-md opacity-85 group-hover:opacity-100 group-hover:scale-115 transition-all duration-500 animate-pulse pointer-events-none"
        aria-hidden="true"
      />

      {/* 2. Sombra de contacto 3D realista sobre el sobre */}
      <div
        className="absolute inset-0 rounded-full blur-[6px] bg-[#2A2118]/45 translate-y-1.5 scale-105 pointer-events-none"
        aria-hidden="true"
      />

      {/* 3. Borde orgánico exterior de cera derretida artesanal en oro antiguo */}
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #FFF3D1 0%, #E8C172 25%, #C29343 55%, #8C5E20 85%, #664112 100%)',
          boxShadow: `
            inset 0 2px 4px rgba(255, 255, 255, 0.75),
            inset 0 -2px 4px rgba(60, 40, 10, 0.5),
            0 8px 24px rgba(42, 33, 24, 0.35)
          `,
          border: '1.5px solid rgba(255, 245, 210, 0.8)',
        }}
      >
        {/* Destello sutil de brillo en la cera líquida */}
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 to-transparent rounded-full pointer-events-none"
          style={{ transform: 'rotate(25deg)' }}
        />

        {/* 4. Moneda interior grabada en matriz de orfebrería */}
        <div
          className="w-[82%] h-[82%] rounded-full flex flex-col items-center justify-center relative p-1"
          style={{
            background: 'radial-gradient(circle at 38% 34%, #E9C679 0%, #C99C51 45%, #9E702D 90%, #7A531C 100%)',
            boxShadow: `
              inset 0 2px 4px rgba(50, 30, 8, 0.4),
              0 1px 2px rgba(255, 255, 255, 0.5)
            `,
            border: '1.2px dashed rgba(255, 248, 220, 0.65)',
          }}
        >
          {/* Pequeña cruz sacra en la parte superior (Boda Católica) */}
          <span
            className="text-[10px] leading-none text-[#3B290E] select-none -mb-0.5"
            style={{
              textShadow: '0 1px 1px rgba(255, 255, 255, 0.65), 0 -1px 1px rgba(0, 0, 0, 0.4)',
            }}
          >
            ✝
          </span>

          {/* Monograma real E & R en relieve */}
          <span
            className="font-serif-luxury font-bold tracking-wider text-center select-none leading-none my-0.5"
            style={{
              fontSize: `${size * 0.23}px`,
              color: '#3B290E',
              textShadow: '0 1px 1px rgba(255, 255, 255, 0.7), 0 -1px 1px rgba(0, 0, 0, 0.45)',
              letterSpacing: '0.08em',
            }}
          >
            {initials}
          </span>

          {/* Adorno botánico de laurel tallado en la base */}
          <span
            className="text-[8px] leading-none text-[#5A3F14] select-none opacity-85"
            style={{
              textShadow: '0 1px 1px rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.15em',
            }}
          >
            ❦ ❦ ❦
          </span>
        </div>
      </div>
    </button>
  );
}
