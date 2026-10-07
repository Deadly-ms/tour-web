import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ClerkWrapper } from '@/components/layout/ClerkWrapper';
import { ToastProvider } from '@/components/ui/Toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://wanderly-travel.example.com'),
  title: {
    default: 'Wanderly | The World Beyond — Curated Journeys & Travel',
    template: '%s | Wanderly',
  },
  description:
    'Curated journeys to extraordinary destinations, crafted for unforgettable experiences. Explore Rajasthan, Kerala, Ladakh, Meghalaya, and bespoke slow travel getaways.',
  keywords: [
    'Wanderly travel',
    'curated journeys',
    'luxury tour packages',
    'Rajasthan royal tour',
    'Kerala houseboat',
    'Ladakh adventure',
    'slow travel',
    'bespoke itineraries',
  ],
  authors: [{ name: 'Wanderly Travel Specialists' }],
  openGraph: {
    title: 'Wanderly | The World Beyond — Curated Journeys',
    description:
      'Curated journeys to extraordinary destinations, crafted for unforgettable experiences.',
    url: 'https://wanderly-travel.example.com',
    siteName: 'Wanderly',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Wanderly Curated Journeys',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wanderly | Curated Journeys',
    description: 'Explore handpicked destinations and bespoke travel itineraries.',
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fcfbfa] text-stone-900 font-sans selection:bg-[#18281d] selection:text-white">
        <ClerkWrapper>
          <ToastProvider>
            <Navbar />
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
          </ToastProvider>
        </ClerkWrapper>
      </body>
    </html>
  );
}
