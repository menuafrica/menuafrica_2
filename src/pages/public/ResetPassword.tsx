import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../components/ui/UiComponents';

export const ResetPassword: React.FC = () => {
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Votre mot de passe a été modifié avec succès ! Veuillez vous reconnecter.');
    navigate('/auth');
  };

  return (
    <div id="reset-page" className="py-16 md:py-24 max-w-sm mx-auto px-4">
      <h2 className="text-2xl font-bold font-sans text-center mb-6">Réinitialiser mon mot de passe</h2>
      <form onSubmit={handleReset} className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Entrez votre nouveau mot de passe</label>
          <input
            type="password"
            required
            id="reset-pass"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-gray-950 border border-gray-1000 text-sm outline-none text-white focus:border-orange-500 font-sans"
          />
        </div>
        <button type="submit" id="reset-submit" className="w-full h-11 rounded-xl bg-orange-600 font-bold hover:bg-orange-500 text-xs">
          Confirmer le mot de passe
        </button>
      </form>
    </div>
  );
};
