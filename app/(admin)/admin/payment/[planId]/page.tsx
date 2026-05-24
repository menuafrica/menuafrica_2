"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreditCard, Smartphone, ShieldCheck, Loader2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui/uicomponents';
import { cn } from '@/lib/utils';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/integrations';

const CheckoutForm = ({ onSuccess, onError }: { onSuccess: () => void, onError: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        onSuccess();
      } else {
        onError();
      }
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="p-4 border border-slate-200 rounded-xl bg-white">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>
      <Button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full h-14 text-lg font-bold rounded-xl mt-6 shadow-xl transition-all bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" /> Traitement...
          </span>
        ) : (
          `Payer 15,000 FCFA`
        )}
      </Button>
    </form>
  );
};

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [method, setMethod] = useState<'card' | 'mobile'>('mobile');
  const [loading, setLoading] = useState(false);

  const handleMobilePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulation de paiement (MOCK)
    setTimeout(() => {
      setLoading(false);
      // Simuler 90% de succès
      if (Math.random() > 0.1) {
        router.push('/admin/payment-success');
      } else {
        router.push('/admin/payment-error');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Paiement Sécurisé</h1>
          <p className="text-slate-500 mt-2">Abonnement Pro - 15,000 FCFA / mois</p>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-900 text-white p-6">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="text-green-400" />
              Choisissez votre méthode
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMethod('mobile')}
                className={cn(
                  "p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                  method === 'mobile' 
                    ? "border-orange-500 bg-orange-50 text-orange-700" 
                    : "border-slate-200 hover:border-orange-200 text-slate-500"
                )}
              >
                <Smartphone size={32} className={method === 'mobile' ? "text-orange-500" : ""} />
                <span className="font-bold text-sm">Mobile Money</span>
              </button>
              
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={cn(
                  "p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                  method === 'card' 
                    ? "border-blue-500 bg-blue-50 text-blue-700" 
                    : "border-slate-200 hover:border-blue-200 text-slate-500"
                )}
              >
                <CreditCard size={32} className={method === 'card' ? "text-blue-500" : ""} />
                <span className="font-bold text-sm">Carte Bancaire</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              {method === 'mobile' ? (
                <form onSubmit={handleMobilePayment} className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Opérateur</label>
                    <select className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                      <option>Orange Money</option>
                      <option>MTN Mobile Money</option>
                      <option>Moov Money</option>
                      <option>Wave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Numéro de téléphone</label>
                    <input 
                      type="tel" 
                      placeholder="Ex: 07 00 00 00 00" 
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 text-lg font-bold rounded-xl mt-6 shadow-xl transition-all bg-orange-500 hover:bg-orange-600 shadow-orange-500/30"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" /> Traitement...
                      </span>
                    ) : (
                      `Payer 15,000 FCFA`
                    )}
                  </Button>
                </form>
              ) : (
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    onSuccess={() => router.push('/admin/payment-success')} 
                    onError={() => router.push('/admin/payment-error')} 
                  />
                </Elements>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck size={16} /> Paiement 100% sécurisé et crypté
        </div>
      </div>
    </div>
  );
}
