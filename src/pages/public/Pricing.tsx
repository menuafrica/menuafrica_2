import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: "starter",
      name: "🦁 Plat d'Entrée (Gratuit)",
      price: "0 XOF",
      period: "à vie",
      desc: "Idéal pour tester la digitalisation de votre établissement.",
      features: [
        "1 Menu interactif actif",
        "Jusqu'à 30 plats renseignés",
        "Générateur de QR codes standards",
        "Commandes WhatsApp basiques",
        "Support par message"
      ],
      color: "bg-gray-900 border-gray-800"
    },
    {
      id: "pro",
      name: "🔥 Plat Principal (PRO)",
      price: "15,000 XOF",
      period: "par mois",
      desc: "Le forfait le plus prisé pour piloter votre restaurant à plein régime.",
      features: [
        "Menus interactifs illimités",
        "Plats et photos illimités",
        "Studio de marque personnalisé",
        "Commande WhatsApp Premium",
        "Accès Mavada AI standard",
        "Statistiques de visites avancées",
        "Support prioritaire 7j/7"
      ],
      color: "bg-linear-to-b from-gray-900 via-orange-950/10 to-gray-900 border-orange-500/30 ring-1 ring-orange-500/20"
    },
    {
      id: "enterprise",
      name: "💎 Le Grand Festin (Enterprise)",
      price: "45,000 XOF",
      period: "par mois",
      desc: "La puissance totale pour les chaînes et franchises de restaurants.",
      features: [
        "Tout le forfait PRO",
        "Intégration multi-établissements",
        "Assistant Mavada AI de pointe dédié",
        "Export PDF & Rapports personnalisés",
        "Gestionnaire de compte dédié",
        "Installation sur place incluse"
      ],
      color: "bg-gray-900 border-gray-800"
    }
  ];

  return (
    <div id="pricing-page" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Des Tarifs Transparents, Sans Frais Cachés</h2>
        <p className="mt-4 text-base text-gray-400">Boostez votre rentabilité dès le premier jour de digitalisation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map(p => (
          <div key={p.id} className={`p-8 rounded-2xl border flex flex-col justify-between ${p.color} hover:scale-[1.01] transition-all`}>
            <div>
              <h3 className="text-lg font-black tracking-tight">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black font-mono text-white">{p.price}</span>
                <span className="text-xs text-gray-400">/ {p.period}</span>
              </div>
              <p className="mt-2 text-xs text-gray-400 mb-6">{p.desc}</p>
              
              <ul className="space-y-3 pt-6 border-t border-gray-850 mb-8 text-xs font-semibold text-gray-300">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-orange-500 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <button
              id={`price-btn-${p.id}`}
              onClick={() => navigate('/auth')}
              className={`w-full h-11 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                p.id === 'pro'
                  ? 'bg-orange-600 hover:bg-orange-500 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
              }`}
            >
              Choisir ce forfait
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
