import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../components/ui/UiComponents';
import { CreditCard, Smartphone, Check } from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSimulatePayment = (provider: string) => {
    toast.loading(`Initialisation de la transaction ${provider}...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success('Paiement simulé avec succès !');
      navigate('/admin');
    }, 1500);
  };

  return (
    <div className="space-y-6 pt-12 animate-fade-in max-w-md mx-auto">
      <div className="text-center space-y-4 mb-8">
        <div className="w-16 h-16 bg-orange-50 text-[#D97706] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <CreditCard className="w-8 h-8" />
        </div>
        <div>
           <h2 className="text-3xl font-playfair font-black text-slate-800 tracking-tight">Caisse en ligne</h2>
           <p className="text-sm text-slate-500 mt-2">Sélectionnez votre moyen de paiement sécurisé pour activer le Forfait PRO.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-8">
        
        {/* Order Summary */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
           <div className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-2">
             <span>Forfait PRO (Mensuel)</span>
             <span>15 000 XOF</span>
           </div>
           <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-200">
             <span>TVA (0%)</span>
             <span>0 XOF</span>
           </div>
           <div className="flex items-center justify-between mt-3 text-lg font-black text-slate-800">
             <span>Total à payer</span>
             <span>15 000 XOF</span>
           </div>
        </div>

        {/* Western African local billing methods */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Méthodes de paiement</span>
          
          <button
            onClick={() => handleSimulatePayment('Wave Senegal')}
            className="w-full h-14 rounded-2xl bg-white hover:bg-sky-50 border-2 border-[#12b4e8]/20 flex items-center justify-between px-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#12b4e8]/10 text-[#12b4e8] flex items-center justify-center font-black italic text-lg">W</div>
              <span className="font-bold text-slate-700 text-sm">Wave Pay</span>
            </div>
          </button>

          <button
            onClick={() => handleSimulatePayment('Orange Money')}
            className="w-full h-14 rounded-2xl bg-white hover:bg-orange-50 border-2 border-[#FF6600]/20 flex items-center justify-between px-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF6600]/10 text-[#FF6600] flex items-center justify-center font-black">O</div>
              <span className="font-bold text-slate-700 text-sm">Orange Money</span>
            </div>
          </button>

          <button
            onClick={() => handleSimulatePayment('Carte Bancaire')}
            className="w-full h-14 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 flex items-center justify-between px-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-700 text-sm">Carte Visa / Mastercard</span>
            </div>
          </button>
        </div>
      </div>
      
      <div className="text-center">
         <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
           <Check className="w-3 h-3 text-emerald-500" /> Paiements 100% sécurisés par Paytech.
         </p>
      </div>

    </div>
  );
};
