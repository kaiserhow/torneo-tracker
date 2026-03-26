/**
 * DOMAIN — Cálculos de estadísticas
 * Funciones puras sin efectos secundarios
 */

export function pct(a, b) {
  return b > 0 ? Math.round((a / b) * 100) : null;
}

export function fmtPct(v) {
  return v !== null && v !== undefined ? v + '%' : '—';
}

export function calcStats(games) {
  const wins   = games.filter(g => g.result === 'win').length;
  const losses = games.filter(g => g.result === 'loss').length;
  const draws  = games.filter(g => g.result === 'draw').length;
  const total  = wins + losses + draws;
  const gF     = games.filter(g => g.first === 'yo');
  const gS     = games.filter(g => g.first === 'opp');

  return {
    wins,
    losses,
    draws,
    total,
    wr:       pct(wins, total),
    pFirst:   pct(gF.length, total),
    wrFirst:  pct(gF.filter(g => g.result === 'win').length, gF.length),
    wrSecond: pct(gS.filter(g => g.result === 'win').length, gS.length),
  };
}

export function buildDeckMap(games) {
  const decks = {};
  games.forEach(g => {
    const k     = (g.oppDeck || '').trim().toLowerCase() || '__none__';
    const label = (g.oppDeck || '').trim() || '(sin especificar)';
    if (!decks[k]) {
      decks[k] = { label, wins: 0, losses: 0, draws: 0, first_wins: 0, first_games: 0, second_wins: 0, second_games: 0 };
    }
    const d = decks[k];
    const isWin = g.result === 'win';
    if (g.first === 'yo') { d.first_games++; if (isWin) d.first_wins++; }
    else                  { d.second_games++; if (isWin) d.second_wins++; }
    if (isWin) d.wins++;
    else if (g.result === 'loss') d.losses++;
    else d.draws++;
  });
  return decks;
}

export function getDeckEntries(games) {
  const map = buildDeckMap(games);
  return Object.values(map).sort((a, b) => (b.wins + b.losses) - (a.wins + a.losses));
}

export function getAllDeckNames(torneos) {
  const map = {};
  torneos.forEach(t => t.games.forEach(g => {
    const k = (g.oppDeck || '').trim();
    if (!k) return;
    const kl = k.toLowerCase();
    if (!map[kl]) map[kl] = { label: k, count: 0 };
    map[kl].count++;
  }));
  return Object.values(map).sort((a, b) => b.count - a.count);
}

export function groupGamesByRound(games) {
  const groups = {};
  [...games].reverse().forEach(g => {
    const rnd = g.round || 'Sin ronda';
    if (!groups[rnd]) groups[rnd] = [];
    groups[rnd].push(g);
  });
  return groups;
}

export function getMyDeckList(torneos) {
  const map = {};
  torneos.forEach(t => {
    if (!t.deck?.trim()) return;
    const k = t.deck.trim().toLowerCase();
    if (!map[k]) map[k] = { label: t.deck.trim(), count: 0 };
    map[k].count++;
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
}
