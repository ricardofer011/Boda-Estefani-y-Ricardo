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
      className={`absolute ${getPositionClass()} pointer-events-none w-8 h-8 text-[#9B709E]/50`}
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

/**
 * Esquinas botánicas con capullos de rosas y hojitas de eucalipto en lila, malva y oro.
 */
export function FloralCornerFlourish({
  position = 'top-left',
  className = '',
}: {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}) {
  const getTransform = () => {
    switch (position) {
      case 'top-right':
        return 'scaleX(-1)';
      case 'bottom-right':
        return 'scale(-1, -1)';
      case 'bottom-left':
        return 'scaleY(-1)';
      default:
        return 'none';
    }
  };

  const getPositionClass = () => {
    switch (position) {
      case 'top-right':
        return 'top-2.5 right-2.5';
      case 'bottom-right':
        return 'bottom-2.5 right-2.5';
      case 'bottom-left':
        return 'bottom-2.5 left-2.5';
      default:
        return 'top-2.5 left-2.5';
    }
  };

  return (
    <div
      className={`absolute ${getPositionClass()} pointer-events-none w-12 h-12 text-[#9B709E]/70 ${className}`}
      style={{ transform: getTransform() }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tallo curvilíneo */}
        <path d="M4,4 C15,4 28,10 38,20 C45,28 50,42 52,56" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M4,4 C4,15 10,28 20,38 C28,45 42,50 56,52" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        
        {/* Capullo de rosa central */}
        <circle cx="14" cy="14" r="4.5" fill="#DFC6E3" fillOpacity="0.85" stroke="#784A67" strokeWidth="1" />
        <path d="M11.5,13.5 C12.5,11.5 15.5,11.5 16.5,13.5 C15.5,16 12.5,16 11.5,13.5 Z" fill="#784A67" />
        
        {/* Hojitas botánicas suaves */}
        <path d="M26,12 C29,8 35,9 36,13 C34,16 29,15 26,12 Z" fill="#AB86B1" fillOpacity="0.85" />
        <path d="M12,26 C8,29 9,35 13,36 C16,34 15,29 12,26 Z" fill="#AB86B1" fillOpacity="0.85" />
        <path d="M40,24 C44,21 49,23 50,27 C47,29 42,28 40,24 Z" fill="#9B709E" fillOpacity="0.75" />
        <path d="M24,40 C21,44 23,49 27,50 C29,47 28,42 24,40 Z" fill="#9B709E" fillOpacity="0.75" />

        {/* Pequeños capullitos dorados en las puntas */}
        <circle cx="53" cy="56" r="2.2" fill="#DFC088" />
        <circle cx="56" cy="53" r="2.2" fill="#DFC088" />
        <circle cx="4" cy="4" r="2" fill="#5C3759" />
      </svg>
    </div>
  );
}
