"use client";
import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, Loader2, X, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';
interface ToastEvent { message: string; type: ToastType; id: number; }

const toastListeners: ((toast: ToastEvent) => void)[] = [];
export const toast = {
  success: (message: string, options?: { id?: number }) => emitToast(message, 'success', options?.id),
  error: (message: string, options?: { id?: number }) => emitToast(message, 'error', options?.id),
  info: (message: string, options?: { id?: number }) => emitToast(message, 'info', options?.id),
  warning: (message: string, options?: { id?: number }) => emitToast(message, 'warning', options?.id),
  loading: (message: string) => emitToast(message, 'info'),
};

function emitToast(message: string, type: ToastType, id?: number) {
  const toastId = id || Date.now();
  toastListeners.forEach(l => l({ message, type, id: toastId }));
  return toastId;
}

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<ToastEvent[]>([]);

  useEffect(() => {
    const handler = (t: ToastEvent) => {
      setToasts(prev => {
        const index = prev.findIndex(item => item.id === t.id);
        if (index > -1) {
          const next = [...prev];
          next[index] = t;
          return next;
        }
        return [...prev, t];
      });
      
      setTimeout(() => {
        setToasts(prev => prev.filter(item => item.id !== t.id));
      }, 5000);
    };
    toastListeners.push(handler);
    return () => {
      const index = toastListeners.indexOf(handler);
      if (index > -1) toastListeners.splice(index, 1);
    };
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
      {toasts.map(t => (
        <div key={t.id} className={cn(
          "pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-full shadow-xl border animate-fade-in-up backdrop-blur-xl w-full justify-center md:w-auto",
          t.type === 'success' ? "bg-white/90 border-emerald-100 text-emerald-800 dark:bg-slate-800/90 dark:border-emerald-900 dark:text-emerald-400" :
          t.type === 'error' ? "bg-white/90 border-red-100 text-red-800 dark:bg-slate-800/90 dark:border-red-900 dark:text-red-400" : 
          t.type === 'warning' ? "bg-white/90 border-amber-100 text-amber-800 dark:bg-slate-800/90 dark:border-amber-900 dark:text-amber-400" :
          "bg-white/90 border-slate-100 text-slate-800 dark:bg-slate-800/90 dark:border-slate-700 dark:text-white"
        )}>
          {t.type === 'success' && <Check size={16} className="shrink-0" />}
          {(t.type === 'error' || t.type === 'warning') && <AlertCircle size={16} className="shrink-0" />}
          <span className="text-sm font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  );
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link' | 'glass';
  size?: 'sm' | 'default' | 'lg' | 'icon' | 'xl';
  isLoading?: boolean;
}

export const Button = ({ 
  className, variant = 'default', size = 'default', isLoading, children, type = 'button', disabled, ...props 
}: ButtonProps) => {
  const variants = {
    default: 'bg-[#c25e00] text-white hover:bg-[#a04e00] shadow-lg shadow-orange-500/20 border border-transparent hover:shadow-orange-500/40',
    outline: 'border-2 border-slate-200 bg-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700',
    ghost: 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white',
    destructive: 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400',
    link: 'text-[#c25e00] underline-offset-4 hover:underline p-0 h-auto shadow-none active:scale-100',
    glass: 'bg-white/60 backdrop-blur-md border border-white/50 text-slate-900 hover:bg-white/80 shadow-sm dark:bg-black/40 dark:border-white/10 dark:text-white'
  };
  const sizes = { sm: 'h-8 px-3 text-xs rounded-full', default: 'h-11 px-5 py-2 text-sm rounded-full', lg: 'h-14 px-8 text-base rounded-full', xl: 'h-16 px-10 text-lg rounded-full', icon: 'h-11 w-11 rounded-full flex items-center justify-center p-0' };
  
  return (
    <button type={type} className={cn('inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 select-none transform hover:-translate-y-0.5 active:translate-y-0', variants[variant], sizes[size], className)} disabled={isLoading || disabled} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-slate-200 dark:hover:border-slate-700", className)} {...props} />
);

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-6 md:p-8 pb-4", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight", className)} {...props} />
);

export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-slate-500 font-medium leading-relaxed", className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 md:p-8 pt-0", className)} {...props} />
);

export const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className={cn("flex h-12 w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-transparent px-4 py-2 text-sm placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-[#c25e00]/20 focus:ring-4 focus:ring-[#c25e00]/10 outline-none transition-all duration-200 text-slate-900 dark:text-white", className)} {...props} />
);

export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block ml-1", className)} {...props} />
);

export const Switch = ({ className, checked, onCheckedChange, ...props }: any) => (
  <button type="button" role="switch" aria-checked={checked} onClick={() => onCheckedChange?.(!checked)} className={cn("group inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2", checked ? "bg-[#c25e00]" : "bg-slate-200 dark:bg-slate-700", className)} {...props}>
    <span className={cn("pointer-events-none block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]", checked ? "translate-x-5" : "translate-x-0")} />
  </button>
);

export const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", className)} {...props} />
);

export const Dialog: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void; title?: string; description?: string; children: React.ReactNode; className?: string }> = ({ open, onOpenChange, title, description, children, className }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300" onClick={() => onOpenChange(false)} />
      <div className={cn("relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-2xl animate-scale-in border border-white/20 dark:border-slate-800 max-h-[90vh] overflow-y-auto custom-scrollbar", className)}>
        {(title || description) && (
          <div className="mb-6">
            {title && <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>}
            {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
          </div>
        )}
        <button className="absolute right-4 top-4 rounded-full p-2 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors" onClick={() => onOpenChange(false)}><X className="h-5 w-5" /></button>
        {children}
      </div>
    </div>
  );
};

export const Sheet: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode; side?: 'left' | 'right' }> = ({ open, onOpenChange, children, side = 'right' }) => {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[100] bg-slate-900/20 backdrop-blur-sm transition-opacity duration-500" onClick={() => onOpenChange(false)} />
      <div className={cn("fixed z-[101] h-full top-0 bg-white dark:bg-slate-900 shadow-2xl flex flex-col", side === 'right' ? "right-0 w-full sm:w-[400px] border-l" : "left-0 w-full sm:w-[320px] border-r")}>
        <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 rounded-full z-10"><X size={20} /></button>
        {children}
      </div>
    </>
  );
};

export const SheetHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={cn("p-6 border-b", className)}>{children}</div>;
export const SheetTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <h3 className={cn("text-lg font-bold", className)}>{children}</h3>;
export const SheetContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={cn("flex-1 overflow-y-auto p-6 custom-scrollbar", className)}>{children}</div>;
export const SheetFooter: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={cn("p-6 border-t", className)}>{children}</div>;

export const Accordion: React.FC<{ items: { title: string; content: string | React.ReactNode }[] }> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-all">
          <button className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}>
            <span className="font-semibold">{item.title}</span>
            <ChevronDown className={cn("text-slate-400 transition-transform duration-300", activeIndex === idx ? "rotate-180" : "")} size={18} />
          </button>
          <div className={cn("overflow-hidden transition-all duration-300", activeIndex === idx ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>
            <div className="px-6 pb-6 pt-0 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
