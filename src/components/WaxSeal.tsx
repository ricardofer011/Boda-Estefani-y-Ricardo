import React from 'react';

interface WaxSealProps {
  className?: string;
  size?: number; // en px, default 68
  initials?: string;
  onClick?: () => void;
  isBroken?: boolean;
}

export function WaxSeal({
  className = '',
  size = 68,
  initials = 'E & R',
  onClick,
  isBroken = false,
}: WaxSealProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label="Sello de cera de Estefani y Ricardo"
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative inline-flex items-center justify-center select-none transition-all duration-500 ${
        isBroken ? 'opacity-0 scale-75 filter blur-xs pointer-events-none' : 'opacity-100 scale-100'
      } ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Sombra de profundidad realista */}
      <div
        className="absolute inset-0 rounded-full blur-[3px] bg-[#2A2118]/30 -bottom-1"
        aria-hidden="true"
      />

      {/* Cuerpo principal del sello con cera líquida solidificada y borde orgánico */}
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #E2BE76 0%, #B89355 40%, #87652E 85%, #59421B 100%)',
          boxShadow: `
            inset 0 2px 3px rgba(255, 255, 255, 0.45),
            inset 0 -3px 5px rgba(0, 0, 0, 0.4),
            0 8px 18px rgba(42, 33, 24, 0.35)
          `,
          border: '1.5px solid rgba(240, 215, 150, 0.5)',
        }}
      >
        {/* Anillo concéntrico tallado en el sello */}
        <div
          className="w-[84%] h-[84%] rounded-full flex items-center justify-center"
          style={{
            border: '1.2px dashed rgba(255, 255, 255, 0.4)',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(255, 255, 255, 0.25)',
          }}
        >
          {/* Iniciales grabadas en relieve */}
          <div className="flex flex-col items-center justify-center">
            <span
              className="font-serif-luxury font-semibold tracking-wider text-center"
              style={{
                fontSize: `${size * 0.24}px`,
                color: '#422F11',
                textShadow: '0 1px 1px rgba(255, 255, 255, 0.45), 0 -1px 1px rgba(0, 0, 0, 0.4)',
                letterSpacing: '0.05em',
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
