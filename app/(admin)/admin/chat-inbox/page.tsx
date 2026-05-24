"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/uicomponents';
import { 
  MessageCircle, Heart, Star, BrainCircuit, 
  TrendingUp, TrendingDown, Search, ThumbsUp, User, Bot, Clock, Calendar, Filter, Loader2, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getGeminiClient } from '@/lib/aiService';

const MOCK_FEEDBACKS = [
  {
    id: 'fb-1',
    type: 'comment',
    user: 'Awa Diop',
    avatar: 'AD',
    dish: 'Thieboudienne Royal',
    dishImage: 'https://images.unsplash.com/photo-1604423043492-4130279f7271?q=80&w=200&auto=format&fit=crop',
    content: "Le poisson était incroyablement frais ! Par contre un peu trop d'huile dans le riz à mon goût. Mais je recommande !",
    rating: 4,
    sentiment: 'positive',
    date: 'Il y a 2h',
    aiInsight: "Mention positive sur la fraîcheur. Note sur l'huile récurrente (3ème fois cette semaine)."
  },
  {
    id: 'fb-2',
    type: 'like',
    user: 'Jean-Paul K.',
    dish: 'Poulet Yassa',
    dishImage: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=200&auto=format&fit=crop',
    content: "a aimé ce plat",
    sentiment: 'positive',
    date: 'Il y a 3h',
    aiInsight: null
  },
  {
    id: 'fb-3',
    type: 'comment',
    user: 'Visiteur Anonyme',
    avatar: 'VA',
    dish: 'Service',
    content: "Le serveur a mis 20 minutes à apporter l'eau. C'est dommage car le cadre est magnifique.",
    rating: 2,
    sentiment: 'negative',
    date: 'Hier',
    aiInsight: "Alerte service : Temps d'attente. Suggérer un rappel à l'équipe de salle."
  },
];

const MOCK_BOT_CHATS = [
    {
        id: 'chat-1',
        visitor: 'Client #402',
        time: 'Il y a 10 min',
        preview: "Est-ce que le Yassa est épicé ?",
        sentiment: 'neutral',
        messages: [
            { sender: 'user', text: 'Bonjour, est-ce que le Yassa est épicé ?' },
            { sender: 'bot', text: 'Bonjour ! Le Yassa est préparé avec du citron et des oignons, il est légèrement relevé mais pas piquant. Je peux demander à ajouter du piment à part si vous aimez ! 🌶️' },
            { sender: 'user', text: 'Super merci, je vais prendre ça.' }
        ]
    },
    {
        id: 'chat-2',
        visitor: 'Client #399',
        time: 'Il y a 1h',
        preview: "Horaires d'ouverture",
        sentiment: 'positive',
        messages: [
            { sender: 'user', text: 'Vous fermez à quelle heure ?' },
            { sender: 'bot', text: 'Nous sommes ouverts jusqu\'à 23h00 ce soir ! La cuisine ferme à 22h30.' }
        ]
    },
    {
        id: 'chat-3',
        visitor: 'Client #395',
        time: 'Hier',
        preview: "Réclamation commande incomplète",
        sentiment: 'negative',
        messages: [
            { sender: 'user', text: 'Il manque ma boisson !' },
            { sender: 'bot', text: 'Désolé pour cet oubli. Donnez-moi votre numéro de commande, je contacte le serveur immédiatement.' }
        ]
    }
];

