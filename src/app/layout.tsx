import type { Metadata } from 'next';
import { Cormorant_Garamond, Cinzel, Montserrat, Pinyon_Script } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
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
  title: 'Boda de Ricardo Fernandez & Estefani Cedeño | Invitación Oficial',
  description:
    'Con la bendición de Dios y el amor de nuestras familias, te invitamos a celebrar nuestra unión en el sacramento del matrimonio. Sábado 12 de diciembre de 2026, 1:00 p. m., Iglesia Las Mercedes, Ciudad Colonial, Santo Domingo.',
  keywords: ['Boda Ricardo Fernandez y Estefani Cedeño', 'Invitación Digital', 'Iglesia Las Mercedes', 'Santo Domingo'],
  authors: [{ name: 'Ricardo Fernandez & Estefani Cedeño' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://boda-estefani-y-ricardo.vercel.app'),
  openGraph: {
    title: 'Boda de Ricardo Fernandez & Estefani Cedeño 💌',
    description:
      'Sábado 12 de diciembre de 2026 • 1:00 p. m. • Iglesia Las Mercedes, Ciudad Colonial, Santo Domingo. Toca para abrir tu invitación.',
    type: 'website',
    locale: 'es_DO',
    siteName: 'Boda Ricardo Fernandez & Estefani Cedeño',
    url: 'https://boda-estefani-y-ricardo.vercel.app',
    images: [
      {
        url: 'https://boda-estefani-y-ricardo.vercel.app/images/og-seal.jpg',
        width: 800,
        height: 800,
        alt: 'Sello Oficial de Boda Ricardo Fernandez & Estefani Cedeño',
        type: 'image/jpeg',
      },
      {
        url: 'https://boda-estefani-y-ricardo.vercel.app/images/og-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Invitación de Boda Ricardo Fernandez & Estefani Cedeño',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boda de Ricardo Fernandez & Estefani Cedeño | Invitación Oficial',
    description:
      'Te invitamos a celebrar nuestro sacramento de matrimonio el sábado 12 de diciembre de 2026 a la 1:00 p. m. en la Iglesia Las Mercedes.',
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
  themeColor: '#FAF7F2',
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
      <body className="min-h-screen bg-[#FAF7F2] text-[#2B2118] antialiased selection:bg-[#E8D8C3] selection:text-[#2B2118]">
        {children}
      </body>
    </html>
  );
}
