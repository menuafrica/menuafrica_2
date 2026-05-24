"use client";
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import * as motion from 'motion/react-client';

interface AppReadinessProps {
  children: React.ReactNode;
}

export const AppReadiness: React.FC<AppReadinessProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 10;

    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          if (isMounted) setIsReady(true);
        } else {
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(checkHealth, 1000);
          } else {
            if (isMounted) setIsReady(true);
          }
        }
      } catch (err) {
        if (isMounted) setIsReady(true);
      }
    };

    const initialDelay = setTimeout(() => { checkHealth(); }, 1000);
    return () => { isMounted = false; clearTimeout(initialDelay); };
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] dark:bg-[#050505] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/65 dark:bg-[#1e1e1e]/60 backdrop-blur-xl border border-white/50 dark:border-white/5 p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full text-center"
        >
          <div className="w-16 h-16 bg-[#c25e00]/10 rounded-full flex items-center justify-center mb-6">
            <Loader2 className="w-8 h-8 text-[#c25e00] animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-serif">Préparation de votre espace...</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Nous sécurisons votre connexion et chargeons vos configurations.</p>
        </motion.div>
      </div>
    );
  }
  return <>{children}</>;
};
