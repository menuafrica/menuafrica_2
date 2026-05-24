"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { CommandPalette } from '@/components/ui/commandpalette';
import { DemoBanner } from '@/components/DemoBanner';
import { cn } from '@/components/ui/uicomponents';
import { LayoutDashboard, BrainCircuit, QrCode, UtensilsCrossed, BarChart3, Palette, CreditCard, Settings, Users, Eye, LogOut, Menu, Search, Bell, Loader2 } from 'lucide-react';

const SecretSauceIcon = ({ size, className }: any) => (
    <div className={cn("flex items-center justify-center rounded-full w-8 h-8 transition-transform hover:scale-110", className)} style={{ width: size, height: size }}>
       <span className="text-xl leading-none filter grayscale-0 hover:grayscale-0">🤭</span>
    </div>
);

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { organization, role, user, loading: authLoading, signOut } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const isSuperAdmin = user?.email === 'admin@menuafrica.com';

  const navItems: { to: string; icon: any; label: string; exact?: boolean; highlight?: boolean }[] = [
    { to: '/admin', icon: LayoutDashboard, label: t('dashboard'), exact: true },
    { to: '/admin/chat-analysis', icon: BrainCircuit, label: t('bibinAI') || 'Bibin AI' },
    { to: '/admin/menus', icon: QrCode, label: t('myMenus') },
    { to: '/admin/menu', icon: UtensilsCrossed, label: t('menuBuilder') },
    { to: '/admin/mavada', icon: SecretSauceIcon, label: t('mavadaStudio') || 'Mavada Studio', highlight: true }, 
    { to: '/admin/insights', icon: BarChart3, label: t('stats') },
    { to: '/admin/qrcode', icon: QrCode, label: t('qrStudio') },
    { to: '/admin/brand', icon: Palette, label: t('brand') },
    { to: '/admin/subscriptions', icon: CreditCard, label: t('subscription') || 'Abonnement' },
    { to: '/admin/settings', icon: Settings, label: t('settings') },
  ];

  if (role === 'owner' || role === 'admin') {
      navItems.push({ to: '/admin/team', icon: Users, label: t('team') || 'Équipe' });
  }

  if (isSuperAdmin) {
      navItems.push({ to: '/admin/god-mode', icon: Eye, label: t('superAdmin') || 'Super Admin', highlight: true });
  }

  const orgName = organization?.name || 'MenuAfrica';
  const isBuilderPage = pathname.includes('/admin/mavada') && searchParams.has('menuId');

  useEffect(() => {
    if (isBuilderPage) {
      setIsDesktopSidebarOpen(false);
    } else {
      setIsDesktopSidebarOpen(true);
    }
  }, [isBuilderPage]);

  const currentNav = navItems.find(item => item.to === pathname) || navItems[0];

  return (
    <div className="flex h-screen w-full bg-[#f8f9fc] dark:bg-[#020617] font-sans text-slate-900 dark:text-white overflow-hidden selection:bg-orange-100 selection:text-orange-900">
      <CommandPalette />
      <DemoBanner />

      <aside className={cn("hidden lg:flex flex-col h-full bg-transparent shrink-0 z-50 py-4 transition-all duration-300 ease-in-out", isDesktopSidebarOpen ? "w-72 pl-4 opacity-100" : "w-0 pl-0 opacity-0 overflow-hidden pointer-events-none")}>
        <div className="flex flex-col h-full w-full bg-white/80 dark:bg-[#0f172a]/60 backdrop-blur-2xl rounded-[2.5rem] shadow-sm border border-white/50 dark:border-white/5 whitespace-nowrap">
            <div className="h-24 flex items-center px-8 shrink-0">
            <Link href="/admin" className="block w-full group">
                <img src="https://i.postimg.cc/FzpZyHRs/capture-251207-013446.png" alt="MenuAfrica" className="h-10 w-auto object-contain transition-opacity" />
            </Link>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-8">
                <div>
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 opacity-60">{orgName}</p>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                        const isActive = item.exact ? pathname === item.to : (pathname === item.to || pathname.startsWith(item.to + '/'));
                        return (
                            <Link key={item.to} href={item.to} className={cn("flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 group relative", isActive ? "bg-orange-50/80 text-[#c25e00] dark:bg-white/10 dark:text-white shadow-sm font-bold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5")}>
                            <div className={cn("transition-transform duration-300 group-hover:scale-110", isActive ? "text-[#c25e00] dark:text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600")}>
                                {item.label === 'Mavada Studio' || item.label === t('mavadaStudio') ? <item.icon size={24} /> : <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />}
                            </div>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.highlight && !isActive && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />}
                            </Link>
                        );
                        })}
                    </nav>
                </div>
            </div>
            <div className="p-4 shrink-0">
                <button onClick={async () => { await signOut(); router.push('/auth'); }} className="w-full flex items-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/10 rounded-[2rem] transition-colors justify-start group">
                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> <span>{t('logout')}</span>
                </button>
            </div>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col h-full min-w-0 min-h-0 relative">
        <header className="h-20 shrink-0 flex items-center justify-between px-4 lg:px-10 bg-transparent z-40 gap-2">
            <div className="flex items-center gap-2 lg:gap-4 min-w-0">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2.5 rounded-full bg-white dark:bg-white/10 shadow-sm text-slate-600 dark:text-white active:scale-95 transition-transform shrink-0"><Menu size={20} /></button>
                <button onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} className="hidden lg:block p-3 rounded-full bg-white dark:bg-white/10 shadow-sm text-slate-600 dark:text-white active:scale-95 transition-transform hover:bg-slate-50 dark:hover:bg-white/20 shrink-0"><Menu size={20} /></button>
                <div className="flex flex-col min-w-0">
                    <span className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wide hidden lg:block truncate">{t('dashboard')}</span>
                    <h2 className="text-lg lg:text-2xl font-serif font-bold text-[#c25e00] dark:text-orange-400 flex items-center gap-2 truncate whitespace-nowrap">{currentNav.to === '/admin/mavada' ? 'Mavada Studio 🤭' : currentNav.label}</h2>
                </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                <div className="hidden lg:flex relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-[#c25e00] transition-colors" />
                    <input type="text" placeholder={t('search')} className="h-12 pl-11 pr-6 bg-white dark:bg-slate-800/50 rounded-full text-sm border-none shadow-sm hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-[#c25e00]/10 w-64 transition-all placeholder:text-slate-400 text-black dark:text-white" readOnly onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))} />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1"><kbd className="hidden group-hover:inline-flex h-5 items-center gap-1 rounded border bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100"><span className="text-xs">⌘</span>K</kbd></div>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800/50 p-1.5 rounded-full shadow-sm border border-slate-100 dark:border-white/5">
                    <button className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-[#c25e00] transition-all relative"><Bell size={18} /><span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span></button>
                    <Link href="/admin/settings" className="w-9 h-9 rounded-full bg-[#c25e00] text-white flex items-center justify-center font-bold text-sm shadow-md cursor-pointer hover:scale-105 transition-transform ring-2 ring-white dark:ring-slate-900 overflow-hidden">
                        {user?.user_metadata?.avatar_url ? <img src={user?.user_metadata?.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : user?.email?.charAt(0).toUpperCase() || 'U'}
                    </Link>
                </div>
            </div>
        </header>
        
        {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl flex flex-col p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-12">
                    <img src="https://i.postimg.cc/FzpZyHRs/capture-251207-013446.png" alt="MenuAfrica" className="h-10 object-contain" />
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full"><LogOut size={20} className="rotate-180"/></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {navItems.map(item => (
                        <Link key={item.to} href={item.to} onClick={() => setIsMobileMenuOpen(false)} className={cn("flex items-center gap-4 p-4 rounded-3xl transition-all active:scale-95", pathname === item.to ? "bg-[#c25e00] text-white shadow-xl shadow-orange-500/20" : "bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300")}>
                            {item.label === 'Mavada Studio' || item.label === t('mavadaStudio') ? <item.icon size={28} className="text-2xl" /> : <item.icon size={24} />}
                            <span className="font-bold text-lg">{item.label}</span>
                        </Link>
                    ))}
                </div>
                <button onClick={async () => { await signOut(); router.push('/auth'); }} className="mt-6 w-full py-5 bg-red-50 text-red-600 font-bold rounded-3xl flex items-center justify-center gap-2"><LogOut size={20} /> {t('logout')}</button>
            </div>
        )}

        <main className={cn("flex-1 relative w-full flex flex-col min-h-0", isBuilderPage ? "overflow-hidden pr-0 md:pr-4 pb-4" : "overflow-y-auto overflow-x-hidden custom-scrollbar px-6 md:px-10 pb-8")}>
          {authLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
               <div className="relative"><div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div><Loader2 className="animate-spin relative z-10 text-[#c25e00]" size={40} /></div>
               <p className="font-medium text-xs tracking-[0.2em] uppercase">{t('loading')}</p>
            </div>
          ) : !organization ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
               <p className="font-medium text-lg text-slate-700">Profil incomplet ou erreur de chargement.</p>
               <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#c25e00] text-white rounded-lg">Réessayer</button>
               <button onClick={() => signOut()} className="px-4 py-2 text-red-500 underline">{t('logout') || 'Se déconnecter'}</button>
            </div>
          ) : children}
          
          {!isBuilderPage && <div className="h-24 lg:hidden" />}
        </main>

        {!isBuilderPage && (
            <div className="lg:hidden fixed bottom-6 left-4 right-4 z-40">
                <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] px-2 py-2 flex items-center justify-between shadow-2xl shadow-slate-900/10">
                    {[navItems[0], navItems[2], navItems[3], navItems[5]].map((item) => {
                        const isActive = pathname === item.to;
                        return (
                            <Link key={item.to} href={item.to} className={cn("flex-1 flex flex-col items-center justify-center py-2 rounded-[1.5rem] transition-all duration-300 active:scale-90", isActive ? "bg-[#c25e00] text-white shadow-lg shadow-orange-500/20" : "text-slate-400 hover:text-slate-600")}>
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </Link>
                        );
                    })}
                </nav>
            </div>
        )}
      </div>
    </div>
  );
};
