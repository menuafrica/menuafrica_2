"use client";
import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui/uicomponents';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-none shadow-2xl rounded-3xl overflow-hidden bg-white text-center">
        <CardContent className="p-12 space-y-8">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
            <CheckCircle2 size={48} />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-slate-900">Paiement Réussi !</h1>
            <p className="text-slate-500 text-lg">
              Merci pour votre confiance. Votre abonnement Pro est maintenant actif.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Montant payé</span>
              <span className="font-bold text-slate-900">15,000 FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Forfait</span>
              <span className="font-bold text-slate-900">Pro Mensuel</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Prochain paiement</span>
              <span className="font-bold text-slate-900">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
            </div>
          </div>

          <Link href="/admin/dashboard" className="block pt-4">
            <Button className="w-full h-14 text-lg font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl flex items-center justify-center gap-2">
              Retour au tableau de bord <ArrowRight size={20} />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
