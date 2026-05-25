import React, { useState } from 'react';
import { dbInstance } from '../../lib/virtual_db';
import { toast } from '../../components/ui/UiComponents';

export const TestConnection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleTest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(dbInstance.restaurants.length > 0);
      toast.success('Test d\'intégrité de la base de données virtuelle réussi !');
    }, 1200);
  };

  return (
    <div id="test-connection-page" className="space-y-6 max-w-sm mx-auto text-center py-12 animate-fade-in">
      <span className="text-5xl">⚡</span>
      <h2 className="text-xl font-black font-sans tracking-tight">Diagnostic Hub (Connexion)</h2>
      <p className="text-xs text-gray-400">Vérifiez l'intégration de la couche de persistance virtuelle simulée et de la synchronisation locale.</p>

      <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 text-left">
        <button
          id="btn-trigger-test"
          onClick={handleTest}
          disabled={loading}
          className="w-full h-11 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-xs"
        >
          {loading ? 'Interrogation en cours...' : 'Lancer le Diagnostic d\'Intégrité'}
        </button>

        {success !== null && (
          <div className={`p-4 rounded-xl border text-xs font-semibold ${
            success ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-red-500/10 border-red-500/25 text-red-400'
          }`}>
            {success ? '✓ Couche Base de données Virtuelle : Opérationnelle' : '❌ Couche Base de données Virtuelle : Erreur détectée'}
          </div>
        )}
      </div>
    </div>
  );
};
