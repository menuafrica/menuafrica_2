import React from 'react';

export const SuperAdminChat: React.FC = () => {
  return (
    <div id="god-mode-page" className="space-y-6 animate-fade-in text-center py-12 max-w-md mx-auto">
      <span className="text-5xl">🦁</span>
      <h2 className="text-xl font-black font-sans tracking-tight">Espace Super-Admin (God Mode)</h2>
      <p className="text-xs text-gray-400 leading-relaxed">Bienvenue sur le cockpit de contrôle de Menu Africa. Vous êtes identifié en tant que gestionnaire principal de la plateforme.</p>
      
      <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 text-left">
        <h3 className="text-xs font-bold font-mono uppercase text-gray-400">Statistiques Globales</h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-gray-950 rounded-xl border border-gray-850">
            <span className="text-gray-500 block">Restaurants Actifs</span>
            <span className="text-base font-black text-white font-mono">148</span>
          </div>
          <div className="p-3 bg-gray-950 rounded-xl border border-gray-850">
            <span className="text-gray-500 block">Total Menus QR</span>
            <span className="text-base font-black text-white font-mono">412</span>
          </div>
        </div>
      </div>
    </div>
  );
};