export default function ChatInbox() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'feedback' | 'bot'>('feedback');
  
  const [filterFeedback, setFilterFeedback] = useState<'all' | 'positive' | 'negative'>('all');
  const [filterBotSentiment, setFilterBotSentiment] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState<string | null>(null);

  const filteredFeedbacks = MOCK_FEEDBACKS.filter(f => {
      if (filterFeedback === 'all') return true;
      if (filterFeedback === 'positive') return f.sentiment === 'positive';
      if (filterFeedback === 'negative') return f.sentiment === 'negative';
      return true;
  });

  const filteredBotChats = MOCK_BOT_CHATS.filter(c => {
      if (searchQuery && !c.visitor.toLowerCase().includes(searchQuery.toLowerCase()) && !c.preview.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
      }
      if (filterBotSentiment !== 'all' && c.sentiment !== filterBotSentiment) {
          return false;
      }
      return true;
  });

  const selectedFeedback = MOCK_FEEDBACKS.find(f => f.id === selectedFeedbackId) || MOCK_FEEDBACKS[0];
  const selectedChat = MOCK_BOT_CHATS.find(c => c.id === selectedChatId) || MOCK_BOT_CHATS[0];

  const handleGenerateResponse = async () => {
      if (!selectedFeedback) return;
      
      setIsGeneratingResponse(true);
      setGeneratedResponse(null);
      
      try {
          const ai = getGeminiClient(false);
          
          const prompt = `Génère une réponse professionnelle et polie à cet avis client pour un restaurant.
          Client: ${selectedFeedback.user}
          Plat: ${selectedFeedback.dish}
          Note: ${selectedFeedback.rating}/5
          Avis: "${selectedFeedback.content}"
          
          La réponse doit être chaleureuse, remercier le client, et s'il y a un point négatif, assurer que des mesures seront prises.`;

          const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: prompt,
          });

          if (response.text) {
              setGeneratedResponse(response.text);
          }
      } catch (error) {
          console.error("Erreur génération AI:", error);
          setGeneratedResponse("Désolé, une erreur est survenue lors de la génération de la réponse.");
      } finally {
          setIsGeneratingResponse(false);
      }
  };

  return (
    <div className="w-full p-6 space-y-6 h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-3">
               {t('bibinTitle') || 'Bibin AI'} <span className="text-sm font-sans font-normal bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1"><BrainCircuit size={14}/> {t('bibinActiveInt') || 'Intelligence Active'}</span>
            </h1>
            <p className="text-slate-500 mt-1">
                {t('bibinSubtitle') || 'Centralisation de tous les retours clients et interactions intelligentes.'}
            </p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
                onClick={() => setActiveTab('feedback')}
                className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all active:scale-95", activeTab === 'feedback' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
                {t('bibinTabFeedback') || 'Avis Clients'}
            </button>
            <button 
                onClick={() => setActiveTab('bot')}
                className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 active:scale-95", activeTab === 'bot' ? "bg-white text-purple-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
                <Bot size={16} /> {t('bibinTabBot') || 'Conversations Bot'}
            </button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-12 gap-8 min-h-0">
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
            {activeTab === 'feedback' ? (
                <Card className="p-4 border-none shadow-sm bg-white dark:bg-slate-800 animate-scale-in">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">{t('filtersFeedback')}</h3>
                    <div className="space-y-1">
                        <button onClick={() => setFilterFeedback('all')} className={cn("w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex justify-between items-center", filterFeedback === 'all' ? "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:bg-slate-50")}>
                            <span>{t('seeAll')}</span>
                            <span className="text-xs bg-white px-2 rounded-full border">42</span>
                        </button>
                        <button onClick={() => setFilterFeedback('positive')} className={cn("w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex justify-between items-center", filterFeedback === 'positive' ? "bg-green-50 text-green-700 border border-green-100" : "text-slate-500 hover:bg-slate-50")}>
                            <span className="flex items-center gap-2"><TrendingUp size={16}/> {t('positives')}</span>
                            <span className="text-xs bg-white px-2 rounded-full border">38</span>
                        </button>
                        <button onClick={() => setFilterFeedback('negative')} className={cn("w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex justify-between items-center", filterFeedback === 'negative' ? "bg-red-50 text-red-700 border border-red-100" : "text-slate-500 hover:bg-slate-50")}>
                            <span className="flex items-center gap-2"><TrendingDown size={16}/> {t('toReview')}</span>
                            <span className="text-xs bg-white px-2 rounded-full border">4</span>
                        </button>
                    </div>
                </Card>
            ) : (
                <Card className="p-4 border-none shadow-sm bg-white dark:bg-slate-800 animate-scale-in">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">{t('filtersBot')}</h3>
                    
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-2.5 text-slate-400 h-4 w-4" />
                        <input 
                            type="text" 
                            placeholder={t('search')} 
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <button onClick={() => setFilterBotSentiment('all')} className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2", filterBotSentiment === 'all' ? "bg-purple-50 text-purple-700 font-bold" : "text-slate-500 hover:bg-slate-50")}>
                            <div className="w-2 h-2 rounded-full bg-slate-300"/> {t('all')}
                        </button>
                        <button onClick={() => setFilterBotSentiment('negative')} className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2", filterBotSentiment === 'negative' ? "bg-red-50 text-red-700 font-bold" : "text-slate-500 hover:bg-slate-50")}>
                            <div className="w-2 h-2 rounded-full bg-red-500"/> {t('emergencies')}
                        </button>
                        <button onClick={() => setFilterBotSentiment('neutral')} className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2", filterBotSentiment === 'neutral' ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-500 hover:bg-slate-50")}>
                            <div className="w-2 h-2 rounded-full bg-blue-500"/> {t('simpleQuestions')}
                        </button>
                    </div>

                    <div className="h-px bg-slate-100 my-4" />

                    <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {filteredBotChats.length === 0 ? (
                            <div className="text-center text-xs text-slate-400 py-4">{t('noResults')}</div>
                        ) : (
                            filteredBotChats.map(chat => (
                                <button 
                                    key={chat.id}
                                    onClick={() => setSelectedChatId(chat.id)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-xl border transition-all active:scale-95",
                                        selectedChatId === chat.id ? "bg-purple-50 border-purple-200 shadow-sm" : "border-slate-100 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm">{chat.visitor}</span>
                                        <span className="text-[10px] text-slate-400">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">{chat.preview}</p>
                                </button>
                            ))
                        )}
                    </div>
                </Card>
            )}

            <Card className="p-6 border-none shadow-sm bg-purple-900 text-white relative overflow-hidden animate-fade-in-up">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <BrainCircuit size={32} className="mb-4 text-purple-300" />
                <h3 className="font-bold text-lg mb-2">{t('insightWeek')}</h3>
                <p className="text-sm text-purple-200 leading-relaxed">
                    {t('insightDesc')}
                </p>
            </Card>
        </div>

        <div className="col-span-12 lg:col-span-5 flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            {activeTab === 'feedback' ? (
                <>
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-sm uppercase text-slate-500">{t('feedTitle')}</h3>
                        <button className="text-slate-400 hover:text-slate-600"><Search size={18}/></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-50/30">
                        {filteredFeedbacks.map((fb) => (
                            <div 
                                key={fb.id} 
                                onClick={() => setSelectedFeedbackId(fb.id)}
                                className={cn(
                                    "group bg-white dark:bg-slate-900 p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md active:scale-[0.99]",
                                    selectedFeedbackId === fb.id ? "border-[#c25e00] ring-1 ring-orange-100" : "border-slate-100 dark:border-slate-700"
                                )}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-200">
                                            {fb.avatar || <Heart size={16}/>}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{fb.user}</h4>
                                            <span className="text-xs text-slate-400">{fb.date} • {fb.dish}</span>
                                        </div>
                                    </div>
                                    {fb.rating && (
                                        <div className="flex items-center gap-0.5 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs font-bold text-yellow-700">{fb.rating}</span>
                                        </div>
                                    )}
                                </div>

                                {fb.content && (
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-[3.25rem]">
                                        {fb.content}
                                    </p>
                                )}

                                <div className="pl-[3.25rem] mt-3 flex items-center gap-4">
                                    {fb.type === 'like' ? (
                                        <div className="inline-flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                                            <Heart size={12} fill="currentColor"/> {t('likes')}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-slate-100 bg-purple-50/30 flex items-center gap-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-full"><Bot size={18}/></div>
                        <div>
                            <h3 className="font-bold text-sm text-slate-900">{t('convWith')} {selectedChat?.visitor}</h3>
                            <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={10}/> {selectedChat?.time}</p>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                        {selectedChat?.messages.map((msg, idx) => (
                            <div key={idx} className={cn("flex gap-3 animate-fade-in-up", msg.sender === 'user' ? "flex-row-reverse" : "flex-row")}>
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.sender === 'user' ? "bg-slate-200" : "bg-purple-600 text-white")}>
                                    {msg.sender === 'user' ? <User size={14}/> : <Bot size={14}/>}
                                </div>
                                <div className={cn("p-3 rounded-2xl max-w-[80%] text-sm", msg.sender === 'user' ? "bg-white border border-slate-100 rounded-tr-none" : "bg-purple-100 text-purple-900 rounded-tl-none")}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
             {activeTab === 'feedback' && selectedFeedback ? (
                 <>
                    <Card className="overflow-hidden border-none shadow-sm bg-white dark:bg-slate-800 animate-fade-in">
                        {selectedFeedback.dishImage ? (
                            <div className="h-32 w-full relative">
                                <img src={selectedFeedback.dishImage} className="w-full h-full object-cover" alt="Plat" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-lg font-serif">{selectedFeedback.dish}</h3>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-slate-100 text-center">
                                <h3 className="font-bold text-slate-700">{selectedFeedback.dish}</h3>
                            </div>
                        )}
                        <div className="p-4 grid grid-cols-2 gap-4 text-center">
                            <div>
                                <span className="block text-xl font-bold text-slate-900">4.8</span>
                                <span className="text-[10px] uppercase text-slate-400 font-bold">{t('averageRating')}</span>
                            </div>
                            <div>
                                <span className="block text-xl font-bold text-slate-900">142</span>
                                <span className="text-[10px] uppercase text-slate-400 font-bold">{t('orders')}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border border-purple-100 bg-purple-50/50 dark:bg-purple-900/10 dark:border-purple-800 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <div className="flex items-center gap-2 mb-4 text-purple-700 dark:text-purple-300">
                            <BrainCircuit size={20} />
                            <h3 className="font-bold text-sm uppercase tracking-widest">{t('bibinAnalysis')}</h3>
                        </div>
                        
                        {selectedFeedback.aiInsight ? (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                    "{selectedFeedback.aiInsight}"
                                </p>
                                <div className="h-px bg-purple-200/50 w-full" />
                                <div>
                                    <span className="text-xs font-bold text-purple-600 block mb-2">{t('actionSuggestion')}</span>
                                    {!generatedResponse ? (
                                        <button 
                                            onClick={handleGenerateResponse}
                                            disabled={isGeneratingResponse}
                                            className="w-full py-2 bg-white border border-purple-200 rounded-lg text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isGeneratingResponse ? <><Loader2 size={14} className="animate-spin"/> {t('generating')}</> : t('generateAutoResponse')}
                                        </button>
                                    ) : (
                                        <div className="bg-white p-3 rounded-lg border border-purple-200 text-sm text-slate-700 relative">
                                            <button 
                                                onClick={() => setGeneratedResponse(null)}
                                                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                                            >
                                                <X size={14} />
                                            </button>
                                            <p className="pr-6 whitespace-pre-wrap">{generatedResponse}</p>
                                            <div className="mt-3 flex gap-2">
                                                <button className="flex-1 py-1.5 bg-purple-600 text-white rounded-md text-xs font-bold hover:bg-purple-700 transition-colors">
                                                    {t('send')}
                                                </button>
                                                <button 
                                                    onClick={handleGenerateResponse}
                                                    className="flex-1 py-1.5 bg-slate-100 text-slate-700 rounded-md text-xs font-bold hover:bg-slate-200 transition-colors"
                                                >
                                                    {t('regenerate')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">{t('noAnalysisNeeded')}</p>
                        )}
                    </Card>
                 </>
             ) : (
                 <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                     {activeTab === 'bot' ? t('botAnalysisPlaceholder') : t('selectElementPlaceholder')}
                 </div>
             )}
        </div>

      </div>
    </div>
  );
}
