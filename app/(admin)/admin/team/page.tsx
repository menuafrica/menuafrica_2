"use client";
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Label, Dialog, toast, Badge } from '@/components/ui/uicomponents';
import { Users, Trash2, Plus, CheckCircle2, Clock, Edit2, Check, ShieldAlert, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const AVAILABLE_PERMISSIONS = [
  { id: 'manage_menus', label: 'Gérer les Menus', desc: 'Créer, modifier et supprimer des plats' },
  { id: 'view_stats', label: 'Voir les Statistiques', desc: 'Accès aux tableaux de bord et rapports' },
  { id: 'manage_team', label: 'Gérer l\'Équipe', desc: 'Inviter et modifier les membres' },
  { id: 'manage_settings', label: 'Paramètres', desc: 'Modifier les infos du restaurant' },
];

export default function TeamPage() {
  const { organization, role, user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role_label: 'Staff',
    permissions: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
        setLoading(true);
        if (isSupabaseConfigured && organization) {
            const { data } = await supabase
                .from('organization_members')
                .select('*')
                .eq('organization_id', organization.id);
            
            if (data && data.length > 0) {
                setMembers(data.map(m => ({
                    id: m.id,
                    name: m.role === 'owner' ? user?.name || 'Propriétaire' : 'Membre',
                    email: 'Utilisateur ID: ' + m.user_id.slice(0,5) + '...',
                    role_label: m.role === 'owner' ? 'Propriétaire' : 'Staff',
                    status: 'active',
                    permissions: m.role === 'owner' ? ['manage_menus', 'view_stats', 'manage_team', 'manage_settings'] : ['manage_menus']
                })));
            } else {
                setMembers([{
                    id: 'current-user',
                    name: user?.name || 'Vous',
                    email: user?.email,
                    role_label: 'Propriétaire',
                    status: 'active',
                    permissions: ['manage_menus', 'view_stats', 'manage_team', 'manage_settings']
                }]);
            }
        } else {
            setMembers([{
                id: 'me',
                name: user?.name || 'Moi (Propriétaire)',
                email: user?.email || 'admin@demo.com',
                role_label: 'Propriétaire',
                status: 'active',
                permissions: ['manage_menus', 'view_stats', 'manage_team', 'manage_settings']
            }]);
        }
        setLoading(false);
    };

    fetchMembers();
  }, [organization, user]);

  const handleOpenModal = (member?: any) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        email: member.email,
        name: member.name,
        role_label: member.role_label || 'Staff',
        permissions: member.permissions || []
      });
    } else {
      setEditingMember(null);
      setFormData({
        email: '',
        name: '',
        role_label: 'Staff',
        permissions: ['manage_menus']
      });
    }
    setIsModalOpen(true);
  };

  const togglePermission = (permId: string) => {
    setFormData(prev => {
      const newPerms = prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId];
      return { ...prev, permissions: newPerms };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(r => setTimeout(r, 800));

    if (editingMember) {
      setMembers(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...formData } : m));
      toast.success("Droits modifiés avec succès");
    } else {
      const newMember = {
        id: `new-${Date.now()}`,
        status: 'pending',
        ...formData
      };
      setMembers(prev => [...prev, newMember]);
      toast.success(`Invitation envoyée à ${formData.email}`);
    }
    
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  const handleRemoveMember = (id: string) => {
    if(confirm("Retirer ce membre de l'équipe ?")) {
      setMembers(prev => prev.filter(m => m.id !== id));
      toast.success("Membre retiré");
    }
  };

  if (role !== 'owner' && role !== 'admin') {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert size={40} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Accès Restreint</h2>
            <p className="text-gray-500 max-w-md">
                Vous n'avez pas les permissions nécessaires pour gérer l'équipe. Contactez le propriétaire du restaurant.
            </p>
        </div>
      );
  }

  return (
    <div className="w-full space-y-8 animate-fade-in pb-20 pt-8 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Gestion d'Équipe</h1>
           <p className="text-gray-500 dark:text-gray-400">Définissez précisément qui peut faire quoi dans votre restaurant.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-[#c25e00] hover:bg-[#a04e00] text-white shadow-lg shadow-orange-500/20 px-6 rounded-xl">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un membre
        </Button>
      </div>

      <div className="grid gap-6">
          <Card className="border-none shadow-sm dark:bg-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                              <th className="p-6 font-bold text-xs uppercase text-slate-500 tracking-wider">Collaborateur</th>
                              <th className="p-6 font-bold text-xs uppercase text-slate-500 tracking-wider">Rôle & Accès</th>
                              <th className="p-6 font-bold text-xs uppercase text-slate-500 tracking-wider">Statut</th>
                              <th className="p-6 font-bold text-xs uppercase text-slate-500 tracking-wider text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {members.map((member) => (
                              <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                  <td className="p-6">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-[#c25e00]/10 text-[#c25e00] flex items-center justify-center font-bold text-lg border border-[#c25e00]/20">
                                              {member.name ? member.name.charAt(0).toUpperCase() : <User size={16}/>}
                                          </div>
                                          <div>
                                              <div className="font-bold text-slate-900 dark:text-white">{member.name}</div>
                                              <div className="text-sm text-slate-500">{member.email}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="p-6">
                                      <div className="flex flex-col gap-1.5">
                                          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{member.role_label}</span>
                                          <div className="flex flex-wrap gap-1">
                                              {member.permissions.slice(0, 3).map((p: string) => (
                                                  <Badge key={p} className="bg-slate-100 text-slate-600 border-slate-200 text-[9px] px-1.5 py-0.5">
                                                      {AVAILABLE_PERMISSIONS.find(ap => ap.id === p)?.label || p}
                                                  </Badge>
                                              ))}
                                              {member.permissions.length > 3 && (
                                                  <span className="text-[10px] text-slate-400">+{member.permissions.length - 3} autres</span>
                                              )}
                                          </div>
                                      </div>
                                  </td>
                                  <td className="p-6">
                                      {member.status === 'active' ? (
                                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-bold">
                                              <CheckCircle2 size={14} /> Actif
                                          </div>
                                      ) : (
                                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100 text-xs font-bold">
                                              <Clock size={14} /> Invitation envoyée
                                          </div>
                                      )}
                                  </td>
                                  <td className="p-6 text-right">
                                      <div className="flex justify-end gap-2">
                                          <Button variant="outline" size="sm" onClick={() => handleOpenModal(member)} className="h-8 w-8 p-0 rounded-lg border-slate-200">
                                              <Edit2 size={14} className="text-slate-500" />
                                          </Button>
                                          {member.email !== user?.email && (
                                              <Button variant="outline" size="sm" onClick={() => handleRemoveMember(member.id)} className="h-8 w-8 p-0 rounded-lg border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200">
                                                  <Trash2 size={14} className="text-red-500" />
                                              </Button>
                                          )}
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  {members.length === 0 && (
                      <div className="p-8 text-center text-slate-400 italic">
                          Aucun membre dans l'équipe. Invitez votre premier collaborateur.
                      </div>
                  )}
              </div>
          </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={(v) => setIsModalOpen(v)} title={editingMember ? "Modifier les droits" : "Inviter un collaborateur"}>
          <form onSubmit={handleSave} className="space-y-6 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label>Nom complet</Label>
                      <Input 
                        placeholder="Ex: Moussa Diop" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                        className="rounded-xl"
                      />
                  </div>
                  <div className="space-y-2">
                      <Label>Adresse Email</Label>
                      <Input 
                        type="email"
                        placeholder="moussa@resto.com" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        required
                        className="rounded-xl"
                        disabled={!!editingMember} 
                      />
                  </div>
              </div>

              <div className="space-y-2">
                  <Label>Titre du poste (Affichage)</Label>
                  <Input 
                    placeholder="Ex: Manager, Serveur, Comptable..." 
                    value={formData.role_label}
                    onChange={e => setFormData({...formData, role_label: e.target.value})}
                    className="rounded-xl"
                  />
              </div>

              <div className="space-y-3 pt-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Permissions & Accès</Label>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3 border border-slate-100 dark:border-slate-700">
                      {AVAILABLE_PERMISSIONS.map(perm => (
                          <div key={perm.id} className="flex items-start gap-3 p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer" onClick={() => togglePermission(perm.id)}>
                              <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.permissions.includes(perm.id) ? 'bg-[#c25e00] border-[#c25e00] text-white' : 'border-slate-300 bg-white'}`}>
                                  {formData.permissions.includes(perm.id) && <Check size={12} />}
                              </div>
                              <div className="flex-1">
                                  <div className="font-bold text-sm text-slate-900 dark:text-white leading-none mb-1">{perm.label}</div>
                                  <div className="text-xs text-slate-500 leading-tight">{perm.desc}</div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-700">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                  <Button type="submit" isLoading={isSubmitting} className="bg-[#c25e00] text-white rounded-xl shadow-lg shadow-orange-500/20">
                      {editingMember ? "Enregistrer les modifications" : "Envoyer l'invitation"}
                  </Button>
              </div>
          </form>
      </Dialog>
    </div>
  );
}
