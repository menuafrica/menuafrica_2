import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImmersiveLoader } from '../../components/general/ImmersiveLoader';

export const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/admin');
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return <ImmersiveLoader />;
};
