import React from 'react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { CatholicCrossOrnament, OrnamentalDivider, CardCornerFlourish } from './Ornaments';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface VerifiedGuestInfo {
  code: string;
  full_name: string;
  max_guests: number;
}

interface InvitationCardProps {
  guest?: VerifiedGuestInfo | null;
}

export function InvitationCard({ guest }: InvitationCardProps) {
  const { couple, ceremony } = WEDDING_CONFIG;

  return (
    <div className="w-full max-w-xl mx-auto my-8 px-4">
      {/* Tarjeta con acabado de papelería nupcial tradicional */}
      <div className="relative bg-[#FCFAF6] border-2 border-[#DFC088]/40 rounded-2xl p-6 sm:p-12 shadow-card-elevated text-center overflow-hidden card-paper-texture">
        {/* Esquinas ornamentales con filigrana dorada */}
        <CardCornerFlourish position="top-left" />
        <CardCornerFlourish position="top-right" />
        <CardCornerFlourish position="bottom-left" />
        <CardCornerFlourish position="bottom-right" />

        {/* Marco interior sutil con línea doble dorada */}
        <div className="border border-[#DFC088]/25 rounded-xl p-5 sm:p-10 flex flex-col items-center">
          {/* Elemento ornamental católico: Cruz sutil */}
          <div className="mb-4 text-[#B89355] flex justify-center">
            <CatholicCrossOrnament className="w-7 h-11 text-[#B89355]" />
          </div>

          {/* Texto sagrado oficial */}
          <p className="font-serif-luxury text-sm sm:text-base italic text-[#6B5B4D] max-w-md mx-auto leading-relaxed mb-5 font-normal">
            “Con la bendición de Dios y el amor de nuestras familias, tenemos la alegría de invitarte a celebrar
            nuestra unión en el sacramento del matrimonio”.
          </p>

          <OrnamentalDivider className="w-36 mx-auto my-2 text-[#B89355]" />

          {/* Nombres de los novios con protagonismo absoluto */}
          <div className="my-4">
            <h1 className="font-serif-luxury text-4xl sm:text-6xl text-[#2A2118] font-normal tracking-wide gold-text-gradient leading-tight">
              {couple.bride}
            </h1>
            <span className="font-script-romantic text-3xl sm:text-4xl text-[#B89355] my-1 block">
              &
            </span>
            <h1 className="font-serif-luxury text-4xl sm:text-6xl text-[#2A2118] font-normal tracking-wide gold-text-gradient leading-tight">
              {couple.groom}
            </h1>
          </div>

          <OrnamentalDivider className="w-36 mx-auto my-2 text-[#B89355]" />

          {/* MÓDULO PERSONALIZADO DE PASES CON PROTOCOLO FORMAL ESTRICTO */}
          {guest ? (
            <div className="w-full my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FAF4E6] to-[#F3EDE2] border border-[#DFC088]/60 shadow-xs text-center animate-fade-in">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCFAF6] border border-[#DFC088]/50 text-[#8C6A35] text-[10px] sm:text-xs font-serif-luxury tracking-widest uppercase font-semibold mb-2">
                <Sparkles className="w-3 h-3 text-[#B89355]" />
                <span>Invitación Exclusiva y Personal</span>
              </div>

              <p className="font-serif-luxury text-base sm:text-lg text-[#2A2118] font-medium leading-snug">
                Reservada con cariño en honor de:
              </p>
              <p className="font-serif-luxury text-lg sm:text-xl font-bold text-[#8C6A35] mt-0.5">
                {guest.full_name}
              </p>

              <div className="my-2.5 inline-block py-1.5 px-5 rounded-full bg-[#2A2118] text-[#DFC088] font-serif-luxury text-xs sm:text-sm tracking-wider font-semibold shadow-xs">
                {guest.max_guests === 1 ? '1 Pase Personal Reservado' : `${guest.max_guests} Pases Reservados en su Honor`}
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-[#DFC088]/40">
                <p className="font-serif-luxury text-[11px] sm:text-xs text-[#5C4A3C] italic max-w-md mx-auto leading-relaxed">
                  «Rogamos tomar en consideración que esta invitación ha sido reservada exclusivamente para el número de personas indicado. Por razones de espacio y protocolo, es personal e intransferible. Agradecemos profundamente su comprensión y el cariño de siempre.»
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full my-4 py-2 px-4 rounded-xl bg-[#FAF4E6]/60 border border-[#DFC088]/30 text-center">
              <p className="font-serif-luxury text-xs text-[#8C6A35] italic">
                Invitación personal y numerada según los pases asignados en su enlace exclusivo.
              </p>
            </div>
          )}

          {/* Fecha y hora */}
          <div className="my-3">
            <p className="font-serif-luxury text-xl sm:text-2xl text-[#2A2118] font-medium tracking-wide">
              {ceremony.dateFormatted}
            </p>
            <p className="font-sans-clean text-sm sm:text-base text-[#8C6A35] font-semibold tracking-widest uppercase mt-1">
              {ceremony.timeFormatted}
            </p>
          </div>

          {/* Lugar de la ceremonia */}
          <div className="mt-3 pt-3 border-t border-[#DFC088]/30 max-w-sm">
            <p className="font-serif-luxury text-xl sm:text-2xl text-[#2A2118] font-medium">
              {ceremony.churchName}
            </p>
            <p className="font-sans-clean text-xs sm:text-sm text-[#6B5B4D] mt-1 leading-relaxed">
              Ciudad Colonial, Santo Domingo, República Dominicana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
