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
    notificationPhone?: string;
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
    city?: string;
    fullLocation?: string;
    timeFormatted?: string;
    notes?: string;
    googleMapsUrl?: string;
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
  gifts: {
    badge: string;
    title: string;
    message: string;
    bankName: string;
    accountType: string;
    accountNumber: string;
    holders: string;
    currency: string;
    thanksMessage: string;
    registry?: {
      badge: string;
      title: string;
      message: string;
      stores: Array<{
        name: string;
        description: string;
        code: string;
        link: string;
      }>;
      notice: string;
    };
  };
  share: {
    whatsappTemplate: (url: string) => string;
  };
  theme: {
    colors: {
      plumDeep: string;
      mauveRich: string;
      lilacDusty: string;
      orchidSoft: string;
      whisperLilac: string;
      paperLight: string;
      cardPaper: string;
      goldLight: string;
      goldDark: string;
      textDark: string;
      textMuted: string;
    };
  };
}

export const WEDDING_CONFIG: WeddingConfig = {
  couple: {
    bride: "Estefani Cedeño",
    groom: "Ricardo Fernandez",
    names: "Ricardo Fernandez & Estefani Cedeño",
    initials: "R & E",
    monogram: "R&E",
    // Número de WhatsApp para recibir notificaciones directas de confirmación (puedes cambiarlo)
    notificationPhone: process.env.NEXT_PUBLIC_COUPLE_PHONE || "+1 809 000 0000",
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
    isDefined: true,
    venueName: "Salón Vista Marina",
    address: "Av. España 70, Santo Domingo Este 10080",
    city: "Santo Domingo Este",
    fullLocation: "Salón Vista Marina, Av. España 70, Santo Domingo Este 10080, República Dominicana",
    timeFormatted: "1:30 p. m. (al término de la ceremonia)",
    notes: "Acompáñanos a brindar y celebrar el banquete de bodas con vista al mar.",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Salon+Vista+Marina,+Av.+Espa%C3%B1a+70,+Santo+Domingo+Este+10080",
  },
  calendar: {
    title: "Boda de Ricardo Fernandez & Estefani Cedeño",
    description: "Invitación a la ceremonia católica de Ricardo Fernandez & Estefani Cedeño.",
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
  gifts: {
    badge: "Muestra de Cariño",
    title: "Lluvia de Sobres",
    message:
      "El regalo más hermoso para nosotros es contar con tu presencia y bendición en el inicio de nuestro matrimonio. Si deseas tener un detalle para acompañar la construcción de nuestro nuevo hogar, puedes hacerlo a través de nuestra cuenta en común:",
    bankName: "Asociación Popular de Ahorros y Préstamos (APAP)",
    accountType: "Cuenta de Ahorros",
    accountNumber: "1029946485",
    holders: "Ricardo Fernandez & Estefani Cedeño",
    currency: "DOP (Pesos Dominicanos)",
    thanksMessage: "¡Muchas gracias por acompañarnos con tanto cariño en este nuevo capítulo de nuestras vidas!",
    registry: {
      badge: "Muestra de Cariño",
      title: "Mesa de Regalos",
      message:
        "El regalo más valioso para nosotros es su compañía y bendición en el inicio de nuestro matrimonio. Si desean tener un detalle para acompañar la construcción de nuestro nuevo hogar, hemos seleccionado algunas opciones en nuestras tiendas preferidas:",
      stores: [
        {
          name: "Casa Cuesta",
          description: "Mesa de Bodas • Boda Ricardo Fernandez & Estefani Cedeño",
          code: "Ricardo Fernandez & Estefani Cedeño",
          link: "https://casacuesta.com",
        },
        {
          name: "Ilumel",
          description: "Colección Muebles & Decoración",
          code: "Ricardo & Estefani",
          link: "https://ilumel.com",
        },
        {
          name: "Amazon Wedding Registry",
          description: "Mesa de Regalos Online",
          code: "Ricardo Fernandez & Estefani Cedeño",
          link: "https://www.amazon.com/wedding",
        },
      ],
      notice: "Si deseas hacernos llegar un detalle o necesitas ayuda con la lista de regalos, no dudes en contactarnos.",
    },
  },
  share: {
    whatsappTemplate: (url: string) =>
      `¡Hola! 💌 Nos hace mucha ilusión compartir contigo una fecha muy especial. Te invitamos a celebrar el matrimonio de Ricardo Fernandez & Estefani Cedeño el sábado 12 de diciembre de 2026 a las 11:00 a. m., en la Iglesia Las Mercedes, Ciudad Colonial, Santo Domingo. Puedes ver tu invitación personal y confirmar tu asistencia aquí: ${url}`,
  },
  theme: {
    colors: {
      plumDeep: "#5C3759", // Círculo 1: Ciruela profundo / Deep plum
      mauveRich: "#784A67", // Círculo 2: Malva intenso / Rich mauve
      lilacDusty: "#9B709E", // Círculo 3: Lila empolvado / Dusty lilac
      orchidSoft: "#AB86B1", // Círculo 4: Orquídea lavanda / Soft orchid
      whisperLilac: "#DFC6E3", // Círculo 5: Lavanda tenue / Whisper lilac
      paperLight: "#FAF6FA", // Fondo marfil suave con matiz lila
      cardPaper: "#FCF9FD", // Fondo de papelería nupcial
      goldLight: "#DFC088", // Acento oro champán
      goldDark: "#9E7D47", // Oro envejecido
      textDark: "#2A1C28", // Tipografía principal oscura con matiz ciruela
      textMuted: "#6A5365", // Tipografía secundaria malva sutil
    },
  },
};
