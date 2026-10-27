'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { VerifiedGuest } from './RsvpForm';
import {
  Heart,
  Sparkles,
  Maximize2,
  X,
  Download,
  Check,
  Send,
  Loader2,
  MessageCircle,
  HeartHandshake,
  User,
  CheckCircle2,
} from 'lucide-react';

interface BridesmaidInvitationCardProps {
  guest?: VerifiedGuest | null;
}

export function BridesmaidInvitationCard({ guest }: BridesmaidInvitationCardProps) {
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Estados de confirmación de la dama
  const initialName =
    guest?.full_name && guest.full_name !== 'Queridas Damas de Honor' ? guest.full_name : '';
  const [damaName, setDamaName] = useState(initialName);
  const [attendance, setAttendance] = useState<'attending' | 'declined'>('attending');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    attendance: 'attending' | 'declined';
    message: string;
  } | null>(null);

  // Disparar confetti festivo
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#5C3759', '#784A67', '#9B709E', '#DFC6E3', '#DFC088', '#FFFFFF'],
        ticks: 200,
        gravity: 0.7,
        scalar: 1.2,
      });
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = damaName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMsg('Por favor, escribe tu nombre para que Estefani sepa quién responde.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_name: trimmedName,
          attendance_status: attendance,
          guest_count: 1,
          message: message.trim(),
          invitation_code: guest?.code || 'damas',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se pudo registrar tu respuesta.');
      }

      setSubmittedData({
        name: trimmedName,
        attendance,
        message: message.trim(),
      });
      setIsSubmitted(true);

      if (attendance === 'attending') {
        triggerCelebration();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al enviar tu respuesta.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enlace para compartir la respuesta por WhatsApp
  const whatsappText =
    submittedData?.attendance === 'attending'
      ? `¡Hola Estefani! 🌸💕 Acabo de confirmar en la invitación: ¡SÍ, acepto con todo mi corazón ser tu Dama de Boda! 👰✨\n\n${
          submittedData.message ? `"${submittedData.message}"\n\n` : ''
        }Con mucho cariño,\n${submittedData.name}`
      : `Hola Estefani, con todo mi cariño he recibido tu hermosa invitación de dama. Por motivos de fuerza mayor no podré acompañarte, pero te deseo a ti y a Ricardo toda la felicidad y bendición de Dios. 💕\n\n${
          submittedData?.message ? `"${submittedData.message}"\n\n` : ''
        }Con cariño,\n${submittedData?.name || ''}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="w-full max-w-xl mx-auto my-4 sm:my-8 px-3 sm:px-4 flex flex-col items-center">
      {/* 1. TARJETA EXCLUSIVA CON EL DISEÑO ANEXADO ÚNICAMENTE */}
      <div className="relative w-full group">
        {/* Resplandor sutil perla y lavanda alrededor de la tarjeta */}
        <div
          className="absolute -inset-1.5 sm:-inset-2 bg-gradient-to-r from-[#DFC6E3]/40 via-[#AB86B1]/25 to-[#DFC6E3]/40 rounded-[28px] sm:rounded-[36px] blur-xl opacity-90 pointer-events-none"
          aria-hidden="true"
        />

        {/* Marco de papelería física fina con bisel dorado */}
        <div className="relative bg-[#FCF8FC] p-1.5 sm:p-2.5 rounded-2xl sm:rounded-3xl border-2 border-[#DFC088]/60 shadow-2xl shadow-[#5C3759]/25 overflow-hidden card-paper-texture">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-[#AB86B1]/30 bg-white shadow-inner">
            {/* Imagen oficial con el diseño exacto de las damas */}
            <div
              className="relative w-full aspect-[682/1024] cursor-pointer"
              onClick={() => setShowFullscreen(true)}
              title="Toca para ampliar en pantalla completa"
            >
              <Image
                src="/images/invitacion-damas.jpg"
                alt="¿Quieres ser una de mis Damas de Boda? • Estefani Cedeño"
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

        {/* Botón para guardar la tarjeta como recuerdo */}
        <div className="mt-2.5 flex items-center justify-center">
          <a
            href="/images/invitacion-damas.jpg"
            download="Invitacion-Dama-de-Boda-Estefani-Cedeno.jpg"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 hover:bg-white border border-[#AB86B1]/40 text-[#5C3759] text-xs font-sans-clean transition-all cursor-pointer shadow-xs active:scale-95"
            title="Descargar invitación de recuerdo"
          >
            <Download className="w-3.5 h-3.5 text-[#784A67]" />
            <span>Guardar tarjeta de recuerdo</span>
          </a>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. MÓDULO DE CONFIRMACIÓN CON BOTONES DE SÍ / NO Y MENSAJE LINDO      */}
      {/* ==================================================================== */}
      <div className="w-full mt-6 sm:mt-8 p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#FCF8FC] to-[#FAF2FB] border-2 border-[#AB86B1]/40 shadow-card-elevated text-center relative overflow-hidden card-paper-texture">
        {/* Decoración botánica de fondo */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-radial from-[#DFC6E3]/40 to-transparent pointer-events-none blur-xl"
          aria-hidden="true"
        />

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col items-center">
            {/* Encabezado romántico */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-[#AB86B1]/35 text-[#784A67] shadow-2xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#9B709E] animate-pulse" />
              <span className="font-serif-luxury text-[11px] sm:text-xs tracking-[0.22em] uppercase font-semibold text-[#5C3759]">
                Respuesta a Estefani
              </span>
              <Heart className="w-3 h-3 fill-[#9B709E] text-[#9B709E]" />
            </div>

            <h3 className="font-script-romantic text-3xl sm:text-4xl text-[#5C3759] leading-tight my-1">
              ¿Aceptarías ser una de mis damas de boda?
            </h3>
            <p className="font-serif-luxury text-xs sm:text-sm text-[#784A67] italic mb-5">
              Por favor, selecciona tu respuesta y dedícale un lindo mensaje a la novia
            </p>

            {/* BOTONES INTERACTIVOS DE SÍ / NO MUY BONITOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-5">
              {/* Botón SÍ */}
              <button
                type="button"
                onClick={() => setAttendance('attending')}
                className={`relative flex items-center justify-center gap-2.5 p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer active:scale-98 ${
                  attendance === 'attending'
                    ? 'bg-gradient-to-r from-[#784A67] via-[#5C3759] to-[#784A67] text-white border-[#DFC088] shadow-lg shadow-[#5C3759]/25 ring-2 ring-[#DFC088]/60 scale-[1.02]'
                    : 'bg-white/80 text-[#5C3759] border-[#AB86B1]/35 hover:border-[#784A67] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
                  <Heart
                    className={`w-4 h-4 ${
                      attendance === 'attending' ? 'fill-white text-white animate-pulse' : 'text-[#784A67]'
                    }`}
                  />
                </div>
                <div className="text-left">
                  <p className="font-serif-luxury text-sm sm:text-base font-semibold leading-tight">
                    ¡Sí, acepto!
                  </p>
                  <p
                    className={`text-[10px] sm:text-[11px] font-sans-clean leading-none mt-0.5 ${
                      attendance === 'attending' ? 'text-[#DFC6E3]' : 'text-[#784A67]'
                    }`}
                  >
                    Con todo mi corazón
                  </p>
                </div>
                {attendance === 'attending' && (
                  <Check className="w-4 h-4 ml-auto text-[#DFC088]" />
                )}
              </button>

              {/* Botón NO */}
              <button
                type="button"
                onClick={() => setAttendance('declined')}
                className={`relative flex items-center justify-center gap-2.5 p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer active:scale-98 ${
                  attendance === 'declined'
                    ? 'bg-[#5C3759]/15 border-[#784A67] text-[#2A1C28] shadow-md ring-2 ring-[#784A67]/40 scale-[1.01]'
                    : 'bg-white/60 text-[#6A5365] border-[#AB86B1]/30 hover:border-[#AB86B1] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-black/5">
                  <HeartHandshake className="w-4 h-4 text-[#784A67]" />
                </div>
                <div className="text-left">
                  <p className="font-serif-luxury text-sm sm:text-base font-medium leading-tight">
                    No podré acompañarte
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-sans-clean text-[#784A67] leading-none mt-0.5">
                    Te acompaño de corazón
                  </p>
                </div>
                {attendance === 'declined' && (
                  <Check className="w-4 h-4 ml-auto text-[#784A67]" />
                )}
              </button>
            </div>

            {/* CAMPO DE NOMBRE DE LA DAMA */}
            <div className="w-full mb-4 text-left">
              <label
                htmlFor="dama-name"
                className="block font-serif-luxury text-xs text-[#5C3759] font-medium mb-1.5 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#9B709E]" />
                <span>Tu Nombre y Apellido:</span>
              </label>
              <input
                id="dama-name"
                type="text"
                required
                value={damaName}
                onChange={(e) => setDamaName(e.target.value)}
                placeholder="Escribe tu nombre completo..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#AB86B1]/40 text-[#2A1C28] placeholder-[#9B709E]/50 font-sans-clean text-sm focus:outline-hidden focus:border-[#784A67] focus:ring-2 focus:ring-[#DFC6E3]/60 transition-all shadow-xs"
              />
            </div>

            {/* CAMPO PARA LINDO MENSAJE */}
            <div className="w-full mb-5 text-left">
              <label
                htmlFor="dama-message"
                className="block font-serif-luxury text-xs text-[#5C3759] font-medium mb-1.5 flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-[#9B709E] fill-[#9B709E]/30" />
                <span>Dedícale un lindo mensaje a Estefani:</span>
              </label>
              <textarea
                id="dama-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Estefani querida, qué emoción tan grande... cuenta conmigo para acompañarte en cada paso hacia el altar 💕"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#AB86B1]/40 text-[#2A1C28] placeholder-[#9B709E]/50 font-sans-clean text-sm focus:outline-hidden focus:border-[#784A67] focus:ring-2 focus:ring-[#DFC6E3]/60 transition-all resize-none shadow-xs"
              />
            </div>

            {/* MENSAJE DE ERROR SI APLICA */}
            {errorMsg && (
              <div className="w-full mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans-clean">
                {errorMsg}
              </div>
            )}

            {/* BOTÓN DE ENVÍO */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#5C3759] via-[#784A67] to-[#5C3759] hover:brightness-110 text-white font-serif-luxury font-semibold text-sm sm:text-base tracking-wider uppercase transition-all duration-300 shadow-lg shadow-[#5C3759]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#DFC088]" />
                  <span>Enviando respuesta...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#DFC088]" />
                  <span>Confirmar mi respuesta con amor</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* ============================================================== */
          /* ESTADO DE ÉXITO TRAS ENVIAR LA RESPUESTA                       */
          /* ============================================================== */
          <div className="relative z-10 flex flex-col items-center py-2 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-[#5C3759] text-[#DFC088] flex items-center justify-center shadow-lg mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="font-script-romantic text-3xl sm:text-4xl text-[#5C3759] mb-1 leading-tight">
              {submittedData?.attendance === 'attending'
                ? '¡Qué alegría tan inmensa!'
                : 'Gracias de corazón'}
            </h3>

            <p className="font-serif-luxury text-sm text-[#2A1C28] font-medium max-w-md mx-auto">
              {submittedData?.attendance === 'attending'
                ? `¡Gracias, ${submittedData?.name}! Tu confirmación como Dama de Boda ha sido guardada en el corazón de Estefani.`
                : `Gracias por responder, ${submittedData?.name}. Tus palabras han sido recibidas con mucho cariño.`}
            </p>

            {submittedData?.message && (
              <div className="w-full my-4 p-3.5 rounded-2xl bg-white/80 border border-[#AB86B1]/35 text-left text-xs sm:text-sm font-serif-luxury italic text-[#5C3759] shadow-2xs">
                “{submittedData.message}”
              </div>
            )}

            {/* BOTÓN PARA ENVIAR TAMBIÉN POR WHATSAPP DIRECTAMENTE */}
            <div className="w-full mt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-sans-clean font-semibold shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar también por WhatsApp a Estefani</span>
              </a>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-sans-clean text-[#784A67] hover:text-[#5C3759] hover:underline cursor-pointer"
              >
                Modificar mi respuesta
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 3. MODAL FULLSCREEN / LIGHTBOX DE ALTA RESOLUCIÓN                    */}
      {/* ==================================================================== */}
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
              <span>Invitación Oficial • Damas de Boda</span>
              <a
                href="/images/invitacion-damas.jpg"
                download="Invitacion-Dama-de-Boda-Estefani-Cedeno.jpg"
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
