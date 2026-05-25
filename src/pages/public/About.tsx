import React from 'react';

export const About: React.FC = () => {
  return (
    <div id="about-page" className="py-16 md:py-24 max-w-3xl mx-auto px-4 sm:px-6">
      <h2 className="text-3xl font-extrabold tracking-tight mb-6">À Propos de Menu Africa</h2>
      <div className="space-y-6 text-sm text-gray-400 font-medium leading-relaxed">
        <p>Menu Africa est née d'un constat simple : la plupart des solutions logicielles de restauration occidentales ne sont pas adaptées à l'écosystème commercial africain (difficultés de paiements récurrents par carte bancaire internationale, prédominance absolue de WhatsApp pour la prise de commandes à distance, habitudes de consommation locales).</p>
        <p>Notre mission absolue est d'accompagner la transition numérique des restaurants africains (Sénégal, Côte d'Ivoire, Mali, Bénin, et au-delà) avec des outils superfluides, fiables, légers et instantanément opérationnels.</p>
        <p>Basée à Dakar, notre équipe de designers et d'ingénieurs s'engage à proposer une technologie de pointe conçue par et pour nos acteurs locaux.</p>
      </div>
    </div>
  );
};
