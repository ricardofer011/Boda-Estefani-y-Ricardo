'use client';

import React, { useState } from 'react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { CardCornerFlourish, OrnamentalDivider } from './Ornaments';
import { Gift, Copy, Check, Building2, Heart, Sparkles } from 'lucide-react';

export function GiftsSection() {
  const { gifts } = WEDDING_CONFIG;
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(gifts.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback para navegadores antiguos
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

  return (
    <section className="w-full max-w-xl mx-auto my-8 px-4" id="regalos">
      {/* Tarjeta de papelería nupcial con acabado artesanal */}
      <div className="relative bg-[#FCFAF6] border-2 border-[#DFC088]/40 rounded-3xl p-6 sm:p-10 shadow-card-elevated text-center overflow-hidden card-paper-texture">
        {/* Esquinas ornamentales en filigrana dorada */}
        <CardCornerFlourish position="top-left" />
        <CardCornerFlourish position="top-right" />
        <CardCornerFlourish position="bottom-left" />
        <CardCornerFlourish position="bottom-right" />

        {/* Encabezado elegante y sutil */}
        <div className="flex flex-col items-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF4E6] border border-[#DFC088]/45 mb-2.5 shadow-2xs">
            <Gift className="w-3.5 h-3.5 text-[#B89355]" />
            <span className="font-serif-luxury text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#8C6A35] font-semibold">
              {gifts.badge}
            </span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#2A2118] font-normal tracking-wide gold-text-gradient leading-tight">
            {gifts.title}
          </h2>

          <OrnamentalDivider className="w-32 mx-auto my-2.5 text-[#B89355]" />

          <p className="font-serif-luxury text-xs sm:text-sm text-[#6B5B4D] max-w-md mx-auto leading-relaxed italic">
            “{gifts.message}”
          </p>
        </div>

        {/* Tarjeta destacada con los datos bancarios en oro satinado */}
        <div className="relative p-5 sm:p-7 rounded-2xl bg-gradient-to-b from-[#FAF6EE] to-[#EFE7D8] border border-[#DFC088]/50 shadow-xs text-left max-w-md mx-auto">
          {/* Nombre de la entidad bancaria */}
          <div className="flex items-start gap-3 pb-4 border-b border-[#DFC088]/30">
            <div className="w-10 h-10 rounded-xl bg-[#FAF4E6] border border-[#DFC088]/40 flex items-center justify-center shrink-0 shadow-2xs">
              <Building2 className="w-5 h-5 text-[#8C6A35]" />
            </div>
            <div>
              <p className="font-sans-clean text-[10px] tracking-widest uppercase text-[#8C6A35] font-semibold">
                Entidad Bancaria
              </p>
              <h3 className="font-serif-luxury text-base sm:text-lg text-[#2A2118] font-medium leading-tight mt-0.5">
                {gifts.bankName}
              </h3>
              <p className="font-sans-clean text-xs text-[#6B5B4D] mt-0.5">
                {gifts.accountType} • {gifts.currency}
              </p>
            </div>
          </div>

          {/* Bloque central del número de cuenta con botón de copiar */}
          <div className="my-4 py-3.5 px-4 rounded-xl bg-[#FCFAF6] border border-[#DFC088]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
            <div>
              <span className="font-sans-clean text-[10px] tracking-wider uppercase text-[#8C6A35] block font-semibold">
                Número de Cuenta
              </span>
              <span className="font-mono text-lg sm:text-xl font-bold tracking-wider text-[#2A2118] select-all">
                {gifts.accountNumber}
              </span>
            </div>

            <button
              onClick={handleCopyAccount}
              type="button"
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full font-sans-clean text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer shadow-xs active:scale-95 shrink-0 ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-[#FAF4E6] hover:bg-[#F3E8CF] text-[#8C6A35] border border-[#DFC088]/60 hover:border-[#B89355]'
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
                  <Copy className="w-3.5 h-3.5 text-[#B89355]" />
                  <span>Copiar cuenta</span>
                </>
              )}
            </button>
          </div>

          {/* Titulares de la cuenta */}
          <div className="pt-2 flex items-center justify-between text-xs text-[#6B5B4D]">
            <span className="font-sans-clean text-[11px] uppercase tracking-wider text-[#8C6A35] font-semibold">
              Titulares:
            </span>
            <span className="font-serif-luxury text-sm font-semibold text-[#2A2118] flex items-center gap-1.5">
              <Heart className="w-3 h-3 text-[#B89355] fill-[#B89355]/40" />
              <span>{gifts.holders}</span>
            </span>
          </div>
        </div>

        {/* Mensaje de agradecimiento final */}
        <div className="mt-5 text-center">
          <p className="font-serif-luxury text-xs sm:text-sm text-[#8C6A35] italic flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#B89355] shrink-0" />
            <span>{gifts.thanksMessage}</span>
            <Sparkles className="w-3 h-3 text-[#B89355] shrink-0" />
          </p>
        </div>
      </div>
    </section>
  );
}
