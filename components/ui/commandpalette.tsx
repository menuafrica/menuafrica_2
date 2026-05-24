"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Search, Terminal, Moon, LogOut, LayoutDashboard, QrCode, Settings, UtensilsCrossed } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const { signOut } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const actions = [
    {
      heading: 'Navigation',
      items: [
        { id: 'dash', name: 'Aller au Dashboard', icon: LayoutDashboard, shortcut: 'G D', action: () => router.push('/admin') },
        { id: 'menus', name: 'Gérer les Menus', icon: QrCode, shortcut: 'G M', action: () => router.push('/admin/menus') },
        { id: 'builder', name: 'Constructeur de Menu', icon: UtensilsCrossed, shortcut: 'G B', action: () => router.push('/admin/menu') },
        { id: 'settings', name: 'Paramètres', icon: Settings, shortcut: 'G S', action: () => router.push('/admin/settings') },
      ]
    },
    {
      heading: 'Système',
      items: [
        { id: 'theme', name: 'Changer Thème (Jour/Nuit)', icon: Moon, shortcut: 'T', action: () => toggleTheme() },
        { id: 'logout', name: 'Se déconnecter', icon: LogOut, shortcut: '', action: () => signOut() },
      ]
    }
  ];

  const filteredActions = query === '' 
    ? actions 
    : actions.map(group => ({
        ...group,
        items: group.items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
      })).filter(group => group.items.length > 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in flex flex-col">
        <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            autoFocus
            className="flex-1 bg-transparent outline-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
            placeholder="Tapez une commande..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">ESC pour fermer</div>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar">
          {filteredActions.length === 0 ? (
             <div className="py-8 text-center text-slate-500 text-sm">Aucune commande trouvée.</div>
          ) : (
            filteredActions.map((group, i) => (
              <div key={i} className="mb-2">
                <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{group.heading}</div>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { item.action(); setIsOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-lg">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-200 font-medium group-hover:text-primary transition-colors">{item.name}</span>
                    </div>
                    {item.shortcut && (
                      <div className="text-xs font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">{item.shortcut}</div>
                    )}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
        
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2"><Terminal className="w-3 h-3" /><span>MenuAfrica Command Line</span></div>
          <div className="flex gap-2"><span>↑↓ pour naviguer</span><span>↵ pour valider</span></div>
        </div>
      </div>
    </div>
  );
};
