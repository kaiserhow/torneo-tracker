/**
 * APPLICATION — Casos de uso
 * Orquestan dominio + infraestructura. Sin UI.
 */

import { createTorneo, createGame } from '../domain/Torneo.js';
import { torneoRepository }         from '../infrastructure/torneoRepository.js';

function persist(torneos) {
  torneoRepository.saveAll(torneos);
  return torneos;
}

// ── Torneos ──────────────────────────────────────────────
export function loadTorneos() {
  return torneoRepository.getAll();
}

export function addTorneo(torneos, data) {
  return persist([...torneos, createTorneo(data)]);
}

export function updateTorneo(torneos, id, data) {
  return persist(torneos.map(t => t.id === id ? { ...t, ...data } : t));
}

export function deleteTorneo(torneos, id) {
  return persist(torneos.filter(t => t.id !== id));
}

// ── Partidas ─────────────────────────────────────────────
export function addGame(torneos, torneoId, data) {
  return persist(torneos.map(t =>
    t.id === torneoId
      ? { ...t, games: [...t.games, createGame(data)] }
      : t
  ));
}

export function updateGame(torneos, torneoId, gameId, data) {
  return persist(torneos.map(t =>
    t.id === torneoId
      ? { ...t, games: t.games.map(g => g.id === gameId ? { ...g, ...data } : g) }
      : t
  ));
}

export function deleteGame(torneos, torneoId, gameId) {
  return persist(torneos.map(t =>
    t.id === torneoId
      ? { ...t, games: t.games.filter(g => g.id !== gameId) }
      : t
  ));
}
