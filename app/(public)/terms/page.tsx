"use client";
import React from 'react';
import { FileText, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/uicomponents';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-slate-50 py-20 border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
           <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 rotate-3">
              <FileText size={32} className="text-[#c25e00]" />
           </div>
           <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
             Conditions Générales d'Utilisation
           </h1>
           <div className="flex items-center gap-2 text-slate-500 text-sm font-medium bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <Calendar size={14} />
              <span>Dernière mise à jour : 30 Novembre 2024</span>
           </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-a:text-[#c25e00] prose-a:no-underline hover:prose-a:underline">
          <p className="lead text-xl text-slate-600">
            Bienvenue sur MenuAfrica. En utilisant notre plateforme et nos services, vous acceptez les conditions suivantes. Veuillez les lire attentivement.
          </p>

          <hr className="border-slate-100 my-12" />

          <h3>1. Objet</h3>
          <p>
            MenuAfrica fournit une solution SaaS (Software as a Service) permettant aux restaurants de créer, gérer et diffuser des menus numériques via QR Code. L'utilisation du service implique l'acceptation pleine et entière des présentes CGU.
          </p>

          <h3>2. Inscription et Compte</h3>
          <p>
            Pour utiliser le Service, le Client doit créer un compte en fournissant des informations exactes, complètes et à jour. Le Client est responsable du maintien de la confidentialité de ses identifiants de connexion et de toutes les activités qui se produisent sous son compte.
          </p>

          <h3>3. Abonnements et Paiements</h3>
          <p>
            Le Service est proposé sous forme d'abonnement (mensuel ou annuel).
          </p>
          <ul>
            <li>Les prix sont indiqués en FCFA et sont susceptibles d'évoluer.</li>
            <li>Tout mois commencé est dû dans son intégralité.</li>
            <li>Le défaut de paiement peut entraîner la suspension immédiate du service et la désactivation des QR codes.</li>
          </ul>

          <h3>4. Propriété Intellectuelle</h3>
          <p>
            <strong>Vos données :</strong> Le Client reste propriétaire exclusif de ses contenus (photos de plats, descriptions, logos). Vous nous accordez une licence mondiale pour héberger et afficher ce contenu dans le cadre du service.
          </p>
          <p>
            <strong>Notre plateforme :</strong> MenuAfrica reste propriétaire exclusif de la plateforme, du code source, des designs d'interface et de la marque MenuAfrica.
          </p>

          <h3>5. Responsabilité</h3>
          <p>
            MenuAfrica s'efforce de maintenir le service accessible 24/7 mais ne garantit pas une disponibilité ininterrompue. Nous ne sommes pas responsables des pertes d'exploitation indirectes, des pertes de revenus ou de données résultant de l'utilisation ou de l'impossibilité d'utiliser le service.
          </p>

          <h3>6. Résiliation</h3>
          <p>
            Vous pouvez résilier votre compte à tout moment depuis votre espace d'administration. La résiliation prendra effet à la fin de la période de facturation en cours.
          </p>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-12 not-prose">
            <h4 className="font-bold text-slate-900 mb-2">Une question juridique ?</h4>
            <p className="text-slate-500 text-sm mb-4">Notre équipe légale est disponible pour clarifier ces points.</p>
            <Link href="/contact">
              <Button variant="outline" size="sm">Contactez-nous <ArrowRight size={14} className="ml-2" /></Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
