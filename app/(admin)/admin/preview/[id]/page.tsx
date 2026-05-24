"use client";
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MenuViewer } from '@/components/studio/MenuViewer';
import { Button } from '@/components/ui/uicomponents';
import { ArrowLeft, Eye } from 'lucide-react';

export default function PreviewPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  useEffect(() => {
    (window as any).isPreviewMode = true;
    return () => { (window as any).isPreviewMode = false; };
  }, []);

  if (!id) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">ID de menu manquant</h2>
        <Button onClick={() => router.push('/admin/builder')}>Retour au Studio</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white overflow-x-hidden relative">
      <div className="fixed top-4 left-4 z-[10000] flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className="rounded-full shadow-lg bg-white/80 backdrop-blur-md border-slate-200"
            onClick={() => window.close()}
          >
            <ArrowLeft size={16} className="mr-2" />
            Quitter l'aperçu
          </Button>
          <div className="px-4 py-2 bg-orange-500 text-white rounded-full shadow-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Eye size={14} />
              Mode Aperçu (Brouillon)
          </div>
      </div>

      <MenuViewer 
        menuId={id} 
        isPreviewMode={true} 
        className="w-full"
      />
      
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('click', function(e) {
          const anchor = e.target.closest('a');
          if (anchor) {
            const href = anchor.getAttribute('href');
            if (href && (href.startsWith('http') || href.startsWith('//'))) {
              e.preventDefault();
              console.log('Les liens externes sont désactivés en mode Aperçu.');
            }
          }
        }, true);
      `}} />
    </div>
  );
}
