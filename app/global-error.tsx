'use client';
import React from 'react';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center">
          <h2 className="text-2xl font-bold font-serif mb-4 text-[#c25e00]">Une erreur est survenue</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Nous nous excusons pour ce désagrément. Veuillez rafraîchir la page ou réessayer plus tard.
          </p>
          <a
            href="/"
            className="w-full h-12 flex items-center justify-center bg-[#c25e00] text-white hover:bg-[#a04e00] rounded-full font-bold transition-all shadow-lg active:scale-95 duration-200"
          >
            Retour à l'accueil
          </a>
        </div>
      </body>
    </html>
  );
}
