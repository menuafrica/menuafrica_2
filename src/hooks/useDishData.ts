import { useState, useEffect } from 'react';
import { MenuItem } from '../lib/types';
import { mockDb } from '../lib/mockDatabase';

export const useDishData = (dishId: string | undefined) => {
  const [dish, setDish] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Optimisation : Si pas d'ID, on reset sans fetcher
    if (!dishId) {
      setDish(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchDish = async () => {
      setLoading(true);
      setError(null);
      try {
        // En mode Mock/Démo :
        const fetchedItem = await mockDb.getMenuItemById(dishId);
        
        // Anti-fuite mémoire : on ne set le state que si le composant est monté
        if (isMounted) {
          if (fetchedItem) {
            setDish(fetchedItem);
          } else {
            setError("Plat introuvable");
          }
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Erreur de chargement");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDish();

    // 2. Nettoyage strict (Cleanup) pour éviter les memory leaks et les state updates sur unmounted component
    return () => {
      isMounted = false;
    };
  }, [dishId]);

  return { dish, loading, error };
};
