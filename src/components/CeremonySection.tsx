import React from 'react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { MapPin, Navigation, Church, Sparkles } from 'lucide-react';
import { OrnamentalDivider } from './Ornaments';

export function CeremonySection() {
  const { ceremony, reception } = WEDDING_CONFIG;

  return (
    <section className="w-full max-w-xl mx-auto my-12 px-4" aria-labelledby="ceremony-heading">
      <div className="text-center mb-6">
        <span className="font-serif-luxury text-xs tracking-[0.25em] uppercase text-[#8C6A35] font-semibold">
          Lugar y Horario
        </span>
        <h2 id="ceremony-heading" className="font-serif-luxury text-2xl sm:text-3xl text-[#2A2118] font-normal mt-1">
          Ceremonia religiosa
        </h2>
        <OrnamentalDivider className="w-48 mx-auto my-3 text-[#B89355]" />
      </div>

      {/* Tarjeta de la Iglesia Las Mercedes */}
      <div className="bg-[#FCFAF6] border border-[#DFC088]/40 rounded-xl p-6 sm:p-8 shadow-card-elevated relative overflow-hidden text-center">
        {/* Adorno superior sutil */}
        <div className="w-12 h-12 mx-auto rounded-full bg-[#F3EDE2] border border-[#DFC088]/40 flex items-center justify-center text-[#B89355] mb-4">
          <Church className="w-6 h-6 stroke-[1.5]" />
        </div>

        <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#2A2118] font-medium mb-1">
          {ceremony.churchName}
        </h3>

        <p className="font-sans-clean text-sm sm:text-base text-[#6B5B4D] mb-4 max-w-md mx-auto leading-relaxed">
          {ceremony.fullLocation}
        </p>

        <div className="inline-block py-2 px-5 bg-[#F6F0E4] border border-[#DFC088]/30 rounded-full mb-6">
          <p className="font-serif-luxury text-sm sm:text-base text-[#8C6A35] font-medium tracking-wide">
            {ceremony.dateFormatted} • {ceremony.timeFormatted}
          </p>
        </div>

        <div>
          <a
            href={ceremony.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-button inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-serif-luxury text-sm uppercase tracking-widest cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Cómo llegar</span>
          </a>
        </div>
      </div>

      {/* Sección de recepción: preparada en configuración pero no mostrada hasta estar definida */}
      {reception.isDefined ? (
        <div className="mt-8 bg-[#FCFAF6] border border-[#DFC088]/40 rounded-xl p-6 shadow-card-elevated text-center">
          <h3 className="font-serif-luxury text-2xl text-[#2A2118] font-medium mb-2">Recepción</h3>
          <p className="font-sans-clean text-sm text-[#6B5B4D]">{reception.venueName}</p>
          <p className="font-sans-clean text-sm text-[#6B5B4D]">{reception.address}</p>
        </div>
      ) : null}
    </section>
  );
}
