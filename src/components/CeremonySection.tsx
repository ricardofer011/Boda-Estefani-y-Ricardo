import React from 'react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { Navigation, Church, Wine, Clock, MapPin } from 'lucide-react';
import { OrnamentalDivider } from './Ornaments';

interface CeremonySectionProps {
  scope?: 'church_only' | 'church_and_reception';
}

export function CeremonySection({ scope = 'church_and_reception' }: CeremonySectionProps) {
  const { ceremony, reception } = WEDDING_CONFIG;
  const showReception = scope === 'church_and_reception';

  return (
    <section className="w-full max-w-xl mx-auto my-12 px-4" aria-labelledby="ceremony-heading">
      <div className="text-center mb-6">
        <span className="font-serif-luxury text-xs tracking-[0.25em] uppercase text-[#784A67] font-semibold">
          {showReception ? 'Ubicaciones del Evento' : 'Lugar y Horario'}
        </span>
        <h2 id="ceremony-heading" className="font-serif-luxury text-2xl sm:text-3xl text-[#2A1C28] font-normal mt-1">
          {showReception ? 'Ceremonia & Recepción' : 'Ceremonia Religiosa'}
        </h2>
        <OrnamentalDivider className="w-48 mx-auto my-3 text-[#9B709E]" />
      </div>

      <div className="space-y-6">
        {/* 1. Tarjeta de la Iglesia Las Mercedes */}
        <div className="bg-[#FCF9FD] border border-[#AB86B1]/40 rounded-2xl p-6 sm:p-8 shadow-card-elevated relative overflow-hidden text-center card-paper-texture">
          {/* Adorno superior sutil */}
          <div className="w-12 h-12 mx-auto rounded-full bg-[#F9F2FA] border border-[#AB86B1]/40 flex items-center justify-center text-[#784A67] mb-4 shadow-2xs">
            <Church className="w-6 h-6 stroke-[1.5]" />
          </div>

          <span className="font-serif-luxury text-[11px] tracking-widest uppercase text-[#784A67] font-semibold block mb-1">
            Ceremonia Religiosa
          </span>

          <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#2A1C28] font-medium mb-1">
            {ceremony.churchName}
          </h3>

          <p className="font-sans-clean text-xs sm:text-sm text-[#6A5365] mb-4 max-w-md mx-auto leading-relaxed">
            {ceremony.fullLocation}
          </p>

          <div className="inline-block py-2 px-5 bg-[#F5EBF7] border border-[#AB86B1]/35 rounded-full mb-6 shadow-2xs">
            <p className="font-serif-luxury text-xs sm:text-sm text-[#5C3759] font-semibold tracking-wide">
              {ceremony.dateFormatted} • {ceremony.timeFormatted}
            </p>
          </div>

          <div>
            <a
              href={ceremony.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-button inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-serif-luxury text-xs sm:text-sm uppercase tracking-widest cursor-pointer shadow-xs"
            >
              <Navigation className="w-4 h-4" />
              <span>Cómo llegar a la Iglesia</span>
            </a>
          </div>
        </div>

        {/* 2. Tarjeta de la Recepción (Salón Vista Marina) — Solo mostrada si scope === 'church_and_reception' */}
        {showReception && (
          <div className="bg-[#FCF9FD] border-2 border-[#AB86B1]/50 rounded-2xl p-6 sm:p-8 shadow-card-elevated relative overflow-hidden text-center card-paper-texture animate-fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F9F2FA] border border-[#AB86B1]/50 flex items-center justify-center text-[#784A67] mb-4 shadow-2xs">
              <Wine className="w-6 h-6 stroke-[1.5]" />
            </div>

            <span className="font-serif-luxury text-[11px] tracking-widest uppercase text-[#784A67] font-semibold block mb-1">
              Recepción & Banquete
            </span>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#2A1C28] font-medium mb-1">
              {reception.venueName}
            </h3>

            <p className="font-sans-clean text-xs sm:text-sm font-medium text-[#2A1C28] mb-1">
              {reception.address}
            </p>

            <p className="font-serif-luxury text-xs sm:text-sm text-[#6A5365] italic max-w-md mx-auto leading-relaxed mb-4">
              “{reception.notes}”
            </p>

            <div className="inline-block py-2 px-5 bg-[#F5EBF7] border border-[#AB86B1]/35 rounded-full mb-6 shadow-2xs">
              <p className="font-serif-luxury text-xs sm:text-sm text-[#5C3759] font-semibold tracking-wide flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#9B709E]" />
                <span>{reception.timeFormatted}</span>
              </p>
            </div>

            <div>
              <a
                href={reception.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-button inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-serif-luxury text-xs sm:text-sm uppercase tracking-widest cursor-pointer shadow-xs"
              >
                <Navigation className="w-4 h-4" />
                <span>Cómo llegar al Salón</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
