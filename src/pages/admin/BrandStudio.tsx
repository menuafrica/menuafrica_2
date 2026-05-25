import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/UiComponents';
import { Save, Upload, Palette, Smartphone, Eye } from 'lucide-react';

export const BrandStudio: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  
  const [logo, setLogo] = useState(profile?.restaurant?.logo_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200');
  const [hero, setHero] = useState(profile?.restaurant?.hero_image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200');
  const [name, setName] = useState(profile?.restaurant?.name || 'Chez Tonton');
  const [subdomain, setSubdomain] = useState(profile?.restaurant?.subdomain || 'chez-tonton');
  const [address, setAddress] = useState(profile?.restaurant?.address || 'Dakar, Sénégal');
  const [phone, setPhone] = useState(profile?.restaurant?.phone || '+221 77 000 00 00');
  
  const [tiktok, setTiktok] = useState(profile?.restaurant?.tiktok || '@tonton_tiktok');
  const [whatsapp, setWhatsapp] = useState(profile?.restaurant?.whatsapp || '+221...');

  const [primaryColor, setPrimaryColor] = useState('#C75C2E');
  const [bgColor, setBgColor] = useState('#F8FAFC');
  const [cardColor, setCardColor] = useState('#FFFFFF');
  const [textColor, setTextColor] = useState('#0F172A');

  const handleSave = async () => {
    await updateProfile({ 
      logo_url: logo, 
      hero_image_url: hero,
      name,
      subdomain,
      address,
      phone,
      tiktok,
      whatsapp
    });
    toast.success('Studio de Marque mis à jour avec succès !');
  };

  return (
    <div className="space-y-6 pt-4 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-playfair font-black text-slate-800 tracking-tight">Identité Visuelle</h2>
          <p className="text-sm text-slate-500 mt-1">Personnalisez l'esthétique globale de vos menus.</p>
        </div>
        <button 
          onClick={handleSave}
          className="h-11 px-6 bg-[#D97706] hover:bg-[#B46002] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <Save className="w-4 h-4" />
          Enregistrer
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        
        {/* Left Column - Forms */}
        <div className="flex-1 space-y-6">
          
          {/* Identity & Information */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:p-8 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Identité & Informations</h3>
              <p className="text-sm text-slate-500">Informations principales publiquement visibles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">LOGO</label>
                <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer text-slate-500 hover:text-slate-700">
                  <Upload className="w-6 h-6" />
                  <div className="text-center">
                    <span className="text-sm font-bold block">Logo</span>
                    <span className="text-[10px]">JPG, PNG optimisés</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">BANNIÈRE / COVER</label>
                <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer text-slate-500 hover:text-slate-700">
                  <Upload className="w-6 h-6" />
                  <div className="text-center">
                    <span className="text-sm font-bold block">Bannière / Cover</span>
                    <span className="text-[10px]">JPG, PNG optimisés</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">NOM DU RESTAURANT</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/20 transition-all font-medium text-slate-700 placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">IDENTIFIANT PUBLIC</label>
                <input 
                  type="text" 
                  value={subdomain}
                  onChange={e => setSubdomain(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/20 transition-all font-medium text-slate-700 placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">ADRESSE</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/20 transition-all font-medium text-slate-700 placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">TÉLÉPHONE</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/20 transition-all font-medium text-slate-700 placeholder-slate-400"
                />
              </div>
               <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">TIKTOK</label>
                <input 
                  type="text" 
                  value={tiktok}
                  onChange={e => setTiktok(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/20 transition-all font-medium text-slate-700 placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">WHATSAPP</label>
                <input 
                  type="text" 
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/20 transition-all font-medium text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Palette Avancée */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:p-8 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Palette Avancée</h3>
              <p className="text-sm text-slate-500">Définissez les couleurs clés de votre charte graphique.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <ColorInput label="COULEUR PRIMAIRE" value={primaryColor} onChange={setPrimaryColor} />
               <ColorInput label="FOND DE PAGE" value={bgColor} onChange={setBgColor} />
               <ColorInput label="COULEUR DES CARTES" value={cardColor} onChange={setCardColor} />
               <ColorInput label="COULEUR DU TEXTE" value={textColor} onChange={setTextColor} />
            </div>
          </div>
        </div>

        {/* Right Column - Simulator Sticky */}
        <div className="w-full lg:w-96 shrink-0 lg:sticky lg:top-24 h-max pb-10">
          <div className="relative mx-auto border-[10px] border-slate-800 rounded-[3rem] w-[320px] shadow-2xl overflow-hidden bg-[#F8FAFC]">
            {/* Phone Top Notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-xl max-w-[140px] mx-auto z-50"></div>
            
            {/* Phone Screen Content / Simulator */}
            <div className="h-[650px] relative overflow-y-auto hide-scrollbar" style={{ backgroundColor: bgColor, color: textColor }}>
              
              {/* Header Image */}
              <div 
                className="h-40 w-full bg-slate-200 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${hero})` }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
                
                {/* Logo */}
                <div 
                  className="absolute -bottom-6 right-4 w-16 h-16 rounded-full bg-white border-4 border-white bg-cover bg-center shadow-md z-10"
                  style={{ backgroundImage: `url(${logo})` }}
                ></div>

                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="font-playfair font-bold text-xl">{name}</h1>
                  <p className="text-[10px] opacity-80">{address}</p>
                </div>
              </div>

              {/* Sticky Categories */}
              <div className="sticky top-0 z-40 px-3 py-3 overflow-x-auto whitespace-nowrap hide-scrollbar flex gap-2 border-b border-black/5" style={{ backgroundColor: bgColor }}>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm" style={{ backgroundColor: primaryColor }}>Entrées</span>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold shadow-sm" style={{ backgroundColor: cardColor, color: textColor }}>Plats</span>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold shadow-sm" style={{ backgroundColor: cardColor, color: textColor }}>Desserts</span>
              </div>

              <div className="p-4 space-y-4">
                <h3 className="font-bold text-sm tracking-widest uppercase">ENTRÉES</h3>
                
                <div className="rounded-xl p-3 flex gap-3 shadow-sm border border-black/5" style={{ backgroundColor: cardColor }}>
                  <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80')" }}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm leading-tight">Poulet Yassa</h4>
                      <span className="text-xs font-bold" style={{ color: primaryColor }}>4 500 F</span>
                    </div>
                    <p className="text-[10px] mt-1 opacity-70 leading-tight">Mariné au citron vert et aux oignons caramélisés.</p>
                  </div>
                </div>

                <div className="rounded-xl p-3 flex gap-3 shadow-sm border border-black/5" style={{ backgroundColor: cardColor }}>
                  <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm leading-tight">Salade Niçoise</h4>
                      <span className="text-xs font-bold" style={{ color: primaryColor }}>3 000 F</span>
                    </div>
                    <p className="text-[10px] mt-1 opacity-70 leading-tight">Thon frais, olives, oeufs durs et légumes croquants.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Phone bottom indicator */}
            <div className="absolute bottom-2 inset-x-0 h-1 bg-slate-300 rounded-full max-w-[120px] mx-auto z-50"></div>
          </div>
          
          <div className="text-center mt-4 pb-12 lg:pb-0">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">APERÇU DIRECT (SIMULATION)</span>
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
