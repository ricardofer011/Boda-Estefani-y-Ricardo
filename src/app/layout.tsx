import type { Metadata } from 'next';
import { Cormorant_Garamond, Cinzel, Montserrat, Pinyon_Script } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const pinyon = Pinyon_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pinyon',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Boda de Estefani Cedeño & Ricardo Fernandez | Invitación Oficial',
  description:
    'Con la bendición de Dios y el amor de nuestras familias, te invitamos a celebrar nuestra unión en el sacramento del matrimonio. Sábado 12 de diciembre de 2026, 11:00 a. m., Iglesia Las Mercedes, Ciudad Colonial, Santo Domingo.',
  keywords: ['Boda Estefani Cedeño y Ricardo Fernandez', 'Invitación Digital', 'Iglesia Las Mercedes', 'Santo Domingo'],
  authors: [{ name: 'Estefani Cedeño & Ricardo Fernandez' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://boda-estefani-y-ricardo.vercel.app'),
  openGraph: {
    title: 'Boda de Estefani Cedeño & Ricardo Fernandez 💌',
    description:
      'Sábado 12 de diciembre de 2026 • 11:00 a. m. • Iglesia Las Mercedes, Ciudad Colonial, Santo Domingo. Toca para abrir tu invitación.',
    type: 'website',
    locale: 'es_DO',
    siteName: 'Boda Estefani Cedeño & Ricardo Fernandez',
    url: 'https://boda-estefani-y-ricardo.vercel.app',
    images: [
      {
        url: 'https://boda-estefani-y-ricardo.vercel.app/images/og-seal.jpg',
        width: 800,
        height: 800,
        alt: 'Sello Oficial de Boda Estefani Cedeño & Ricardo Fernandez',
        type: 'image/jpeg',
      },
      {
        url: 'https://boda-estefani-y-ricardo.vercel.app/images/og-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Invitación de Boda Estefani Cedeño & Ricardo Fernandez',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boda de Estefani Cedeño & Ricardo Fernandez | Invitación Oficial',
    description:
      'Te invitamos a celebrar nuestro sacramento de matrimonio el sábado 12 de diciembre de 2026 a las 11:00 a. m. en la Iglesia Las Mercedes.',
    images: ['https://boda-estefani-y-ricardo.vercel.app/images/og-seal.jpg'],
  },
  icons: {
    icon: '/images/wax-seal.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF6FA',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${cinzel.variable} ${montserrat.variable} ${pinyon.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#FAF6FA] text-[#2A1C28] antialiased selection:bg-[#DFC6E3] selection:text-[#5C3759]">
        {children}
      </body>
    </html>
  );
}
