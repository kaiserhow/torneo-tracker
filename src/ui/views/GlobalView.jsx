/**
 * UI VIEW — GlobalView
 * Historial global con filtro por mi baraja y comparativa
 */

import React, { useState } from 'react';
import { BackButton, StatCard, Tabs, EmptyState } from '../components/index.jsx';
import { DeckStatsPanel } from '../components/DeckStatsPanel.jsx';
import { ComparePanel }   from '../components/ComparePanel.jsx';
import { calcStats, getMyDeckList, fmtPct } from '../../domain/stats.js';

const TABS = [
  { id: 'rendimiento', label: 'VS. BARAJAS' },
  { id: 'comparar',    label: 'COMPARAR BARAJAS' },
];

export function GlobalView({ torneos, onBack }) {
  const [tab,    setTab]    = useState('rendimiento');
  const [filter, setFilter] = useState(null);

  const myDecks = getMyDeckList(torneos);

  const filtered = filter === null
    ? torneos
    : torneos.filter(t => t.deck?.trim().toLowerCase() === filter);

  const allGames = filtered.flatMap(t => t.games);
  const stats    = calcStats(allGames);

  const subtitle = filter === null
    ? 'Todos los torneos combinados'
    : `Filtrando: ${myDecks.find(d => d.label.toLowerCase() === filter)?.label || filter} · ${filtered.length} torneo${filtered.length !== 1 ? 's' : ''}`;

  return (
    <div>
      <BackButton onClick={onBack}>← VOLVER A TORNEOS</BackButton>

      <div style={{ marginBottom: 24 }}>
        <div className="detail-title">HISTORIAL GLOBAL</div>
        <div className="detail-date">{subtitle}</div>
      </div>

      {/* Filtros por mi baraja */}
      {myDecks.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>
            Filtrar por mi baraja
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button
              className={`filter-chip all-chip${filter === null ? ' active' : ''}`}
              onClick={() => setFilter(null)}
            >
              TODOS
            </button>
            {myDecks.map(d => (
              <button
                key={d.label}
                className={`filter-chip${filter === d.label.toLowerCase() ? ' active' : ''}`}
                onClick={() => setFilter(d.label.toLowerCase())}
              >
                🃏 {d.label} <span style={{ opacity: .5, fontSize: 10 }}>{d.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats panel */}
      <div className="stats-panel">
        <StatCard label="Torneos"      value={filtered.length}        valueClass="neutral" />
        <StatCard label="Partidas"     value={stats.total}            valueClass="neutral" />
        <StatCard label="Victorias"    value={stats.wins}             valueClass="win"     bar={stats.wr} barClass="fill-win" />
        <StatCard label="Empates"      value={stats.draws}            valueClass="draw" />
        <StatCard label="Derrotas"     value={stats.losses}           valueClass="loss" />
        <StatCard label="% Victoria"   value={fmtPct(stats.wr)}       valueClass="neutral" />
        <StatCard label="Win yendo 1º" value={fmtPct(stats.wrFirst)}  valueClass="win" />
        <StatCard label="Win yendo 2º" value={fmtPct(stats.wrSecond)} valueClass="win" />
        <StatCard label="Fui 1º turno" value={fmtPct(stats.pFirst)}   valueClass="neutral" />
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'rendimiento' && (
        allGames.length === 0
          ? <EmptyState icon="🃏" text="SIN DATOS GLOBALES AÚN" />
          : <DeckStatsPanel games={allGames} />
      )}

      {tab === 'comparar' && <ComparePanel games={allGames} />}
    </div>
  );
}
