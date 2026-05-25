import { useState, useRef, useCallback, useEffect } from 'react';

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  enabled?: boolean;
}

/**
 * Hook surveillant l'élément le plus visible dans le viewport.
 * Retourne l'ID ayant le plus grand ratio d'intersection.
 * Idéal pour synchroniser la liste des catégories flottante (`sticky`).
 */
export function useIntersectionObserver(
  elementIds: string[],
  options: UseIntersectionObserverOptions = {}
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const ratiosRef = useRef<Map<string, number>>(new Map());

  const {
    root = null,
    // Utilisé pour déclencher l'activation de l'onglet légèrement avant qu'il touche le haut (compensation du header)
    rootMargin = '-80px 0px -40% 0px', 
    threshold = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    enabled = true,
  } = options;

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      ratiosRef.current.set(entry.target.id, entry.intersectionRatio);
    });

    // Trouver l'élément avec le ratio le plus élevé
    let maxRatio = 0;
    let maxId: string | null = null;

    ratiosRef.current.forEach((ratio, id) => {
      if (ratio > maxRatio) {
        maxRatio = ratio;
        maxId = id;
      }
    });

    if (maxId && maxRatio > 0) {
      setActiveId(maxId);
    }
  }, []);

  useEffect(() => {
    if (!enabled || elementIds.length === 0) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    ratiosRef.current = new Map();

    const thresholdArray = Array.isArray(threshold) ? threshold : [threshold];

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root,
      rootMargin,
      threshold: thresholdArray,
    });

    elementIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observerRef.current?.observe(el);
        ratiosRef.current.set(id, 0);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [elementIds.join(','), rootMargin, JSON.stringify(threshold), enabled, handleIntersection]);

  return activeId;
}
