'use client';

import React, { useState, useEffect } from 'react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';

export function ShareSection() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.origin);
    }
  }, []);

  const invitationUrl = currentUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://boda-estefani-ricardo.vercel.app';
  const whatsappMessage = WEDDING_CONFIG.share.whatsappTemplate(invitationUrl);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-10 px-4 text-center">
      <div className="p-6 bg-[#FAF7F2] border border-[#DFC088]/40 rounded-xl shadow-sm">
        <Share2 className="w-6 h-6 text-[#B89355] mx-auto mb-2" />
        <h4 className="font-serif-luxury text-xl text-[#2A2118] font-medium mb-1">
          Comparte esta bendición
        </h4>
        <p className="font-sans-clean text-xs sm:text-sm text-[#6B5B4D] mb-5">
          Envía la invitación digital a familiares y amigos cercanos para que confirmen su presencia.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#25D366] text-white hover:bg-[#20ba5a] font-sans-clean text-xs font-semibold tracking-wider inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Compartir por WhatsApp</span>
          </a>

          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-5 py-3 rounded-full border border-[#B89355]/40 text-[#2A2118] hover:border-[#B89355] bg-white font-sans-clean text-xs font-medium tracking-wider inline-flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">¡Enlace copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#B89355]" />
                <span>Copiar enlace</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
