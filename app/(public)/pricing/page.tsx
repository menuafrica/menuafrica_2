"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Accordion } from '@/components/ui/uicomponents';
import { Check, HelpCircle, ArrowRight, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    { 
      name: 'Starter', 
      price: 'Gratuit', 
      period: 'à vie',
      desc: 'Pour tester l\'impact sur vos ventes.', 
      popular: false,
      features: ['Menu Digital Illimité', 'Photos HD de vos plats', 'Support par email', 'Idéal pour débuter'],
      missing: ['Upselling Automatique', 'Traduction IA', 'Stickers QR Inclus']
    },
    { 
      name: 'Croissance Pro', 
      price: isAnnual ? '12 500' : '15 000', 
      period: '/mois',
      desc: 'Le prix d\'un café par jour pour +20% de CA.', 
      popular: true,
      features: ['Tout du plan Starter', 'Upselling Automatique', 'Traduction en 5 langues', 'Statistiques de vente', 'Stickers QR premium inclus', 'Support prioritaire 7j/7'],
      missing: []
    },
    { 
      name: 'Multi-Resto', 
      price: 'Sur Mesure', 
      desc: 'Pour les chaînes et franchises.', 
      popular: false,
      features: ['Gestion Multi-sites', 'Analyses centralisées', 'Accompagnement stratégique', 'API & Intégrations', 'Account Manager Dédié', 'Marque Blanche'],
      missing: []
    }
  ];

  const faqs = [
    { title: "En combien de temps l'investissement est-il rentabilisé ?", content: "En moyenne, nos clients constatent une augmentation du ticket moyen dès la première semaine. L'investissement mensuel est généralement couvert par les ventes additionnelles de vos 2 premiers jours." },
    { title: "Y a-t-il des frais d'installation ?", content: "Non. Contrairement aux systèmes classiques, nous ne facturons aucun frais de mise en service. Notre agence partenaire s'occupe de tout gratuitement pour vous lancer." },
    { title: "Puis-je changer de plan à tout moment ?", content: "Oui, vous pouvez passer au plan supérieur ou inférieur à tout moment depuis votre tableau de bord. L'annulation est également possible à tout moment sans frais." },
    { title: "Quel est le coût caché ?", content: "Il n'y en a pas. Pas de frais de transaction, pas de frais de maintenance. Le seul coût est celui de l'inaction : chaque jour sans MenuAfrica est un manque à gagner." }
  ];

  return (
    <div className="bg-white min-h-screen">
      <title>MenuAfrica | Tarifs & Forfaits - Rentabilité Garantie</title>
      
      <section className="pt-32 pb-20 text-center container mx-auto px-4 bg-slate-50 rounded-b-[4rem]">
        <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-[#c25e00] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
             Rentabilité Garantie
        </div>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight">
          Un investissement,<br/>
          <span className="text-[#c25e00]">pas une dépense.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Le prix d'un café par jour pour augmenter vos ventes de 20%. Choisissez le plan qui correspond à vos ambitions de croissance.
        </p>
      </section>

        <div className="flex items-center justify-center gap-4 mb-12">
            <span className={cn("text-sm font-bold", !isAnnual ? "text-slate-900" : "text-slate-400")}>Mensuel</span>
            <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-16 h-8 bg-slate-200 rounded-full p-1 relative transition-colors duration-300 focus:outline-none"
            >
                <div className={cn("w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300", isAnnual ? "translate-x-8" : "translate-x-0")} />
            </button>
            <span className={cn("text-sm font-bold flex items-center gap-2", isAnnual ? "text-slate-900" : "text-slate-400")}>
                Annuel <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">-20%</span>
            </span>
        </div>
        
      <section className="py-20 container mx-auto px-4 -mt-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {plans.map((plan, i) => (
            <Card key={i} className={cn(
                "relative overflow-hidden transition-all duration-500 flex flex-col h-full",
                plan.popular 
                    ? "bg-slate-900 text-white shadow-2xl scale-105 border-none rounded-[2.5rem] z-10" 
                    : "bg-white text-slate-900 shadow-xl hover:shadow-2xl border border-slate-100 rounded-[2rem] mt-4"
            )}>
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#c25e00] text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                    Recommandé
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-10 border-b border-white/10">
                <h3 className="text-xl font-bold mb-2 opacity-90">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                  <span className={cn("text-lg ml-1 font-medium", plan.popular ? "text-slate-400" : "text-slate-500")}>
                      {plan.price !== 'Gratuit' && plan.price !== 'Sur Mesure' ? 'F' : ''} {plan.period && plan.period}
                  </span>
                </div>
                <p className={cn("text-sm mt-4", plan.popular ? "text-slate-400" : "text-slate-500")}>{plan.desc}</p>
              </CardHeader>
              
              <CardContent className="px-8 py-10 flex-1 flex flex-col">
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm font-medium">
                      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", plan.popular ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600")}>
                          <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="opacity-90">{feat}</span>
                    </li>
                  ))}
                  {plan.missing?.map((miss, k) => (
                    <li key={k} className="flex items-start gap-3 text-sm font-medium opacity-40">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-slate-400">
                          <XCircle size={12} />
                      </div>
                      <span className="line-through">{miss}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/auth?mode=signup" className="mt-auto block">
                  <Button className={cn(
                      "w-full h-14 rounded-xl text-base font-bold transition-transform hover:scale-[1.02]",
                      plan.popular 
                        ? "bg-[#c25e00] hover:bg-[#a04e00] text-white shadow-lg shadow-orange-500/30" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                  )}>
                    {plan.price === 'Sur Mesure' ? 'Contacter l\'équipe' : 'Choisir ce plan'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 text-center container mx-auto px-4">
        <div className="inline-flex flex-col md:flex-row items-center gap-3 text-slate-500 bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
             <HelpCircle size={20} />
          </div>
          <div className="text-left">
              <span className="block font-bold text-slate-900">Inclus dans tous les plans</span>
              <span className="text-sm">Hébergement Cloud sécurisé, Mises à jour automatiques, Accès Mobile.</span>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">Questions Fréquentes</h2>
              <p className="text-slate-500">Tout ce que vous devez savoir avant de vous lancer.</p>
          </div>
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
             <Accordion items={faqs} />
          </div>
        </div>
      </section>

      <section className="py-24 bg-white text-center">
         <div className="container mx-auto px-4 max-w-4xl">
           <div className="bg-slate-900 text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#c25e00] rounded-full blur-[100px] opacity-20"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
               
               <div className="relative z-10">
                   <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Ne laissez plus d'argent sur la table.</h2>
                   <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                       Rejoignez les restaurateurs qui ont choisi la croissance et la rentabilité avec MenuAfrica.
                   </p>
                   <Link href="/auth?mode=signup">
                     <Button size="lg" className="bg-[#c25e00] hover:bg-[#a04e00] text-white h-16 px-12 text-xl rounded-2xl shadow-xl shadow-orange-900/50 transition-transform hover:scale-105">
                       Maximiser mes profits <ArrowRight className="ml-2" />
                     </Button>
                   </Link>
                   <p className="mt-6 text-sm text-slate-500 font-medium italic">Installation en 2 minutes • Zéro maintenance</p>
               </div>
           </div>
         </div>
      </section>
    </div>
  );
}
