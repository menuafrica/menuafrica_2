import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div id="payment-success-screen" className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
      <span className="text-6xl text-emerald-500">🏆</span>
      <h2 className="text-2xl font-black font-sans tracking-tight">Paiement Activé avec Succès !</h2>
      <p className="text-xs text-gray-400 max-w-sm">Votre restaurant dispose dorénavant des privilèges du forfait PRO. Profitez de l'éditeur de cartes et l'IA en version illimitée.</p>
      <button
        id="success-back-btn"
        onClick={() => navigate('/admin')}
        className="h-11 px-6 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-xs"
      >
        Aller au Tableau de Bord
      </button>
    </div>
  );
};
