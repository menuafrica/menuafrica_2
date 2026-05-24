"use client";
import React, { useState, useMemo } from 'react';
import { Button, Card, toast } from '@/components/ui/uicomponents';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  ArcElement
);
import { 
  Eye, Users, TrendingUp, Clock, Search, ArrowUpDown, MoreHorizontal,
  ThumbsUp, Download, Edit, Trash
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockMenuItems, mockCategories, mockMenus } from '@/lib/mockData';
import { useLanguage } from '@/context/LanguageContext';

const DATA_SETS = {
    '24h': [
        { name: '00h', views: 12, likes: 0 }, { name: '04h', views: 5, likes: 0 },
        { name: '08h', views: 45, likes: 2 }, { name: '12h', views: 320, likes: 45 },
        { name: '16h', views: 150, likes: 10 }, { name: '20h', views: 480, likes: 80 },
    ],
    '7j': [
        { name: 'Lun', views: 450, likes: 20 }, { name: 'Mar', views: 520, likes: 25 },
        { name: 'Mer', views: 680, likes: 40 }, { name: 'Jeu', views: 590, likes: 35 },
        { name: 'Ven', views: 1200, likes: 80 }, { name: 'Sam', views: 1450, likes: 95 },
        { name: 'Dim', views: 1100, likes: 70 },
    ],
    '30j': [
        { name: 'Sem 1', views: 2500, likes: 180 }, { name: 'Sem 2', views: 3100, likes: 240 },
        { name: 'Sem 3', views: 2800, likes: 210 }, { name: 'Sem 4', views: 3500, likes: 300 },
    ]
};

