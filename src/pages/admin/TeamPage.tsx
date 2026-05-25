import React, { useState } from 'react';
import { toast } from '../../components/ui/UiComponents';
import { Pencil, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

interface Member {
  id: string;
  name: string;
  role: string;
  userId: string;
  status: 'Actif' | 'En attente';
  permissions: string[];
}

export const TeamPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([
    { 
      id: "mem_1", 
      name: "Propriétaire", 
      userId: "df058...", 
      role: "Propriétaire",
      status: "Actif",
      permissions: ["Gérer les Menus", "Voir les Statistiques", "Gérer l'Équipe", "+1 autres"] 
    }
  ]);

  const handleAdd = () => {
    // Implement add functionality
  };

  return (
    <div className="space-y-6 pt-4 animate-fade-in max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-playfair font-black text-slate-800 tracking-tight">Gestion d'Équipe</h2>
          <p className="text-sm text-slate-500 mt-1">Définissez précisément qui peut faire quoi dans votre restaurant.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="h-11 px-6 bg-[#D97706] hover:bg-[#B46002] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter un membre
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 rounded-tl-2xl">COLLABORATEUR</th>
                <th className="px-6 py-4">RÔLE & ACCÈS</th>
                <th className="px-6 py-4">STATUT</th>
                <th className="px-6 py-4 text-right rounded-tr-2xl">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map(member => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFF8F3] text-[#D97706] flex items-center justify-center font-bold text-lg">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{member.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">Utilisateur ID: {member.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 mb-1.5">{member.role}</div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {member.permissions.map((perm, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                      member.status === 'Actif' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {member.status === 'Actif' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg border border-red-200 bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Aucun membre dans l'équipe pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
