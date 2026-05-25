import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dbInstance } from '../../lib/virtual_db';
import { ArrowUpRight, Users, Eye, Heart, ListVideo, QrCode, PenTool } from 'lucide-react';
import clsx from 'clsx';

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const currentResto = profile?.restaurant || { name: 'KU NZO', subdomain: 'la-teranga' };

  // Calculate some analytics
  const totalViews = dbInstance.items.reduce((acc, curr) => acc + curr.views, 0);
  const totalLikes = dbInstance.items.reduce((acc, curr) => acc + curr.likes, 0);
  const totalItemsCount = dbInstance.items.length;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-10 shadow-lg">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-playfair font-black tracking-tight">
              Bonjour, {currentResto.name} <span className="inline-block animate-waving-hand">👋</span>
            </h2>
            <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
              Votre restaurant est en ligne et prêt à recevoir des commandes. Voici un résumé de votre activité sur les 30 derniers jours.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => window.open(`#/menu/${currentResto.subdomain}`, '_blank')}
              className="h-12 px-6 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Voir le Menu public
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-[#D97706]/20 blur-3xl"></div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Vues Uniques" 
          value="2,840" 
          trend="+12%" 
          trendUp={true} 
          icon={<Users className="w-5 h-5 text-blue-500" />} 
          bg="bg-blue-50"
        />
        <MetricCard 
          title="Pages Vues" 
          value={totalViews.toLocaleString()} 
          trend="+8%" 
          trendUp={true} 
          icon={<Eye className="w-5 h-5 text-[#D97706]" />} 
          bg="bg-orange-50"
        />
        <MetricCard 
          title="Coups de Cœur" 
          value={totalLikes.toLocaleString()} 
          trend="+24%" 
          trendUp={true} 
          icon={<Heart className="w-5 h-5 text-rose-500" />} 
          bg="bg-rose-50"
        />
        <MetricCard 
          title="Plats Actifs" 
          value={totalItemsCount.toString()} 
          trend="À jour" 
          trendUp={true} 
          icon={<ListVideo className="w-5 h-5 text-emerald-500" />} 
          bg="bg-emerald-50"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Popular Items Chart/List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Plats les plus populaires</h3>
            <button className="text-sm font-semibold text-[#D97706] hover:text-[#B46002]">Voir tout</button>
          </div>
          
          <div className="space-y-6">
            {dbInstance.items.slice(0, 4).map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <span className="text-slate-300 font-bold font-mono text-lg w-4">{idx + 1}</span>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    <img src={item.image_url} alt={item.name_fr} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#D97706] transition-colors">{item.name_fr}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.price.toLocaleString()} XOF</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div className="hidden sm:block">
                    <span className="text-xs text-slate-400 block mb-0.5">Vues</span>
                    <span className="font-mono font-bold text-slate-700">{item.views}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block mb-0.5">Likes</span>
                    <span className="font-mono font-bold text-rose-500">{item.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-800">Actions Rapides</h3>
            <div className="grid gap-3">
              <button 
                onClick={() => navigate('/admin/menu')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left border border-slate-100 hover:border-slate-300"
               >
                <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#D97706] flex items-center justify-center shrink-0">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-700">Editer le menu</div>
                  <div className="text-xs text-slate-500">Ajouter ou modifier des plats</div>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/admin/qrcode')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left border border-slate-100 hover:border-slate-300"
               >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-700">QR Studio Pro</div>
                  <div className="text-xs text-slate-500">Générer vos points d'accès</div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#FFF8F3] to-white rounded-3xl border border-[#D97706]/10 shadow-sm p-6 border-l-4 border-l-[#D97706]">
             <h3 className="font-bold text-slate-800 text-sm mb-3">💡 Astuce Ku Nzo</h3>
             <p className="text-sm text-slate-600 leading-relaxed mb-4">
               Les plats avec des photos de haute qualité génèrent en moyenne <strong className="text-[#D97706]">3x plus de commandes</strong>. N'oubliez pas d'utiliser le Studio de Médias !
             </p>
             <button 
               onClick={() => navigate('/admin/media')}
               className="text-sm font-semibold text-[#D97706] flex items-center gap-1 hover:gap-2 transition-all"
              >
               Aller au studio <ArrowUpRight className="w-4 h-4" />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const MetricCard = ({ title, value, trend, trendUp, icon, bg }: any) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:-translate-y-1 transition-transform duration-300 cursor-default">
    <div className="flex justify-between items-start mb-4">
      <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", bg)}>
        {icon}
      </div>
      <span className={clsx(
        "px-2 py-1 rounded-md text-[10px] font-bold font-mono inline-flex items-center gap-1",
        trendUp ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
      )}>
        {trendUp && <ArrowUpRight className="w-3 h-3" />}
        {trend}
      </span>
    </div>
    <div>
      <h4 className="text-slate-500 font-medium text-sm mb-1">{title}</h4>
      <div className="text-3xl font-black text-slate-800 font-mono tracking-tight">{value}</div>
    </div>
  </div>
);
