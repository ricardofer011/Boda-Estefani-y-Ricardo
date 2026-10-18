'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WEDDING_CONFIG } from '@/config/wedding';
import { AttendanceStatus, RSVPFormData } from '@/lib/types';
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
} from 'lucide-react';
import { OrnamentalDivider } from './Ornaments';

interface VerifiedGuest {
  code: string;
  full_name: string;
  max_guests: number;
  status: string;
}

export function RsvpForm() {
  const [verifiedGuest, setVerifiedGuest] = useState<VerifiedGuest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RSVPFormData>({
    guest_name: '',
    attendance_status: 'attending',
    guest_count: 1,
    companion_names: [],
    dietary_restrictions: '',
    phone: '',
    message: '',
    invitation_code: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<{
    message: string;
    status: AttendanceStatus;
    confirmedCount: number;
    guestName: string;
  } | null>(null);

  // Detectar código de invitación en la URL (ej. ?invitacion=maria-fernandez o ?code=ABC)
  useEffect(() => {
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
        throw new Error(result.error || 'Ocurrió un error al enviar tu confirmación.');
      }

      setSuccessResponse({
        message: result.message,
        status: formData.attendance_status,
        confirmedCount: formData.attendance_status === 'attending' ? formData.guest_count : 0,
        guestName: formData.guest_name,
      });

      if (formData.attendance_status === 'attending') {
        triggerCelebrationConfetti();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error de conexión. Inténtalo de nuevo.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSuccessResponse(null);
    setErrorMessage(null);
  };

  // Generar enlace para avisar por WhatsApp a los novios directamente
  const getCoupleNotificationWhatsAppUrl = () => {
    if (!successResponse) return '';
    const phone = (WEDDING_CONFIG.couple.notificationPhone || '+1 809 000 0000').replace(/[^0-9]/g, '');
    const isAttending = successResponse.status === 'attending';

    const text = isAttending
      ? `¡Hola Estefani & Ricardo! 🕊️ Acabo de confirmar mi asistencia a su boda a través de la invitación digital.\n\n👤 Invitado: ${successResponse.guestName}\n👥 Asistentes confirmados: ${successResponse.confirmedCount} persona(s)\n\n¡Qué bendición acompañarlos este 12 de diciembre!`
      : `¡Hola Estefani & Ricardo! 🕊️ Les escribo para avisarles con mucho cariño que registré mi respuesta en la invitación. Lamentablemente no podré acompañarlos físicamente, pero estarán en mis oraciones. ¡Felicidades!`;

    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
  };

  return (
    <section className="w-full max-w-xl mx-auto my-12 px-4" aria-labelledby="rsvp-heading">
      <div className="text-center mb-6">
        <span className="font-serif-luxury text-xs tracking-[0.25em] uppercase text-[#8C6A35] font-semibold">
          Confirmación de asistencia
        </span>
        <h2 id="rsvp-heading" className="font-serif-luxury text-3xl sm:text-4xl text-[#2A2118] font-normal mt-1">
          R. S. V. P.
        </h2>
        <OrnamentalDivider className="w-48 mx-auto my-3 text-[#B89355]" />
        <p className="font-sans-clean text-xs sm:text-sm text-[#6B5B4D] max-w-md mx-auto">
          Los pases son asignados personalmente por Estefani & Ricardo. Por favor confirma tu asistencia antes del{' '}
          <strong className="text-[#2A2118] font-medium">{WEDDING_CONFIG.rsvp.deadlineFormatted}</strong>.
        </p>
      </div>

      <div className="bg-[#FCFAF6] border border-[#DFC088]/40 rounded-2xl p-6 sm:p-9 shadow-card-elevated relative overflow-hidden">
        {/* Esquina dorada decorativa */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#DFC088]/20 to-transparent pointer-events-none" />

        {/* ==================================================================== */}
        {/* CASO 1: PANTALLA DE ÉXITO TRAS CONFIRMAR */}
        {/* ==================================================================== */}
        {successResponse ? (
          <div className="text-center py-6 animate-fade-in">
            {successResponse.status === 'attending' ? (
              <div className="w-16 h-16 rounded-full bg-[#FAF4E6] border border-[#B89355]/40 flex items-center justify-center mx-auto mb-4 text-[#B89355]">
                <Heart className="w-8 h-8 fill-current" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#F3EDE2] border border-[#B89355]/30 flex items-center justify-center mx-auto mb-4 text-[#8C6A35]">
                <UserCheck className="w-8 h-8" />
              </div>
            )}

            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#2A2118] font-medium mb-2">
              {successResponse.status === 'attending' ? '¡Confirmación recibida!' : 'Respuesta registrada'}
            </h3>

            <p className="font-sans-clean text-sm sm:text-base text-[#6B5B4D] leading-relaxed max-w-md mx-auto mb-5">
              {successResponse.message}
            </p>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#DFC088]/30 max-w-sm mx-auto text-xs text-[#8C6A35] font-sans-clean mb-6 text-center">
              <div>
                Invitado: <strong>{successResponse.guestName}</strong>
              </div>
              {successResponse.status === 'attending' && (
                <div className="mt-1">
                  Pases confirmados: <strong>{successResponse.confirmedCount}</strong>
                </div>
              )}
              <div className="mt-2 text-[11px] text-[#A69584] italic">
                (Esta confirmación ha sido guardada de forma segura y privada para los novios)
              </div>
            </div>

            {/* Botón directo para avisar a Ricardo & Estefani a su WhatsApp */}
            <div className="flex flex-col items-center gap-3">
              <a
                href={getCoupleNotificationWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] text-white hover:bg-[#20ba5a] font-sans-clean text-xs font-semibold tracking-wider inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Avisar confirmación al WhatsApp de los novios</span>
              </a>

              <button
                onClick={resetForm}
                className="text-xs font-sans-clean tracking-wider uppercase text-[#8C6A35] hover:text-[#2A2118] underline underline-offset-4 cursor-pointer pt-2"
              >
                Modificar mi respuesta
              </button>
            </div>
          </div>
        ) : !verifiedGuest ? (
          /* ==================================================================== */
          /* CASO 2: CONSULTAR INVITACIÓN Y PASES ASIGNADOS */
          /* ==================================================================== */
          <div className="py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF4E6] border border-[#B89355]/40 flex items-center justify-center mx-auto mb-3 text-[#B89355]">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#2A2118] font-normal mb-1">
              Consulta tus pases reservados
            </h3>
            <p className="font-sans-clean text-xs sm:text-sm text-[#6B5B4D] max-w-sm mx-auto mb-6">
              Para garantizar una celebración íntima, los pases han sido asignados exclusivamente por los novios. Escribe tu nombre o el código de tu invitación:
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
                  placeholder="Ej. Carmen Rosario Gómez o tu código..."
                  className="w-full px-4 py-3 rounded-xl border border-[#DFC088]/50 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B89355] font-sans-clean shadow-xs"
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
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#DFC088]/50 relative">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-serif-luxury text-[11px] tracking-widest uppercase text-[#8C6A35] font-semibold block">
                    Invitación Personalizada
                  </span>
                  <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#2A2118] font-medium">
                    {verifiedGuest.full_name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setVerifiedGuest(null)}
                  className="text-xs text-[#8C6A35] hover:underline font-sans-clean"
                >
                  Cambiar
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-[#DFC088]/30 flex items-center justify-between">
                <span className="font-sans-clean text-xs text-[#6B5B4D]">
                  Pases reservados por los novios:
                </span>
                <span className="px-3 py-1 rounded-full bg-[#B89355] text-white font-serif-luxury text-xs font-semibold tracking-wider">
                  {verifiedGuest.max_guests} {verifiedGuest.max_guests === 1 ? 'PASE' : 'PASES'}
                </span>
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

            {/* Asistencia: Sí o No */}
            <div>
              <label className="block font-serif-luxury text-sm font-semibold text-[#2A2118] mb-2">
                ¿Nos acompañarás en nuestra ceremonia? <span className="text-[#8C6A35]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleAttendanceChange('attending')}
                  className={`py-3 px-4 rounded-xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    formData.attendance_status === 'attending'
                      ? 'bg-[#B89355] text-white border-[#B89355] shadow-sm font-medium'
                      : 'bg-white/70 border-[#DFC088]/40 text-[#6B5B4D] hover:bg-[#FAF7F2]'
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
                      ? 'bg-[#6B5B4D] text-white border-[#6B5B4D] shadow-sm font-medium'
                      : 'bg-white/70 border-[#DFC088]/40 text-[#6B5B4D] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <UserX className="w-4 h-4 shrink-0" />
                  <span className="font-serif-luxury text-sm tracking-wide">No podré asistir</span>
                </button>
              </div>
            </div>

            {/* Campos condicionales si confirma asistencia */}
            {formData.attendance_status === 'attending' && (
              <div className="space-y-5 pt-2 border-t border-[#DFC088]/20 animate-fade-in">
                {/* Selector de pases limitados por los novios */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-serif-luxury text-sm font-semibold text-[#2A2118]">
                      ¿Cuántos de tus pases utilizarás?
                    </label>
                    <span className="text-xs text-[#8C6A35] font-sans-clean font-medium">
                      Máximo permitido: {maxAllowed}
                    </span>
                  </div>

                  {maxAllowed === 1 ? (
                    <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#DFC088]/30 text-xs text-[#6B5B4D]">
                      Tienes asignado <strong>1 pase individual</strong> en tu honor.
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
                              ? 'bg-[#B89355] text-white border-[#B89355] shadow-xs'
                              : 'bg-white/70 border-[#DFC088]/40 text-[#6B5B4D] hover:bg-white'
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
                  <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-xl border border-[#DFC088]/30">
                    <p className="font-serif-luxury text-xs tracking-wider uppercase text-[#8C6A35] font-semibold">
                      Nombre(s) de tu(s) acompañante(s)
                    </p>
                    {formData.companion_names.map((compName, index) => (
                      <div key={index}>
                        <label
                          htmlFor={`companion_${index}`}
                          className="block font-sans-clean text-xs text-[#6B5B4D] mb-1"
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
                          className="w-full px-3 py-2 rounded-md border border-[#DFC088]/50 bg-white text-xs sm:text-sm text-[#2A2118] focus:outline-none focus:ring-1 focus:ring-[#B89355]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Restricciones alimentarias (opcional) */}
                <div>
                  <label htmlFor="dietary_restrictions" className="block font-serif-luxury text-sm font-semibold text-[#2A2118] mb-1">
                    Restricciones alimentarias o alergias <span className="text-[#8C6A35] text-xs font-normal">(opcional)</span>
                  </label>
                  <input
                    id="dietary_restrictions"
                    type="text"
                    value={formData.dietary_restrictions || ''}
                    onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
                    placeholder="Ej. Celíaco, alergia a mariscos, vegetariano, etc."
                    className="w-full px-4 py-2.5 rounded-lg border border-[#DFC088]/50 bg-white/80 focus:bg-white text-[#2A2118] text-sm focus:outline-none focus:ring-2 focus:ring-[#B89355]/40 transition-all font-sans-clean"
                  />
                </div>
              </div>
            )}

            {/* Teléfono (opcional) */}
            <div>
              <label htmlFor="phone" className="block font-serif-luxury text-sm font-semibold text-[#2A2118] mb-1">
                Teléfono o WhatsApp <span className="text-[#8C6A35] text-xs font-normal">(opcional para avisos)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Ej. +1 (809) 555-0199"
                className="w-full px-4 py-2.5 rounded-lg border border-[#DFC088]/50 bg-white/80 focus:bg-white text-[#2A2118] text-sm focus:outline-none focus:ring-2 focus:ring-[#B89355]/40 transition-all font-sans-clean"
              />
            </div>

            {/* Mensaje para los novios (opcional) */}
            <div>
              <label htmlFor="message" className="block font-serif-luxury text-sm font-semibold text-[#2A2118] mb-1">
                Mensaje o felicitación para Estefani & Ricardo <span className="text-[#8C6A35] text-xs font-normal">(opcional)</span>
              </label>
              <textarea
                id="message"
                rows={3}
                value={formData.message || ''}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Déjanos unas palabras de bendición o cariño..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#DFC088]/50 bg-white/80 focus:bg-white text-[#2A2118] text-sm focus:outline-none focus:ring-2 focus:ring-[#B89355]/40 transition-all font-sans-clean resize-none"
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
