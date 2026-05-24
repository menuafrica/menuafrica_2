"use client";
import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="p-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-4 font-serif">Tableau de Bord</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-400">Vues Totales</h3>
            <p className="text-4xl mt-2 text-[#c25e00] font-bold">12,450</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-400">Plats Actifs</h3>
            <p className="text-4xl mt-2 text-[#c25e00] font-bold">45</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-400">Cote d'Engagement</h3>
            <p className="text-4xl mt-2 text-[#c25e00] font-bold">+25%</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
