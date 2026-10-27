'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { VerifiedGuest } from './RsvpForm';
import { Maximize2, X, Download } from 'lucide-react';

interface BridesmaidInvitationCardProps {
  guest?: VerifiedGuest | null;
}

export function BridesmaidInvitationCard({ guest }: BridesmaidInvitationCardProps) {
  const [showFullscreen, setShowFullscreen] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto my-4 sm:my-8 px-3 sm:px-4 flex flex-col items-center">
      {/* TARJETA EXCLUSIVA CON EL DISEÑO ANEXADO ÚNICAMENTE */}
      <div className="relative w-full group">
        {/* Resplandor sutil perla y lavanda alrededor de la tarjeta */}
        <div
          className="absolute -inset-1.5 sm:-inset-2 bg-gradient-to-r from-[#DFC6E3]/40 via-[#AB86B1]/25 to-[#DFC6E3]/40 rounded-[28px] sm:rounded-[36px] blur-xl opacity-90 pointer-events-none"
          aria-hidden="true"
        />

        {/* Marco de papelería física fina con bisel dorado */}
        <div className="relative bg-[#FCF8FC] p-1.5 sm:p-2.5 rounded-2xl sm:rounded-3xl border-2 border-[#DFC088]/60 shadow-2xl shadow-[#5C3759]/25 overflow-hidden card-paper-texture">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-[#AB86B1]/30 bg-white">
            {/* Imagen oficial con el diseño exacto de las damas */}
            <div
              className="relative w-full aspect-[682/1024] cursor-pointer"
              onClick={() => setShowFullscreen(true)}
              title="Toca para ampliar en pantalla completa"
            >
              <Image
                src="/images/invitacion-damas.jpg"
                alt="Invitación Oficial para Damas de Honor • Estefani Cedeño y Ricardo Fernández"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 650px"
                className="object-contain"
              />

              {/* Indicador sutil al pasar el cursor o pulsar */}
              <div className="absolute bottom-3 right-3 opacity-70 group-hover:opacity-100 transition-opacity">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#5C3759] text-[11px] font-sans-clean font-medium shadow-md">
                  <Maximize2 className="w-3 h-3 text-[#784A67]" />
                  <span>Ampliar</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón flotante para guardar la tarjeta como recuerdo */}
        <div className="mt-3 flex items-center justify-center">
          <a
            href="/images/invitacion-damas.jpg"
            download="Invitacion-Damas-Estefani-y-Ricardo.jpg"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 hover:bg-white border border-[#AB86B1]/40 text-[#5C3759] text-xs font-sans-clean transition-all cursor-pointer shadow-xs active:scale-95"
            title="Descargar invitación de recuerdo"
          >
            <Download className="w-3.5 h-3.5 text-[#784A67]" />
            <span>Guardar invitación</span>
          </a>
        </div>
      </div>

      {/* MODAL FULLSCREEN / LIGHTBOX DE ALTA RESOLUCIÓN */}
      {showFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in"
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
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Imagen ampliada */}
            <div className="relative w-full aspect-[682/1024] max-h-[86vh] rounded-xl overflow-hidden">
              <Image
                src="/images/invitacion-damas.jpg"
                alt="Invitación Oficial para Damas de Honor"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-contain"
              />
            </div>

            {/* Pie del modal */}
            <div className="w-full mt-2 pt-2 border-t border-[#AB86B1]/25 flex items-center justify-between px-2 text-xs font-sans-clean text-[#784A67]">
              <span>Invitación Oficial • Damas de Honor</span>
              <a
                href="/images/invitacion-damas.jpg"
                download="Invitacion-Damas-Estefani-y-Ricardo.jpg"
                className="inline-flex items-center gap-1 font-semibold text-[#5C3759] hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
