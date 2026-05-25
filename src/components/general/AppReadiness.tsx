import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ImmersiveLoader } from './ImmersiveLoader';

export const AppReadiness: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading } = useAuth();
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && profile) {
      setReady(true);
    } else if (!loading && !profile) {
      // Allow fallback if user exists but profile profile has a temporary sync gap
      setReady(true);
    }
  }, [profile, loading]);

  if (loading || !ready) {
    return <ImmersiveLoader />;
  }

  return <>{children}</>;
};
