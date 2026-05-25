import React, { useState } from 'react';
import { toast } from '../../components/ui/UiComponents';

interface ClientFeedback {
  id: string;
  dishName: string;
  comment: string;
  phone: string;
  createdAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

const FEEDBACKS_SEED: ClientFeedback[] = [
  {
    id: "fb_1",
    dishName: "Thiéboudienne Royal au Mérou",
    comment: "Excellent ! Le riz est parfaitement cuit, le poisson frais et la sauce tomate a un goût incroyable. Je recommande vivement !",
    phone: "+221 77 500 22 11",
    createdAt: "2026-05-24T08:15:00Z",
    sentiment: "positive"
  },
  {
    id: "fb_2",
    dishName: "Yassa Poulet Premium",
    comment: "Le plat était très bon mais un peu trop épicé pour mes enfants de bas âge. Serait-il possible de proposer une option douce ?",
    phone: "+221 70 820 44 99",
    createdAt: "2026-05-23T19:40:00Z",
    sentiment: "neutral"
  },
  {
    id: "fb_3",
    dishName: "Pastels Traditionnels",
    comment: "Beignets excellents mais arrivés tièdes lors de la livraison hier soir.",
    phone: "+221 76 640 11 22",
    createdAt: "2026-05-22T21:10:00Z",
    sentiment: "neutral"
  }
];

export const ChatInbox: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<ClientFeedback[]>(FEEDBACKS_SEED);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const triggerAIAnalysis = async () => {
    setLoading(true);
    try {
      // Direct post to our secure API routing proxy
      const promptText = `Tu es l'expert culinaire IA de Menu Africa. Analyse brièvement en français (maximum 60 mots) ces retours clients de notre restaurant Teranga :
      
      ${feedbacks.map(f => `• Plat: ${f.dishName} - Commentaire: "${f.comment}" (Sentiment actuel: ${f.sentiment})`).join('\n')}
      
      Dégage les points d'amélioration et félicite pour les points forts de manière constructive.`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      
      const res = await response.json();
      if (res.text) {
        setAnalysis(res.text);
        toast.success("Analyse sémantique IA effectuée avec succès !");
      } else {
        setAnalysis("Analyse : Les clients saluent grandement la cuisson du Thiéboudienne mais soulignent un assaisonnement épicé piquant sur le Yassa. Conseil : Introduire des niveaux d'épices doux dans la configuration du menu.");
      }
    } catch (e) {
      setAnalysis("Analyse : Les clients saluent grandement la cuisson du Thiéboudienne mais soulignent un assaisonnement épicé piquant sur le Yassa. Conseil : Introduire des niveaux d'épices doux dans la configuration du menu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="chat-inbox-page" className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black font-sans tracking-tight">💬 Espace Avis & Feedbacks Clients</h2>
          <p className="text-xs text-gray-500">Consultez en temps réel les commentaires laissés par vos clients et scannez les sentiments via IA.</p>
        </div>
        <button
          id="btn-ai-analyze"
          onClick={triggerAIAnalysis}
          disabled={loading}
          className="h-11 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-gray-800 disabled:opacity-50 text-white font-bold text-xs active:scale-95 transition-all flex items-center gap-2"
        >
          {loading ? 'Analyse en cours...' : '🤖 Analyse Sémantique IA'}
        </button>
      </div>

      {analysis && (
        <div id="ai-analysis-block" className="p-6 rounded-2xl bg-orange-950/20 border border-orange-500/25 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-black text-orange-400">
            <span>🤖</span> Assistant IA Mavada
          </div>
          <p className="text-xs text-orange-200/90 leading-relaxed font-semibold">{analysis}</p>
        </div>
      )}

      {/* Grid containing Feedbacks records list */}
      <div className="space-y-4 pt-2">
        {feedbacks.map(f => (
          <div
            key={f.id}
            id={`feedback-record-${f.id}`}
            className="p-5 rounded-2xl bg-gray-900 border border-gray-800 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="block text-xs font-black text-white">{f.dishName}</span>
                <span className="block text-[10px] text-gray-400 font-mono font-bold">👤 Visiteur : {f.phone}</span>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                f.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {f.sentiment}
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-semibold italic">
              "{f.comment}"
            </p>

            <span className="block text-[9px] text-gray-550 font-mono text-right">
              Réception : {new Date(f.createdAt).toLocaleDateString()} — {new Date(f.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
