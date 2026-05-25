import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, QrCode, TrendingUp, HandPlatter } from 'lucide-react';
import clsx from 'clsx';

const weeklyData = [
  { name: 'Lun', vues: 4200, commandes: 2400, scanner: 1800 },
  { name: 'Mar', vues: 3000, commandes: 1398, scanner: 2100 },
  { name: 'Mer', vues: 2000, commandes: 9800, scanner: 2290 },
  { name: 'Jeu', vues: 2780, commandes: 3908, scanner: 2000 },
  { name: 'Ven', vues: 6890, commandes: 4800, scanner: 3181 },
  { name: 'Sam', vues: 8390, commandes: 6800, scanner: 4200 },
  { name: 'Dim', vues: 9490, commandes: 7300, scanner: 5300 },
];

const bestSellers = [
  { name: 'Poulet Yassa', sales: 420, price: '4500 F' },
  { name: 'Thiéboudienne', sales: 380, price: '5000 F' },
  { name: 'Salade Niçoise', sales: 290, price: '3000 F' },
  { name: 'Burger Maison', sales: 250, price: '4000 F' },
  { name: 'Tiramisu', sales: 180, price: '2500 F' },
];

export const InsightsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7j');

  return (
    <div className="space-y-6 pt-4 animate-fade-in max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-playfair font-black text-slate-800 tracking-tight">Statistiques</h2>
          <p className="text-sm text-slate-500 mt-1">Gérez et analysez les performances de vos menus.</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          {['Aujourd\'hui', '7j', '30j', 'Tout'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={clsx(
                "px-4 py-2 text-xs font-bold rounded-lg transition-colors",
                timeRange === range ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        <MetricCard 
          title="Vues de la Carte" 
          value="36,750" 
          trend="+15.2%" 
          trendUp={true} 
          icon={<Users className="w-5 h-5 text-[#D97706]" />} 
        />
        <MetricCard 
          title="Commandes Validées" 
          value="4,210" 
          trend="+8.1%" 
          trendUp={true} 
          icon={<HandPlatter className="w-5 h-5 text-emerald-600" />} 
        />
        <MetricCard 
          title="Flashes QR Code" 
          value="18,490" 
          trend="+22.4%" 
          trendUp={true} 
          icon={<QrCode className="w-5 h-5 text-blue-600" />} 
        />
        <MetricCard 
          title="Taux d'Abandon" 
          value="14.2%" 
          trend="-2.4%" 
          trendUp={true} // Lower is better
          icon={<TrendingUp className="w-5 h-5 text-rose-600" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Acquisition et Conversion</h3>
              <p className="text-xs text-slate-500 mt-1">Évolution des vues et des commandes sur les 7 derniers jours.</p>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#D97706]"></div>
                <span className="text-slate-600">Vues</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600">Commandes</span>
              </div>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCmd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="vues" stroke="#D97706" strokeWidth={3} fillOpacity={1} fill="url(#colorVues)" />
                <Area type="monotone" dataKey="commandes" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorCmd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Top des Ventes</h3>
          <div className="space-y-6">
            {bestSellers.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 font-bold font-mono text-xs flex items-center justify-center border border-slate-100">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.sales} commandes</p>
                  </div>
                </div>
                <div className="font-bold text-xs text-[#D97706]">{item.price}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 pb-12">
         {/* Secondary Chart (Bar) */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Taux de Scan QR par Heure</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
                <Tooltip 
                   cursor={{ fill: '#F1F5F9' }}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                <Bar dataKey="scanner" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, trend, trendUp, icon }: any) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          {icon}
        </div>
        <span className={clsx(
          "inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md",
          trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </span>
      </div>
      <div>
        <h4 className="text-sm font-medium text-slate-500 mb-1">{title}</h4>
        <div className="text-3xl font-black font-playfair text-slate-800 tracking-tight">{value}</div>
      </div>
    </div>
  );
};
