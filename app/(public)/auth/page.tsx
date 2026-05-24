"use client";
import React, { useState, useEffect, useActionState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Label, toast } from '@/components/ui/uicomponents';
import { Mail, Lock, Eye, EyeOff, User, Sparkles, Heart, ArrowRight, Loader2, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signUp } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup'>(searchParams?.get('mode') === 'signup' ? 'signup' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const loadingMessages = [
    "Préparation de votre cuisine...",
    "Vérification des ingrédients...",
    "Mise en place de vos menus...",
    "Connexion sécurisée au serveur...",
    "Finalisation de la mise en place...",
    "Presque prêt..."
  ];

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const emailValue = formData.get('email') as string;
    const passwordValue = formData.get('password') as string;
    const restaurantNameValue = formData.get('restaurantName') as string;
    const confirmPasswordValue = formData.get('confirmPassword') as string;

    try {
      let shouldRedirect = true;
      if (mode === 'signup') {
        if (passwordValue !== confirmPasswordValue) throw new Error("Les mots de passe ne correspondent pas.");
        if (passwordValue.length < 6) throw new Error("Le mot de passe doit faire au moins 6 caractères.");
        if (!restaurantNameValue?.trim()) throw new Error("Le nom du restaurant est obligatoire.");
        
        shouldRedirect = await signUp(emailValue, passwordValue, restaurantNameValue);
      } else {
        await signIn(emailValue, passwordValue);
      }
      
      if (shouldRedirect) {
        const redirectUrl = searchParams?.get('redirect') || '/admin';
        router.push(redirectUrl);
      } else {
        setMode('signin');
      }
      return { success: true, error: null };
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue");
      return { success: false, error: err.message };
    }
  }, { success: false, error: null });

  useEffect(() => {
    let interval: any;
    if (isPending) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isPending]);

  const handleToggleMode = () => {
    const newMode = mode === 'signup' ? 'signin' : 'signup';
    setMode(newMode);
    router.push(`/auth?mode=${newMode}`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-10 bg-[#FAFAFA] dark:bg-[#020617] font-sans selection:bg-orange-100">
      <title>{mode === 'signup' ? 'Créer un compte - MenuAfrica' : 'Connexion - MenuAfrica'}</title>

      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white dark:bg-[#0f172a] rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-100 dark:border-gray-800 animate-scale-in">
        
        <div className="w-full md:w-[42%] bg-[#c25e00] p-12 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="relative z-10">
            <Link href="/" className="inline-block transition-transform hover:scale-105 mb-16">
               <img 
                 src="https://i.postimg.cc/FzpZyHRs/capture-251207-013446.png" 
                 alt="MenuAfrica" 
                 className="h-12 w-auto object-contain"
               />
            </Link>

            <div className="space-y-6">
              <h1 className="font-serif text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white">
                {mode === 'signup' ? "Créez votre\nSuccès." : "Bon retour\nChef !"}
              </h1>
              <p className="text-orange-100 text-xl font-medium leading-relaxed max-w-xs opacity-90">
                La plateforme #1 pour les restaurateurs africains.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 pt-12 border-t border-white/10 flex items-center gap-2">
                <Sparkles size={14} className="text-orange-200" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-100/60 flex items-center gap-1">
                    Propulsé par Bibin <Heart size={10} className="fill-current text-white/80" />
                </span>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-16 lg:p-20 flex flex-col items-center justify-center bg-white dark:bg-[#0f172a]">
          <div className="w-full max-w-sm flex flex-col">
            
            <div className="mb-8 text-center md:text-left">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                  {mode === 'signup' ? 'Commencer' : 'Connexion'}
                </h2>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c25e00] bg-orange-50 w-fit px-3 py-1 rounded-full mx-auto md:mx-0">
                    <Mail size={12} /> Email Professionnel
                </div>
            </div>

            <form action={formAction} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1.5 animate-fade-in">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nom du restaurant</Label>
                    <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <Input 
                          name="restaurantName"
                          placeholder="Ex: Le Teranga" 
                          value={restaurantName} 
                          onChange={(e) => setRestaurantName(e.target.value)}
                          className="rounded-2xl h-12 border-gray-100 bg-gray-50/50 pl-11 focus:bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:bg-slate-700"
                          required
                        />
                    </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</Label>
                <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <Input 
                      name="email"
                      type="email" 
                      placeholder="admin@resto.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-2xl h-12 border-gray-100 bg-gray-50/50 pl-11 focus:bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:bg-slate-700"
                      autoComplete="email"
                      required
                    />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mot de passe</Label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <Input 
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-2xl h-12 px-11 border-gray-100 bg-gray-50/50 focus:bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:bg-slate-700"
                    autoComplete={mode === 'signup' ? "new-password" : "current-password"}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-1.5 animate-fade-in">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Confirmer</Label>
                  <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <Input 
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={cn(
                            "rounded-2xl h-12 pl-11 border-gray-100 bg-gray-50/50 focus:bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:bg-slate-700",
                            confirmPassword && password !== confirmPassword && "border-red-200 bg-red-50/10 dark:bg-red-900/10 dark:border-red-800"
                        )}
                        required
                      />
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button 
                    type="submit"
                    disabled={isPending}
                    className="w-full h-16 bg-[#c25e00] hover:bg-[#a04e00] text-white font-bold rounded-2xl shadow-xl shadow-orange-500/10 border-none transition-all active:scale-95 disabled:opacity-90 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={20} /> 
                                <span>{mode === 'signup' ? "Création..." : "Connexion..."}</span>
                            </div>
                            <span className="text-xs font-bold opacity-90 animate-pulse mt-1 text-orange-100">
                                {loadingMessages[loadingMessageIndex]}
                            </span>
                        </div>
                    ) : (
                        <>{mode === 'signup' ? "S'inscrire" : "Se connecter"} <ArrowRight size={18} className="ml-2" /></>
                    )}
                </Button>
              </div>

              <div className="pt-6 flex flex-col items-center gap-3">
                  <button 
                      type="button"
                      onClick={handleToggleMode}
                      className="text-sm font-bold text-gray-500 hover:text-[#c25e00] transition-colors underline underline-offset-4"
                    >
                      {mode === 'signup' ? "J'ai déjà un compte" : "Créer un compte"}
                  </button>

                  <Link href="/" className="mt-2 flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#c25e00] transition-colors uppercase tracking-widest">
                      <Home size={14} /> Accueil
                  </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
