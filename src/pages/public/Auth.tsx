import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/UiComponents';
import { KeyRound, Mail, Store, Phone, Eye, EyeOff, Sparkles, LogIn, ArrowRight } from 'lucide-react';

export const Auth: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Signup states
  const [restoName, setRestoName] = useState('');
  const [slug, setSlug] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [phone, setPhone] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(loginEmail, loginPass);
      toast.success('Connexion réussie ! Bienvenue sur Menu Africa.');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean and validate slug
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!cleanSlug) {
      toast.error('Veuillez introduire un identifiant lisible (slug) valide.');
      return;
    }

    try {
      await signUp(restoName, cleanSlug, signupEmail, signupPass, phone);
      toast.success('Félicitations ! Votre restaurant a été créé avec succès.');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Échec de la création du compte.');
    }
  };

  return (
    <div id="auth-page-container" className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 bg-slate-50/50">
      
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2 max-w-sm animate-fade-in animate-duration-300">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/10 mb-2">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-playfair font-black tracking-tight text-slate-800">Menu Africa</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Espace Studio & Création</p>
      </div>

      <div 
        id="auth-box" 
        className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-8 sm:p-10 space-y-6 animate-slide-up"
      >
        {/* Toggle tabs */}
        <div id="auth-tabs" className="flex p-1 bg-slate-100/80 rounded-2xl">
          <button
            id="tab-login"
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 min-h-[44px] py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              isLogin 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Se Connecter
          </button>
          <button
            id="tab-signup"
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 min-h-[44px] py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              !isLogin 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Créer un Restaurant
          </button>
        </div>

        {isLogin ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} id="login-form" className="space-y-4">
            <h3 className="text-lg font-bold font-sans text-slate-800">Se connecter</h3>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500">Adresse email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  id="log-email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="chef@lateranga.sn"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 font-sans transition-all"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-500">Mot de passe</label>
                <button
                  type="button"
                  onClick={() => toast.info('Démo : Utiliser "password123" ou "escale123"')}
                  className="text-[10px] font-semibold text-amber-600 hover:underline"
                >
                  Oublié ?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  id="log-pass"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-10 pr-10 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 font-sans transition-all"
                />
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 active:scale-98 transition-all rounded-xl font-bold text-sm text-white shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              Entrer dans mon Studio
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* QUICK SELECTION DEMO ACCOUNTS */}
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">🔐 Mode démo : Accéder aux comptes réservés</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('chef@lateranga.sn');
                    setLoginPass('password123');
                    toast.success('Rempli : Chef Teranga');
                  }}
                  className="p-3 text-left rounded-2xl border border-slate-100 hover:border-amber-500 hover:bg-amber-50/25 transition-all outline-none"
                >
                  <span className="font-bold text-xs text-slate-800 block">La Teranga</span>
                  <span className="text-[10px] text-slate-400 block font-mono mt-0.5">chef@lateranga.sn</span>
                  <span className="text-[10px] text-amber-600 font-semibold block mt-1">Niveau Premium ★</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('escale@lescale.com');
                    setLoginPass('escale123');
                    toast.success('Rempli : L\'Escale');
                  }}
                  className="p-3 text-left rounded-2xl border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/25 transition-all outline-none"
                >
                  <span className="font-bold text-xs text-slate-800 block">L'Escale</span>
                  <span className="text-[10px] text-slate-400 block font-mono mt-0.5">escale@lescale.com</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Niveau Starter</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignup} id="signup-form" className="space-y-4">
            <h3 className="text-lg font-bold font-sans text-slate-800">Nouveau restaurant</h3>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500">Nom de l'établissement</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  id="sign-resto-name"
                  value={restoName}
                  onChange={(e) => {
                    setRestoName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
                  }}
                  placeholder="Ex. Le Calao d'Or"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 font-sans transition-all"
                />
                <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500">Lien du menu (subdomain)</label>
              <div className="flex items-center h-12 px-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-xs text-slate-400 font-mono select-none">menu.sn/</span>
                <input
                  type="text"
                  required
                  id="sign-subdomain"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="le-calao"
                  className="flex-1 min-w-0 bg-transparent text-slate-800 text-sm outline-none ml-0.5 font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500">Votre adresse email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  id="sign-email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="directeur@calao.com"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 font-sans transition-all"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500">Téléphone de contact</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  id="sign-whatsapp"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221 77 123 45 67"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 font-sans transition-all"
                />
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500">Mot de passe</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  id="sign-pass"
                  value={signupPass}
                  onChange={(e) => setSignupPass(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 font-sans transition-all"
                />
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              id="signup-submit-btn"
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 active:scale-98 transition-all rounded-xl font-bold text-sm text-white shadow-sm flex items-center justify-center gap-2 mt-4"
            >
              Enregistrer mon Établissement
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
