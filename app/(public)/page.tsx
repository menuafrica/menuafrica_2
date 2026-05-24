"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent } from '@/components/ui/uicomponents';
import { useAuth } from '@/context/AuthContext';
import { 
  QrCode, Smartphone, Zap, ArrowRight, Check, Palette, 
  BarChart3, Shield, Star, AlertTriangle, TrendingUp, Users, Globe, Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItemProps {
  val: string;
  label: string;
  inView: boolean;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ val, label, inView, delay }) => {
  const numberRef = useRef<HTMLSpanElement>(null);
  const numericPart = parseFloat(val.replace(/,/g, '.').replace(/[^0-9.]/g, ''));
  const suffix = val.replace(/[0-9.,]/g, '');
  const isDecimal = val.includes('.') || val.includes(',');

  useEffect(() => {
    if (inView) {
      let startTimestamp: number | null = null;
      const duration = 2000;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 4);
        
        if (numberRef.current) {
            const currentVal = numericPart * easeOut;
            numberRef.current.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal).toString();
        }

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else if (numberRef.current) {
             numberRef.current.textContent = isDecimal ? numericPart.toString() : numericPart.toString();
        }
      };
      
      const timeoutId = setTimeout(() => {
        window.requestAnimationFrame(step);
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [inView, numericPart, delay, isDecimal]);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-3 group">
      <div 
        className={cn(
          "font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight transition-all duration-1000 transform flex items-baseline justify-center",
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <span ref={numberRef}>0</span>
        {suffix && <span className="text-2xl sm:text-4xl md:text-5xl ml-1 opacity-80">{suffix}</span>}
      </div>
      <div 
        className={cn(
          "text-orange-100/90 font-bold text-[10px] sm:text-sm md:text-base uppercase tracking-widest transition-all duration-1000 transform border-t border-white/20 pt-3 px-4",
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
        style={{ transitionDelay: `${delay + 400}ms` }}
      >
        {label}
      </div>
    </div>
  );
};

export default function Index() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const { startDemo } = useAuth();
  const router = useRouter();

  const handleStartDemo = () => {
    startDemo();
    router.push('/admin');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col w-full bg-white">
      <section className="relative min-h-[85vh] flex items-center justify-center pt-32 md:pt-48 pb-12 overflow-hidden bg-slate-900">
         <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-40 animate-scale-in" 
              style={{ animationDuration: '20s' }}
              alt="Restaurant Rentable"
            />
            <div className="absolute inset-0 bg-[#0f172a]/90"></div>
         </div>
         
         <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center justify-center h-full">
           <div className="space-y-6 md:space-y-8 animate-fade-in max-w-5xl mx-auto w-full flex flex-col items-center -mt-[13px]">
             
             <div className="inline-flex items-center gap-2 px-[14px] py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4 -mt-[70px]">
               <TrendingUp className="w-4 h-4 text-[#e67e22]" />
               <span className="text-xs font-bold tracking-widest text-[#e67e22] uppercase">Boostez votre rentabilité dès aujourd'hui</span>
             </div>

             <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold leading-[1.1] text-white tracking-tight mb-4">
               Arrêtez de perdre <br className="hidden sm:block"/>
               <span className="text-[#e67e22]">20% de votre chiffre d'affaires.</span>
             </h1>
             
             <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto font-medium px-4">
                Selon Square, un menu visuel augmente le ticket moyen de 20% à 30%. Vos clients commandent avec les yeux. MenuAfrica transforme chaque table en machine à vendre.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 w-full sm:w-auto px-4">
               <Link href="/auth?mode=signup" className="w-full sm:w-auto">
                 <Button className="w-full sm:w-auto bg-[#e67e22] hover:bg-[#d35400] text-white h-14 md:h-16 px-8 md:px-10 text-lg md:text-xl rounded-xl font-bold shadow-xl transition-transform hover:scale-105 active:scale-95">
                   Augmenter mes ventes <ArrowRight className="ml-2 h-5 w-5" />
                 </Button>
               </Link>
               <Button 
                onClick={handleStartDemo}
                variant="outline" 
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/40 h-14 md:h-16 px-8 md:px-10 text-lg md:text-xl rounded-xl font-bold backdrop-blur-sm flex items-center gap-2 group"
               >
                 <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                 Voir une démo
               </Button>
             </div>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 text-white/60 text-xs md:text-sm mt-10 font-medium">
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" /> Pas de frais d'installation
                </span>
                <span className="hidden sm:block w-px h-4 bg-white/20"></span>
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" /> Mise en place par nos experts
                </span>
             </div>

           </div>
         </div>
      </section>
      
      <section ref={statsRef} className="bg-[#e67e22] relative py-16 md:py-20 overflow-hidden z-20 shadow-2xl">
        <div 
          className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent [background-size:20px_20px] -mt-[12px]" 
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
             {[
               { val: "+25%", label: "Ticket Moyen" },
               { val: "-15min", label: "Temps par table" },
               { val: "40%", label: "Temps serveur gagné" },
               { val: "100%", label: "Rentabilité" }
             ].map((stat, idx) => (
               <StatItem 
                  key={idx} 
                  val={stat.val} 
                  label={stat.label} 
                  inView={statsVisible} 
                  delay={idx * 200} 
               />
             ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#e67e22 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
          />

          <div className="container mx-auto px-4 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-24">
                  <h2 className="text-[#e67e22] font-black tracking-[0.2em] uppercase text-sm mb-4 animate-fade-in">Le coût de l'inaction</h2>
                  <h3 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-6">Votre menu papier vous fait perdre de l'argent.</h3>
                  <p className="text-xl text-slate-500">
                      Chaque minute passée par vos serveurs à faire des allers-retours inutiles est une minute où ils ne vendent pas.
                  </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-stretch group/container">
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-500 transform md:group-hover/container:scale-95 md:group-hover/container:opacity-50 hover:!opacity-100 hover:!scale-100 hover:shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-slate-200"></div>
                      <div className="flex items-center gap-4 mb-8">
                          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                              <AlertTriangle size={28} />
                          </div>
                          <h4 className="text-2xl font-bold text-slate-400">
                              <span className="line-through decoration-red-300 decoration-4">Le modèle qui stagne</span>
                          </h4>
                      </div>
                      
                      <ul className="space-y-6">
                          {[
                              "40% du temps des serveurs gâché à vide",
                              "Ticket moyen faible (pas de photos)",
                              "Le client attend 10 min pour commander",
                              "Le serveur oublie de proposer le dessert",
                              "Impossibilité de changer les prix vite"
                          ].map((item, i) => (
                              <li key={i} className="flex items-start gap-4 text-slate-500 text-lg">
                                  <div className="w-6 h-6 rounded-full bg-red-50 text-red-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</div>
                                  {item}
                              </li>
                          ))}
                      </ul>
                  </div>

                  <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border-4 border-slate-800 relative overflow-hidden transform transition-all duration-500 md:scale-105 md:hover:scale-110 z-10">
                      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#e67e22] rounded-full blur-[80px] opacity-20 animate-pulse"></div>
                      
                      <div className="absolute top-0 right-0 bg-[#e67e22] text-white text-xs font-bold px-6 py-2 rounded-bl-2xl shadow-lg uppercase tracking-widest">
                          Rentabilité Maximale
                      </div>

                      <div className="flex items-center gap-4 mb-8 relative z-10">
                          <div className="w-14 h-14 rounded-2xl bg-[#e67e22] text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                              <TrendingUp size={28} />
                          </div>
                          <h4 className="text-3xl font-bold text-white">
                              L'effet MenuAfrica
                          </h4>
                      </div>

                      <ul className="space-y-6 relative z-10">
                          {[
                              "Ticket moyen +20% à 30% (Vente visuelle)",
                              "Gain de 15 minutes par table",
                              "L'employé qui n'oublie jamais l'upsell",
                              "Rotation des tables accélérée",
                              "Intelligence : sachez ce qui se vend le mieux",
                              "Traduction : captez 100% du budget touristes",
                              "Zéro coût d'impression à vie"
                          ].map((item, i) => (
                              <li key={i} className="flex items-start gap-4 text-slate-100 font-medium text-lg">
                                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-green-500/50"><Check size={14} strokeWidth={4}/></div>
                                  {item}
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
           <div className="max-w-3xl mx-auto text-center mb-20">
             <h2 className="text-[#e67e22] font-black tracking-[0.2em] uppercase text-xs mb-4">Vendez plus, travaillez moins</h2>
             <h3 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-gray-900">Une machine à cash pour votre salle.</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-2 md:row-span-2 group overflow-hidden border-none shadow-xl bg-slate-900 text-white hover:shadow-2xl transition-all duration-500 rounded-[2.5rem]">
                <CardContent className="p-10 md:p-14 h-full flex flex-col justify-between relative">
                  <div className="relative z-10 space-y-8">
                    <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500 text-orange-400">
                      <TrendingUp size={40} />
                    </div>
                    <div>
                        <h4 className="font-serif text-3xl md:text-4xl font-bold mb-4">Upselling Automatique</h4>
                        <p className="text-slate-300 text-xl leading-relaxed max-w-lg">Le menu digital n'oublie jamais de proposer le supplément ou le dessert. Les clients commandent avec les yeux : les photos HD augmentent le ticket moyen de 20% à 30%.</p>
                    </div>
                    <div className="pt-4">
                        <Link href="/auth?mode=signup" className="text-orange-400 font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform cursor-pointer uppercase tracking-wider text-sm">
                            Augmenter mes marges <ArrowRight size={16}/>
                        </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {[
                  { icon: Zap, title: "Rotation Rapide", desc: "Économisez 15 min par table.", color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: Globe, title: "Traduction Auto", desc: "Captez le budget des touristes.", color: "text-indigo-600", bg: "bg-indigo-50" },
                  { icon: BarChart3, title: "Intelligence Ventes", desc: "Sachez ce qui se vend le mieux.", color: "text-green-600", bg: "bg-green-50" },
                  { icon: Users, title: "Staff Optimisé", desc: "40% de temps gagné en salle.", color: "text-amber-600", bg: "bg-amber-50" }
              ].map((feat, i) => (
                  <Card key={i} className="group border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-[2rem] overflow-hidden">
                    <CardContent className="p-8 h-full flex flex-col items-center text-center justify-center space-y-4">
                      <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 mb-2", feat.bg, feat.color)}>
                        <feat.icon size={32} />
                      </div>
                      <h4 className="font-bold text-xl text-gray-900">{feat.title}</h4>
                      <p className="text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
                    </CardContent>
                  </Card>
              ))}
           </div>
        </div>
      </section>

      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-4 text-center">
           <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8 text-gray-900">
             Chaque service sans MenuAfrica <br/> est un manque à gagner.
           </h2>
           <p className="text-xl text-gray-500 mb-12 max-w-xl mx-auto">
             Rejoignez les restaurateurs qui ont choisi la croissance. Installation clé en main par nos experts.
           </p>
           <div className="flex justify-center">
             <Link href="/auth?mode=signup">
               <Button size="lg" className="bg-[#e67e22] hover:bg-[#d35400] px-12 h-20 text-2xl rounded-2xl shadow-2xl shadow-orange-500/30 transition-transform hover:scale-105 flex items-center gap-3">
                 Commencer à gagner plus <ArrowRight size={28} />
               </Button>
             </Link>
           </div>
           <div className="mt-12 flex flex-col sm:flex-row justify-center gap-8 text-gray-400 text-sm font-bold uppercase tracking-widest">
                <span className="flex items-center justify-center gap-2"><TrendingUp size={16} className="text-orange-400" /> Rentabilité immédiate</span>
                <span className="flex items-center justify-center gap-2"><Shield size={16} className="text-green-500" /> Zéro maintenance</span>
           </div>
        </div>
      </section>
    </div>
  );
}
