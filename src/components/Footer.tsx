import React from 'react';
import Link from 'next/link';
import { WEDDING_CONFIG } from '@/config/wedding';
import { Heart, Lock } from 'lucide-react';
import { OrnamentalDivider } from './Ornaments';

export function Footer() {
  const { couple, ceremony } = WEDDING_CONFIG;

  return (
    <footer className="w-full mt-16 pt-8 pb-12 border-t border-[#AB86B1]/30 text-center bg-[#FAF6FA]">
      <div className="max-w-md mx-auto px-4">
        {/* Monograma */}
        <div className="w-12 h-12 mx-auto rounded-full border border-[#AB86B1]/45 flex items-center justify-center mb-3 bg-[#FCF9FD]">
          <span className="font-serif-luxury text-sm text-[#5C3759] font-semibold tracking-wider">
            {couple.initials}
          </span>
        </div>

        <p className="font-serif-luxury text-xl text-[#2A1C28] font-normal tracking-wide">
          {couple.names}
        </p>

        <p className="font-sans-clean text-xs text-[#784A67] tracking-widest uppercase mt-1">
          {ceremony.dateFormatted}
        </p>

        <OrnamentalDivider className="w-32 mx-auto my-4 text-[#9B709E]" />

        <p className="font-serif-luxury text-xs text-[#6A5365] italic">
          “Lo que Dios ha unido, que no lo separe el hombre”.
        </p>

        {/* Acceso para los novios */}
        <div className="mt-8 pt-4 border-t border-[#AB86B1]/20 flex items-center justify-center">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#AB86B1]/40 bg-white/70 hover:bg-white text-xs font-sans-clean text-[#784A67] hover:text-[#5C3759] transition-all shadow-xs"
            title="Panel de gestión de invitados y confirmaciones para los novios"
          >
            <Lock className="w-3.5 h-3.5 text-[#9B709E]" />
            <span className="font-medium tracking-wide">Acceso Novios</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
