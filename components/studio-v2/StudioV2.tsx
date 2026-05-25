"use client";
import React from 'react';

export function StudioV2({ menuId, onBack }: { menuId: string | null, onBack?: () => void }) {
    return (
        <div className="w-full h-[600px] border border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 relative overflow-hidden">
             {onBack && (
                 <button 
                     onClick={onBack} 
                     className="absolute top-4 left-4 px-3 py-1.5 text-xs bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer"
                 >
                     ← Retour aux menus
                 </button>
             )}
              <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold font-serif text-slate-900">Menu Studio V2</h2>
                  <p className="text-slate-500">Interface de construction avancée de menu...</p>
                  <div className="px-4 py-2 bg-slate-900 text-white rounded-lg inline-block text-xs font-mono">ID: {menuId || 'Nouveau Menu'}</div>
              </div>
        </div>
    );
}
