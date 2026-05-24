"use client";
import React from 'react';
import Link from 'next/link';
import { Target, Zap, Heart, ArrowRight } from 'lucide-react';
import { Button, Card } from '@/components/ui/uicomponents';

export default function About() {
  return (
    <div className="bg-white">
      <section className="py-24 text-center container mx-auto px-4">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-slate-900 mb-6">
          Nous digitalisons la gastronomie africaine.
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12">
          MenuAfrica est né d'une mission simple : donner aux restaurateurs africains les outils technologiques qu'ils méritent pour prospérer à l'ère du numérique.
        </p>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
           <Card className="border-none shadow-lg bg-white p-8">
             <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
               <Target size={24} />
             </div>
             <h2 className="font-serif text-3xl font-bold mb-4">Notre Mission</h2>
             <p className="text-slate-600 leading-relaxed text-lg">
               Démocratiser l'accès aux technologies de restauration pour chaque établissement en Afrique, du maquis de quartier au restaurant étoilé, en supprimant les barrières techniques et financières.
             </p>
           </Card>
           
           <div className="rounded-[2rem] shadow-lg bg-slate-900 text-white p-8 hover:bg-slate-800 transition-colors duration-300">
             <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6">
               <Zap size={24} />
             </div>
             <h2 className="font-serif text-3xl font-bold mb-4">Notre Vision</h2>
             <p className="text-slate-300 leading-relaxed text-lg">
               Devenir le système d'exploitation de référence pour 100 000 restaurants d'ici 2030, en créant un écosystème connecté qui valorise le patrimoine culinaire africain à l'échelle mondiale.
             </p>
           </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-4">
        <h2 className="text-center font-serif text-3xl font-bold mb-16">Nos Valeurs</h2>
        <div className="grid md:grid-cols-4 gap-8">
           {[
             { title: "Simplicité", desc: "La technologie doit être invisible et intuitive." },
             { title: "Excellence", desc: "Nous visons la qualité mondiale, made in Africa." },
             { title: "Proximité", desc: "Nous sommes sur le terrain, aux côtés de nos clients." },
             { title: "Innovation", desc: "Nous anticipons les besoins futurs du marché." }
           ].map((v, i) => (
             <div key={i} className="text-center group">
               <div className="w-16 h-16 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                 <Heart className="text-primary" size={24} />
               </div>
               <h3 className="font-bold text-lg mb-2">{v.title}</h3>
               <p className="text-slate-500 text-sm">{v.desc}</p>
             </div>
           ))}
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
           <h2 className="text-center font-serif text-3xl font-bold mb-16">L'équipe dirigeante</h2>
           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { name: "Ousmane D.", role: "CEO & Fondateur", img: "https://i.pravatar.cc/300?img=11" },
                { name: "Aïssa M.", role: "CTO", img: "https://i.pravatar.cc/300?img=5" },
                { name: "Paul K.", role: "Head of Sales", img: "https://i.pravatar.cc/300?img=3" }
              ].map((member, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img src={member.img} alt={member.name} className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                    <p className="text-primary font-medium text-sm">{member.role}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      <section className="py-24 text-center">
        <h2 className="font-serif text-3xl font-bold mb-8">Envie de rejoindre l'aventure ?</h2>
        <Link href="/contact">
          <Button size="lg">Nous contacter <ArrowRight className="ml-2" /></Button>
        </Link>
      </section>
    </div>
  );
}
