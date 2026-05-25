import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PaymentErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div id="payment-error-screen" className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
      <span className="text-6xl text-red-500">❌</span>
      <h2 className="text-2xl font-black font-sans tracking-tight">La Transaction a Échoué</h2>
      <p className="text-xs text-gray-400 max-w-sm">Le paiement mobile ou la demande d'autorisation de votre carte n'a pas pu aboutir. Veuillez renouveler le processus.</p>
      <button
        id="error-retry-btn"
        onClick={() => navigate('/admin/subscriptions')}
        className="h-11 px-6 bg-gray-800 hover:bg-gray-750 text-xs font-bold rounded-xl"
      >
        Réessayer l'Abonnement
      </button>
    </div>
  );
};
