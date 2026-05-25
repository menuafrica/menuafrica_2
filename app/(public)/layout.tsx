import React from 'react';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER PUBLIC Z-[100] */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-slate-100 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-playfair font-black text-xl shadow-md transition-transform group-hover:scale-105">
              M
            </div>
            <span className="font-playfair font-black text-xl tracking-tight text-slate-800">
              Menu Africa
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/solution" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">La Solution</Link>
            <Link href="/pricing" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Tarifs</Link>
            <Link href="/about" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">À Propos</Link>
            <Link href="/contact" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth" className="hidden md:flex text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2">
              Se Connecter
            </Link>
            <Link href="/auth" className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-full flex items-center transition-colors shadow-md">
              Créer mon menu
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL - Espacement strict avec pt-20 pour préserver le z-index 100 */}
      <main className="flex-1 pt-20 pb-24 md:pb-32 bg-slate-50 flex flex-col items-center w-full">
        <div className="w-full max-w-7xl mx-auto px-4">
          {children}
        </div>
      </main>

      {/* FOOTER PUBLIC Z-[100] */}
      <footer className="fixed bottom-0 left-0 right-0 h-24 md:h-32 bg-slate-900 text-slate-400 z-[100] border-t border-slate-800 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-semibold text-slate-500">
            &copy; {new Date().getFullYear()} Menu Africa. Tous droits réservés.
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs hover:text-slate-300 transition-colors">Confidentialité</Link>
            <Link href="/terms" className="text-xs hover:text-slate-300 transition-colors">Conditions Générales</Link>
            <Link href="/legal" className="text-xs hover:text-slate-300 transition-colors">Mentions Légales</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
