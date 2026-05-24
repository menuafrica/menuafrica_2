"use client";
import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { BuilderProvider } from '@/context/BuilderContext';
import { CartProvider } from '@/context/CartContext';
import { PublicMenuMachineProvider } from '@/context/PublicMenuMachineContext';
import { LibraryProvider } from '@/context/LibraryContext';
import { AppReadiness } from '@/components/general/AppReadiness';
import { Toaster } from '@/components/ui/uicomponents';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <BuilderProvider>
            <CartProvider>
              <PublicMenuMachineProvider>
                <LibraryProvider>
                  <AppReadiness>
                    {children}
                    <Toaster />
                  </AppReadiness>
                </LibraryProvider>
              </PublicMenuMachineProvider>
            </CartProvider>
          </BuilderProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
