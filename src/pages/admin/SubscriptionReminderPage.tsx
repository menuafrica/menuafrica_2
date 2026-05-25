import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SubscriptionReminderPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div id="subs-reminder-page" className="space-y-6 animate-fade-in text-center max-w-md mx-auto py-12">
      <span className="text-5xl">⚠️</span>
      <h2 className="text-xl font-black font-sans tracking-tight">Votre forfait arrive à échéance</h2>
      <p className="text-xs text-gray-400">Pour éviter toute interruption de service sur votre carte QR client, veuillez mettre à jour votre abonnement.</p>
      <button
        id="reminder-upgrade-btn"
        onClick={() => navigate('/admin/subscriptions')}
        className="h-11 px-6 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-xs"
      >
        Mettre à Jour Mon Abonnement
      </button>
    </div>
  );
};
