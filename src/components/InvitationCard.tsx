import React from 'react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { CatholicCrossOrnament, OrnamentalDivider, FloralCornerFlourish } from './Ornaments';
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
      <div className="relative bg-[#FCF9FD] border-2 border-[#AB86B1]/40 rounded-2xl p-6 sm:p-12 shadow-card-elevated text-center overflow-hidden card-paper-texture">
        {/* Esquinas botánicas con capullos de rosas y hojitas en lila, malva y oro */}
        <FloralCornerFlourish position="top-left" />
        <FloralCornerFlourish position="top-right" />
        <FloralCornerFlourish position="bottom-left" />
        <FloralCornerFlourish position="bottom-right" />

        {/* Marco interior sutil con línea doble */}
        <div className="border border-[#AB86B1]/25 rounded-xl p-5 sm:p-10 flex flex-col items-center">
          {/* Elemento ornamental católico: Cruz sutil */}
          <div className="mb-4 text-[#784A67] flex justify-center">
            <CatholicCrossOrnament className="w-7 h-11 text-[#784A67]" />
          </div>

          {/* Texto sagrado oficial */}
          <p className="font-serif-luxury text-sm sm:text-base italic text-[#6A5365] max-w-md mx-auto leading-relaxed mb-5 font-normal">
            “Con la bendición de Dios y el amor de nuestras familias, tenemos la alegría de invitarte a celebrar
            nuestra unión en el sacramento del matrimonio”.
          </p>

          <OrnamentalDivider className="w-36 mx-auto my-2 text-[#9B709E]" />

          {/* Nombres de los novios con protagonismo absoluto */}
          <div className="my-4">
            <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#2A1C28] font-normal tracking-wide royal-text-gradient leading-tight">
              Estefani Cedeño
            </h1>
            <span className="font-script-romantic text-3xl sm:text-4xl text-[#9B709E] my-1 block">
              &
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#2A1C28] font-normal tracking-wide royal-text-gradient leading-tight">
              Ricardo Fernandez
            </h1>
          </div>

          <OrnamentalDivider className="w-36 mx-auto my-2 text-[#9B709E]" />

          {/* MÓDULO PERSONALIZADO DE PASES CON PROTOCOLO FORMAL ESTRICTO */}
          {guest ? (
            <div className="w-full my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#F9F2FA] to-[#F2E5F4] border border-[#AB86B1]/50 shadow-xs text-center animate-fade-in">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCF9FD] border border-[#AB86B1]/40 text-[#784A67] text-[10px] sm:text-xs font-serif-luxury tracking-widest uppercase font-semibold mb-2">
                <Sparkles className="w-3 h-3 text-[#9B709E]" />
                <span>Invitación Exclusiva y Personal</span>
              </div>

              <p className="font-serif-luxury text-base sm:text-lg text-[#2A1C28] font-medium leading-snug">
                Reservada con cariño en honor de:
              </p>
              <p className="font-serif-luxury text-lg sm:text-xl font-bold text-[#5C3759] mt-0.5">
                {guest.full_name}
              </p>

              <div className="my-2.5 inline-block py-1.5 px-5 rounded-full bg-[#5C3759] text-[#DFC6E3] font-serif-luxury text-xs sm:text-sm tracking-wider font-semibold shadow-xs">
                {guest.max_guests === 1 ? '1 Pase Personal Reservado' : `${guest.max_guests} Pases Reservados en su Honor`}
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-[#AB86B1]/35">
                <p className="font-serif-luxury text-[11px] sm:text-xs text-[#6A5365] italic max-w-md mx-auto leading-relaxed">
                  «Rogamos tomar en consideración que esta invitación ha sido reservada exclusivamente para el número de personas indicado. Por razones de espacio y protocolo, es personal e intransferible. Agradecemos profundamente su comprensión y el cariño de siempre.»
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full my-4 py-2 px-4 rounded-xl bg-[#F9F2FA]/70 border border-[#AB86B1]/30 text-center">
              <p className="font-serif-luxury text-xs text-[#784A67] italic">
                Invitación personal y numerada según los pases asignados en su enlace exclusivo.
              </p>
            </div>
          )}

          {/* Fecha y hora */}
          <div className="my-3">
            <p className="font-serif-luxury text-xl sm:text-2xl text-[#2A1C28] font-medium tracking-wide">
              {ceremony.dateFormatted}
            </p>
            <p className="font-sans-clean text-sm sm:text-base text-[#784A67] font-semibold tracking-widest uppercase mt-1">
              {ceremony.timeFormatted}
            </p>
          </div>

          {/* Lugar de la ceremonia */}
          <div className="mt-3 pt-3 border-t border-[#AB86B1]/30 max-w-sm">
            <p className="font-serif-luxury text-xl sm:text-2xl text-[#2A1C28] font-medium">
              {ceremony.churchName}
            </p>
            <p className="font-sans-clean text-xs sm:text-sm text-[#6A5365] mt-1 leading-relaxed">
              Ciudad Colonial, Santo Domingo, República Dominicana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
