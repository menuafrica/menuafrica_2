"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/uicomponents';
import { 
  QrCode, Globe, Palette, BarChart3, Smartphone, Zap, Layers, Shield, ArrowRight, Check, Timer, TrendingUp, Users 
} from 'lucide-react';

export default function Solution() {
  return (
    <div className="flex flex-col bg-white">
      <title>MenuAfrica | La Solution pour Menu QR Code & Commandes</title>
      <section className="relative py-24 overflow-hidden bg-slate-50">
        <div className="container mx-auto px-4 text-center z-10 relative">
           <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold uppercase tracking-widest text-[#c25e00] mb-8 shadow-sm">
             Rentabilité Immédiate
           </div>
           <h1 className="font-serif text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight">
             Gagnez du temps,<br/>
             <span className="text-[#c25e00]">encaissez plus de marges.</span>
           </h1>
           <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
             MenuAfrica n'est pas un gadget. C'est un levier de croissance qui automatise vos ventes pour que vous puissiez vous concentrer sur votre rentabilité.
           </p>
           <div className="flex justify-center gap-4">
             <Link href="/auth?mode=signup">
               <Button size="lg" className="bg-[#c25e00] hover:bg-[#a04e00] text-white h-14 px-8 text-lg rounded-xl shadow-xl shadow-orange-500/20">
                 Augmenter mes revenus
               </Button>
             </Link>
           </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
         <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-xl hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <Timer size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Rotation Accélérée</h3>
                <p className="text-slate-500 leading-relaxed">
                    Le menu sur table économise 15 minutes par table. Vos clients n'attendent plus, ils commandent et libèrent la place plus vite.
                </p>
            </div>
            <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-2xl hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-white/10 text-orange-400 rounded-2xl flex items-center justify-center mb-6">
                    <TrendingUp size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Ticket Moyen +30%</h3>
                <p className="text-slate-300 leading-relaxed">
                    Les photos HD et les suggestions automatiques incitent à la commande impulsive. Le menu n'oublie jamais de proposer un dessert.
                </p>
            </div>
            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-xl hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                    <Users size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Staff 40% plus efficace</h3>
                <p className="text-slate-500 leading-relaxed">
                    Vos serveurs passent 40% de leur temps à faire des allers-retours à vide. Libérez-les pour qu'ils se concentrent sur le service.
                </p>
            </div>
         </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
           <div className="text-center max-w-2xl mx-auto mb-16">
             <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">L'arsenal pour dominer votre marché</h2>
             <p className="text-slate-500">Chaque fonctionnalité est conçue pour une seule chose : votre profit.</p>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { icon: QrCode, title: "Stickers Ultra-Résistants", desc: "Posés sur vos tables, ils résistent à tout. Zéro maintenance, profit pur." },
               { icon: Globe, title: "Traduction Auto (Touristes)", desc: "Captez 100% du budget des touristes avec un menu traduit instantanément." },
               { icon: Palette, title: "Image de Prestige", desc: "Un menu élégant justifie des prix premium et augmente la valeur perçue." },
               { icon: BarChart3, title: "Intelligence Ventes", desc: "Sachez exactement ce qui se vend le mieux et optimisez vos marges." },
               { icon: Smartphone, title: "Zéro Barrière", desc: "Pas d'application. Le client scanne et commande. Moins de friction = plus de ventes." },
               { icon: Zap, title: "Réactivité Totale", desc: "Changez vos prix en 2 secondes pour maximiser vos profits en temps réel." },
               { icon: Layers, title: "Multi-Cartes", desc: "Gérez vos offres midi et soir pour maximiser l'occupation de vos tables." },
               { icon: Shield, title: "Fiabilité Totale", desc: "Votre menu est toujours disponible, 24h/24. Pas de panne de profit." }
             ].map((feat, i) => (
               <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                   <div className="w-10 h-10 rounded-lg bg-[#c25e00]/10 text-[#c25e00] flex items-center justify-center mb-4">
                     <feat.icon size={20} />
                   </div>
                   <h3 className="font-bold text-base mb-2 text-slate-900">{feat.title}</h3>
                   <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      <section className="py-24 bg-white overflow-hidden">
         <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
            <div>
               <div className="inline-block px-3 py-1 rounded bg-green-100 text-green-700 text-xs font-bold uppercase mb-4">Zéro Effort Technique</div>
               <h2 className="font-serif text-4xl font-bold mb-6 text-slate-900">On s'occupe de tout.</h2>
               <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                 Vous n'avez rien à configurer. Nos experts mettent en place votre menu, impriment vos stickers et forment votre équipe.
                 Vous n'avez qu'à regarder vos ventes grimper.
               </p>
               <ul className="space-y-4 mb-8">
                 {[
                   "Installation clé en main par nos agences",
                   "Photos professionnelles de vos plats",
                   "Mises à jour illimitées incluses"
                 ].map(item => (
                   <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                     <div className="bg-green-100 rounded-full p-1"><Check size={14} className="text-green-600" /></div>
                     {item}
                   </li>
                 ))}
               </ul>
            </div>
            <div className="relative flex justify-center">
               <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-blue-50 rounded-full blur-3xl opacity-50 transform scale-75" />
               <img 
                 src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop" 
                 alt="Client scannant un QR Code" 
                 className="relative rounded-3xl shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500 max-w-sm w-full"
               />
            </div>
         </div>
      </section>

      <section className="py-24 bg-slate-900 text-center text-white">
        <div className="container mx-auto px-4 max-w-3xl">
           <h2 className="font-serif text-4xl font-bold mb-6">Ne laissez plus d'argent sur la table</h2>
           <p className="text-xl text-slate-400 mb-10">Rejoignez les restaurateurs qui ont choisi la croissance avec MenuAfrica.</p>
           <Link href="/auth?mode=signup">
             <Button size="lg" className="h-16 px-10 text-xl bg-[#c25e00] hover:bg-[#a04e00] text-white rounded-2xl shadow-xl shadow-orange-900/50">
                Lancer ma croissance maintenant <ArrowRight className="ml-2" />
             </Button>
           </Link>
        </div>
      </section>
    </div>
  );
}
