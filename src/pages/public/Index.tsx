import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div id="landing-hero-section" className="relative overflow-hidden pt-12 pb-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
            ✨ Solution Digitale Tout-en-Un pour Restaurateurs
          </span>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight font-sans">
            Digitalisez votre restaurant.{' '}
            <span className="bg-linear-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
              Multipliez vos ventes.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            La première plateforme SaaS sur mesure conçue pour l'Afrique de l'Ouest : 
            créez des cartes QR interactives superfluides, recevez vos commandes directement sur WhatsApp, 
            et pilotez votre activité avec notre assistant IA intelligent.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="cta-start-free"
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-95 transition-all text-sm font-semibold shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2 min-h-[48px]"
            >
              Créer Mon Menu Gratuitement 🚀
            </button>
            <button
              id="cta-view-demo"
              onClick={() => navigate('/menu/la-teranga')}
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 active:scale-95 transition-all text-sm font-semibold flex items-center justify-center gap-2 min-h-[48px]"
            >
              Voir la Démo en Ligne 👁️
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700/60 transition-all">
            <span className="text-3xl block mb-4">📱</span>
            <h3 className="text-lg font-bold font-sans">Menu Tactile Fluide</h3>
            <p className="mt-2 text-xs text-gray-400 leading-relaxed">
              Une expérience web ultra-rapide optimisée pour les smartphones, sans téléchargement d'application. Idéal pour fidéliser instantanément vos clients.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700/60 transition-all">
            <span className="text-3xl block mb-4">💬</span>
            <h3 className="text-lg font-bold font-sans">Commandes WhatsApp</h3>
            <p className="mt-2 text-xs text-gray-400 leading-relaxed">
              Vos clients sélectionnent leurs plats favoris et envoient les commandes d'un seul clic à votre numéro de téléphone via un message structuré.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700/60 transition-all">
            <span className="text-3xl block mb-4">🤖</span>
            <h3 className="text-lg font-bold font-sans">Mavada Intelligence Artificielle</h3>
            <p className="mt-2 text-xs text-gray-400 leading-relaxed">
              Comprenez les avis de vos convives, analysez automatiquement les tendances d'achat et augmentez le ticket moyen grâce à notre IA experte intégrée.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
