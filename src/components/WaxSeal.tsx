import React from 'react';

interface WaxSealProps {
  className?: string;
  size?: number; // en px, default 76
  initials?: string;
  onClick?: () => void;
  isBroken?: boolean;
}

export function WaxSeal({
  className = '',
  size = 76,
  initials = 'E & R',
  onClick,
  isBroken = false,
}: WaxSealProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label="Sello de cera artesanal de Estefani y Ricardo"
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative inline-flex items-center justify-center select-none transition-all duration-500 cursor-pointer overflow-visible ${
        isBroken ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100 hover:scale-105 active:scale-95'
      } ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* 1. Sombra suave circular para relieve 3D realista sin cortes */}
      <div
        className="absolute inset-0 rounded-full blur-[5px] bg-[#2A2118]/25 scale-105 pointer-events-none"
        aria-hidden="true"
      />

      {/* 2. Cuerpo orgánico exterior de cera vertida líquida solidificada */}
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #F5DE9B 0%, #DBAE5E 35%, #B5843A 75%, #946927 100%)',
          boxShadow: `
            inset 0 2px 3px rgba(255, 255, 255, 0.65),
            inset 0 -2px 3px rgba(120, 80, 20, 0.35),
            0 6px 16px rgba(42, 33, 24, 0.28)
          `,
          border: '1.5px solid rgba(255, 240, 190, 0.7)',
        }}
      >
        {/* 3. Borde acanalado tallado en la matriz metálica del sello */}
        <div
          className="w-[82%] h-[82%] rounded-full flex items-center justify-center relative"
          style={{
            background: 'radial-gradient(circle at 38% 34%, #E4C074 0%, #C4974C 45%, #9E702D 100%)',
            boxShadow: `
              inset 0 1.5px 3px rgba(0, 0, 0, 0.25),
              0 1px 2px rgba(255, 255, 255, 0.45)
            `,
            border: '1.2px dashed rgba(255, 245, 210, 0.55)',
          }}
        >
          {/* 4. Iniciales en relieve grabadas en oro antiguo con alta nitidez */}
          <div className="flex items-center justify-center">
            <span
              className="font-serif-luxury font-bold tracking-wider text-center select-none"
              style={{
                fontSize: `${size * 0.26}px`,
                color: '#3B290E',
                textShadow: '0 1px 1px rgba(255, 255, 255, 0.6), 0 -1px 1px rgba(0, 0, 0, 0.35)',
                letterSpacing: '0.08em',
              }}
            >
              {initials}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
