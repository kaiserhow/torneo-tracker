/**
 * UI HOOK — useAutocomplete
 */

import { useState, useCallback } from 'react';
import { getAllDeckNames } from '../../domain/stats.js';

export function useAutocomplete(torneos) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);

  const query = useCallback((val) => {
    const all = getAllDeckNames(torneos);
    const v   = (val || '').trim().toLowerCase();
    const filtered = v === ''
      ? all.slice(0, 8)
      : all.filter(d => d.label.toLowerCase().includes(v)).slice(0, 8);
    setSuggestions(filtered);
    setOpen(filtered.length > 0);
  }, [torneos]);

  const close = useCallback(() => setOpen(false), []);

  return { suggestions, open, query, close };
}
