import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const PreviewPage: React.FC = () => {
  const { profile } = useAuth();
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  const currentResto = profile?.restaurant || { name: 'La Teranga Premium', subdomain: 'la-teranga' };
  const mockFrameUrl = `#/menu/${currentResto.subdomain}`;

  return (
    <div id="preview-frame-page" className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black font-sans tracking-tight">👁️ Simulateur de Rendu Interactif</h2>
          <p className="text-xs text-gray-400">Voyez exactement ce que voient vos clients lorsqu'ils flashent le code QR avec leurs téléphones respectifs.</p>
        </div>
        
        {/* Device Switcher */}
        <div className="flex p-1 bg-gray-900 rounded-xl border border-gray-800">
          <button
            id="switch-dev-mob"
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              device === 'mobile' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            📱 Mobile
          </button>
          <button
            id="switch-dev-tab"
            onClick={() => setDevice('tablet')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              device === 'tablet' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            📟 Tablette
          </button>
          <button
            id="switch-dev-desk"
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              device === 'desktop' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            💻 Bureau
          </button>
        </div>
      </div>

      {/* Frame box */}
      <div className="flex justify-center bg-gray-950 p-6 rounded-2xl border border-gray-850">
        <div
          id="mock-device-wrapper"
          className={`bg-gray-900 border-4 border-gray-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
            device === 'mobile' ? 'w-80 h-[500px]' : device === 'tablet' ? 'w-[550px] h-[600px]' : 'w-full h-[650px]'
          }`}
        >
          <iframe
            src={mockFrameUrl}
            title="Aperçu Carte Interactif"
            className="w-full h-full border-0 bg-gray-950"
          />
        </div>
      </div>
    </div>
  );
};
