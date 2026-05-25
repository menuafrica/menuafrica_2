"use client";
import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, Button, Input, Label, toast } from '@/components/ui/uicomponents';
import { Mail, MapPin, Phone, MessageCircle, Send, MessageSquare } from 'lucide-react';

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button 
        type="submit" 
        disabled={pending}
        isLoading={pending}
        className="w-full bg-[#c25e00] hover:bg-[#a04e00] text-white font-bold h-12 rounded-xl shadow-lg shadow-orange-500/10"
    >
        {pending ? 'Envoi en cours...' : 'Envoyer le message'} 
        {!pending && <Send size={16} className="ml-2" />}
    </Button>
  );
};

export default function Contact() {
  const handleContactSubmit = async (prevState: any, formData: FormData) => {
    // Simulation d'envoi asynchrone natif
    await new Promise(r => setTimeout(r, 1500));
    const name = formData.get('name');
    toast.success(`Message envoyé ! Merci ${name}, l'équipe vous répondra sous 24h.`);
    return { success: true };
  };

  const [state, formAction] = useActionState(handleContactSubmit, { success: false });

  const openChat = () => {
    window.dispatchEvent(new CustomEvent('menuafrica:open-chat'));
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. INFO & HERO SECTION */}
      <div className="flex flex-col items-center justify-center p-4 pt-32 md:pt-40">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center mb-24">
          
          {/* INFO CARD */}
          <div className="space-y-8">
              <div>
                  <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">Contactez-nous</h1>
                  <p className="text-lg text-slate-500">
                      Une question sur nos services ou besoin d'assistance technique ?
                  </p>
              </div>

              <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <div className="w-12 h-12 bg-orange-50 text-[#c25e00] rounded-full flex items-center justify-center shrink-0">
                          <MapPin size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-900">Siège Social</h4>
                          <p className="text-slate-500 text-sm">123 Avenue Cheikh Anta Diop, Dakar</p>
                      </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                          <Mail size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-900">Email</h4>
                          <p className="text-slate-500 text-sm">contact@menuafrica.com</p>
                      </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                          <Phone size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-900">Téléphone</h4>
                          <p className="text-slate-500 text-sm">+221 33 800 00 00</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* ILLUSTRATION & CTA */}
          <div className="bg-[#1e293b] rounded-[2.5rem] p-10 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c25e00] rounded-full blur-[80px] opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-8">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md animate-float">
                      <MessageCircle size={40} className="text-[#EAB308] fill-current" />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold font-serif mb-2">Besoin d'une réponse rapide ?</h3>
                      <p className="text-slate-400">
                          Notre assistant intelligent Lova est disponible 24/7 pour vous aider.
                      </p>
                  </div>
                  <button onClick={openChat} className="bg-white/10 px-6 py-3 rounded-full text-sm font-bold text-slate-300 border border-white/10 animate-pulse hover:bg-white/20 transition-colors">
                      ↘️ Cliquez sur la bulle en bas à droite
                  </button>
              </div>
          </div>

        </div>
      </div>

      {/* 2. FORMULAIRE DE CONTACT */}
      <section className="py-24 bg-white relative border-t border-slate-100">
          <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
                  {/* Left Info */}
                  <div className="md:w-5/12 bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#c25e00] rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>
                      
                      <div className="relative z-10">
                          <h3 className="font-serif text-3xl font-bold mb-4">Une question spécifique ?</h3>
                          <p className="text-slate-400 text-sm leading-relaxed mb-8">
                              Notre équipe est là pour vous aider. Si l'assistant Lova n'a pas su répondre, écrivez-nous directement.
                          </p>
                          
                          <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                      <Mail size={18} />
                                  </div>
                                  <span className="text-sm font-medium">contact@menuafrica.com</span>
                              </div>
                              <div 
                                className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors -ml-2"
                                onClick={openChat}
                              >
                                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                      <MessageSquare size={18} />
                                  </div>
                                  <span className="text-sm font-medium underline decoration-dashed underline-offset-4 decoration-[#c25e00]">Chat en ligne (Bulles)</span>
                              </div>
                          </div>
                      </div>

                      <div className="relative z-10 mt-12">
                          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Temps de réponse moyen</p>
                          <p className="text-xl font-bold text-green-400">~ 2 heures</p>
                      </div>
                  </div>

                  {/* Right Form */}
                  <div className="md:w-7/12 p-10 bg-slate-50/50">
                      <form action={formAction} className="space-y-6">
                          <div className="space-y-2">
                              <Label className="text-xs font-bold text-slate-500 uppercase">Votre Nom</Label>
                              <Input 
                                  name="name"
                                  placeholder="Jean Dupont" 
                                  className="bg-white border-slate-200 focus:border-[#c25e00] focus:ring-[#c25e00]/20"
                                  required
                              />
                          </div>
                          <div className="space-y-2">
                              <Label className="text-xs font-bold text-slate-500 uppercase">Restaurant</Label>
                              <Input 
                                  name="restaurant"
                                  placeholder="Nom de l'établissement" 
                                  className="bg-white border-slate-200 focus:border-[#c25e00] focus:ring-[#c25e00]/20"
                                  required
                              />
                          </div>
                          <div className="space-y-2">
                              <Label className="text-xs font-bold text-slate-500 uppercase">Email Pro</Label>
                              <Input 
                                  type="email"
                                  name="email"
                                  placeholder="jean@restaurant.com" 
                                  className="bg-white border-slate-200 focus:border-[#c25e00] focus:ring-[#c25e00]/20"
                                  required
                              />
                          </div>
                          <div className="space-y-2">
                              <Label className="text-xs font-bold text-slate-500 uppercase">Message</Label>
                              <textarea 
                                  name="message"
                                  placeholder="Comment puis-je..." 
                                  className="w-full h-32 px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#c25e00]/10 focus:border-[#c25e00] text-sm resize-none text-slate-900 placeholder:text-gray-400 transition-all"
                                  required
                              />
                          </div>
                          <SubmitButton />
                      </form>
                  </div>
              </div>
          </div>
      </section>

    </div>
  );
}
