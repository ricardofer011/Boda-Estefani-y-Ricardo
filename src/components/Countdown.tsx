'use client';

import React, { useState, useEffect } from 'react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { Clock, Heart } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isWeddingDay: boolean;
  isPast: boolean;
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const targetDateISO = WEDDING_CONFIG.ceremony.dateTimeISO;

  useEffect(() => {
    const targetTimestamp = new Date(targetDateISO).getTime();

    const calculateTime = () => {
      const now = Date.now();
      const diff = targetTimestamp - now;

      // Un día completo dura 86,400,000 ms
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;

      if (diff <= 0) {
        if (Math.abs(diff) <= ONE_DAY_MS) {
          // El mismo día de la boda
          setTimeLeft({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isWeddingDay: true,
            isPast: false,
          });
        } else {
          // Fecha posterior
          setTimeLeft({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isWeddingDay: false,
            isPast: true,
          });
        }
        return;
      }

      const days = Math.floor(diff / ONE_DAY_MS);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isWeddingDay: false,
        isPast: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDateISO]);

  // Placeholder para renderizado estático inicial mientras se monta el componente
  if (!timeLeft) {
    return (
      <div className="w-full max-w-lg mx-auto py-6 px-4">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-[#EFE6D8]/50 rounded-lg border border-[#DFC088]/20" />
          ))}
        </div>
      </div>
    );
  }

  if (timeLeft.isWeddingDay) {
    return (
      <div className="w-full max-w-lg mx-auto p-6 bg-[#FCF9FD] border border-[#AB86B1]/50 rounded-xl shadow-card-elevated text-center my-6">
        <Heart className="w-8 h-8 text-[#9B709E] mx-auto mb-2 animate-bounce" />
        <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#2A1C28] font-medium mb-1">
          ¡Hoy es nuestro gran día!
        </h3>
        <p className="font-sans-clean text-sm text-[#6A5365]">
          Celebramos hoy el sacramento de nuestra unión. ¡Gracias por acompañarnos con tu presencia y tus oraciones!
        </p>
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="w-full max-w-lg mx-auto p-6 bg-[#FCF9FD] border border-[#AB86B1]/50 rounded-xl shadow-card-elevated text-center my-6">
        <Heart className="w-8 h-8 text-[#9B709E] mx-auto mb-2" />
        <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#2A1C28] font-medium mb-1">
          Unidos en sagrado matrimonio
        </h3>
        <p className="font-sans-clean text-sm text-[#6A5365]">
          Nuestra boda se celebró con inmensa alegría. Agradecemos a Dios y a cada uno de nuestros seres queridos por acompañarnos.
        </p>
      </div>
    );
  }

  const units = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'Minutos', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'Segundos', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <div className="w-full max-w-md mx-auto my-6 px-2">
      <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#784A67] font-serif-luxury mb-4 font-semibold">
        <Clock className="w-3.5 h-3.5 text-[#9B709E]" />
        <span>Cuenta regresiva para nuestro enlace</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3.5">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center py-3.5 px-2 rounded-xl bg-[#FCF9FD] border border-[#AB86B1]/40 shadow-xs relative overflow-hidden"
          >
            {/* Brillo tenue superior */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#AB86B1] to-transparent" />
            
            <span className="font-serif-luxury text-2xl sm:text-3xl text-[#5C3759] font-semibold tracking-tight">
              {unit.value}
            </span>
            <span className="font-sans-clean text-[10px] sm:text-xs uppercase tracking-wider text-[#784A67] mt-1 font-medium">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
