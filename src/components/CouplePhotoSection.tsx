'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CardCornerFlourish, OrnamentalDivider } from './Ornaments';
import { Heart, Maximize2, X, Sparkles, Camera } from 'lucide-react';

interface PhotoItem {
  id: string;
  url: string;
  title: string;
  caption: string;
}

const COUPLE_PHOTOS: PhotoItem[] = [
  {
    id: '1',
    url: '/images/couple.jpg',
    title: 'Ricardo Fernandez & Estefani Cedeño',
    caption: '“Por encima de todo, vístanse de amor, que es el vínculo de la unidad perfecta”. — Colosenses 3:14',
  },
];

export function CouplePhotoSection() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activePhoto = COUPLE_PHOTOS[currentIndex];

  return (
    <section className="w-full max-w-xl mx-auto my-10 px-4">
      {/* Marco de papelería nupcial tradicional con acabado de alta gama */}
      <div className="relative bg-[#FCFAF6] border-2 border-[#DFC088]/40 rounded-3xl p-6 sm:p-10 shadow-card-elevated text-center overflow-hidden card-paper-texture">
        {/* Esquinas ornamentales con filigrana dorada */}
        <CardCornerFlourish position="top-left" />
        <CardCornerFlourish position="top-right" />
        <CardCornerFlourish position="bottom-left" />
        <CardCornerFlourish position="bottom-right" />

        {/* Encabezado ceremonial de la sección */}
        <div className="flex flex-col items-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF4E6] border border-[#DFC088]/45 mb-2.5 shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-[#B89355] fill-[#B89355]/30 animate-pulse" />
            <span className="font-serif-luxury text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#8C6A35] font-semibold">
              Nuestra Historia de Amor
            </span>
          </div>

          <h2 className="font-serif-luxury text-2xl sm:text-4xl text-[#2A2118] font-normal tracking-wide gold-text-gradient leading-tight">
            Ricardo Fernandez & Estefani Cedeño
          </h2>

          <OrnamentalDivider className="w-32 mx-auto my-2.5 text-[#B89355]" />

          <p className="font-serif-luxury text-xs sm:text-sm italic text-[#6B5B4D] max-w-md mx-auto leading-relaxed">
            “Caminando juntos de la mano, con fe en el corazón y la bendición de Dios hacia el altar”.
          </p>
        </div>

        {/* ============================================================== */}
        {/* CUADRO DEL RETRATO NUPCIAL CON PASPARTÚ Y FILO DORADO          */}
        {/* ============================================================== */}
        <div className="relative p-2.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#FAF6EE] to-[#EFE7D8] border border-[#DFC088]/50 shadow-inner">
          <div
            onClick={() => setSelectedPhoto(activePhoto)}
            className="group relative w-full aspect-4/3 sm:aspect-3/2 rounded-xl overflow-hidden cursor-pointer shadow-lg border border-[#DFC088]/40 bg-[#2A2118]"
          >
            {/* Fotografía oficial de los novios */}
            <Image
              src={activePhoto.url}
              alt="Ricardo Fernandez y Estefani Cedeño - Retrato oficial de los novios"
              fill
              sizes="(max-width: 640px) 100vw, 600px"
              priority
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Viñeta sutil de luz dorada en los bordes */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none transition-opacity duration-300 group-hover:opacity-80"
              aria-hidden="true"
            />

            {/* Filo dorado interior fino */}
            <div className="absolute inset-2 rounded-lg border border-white/20 pointer-events-none" />

            {/* Botón flotante para ampliar */}
            <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-md">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>

            {/* Placa decorativa en la parte inferior de la foto */}
            <div className="absolute inset-x-3.5 bottom-3.5 flex items-center justify-between text-left pointer-events-none">
              <div className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md border border-[#DFC088]/50 shadow-md">
                <span className="font-serif-luxury text-xs text-[#2A2118] font-medium tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#B89355]" />
                  <span>Ricardo & Estefani</span>
                </span>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs text-white/90 text-[10px] font-sans-clean tracking-widest uppercase border border-white/20">
                12 • DIC • 2026
              </div>
            </div>
          </div>

          {/* Cita bíblica grabada al pie del marco */}
          <div className="mt-3.5 px-2 text-center">
            <p className="font-serif-luxury text-xs text-[#8C6A35] italic">
              {activePhoto.caption}
            </p>
          </div>
        </div>

        {/* Indicador de galería para futuras fotos */}
        {COUPLE_PHOTOS.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {COUPLE_PHOTOS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'w-7 bg-[#B89355]'
                    : 'bg-[#DFC088]/40 hover:bg-[#DFC088]'
                }`}
                aria-label={`Ver foto ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL DE VISTA EN ALTA RESOLUCIÓN (LIGHTBOX)                   */}
      {/* ============================================================== */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Cerrar vista de foto"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Imagen ampliada */}
            <div className="relative w-full aspect-4/3 sm:aspect-3/2 rounded-2xl overflow-hidden border-2 border-[#DFC088]/60 shadow-2xl">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain bg-black"
                priority
              />
            </div>

            {/* Pie de foto en el modal */}
            <div className="mt-4 text-center text-white">
              <h3 className="font-serif-luxury text-xl gold-text-gradient font-normal">
                {selectedPhoto.title}
              </h3>
              <p className="font-serif-luxury text-xs text-amber-200/80 italic mt-1 max-w-lg">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
