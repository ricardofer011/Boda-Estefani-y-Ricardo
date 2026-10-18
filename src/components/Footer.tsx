import React from 'react';
import Link from 'next/link';
import { WEDDING_CONFIG } from '@/config/wedding';
import { Heart, Lock } from 'lucide-react';
import { OrnamentalDivider } from './Ornaments';

export function Footer() {
  const { couple, ceremony } = WEDDING_CONFIG;

  return (
    <footer className="w-full mt-16 pt-8 pb-12 border-t border-[#DFC088]/30 text-center bg-[#FAF7F2]">
      <div className="max-w-md mx-auto px-4">
        {/* Monograma */}
        <div className="w-12 h-12 mx-auto rounded-full border border-[#DFC088]/50 flex items-center justify-center mb-3 bg-[#FCFAF6]">
          <span className="font-serif-luxury text-sm text-[#8C6A35] font-semibold tracking-wider">
            {couple.initials}
          </span>
        </div>

        <p className="font-serif-luxury text-xl text-[#2A2118] font-normal tracking-wide">
          {couple.names}
        </p>

        <p className="font-sans-clean text-xs text-[#8C6A35] tracking-widest uppercase mt-1">
          {ceremony.dateFormatted}
        </p>

        <OrnamentalDivider className="w-32 mx-auto my-4 text-[#B89355]" />

        <p className="font-serif-luxury text-xs text-[#6B5B4D] italic">
          “Lo que Dios ha unido, que no lo separe el hombre”.
        </p>

        {/* Acceso discreto para los novios */}
        <div className="mt-8 pt-4 flex items-center justify-center gap-1 text-[11px] text-[#A69584]">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 hover:text-[#8C6A35] transition-colors py-1 px-2 rounded"
            title="Administración privada de confirmaciones"
          >
            <Lock className="w-3 h-3 text-[#B89355]/60" />
            <span>Acceso Novios</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
