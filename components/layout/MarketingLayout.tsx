"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ChatWidget } from '@/components/general/ChatWidget';
import { Button, cn } from '@/components/ui/uicomponents';
import { Menu, X, ArrowRight, Heart } from 'lucide-react';

const Facebook = ({className, size}: {className?: string, size?: number}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const Instagram = ({className, size}: {className?: string, size?: number}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const Twitter = ({className, size}: {className?: string, size?: number}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;

export const MarketingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { itemCount, setIsCartOpen } = useCart(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: "Accueil", path: "/" },
    { label: "Solution", path: "/solution" },
    { label: "Tarifs", path: "/pricing" },
    { label: "À propos", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 overflow-x-hidden selection:bg-orange-100 selection:text-orange-900 bg-white dark:bg-[#020617]">
      <header className={cn(
        "fixed z-[100] transition-all duration-300",
        isScrolled 
          ? "top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg py-3 px-4 md:px-6 rounded-2xl md:rounded-full" 
          : "top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 bg-transparent py-4 px-4 md:px-6"
      )}>
        <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 z-50 group">
               <img src="https://i.postimg.cc/FzpZyHRs/capture-251207-013446.png" alt="MenuAfrica" className="h-8 md:h-10 w-auto object-contain transition-all duration-300" />
            </Link>

            <nav className={cn("hidden lg:flex items-center gap-1 backdrop-blur-md border rounded-full p-1 transition-all", !isScrolled && pathname === '/' ? "bg-white/10 border-white/10" : "bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700")}>
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link key={link.path} href={link.path} className={cn("px-5 py-2 rounded-full text-sm font-bold transition-all", isActive ? (!isScrolled && pathname === '/' ? "bg-white text-slate-900 shadow-sm" : "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm") : (!isScrolled && pathname === '/' ? "text-white/80 hover:text-white hover:bg-white/10" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50"))}>
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 lg:gap-4">
              <div className="hidden lg:flex items-center gap-4">
                <Link href="/auth?mode=signin">
                  <Button variant="ghost" className={cn("font-bold rounded-full", !isScrolled && pathname === '/' ? "text-white hover:bg-white/10" : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800")}>Connexion</Button>
                </Link>
                <Link href="/auth?mode=signup">
                  <Button className="bg-[#e67e22] hover:bg-[#d35400] text-white font-bold rounded-full px-8 shadow-lg shadow-orange-500/20">S'inscrire</Button>
                </Link>
              </div>
              <button className={cn("lg:hidden p-2 rounded-lg transition-colors", !isScrolled && pathname === '/' ? "text-white hover:bg-white/10" : "text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800")} onClick={() => setIsMobileMenuOpen(true)}><Menu size={24} /></button>
            </div>
        </div>
      </header>

      <div className={cn("fixed inset-0 z-[150] bg-white dark:bg-slate-950 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col", isMobileMenuOpen ? "translate-y-0" : "-translate-y-full")}>
          <div className="p-6 flex items-center justify-between">
             <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
               <img src="https://i.postimg.cc/FzpZyHRs/capture-251207-013446.png" alt="MenuAfrica" className="h-10 w-auto object-contain" />
             </Link>
             <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-900 dark:text-white"><X size={24} /></button>
          </div>
          <nav className="flex-1 px-6 flex flex-col justify-center gap-4">
            {navLinks.map((link, idx) => (
              <Link key={link.path} href={link.path} onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black text-slate-900 dark:text-white hover:text-[#c25e00] transition-colors tracking-tight flex items-center justify-between group" style={{ transitionDelay: `${idx * 50}ms` }}>
                {link.label}
                <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-[#c25e00]" size={32} />
              </Link>
            ))}
          </nav>
          <div className="p-8 bg-slate-50 dark:bg-slate-900 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/auth?mode=signin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full h-14 rounded-full border-2 text-slate-900 dark:text-white font-bold bg-white dark:bg-slate-800">Connexion</Button>
              </Link>
              <Link href="/auth?mode=signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full h-14 rounded-full bg-[#e67e22] text-white font-bold shadow-xl">S'inscrire</Button>
              </Link>
            </div>
          </div>
      </div>

      <main className="flex-1 w-full relative">{children}</main>

      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pt-20 pb-12 rounded-t-[3rem]">
          <div className="container mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
              <div className="lg:col-span-2 space-y-6">
                 <Link href="/" className="inline-block">
                    <img src="https://i.postimg.cc/FzpZyHRs/capture-251207-013446.png" alt="MenuAfrica" className="h-10 w-auto opacity-90" />
                 </Link>
                 <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm">La solution de menus digitaux conçue pour les restaurants africains. Moderne, élégante et sans effort.</p>
                 <div className="flex items-center gap-3">
                    <a href="#" className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-slate-400 hover:text-[#c25e00] hover:border-orange-200 transition-colors shadow-sm"><Facebook size={20}/></a>
                    <a href="#" className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-slate-400 hover:text-[#c25e00] hover:border-orange-200 transition-colors shadow-sm"><Instagram size={20}/></a>
                    <a href="#" className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-slate-400 hover:text-[#c25e00] hover:border-orange-200 transition-colors shadow-sm"><Twitter size={20}/></a>
                 </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Produit</h4>
                <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-medium">
                  <li><Link href="/solution" className="hover:text-[#c25e00] transition-colors">Fonctionnalités</Link></li>
                  <li><Link href="/pricing" className="hover:text-[#c25e00] transition-colors">Tarifs</Link></li>
                  <li><Link href="/menu/demo-resto/main" className="hover:text-[#c25e00] transition-colors">Voir une démo</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Compagnie</h4>
                <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-medium">
                  <li><Link href="/about" className="hover:text-[#c25e00] transition-colors">À propos</Link></li>
                  <li><Link href="/contact" className="hover:text-[#c25e00] transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Légal</h4>
                <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-medium">
                  <li><Link href="/terms" className="hover:text-[#c25e00] transition-colors">CGU</Link></li>
                  <li><Link href="/privacy" className="hover:text-[#c25e00] transition-colors">Confidentialité</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              <p>© {new Date().getFullYear()} MenuAfrica.</p>
              <div className="group">
                <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                   <span>Made with</span><Heart size={14} className="fill-current text-slate-300 group-hover:text-red-500 group-hover:fill-red-500 transition-colors" /><span>by Bibin</span>
                </a>
              </div>
            </div>
          </div>
      </footer>
      <div className={cn("transition-opacity duration-300", isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100")}>
        <ChatWidget />
      </div>
    </div>
  );
};
