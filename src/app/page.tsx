'use client';

import React, { useState, useEffect } from 'react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { Envelope } from '@/components/Envelope';
import { InvitationCard } from '@/components/InvitationCard';
import { CouplePhotoSection } from '@/components/CouplePhotoSection';
import { Countdown } from '@/components/Countdown';
import { CeremonySection } from '@/components/CeremonySection';
import { CalendarSection } from '@/components/CalendarSection';
import { GiftsSection } from '@/components/GiftsSection';
import { RsvpForm, VerifiedGuest } from '@/components/RsvpForm';
import { ShareSection } from '@/components/ShareSection';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Footer } from '@/components/Footer';
import { Mail } from 'lucide-react';

export default function WeddingInvitationPage() {
  const [isOpened, setIsOpened] = useState(false);
  const [guest, setGuest] = useState<VerifiedGuest | null>(null);

  // Buscar información del invitado a partir del enlace personalizado
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('invitacion') || params.get('code') || params.get('invitado') || params.get('guest');

    if (code) {
      fetch(`/api/guests/verify?code=${encodeURIComponent(code.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setGuest(data.data);
          }
        })
        .catch((err) => {
          console.warn('Error verificando enlace de invitado:', err);
        });
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF7F2] relative overflow-x-hidden selection:bg-[#DFC088]/30">
      {/* 1. SOBRE ANIMADO INICIAL (Se oculta al completarse la animación de apertura) */}
      {!isOpened && (
        <Envelope
          onOpenComplete={() => setIsOpened(true)}
          coupleNames={WEDDING_CONFIG.couple.names}
        />
      )}

      {/* 2. EXPERIENCIA PRINCIPAL DE LA INVITACIÓN DIGITAL */}
      <div
        className={`transition-opacity duration-1000 ${
          isOpened ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'
        }`}
      >
        {/* Textura sutil y viñeta en el fondo */}
        <div className="fixed inset-0 paper-texture pointer-events-none opacity-80 z-0" aria-hidden="true" />

        {/* Reproductor de música ambiental flotante */}
        <MusicPlayer />

        {/* Barra superior discreta con opción de reabrir el sobre */}
        <header className="relative z-10 w-full py-4 px-6 flex items-center justify-between border-b border-[#DFC088]/20 bg-[#FAF7F2]/80 backdrop-blur-xs">
          <span className="font-serif-luxury text-sm tracking-widest text-[#8C6A35] font-semibold">
            {WEDDING_CONFIG.couple.initials}
          </span>
          <button
            onClick={() => setIsOpened(false)}
            className="inline-flex items-center gap-1.5 font-sans-clean text-xs text-[#6B5B4D] hover:text-[#2A2118] transition-colors cursor-pointer"
            title="Volver a ver el sobre animado"
          >
            <Mail className="w-3.5 h-3.5 text-[#B89355]" />
            <span>Ver sobre</span>
          </button>
        </header>

        {/* Contenido principal estructurado */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Tarjeta de invitación oficial con datos personalizados de pases */}
          <InvitationCard guest={guest} />

          {/* Retrato oficial de los novios */}
          <CouplePhotoSection />

          {/* Cuenta regresiva en tiempo real */}
          <Countdown />

          {/* Sección de ceremonia y ubicación en mapa (Iglesia sola o Iglesia + Recepción Salón Vista Marina) */}
          <CeremonySection scope={guest?.invitation_scope || 'church_and_reception'} />

          {/* Guardar en Google Calendar & Apple Calendar */}
          <CalendarSection />

          {/* Muestra de cariño: Cuenta APAP / Lista de Regalos / Ambas */}
          <GiftsSection giftType={guest?.gift_type || 'bank'} />

          {/* Formulario real de confirmación (RSVP) */}
          <RsvpForm
            initialGuest={guest}
            onGuestVerified={(g) => setGuest(g)}
          />

          {/* Compartir por WhatsApp y enlace */}
          <ShareSection />

          {/* Pie de página con nombres y fecha */}
          <Footer />
        </div>
      </div>
    </main>
  );
}
