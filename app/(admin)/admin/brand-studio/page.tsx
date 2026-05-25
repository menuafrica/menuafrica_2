"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const BrandStudioComponent = dynamic(() => import('./BrandStudioComponent'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c25e00]" />
    </div>
  )
});

export default function BrandStudioPage() {
  return <BrandStudioComponent />;
}
