/**
 * Configuración oficial y centralizada de la boda de Estefani & Ricardo.
 * Todos los datos del evento se gestionan exclusivamente desde este archivo.
 */

export interface WeddingConfig {
  couple: {
    bride: string;
    groom: string;
    names: string;
    initials: string;
    monogram: string;
  };
  ceremony: {
    type: string;
    dateFormatted: string;
    timeFormatted: string;
    dateTimeISO: string; // ISO con offset para cálculo exacto en America/Santo_Domingo (UTC-4)
    timezone: string;
    churchName: string;
    address: string;
    city: string;
    country: string;
    fullLocation: string;
    googleMapsUrl: string;
  };
  reception: {
    isDefined: boolean;
    venueName?: string;
    address?: string;
    timeFormatted?: string;
    notes?: string;
  };
  calendar: {
    title: string;
    description: string;
    location: string;
    startTimeUTC: string; // YYYYMMDDTHHmmssZ
    endTimeUTC: string;   // Duración técnica estándar para software de calendario (2 horas)
  };
  rsvp: {
    maxCompanionsAllowed: number;
    estimatedGuestsMin: number;
    estimatedGuestsMax: number;
    deadlineFormatted: string;
  };
  share: {
    whatsappTemplate: (url: string) => string;
  };
  theme: {
    colors: {
      ivory: string;
      beige: string;
      champagne: string;
      goldLight: string;
      goldDark: string;
      textDark: string;
      textMuted: string;
    };
  };
}

export const WEDDING_CONFIG: WeddingConfig = {
  couple: {
    bride: "Estefani",
    groom: "Ricardo",
    names: "Estefani & Ricardo",
    initials: "E & R",
    monogram: "E&R",
  },
  ceremony: {
    type: "Matrimonio Católico",
    dateFormatted: "Sábado, 12 de diciembre de 2026",
    timeFormatted: "11:00 a. m.",
    // Santo Domingo está en UTC-4 durante todo el año (no tiene horario de verano)
    dateTimeISO: "2026-12-12T11:00:00-04:00",
    timezone: "America/Santo_Domingo",
    churchName: "Iglesia Las Mercedes",
    address: "Calle Las Mercedes esq. José Reyes, Ciudad Colonial",
    city: "Santo Domingo",
    country: "República Dominicana",
    fullLocation: "Iglesia Las Mercedes, Ciudad Colonial, Santo Domingo, República Dominicana",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Iglesia+Nuestra+Señora+de+Las+Mercedes,+Ciudad+Colonial,+Santo+Domingo,+República+Dominicana",
  },
  reception: {
    // La recepción todavía no está definida. No se inventa información.
    isDefined: false,
    venueName: undefined,
    address: undefined,
    timeFormatted: undefined,
    notes: "Los detalles de la celebración posterior se comunicarán a los invitados confirmados oportunamente.",
  },
  calendar: {
    title: "Boda de Estefani & Ricardo",
    description: "Invitación a la ceremonia católica de Estefani & Ricardo.",
    location: "Iglesia Las Mercedes, Ciudad Colonial, Santo Domingo, República Dominicana",
    // 11:00 AM AST (UTC-4) = 15:00 UTC
    startTimeUTC: "20261212T150000Z",
    endTimeUTC: "20261212T170000Z",
  },
  rsvp: {
    maxCompanionsAllowed: 4,
    estimatedGuestsMin: 50,
    estimatedGuestsMax: 100,
    deadlineFormatted: "15 de noviembre de 2026",
  },
  share: {
    whatsappTemplate: (url: string) =>
      `¡Hola! 💌 Nos hace mucha ilusión compartir contigo una fecha muy especial. Te invitamos a celebrar la boda de Estefani & Ricardo el sábado 12 de diciembre de 2026 a las 11:00 a. m., en la Iglesia Las Mercedes, Ciudad Colonial, Santo Domingo. Puedes ver la invitación y confirmar tu asistencia aquí: ${url}`,
  },
  theme: {
    colors: {
      ivory: "#FAF7F2",
      beige: "#F2ECE1",
      champagne: "#E8D8C3",
      goldLight: "#D4AF37",
      goldDark: "#9E7D47",
      textDark: "#2B2118",
      textMuted: "#6B5B4D",
    },
  },
};
