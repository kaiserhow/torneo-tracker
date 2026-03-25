/**
 * UI COMPONENT — DeckStatsPanel
 * Tabla de estadísticas por baraja rival
 */

import React from 'react';
import { getDeckEntries } from '../../domain/stats.js';
import { StatPill, ProgressBar, EmptyState } from './index.jsx';
import { fmtPct, pct } from '../../domain/stats.js';

export function DeckStatsPanel({ games }) {
  const entries = getDeckEntries(games);

  if (!entries.length) return <EmptyState icon="📊" text="SIN DATOS AÚN" />;

  return (
    <div className="deck-stats-list">
      {entries.map(d => {
        const total  = d.wins + d.losses;
        const wr     = pct(d.wins, total);
        const pFirst = pct(d.first_games, total);
        const wrF    = pct(d.first_wins, d.first_games);
        const wrS    = pct(d.second_wins, d.second_games);

        return (
          <div key={d.label} className="deck-stat-row">
            <div className="deck-stat-header">
              <div className="deck-stat-name">{d.label}</div>
              <div className="deck-stat-record">
                <StatPill type="win">{d.wins}V</StatPill>
                <StatPill type="loss">{d.losses}D</StatPill>
                <StatPill type="neutral">{total} partida{total !== 1 ? 's' : ''}</StatPill>
              </div>
            </div>
            <div className="deck-bars">
              <DeckBar label="% Victoria"    pct={wr}     color="var(--win)"    fmt={fmtPct(wr)} />
              <DeckBar label="Win yendo 1º"  pct={wrF}    color="var(--win)"    fmt={d.first_games  > 0 ? fmtPct(wrF) : '—'} />
              <DeckBar label="Win yendo 2º"  pct={wrS}    color="var(--win)"    fmt={d.second_games > 0 ? fmtPct(wrS) : '—'} />
              <DeckBar label="Fui 1º turno"  pct={pFirst} color="var(--accent)" fmt={fmtPct(pFirst)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DeckBar({ label, pct: p, color, fmt }) {
  return (
    <div className="deck-bar-row">
      <div className="deck-bar-label">{label}</div>
      <ProgressBar pct={p} color={color} />
      <div className="deck-bar-pct" style={{ color }}>{fmt}</div>
    </div>
  );
}
