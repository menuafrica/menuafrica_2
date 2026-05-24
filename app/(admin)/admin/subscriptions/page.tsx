"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, CheckCircle2, AlertCircle, Smartphone, Zap, Shield, Star } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/uicomponents';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*, plans(*)')
          .eq('restaurant_id', (user as any).restaurantId)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        setSubscription(data);
      } catch (err) {
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const plans = [
    {
      id: 'free',
      name: t('planFreeName'),
      price: '0',
      period: t('planFreePeriod'),
      features: [t('feat1Menu'), t('feat50Items'), t('featBasicQR'), t('featEmailSupport')],
      recommended: false,
    },
    {
      id: 'pro',
      name: t('planProName'),
      price: '15,000',
      period: t('planProPeriod'),
      features: [t('featUnlimitedMenus'), t('featUnlimitedItems'), t('featCustomQR'), t('featAdvancedStats'), t('featPrioritySupport'), t('featAIAssistant')],
      recommended: true,
    },
    {
      id: 'enterprise',
      name: t('planEnterpriseName'),
      price: t('planEnterprisePrice'),
      period: '',
      features: [t('featMultiVenue'), t('featCustomAPI'), t('featWhiteLabel'), t('featAccountManager')],
      recommended: false,
    }
  ];

  const handleSubscribe = (planId: string) => {
    if (planId === 'free' || planId === 'enterprise') return;
    router.push(`/admin/payment/${planId}`);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">{t('loadingSubscriptions') || 'Chargement des abonnements...'}</div>;
  }

  return (
    <div className="p-8 w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t('subBillingTitle') || 'Abonnement & Facturation'}</h1>
        <p className="text-slate-500 mt-2">{t('subBillingDesc') || 'Gérez votre forfait et vos méthodes de paiement.'}</p>
      </div>

      <Card className="border-2 border-orange-100 dark:border-orange-900/30 shadow-md">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="text-orange-500 fill-orange-500" size={24} />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('currentPlan') || 'Forfait Actuel'} : {subscription?.plans?.name || t('freePlan') || 'Gratuit'}
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              {subscription?.status === 'active' 
                ? `${t('nextBillingDate') || 'Prochain prélèvement le'} ${new Date(subscription.current_period_end).toLocaleDateString()}`
                : (t('upgradeToPremium') || 'Passez à la vitesse supérieure avec nos forfaits Premium.')}
            </p>
          </div>
          {subscription?.status === 'active' && (
            <Button variant="outline">
              {t('manageSubscription') || 'Gérer mon abonnement'}
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-8 pt-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={cn(
              "relative overflow-hidden transition-all duration-300 hover:shadow-2xl",
              plan.recommended ? "border-2 border-orange-500 shadow-orange-500/20 scale-105 z-10" : "border-slate-200"
            )}
          >
            {plan.recommended && (
              <div className="absolute top-0 inset-x-0 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest text-center py-1">
                {t('mostPopular') || 'Le plus populaire'}
              </div>
            )}
            <CardHeader className={cn("text-center pb-2", plan.recommended ? "pt-8" : "")}>
              <CardTitle className="text-2xl font-bold text-slate-900">{plan.id === 'free' ? t('freePlan') || 'Gratuit' : plan.name}</CardTitle>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                <span className="text-slate-500 font-medium">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={cn(
                  "w-full h-12 text-lg font-bold rounded-xl",
                  plan.recommended 
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30" 
                    : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                )}
                onClick={() => handleSubscribe(plan.id)}
                disabled={plan.id === 'enterprise'}
              >
                {plan.id === 'enterprise' ? (t('contactUs') || 'Nous contacter') : (subscription?.plans?.name === plan.name ? (t('currentPlan') || 'Forfait Actuel') : (t('chooseThisPlan') || 'Choisir ce forfait'))}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
