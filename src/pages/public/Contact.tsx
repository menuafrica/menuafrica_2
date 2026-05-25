import React, { useState } from 'react';
import { toast } from '../../components/ui/UiComponents';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Votre demande a bien été envoyée ! Un conseiller vous contactera sous 24h.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div id="contact-page" className="py-16 md:py-24 max-w-xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight">Contactez un Conseiller Menu Africa</h2>
        <p className="mt-2 text-sm text-gray-400">Nous sommes là pour vous accompagner dans la digitalisation de votre carte.</p>
      </div>

      <form onSubmit={onSubmit} className="p-8 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 shadow-xl">
        <div>
          <label className="block text-xs font-bold font-mono uppercase text-gray-400 mb-1">Nom / Nom du Restaurant</label>
          <input
            type="text"
            required
            id="cont-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-11 px-4 rounded-xl bg-gray-950 border border-gray-800 text-sm focus:border-orange-500 outline-none text-white transition-all font-sans"
          />
        </div>

        <div>
          <label className="block text-xs font-bold font-mono uppercase text-gray-400 mb-1">Email de Contact</label>
          <input
            type="email"
            required
            id="cont-email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full h-11 px-4 rounded-xl bg-gray-950 border border-gray-800 text-sm focus:border-orange-500 outline-none text-white transition-all font-sans"
          />
        </div>

        <div>
          <label className="block text-xs font-bold font-mono uppercase text-gray-400 mb-1">Message / Question</label>
          <textarea
            required
            id="cont-msg"
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full p-4 rounded-xl bg-gray-950 border border-gray-800 text-sm focus:border-orange-500 outline-none text-white transition-all font-sans resize-none"
          />
        </div>

        <button
          type="submit"
          id="cont-submit"
          className="w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold text-sm active:scale-95 transition-all outline-none"
        >
          Envoyer ma demande 🦁
        </button>
      </form>
    </div>
  );
};
