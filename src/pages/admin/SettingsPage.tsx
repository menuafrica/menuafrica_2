import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/UiComponents';
import { Save, Image as ImageIcon, FileText, Bell, Activity, Sun, Moon, LogOut, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [weeklyReport, setWeeklyReport] = useState(true);
  const [monthlyReport, setMonthlyReport] = useState(true);
  const [newReviewsAlert, setNewReviewsAlert] = useState(true);
  const [newLikesAlert, setNewLikesAlert] = useState(true);
  
  const handleUpdate = async () => {
    toast.success('Paramètres enregistrés avec succès.');
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="space-y-6 pt-4 animate-fade-in max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-playfair font-black text-slate-800 tracking-tight">Paramètres</h2>
          <p className="text-sm text-slate-500 mt-1">Gérez vos préférences de communication et de sécurité.</p>
        </div>
        <button 
          onClick={handleUpdate}
          className="h-11 px-6 bg-[#D97706] hover:bg-[#B46002] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <Save className="w-4 h-4" />
          Enregistrer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Media Manager */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#D97706]">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Gestionnaire de Médias</h3>
                <p className="text-sm text-slate-500">Ajoutez, gérez et utilisez vos photos et vidéos.</p>
              </div>
            </div>
            <button className="h-10 px-5 bg-[#D97706] text-white rounded-lg text-sm font-semibold hover:bg-[#B46002] transition-colors">
              Ouvrir
            </button>
          </div>

          {/* Feedback Reports */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Rapports de Feedback</h3>
                <p className="text-sm text-slate-500">Recevez le résumé des avis clients et likes.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">RAPPORT HEBDOMADAIRE</div>
                  <p className="text-sm text-slate-500">Envoyé chaque Lundi. Contient : Nouveaux avis, compteur de likes, commentaires et lien direct pour y répondre.</p>
                </div>
                <Toggle isChecked={weeklyReport} onChange={setWeeklyReport} />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">BILAN MENSUEL</div>
                  <p className="text-sm text-slate-500">Analyse complète de la satisfaction client et des plats les plus appréciés du mois.</p>
                </div>
                <Toggle isChecked={monthlyReport} onChange={setMonthlyReport} />
              </div>
            </div>
          </div>

          {/* Instant Alerts */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Alertes Instantanées</h3>
                <p className="text-sm text-slate-500">Soyez notifié quand un client interagit.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">NOUVEAUX AVIS / COMMENTAIRES</div>
                <Toggle isChecked={newReviewsAlert} onChange={setNewReviewsAlert} />
              </div>
              <p className="text-xs text-slate-400 -mt-4">Quand un client laisse un commentaire écrit sur un plat.</p>
              
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">NOUVEAUX LIKES</div>
                <Toggle isChecked={newLikesAlert} onChange={setNewLikesAlert} />
              </div>
              <p className="text-xs text-slate-400 -mt-4">Notification discrète lors des "J'aime".</p>
            </div>
          </div>

          {/* System Diagnostic */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Diagnostic Système</h3>
                <p className="text-sm text-slate-500">État de santé de votre connexion.</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-slate-800 text-sm mb-1">Statut de connexion</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <span className="text-xs text-slate-400 font-mono">En attente</span>
                </div>
              </div>
              <button className="h-9 px-4 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                Lancer le diagnostic
              </button>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Language & Region */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Langue & Région</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                LANGUE DE L'INTERFACE
              </label>
              <select className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/20 transition-all">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                THÈME
              </label>
              <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-200">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white shadow-sm text-sm font-bold text-slate-800 transition-all">
                  <Sun className="w-4 h-4" />
                  Clair
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 transition-all">
                  <Moon className="w-4 h-4" />
                  Sombre
                </button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Sécurité</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                EMAIL DE CONNEXION
              </label>
              <input 
                type="email" 
                disabled 
                value={profile?.email || 'valryboulot137@gmail.com'}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none opacity-70"
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-red-600">ZONE DANGEREUSE</h3>
            
            <div className="space-y-3">
              <button 
                onClick={handleLogout}
                className="w-full h-11 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
               >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
              <button 
                className="w-full h-11 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
               >
                <Trash2 className="w-4 h-4" />
                Supprimer mon compte
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

// Toggle UI Component
const Toggle = ({ isChecked, onChange }: { isChecked: boolean; onChange: (v: boolean) => void }) => {
  return (
    <button
      onClick={() => onChange(!isChecked)}
      className={clsx(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
        isChecked ? "bg-[#D97706]" : "bg-slate-200"
      )}
    >
      <span className="sr-only">Toggle setting</span>
      <span
        aria-hidden="true"
        className={clsx(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg shadow-black/20 ring-0 transition duration-200 ease-in-out",
          isChecked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
};

