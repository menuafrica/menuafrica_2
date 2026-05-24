"use client";
import React from 'react';
import Link from 'next/link';
import { AlertTriangle, CalendarClock, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui/uicomponents';

export default function SubscriptionReminderPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-none shadow-2xl rounded-3xl overflow-hidden bg-white text-center">
        <CardContent className="p-12 space-y-8">
          <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CalendarClock size={48} />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-slate-900">Abonnement Expiré</h1>
            <p className="text-slate-500 text-lg">
              Votre période d'essai ou votre abonnement est arrivé à terme. Renouvelez pour continuer à utiliser MenuAfrica.
            </p>
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-left space-y-3">
            <div className="flex items-start gap-3 text-amber-700 text-sm">
              <AlertTriangle className="shrink-0 mt-0.5" size={16} />
              <span>Votre menu public est temporairement désactivé. Vos clients ne peuvent plus y accéder.</span>
            </div>
          </div>

          <Link href="/admin/subscriptions" className="block pt-4">
            <Button className="w-full h-14 text-lg font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2">
              Renouveler mon abonnement <ArrowRight size={20} />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
