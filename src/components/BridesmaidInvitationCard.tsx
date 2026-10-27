'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { WEDDING_CONFIG } from '@/config/wedding';
import { VerifiedGuest } from './RsvpForm';
import { Heart, Sparkles, Clock, MapPin, Calendar, Maximize2, X, Check } from 'lucide-react';
import { FloralCornerFlourish, OrnamentalDivider } from './Ornaments';

interface BridesmaidInvitationCardProps {
  guest?: VerifiedGuest | null;
}

export function BridesmaidInvitationCard({ guest }: BridesmaidInvitationCardProps) {
  const { ceremony, reception } = WEDDING_CONFIG;
  const [showOriginalModal, setShowOriginalModal] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto my-8 px-3 sm:px-4">
      {/* Tarjeta de papelería exclusiva para damas */}
      <div className="relative bg-[#FCF8FC] border-2 border-[#AB86B1]/45 rounded-3xl p-5 sm:p-12 shadow-card-elevated overflow-hidden card-paper-texture">
        {/* Esquinas botánicas ornamentales en tonos de la boda */}
        <FloralCornerFlourish position="top-left" className="w-14 h-14 sm:w-20 sm:h-20 text-[#9B709E]/80" />
        <FloralCornerFlourish position="bottom-right" className="w-14 h-14 sm:w-20 sm:h-20 text-[#9B709E]/80" />

        {/* Decoración botánica sutil de fondo en esquinas */}
        <div
          className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-radial from-[#DFC6E3]/40 via-[#AB86B1]/15 to-transparent pointer-events-none blur-xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-radial from-[#9B709E]/30 via-[#DFC6E3]/20 to-transparent pointer-events-none blur-xl"
          aria-hidden="true"
        />

        {/* Marco interior con filete fino */}
        <div className="relative z-10 border border-[#AB86B1]/30 rounded-2xl p-4 sm:p-8 bg-white/60 backdrop-blur-xs">
          {/* Corazones entrelazados dibujados en la esquina superior derecha */}
          <div className="absolute top-3 right-4 sm:top-5 sm:right-6 pointer-events-none text-[#784A67]/80" aria-hidden="true">
            <svg className="w-9 h-7 sm:w-12 sm:h-9" viewBox="0 0 60 45" fill="none" stroke="currentColor">
              <path
                d="M18 10 C13 4, 3 8, 3 17 C3 26, 18 35, 23 38 C28 35, 43 26, 43 17 C43 8, 33 4, 28 10"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M37 8 C33 3, 24 6, 24 14 C24 22, 37 30, 41 33 C45 30, 58 22, 58 14 C58 6, 49 3, 45 8"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Insignia especial de Corte de Honor */}
          <div className="text-center mb-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF0FA] border border-[#AB86B1]/45 text-[#784A67] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#9B709E] animate-pulse" />
              <span className="font-serif-luxury text-[11px] sm:text-xs tracking-[0.25em] uppercase font-semibold">
                Invitación Exclusiva • Damas de Honor
              </span>
            </div>
          </div>

          {/* Cabecera ceremonial */}
          <div className="text-center mt-3 mb-4">
            <h2 className="font-serif-luxury text-xs sm:text-sm tracking-[0.28em] uppercase text-[#784A67] font-semibold">
              Una invitación hecha
            </h2>
            <h1 className="font-script-romantic text-4xl sm:text-6xl text-[#5C3759] -mt-1 mb-2 leading-tight">
              desde el corazón
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="w-8 h-[1px] bg-[#AB86B1]/40" />
              <Heart className="w-3 h-3 fill-[#784A67] text-[#784A67]" />
              <span className="w-8 h-[1px] bg-[#AB86B1]/40" />
            </div>
          </div>

          {/* Saludo inicial para las damas */}
          <div className="mb-4 text-left">
            <h3 className="font-script-romantic text-2xl sm:text-3xl text-[#5C3759]">
              {guest?.full_name ? `Querida ${guest.full_name}:` : 'Queridas damas:'}
            </h3>
          </div>

          {/* Cuerpo emotivo de la carta oficial para damas */}
          <div className="space-y-3.5 text-justify font-serif-luxury text-[13px] sm:text-[15px] leading-relaxed text-[#4A3947]">
            <p>
              Hay momentos en la vida que se convierten en recuerdos para siempre, y nuestro próximo capítulo será
              uno de ellos: el día en que nuestro amor se celebrará ante Dios, rodeados de las personas que ocupan
              un lugar especial en nuestros corazones.
            </p>

            <p>
              Hoy, mientras soñamos e imaginamos cada detalle de nuestra boda, hay algo que tenemos muy claro:{' '}
              <span className="font-medium text-[#2A1C28]">
                queremos compartir esta felicidad con ustedes.
              </span>
            </p>

            <p>
              Por eso, queremos hacerles una invitación muy especial. Nos encantaría que formaran parte de este
              momento tan significativo para nosotros, acompañándonos como nuestras damas en el día en que
            </p>

            {/* Nombres de los novios con la novia primero */}
            <div className="py-2 text-center my-1 bg-[#FAF2FB]/60 rounded-xl border border-[#AB86B1]/25">
              <p className="font-script-romantic text-3xl sm:text-4xl text-[#5C3759] royal-text-gradient">
                Estefani Cedeño y Ricardo Fernández
              </p>
              <p className="font-serif-luxury text-xs sm:text-sm tracking-wider uppercase text-[#784A67] font-semibold mt-0.5">
                uniremos nuestras vidas para siempre.
              </p>
            </div>

            <p>
              Elegirlas no se trata solamente de tenerlas a nuestro lado para una ocasión bonita; se trata de
              invitarlas a ser parte de una historia que estamos construyendo con amor, fe e ilusión. Queremos mirar
              a nuestro alrededor ese día y encontrar rostros que nos transmitan alegría, cariño y esa emoción tan
              especial que solo se siente cuando compartimos algo importante con personas que queremos.
            </p>

            <p>
              Sabemos que una boda está llena de detalles, preparativos y emociones, pero lo más valioso para nosotros
              será el amor que nos rodee y la dicha de vivir ese día acompañados de personas especiales. Nos haría
              inmensamente felices que ustedes fueran parte de ese recuerdo que atesoraremos durante toda nuestra vida.
            </p>

            <p>
              Deseamos que acepten esta invitación con el mismo cariño con el que hoy se las hacemos. Que disfruten
              cada preparativo, cada sonrisa, cada abrazo y cada instante de esta hermosa experiencia que comienza
              mucho antes de llegar al altar.
            </p>

            <p>
              Le pedimos a Dios que bendiga nuestra unión, que guíe nuestro matrimonio y que permita que este día sea
              el inicio de una vida llena de amor, respeto, complicidad y bendiciones. Y qué hermoso sería poder mirar
              atrás algún día y recordar que ustedes estuvieron allí, acompañándonos en el comienzo de esta nueva etapa.
            </p>
          </div>

          {/* ============================================================== */}
          {/* LA GRAN PREGUNTA (CALLIGRAPHY HIGHLIGHT)                       */}
          {/* ============================================================== */}
          <div className="my-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#FAF0FA] via-[#F4E3F5] to-[#FAF0FA] border border-[#AB86B1]/45 text-center shadow-xs">
            <Heart className="w-4 h-4 fill-[#784A67] text-[#784A67] mx-auto mb-2 animate-pulse" />
            <p className="font-script-romantic text-2xl sm:text-4xl text-[#5C3759] leading-snug">
              ¿Aceptan ser parte de nuestro sueño y acompañarnos como nuestras damas en el día más bonito de nuestra historia de amor?
            </p>
          </div>

          {/* ============================================================== */}
          {/* PLACA CEREMONIAL CON LA FECHA, LUGAR Y LA HORA EXACTA          */}
          {/* (Agregando la hora que faltaba en el diseño original)          */}
          {/* ============================================================== */}
          <div className="my-6 p-4 sm:p-5 rounded-2xl bg-[#FCF9FD] border border-[#AB86B1]/40 shadow-xs text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#784A67] mb-2">
              <Calendar className="w-4 h-4 text-[#9B709E]" />
              <span className="font-serif-luxury text-xs sm:text-sm tracking-widest uppercase font-semibold">
                Detalles de la Ceremonia y Hora
              </span>
            </div>

            <p className="font-serif-luxury text-xl sm:text-2xl text-[#2A1C28] font-medium">
              {ceremony.dateFormatted}
            </p>

            {/* La hora destacada en oro y ciruela */}
            <div className="inline-flex items-center gap-2 my-2.5 px-4 py-1.5 rounded-full bg-[#5C3759] text-[#DFC6E3] shadow-xs">
              <Clock className="w-4 h-4 text-[#DFC088]" />
              <span className="font-sans-clean text-sm sm:text-base font-semibold tracking-wider">
                {ceremony.timeFormatted} (Hora Oficial)
              </span>
            </div>

            <div className="mt-2 text-xs sm:text-sm font-sans-clean text-[#6A5365]">
              <p className="font-medium text-[#2A1C28] flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#784A67]" />
                <span>{ceremony.churchName}</span>
              </p>
              <p className="text-xs text-[#784A67] mt-0.5">
                Ciudad Colonial, Santo Domingo, República Dominicana
              </p>
            </div>

            {guest?.invitation_scope !== 'church_only' && (
              <div className="mt-3 pt-3 border-t border-[#AB86B1]/25 text-xs text-[#6A5365]">
                <span className="font-semibold text-[#784A67]">Recepción:</span>{' '}
                {reception.timeFormatted} en {reception.venueName} ({reception.address})
              </div>
            )}
          </div>

          {/* Firma de los novios */}
          <div className="mt-6 mb-4 text-center">
            <p className="font-serif-luxury text-xs sm:text-sm text-[#784A67] italic mb-1">
              Con todo nuestro cariño, ilusión y gratitud,
            </p>
            <p className="font-script-romantic text-3xl sm:text-4xl text-[#5C3759] royal-text-gradient">
              Estefani Cedeño & Ricardo Fernández
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="w-6 h-[1px] bg-[#AB86B1]/40" />
              <Heart className="w-2.5 h-2.5 fill-[#784A67] text-[#784A67]" />
              <span className="w-6 h-[1px] bg-[#AB86B1]/40" />
            </div>
          </div>

          {/* Cita bíblica de 1 Corintios 13:7 y anillos entrelazados */}
          <div className="mt-5 pt-4 border-t border-[#AB86B1]/30 text-center">
            {/* Ilustración de alianzas de boda entrelazadas con destellos */}
            <div className="flex items-center justify-center mb-2.5 text-[#DFC088]" aria-hidden="true">
              <svg className="w-10 h-7" viewBox="0 0 50 35" fill="none" stroke="currentColor">
                {/* Anillo 1 */}
                <ellipse cx="19" cy="18" rx="12" ry="10" strokeWidth="2.5" stroke="#DFC088" />
                <ellipse cx="19" cy="18" rx="9" ry="7" strokeWidth="1" stroke="#FAF6FA" />
                {/* Pequeño diamante */}
                <polygon points="19,5 21,8 19,10 17,8" fill="#FFFFFF" stroke="#DFC088" strokeWidth="0.8" />
                {/* Anillo 2 */}
                <ellipse cx="31" cy="18" rx="12" ry="10" strokeWidth="2.5" stroke="#B89355" />
                <ellipse cx="31" cy="18" rx="9" ry="7" strokeWidth="1" stroke="#FAF6FA" />
              </svg>
            </div>

            <p className="font-serif-luxury text-xs sm:text-sm italic text-[#5C3759] max-w-sm mx-auto leading-relaxed">
              “El amor todo lo puede, todo lo cree, todo lo espera, todo lo soporta.”
            </p>
            <p className="font-sans-clean text-[10px] sm:text-xs text-[#784A67] tracking-[0.25em] uppercase font-semibold mt-1">
              1 Corintios 13:7
            </p>
          </div>

          {/* Botón discreto para consultar la papelería original en alta resolución */}
          <div className="mt-6 pt-3 flex justify-center">
            <button
              type="button"
              onClick={() => setShowOriginalModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#AB86B1]/40 text-[#784A67] hover:text-[#5C3759] text-[11px] font-sans-clean transition-all cursor-pointer shadow-2xs"
            >
              <Maximize2 className="w-3 h-3 text-[#9B709E]" />
              <span>Ver lámina gráfica original</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Lightbox con la lámina gráfica original */}
      {showOriginalModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setShowOriginalModal(false)}
        >
          <div
            className="relative max-w-md w-full max-h-[92vh] flex flex-col items-center bg-[#FAF6FA] rounded-2xl p-2 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowOriginalModal(false)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Cerrar lámina"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative w-full aspect-2/3 max-h-[85vh] rounded-xl overflow-hidden">
              <Image
                src="/images/damas-card-sample.jpg"
                alt="Invitación original para Damas de Honor"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-[11px] font-sans-clean text-[#784A67] mt-1.5 pb-1">
              Lámina gráfica de recuerdo para Damas de Honor
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
