import React from 'react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { Sparkles, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { OrnamentalDivider } from './Ornaments';

/**
 * Icono estilizado de pajarita / lazo formal para caballeros
 */
function BowtieIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 7L10 11.5L3 16V7Z"
        fill="currentColor"
        fillOpacity="0.85"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M21 7L14 11.5L21 16V7Z"
        fill="currentColor"
        fillOpacity="0.85"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11.5" r="2.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/**
 * Icono estilizado de vestido largo de gala para damas
 */
function EveningDressIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Tirantes y escote elegante */}
      <path
        d="M8 3L9.5 7H14.5L16 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Silueta del vestido largo */}
      <path
        d="M9.5 7C9.5 7 8.5 10 9 12C9.5 14 6 21 6 21H18C18 21 14.5 14 15 12C15.5 10 14.5 7 14.5 7H9.5Z"
        fill="currentColor"
        fillOpacity="0.85"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Cinturón o detalle sutil en la cintura */}
      <line x1="9" y1="12" x2="15" y2="12" stroke="#DFC088" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function DressCodeSection() {
  const { dressCode } = WEDDING_CONFIG;

  return (
    <section className="w-full max-w-xl mx-auto my-12 px-4" aria-labelledby="dresscode-heading">
      <div className="text-center mb-6">
        <span className="font-serif-luxury text-xs tracking-[0.25em] uppercase text-[#784A67] font-semibold">
          {dressCode.badge}
        </span>
        <h2 id="dresscode-heading" className="font-serif-luxury text-2xl sm:text-3xl text-[#2A1C28] font-normal mt-1">
          {dressCode.title}
        </h2>
        <OrnamentalDivider className="w-48 mx-auto my-3 text-[#9B709E]" />
        <p className="font-serif-luxury text-lg sm:text-xl font-bold text-[#5C3759] tracking-wide">
          {dressCode.subtitle}
        </p>
        <p className="font-sans-clean text-xs sm:text-sm text-[#6A5365] max-w-md mx-auto mt-2 leading-relaxed">
          {dressCode.description}
        </p>
      </div>

      <div className="bg-[#FCF9FD] border border-[#AB86B1]/40 rounded-2xl p-6 sm:p-8 shadow-card-elevated relative overflow-hidden card-paper-texture">
        {/* Guías visuales para Caballeros y Damas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Tarjeta Caballeros */}
          <div className="flex flex-col bg-gradient-to-b from-[#F9F2FA] to-[#F5EAF7] rounded-xl p-5 border border-[#AB86B1]/35 shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-[#5C3759] text-[#DFC6E3] flex items-center justify-center shadow-xs shrink-0">
                <BowtieIcon className="w-6 h-6 text-[#DFC088]" />
              </div>
              <div>
                <span className="font-serif-luxury text-[10px] tracking-widest uppercase text-[#784A67] font-semibold block">
                  Etiqueta Masculina
                </span>
                <h3 className="font-serif-luxury text-lg font-bold text-[#2A1C28] leading-tight">
                  {dressCode.gentlemenTitle}
                </h3>
              </div>
            </div>

            <p className="font-sans-clean text-xs text-[#2A1C28] leading-relaxed mb-3">
              {dressCode.gentlemenDescription}
            </p>

            <div className="mt-auto pt-3 border-t border-[#AB86B1]/25">
              <div className="bg-[#FCF9FD]/90 rounded-lg p-2.5 border border-[#AB86B1]/30">
                <p className="font-serif-luxury text-[11px] text-[#784A67] leading-snug italic">
                  ✨ <strong className="font-semibold text-[#5C3759]">Agradecimiento especial:</strong> {dressCode.gentlemenAvoid}
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta Damas */}
          <div className="flex flex-col bg-gradient-to-b from-[#F9F2FA] to-[#F5EAF7] rounded-xl p-5 border border-[#AB86B1]/35 shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-[#5C3759] text-[#DFC6E3] flex items-center justify-center shadow-xs shrink-0">
                <EveningDressIcon className="w-6 h-6 text-[#DFC088]" />
              </div>
              <div>
                <span className="font-serif-luxury text-[10px] tracking-widest uppercase text-[#784A67] font-semibold block">
                  Etiqueta Femenina
                </span>
                <h3 className="font-serif-luxury text-lg font-bold text-[#2A1C28] leading-tight">
                  {dressCode.ladiesTitle}
                </h3>
              </div>
            </div>

            <p className="font-sans-clean text-xs text-[#2A1C28] leading-relaxed mb-3">
              {dressCode.ladiesDescription}
            </p>

            <div className="mt-auto pt-3 border-t border-[#AB86B1]/25">
              <div className="bg-[#FCF9FD]/90 rounded-lg p-2.5 border border-[#AB86B1]/30">
                <p className="font-serif-luxury text-[11px] text-[#784A67] leading-snug italic">
                  🤍 <strong className="font-semibold text-[#5C3759]">Reserva de color:</strong> {dressCode.ladiesAvoid}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de cortesía y afecto de los novios */}
        <div className="mt-6 pt-5 border-t border-[#AB86B1]/35 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EBF7] border border-[#AB86B1]/40 text-[#5C3759] text-[10px] sm:text-xs font-serif-luxury tracking-widest uppercase font-semibold mb-2.5 shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#9B709E]" />
            <span>Nuestra Mayor Ilusión</span>
          </div>
          <p className="font-serif-luxury text-xs sm:text-sm text-[#5C3759] italic max-w-lg mx-auto leading-relaxed">
            {dressCode.etiquetteNote}
          </p>
        </div>
      </div>
    </section>
  );
}
