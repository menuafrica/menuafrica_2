import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { toast } from '../../components/ui/UiComponents';
import { FolderPlus, Upload, Search, CheckCircle2, PlayCircle, MoreVertical } from 'lucide-react';
import clsx from 'clsx';

export const MediaManagerPage: React.FC = () => {
  const { images, addImage } = useLibrary();
  const [activeTab, setActiveTab] = useState('all');

  const mediaList = [
    { id: 1, type: 'image', title: 'poulet-yassa-hd.jpg', size: '1.2 MB', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', selected: true },
    { id: 2, type: 'video', title: 'video-ambiance.mp4', size: '14 MB', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80', selected: false },
    { id: 3, type: 'image', title: 'salade-fraiche.jpg', size: '800 KB', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', selected: false },
    { id: 4, type: 'image', title: 'nems-starter.jpg', size: '950 KB', url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80', selected: false },
  ];

  return (
    <div className="space-y-6 pt-4 animate-fade-in max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl font-playfair font-black text-slate-800 tracking-tight">Gestionnaire de Médias</h2>
          <p className="text-sm text-slate-500 mt-1">Organisez vos photos HD et vidéos pour sublimer vos plats.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-11 px-6 border-2 border-[#D97706] text-[#D97706] bg-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#D97706]/5 transition-colors">
            <FolderPlus className="w-4 h-4" />
            Nouveau dossier
          </button>
          <button className="h-11 px-6 bg-[#D97706] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#B46002] transition-colors shadow-sm">
            <Upload className="w-4 h-4" />
            Importer
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 mt-6">
        
        {/* Categories Sidebar/Tabs */}
        <div className="w-full sm:w-64 shrink-0 flex flex-col gap-1">
           <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} count={124}>Toutes</TabButton>
           <TabButton active={activeTab === 'plats'} onClick={() => setActiveTab('plats')} count={45}>Plats Principaux</TabButton>
           <TabButton active={activeTab === 'desserts'} onClick={() => setActiveTab('desserts')} count={12}>Desserts</TabButton>
           <div className="my-2 border-t border-slate-100"></div>
           <TabButton active={activeTab === 'videos'} onClick={() => setActiveTab('videos')} count={8}>Vidéos (TikTok)</TabButton>
        </div>

        {/* Media Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-slate-700">Récents</div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher un fichier..." 
                className="pl-9 pr-4 h-10 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#D97706] w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {/* Upload Drop Zone placeholder */}
             <div className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer text-slate-400 hover:text-slate-600">
               <Upload className="w-8 h-8" />
               <span className="text-xs font-bold uppercase tracking-wider">GLISSER & DÉPOSER</span>
             </div>

             {/* Media Cards */}
             {mediaList.map((media) => (
                <div 
                  key={media.id} 
                  className={clsx(
                    "group aspect-square rounded-2xl relative overflow-hidden bg-slate-100 border-2 transition-all cursor-pointer",
                    media.selected ? "border-[#D97706] ring-4 ring-[#D97706]/20" : "border-transparent hover:border-slate-300"
                  )}
                >
                  <img src={media.url} alt={media.title} className="w-full h-full object-cover" />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {media.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-white/80" />
                    </div>
                  )}

                  {media.selected && (
                    <div className="absolute top-3 left-3 w-6 h-6 bg-[#D97706] rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-black/70">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute bottom-3 inset-x-3 text-white">
                    <div className="text-xs font-bold truncate pr-2">{media.title}</div>
                    <div className="text-[10px] font-mono opacity-70 mt-0.5">{media.size}</div>
                  </div>
                </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const TabButton = ({ active, children, onClick, count }: { active?: boolean, children: React.ReactNode, onClick: () => void, count?: number }) => {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
        active ? "bg-[#FFF8F3] text-[#D97706]" : "text-slate-600 hover:bg-slate-50"
      )}
    >
      <span>{children}</span>
      {count !== undefined && (
        <span className={clsx(
          "text-xs font-mono px-2 py-0.5 rounded-full",
          active ? "bg-[#D97706]/10 text-[#D97706]" : "bg-slate-100 text-slate-500"
        )}>
          {count}
        </span>
      )}
    </button>
  );
};
