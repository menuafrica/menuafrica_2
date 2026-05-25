"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, Server, ShieldAlert, Activity, DollarSign, 
  MessageCircle, QrCode, Building, CreditCard,
  RefreshCw, Terminal, Cpu, Zap, Calendar, Filter, Database
} from 'lucide-react';
import { generateFilteredData, type PlatformStats } from '@/lib/mockPlatformData';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/uicomponents';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatPrice } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

const StatusBadge = ({ status, latency }: { status: string, latency: number }) => {
    const color = status === 'operational' ? 'bg-green-500' : status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${color} animate-pulse`} />
            <span className="text-xs font-mono text-slate-400">{latency}ms</span>
        </div>
    );
};

const StatCard = ({ label, value, sub, icon: Icon, color }: any) => (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-600 transition-colors group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-slate-800 ${color} bg-opacity-20`}>
                <Icon size={24} className={color} />
            </div>
            {sub && <span className="text-xs font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded">{sub}</span>}
        </div>
        <div>
            <h3 className="text-3xl font-black text-white group-hover:scale-105 transition-transform origin-left">{value}</h3>
            <p className="text-sm font-medium text-slate-400 mt-1">{label}</p>
        </div>
    </div>
);

export default function PlatformDashboard() {
  const [data, setData] = useState<PlatformStats | null>(null);
  
  const [period, setPeriod] = useState('month');
  const [plan, setPlan] = useState('all');
  const [restaurantId, setRestaurantId] = useState('all');
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
      const mock = generateFilteredData(period, plan, restaurantId);
      setData(mock);
      setAiAnalysis(null); 
  }, [period, plan, restaurantId]);

  const runAiDiagnostic = async () => {
      if (!data) return;
      setAnalyzing(true);
      setAiAnalysis(null);
      
      try {
          const contextPrompt = `
            CONTEXTE DE FILTRAGE :
            - Période : ${period}
            - Plan Tarifaire : ${plan}
            - Restaurant Cible : ${restaurantId}
            
            DONNÉES SYSTÈME ET MÉTRIQUES :
            ${JSON.stringify({ 
                revenue: data.overview.total_revenue,
                active_users: data.overview.active_restaurants,
                bot_load: data.overview.total_bot_conversations,
                critical_logs: data.system_logs 
            })}
            
            TA MISSION :
            1. Analyse la santé du système pour ce segment spécifique.
            2. Explique si les revenus/scans sont cohérents pour la période choisie.
            3. Analyse les logs techniques (Odoo, Stripe, etc.) et donne une cause racine probable.
          `;

          const { data: responseData, error } = await supabase.functions.invoke('generate-menu-ai', {
              body: { 
                  prompt: contextPrompt,
                  mode: 'analysis'
              }
          });

          if (error) throw error;

          if (responseData?.text) {
              setAiAnalysis(responseData.text);
          }
      } catch (e: any) {
          console.error("AI Error", e);
          toast.error("Erreur de connexion à Lova Sentinel: " + e.message);
      } finally {
          setAnalyzing(false);
      }
  };

  if (!data) return <div className="p-10 text-white">Chargement du Core...</div>;

  return (
    <div className="w-full p-8 space-y-8 animate-fade-in text-white min-h-screen">
      
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 border-b border-slate-800 pb-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert size={12} /> God Mode
              </span>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Activity size={12} /> Live Stream
              </span>
           </div>
           <h1 className="text-4xl font-serif font-bold">Plateforme Master View</h1>
           <p className="text-slate-400 mt-1">Supervision globale avec filtrage multidimensionnel.</p>
        </div>

        <div className="flex flex-wrap gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-xl">
            
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-xl border border-slate-700">
                <Calendar size={16} className="text-blue-400" />
                <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Période</span>
                    <select 
                        value={period} 
                        onChange={(e) => setPeriod(e.target.value)} 
                        className="bg-transparent text-sm font-bold outline-none text-white w-28"
                    >
                        <option value="day">Jour (24h)</option>
                        <option value="week">Semaine</option>
                        <option value="month">Mois</option>
                        <option value="quarter">Trimestre (Q1-Q4)</option>
                        <option value="semester">Semestre</option>
                        <option value="year">Année</option>
                        <option value="multi-year">3 Dernières Années</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-xl border border-slate-700">
                <Building size={16} className="text-orange-400" />
                <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Client</span>
                    <select 
                        value={restaurantId} 
                        onChange={(e) => setRestaurantId(e.target.value)} 
                        className="bg-transparent text-sm font-bold outline-none text-white w-32"
                    >
                        <option value="all">Tous (Global)</option>
                        <option value="resto-1">Le Teranga</option>
                        <option value="resto-2">Chez Tonton</option>
                        <option value="resto-3">La Villa</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-xl border border-slate-700">
                <CreditCard size={16} className="text-green-400" />
                <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Offre</span>
                    <select 
                        value={plan} 
                        onChange={(e) => setPlan(e.target.value)} 
                        className="bg-transparent text-sm font-bold outline-none text-white w-28"
                    >
                        <option value="all">Toutes Offres</option>
                        <option value="starter">Starter (Gratuit)</option>
                        <option value="pro">Pro (Payant)</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                </div>
            </div>

            <button onClick={() => toast.success("Filtres appliqués")} className="p-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors text-white">
                <Filter size={18} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            label="Revenu (Période)" 
            value={formatPrice(data.overview.total_revenue)} 
            sub={period.toUpperCase()} 
            icon={DollarSign} 
            color="text-green-400" 
        />
        <StatCard 
            label="Restaurants Actifs" 
            value={data.overview.active_restaurants} 
            sub={plan === 'all' ? 'Total' : plan.toUpperCase()} 
            icon={Users} 
            color="text-blue-400" 
        />
        <StatCard 
            label="Volume Scans QR" 
            value={data.overview.total_qr_scans.toLocaleString()} 
            sub="Usage Client" 
            icon={QrCode} 
            color="text-orange-400" 
        />
        <StatCard 
            label="Conversations Bot" 
            value={data.overview.total_bot_conversations.toLocaleString()} 
            sub="IA Load" 
            icon={MessageCircle} 
            color="text-purple-400" 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
             
             <div className="bg-slate-800 rounded-[2rem] p-8 border border-slate-700 shadow-xl">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-xl flex items-center gap-2">
                         <Activity className="text-blue-500" /> Trafic Réseau
                     </h3>
                     <div className="flex gap-4 text-sm font-bold">
                         <span className="flex items-center gap-2 text-slate-400"><div className="w-3 h-3 bg-[#c25e00] rounded-full"/> Scans</span>
                         <span className="flex items-center gap-2 text-slate-400"><div className="w-3 h-3 bg-purple-500 rounded-full"/> Bots</span>
                     </div>
                 </div>
                 <div className="h-[300px] w-full">
                    <Line
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    backgroundColor: '#1e293b',
                                    titleColor: '#fff',
                                    bodyColor: '#fff',
                                    borderColor: '#334155',
                                    borderWidth: 1,
                                    padding: 12,
                                    mode: 'index',
                                    intersect: false,
                                }
                            },
                            scales: {
                                x: {
                                    grid: { display: false },
                                    ticks: { color: '#64748b' },
                                    border: { display: false }
                                },
                                y: {
                                    grid: { color: '#334155' },
                                    border: { dash: [3, 3], display: false },
                                    ticks: { color: '#64748b' }
                                }
                            },
                            elements: {
                                line: { tension: 0.4 },
                                point: { radius: 0, hitRadius: 10, hoverRadius: 4 }
                            }
                        }}
                        data={{
                            labels: data.traffic_data.map(d => d.time),
                            datasets: [
                                {
                                    label: 'Scans',
                                    fill: true,
                                    data: data.traffic_data.map(d => d.scans),
                                    borderColor: '#c25e00',
                                    borderWidth: 3,
                                    backgroundColor: (context) => {
                                        const chart = context.chart;
                                        const { ctx, chartArea } = chart;
                                        if (!chartArea) return 'rgba(194, 94, 0, 0.3)';
                                        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                        gradient.addColorStop(0, 'rgba(194, 94, 0, 0.3)');
                                        gradient.addColorStop(1, 'rgba(194, 94, 0, 0)');
                                        return gradient;
                                    },
                                },
                                {
                                    label: 'Bots',
                                    fill: true,
                                    data: data.traffic_data.map(d => d.bots),
                                    borderColor: '#8b5cf6',
                                    borderWidth: 3,
                                    backgroundColor: (context) => {
                                        const chart = context.chart;
                                        const { ctx, chartArea } = chart;
                                        if (!chartArea) return 'rgba(139, 92, 246, 0.3)';
                                        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
                                        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
                                        return gradient;
                                    },
                                }
                            ]
                        }}
                    />
                 </div>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                 {data.integrations.map((integ, i) => (
                     <div key={i} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-900 rounded-lg">
                                {integ.name.includes('Odoo') ? <Database size={18} className="text-purple-400"/> : 
                                 integ.name.includes('Stripe') ? <DollarSign size={18} className="text-blue-400"/> :
                                 integ.name.includes('Whats') ? <MessageCircle size={18} className="text-green-400"/> :
                                 <Server size={18} className="text-slate-400"/>}
                             </div>
                             <div>
                                 <h4 className="font-bold text-sm">{integ.name}</h4>
                                 <p className="text-[10px] text-slate-500 uppercase tracking-wider">Uptime: {integ.uptime}</p>
                             </div>
                         </div>
                         <div className="text-right">
                             <StatusBadge status={integ.status} latency={integ.latency} />
                             {integ.error && <span className="text-[10px] text-red-400 block mt-1">{integ.error}</span>}
                         </div>
                     </div>
                 ))}
             </div>
         </div>

         <div className="bg-slate-900 rounded-[2rem] border border-slate-800 p-1 shadow-2xl flex flex-col h-full relative overflow-hidden">
            <div className="bg-black/40 p-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-green-400">
                    <Terminal size={16} />
                    <span className="font-mono text-sm font-bold">LOVA_SENTINEL_V2</span>
                </div>
                <button 
                    onClick={runAiDiagnostic}
                    disabled={analyzing}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                >
                    {analyzing ? <RefreshCw className="animate-spin" size={12}/> : <Cpu size={12}/>}
                    {analyzing ? "Analyse en cours..." : "Diagnostiquer"}
                </button>
            </div>

            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-3 custom-scrollbar bg-slate-950/50">
                {data.system_logs.map((log) => (
                    <div key={log.id} className="flex gap-3 border-l-2 border-slate-700 pl-3 py-1 hover:bg-white/5 transition-colors">
                        <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                        <div className="flex-1">
                            <span className={log.level === 'error' ? 'text-red-400 font-bold' : 'text-yellow-400'}>[{log.level.toUpperCase()}]</span>
                            <span className="text-slate-300 ml-2">{log.message}</span>
                        </div>
                    </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-slate-800 text-slate-500 italic text-[10px]">
                    Filtre actif : {period} • {plan} • {restaurantId}
                </div>
            </div>

            {aiAnalysis && (
                <div className="border-t border-indigo-500/30 bg-indigo-900/10 p-5 backdrop-blur-sm animate-scale-in">
                    <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Zap size={14} fill="currentColor" /> Rapport Intelligence Lova
                    </h4>
                    <div className="prose prose-invert prose-sm text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                        {aiAnalysis}
                    </div>
                </div>
            )}
            
            {!aiAnalysis && !analyzing && (
                <div className="p-4 text-center text-slate-600 text-xs italic">
                    Système prêt. Lancez un diagnostic pour analyser les données filtrées.
                </div>
            )}
         </div>

      </div>
    </div>
  );
}
