import React from 'react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { CatholicCrossOrnament, OrnamentalDivider, CardCornerFlourish } from './Ornaments';
import { Heart } from 'lucide-react';

export function InvitationCard() {
  const { couple, ceremony } = WEDDING_CONFIG;

  return (
    <div className="w-full max-w-xl mx-auto my-8 px-4">
      {/* Tarjeta con acabado de papelería nupcial tradicional */}
      <div className="relative bg-[#FCFAF6] border-2 border-[#DFC088]/40 rounded-2xl p-7 sm:p-12 shadow-card-elevated text-center overflow-hidden card-paper-texture">
        {/* Esquinas ornamentales con filigrana dorada */}
        <CardCornerFlourish position="top-left" />
        <CardCornerFlourish position="top-right" />
        <CardCornerFlourish position="bottom-left" />
        <CardCornerFlourish position="bottom-right" />

        {/* Marco interior sutil con línea doble dorada */}
        <div className="border border-[#DFC088]/25 rounded-xl p-6 sm:p-10 flex flex-col items-center">
          {/* Elemento ornamental católico: Cruz sutil */}
          <div className="mb-4 text-[#B89355] flex justify-center">
            <CatholicCrossOrnament className="w-7 h-11 text-[#B89355]" />
          </div>

          {/* Texto sagrado oficial */}
          <p className="font-serif-luxury text-sm sm:text-base italic text-[#6B5B4D] max-w-md mx-auto leading-relaxed mb-6 font-normal">
            “Con la bendición de Dios y el amor de nuestras familias, tenemos la alegría de invitarte a celebrar
            nuestra unión en el sacramento del matrimonio”.
          </p>

          <OrnamentalDivider className="w-36 mx-auto my-2 text-[#B89355]" />

          {/* Nombres de los novios con protagonismo absoluto */}
          <div className="my-5">
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

          {/* Fecha y hora */}
          <div className="my-4">
            <p className="font-serif-luxury text-xl sm:text-2xl text-[#2A2118] font-medium tracking-wide">
              {ceremony.dateFormatted}
            </p>
            <p className="font-sans-clean text-sm sm:text-base text-[#8C6A35] font-semibold tracking-widest uppercase mt-1">
              {ceremony.timeFormatted}
            </p>
          </div>

          {/* Lugar de la ceremonia */}
          <div className="mt-4 pt-4 border-t border-[#DFC088]/30 max-w-sm">
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
