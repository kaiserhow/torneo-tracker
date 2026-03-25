/**
 * UI COMPONENT — ComparePanel
 * Comparativa lado a lado de dos barajas
 */

import React, { useState } from 'react';
import { buildDeckMap, pct, fmtPct } from '../../domain/stats.js';
import { EmptyState } from './index.jsx';

export function ComparePanel({ games }) {
  const [deckA, setDeckA] = useState('');
  const [deckB, setDeckB] = useState('');

  const deckMap  = buildDeckMap(games);
  const options  = Object.values(deckMap).sort((a, b) => (b.wins + b.losses) - (a.wins + a.losses));

  const da = deckMap[deckA];
  const db = deckMap[deckB];
  const canCompare = deckA && deckB && deckA !== deckB && da && db;

  const wrA = da ? (pct(da.wins, da.wins + da.losses) || 0) : 0;
  const wrB = db ? (pct(db.wins, db.wins + db.losses) || 0) : 0;

  return (
    <div>
      <div className="compare-selects">
        <div className="field" style={{ margin: 0 }}>
          <label>Baraja A</label>
          <select value={deckA} onChange={e => setDeckA(e.target.value)}>
            <option value="">— Selecciona —</option>
            {options.map(d => <option key={d.label} value={d.label.toLowerCase()}>{d.label}</option>)}
          </select>
        </div>
        <div className="vs-divider">VS</div>
        <div className="field" style={{ margin: 0 }}>
          <label>Baraja B</label>
          <select value={deckB} onChange={e => setDeckB(e.target.value)}>
            <option value="">— Selecciona —</option>
            {options.map(d => <option key={d.label} value={d.label.toLowerCase()}>{d.label}</option>)}
          </select>
        </div>
      </div>

      {!canCompare
        ? <EmptyState icon="⚖️" text="SELECCIONA DOS BARAJAS DIFERENTES PARA COMPARAR" />
        : (
          <div className="compare-panel">
            <CompareCard deck={da} isWinner={wrA > wrB} />
            <CompareCard deck={db} isWinner={wrB > wrA} />
          </div>
        )
      }
    </div>
  );
}

function CompareCard({ deck: d, isWinner }) {
  const total  = d.wins + d.losses;
  const wr     = pct(d.wins, total);
  const wrF    = pct(d.first_wins, d.first_games);
  const wrS    = pct(d.second_wins, d.second_games);
  const pFirst = pct(d.first_games, total);

  return (
    <div className={`compare-card${isWinner ? ' compare-winner' : ''}`}>
      <div className="compare-deck-name">{d.label}{isWinner ? ' 🏆' : ''}</div>
      <Row label="Partidas"          val={total}          color="var(--accent)" />
      <Row label="% Victoria"        val={fmtPct(wr)}     color={wr >= 50 ? 'var(--win)' : 'var(--loss)'} />
      <Row label="V / D"             val={`${d.wins}V · ${d.losses}D`} color="var(--text)" size={16} />
      <Row label="Win yendo 1º"      val={d.first_games  > 0 ? fmtPct(wrF) : '—'} color="var(--win)" />
      <Row label="Win yendo 2º"      val={d.second_games > 0 ? fmtPct(wrS) : '—'} color="var(--win)" />
      <Row label="Fui 1º turno"      val={fmtPct(pFirst)} color="var(--accent)" />
    </div>
  );
}

function Row({ label, val, color, size = 22 }) {
  return (
    <div className="compare-stat-row">
      <span className="compare-stat-label">{label}</span>
      <span className="compare-stat-val" style={{ color, fontSize: size }}>{val}</span>
    </div>
  );
}
