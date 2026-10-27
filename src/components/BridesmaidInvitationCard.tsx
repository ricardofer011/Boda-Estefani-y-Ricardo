'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { WEDDING_CONFIG } from '@/config/wedding';
import { VerifiedGuest } from './RsvpForm';
import { Heart, Sparkles, Clock, MapPin, Calendar, Maximize2, X, Download, ShieldCheck } from 'lucide-react';

interface BridesmaidInvitationCardProps {
  guest?: VerifiedGuest | null;
}

export function BridesmaidInvitationCard({ guest }: BridesmaidInvitationCardProps) {
  const { ceremony, reception } = WEDDING_CONFIG;
  const [showFullscreen, setShowFullscreen] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto my-6 sm:my-10 px-3 sm:px-4 flex flex-col items-center">
      {/* 1. DISTINTIVO EXCLUSIVO DE CORTE DE HONOR */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCF8FC] border border-[#AB86B1]/45 text-[#784A67] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#9B709E] animate-pulse" />
          <span className="font-serif-luxury text-xs sm:text-sm tracking-[0.22em] uppercase font-semibold text-[#5C3759]">
            Invitación Exclusiva • Corte de Honor
          </span>
          <Heart className="w-3 h-3 fill-[#9B709E] text-[#9B709E]" />
        </div>

        {guest?.full_name && guest.full_name !== 'Queridas Damas de Honor' && (
          <p className="mt-2 font-script-romantic text-2xl sm:text-3xl text-[#5C3759]">
            Querida {guest.full_name}
          </p>
        )}
      </div>

      {/* 2. TARJETA PRINCIPAL CON EL DISEÑO ESPECÍFICO DE LAS DAMAS */}
      <div className="relative w-full max-w-xl group">
        {/* Resplandor suave perla/lavanda detrás de la tarjeta */}
        <div
          className="absolute -inset-2 bg-gradient-to-r from-[#DFC6E3]/35 via-[#AB86B1]/20 to-[#DFC6E3]/35 rounded-[30px] blur-xl opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none"
          aria-hidden="true"
        />

        {/* Marco de papelería física con bisel dorado y textura de algodón */}
        <div className="relative bg-[#FCF8FC] p-2 sm:p-3 rounded-2xl sm:rounded-3xl border-2 border-[#DFC088]/50 shadow-2xl shadow-[#5C3759]/20 overflow-hidden card-paper-texture">
          {/* Filete interior fino de oro */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-[#AB86B1]/35 bg-white shadow-inner">
            {/* Imagen del diseño específico oficial para Damas */}
            <div
              className="relative w-full aspect-[682/1024] cursor-pointer"
              onClick={() => setShowFullscreen(true)}
              title="Toca para ver en pantalla completa"
            >
              <Image
                src="/images/invitacion-damas.jpg"
                alt="Invitación Oficial para Damas de Honor • Estefani Cedeño y Ricardo Fernández"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 600px"
                className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.01]"
              />

              {/* Destello translúcido sutil al pasar el cursor */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#5C3759] text-xs font-serif-luxury font-medium shadow-md">
                  <Maximize2 className="w-3.5 h-3.5 text-[#784A67]" />
                  Tocar para ampliar
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción rápida: Ampliar y Descargar */}
        <div className="mt-3 flex items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowFullscreen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-[#AB86B1]/40 text-[#784A67] hover:text-[#5C3759] text-xs font-sans-clean transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#9B709E]" />
            <span>Ampliar en pantalla completa</span>
          </button>

          <a
            href="/images/invitacion-damas.jpg"
            download="Invitacion-Damas-Estefani-y-Ricardo.jpg"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF2FB] hover:bg-[#F4E3F5] border border-[#AB86B1]/45 text-[#5C3759] text-xs font-sans-clean transition-all cursor-pointer shadow-xs active:scale-95"
            title="Guardar la imagen de recuerdo en tu dispositivo"
          >
            <Download className="w-3.5 h-3.5 text-[#784A67]" />
            <span>Guardar tarjeta</span>
          </a>
        </div>
      </div>

      {/* 3. PLACA CEREMONIAL CON LA FECHA, HORA Y LUGAR OFICIAL                      */}
      {/* (Complementa el diseño aportando la hora exacta de la ceremonia: 11:00 am) */}
      <div className="w-full max-w-xl mt-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#FCF9FD] to-[#FAF2FB] border-2 border-[#AB86B1]/40 shadow-card-elevated text-center relative overflow-hidden card-paper-texture">
        {/* Decoración botánica de fondo */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-radial from-[#DFC6E3]/40 to-transparent pointer-events-none blur-xl"
          aria-hidden="true"
        />

        <div className="flex items-center justify-center gap-2 text-[#784A67] mb-2">
          <span className="w-6 h-[1px] bg-[#AB86B1]/40" />
          <Calendar className="w-4 h-4 text-[#9B709E]" />
          <span className="font-serif-luxury text-xs sm:text-sm tracking-[0.22em] uppercase font-semibold text-[#5C3759]">
            Fecha y Hora Oficial de Nuestra Boda
          </span>
          <span className="w-6 h-[1px] bg-[#AB86B1]/40" />
        </div>

        <p className="font-serif-luxury text-xl sm:text-2xl text-[#2A1C28] font-medium leading-snug">
          {ceremony.dateFormatted}
        </p>

        {/* HORA DESTACADA EN ORO Y CIRUELA */}
        <div className="inline-flex items-center gap-2 my-3 px-5 py-2 rounded-full bg-[#5C3759] text-[#DFC6E3] shadow-md border border-[#DFC088]/40">
          <Clock className="w-4 h-4 text-[#DFC088] animate-pulse" />
          <span className="font-sans-clean text-sm sm:text-base font-semibold tracking-wider text-white">
            {ceremony.timeFormatted} (Hora de la Ceremonia)
          </span>
        </div>

        {/* Lugar de la ceremonia */}
        <div className="mt-1 text-xs sm:text-sm font-sans-clean text-[#6A5365]">
          <p className="font-medium text-[#2A1C28] flex items-center justify-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#784A67]" />
            <span className="font-serif-luxury text-sm sm:text-base text-[#5C3759] font-semibold">
              {ceremony.churchName}
            </span>
          </p>
          <p className="text-xs text-[#784A67] mt-0.5">
            Ciudad Colonial, Santo Domingo, República Dominicana
          </p>
        </div>

        {/* Recepción si aplica */}
        {guest?.invitation_scope !== 'church_only' && (
          <div className="mt-3.5 pt-3 border-t border-[#AB86B1]/25 text-xs text-[#6A5365]">
            <span className="font-semibold text-[#784A67]">Celebración & Recepción:</span>{' '}
            {reception.timeFormatted} en {reception.venueName} ({reception.address})
          </div>
        )}
      </div>

      {/* 4. MODAL FULLSCREEN / LIGHTBOX DE ALTA RESOLUCIÓN */}
      {showFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fade-in"
          onClick={() => setShowFullscreen(false)}
        >
          <div
            className="relative max-w-lg w-full max-h-[96vh] flex flex-col items-center bg-[#FAF6FA] rounded-2xl p-2 sm:p-3 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Cerrar vista completa"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Imagen ampliada */}
            <div className="relative w-full aspect-[682/1024] max-h-[85vh] rounded-xl overflow-hidden shadow-md">
              <Image
                src="/images/invitacion-damas.jpg"
                alt="Invitación Oficial para Damas de Honor en alta resolución"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-contain"
              />
            </div>

            {/* Pie del modal con botón de descarga */}
            <div className="w-full mt-2 pt-2 border-t border-[#AB86B1]/25 flex items-center justify-between px-2 text-xs font-sans-clean text-[#784A67]">
              <span>Invitación Oficial para Damas de Honor</span>
              <a
                href="/images/invitacion-damas.jpg"
                download="Invitacion-Damas-Estefani-y-Ricardo.jpg"
                className="inline-flex items-center gap-1 font-semibold text-[#5C3759] hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar imagen
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
