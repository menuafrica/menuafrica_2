"use client";
import React from 'react';
import { ShieldCheck, Lock, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/uicomponents';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
       <div className="relative bg-slate-50 py-20 border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
           <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 -rotate-3">
              <ShieldCheck size={32} className="text-green-600" />
           </div>
           <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
             Politique de Confidentialité
           </h1>
           <p className="text-slate-500 max-w-xl mx-auto text-lg">
             Nous prenons la protection de vos données très au sérieux. Voici comment nous traitons vos informations.
           </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-li:marker:text-primary">
          
          <div className="grid md:grid-cols-2 gap-6 not-prose mb-12">
             <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <Lock className="text-primary mb-3" size={24} />
                <h3 className="font-bold text-slate-900 mb-1">100% Sécurisé</h3>
                <p className="text-sm text-slate-500">Chiffrement SSL/TLS de bout en bout pour toutes les données.</p>
             </div>
             <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <Eye className="text-primary mb-3" size={24} />
                <h3 className="font-bold text-slate-900 mb-1">Transparence</h3>
                <p className="text-sm text-slate-500">Aucune donnée vendue à des tiers publicitaires.</p>
             </div>
          </div>

          <h3>1. Données collectées</h3>
          <p>
            Nous collectons uniquement les informations nécessaires au bon fonctionnement du service :
          </p>
          <ul>
            <li><strong>Informations de compte :</strong> Nom, Email, Numéro de téléphone, Nom du restaurant.</li>
            <li><strong>Données d'utilisation :</strong> Logs de connexion, statistiques de scan des QR codes, préférences d'affichage.</li>
            <li><strong>Contenu :</strong> Les images et textes que vous téléversez pour vos menus.</li>
          </ul>

          <h3>2. Utilisation des données</h3>
          <p>
            Vos données sont utilisées exclusivement pour :
          </p>
          <ul>
            <li>Fournir, maintenir et améliorer la plateforme MenuAfrica.</li>
            <li>Vous notifier des changements importants ou des mises à jour de sécurité.</li>
            <li>Fournir un support client personnalisé.</li>
            <li>Analyser l'utilisation globale pour optimiser l'expérience utilisateur.</li>
          </ul>

          <h3>3. Partage des données</h3>
          <p>
            Nous ne vendons jamais vos données personnelles. Nous pouvons les partager avec des sous-traitants de confiance uniquement pour l'exécution technique du service :
          </p>
          <ul>
            <li>Hébergement Cloud (AWS/Google Cloud)</li>
            <li>Traitement des paiements (Stripe/Orange Money)</li>
            <li>Envoi d'emails transactionnels</li>
          </ul>

          <h3>4. Vos droits (RGPD / Protection des données)</h3>
          <p>
            Conformément aux lois en vigueur, vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données. Vous pouvez exercer la plupart de ces droits directement depuis vos paramètres de compte, ou en nous contactant.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mt-12 not-prose flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
                <h4 className="font-bold text-blue-900 mb-1">Délégué à la protection des données</h4>
                <p className="text-blue-600/80 text-sm">Pour toute demande spécifique concernant vos données.</p>
            </div>
            <Link href="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-none">
                 Contacter le DPO
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
