'use client';

import React, { useState, useEffect } from 'react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { Envelope } from '@/components/Envelope';
import { InvitationCard } from '@/components/InvitationCard';
import { BridesmaidInvitationCard } from '@/components/BridesmaidInvitationCard';
import { CouplePhotoSection } from '@/components/CouplePhotoSection';
import { Countdown } from '@/components/Countdown';
import { CeremonySection } from '@/components/CeremonySection';
import { CalendarSection } from '@/components/CalendarSection';
import { GiftsSection } from '@/components/GiftsSection';
import { RsvpForm, VerifiedGuest } from '@/components/RsvpForm';
import { ShareSection } from '@/components/ShareSection';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Footer } from '@/components/Footer';
import { FloralPetalsBackground } from '@/components/FloralPetalsBackground';
import { Mail } from 'lucide-react';

export default function WeddingInvitationPage() {
  const [isOpened, setIsOpened] = useState(false);
  const [guest, setGuest] = useState<VerifiedGuest | null>(null);

  // Buscar información del invitado a partir del enlace personalizado
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const code = (params.get('invitacion') || params.get('code') || params.get('invitado') || params.get('guest') || '').trim();
    const roleParam = (params.get('rol') || params.get('tipo') || params.get('dama') || params.get('damas') || '').trim().toLowerCase();

    if (code.toLowerCase() === 'damas' || code.toLowerCase() === 'dama' || roleParam === 'dama' || roleParam === 'damas' || roleParam === '1' || roleParam === 'true') {
      setGuest({
        code: 'damas',
        full_name: 'Queridas Damas de Honor',
        max_guests: 1,
        status: 'pending',
        gift_type: 'bank',
        invitation_scope: 'church_and_reception',
        invitation_role: 'bridesmaid',
      });
      return;
    }

    if (code) {
      fetch(`/api/guests/verify?code=${encodeURIComponent(code)}`)
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
    <main className="min-h-screen bg-[#FAF6FA] relative overflow-x-hidden selection:bg-[#DFC6E3] selection:text-[#5C3759]">
      {/* Reproductor de música instrumental flotante (siempre montado para precarga y reproducción continua) */}
      <MusicPlayer
        isEnvelopeOpen={isOpened}
        isBridesmaid={guest?.invitation_role === 'bridesmaid'}
      />

      {/* 1. SOBRE ANIMADO INICIAL */}
      {!isOpened && (
        <Envelope
          onOpenComplete={() => setIsOpened(true)}
          coupleNames={WEDDING_CONFIG.couple.names}
          guest={guest}
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

        {/* Lluvia poética continua de pétalos de rosa y florecillas solo cuando se abre el sobre */}
        {isOpened && <FloralPetalsBackground className="z-1" />}

        {/* Barra superior discreta con opción de reabrir el sobre */}
        <header className="relative z-10 w-full py-4 px-6 flex items-center justify-between border-b border-[#AB86B1]/25 bg-[#FAF6FA]/85 backdrop-blur-xs">
          <span className="font-serif-luxury text-sm tracking-widest text-[#5C3759] font-semibold">
            {WEDDING_CONFIG.couple.initials}
          </span>
          <button
            onClick={() => setIsOpened(false)}
            className="inline-flex items-center gap-1.5 font-sans-clean text-xs text-[#784A67] hover:text-[#5C3759] transition-colors cursor-pointer"
            title="Volver a ver el sobre animado"
          >
            <Mail className="w-3.5 h-3.5 text-[#9B709E]" />
            <span>Ver sobre</span>
          </button>
        </header>

        {/* Contenido principal estructurado */}
        <div className="relative z-10 flex flex-col items-center">
          {guest?.invitation_role === 'bridesmaid' ? (
            /* Vista EXCLUSIVA para Damas de Honor: Únicamente la tarjeta con diseño anexado */
            <BridesmaidInvitationCard guest={guest} />
          ) : (
            /* Vista General de Boda Completa */
            <>
              <InvitationCard guest={guest} />
              <CouplePhotoSection />
              <Countdown />
              <CeremonySection scope={guest?.invitation_scope || 'church_and_reception'} />
              <CalendarSection />
              <GiftsSection giftType={guest?.gift_type || 'bank'} />
              <RsvpForm
                initialGuest={guest}
                onGuestVerified={(g) => setGuest(g)}
              />
              <ShareSection />
              <Footer />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
