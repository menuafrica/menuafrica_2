"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast, Button, Dialog, cn } from './uicomponents';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { Loader2, Upload, X, ZoomIn, Check } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  aspectRatio?: number;
  label?: string;
  bucket?: string;
}

const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob | null> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => { image.onload = resolve; });
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return new Promise<Blob>((resolve) => {
    canvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.9);
  });
};

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, aspectRatio = 1, label = "Téléverser une image", bucket = 'menuafrica-images' }) => {
  const { organization } = useAuth();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => { setError(false); }, [value]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || null);
        setIsCropOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    setIsLoading(true);
    try {
        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
        
        if (croppedBlob) {
           if (isSupabaseConfigured && organization?.id) {
               const fileName = `${organization.id}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
               const { data, error } = await supabase.storage.from(bucket).upload(fileName, croppedBlob, { cacheControl: '3600', upsert: false });

               if (error) {
                 const reader = new FileReader();
                 reader.readAsDataURL(croppedBlob);
                 reader.onloadend = () => {
                     onChange(reader.result as string);
                     toast.success("Image sauvegardée (Local via Fallback)");
                     setIsCropOpen(false); setImageSrc(null); setIsLoading(false);
                 };
                 return;
               }

               const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
               onChange(publicUrl);
               toast.success("Image sauvegardée !");
           } else {
               const reader = new FileReader();
               reader.readAsDataURL(croppedBlob);
               reader.onloadend = () => {
                   onChange(reader.result as string);
                   toast.success("Image sauvegardée (Local)");
                   setIsCropOpen(false); setImageSrc(null); setIsLoading(false);
               };
               return;
           }
           setIsCropOpen(false); setImageSrc(null);
        }
    } catch (e: any) {
        toast.error("Erreur upload : " + (e.message || "Vérifiez les droits d'accès"));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {!value || error ? (
        <div {...getRootProps()} className={cn("border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 gap-4 group", isDragActive ? "border-[#c25e00] bg-[#c25e00]/5 scale-[1.02]" : "border-slate-200 hover:border-[#c25e00]/50 hover:bg-slate-50", error && "border-red-300 bg-red-50")}>
          <input {...getInputProps()} />
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
             {isLoading ? <Loader2 className="animate-spin text-[#c25e00]" /> : <Upload className="text-slate-500 group-hover:text-[#c25e00]" />}
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-700">{isDragActive ? "Déposez ici" : label}</p>
            <p className="text-xs text-slate-400 mt-1">JPG, PNG optimisés</p>
          </div>
        </div>
      ) : (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-sm inline-block">
          <img src={value} alt="Preview" className={cn("object-cover bg-slate-50", aspectRatio === 1 ? "w-40 h-40" : "w-full h-40")} onError={() => setError(true)} />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
            <Button variant="destructive" size="sm" onClick={() => onChange('')} className="rounded-full h-10 w-10 p-0"><X size={18} /></Button>
          </div>
        </div>
      )}
      <Dialog open={isCropOpen} onOpenChange={setIsCropOpen} title="Ajuster l'image">
         <div className="relative w-full h-[300px] bg-slate-900 rounded-xl overflow-hidden mb-6">
            {imageSrc && (<Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={aspectRatio} onCropChange={setCrop} onCropComplete={(a, pixels) => setCroppedAreaPixels(pixels)} onZoomChange={setZoom} />)}
         </div>
         <div className="flex items-center gap-4 mb-6 px-2">
            <ZoomIn size={18} className="text-slate-400" />
            <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c25e00]" />
         </div>
         <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsCropOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveCrop} isLoading={isLoading} className="bg-[#c25e00] text-white"><Check className="mr-2 h-4 w-4" /> Sauvegarder</Button>
         </div>
      </Dialog>
    </div>
  );
};
