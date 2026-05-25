import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Solution: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div id="solution-page" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Une Solution Conçue Spécifiquement Pour l'Afrique</h2>
        <p className="mt-4 text-base text-gray-400">Pourquoi continuer d'utiliser des outils rigides qui ne répondent pas aux spécificités locales ? Menu Africa aligne modernité et simplicité dans l'écosystème local.</p>
      </div>

      <div className="mt-16 space-y-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <span className="text-4xl">⚡</span>
            <h3 className="text-2xl font-bold">Un QR code unique pour chaque table</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Vos clients s'installent, flashent le code QR avec leur téléphone et accèdent directement à votre menu traduit en temps réel. Finies les minutes perdues à attendre le serveur ou à feuilleter un menu en papier abîmé.</p>
          </div>
          <div className="flex-1 h-64 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center text-8xl">📱</div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1 space-y-4">
            <span className="text-4xl">💰</span>
            <h3 className="text-2xl font-bold">Encaissez, Commandez, Fidélisez via WhatsApp</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Menu Africa automatise la mise au panier de vos plats, génère un lien de commande soigné, et redirige le client directement vers WhatsApp. Simplifiez la prise de commande à emporter ou en livraison à domicile.</p>
          </div>
          <div className="flex-1 h-64 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center text-8xl">💬</div>
        </div>
      </div>

      <div className="mt-20 text-center">
        <button id="sol-cta" onClick={() => navigate('/auth')} className="h-12 px-8 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-sm active:scale-95 transition-all">
          Lancer mon restaurant en 5 minutes 🚀
        </button>
      </div>
    </div>
  );
};
