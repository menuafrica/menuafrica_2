"use client";
import React, { useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/uicomponents';

interface CaptchaWrapperProps {
  onVerify: (token: string) => void;
  children: React.ReactNode;
  actionName?: string;
}

export const CaptchaWrapper: React.FC<CaptchaWrapperProps> = ({ onVerify, children, actionName = 'generic' }) => {
  const captchaRef = useRef<HCaptcha>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleVerification = async (token: string) => {
    setToken(token);
    try {
      const { data, error } = await supabase.functions.invoke('verify-captcha', {
        body: { token, siteKey: '10000000-ffff-ffff-ffff-000000000001' }
      });
      if (error && !error.message.includes('Functions')) {
         console.warn("Captcha verification skipped (Demo/Dev mode)");
      }
      onVerify(token);
    } catch (e) {
      console.error("Captcha error", e);
      toast.error("Échec de la vérification de sécurité.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full">
        {children}
      </div>
      <div className="mt-2 scale-90 origin-center">
        <HCaptcha
          sitekey="10000000-ffff-ffff-ffff-000000000001"
          onVerify={handleVerification}
          ref={captchaRef}
        />
      </div>
    </div>
  );
};
