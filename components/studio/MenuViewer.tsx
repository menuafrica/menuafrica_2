"use client";
import React from 'react';

export function MenuViewer({ menuId, isPreviewMode, className }: { menuId: string, isPreviewMode?: boolean, className?: string }) {
    return (
        <div className={className || ''}>
             <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-50 p-8 rounded-xl border border-slate-200 m-4">
                 <h2 className="text-2xl font-bold font-serif">Menu Previewer</h2>
                 <p className="text-slate-500 mt-2">ID du Menu: {menuId}</p>
                 {isPreviewMode && (
                     <span className="mt-4 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">
                         Mode Aperçu Strict
                     </span>
                 )}
             </div>
        </div>
    );
}
