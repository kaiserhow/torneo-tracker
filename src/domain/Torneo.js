/**
 * DOMAIN — Entidad Torneo
 * Lógica pura de negocio, sin dependencias externas
 */

export function createTorneo({ name, date = '', deck = '' }) {
  return {
    id: Date.now().toString(),
    name,
    date,
    deck,
    games: [],
    created: new Date().toISOString(),
  };
}

export function createGame({ oppDeck, round = '', first, result, notes = '' }) {
  return {
    id: Date.now().toString(),
    oppDeck,
    round,
    first,   // 'yo' | 'opp'
    result,  // 'win' | 'loss'
    notes,
    timestamp: new Date().toISOString(),
  };
}
