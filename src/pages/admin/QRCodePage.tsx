import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/UiComponents';
import { Download, Save, QrCode as QrIcon, Palette } from 'lucide-react';
import clsx from 'clsx';

export const QRCodePage: React.FC = () => {
  const { profile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'unique' | 'fusion'>('unique');
  const [menuId, setMenuId] = useState('testmenu');
  const [qrColor, setQrColor] = useState('#C75C2E');
  const [qrBg, setQrBg] = useState('#FFFFFF');
  const [qrStyle, setQrStyle] = useState('rounded');

  const currentResto = profile?.restaurant || { name: 'KU NZO', subdomain: 'la-teranga' };

  const handlePrint = () => {
    toast.success('Rendu PDF en cours...');
  };

  return (
    <div className="space-y-6 pt-4 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-playfair font-black text-slate-800 tracking-tight">QR Studio Pro</h2>
          <p className="text-sm text-slate-500 mt-1">Créez des points d'accès intelligents</p>
        </div>
        <div className="flex items-center gap-2 border border-slate-200 p-1.5 rounded-xl bg-white shadow-sm">
          <button
            onClick={() => toast.success('Téléchargement PNG')}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span className="font-bold text-xs">PNG</span>
          </button>
          <button
            onClick={() => toast.success('Options sauvegardées')}
            className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={handlePrint}
            className="h-10 px-4 flex items-center justify-center bg-[#D97706] text-white rounded-lg hover:bg-[#B46002] transition-colors"
          >
            <span className="font-bold text-xs">PDF</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-8 items-start">
        
        {/* Left Column - Controls */}
        <div className="flex-1 space-y-6 w-full">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setActiveTab('unique')}
                className={clsx(
                  "flex-1 py-4 text-sm font-bold transition-colors",
                  activeTab === 'unique' ? "text-[#D97706] border-b-2 border-[#D97706]" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                Menu Unique
              </button>
              <button 
                onClick={() => setActiveTab('fusion')}
                className={clsx(
                  "flex-1 py-4 text-sm font-bold transition-colors",
                  activeTab === 'fusion' ? "text-[#D97706] border-b-2 border-[#D97706]" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                Fusion Pro
              </button>
            </div>

            <div className="p-6 lg:p-8 space-y-8">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">SÉLECTIONNER UN MENU</label>
                <select 
                  value={menuId}
                  onChange={(e) => setMenuId(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/20 transition-all font-medium text-slate-700"
                >
                  <option value="testmenu">testmenu</option>
                  <option value="midi">Menu Midi</option>
                  <option value="soir">Carte du Soir</option>
                </select>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-6">Personnalisation</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ColorInput label="COULEUR" value={qrColor} onChange={setQrColor} />
                  <ColorInput label="FOND" value={qrBg} onChange={setQrBg} />
                  
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">STYLE DES POINTS</label>
                    <select 
                      value={qrStyle}
                      onChange={(e) => setQrStyle(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/20 transition-all font-medium text-slate-700"
                    >
                      <option value="rounded">Arrondi (Standard)</option>
                      <option value="square">Carré</option>
                      <option value="dots">Points</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="w-full lg:w-96 shrink-0 flex items-start justify-center pt-8">
           <div className="relative border-4 border-slate-200 rounded-3xl p-6 bg-white w-72 shadow-lg flex flex-col items-center">
             <h3 className="font-playfair font-black text-2xl tracking-tighter text-slate-800 mb-8">{currentResto.name}</h3>
             
             <div 
                className="w-48 h-48 rounded-xl flex items-center justify-center p-2 mb-8 shadow-sm"
                style={{ backgroundColor: qrBg, border: `2px solid ${qrColor}20` }}
             >
                {/* Simulated QR Code (would use an actual generator library in production) */}
                <div className="w-full h-full relative" style={{ backgroundColor: qrBg }}>
                   <div className="absolute top-0 left-0 w-12 h-12 border-4 rounded-lg" style={{ borderColor: qrColor }}></div>
                   <div className="absolute top-0 right-0 w-12 h-12 border-4 rounded-lg" style={{ borderColor: qrColor }}></div>
                   <div className="absolute bottom-0 left-0 w-12 h-12 border-4 rounded-lg" style={{ borderColor: qrColor }}></div>
                   <div className="absolute inset-x-14 inset-y-14 flex items-center justify-center flex-wrap gap-1">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: qrColor }}></div>
                     <div className="w-3 h-3 rounded-full opactity-50" style={{ backgroundColor: qrColor }}></div>
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: qrColor }}></div>
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: qrColor }}></div>
                   </div>
                </div>
             </div>

             <div className="text-center px-4">
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Scannez pour découvrir</p>
                 <p className="text-sm font-medium text-slate-800">NOTRE MENU DU JOUR</p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// Helper component for Color input
const ColorInput = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md shadow-sm border border-black/10 overflow-hidden">
          <input 
            type="color" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
          />
        </div>
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/20 transition-all uppercase"
        />
        <Palette className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};
