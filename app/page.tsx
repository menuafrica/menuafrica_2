"use client";
import React from 'react';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { Button } from '@/components/ui/uicomponents';
import Link from 'next/link';

export default function Home() {
  return (
    <MarketingLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white mb-6">MenuAfrica</h1>
        <p className="text-lg text-slate-500 mb-8 max-w-2xl">Digitalisez votre restaurant avec élégance. Utilisez notre intelligence artificielle Lova pour générer des menus époustouflants.</p>
        <div className="flex gap-4 cursor-pointer">
          <Link href="/auth?mode=signin">
            <Button size="lg" variant="outline">Connexion</Button>
          </Link>
          <Link href="/admin">
            <Button size="lg">Tableau de Bord</Button>
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
