import React from 'react';
import Image from 'next/image';

interface WaxSealProps {
  className?: string;
  size?: number; // en px, default 92
  onClick?: () => void;
  isBroken?: boolean;
}

export function WaxSeal({
  className = '',
  size = 92,
  onClick,
  isBroken = false,
}: WaxSealProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Tocar el sello de cera para abrir la invitación de Estefani y Ricardo"
      className={`relative inline-flex items-center justify-center select-none cursor-pointer group focus:outline-hidden transition-all duration-300 ${
        isBroken
          ? 'opacity-0 scale-110 pointer-events-none filter blur-xs'
          : 'opacity-100 scale-100 hover:scale-106 active:scale-95'
      } ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* 1. Halo áureo sutil y elegante al interactuar */}
      <div
        className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#D4AF37]/35 via-[#F7E7B4]/40 to-[#B89355]/30 blur-md opacity-80 group-hover:opacity-100 group-hover:scale-115 transition-all duration-300 animate-pulse pointer-events-none"
        aria-hidden="true"
      />

      {/* 2. Sello de cera artesanal real con relieve 3D idéntico a la muestra física */}
      <div className="relative w-full h-full drop-shadow-md group-hover:drop-shadow-xl transition-all duration-300">
        <Image
          src="/images/wax-seal.png"
          alt="Sello de cera artesanal de Estefani y Ricardo"
          width={size}
          height={size}
          priority
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-300 group-hover:rotate-1"
        />
      </div>
    </button>
  );
}
