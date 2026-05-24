"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/uicomponents';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function Callback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Remplace the Logto specific hook, assuming we don't have useHandleSignInCallback anymore,
  // or we need to handle plain Supabase callback stuff
  const isLoading = true; // Temporary mock

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading && !error) {
        setError("La finalisation prend trop de temps. Vérifiez que l'URL de redirection est EXACTEMENT celle configurée dans Logto.");
      }
    }, 15000);
    return () => clearTimeout(timer);
  }, [isLoading, error]);

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Erreur de connexion</h2>
          <p className="text-slate-500 text-sm leading-relaxed">{error}</p>
          <Button onClick={() => router.push('/auth')} variant="outline" className="w-full rounded-xl">
            <ArrowLeft size={16} className="mr-2" /> Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#c25e00]" size={48} />
        <p className="text-slate-500 font-medium">Finalisation de la session...</p>
      </div>
    </div>
  );
}
