'use client';

import React from 'react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { Calendar, Download, Check } from 'lucide-react';

export function CalendarSection() {
  const { calendar, ceremony } = WEDDING_CONFIG;

  // Enlace directo a Google Calendar con parámetros URL exactos en UTC
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    calendar.title
  )}&dates=${calendar.startTimeUTC}/${calendar.endTimeUTC}&details=${encodeURIComponent(
    calendar.description
  )}&location=${encodeURIComponent(calendar.location)}&ctz=${encodeURIComponent(
    ceremony.timezone
  )}`;

  // Función para generar y descargar archivo .ics universal (para iPhone, Apple Calendar y Outlook)
  const handleDownloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Estefani y Ricardo//Invitacion Boda//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:boda-estefani-ricardo-20261212@boda.estefaniyricardo`,
      `DTSTAMP:${calendar.startTimeUTC}`,
      `DTSTART:${calendar.startTimeUTC}`,
      `DTEND:${calendar.endTimeUTC}`,
      `SUMMARY:${calendar.title}`,
      `DESCRIPTION:${calendar.description}`,
      `LOCATION:${calendar.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Boda_Estefani_y_Ricardo.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-md mx-auto my-8 px-4 text-center">
      <div className="p-6 bg-[#FCF9FD] border border-[#AB86B1]/40 rounded-2xl shadow-sm">
        <Calendar className="w-6 h-6 text-[#9B709E] mx-auto mb-2" />
        <h4 className="font-serif-luxury text-xl text-[#2A1C28] font-medium mb-1">
          Agéndalo en tu calendario
        </h4>
        <p className="font-sans-clean text-xs sm:text-sm text-[#6A5365] mb-5">
          Para que nos acompañes sin contratiempos este 12 de diciembre de 2026 a las 11:00 a. m.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-button w-full sm:w-auto px-5 py-2.5 rounded-full font-serif-luxury text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Guardar fecha en mi calendario</span>
          </a>

          <button
            onClick={handleDownloadICS}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-[#AB86B1]/40 text-[#6A5365] hover:text-[#5C3759] hover:border-[#784A67] font-sans-clean text-xs tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-white/70"
            title="Descargar archivo para Apple Calendar, iPhone u Outlook"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar (.ics)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
