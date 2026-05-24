"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, Label, Switch, toast } from '@/components/ui/uicomponents';
import { Bell, Shield, Globe, Download, Trash2, LogOut, Check, Database, Activity, ServerCrash, Save, Moon, Sun, Mail, FileBarChart, Zap, Clock, ThumbsUp, MessageSquare, Image } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [reportWeekly, setReportWeekly] = useState(true);
  const [reportMonthly, setReportMonthly] = useState(true);
  const [reportEmail, setReportEmail] = useState(user?.email || '');

  const [alertReview, setAlertReview] = useState(true);
  const [alertLike, setAlertLike] = useState(true);
  
  const [pingStatus, setPingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [latency, setLatency] = useState<number | null>(null);

  const handleSavePreferences = async () => {
      setSaving(true);
      const payload = {
          reports: {
              weekly: reportWeekly,
              monthly: reportMonthly,
              target_email: reportEmail
          },
          alerts: {
              reviews: alertReview,
              likes: alertLike
          },
          preferred_language: language,
          preferred_theme: theme,
          updated_at: new Date().toISOString()
      };

      if (isSupabaseConfigured && user?.id) {
          try {
              const { error } = await supabase.auth.updateUser({
                  data: payload
              });

              if (error) throw error;
              toast.success("Préférences sauvegardées avec succès.");
          } catch (e: any) {
              toast.error(t('error') + " : " + e.message);
          }
      } else {
          await new Promise(r => setTimeout(r, 800));
          toast.success("Sauvegardé (Mode Démo)");
      }
      setSaving(false);
  };

  const handleSavePassword = async () => {
    if (!user?.email) return;
    setLoading(true);
    
    if (isSupabaseConfigured) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: window.location.origin + '/reset-password',
            });
            if (error) throw error;
            toast.success(t('sendResetEmail') + " " + user.email);
        } catch (e: any) {
            toast.error(t('error') + " : " + e.message);
        }
    } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Email envoyé ! (Simulation)");
    }
    setLoading(false);
  };

  const handleTestConnection = async () => {
      if (!isSupabaseConfigured) {
          toast.error("Supabase n'est pas configuré.");
          return;
      }
      setPingStatus('loading');
      setLatency(null);
      const start = performance.now();
      try {
          const { error } = await supabase.from('restaurants').select('count', { count: 'exact', head: true });
          if (error && error.code !== 'PGRST116') throw error;
          
          const end = performance.now();
          setLatency(Math.round(end - start));
          setPingStatus('success');
          toast.success(t('connected'));
      } catch (e: any) {
          console.error(e);
          setPingStatus('error');
          const errorMsg = typeof e?.message === 'string' ? e.message : "Erreur inconnue";
          toast.error(t('error') + ": " + errorMsg);
      }
  };

  const handleDeleteAccount = async () => {
     if(confirm("DANGER : " + t('dangerDesc'))) {
         if (!isSupabaseConfigured) {
             toast.error("Impossible en mode démo.");
             return;
         }
         try {
             const { error } = await supabase.rpc('delete_user_account');
             if (error) throw error;
             toast.success("Compte supprimé. Au revoir !");
             await signOut();
             router.push('/');
         } catch (e: any) {
             console.error(e);
             toast.error(t('error') + " : " + e.message);
         }
     }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12 dark:text-slate-100">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">{t('settings')}</h1>
           <p className="text-slate-500 dark:text-slate-400">{t('settingsDesc')}</p>
        </div>
        <Button onClick={handleSavePreferences} isLoading={saving} className="bg-[#c25e00] hover:bg-[#a04e00] text-white shadow-lg shadow-orange-500/20 px-8 rounded-xl">
            <Save className="mr-2 h-4 w-4" /> {t('save')}
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            <Card className="border-none shadow-sm dark:bg-slate-800 overflow-hidden bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10">
                <CardHeader className="pb-4">
                   <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="p-3 bg-white dark:bg-slate-800 text-[#c25e00] rounded-xl shadow-sm">
                             <Image size={24} />
                          </div>
                          <div>
                             <CardTitle className="text-lg text-slate-900 dark:text-white">{t('mediaManagerTitle') || 'Gestionnaire de Médias'}</CardTitle>
                             <CardDescription className="text-slate-600 dark:text-slate-400">
                                {t('mediaManagerDesc') || 'Ajoutez, gérez et utilisez vos photos et vidéos.'}
                             </CardDescription>
                          </div>
                       </div>
                       <Button onClick={() => router.push('/admin/media')} className="bg-[#c25e00] hover:bg-[#a04e00] text-white">
                           Ouvrir
                       </Button>
                   </div>
                </CardHeader>
            </Card>

            <Card className="border-none shadow-sm dark:bg-slate-800 overflow-hidden">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 pb-4">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                         <FileBarChart size={20} />
                      </div>
                      <div>
                         <CardTitle className="text-lg dark:text-white">{t('feedbackReports')}</CardTitle>
                         <CardDescription className="dark:text-slate-400">{t('feedbackReportsDesc')}</CardDescription>
                      </div>
                   </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                   <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 rounded-xl">
                      <div className="space-y-1">
                         <Label className="text-base cursor-pointer dark:text-slate-200 flex items-center gap-2" onClick={() => setReportWeekly(!reportWeekly)}>
                            <Clock size={16} className="text-slate-400"/> {t('weeklyReport')}
                         </Label>
                         <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                            {t('weeklyReportDesc')}
                         </p>
                      </div>
                      <Switch checked={reportWeekly} onCheckedChange={(v) => setReportWeekly(v)} />
                   </div>

                   <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 rounded-xl">
                      <div className="space-y-1">
                         <Label className="text-base cursor-pointer dark:text-slate-200 flex items-center gap-2" onClick={() => setReportMonthly(!reportMonthly)}>
                            <Clock size={16} className="text-slate-400"/> {t('monthlyReport')}
                         </Label>
                         <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                            {t('monthlyReportDesc')}
                         </p>
                      </div>
                      <Switch checked={reportMonthly} onCheckedChange={(v) => setReportMonthly(v)} />
                   </div>

                   <div className="pt-2">
                      <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 block">{t('receiveEmail')}</Label>
                      <div className="flex gap-3">
                          <div className="relative flex-1">
                             <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                             <Input 
                                value={reportEmail} 
                                onChange={(e) => setReportEmail(e.target.value)} 
                                className="pl-10 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                                placeholder="email@restaurant.com"
                             />
                          </div>
                      </div>
                   </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm dark:bg-slate-800 overflow-hidden">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 pb-4">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                         <Bell size={20} />
                      </div>
                      <div>
                         <CardTitle className="text-lg dark:text-white">{t('instantAlerts')}</CardTitle>
                         <CardDescription className="dark:text-slate-400">{t('instantAlertsDesc')}</CardDescription>
                      </div>
                   </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                   <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                          <Label className="text-base dark:text-slate-200 flex items-center gap-2"><MessageSquare size={16} /> {t('newReviews')}</Label>
                          <p className="text-xs text-slate-400">{t('newReviewsDesc')}</p>
                      </div>
                      <Switch checked={alertReview} onCheckedChange={(v) => setAlertReview(v)} />
                   </div>
                   <div className="h-px bg-slate-100 dark:bg-slate-700" />
                   
                   <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                          <Label className="text-base dark:text-slate-200 flex items-center gap-2"><ThumbsUp size={16} /> {t('newLikes')}</Label>
                          <p className="text-xs text-slate-400">{t('newLikesDesc')}</p>
                      </div>
                      <Switch checked={alertLike} onCheckedChange={(v) => setAlertLike(v)} />
                   </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm dark:bg-slate-800 overflow-hidden">
                 <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 pb-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
                           <Activity size={20} />
                        </div>
                        <div>
                           <CardTitle className="text-lg dark:text-white">{t('systemDiag')}</CardTitle>
                           <CardDescription className="dark:text-slate-400">{t('systemDiagDesc')}</CardDescription>
                        </div>
                     </div>
                 </CardHeader>
                 <CardContent className="pt-6 grid md:grid-cols-2 gap-8 items-center">
                     <div>
                         <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('connectionStatus')}</h3>
                         <div className="flex items-center gap-3 mt-2">
                             <div className={cn("w-3 h-3 rounded-full animate-pulse", 
                                 pingStatus === 'success' ? "bg-green-500" : 
                                 pingStatus === 'error' ? "bg-red-500" : "bg-slate-300"
                             )} />
                             <span className="font-mono text-sm font-medium dark:text-slate-300">
                                 {pingStatus === 'idle' ? t('waiting') : 
                                  pingStatus === 'loading' ? t('testing') :
                                  pingStatus === 'success' ? `${t('connected')} (${latency}ms)` : t('error')}
                             </span>
                         </div>
                     </div>
                     <div className="flex justify-end">
                         <Button variant="outline" onClick={handleTestConnection} isLoading={pingStatus === 'loading'} className="dark:bg-slate-700 dark:text-white dark:border-slate-600">
                             {t('startPing')}
                         </Button>
                     </div>
                 </CardContent>
            </Card>

         </div>

         <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-sm dark:bg-slate-800">
               <CardHeader className="pb-4">
                  <CardTitle className="text-base dark:text-white">{t('languageRegion')}</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="space-y-2">
                     <Label className="dark:text-slate-300">{t('interfaceLanguage')}</Label>
                     <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as any)}
                        className="flex h-10 w-full rounded-xl bg-slate-50 dark:bg-slate-700 px-3 text-sm text-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 outline-none"
                     >
                         <option value="Français">Français</option>
                         <option value="Anglais">Anglais</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                      <Label className="dark:text-slate-300">{t('theme')}</Label>
                      <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                         <button 
                            type="button"
                            onClick={() => setTheme('light')}
                            className={cn("flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold transition-all", theme === 'light' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                         >
                             <Sun size={14} /> {t('lightMode')}
                         </button>
                         <button 
                            type="button"
                            onClick={() => setTheme('dark')}
                            className={cn("flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold transition-all", theme === 'dark' ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700")}
                         >
                             <Moon size={14} /> {t('darkMode')}
                         </button>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm dark:bg-slate-800">
               <CardHeader className="pb-4">
                  <CardTitle className="text-base dark:text-white">{t('security')}</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label className="dark:text-slate-300">{t('loginEmail')}</Label>
                     <Input defaultValue={user?.email} disabled className="bg-slate-50 dark:bg-slate-700/50 dark:border-slate-600 dark:text-slate-300 h-10 text-sm" />
                  </div>
                  <Button variant="outline" onClick={handleSavePassword} isLoading={loading} className="w-full dark:bg-slate-700 dark:text-white dark:border-slate-600 h-10 text-sm">
                     {t('sendResetEmail')}
                  </Button>
               </CardContent>
            </Card>

            <Card className="border border-red-100 shadow-none bg-red-50/30 dark:bg-red-900/10 dark:border-red-900/30 overflow-hidden">
                <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">{t('dangerZone')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-2 space-y-3">
                    <Button variant="outline" className="w-full bg-white dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 border-slate-200 text-slate-700 hover:bg-slate-50 h-10 text-sm" onClick={() => { signOut(); router.push('/') }}>
                       <LogOut className="mr-2 h-4 w-4" /> {t('logout')}
                    </Button>
                    <Button variant="destructive" className="w-full bg-white text-red-600 border border-red-200 hover:bg-red-50 shadow-none dark:bg-red-900/20 dark:border-red-900/50 dark:hover:bg-red-900/40 h-10 text-sm" onClick={handleDeleteAccount}>
                       <Trash2 className="mr-2 h-4 w-4" /> {t('deleteAccount')}
                    </Button>
                </CardContent>
            </Card>

         </div>
      </div>
    </div>
  );
}
