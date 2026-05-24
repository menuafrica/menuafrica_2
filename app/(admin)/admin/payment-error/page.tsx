"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui/uicomponents';

export default function PaymentErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorMsg = searchParams?.get('message') || "Fonds insuffisants ou méthode de paiement refusée par l'opérateur.";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-md w-full border-none shadow-2xl rounded-3xl overflow-hidden bg-white text-center animate-scale-in">
        <CardContent className="p-12 space-y-8 pt-12">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <XCircle size={48} />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-slate-900">Paiement Échoué</h1>
            <p className="text-slate-500 text-lg">
              Nous n'avons pas pu traiter votre paiement. Veuillez vérifier vos informations ou utiliser une autre méthode.
            </p>
          </div>

          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-left space-y-3">
            <div className="flex items-start gap-3 text-red-700 text-sm">
              <span className="font-bold shrink-0">Raison :</span>
              <span>{errorMsg}</span>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <Button 
              onClick={() => router.back()} 
              className="w-full h-14 text-lg font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2"
            >
              <RefreshCcw size={20} /> Réessayer
            </Button>
            <Link href="/admin/subscriptions" className="block">
              <Button variant="outline" className="w-full h-14 text-lg font-bold rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2">
                <ArrowLeft size={20} /> Retour aux abonnements
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
