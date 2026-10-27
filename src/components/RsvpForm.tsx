'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WEDDING_CONFIG } from '@/config/wedding';
import { AttendanceStatus, RSVPFormData, GiftPreferenceType, InvitationScopeType, InvitationRoleType } from '@/lib/types';
import {
  CheckCircle2,
  Heart,
  AlertCircle,
  Loader2,
  UserCheck,
  UserX,
  Search,
  Lock,
  MessageCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { OrnamentalDivider } from './Ornaments';

export interface VerifiedGuest {
  code: string;
  full_name: string;
  max_guests: number;
  status: string;
  gift_type?: GiftPreferenceType;
  invitation_scope?: InvitationScopeType;
  invitation_role?: InvitationRoleType;
}

interface RsvpFormProps {
  initialGuest?: VerifiedGuest | null;
  onGuestVerified?: (guest: VerifiedGuest | null) => void;
}

export function RsvpForm({ initialGuest, onGuestVerified }: RsvpFormProps) {
  const [verifiedGuest, setVerifiedGuest] = useState<VerifiedGuest | null>(initialGuest || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RSVPFormData>({
    guest_name: initialGuest?.full_name || '',
    attendance_status: 'attending',
    guest_count: initialGuest?.max_guests || 1,
    companion_names: initialGuest ? Array(Math.max(0, initialGuest.max_guests - 1)).fill('') : [],
    dietary_restrictions: '',
    phone: '',
    message: '',
    invitation_code: initialGuest?.code || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<{
    message: string;
    status: AttendanceStatus;
    confirmedCount: number;
    guestName: string;
  } | null>(null);

  // Sincronizar si cambia initialGuest desde el componente padre
  useEffect(() => {
    if (initialGuest) {
      setVerifiedGuest(initialGuest);
      setFormData((prev) => ({
        ...prev,
        guest_name: initialGuest.full_name,
        invitation_code: initialGuest.code,
        guest_count: initialGuest.max_guests,
        companion_names: Array(Math.max(0, initialGuest.max_guests - 1)).fill(''),
      }));
    }
  }, [initialGuest]);

  // Si no se pasó initialGuest, detectar si hay query param en la URL
  useEffect(() => {
    if (initialGuest) return;
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('invitacion') || params.get('code') || params.get('invitado');

    if (code) {
      lookupGuest(code);
    }
  }, []);

  const lookupGuest = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await fetch(`/api/guests/verify?code=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const guest: VerifiedGuest = data.data;
        setVerifiedGuest(guest);
        if (onGuestVerified) {
          onGuestVerified(guest);
        }
        setFormData((prev) => ({
          ...prev,
          guest_name: guest.full_name,
          invitation_code: guest.code,
          guest_count: guest.max_guests,
          companion_names: Array(Math.max(0, guest.max_guests - 1)).fill(''),
        }));
      } else {
        setSearchError(data.error || 'No encontramos una invitación con ese nombre o código.');
      }
    } catch {
      setSearchError('Error al consultar la invitación. Inténtalo de nuevo.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    lookupGuest(searchQuery);
  };

  const maxAllowed = verifiedGuest ? verifiedGuest.max_guests : 1;
  const isChurchOnly = verifiedGuest?.invitation_scope === 'church_only';

  const handleAttendanceChange = (status: AttendanceStatus) => {
    setFormData((prev) => ({
      ...prev,
      attendance_status: status,
      guest_count: status === 'declined' ? 1 : prev.guest_count,
    }));
  };

  const handleCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(maxAllowed, count));
    const newCompanions = [...formData.companion_names];

    const requiredCompanionInputs = validCount - 1;
    while (newCompanions.length < requiredCompanionInputs) {
      newCompanions.push('');
    }
    while (newCompanions.length > requiredCompanionInputs) {
      newCompanions.pop();
    }

    setFormData((prev) => ({
      ...prev,
      guest_count: validCount,
      companion_names: newCompanions,
    }));
  };

  const handleCompanionNameChange = (index: number, value: string) => {
    const updated = [...formData.companion_names];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      companion_names: updated,
    }));
  };

  const triggerCelebrationConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#B89355', '#E6D7C3', '#FAF7F2'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignorar si no está soportado
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.guest_name.trim() || formData.guest_name.trim().length < 2) {
      setErrorMessage('Por favor verifica el nombre del invitado.');
      return;
    }

    if (formData.attendance_status === 'attending' && formData.guest_count > 1) {
      const emptyCompanions = formData.companion_names.filter((c) => !c.trim());
      if (emptyCompanions.length > 0) {
        setErrorMessage('Por favor escribe los nombres de tus acompañantes.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo guardar la confirmación. Por favor inténtalo de nuevo.');
      }

      setSuccessResponse({
        message: result.message || 'Respuesta registrada con éxito.',
        status: formData.attendance_status,
        confirmedCount: formData.attendance_status === 'attending' ? formData.guest_count : 0,
        guestName: formData.guest_name,
      });

      if (formData.attendance_status === 'attending') {
        triggerCelebrationConfetti();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error inesperado. Inténtalo de nuevo.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessResponse(null);
    setErrorMessage(null);
  };

  const handleClearGuest = () => {
    setVerifiedGuest(null);
    if (onGuestVerified) onGuestVerified(null);
    setFormData({
      guest_name: '',
      attendance_status: 'attending',
      guest_count: 1,
      companion_names: [],
      dietary_restrictions: '',
      phone: '',
      message: '',
      invitation_code: '',
    });
  };

  const couplePhone = WEDDING_CONFIG.couple.notificationPhone || '+1 809 000 0000';
  const cleanPhone = couplePhone.replace(/[^0-9]/g, '');
  const isAttending = successResponse?.status === 'attending';

  const isDama = verifiedGuest?.invitation_role === 'bridesmaid';
  const guestMsg = isAttending
    ? isDama
      ? `¡Hola Estefani & Ricardo! 🌸✨ ¡Acepto con todo el corazón ser su Dama de Honor y confirmo mi asistencia a su boda! (${successResponse.guestName}). ¡Nos vemos el 12 de diciembre!`
      : `¡Hola Estefani & Ricardo! 🕊️ Acabo de confirmar mi asistencia a su boda (${successResponse.guestName}, ${successResponse.confirmedCount} ${successResponse.confirmedCount === 1 ? 'persona' : 'personas'}). ¡Nos vemos el 12 de diciembre!`
    : `¡Hola Estefani & Ricardo! 🕊️ Les escribe ${successResponse?.guestName}. Lamentablemente no podré acompañarlos físicamente, pero les deseo de corazón todas las bendiciones del cielo en su matrimonio.`;

  const whatsappDirectUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(guestMsg)}`;

  return (
    <section className="w-full max-w-xl mx-auto my-12 px-4" aria-labelledby="rsvp-heading" id="confirmar">
      <div className="text-center mb-6">
        <span className="font-serif-luxury text-xs tracking-[0.25em] uppercase text-[#784A67] font-semibold">
          {isDama ? '🌸 Corte de Honor • Damas' : 'Confirmación de Asistencia'}
        </span>
        <h2 id="rsvp-heading" className="font-serif-luxury text-2xl sm:text-3xl text-[#2A1C28] font-normal mt-1">
          {isDama ? '¿Aceptas ser nuestra Dama de Honor?' : 'Confirma tu presencia'}
        </h2>
        <OrnamentalDivider className="w-48 mx-auto my-3 text-[#9B709E]" />
        <p className="font-serif-luxury text-xs sm:text-sm text-[#6A5365] max-w-md mx-auto italic">
          Por favor confírmanos antes del{' '}
          <strong className="text-[#5C3759] font-semibold">{WEDDING_CONFIG.rsvp.deadlineFormatted}</strong>{' '}
          para coordinar todos los preparativos de la boda.
        </p>
      </div>

      <div className="bg-[#FCF9FD] border border-[#AB86B1]/40 rounded-2xl p-6 sm:p-8 shadow-card-elevated card-paper-texture">
        {/* ==================================================================== */}
        {/* CASO 1: RESPUESTA EXITOSA REGISTRADA */}
        {/* ==================================================================== */}
        {successResponse ? (
          <div className="text-center py-6 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif-luxury text-2xl text-[#2A1C28] font-medium mb-2">
              {isAttending ? '¡Será un honor contar contigo!' : 'Agradecemos tu respuesta'}
            </h3>

            <p className="font-sans-clean text-sm text-[#6A5365] max-w-md mx-auto mb-4 leading-relaxed">
              {successResponse.message}
            </p>

            <div className="p-4 rounded-xl bg-[#F9F2FA] border border-[#AB86B1]/35 max-w-sm mx-auto mb-6 text-xs text-[#2A1C28] font-sans-clean">
              <p className="font-semibold text-[#784A67] mb-1 font-serif-luxury text-sm">
                Resumen de confirmación
              </p>
              <p><strong>Invitado:</strong> {successResponse.guestName}</p>
              <p>
                <strong>Asistencia:</strong>{' '}
                <span className={isAttending ? 'text-emerald-700 font-semibold' : 'text-stone-600 font-semibold'}>
                  {isAttending ? `Confirmada (${successResponse.confirmedCount} ${successResponse.confirmedCount === 1 ? 'persona' : 'personas'})` : 'No asistirá'}
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans-clean text-xs font-semibold tracking-wider transition-all duration-300 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Avisar a los novios por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-3 rounded-full border border-[#AB86B1]/40 text-xs font-sans-clean text-[#6A5365] hover:bg-[#F9F2FA] transition-colors cursor-pointer"
              >
                Modificar respuesta
              </button>
            </div>
          </div>
        ) : !verifiedGuest ? (
          /* ==================================================================== */
          /* CASO 2: CONSULTAR INVITACIÓN Y PASES ASIGNADOS */
          /* ==================================================================== */
          <div className="py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F9F2FA] border border-[#AB86B1]/40 flex items-center justify-center mx-auto mb-3 text-[#784A67]">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#2A1C28] font-normal mb-1">
              Consulta tus pases reservados
            </h3>
            <p className="font-sans-clean text-xs sm:text-sm text-[#6A5365] max-w-sm mx-auto mb-6">
              Para garantizar una celebración solemne y organizada, cada invitación ha sido asignada con una cantidad fija de pases. Escribe tu nombre o código de invitación:
            </p>

            <form onSubmit={handleManualSearch} className="space-y-4 max-w-md mx-auto">
              {searchError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{searchError}</span>
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej. Familia Rodríguez o tu código..."
                  className="w-full px-4 py-3 rounded-xl border border-[#AB86B1]/40 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#9B709E] font-sans-clean shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="gold-button w-full py-3 rounded-full font-serif-luxury text-sm tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verificando pases...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Consultar mi invitación</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* ==================================================================== */
          /* CASO 3: FORMULARIO CON PASES ASIGNADOS Y CONTROLADOS */
          /* ==================================================================== */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tarjeta de bienvenida personalizada con los pases autorizados */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#F9F2FA] to-[#F1E5F3] border border-[#AB86B1]/50 relative shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-serif-luxury text-[11px] tracking-widest uppercase text-[#784A67] font-semibold block">
                    Invitación Personalizada
                  </span>
                  <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#2A1C28] font-medium">
                    {verifiedGuest.full_name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleClearGuest}
                  className="text-xs text-[#784A67] hover:underline font-sans-clean"
                >
                  Cambiar
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-[#AB86B1]/30 flex items-center justify-between">
                <span className="font-sans-clean text-xs text-[#6A5365]">
                  Pases reservados en su honor:
                </span>
                <span className="px-3 py-1 rounded-full bg-[#5C3759] text-[#DFC6E3] font-serif-luxury text-xs font-semibold tracking-wider shadow-2xs">
                  {verifiedGuest.max_guests} {verifiedGuest.max_guests === 1 ? 'PASE PERSONAL' : 'PASES'}
                </span>
              </div>

              {/* Protocolo formal estricto */}
              <div className="mt-3 pt-2.5 border-t border-[#AB86B1]/30">
                <p className="font-serif-luxury text-[11px] text-[#6A5365] italic leading-relaxed">
                  «Rogamos tomar en consideración que esta invitación es personal e intransferible y aplica estrictamente para el número de personas indicado. Agradecemos su generosa comprensión.»
                </p>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-shake"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Asistencia: Sí o No adaptado al alcance */}
            <div>
              <label className="block font-serif-luxury text-sm font-semibold text-[#2A1C28] mb-2">
                {isChurchOnly
                  ? '¿Nos acompañarás en la ceremonia religiosa?'
                  : '¿Nos acompañarás en nuestra ceremonia y recepción?'} <span className="text-[#784A67]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleAttendanceChange('attending')}
                  className={`py-3 px-4 rounded-xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    formData.attendance_status === 'attending'
                      ? 'bg-[#5C3759] text-white border-[#5C3759] shadow-sm font-medium'
                      : 'bg-white/80 border-[#AB86B1]/40 text-[#6A5365] hover:bg-[#F9F2FA]'
                  }`}
                >
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span className="font-serif-luxury text-sm tracking-wide">Sí, asistiré</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAttendanceChange('declined')}
                  className={`py-3 px-4 rounded-xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    formData.attendance_status === 'declined'
                      ? 'bg-[#784A67] text-white border-[#784A67] shadow-sm font-medium'
                      : 'bg-white/80 border-[#AB86B1]/40 text-[#6A5365] hover:bg-[#F9F2FA]'
                  }`}
                >
                  <UserX className="w-4 h-4 shrink-0" />
                  <span className="font-serif-luxury text-sm tracking-wide">No podré asistir</span>
                </button>
              </div>
            </div>

            {/* Campos condicionales si confirma asistencia */}
            {formData.attendance_status === 'attending' && (
              <div className="space-y-5 pt-2 border-t border-[#AB86B1]/20 animate-fade-in">
                {/* Selector de pases limitados por los novios */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-serif-luxury text-sm font-semibold text-[#2A1C28]">
                      ¿Cuántos de tus pases utilizarás?
                    </label>
                    <span className="text-xs text-[#784A67] font-sans-clean font-medium">
                      Máximo autorizado: {maxAllowed}
                    </span>
                  </div>

                  {maxAllowed === 1 ? (
                    <div className="p-3 bg-[#F9F2FA] rounded-lg border border-[#AB86B1]/30 text-xs text-[#6A5365]">
                      Tienes asignado <strong>1 pase personal</strong> en tu honor.
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {Array.from({ length: maxAllowed }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleCountChange(num)}
                          className={`flex-1 py-2.5 rounded-lg border font-serif-luxury text-sm font-medium transition-all cursor-pointer ${
                            formData.guest_count === num
                              ? 'bg-[#5C3759] text-white border-[#5C3759] shadow-xs'
                              : 'bg-white/80 border-[#AB86B1]/40 text-[#6A5365] hover:bg-white'
                          }`}
                        >
                          {num} {num === 1 ? 'persona' : 'personas'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Nombres de acompañantes si confirma más de 1 persona */}
                {formData.guest_count > 1 && (
                  <div className="space-y-3 bg-[#F9F2FA] p-4 rounded-xl border border-[#AB86B1]/30">
                    <p className="font-serif-luxury text-xs tracking-wider uppercase text-[#784A67] font-semibold">
                      Nombre(s) de tu(s) acompañante(s)
                    </p>
                    {formData.companion_names.map((compName, index) => (
                      <div key={index}>
                        <label
                          htmlFor={`companion_${index}`}
                          className="block font-sans-clean text-xs text-[#6A5365] mb-1"
                        >
                          Acompañante #{index + 1}
                        </label>
                        <input
                          id={`companion_${index}`}
                          type="text"
                          required
                          value={compName}
                          onChange={(e) => handleCompanionNameChange(index, e.target.value)}
                          placeholder="Nombre y apellido completo"
                          className="w-full px-3 py-2 rounded-md border border-[#AB86B1]/40 bg-white text-xs sm:text-sm text-[#2A1C28] focus:outline-none focus:ring-1 focus:ring-[#9B709E]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Restricciones alimentarias (opcional) */}
                <div>
                  <label htmlFor="dietary_restrictions" className="block font-serif-luxury text-sm font-semibold text-[#2A1C28] mb-1">
                    Restricciones alimentarias o alergias <span className="text-[#784A67] text-xs font-normal">(opcional)</span>
                  </label>
                  <input
                    id="dietary_restrictions"
                    type="text"
                    value={formData.dietary_restrictions || ''}
                    onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
                    placeholder="Ej. Celíaco, alergia a mariscos, vegetariano, etc."
                    className="w-full px-4 py-2.5 rounded-lg border border-[#AB86B1]/40 bg-white/80 focus:bg-white text-[#2A1C28] text-sm focus:outline-none focus:ring-2 focus:ring-[#9B709E]/40 transition-all font-sans-clean"
                  />
                </div>
              </div>
            )}

            {/* Teléfono (opcional) */}
            <div>
              <label htmlFor="phone" className="block font-serif-luxury text-sm font-semibold text-[#2A1C28] mb-1">
                Teléfono o WhatsApp <span className="text-[#784A67] text-xs font-normal">(opcional para avisos)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Ej. +1 (809) 555-0199"
                className="w-full px-4 py-2.5 rounded-lg border border-[#AB86B1]/40 bg-white/80 focus:bg-white text-[#2A1C28] text-sm focus:outline-none focus:ring-2 focus:ring-[#9B709E]/40 transition-all font-sans-clean"
              />
            </div>

            {/* Mensaje para los novios (opcional) */}
            <div>
              <label htmlFor="message" className="block font-serif-luxury text-sm font-semibold text-[#2A1C28] mb-1">
                Mensaje o felicitación para Estefani & Ricardo <span className="text-[#784A67] text-xs font-normal">(opcional)</span>
              </label>
              <textarea
                id="message"
                rows={3}
                value={formData.message || ''}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Déjanos unas palabras de bendición o cariño..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#AB86B1]/40 bg-white/80 focus:bg-white text-[#2A1C28] text-sm focus:outline-none focus:ring-2 focus:ring-[#9B709E]/40 transition-all font-sans-clean resize-none"
              />
            </div>

            {/* Botón de confirmación */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="gold-button w-full py-3.5 rounded-full font-serif-luxury text-base tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Guardando respuesta...</span>
                  </>
                ) : (
                  <span>Confirmar respuesta</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
