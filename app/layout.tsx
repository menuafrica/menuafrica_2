import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Menu Africa - La Suite Digitale pour Restaurants',
  description: 'Numérisez votre carte, gagnez en visibilité et intégrez Bibin AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="antialiased scroll-smooth">
      <body className="min-h-screen font-sans bg-slate-50 text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
