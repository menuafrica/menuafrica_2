import React, { useState } from 'react';
import { toast } from '../../components/ui/UiComponents';

export const MavadaSettingsPage: React.FC = () => {
  const [prompt, setPrompt] = useState("Tu es le serveur virtuel de l'établissement 'La Teranga'. Réponds brièvement, donne faim au client, et propose des boissons supplémentaires.");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configuration système de l\'agent IA enregistrée.');
  };

  return (
    <div id="mavada-settings-page" className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-black font-sans tracking-tight">🤖 Configuration de l'IA Assistant (Mavada AI)</h2>
        <p className="text-xs text-gray-400">Définissez le ton, la personnalité sémantique et les objectifs sémantiques de votre serveur robotique interactif.</p>
      </div>

      <form onSubmit={handleSave} className="max-w-xl p-8 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 shadow-xl">
        <div>
          <label className="block text-2xs font-mono uppercase text-gray-400 mb-1">Instruction Système Primaire (System Prompt)</label>
          <textarea
            required
            id="mvd-sys-prompt"
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-4 rounded-xl bg-gray-950 border border-gray-850 text-xs text-white outline-none focus:border-orange-500 font-sans resize-none"
          />
        </div>

        <button
          type="submit"
          id="mav-sys-submit"
          className="w-full h-11 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-xs"
        >
          Sauvegarder les Instructions Sémantiques
        </button>
      </form>
    </div>
  );
};
