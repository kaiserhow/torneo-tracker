/**
 * INFRASTRUCTURE — Repositorio localStorage
 * Adaptador de persistencia. Único lugar que toca localStorage.
 */

const STORAGE_KEY = 'tt_v4';

export const torneoRepository = {
  getAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveAll(torneos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(torneos));
  },
};
