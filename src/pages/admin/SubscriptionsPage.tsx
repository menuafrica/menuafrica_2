import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export const SubscriptionsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pt-4 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-playfair font-black text-slate-800 tracking-tight">Forfait & Facturation</h2>
          <p className="text-sm text-slate-500 mt-1">Gérez votre abonnement et vos préférences de paiement.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Current Plan */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Forfait Actuel</div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Actif
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-playfair font-black text-4xl text-slate-800 mb-2">Essentiel</h3>
                <p className="text-slate-500 text-sm">Le forfait gratuit pour bien démarrer votre restaurant en ligne.</p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  'Menu numérique interactif',
                  'Flashes QR Code illimités',
                  'Support client par email',
                  'Statistiques de base'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
               <ShieldCheck className="w-6 h-6 text-slate-400" />
            </div>
            <div className="flex-1">
               <h4 className="font-bold text-slate-800 text-sm">Facturation sécurisée</h4>
               <p className="text-xs text-slate-500 mt-1">Gérée en toute sécurité via Wave, Orange Money et prélèvement bancaire.</p>
            </div>
          </div>
        </div>

        {/* Upgrade Plan */}
        <div className="relative p-8 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-2xl">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D97706]/20 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#D97706] backdrop-blur-sm">
                <Zap className="w-6 h-6" />
              </div>
              <span className="bg-[#D97706] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                Recommandé
              </span>
            </div>

            <h3 className="font-playfair font-black text-4xl text-white mb-2">Forfait PRO</h3>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-3xl font-black font-mono text-white">15 000</span>
              <span className="text-slate-400 font-bold mb-1">XOF / mois</span>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              L'outil complet pour les restaurants ambitieux. Libérez tout le potentiel de MenuAfrica.
            </p>

            <div className="space-y-4 mb-auto">
              {[
                'Tout le forfait Essentiel',
                'Studio de Marque personnalisé',
                'QR Studio Pro (Modèles HD)',
                'Mavada AI & import de menu auto',
                'Statistiques avancées',
                'Gestion d\'équipe multi-comptes'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D97706]" />
                  <span className="text-sm font-medium text-slate-200">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/admin/payment/pro')}
              className="mt-10 h-14 w-full bg-[#D97706] hover:bg-[#B46002] transition-colors rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#D97706]/20 active:scale-[0.98]"
            >
              Mettre à niveau maintenant <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
