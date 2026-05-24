"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/uicomponents';
import { MessageCircle, MapPin, Building, User, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function SuperAdminChat() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [filterResto, setFilterResto] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select(`
            *,
            restaurant:restaurants(name, subdomain)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (data) setSessions(data);
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (!selectedSessionId) return;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', selectedSessionId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();
  }, [selectedSessionId]);

  const filteredSessions = sessions.filter(s => 
      !filterResto || s.restaurant?.name?.toLowerCase().includes(filterResto.toLowerCase())
  );

  return (
    <div className="w-full p-6 space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-3xl shadow-lg shrink-0">
        <div>
            <h1 className="text-2xl font-serif font-bold flex items-center gap-3">
                <span className="text-3xl">👁️</span> 
                Tour de Contrôle
            </h1>
            <p className="text-slate-400 text-sm opacity-80">Vision globale de l'activité conversationnelle.</p>
        </div>
        <div className="flex gap-4">
            <div className="text-right">
                <div className="text-2xl font-black text-orange-500">{sessions.length}</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">Conversations Totales</div>
            </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        <div className="col-span-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400 h-4 w-4" />
                    <input 
                        type="text" 
                        placeholder="Filtrer par restaurant..." 
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                        value={filterResto}
                        onChange={(e) => setFilterResto(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {filteredSessions.map(session => (
                    <button
                        key={session.id}
                        onClick={() => setSelectedSessionId(session.id)}
                        className={cn(
                            "w-full text-left p-4 rounded-xl border transition-all hover:shadow-md group",
                            selectedSessionId === session.id 
                                ? "bg-slate-900 text-white border-slate-900" 
                                : "bg-white border-slate-100 hover:border-slate-300"
                        )}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                {session.restaurant ? (
                                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", selectedSessionId === session.id ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-700")}>
                                        {session.restaurant.name}
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                                        MenuAfrica (Site)
                                    </span>
                                )}
                            </div>
                            <span className={cn("text-[10px] font-medium", selectedSessionId === session.id ? "text-slate-400" : "text-slate-400")}>
                                {format(new Date(session.created_at), 'HH:mm dd/MM', { locale: fr })}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin size={12} className={cn(selectedSessionId === session.id ? "text-slate-500" : "text-slate-400")} />
                            <span className="text-xs font-medium truncate max-w-[200px]" title={session.page_url}>
                                {new URL(session.page_url).pathname}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        <div className="col-span-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col relative">
            {!selectedSessionId ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <Building size={64} className="opacity-20 mb-4" />
                    <p>Sélectionnez une session pour auditer la qualité du bot.</p>
                </div>
            ) : (
                <>
                    <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                <User size={18}/> 
                                {sessions.find(s => s.id === selectedSessionId)?.visitor_id === 'anon' ? 'Visiteur Inconnu' : 'Visiteur Identifié'}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Session ID: <span className="font-mono">{selectedSessionId}</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100">
                                📋 Copier Transcript
                            </button>
                            <button className="px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg text-xs font-bold text-red-600 hover:bg-red-100">
                                🚩 Signaler Erreur Bot
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
                        {messages.map((msg) => (
                            <div key={msg.id} className={cn("flex gap-4 max-w-[80%]", msg.sender === 'user' ? "ml-auto flex-row-reverse" : "")}>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm text-xs font-bold",
                                    msg.sender === 'user' ? "bg-slate-200 text-slate-600" : "bg-blue-600 text-white"
                                )}>
                                    {msg.sender === 'user' ? 'CLI' : 'BOT'}
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm shadow-sm",
                                    msg.sender === 'user' 
                                        ? "bg-white text-slate-700 rounded-tr-none" 
                                        : "bg-blue-50 text-blue-900 border border-blue-100 rounded-tl-none"
                                )}>
                                    <p>{msg.content}</p>
                                    
                                    {msg.metadata && (
                                        <div className="mt-2 pt-2 border-t border-black/5 text-[9px] font-mono text-slate-400">
                                            Actions: {JSON.stringify(msg.metadata)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>

      </div>
    </div>
  );
}
