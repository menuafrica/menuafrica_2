"use client";
import React, { useRef, useState } from 'react';
import { UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/uicomponents';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  title?: string;
  bucket?: string;
}

export function ImageUpload({ value, onChange, title = "Uploader", bucket = "media" }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    // Simuler l'upload Supabase
    setTimeout(() => {
        // Un mock URL local
        const objUrl = URL.createObjectURL(file);
        onChange(objUrl);
        setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative group w-full h-48 rounded-xl overflow-hidden border border-slate-200">
           <Image src={value} alt="Uploaded" fill className="object-cover" />
           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="text-white border-white">
                  Changer l'image
              </Button>
           </div>
        </div>
      ) : (
        <div 
            className="w-full h-48 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            onClick={() => fileInputRef.current?.click()}
        >
            <UploadCloud size={40} className="text-slate-400 mb-2" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</span>
            <span className="text-xs text-slate-400 mt-1">PNG, JPG ou WEBP (max. 5MB)</span>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        accept="image/png, image/jpeg, image/webp" 
        className="hidden" 
      />
      {loading && <p className="text-sm text-orange-500 font-bold flex items-center gap-2 mt-2"><Loader2 className="animate-spin" size={16} /> Envoi en cours...</p>}
    </div>
  );
}
