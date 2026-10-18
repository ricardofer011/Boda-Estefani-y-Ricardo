import React from 'react';

/**
 * Cruz católica sutil y elegante con diseño estilizado y detalles botánicos tenues.
 */
export function CatholicCrossOrnament({ className = 'w-6 h-9 text-[#B89355]' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Poste vertical principal */}
      <line x1="20" y1="4" x2="20" y2="56" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      {/* Travesaño horizontal */}
      <line x1="8" y1="18" x2="32" y2="18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      {/* Detalles en los extremos de la cruz (remates trilobulados/trebol) */}
      <circle cx="20" cy="4" r="2" fill="currentColor" />
      <circle cx="20" cy="56" r="2" fill="currentColor" />
      <circle cx="8" cy="18" r="2" fill="currentColor" />
      <circle cx="32" cy="18" r="2" fill="currentColor" />
      {/* Halo radiante central o cruce ornamental */}
      <circle cx="20" cy="18" r="5" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1.5" />
      {/* Pequeña flor o rombo en el centro */}
      <polygon points="20,15 23,18 20,21 17,18" fill="currentColor" />
    </svg>
  );
}

/**
 * Divisor ornamental dorado clásico con rombo central y ramitas estilizadas.
 */
export function OrnamentalDivider({ className = 'w-full max-w-xs my-4 text-[#B89355]' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-hidden="true">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#B89355]/40 to-[#B89355]" />
      <div className="flex items-center gap-1.5 opacity-80">
        <span className="h-1 w-1 rounded-full bg-[#B89355]" />
        <svg className="w-4 h-4 text-[#B89355]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polygon points="12,2 22,12 12,22 2,12" strokeWidth="1.5" fill="none" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
        <span className="h-1 w-1 rounded-full bg-[#B89355]" />
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#B89355]/40 to-[#B89355]" />
    </div>
  );
}

/**
 * Esquinas ornamentadas en filigrana dorada para bordes de tarjetas tradicionales de boda.
 */
export function CardCornerFlourish({ position = 'top-left' }: { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const getTransform = () => {
    switch (position) {
      case 'top-right':
        return 'rotate(90deg)';
      case 'bottom-right':
        return 'rotate(180deg)';
      case 'bottom-left':
        return 'rotate(270deg)';
      default:
        return 'none';
    }
  };

  const getPositionClass = () => {
    switch (position) {
      case 'top-right':
        return 'top-2 right-2';
      case 'bottom-right':
        return 'bottom-2 right-2';
      case 'bottom-left':
        return 'bottom-2 left-2';
      default:
        return 'top-2 left-2';
    }
  };

  return (
    <div
      className={`absolute ${getPositionClass()} pointer-events-none w-8 h-8 text-[#B89355]/50`}
      style={{ transform: getTransform() }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M2,20 C2,6 6,2 20,2" />
        <path d="M5,20 C5,9 9,5 20,5" strokeDasharray="1 2" />
        <circle cx="6" cy="6" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}
