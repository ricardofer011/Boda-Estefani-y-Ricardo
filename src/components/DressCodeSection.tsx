import React from 'react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { Sparkles } from 'lucide-react';
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
 * Icono estilizado de vestido formal para damas
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
      <path
        d="M8 3L9.5 7H14.5L16 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9.5 7C9.5 7 8.5 10 9 12C9.5 14 6 21 6 21H18C18 21 14.5 14 15 12C15.5 10 14.5 7 14.5 7H9.5Z"
        fill="currentColor"
        fillOpacity="0.85"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <line x1="9" y1="12" x2="15" y2="12" stroke="#DFC088" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

interface DressCodeSectionProps {
  scope?: 'church_only' | 'church_and_reception';
}

export function DressCodeSection({ scope = 'church_and_reception' }: DressCodeSectionProps) {
  const { dressCode, adultsOnly } = WEDDING_CONFIG;
  const showReception = scope === 'church_and_reception';

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
        {/* Presentación estética y armoniosa para Damas y Caballeros */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {/* Caballeros */}
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-b from-[#F9F2FA] to-[#F5EAF7] border border-[#AB86B1]/35 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#5C3759] text-[#DFC6E3] flex items-center justify-center shadow-xs mb-2.5">
              <BowtieIcon className="w-6 h-6 text-[#DFC088]" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#2A1C28]">
              {dressCode.gentlemenTitle}
            </h3>
            <p className="font-sans-clean text-xs text-[#6A5365] mt-1">
              {dressCode.gentlemenDescription}
            </p>
          </div>

          {/* Damas */}
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-b from-[#F9F2FA] to-[#F5EAF7] border border-[#AB86B1]/35 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#5C3759] text-[#DFC6E3] flex items-center justify-center shadow-xs mb-2.5">
              <EveningDressIcon className="w-6 h-6 text-[#DFC088]" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#2A1C28]">
              {dressCode.ladiesTitle}
            </h3>
            <p className="font-sans-clean text-xs text-[#6A5365] mt-1">
              {dressCode.ladiesDescription}
            </p>
          </div>
        </div>

        {/* Delicada nota de cortesía para el color de la novia */}
        <div className="mt-5 text-center max-w-sm mx-auto">
          <p className="font-serif-luxury text-xs text-[#784A67] italic leading-relaxed">
            🤍 {dressCode.ladiesAvoid}
          </p>
        </div>

        {/* Mensaje de cortesía y afecto de los novios */}
        <div className="mt-5 pt-4 border-t border-[#AB86B1]/30 text-center">
          <p className="font-serif-luxury text-xs sm:text-sm text-[#5C3759] italic max-w-lg mx-auto leading-relaxed">
            {dressCode.etiquetteNote}
          </p>
        </div>

        {/* Protocolo de Asistencia: Recepción Solo Adultos (solo si incluye recepción) */}
        {showReception && (
          <div className="mt-4 pt-4 border-t border-[#AB86B1]/25 text-center max-w-md mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EBF7] border border-[#AB86B1]/40 text-[#5C3759] text-[10px] sm:text-xs font-serif-luxury tracking-widest uppercase font-semibold mb-2 shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#9B709E]" />
              <span>{adultsOnly.subtitle}</span>
            </div>
            <p className="font-serif-luxury text-xs text-[#6A5365] italic leading-relaxed">
              {adultsOnly.cardNote}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