const DishTable = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [performanceFilter, setPerformanceFilter] = useState('all');
    const [momentFilter, setMomentFilter] = useState('all');
    const [activeActionId, setActiveActionId] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'views', direction: 'desc' });

    const processedDishes = useMemo(() => {
        let items = [...mockMenuItems].map(item => ({
            ...item,
            views: item.views || Math.floor(Math.random() * 1000),
            likes: item.likes || Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 10),
            menuName: mockMenus.find(m => mockCategories.find(c => c.id === item.category_id)?.menu_id === m.id)?.name || 'Inconnu',
            categoryName: mockCategories.find(c => c.id === item.category_id)?.name_fr || 'Inconnu'
        }));

        if (performanceFilter === 'top') {
            items = items.sort((a, b) => b.views - a.views).slice(0, 5);
        } else if (performanceFilter === 'flop') {
            items = items.sort((a, b) => a.views - b.views).slice(0, 5);
        }

        if (momentFilter === 'lunch') {
            items = items.filter(i => i.price < 5000);
        } else if (momentFilter === 'dinner') {
            items = items.filter(i => i.price >= 5000);
        }

        if (searchTerm) items = items.filter(i => i.name_fr.toLowerCase().includes(searchTerm.toLowerCase()));

        items.sort((a: any, b: any) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return items;
    }, [searchTerm, performanceFilter, momentFilter, sortConfig]);

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[600px] animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input 
                            type="text" 
                            placeholder={t('search')} 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#c25e00]/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-[#c25e00] block p-2.5 outline-none font-bold" value={performanceFilter} onChange={(e) => setPerformanceFilter(e.target.value)}>
                        <option value="all">{t('filterPerformance')}</option>
                        <option value="top">🔥 {t('topSales')}</option>
                        <option value="flop">📉 {t('lowRotation')}</option>
                    </select>
                    <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-[#c25e00] block p-2.5 outline-none font-bold" value={momentFilter} onChange={(e) => setMomentFilter(e.target.value)}>
                        <option value="all">{t('filterMoment')}</option>
                        <option value="lunch">☀️ {t('lunch')}</option>
                        <option value="dinner">🌙 {t('dinner')}</option>
                    </select>
                </div>
            </div>
            
            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-700/50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 font-bold">{t('thDish')}</th>
                            <th className="px-6 py-3 font-bold cursor-pointer" onClick={() => handleSort('categoryName')}>{t('thCategory')} <ArrowUpDown size={12} className="inline ml-1"/></th>
                            <th className="px-6 py-3 font-bold cursor-pointer text-center" onClick={() => handleSort('views')}><Eye size={14} className="inline mr-1"/> {t('thViews')}</th>
                            <th className="px-6 py-3 font-bold cursor-pointer text-center" onClick={() => handleSort('likes')}><ThumbsUp size={14} className="inline mr-1"/> {t('thLikes')}</th>
                            <th className="px-6 py-3 font-bold text-right">{t('thActions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {processedDishes.map((item) => (
                            <tr key={item.id} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                        {item.image_url ? <img src={item.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-xs">IMG</div>}
                                    </div>
                                    <div><div className="font-bold text-slate-900 dark:text-white">{item.name_fr}</div><div className="text-xs text-slate-400">{item.menuName}</div></div>
                                </td>
                                <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full border border-slate-200">{item.categoryName}</span></td>
                                <td className="px-6 py-4 text-center font-mono font-medium">{item.views}</td>
                                <td className="px-6 py-4 text-center font-mono font-medium text-rose-500">{item.likes}</td>
                                <td className="px-6 py-4 text-right relative">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setActiveActionId(activeActionId === item.id ? null : item.id); }}
                                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>
                                    
                                    {activeActionId === item.id && (
                                        <div className="absolute right-8 top-8 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-scale-in origin-top-right">
                                            <button className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2" onClick={() => toast.success("Détails ouverts")}>
                                                <Eye size={14}/> {t('view')}
                                            </button>
                                            <button className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-blue-600" onClick={() => toast.success("Mode Édition")}>
                                                <Edit size={14}/> {t('edit')}
                                            </button>
                                            <div className="h-px bg-gray-100"/>
                                            <button className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-red-50 text-red-600 flex items-center gap-2" onClick={() => toast.success("Supprimé")}>
                                                <Trash size={14}/> {t('delete')}
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {processedDishes.length === 0 && <div className="p-8 text-center text-slate-400 italic">Aucun plat ne correspond à vos critères.</div>}
            </div>
        </div>
    );
};

const KpiCard = ({ title, value, trend, trendValue, icon: Icon, delay, color }: any) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between h-full animate-fade-in-up hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${delay}ms` }}>
        <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-2xl transition-transform hover:scale-110 duration-300", color)}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600">
                    <TrendingUp size={14} />
                    {trendValue}
                </div>
            )}
        </div>
        <div>
            <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-1">{value}</h3>
            <p className="text-sm font-medium text-slate-400">{title}</p>
        </div>
    </div>
);

export default function InsightsPage() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<'24h' | '7j' | '30j'>('7j');
  const [isExporting, setIsExporting] = useState(false);

  const currentData = DATA_SETS[timeRange];

  const handleExport = async () => {
      setIsExporting(true);
      await new Promise(r => setTimeout(r, 1500));
      toast.success(`${t('saved')} (PDF)`);
      setIsExporting(false);
  };

  return (
    <div className="w-full space-y-8 pb-20 px-6 pt-4 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-2">
             {t('statsTitle')}
          </h1>
          <p className="text-slate-500 text-lg">{t('statsDesc')}</p>
        </div>
        
        <div className="flex gap-4">
            <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                {(['24h', '7j', '30j'] as const).map(range => (
                    <button 
                        key={range}
                        onClick={() => setTimeRange(range)} 
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95", 
                            timeRange === range 
                                ? "bg-[#c25e00] text-white shadow-md" 
                                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900"
                        )}
                    >
                        {range}
                    </button>
                ))}
            </div>

            <Button 
                onClick={handleExport}
                isLoading={isExporting}
                className="h-auto rounded-2xl bg-[#c25e00] hover:bg-[#a04e00] text-white font-bold px-6 shadow-lg shadow-orange-500/20 border-none"
            >
                <Download size={18} className="mr-2" /> {t('export')}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title={t('totalViews')} value="24.5k" trend="up" trendValue="+5.4%" icon={Eye} color="bg-blue-50 text-blue-600" delay={0} />
          <KpiCard title="Clients Uniques" value="850" trend="up" trendValue="+18%" icon={Users} color="bg-purple-50 text-purple-600" delay={100} />
          <KpiCard title={t('thLikes')} value="1,204" trend="up" trendValue="+12%" icon={ThumbsUp} color="bg-rose-50 text-rose-600" delay={200} />
          <KpiCard title="Temps Moyen" value="2m 45s" trend="up" trendValue="+30s" icon={Clock} color="bg-amber-50 text-amber-600" delay={300} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm h-[400px] flex flex-col animate-scale-in">
             <div className="flex justify-between items-center mb-6 shrink-0">
                 <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                     <TrendingUp size={20} className="text-[#c25e00]" /> 
                     {t('engagement')}
                 </h3>
                 <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">{timeRange}</span>
             </div>
             <div className="flex-1 w-full min-h-0 relative">
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
                                borderColor: 'transparent',
                                borderWidth: 0,
                                padding: 12,
                                displayColors: false,
                                callbacks: {
                                    label: (context) => `${context.parsed.y} vues`
                                }
                            }
                        },
                        scales: {
                            x: {
                                grid: { display: false },
                                ticks: { color: '#94a3b8', font: { size: 12 } },
                                border: { display: false }
                            },
                            y: {
                                grid: { color: '#e2e8f0' },
                                border: { dash: [3, 3], display: false },
                                ticks: { color: '#94a3b8', font: { size: 12 } }
                            }
                        },
                        elements: {
                            line: { tension: 0.4 },
                            point: { radius: 0, hitRadius: 10, hoverRadius: 4 }
                        }
                    }}
                    data={{
                        labels: currentData.map(d => d.name),
                        datasets: [
                            {
                                fill: true,
                                data: currentData.map(d => d.views),
                                borderColor: '#c25e00',
                                borderWidth: 3,
                                backgroundColor: (context) => {
                                    const chart = context.chart;
                                    const { ctx, chartArea } = chart;
                                    if (!chartArea) return 'rgba(194, 94, 0, 0.2)';
                                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                    gradient.addColorStop(0, 'rgba(194, 94, 0, 0.2)');
                                    gradient.addColorStop(1, 'rgba(194, 94, 0, 0)');
                                    return gradient;
                                },
                            }
                        ]
                    }}
                />
             </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm h-[400px] flex flex-col justify-center text-center animate-scale-in" style={{ animationDelay: '100ms' }}>
              <h3 className="font-bold text-lg mb-4">{t('distribution')}</h3>
              <div className="flex-1 relative">
                  <Doughnut
                      options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          cutout: '75%',
                          plugins: {
                              legend: { display: false },
                              tooltip: { enabled: false }
                          }
                      }}
                      data={{
                          labels: ['Plats', 'Boissons', 'Desserts'],
                          datasets: [{
                              data: [65, 20, 15],
                              backgroundColor: ['#c25e00', '#3b82f6', '#10b981'],
                              borderWidth: 0,
                              hoverOffset: 4
                          }]
                      }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                      <span className="font-black text-3xl text-slate-900 dark:text-white">65%</span>
                      <span className="text-xs uppercase text-slate-400 font-bold">Plats</span>
                  </div>
              </div>
          </div>
      </div>

      <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">{t('detailByDish')}</h2>
          <DishTable />
      </div>

    </div>
  );
}
