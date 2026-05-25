import React, { useState, useEffect } from 'react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

type ToastCallback = (toast: ToastMessage) => void;
const listeners = new Set<ToastCallback>();

export const toast = {
  success: (text: string) => {
    listeners.forEach(cb => cb({ id: `${Date.now()}`, text, type: 'success' }));
  },
  error: (text: string) => {
    listeners.forEach(cb => cb({ id: `${Date.now()}`, text, type: 'error' }));
  },
  info: (text: string) => {
    listeners.forEach(cb => cb({ id: `${Date.now()}`, text, type: 'info' }));
  }
};

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleAdd = (newToast: ToastMessage) => {
      setToasts(prev => [...prev, newToast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 3000);
    };

    listeners.add(handleAdd);
    return () => {
      listeners.delete(handleAdd);
    };
  }, []);

  return (
    <div id="toast-container" className="fixed top-4 right-4 z-70 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          id={`toast-${t.id}`}
          className={`px-4 py-3 rounded-xl font-sans text-sm text-white shadow-xl flex items-center gap-3 animate-slide-in pointer-events-auto border ${
            t.type === 'success'
              ? 'bg-emerald-950 border-emerald-500/30 text-emerald-300'
              : t.type === 'error'
              ? 'bg-red-950 border-red-500/30 text-red-300'
              : 'bg-gray-900 border-gray-700 text-gray-200'
          }`}
        >
          <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
          <span className="flex-1 font-medium">{t.text}</span>
        </div>
      ))}
    </div>
  );
};
