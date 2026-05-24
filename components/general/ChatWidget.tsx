"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getGeminiClient } from '@/lib/aiService';
import { cn, Input } from '@/components/ui/uicomponents';
import { X, MessageCircle, Heart, Utensils, RefreshCcw, Minus, Send } from 'lucide-react';

interface Message { id: string; sender: 'bot' | 'user'; text: string; type: 'text' | 'options'; options?: { label: string; action: string }[]; }
interface ChatWidgetProps { restaurantId?: string; restaurantName?: string; }

export const ChatWidget: React.FC<ChatWidgetProps> = ({ restaurantId, restaurantName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState("");
  const [userData, setUserData] = useState({ name: '', phone: '', intent: '' });
  const [step, setStep] = useState('init');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initSessionAndStart();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    if (typeof window !== 'undefined') window.addEventListener('menuafrica:open-chat', handleOpenChat);
    return () => { if (typeof window !== 'undefined') window.removeEventListener('menuafrica:open-chat', handleOpenChat); }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  const initSessionAndStart = async () => {
      if (!sessionIdRef.current && isSupabaseConfigured && typeof window !== 'undefined') {
          try {
              const { data } = await supabase.from('chat_sessions').insert([{
                  page_url: window.location.href, user_agent: navigator.userAgent,
                  visitor_id: localStorage.getItem('menuafrica_visitor_id') || 'anon',
                  restaurant_id: restaurantId || null 
              }]).select().single();
              if (data) sessionIdRef.current = data.id;
          } catch (e) {
              console.error("Erreur init session chat", e);
          }
      }
      startConversation();
  };

  const saveMessageToDb = async (msg: Message) => {
      if (!sessionIdRef.current || !isSupabaseConfigured) return;
      try {
          await supabase.from('chat_messages').insert([{
              session_id: sessionIdRef.current, sender: msg.sender, content: msg.text,
              message_type: msg.type, metadata: msg.options ? { options: msg.options } : null
          }]);
      } catch (e) { console.warn(e); }
  };

  const startConversation = async () => {
    if (restaurantId) {
        await addMessage({ id: '1', sender: 'bot', type: 'text', text: `Bienvenue chez ${restaurantName || 'nous'} ! 🍽️` });
        await addMessage({ id: '2', sender: 'bot', type: 'options', text: "Je suis votre serveur virtuel. Comment puis-je vous aider ?", options: [ { label: "📍 Où sommes-nous ?", action: "location" }, { label: "🕒 Horaires", action: "hours" }, { label: "📞 Parler au chef", action: "contact" } ]});
    } else {
        await addMessage({ id: '1', sender: 'bot', type: 'text', text: "Bonjour ! 👋 Je suis Bibin, l'assistant MenuAfrica." });
        await addMessage({ id: '2', sender: 'bot', type: 'options', text: "Je peux vous aider à digitaliser votre restaurant. Que souhaitez-vous faire ?", options: [ { label: "🚀 Voir une démo", action: "demo" }, { label: "💰 Connaître les tarifs", action: "pricing" }, { label: "❓ Poser une question", action: "question" } ]});
    }
  };

  const addMessage = async (msg: Message) => {
    if (msg.sender === 'bot') {
        setIsTyping(true);
        await new Promise(r => setTimeout(r, 800));
        setIsTyping(false);
    }
    setMessages(prev => [...prev, msg]);
    saveMessageToDb(msg);
  };

  const handleOption = async (action: string, label: string) => {
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: label, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    saveMessageToDb(userMsg);
    setUserData(prev => ({ ...prev, intent: action }));

    if (action === 'location') {
        await addMessage({ id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: "Nous sommes situés au centre-ville. Cliquez sur l'adresse en haut pour ouvrir Google Maps !" });
    } else if (action === 'contact') {
        setStep('ask_phone');
        await addMessage({ id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: "Laissez-moi votre numéro, je demande à l'équipe de vous rappeler de suite. 📞" });
    } else if (['demo', 'pricing'].includes(action)) {
        setStep('ask_name');
        await addMessage({ id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: "Excellent choix ! Comment s'appelle votre établissement ?" });
    } else {
        setStep('free_chat');
        await addMessage({ id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: "Je vous écoute..." });
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputText, type: 'text' };
    setInputText("");
    setMessages(prev => [...prev, userMsg]);
    saveMessageToDb(userMsg);

    if (step === 'ask_phone' || step === 'free_chat') {
        setUserData(prev => ({ ...prev, phone: userMsg.text }));
        saveLead(userMsg.text);
        setStep('done');
        await addMessage({ id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: "C'est noté ! ✅ On revient vers vous très vite." });
        return;
    }

    setIsTyping(true);
    try {
        const isPublicContext = !restaurantId;
        const ai = getGeminiClient(isPublicContext);
        
        const systemInstruction = isPublicContext 
            ? "Tu es Bibin, l'assistant virtuel. Réponds de façon concise."
            : `Tu es le serveur virtuel du restaurant ${restaurantName || 'notre établissement'}. Sois poli.`;

        const response = await ai.models.generateContent({
            model: "gemini-1.5-pro",
            contents: [{ role: "user", parts: [{ text: userMsg.text }]}],
            config: { systemInstruction }
        });

        if (response.text) {
            await addMessage({ id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: response.text });
        } else {
             await addMessage({ id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: "Désolé, je n'ai pas compris votre demande." });
        }
    } catch (error) {
        console.error("Erreur Gemini:", error);
        await addMessage({ id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: "Oups, problème de connexion." });
    } finally {
        setIsTyping(false);
    }
  };

  const saveLead = async (phone: string) => {
      try {
          if (!isSupabaseConfigured) return;
          await supabase.from('contacts').insert([{
              nom: userData.name || 'Visiteur', telephone: phone,
              message: `Chatbot (${restaurantName || 'MenuAfrica'}) - Intent: ${userData.intent}`,
              source: 'chatbot_widget'
          }]);
      } catch (e) { console.error(e); }
  };

  const handleReset = () => {
      setMessages([]); setStep('init'); sessionIdRef.current = null; initSessionAndStart();
  };

  const mainColor = restaurantId ? '#1e293b' : '#c25e00';

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2 group">
        {!isOpen && (
            <div className={cn("bg-white px-4 py-2 rounded-xl shadow-xl border border-slate-100 text-sm font-bold text-slate-700 mb-2 transition-all duration-300 origin-bottom-right", isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none")}>
                {restaurantId ? "Besoin d'aide ? 🍽️" : "Une question ? 👋"}
            </div>
        )}
        <button onClick={() => setIsOpen(!isOpen)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={cn("h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ease-out hover:scale-110", isOpen ? "bg-slate-900 rotate-90" : (restaurantId ? "bg-slate-900" : "bg-yellow-500"))}>
          {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={28} className="text-white" />}
        </button>
      </div>
      <div className={cn("fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-3rem)] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col transition-all duration-500 ease-out z-[9998] overflow-hidden origin-bottom-right", isOpen ? "opacity-100 scale-100 translate-y-0 h-[600px] max-h-[70vh]" : "opacity-0 scale-95 translate-y-10 h-0 pointer-events-none")}>
        <div className="p-6 flex items-center justify-between shrink-0" style={{ backgroundColor: mainColor }}>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-white overflow-hidden shadow-sm">
                        {restaurantId ? <Utensils size={24} className="text-slate-800" /> : <Heart size={24} className="text-red-600 fill-red-600 animate-pulse" />}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">{restaurantName || 'Bibin Assistant'}</h3>
                    <p className="text-xs text-white/70">Répond instantanément</p>
                </div>
            </div>
            <div className="flex gap-1 text-white/80">
               <button onClick={handleReset} className="p-2 hover:bg-white/10 rounded-full"><RefreshCcw size={14} /></button>
               <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><Minus size={18} /></button>
            </div>
        </div>
        <div className="flex-1 bg-slate-50 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg) => (
                <div key={msg.id} className={cn("flex flex-col max-w-[85%] animate-scale-in", msg.sender === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
                    <div className={cn("px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm", msg.sender === 'user' ? "bg-slate-800 text-white rounded-tr-sm" : "bg-white text-slate-600 border border-slate-100 rounded-tl-sm")}>{msg.text}</div>
                    {msg.type === 'options' && msg.options && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {msg.options.map((opt, i) => (
                                <button key={i} onClick={() => handleOption(opt.action, opt.label)} className="text-xs bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">{opt.label}</button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {isTyping && <div className="ml-2 text-xs text-slate-400 italic">En train d'écrire...</div>}
            <div ref={messagesEndRef} />
        </div>
        <div className="p-3 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="relative">
                <Input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Écrivez un message..." className="w-full pl-4 pr-12 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white text-sm" />
                <button type="submit" disabled={!inputText.trim()} className="absolute right-1 top-1 h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center text-white transition-all active:scale-90"><Send size={16} /></button>
            </form>
        </div>
      </div>
    </>
  );
};
