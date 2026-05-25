import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { MenuItem, Category } from '../lib/types';

interface SearchResult {
  item: MenuItem;
  score: number;
  matchField: 'name' | 'category' | 'tags' | 'ingredients' | 'description' | 'popular';
}

interface UseMenuSearchOptions {
  items: MenuItem[];
  categories: Category[];
  debounceMs?: number;
  minQueryLength?: number;
}

export function useMenuSearch({
  items,
  categories,
  debounceMs = 150, // Fixé à 150ms comme demandé
  minQueryLength = 1,
}: UseMenuSearchOptions) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debouncing
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, debounceMs]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach(c => {
      map.set(c.id, c.name_fr.toLowerCase());
      if (c.name_en) map.set(`${c.id}_en`, c.name_en.toLowerCase());
    });
    return map;
  }, [categories]);

  const results = useMemo<SearchResult[]>(() => {
    const q = debouncedQuery;
    if (!q || q.length < minQueryLength) return [];

    const scored: SearchResult[] = [];

    items.forEach(item => {
      const nameFr = (item.name_fr || '').toLowerCase();
      const descFr = (item.description_fr || '').toLowerCase();
      const tags = (item.tags || []).map(t => t.toLowerCase());
      const ingredients = (item.ingredients || []).map(i => i.toLowerCase());
      const catName = categoryMap.get(item.category_id) || '';

      let bestScore = 0;
      let matchField: SearchResult['matchField'] = 'name';

      // 1. Nom exact (100) / Commence par (90) / Contient (70)
      if (nameFr.includes(q)) {
        const score = nameFr === q ? 100 : nameFr.startsWith(q) ? 90 : 70;
        if (score > bestScore) { bestScore = score; matchField = 'name'; }
      }

      // 2. Inclusion dans Catégorie (60)
      if (catName.includes(q)) {
        const score = 60;
        if (score > bestScore) { bestScore = score; matchField = 'category'; }
      }

      // 3. Présence dans Tags (50)
      for (const tag of tags) {
        if (tag.includes(q)) {
          const score = 50;
          if (score > bestScore) { bestScore = score; matchField = 'tags'; }
          break;
        }
      }

      // 4. Présence dans Ingrédients (40)
      for (const ing of ingredients) {
        if (ing.includes(q)) {
          const score = 40;
          if (score > bestScore) { bestScore = score; matchField = 'ingredients'; }
          break;
        }
      }

      // 5. Présence dans Description (30)
      if (descFr.includes(q)) {
        const score = 30;
        if (score > bestScore) { bestScore = score; matchField = 'description'; }
      }

      // 6. Bonus si populaire (+10)
      if (item.is_popular && bestScore > 0) {
        bestScore += 10;
        // On ne change pas le matchField, le bonus s'ajoute simplement
      }

      if (bestScore > 0) {
        scored.push({ item, score: bestScore, matchField });
      }
    });

    // Tri par score de pertinence décroissant
    return scored.sort((a, b) => b.score - a.score);
  }, [debouncedQuery, items, categoryMap, minQueryLength]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching: debouncedQuery.length >= minQueryLength,
    clearSearch,
  };
}
