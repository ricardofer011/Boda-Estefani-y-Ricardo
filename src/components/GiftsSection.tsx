'use client';

import React, { useState } from 'react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { FloralCornerFlourish, OrnamentalDivider } from './Ornaments';
import { Gift, Copy, Check, Building2, Heart, Sparkles, ExternalLink, ShoppingBag } from 'lucide-react';
import { GiftPreferenceType } from '@/lib/types';

interface GiftsSectionProps {
  giftType?: GiftPreferenceType;
}

export function GiftsSection({ giftType = 'both' }: GiftsSectionProps) {
  const { gifts } = WEDDING_CONFIG;
  const [copied, setCopied] = useState(false);
  const [copiedStore, setCopiedStore] = useState<string | null>(null);

  const showBank = giftType === 'both' || giftType === 'bank';
  const showRegistry = giftType === 'both' || giftType === 'registry';

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(gifts.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = gifts.accountNumber;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleCopyStoreCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedStore(code);
      setTimeout(() => setCopiedStore(null), 3000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = code;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedStore(code);
      setTimeout(() => setCopiedStore(null), 3000);
    }
  };

  return (
    <section className="w-full max-w-xl mx-auto my-8 px-4" id="regalos">
      {/* Tarjeta de papelería nupcial con acabado artesanal */}
      <div className="relative bg-[#FCF9FD] border-2 border-[#AB86B1]/40 rounded-3xl p-6 sm:p-10 shadow-card-elevated text-center overflow-hidden card-paper-texture">
        {/* Esquinas botánicas con capullos de rosas y hojitas en lila, malva y oro */}
        <FloralCornerFlourish position="top-left" />
        <FloralCornerFlourish position="top-right" />
        <FloralCornerFlourish position="bottom-left" />
        <FloralCornerFlourish position="bottom-right" />

        {/* Encabezado elegante y sutil */}
        <div className="flex flex-col items-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FBF5FC] border border-[#AB86B1]/45 mb-2.5 shadow-2xs">
            <Gift className="w-3.5 h-3.5 text-[#9B709E]" />
            <span className="font-serif-luxury text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#784A67] font-semibold">
              {gifts.badge}
            </span>
          </div>

          <h2 className="font-serif-luxury text-2xl sm:text-4xl text-[#2A1C28] font-normal tracking-wide royal-text-gradient leading-tight">
            {showBank && showRegistry
              ? 'Lluvia de Sobres & Mesa de Regalos'
              : showBank
              ? gifts.title
              : gifts.registry?.title || 'Mesa de Regalos'}
          </h2>

          <OrnamentalDivider className="w-32 mx-auto my-2.5 text-[#9B709E]" />

          <p className="font-serif-luxury text-xs sm:text-sm text-[#6A5365] max-w-md mx-auto leading-relaxed italic mt-1">
            “{showBank && showRegistry
              ? 'El regalo más hermoso para nosotros es contar con tu presencia y bendición en el inicio de nuestro matrimonio. Si deseas tener un detalle para acompañar la construcción de nuestro nuevo hogar, ponemos a tu disposición nuestra cuenta en común y nuestra lista de regalos en Casa Cuesta:'
              : showBank
              ? gifts.message
              : gifts.registry?.message}”
          </p>
        </div>

        <div className="space-y-5 max-w-md mx-auto">
          {/* ==================================================================== */}
          {/* 1. CUENTA BANCARIA (APAP / Lluvia de Sobres) */}
          {/* ==================================================================== */}
          {showBank && (
            <div className="relative p-5 sm:p-7 rounded-2xl bg-gradient-to-b from-[#F9F2FA] to-[#F1E5F3] border border-[#AB86B1]/45 shadow-xs text-left animate-fade-in">
              {/* Nombre de la entidad bancaria */}
              <div className="flex items-start gap-3 pb-4 border-b border-[#AB86B1]/30">
                <div className="w-10 h-10 rounded-xl bg-[#FCF9FD] border border-[#AB86B1]/40 flex items-center justify-center shrink-0 shadow-2xs">
                  <Building2 className="w-5 h-5 text-[#784A67]" />
                </div>
                <div>
                  <p className="font-sans-clean text-[10px] tracking-widest uppercase text-[#784A67] font-semibold">
                    Lluvia de Sobres • Entidad Bancaria
                  </p>
                  <h3 className="font-serif-luxury text-base sm:text-lg text-[#2A1C28] font-medium leading-tight mt-0.5">
                    {gifts.bankName}
                  </h3>
                  <p className="font-sans-clean text-xs text-[#6A5365] mt-0.5">
                    {gifts.accountType} • {gifts.currency}
                  </p>
                </div>
              </div>

              {/* Bloque central del número de cuenta con botón de copiar */}
              <div className="my-4 py-3.5 px-4 rounded-xl bg-[#FCF9FD] border border-[#AB86B1]/35 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
                <div>
                  <span className="font-sans-clean text-[10px] tracking-wider uppercase text-[#784A67] block font-semibold">
                    Número de Cuenta
                  </span>
                  <span className="font-mono text-lg sm:text-xl font-bold tracking-wider text-[#5C3759] select-all">
                    {gifts.accountNumber}
                  </span>
                </div>

                <button
                  onClick={handleCopyAccount}
                  type="button"
                  className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full font-sans-clean text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer shadow-xs active:scale-95 shrink-0 ${
                    copied
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-[#F5EBF7] hover:bg-[#EBDCF0] text-[#5C3759] border border-[#AB86B1]/50'
                  }`}
                  title="Copiar número de cuenta al portapapeles"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#9B709E]" />
                      <span>Copiar cuenta</span>
                    </>
                  )}
                </button>
              </div>

              {/* Titulares de la cuenta */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#6A5365]">
                <span className="font-sans-clean text-[11px] uppercase tracking-wider text-[#784A67] font-semibold">
                  Titulares:
                </span>
                <span className="font-serif-luxury text-sm font-semibold text-[#2A1C28] flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-[#9B709E] fill-[#9B709E]/40" />
                  <span>{gifts.holders}</span>
                </span>
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* 2. LISTA DE REGALOS (Tiendas y Mesas de Bodas) */}
          {/* ==================================================================== */}
          {showRegistry && gifts.registry && (
            <div className="space-y-3.5 text-left animate-fade-in">
              {gifts.registry.stores.map((store, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#F9F2FA] to-[#F1E5F3] border border-[#AB86B1]/45 shadow-xs flex flex-col gap-4"
                >
                  {/* Encabezado de la tienda */}
                  <div className="flex items-start gap-3.5 pb-3 border-b border-[#AB86B1]/30">
                    <div className="w-11 h-11 rounded-xl bg-[#FCF9FD] border border-[#AB86B1]/40 flex items-center justify-center shrink-0 shadow-2xs">
                      <ShoppingBag className="w-5 h-5 text-[#784A67]" />
                    </div>
                    <div>
                      <span className="font-sans-clean text-[10px] tracking-widest uppercase text-[#784A67] font-semibold block">
                        Tienda Departamental & Mesa de Bodas
                      </span>
                      <h3 className="font-serif-luxury text-lg sm:text-xl font-medium text-[#2A1C28] leading-tight mt-0.5">
                        {store.name}
                      </h3>
                      <p className="font-sans-clean text-xs text-[#6A5365] mt-0.5">
                        {store.description}
                      </p>
                    </div>
                  </div>

                  {/* Código de referencia / evento con botón de copiar */}
                  <div className="py-3 px-4 rounded-xl bg-[#FCF9FD] border border-[#AB86B1]/35 flex items-center justify-between gap-3 shadow-2xs">
                    <div>
                      <span className="font-sans-clean text-[10px] tracking-wider uppercase text-[#784A67] block font-semibold">
                        Código del Evento
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold tracking-wider text-[#5C3759] select-all">
                        {store.code}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyStoreCode(store.code)}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full font-sans-clean text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer shadow-xs active:scale-95 shrink-0 ${
                        copiedStore === store.code
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-[#F5EBF7] hover:bg-[#EBDCF0] text-[#5C3759] border border-[#AB86B1]/50'
                      }`}
                      title="Copiar código del evento"
                    >
                      {copiedStore === store.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#9B709E]" />
                          <span>Copiar código</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Botón principal directo a la lista de regalos de Casa Cuesta */}
                  <a
                    href={store.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gold-button w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-serif-luxury text-sm tracking-wider shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.99] text-center"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Ver Lista de Regalos en Casa Cuesta</span>
                    <ExternalLink className="w-4 h-4 ml-0.5" />
                  </a>
                </div>
              ))}

              <p className="font-sans-clean text-[11px] text-[#784A67] text-center pt-1 italic">
                {gifts.registry.notice}
              </p>
            </div>
          )}
        </div>

        {/* Mensaje de agradecimiento final */}
        <div className="mt-5 text-center">
          <p className="font-serif-luxury text-xs sm:text-sm text-[#784A67] italic flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#9B709E] shrink-0" />
            <span>{gifts.thanksMessage}</span>
            <Sparkles className="w-3 h-3 text-[#9B709E] shrink-0" />
          </p>
        </div>
      </div>
    </section>
  );
}
