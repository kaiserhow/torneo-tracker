/**
 * UI VIEW — DetalleView
 * Vista de detalle de un torneo con partidas y stats
 */

import React, { useState } from 'react';
import {
  BackButton, Button, Tabs, StatCard, StatPill,
  EmptyState, ConfirmModal,
} from '../components/index.jsx';
import { GameForm }        from '../components/GameForm.jsx';
import { DeckStatsPanel }  from '../components/DeckStatsPanel.jsx';
import { calcStats, groupGamesByRound, fmtPct } from '../../domain/stats.js';

function fmtDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

const TABS = [
  { id: 'partidas', label: 'PARTIDAS' },
  { id: 'barajas',  label: 'VS. BARAJAS' },
];

export function DetalleView({ torneo, torneos, onBack, onAddGame, onUpdateGame, onDeleteGame, onEditTorneo }) {
  const [tab,       setTab]       = useState('partidas');
  const [showForm,  setShowForm]  = useState(false);
  const [editGame,  setEditGame]  = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [openNotes, setOpenNotes] = useState({});

  const stats = calcStats(torneo.games);
  const meta  = [torneo.date ? `📅 ${fmtDate(torneo.date)}` : '', torneo.deck ? `🃏 ${torneo.deck}` : ''].filter(Boolean).join(' · ');

  function handleSaveGame(data) {
    if (editGame) onUpdateGame(torneo.id, editGame.id, data);
    else          onAddGame(torneo.id, data);
    setShowForm(false);
    setEditGame(null);
  }

  function toggleNote(id) {
    setOpenNotes(n => ({ ...n, [id]: !n[id] }));
  }

  const roundGroups = groupGamesByRound(torneo.games);

  return (
    <div>
      <BackButton onClick={onBack}>← VOLVER A TORNEOS</BackButton>

      <div className="detail-header">
        <div>
          <div className="detail-title">{torneo.name}</div>
          {meta && <div className="detail-date">{meta}</div>}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="muted" size="sm" onClick={onEditTorneo}>✏️ EDITAR</Button>
          <Button size="sm" onClick={() => { setEditGame(null); setShowForm(true); }}>+ PARTIDA</Button>
        </div>
      </div>

      {/* Stats panel */}
      <div className="stats-panel">
        <StatCard label="Victorias"    value={stats.wins}            valueClass="win"     bar={stats.wr}     barClass="fill-win" />
        <StatCard label="Derrotas"     value={stats.losses}          valueClass="loss" />
        <StatCard label="% Victoria"   value={fmtPct(stats.wr)}      valueClass="neutral" />
        <StatCard label="Fui 1º turno" value={fmtPct(stats.pFirst)}  valueClass="neutral" bar={stats.pFirst} barClass="fill-accent" />
        <StatCard label="Win yendo 1º" value={fmtPct(stats.wrFirst)} valueClass="win" />
        <StatCard label="Win yendo 2º" value={fmtPct(stats.wrSecond)}valueClass="win" />
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'partidas' && (
        torneo.games.length === 0
          ? <EmptyState icon="⚔️" text="SIN PARTIDAS — AÑADE LA PRIMERA" />
          : Object.entries(roundGroups).map(([rnd, games]) => {
              const rWins  = games.filter(g => g.result === 'win').length;
              const rLoss  = games.filter(g => g.result === 'loss').length;
              return (
                <div key={rnd} className="round-group">
                  <div className="round-header">
                    {rnd}
                    <span className="round-badge">{rWins}V {rLoss}D</span>
                  </div>
                  <div className="games-list">
                    {games.map(g => (
                      <div key={g.id}>
                        <div className="game-row" onClick={() => toggleNote(g.id)}>
                          <div className={`game-result-dot ${g.result === 'win' ? 'dot-win' : 'dot-loss'}`} />
                          <div>
                            <div className="game-deck-name">{g.oppDeck}</div>
                            {g.notes && <div className="game-note-preview">📝 {g.notes}</div>}
                          </div>
                          <span className={`badge ${g.first === 'yo' ? 'badge-first' : 'badge-second'}`}>
                            {g.first === 'yo' ? '1º YO' : '2º YO'}
                          </span>
                          <span className={`game-result-text ${g.result === 'win' ? 'text-win' : 'text-loss'}`}>
                            {g.result === 'win' ? 'VICTORIA' : 'DERROTA'}
                          </span>
                          <button className="game-delete" onClick={e => { e.stopPropagation(); setConfirmId(g.id); }}>✕</button>
                        </div>
                        <div className={`game-note-full${openNotes[g.id] ? ' open' : ''}`}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                            <div>
                              {g.notes
                                ? <span>{g.notes}</span>
                                : <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: 11 }}>Sin notas</span>
                              }
                            </div>
                            <Button variant="muted" size="sm" onClick={e => { e.stopPropagation(); setEditGame(g); setShowForm(true); }}>EDITAR</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
      )}

      {tab === 'barajas' && <DeckStatsPanel games={torneo.games} />}

      <GameForm
        open={showForm}
        game={editGame}
        torneos={torneos}
        onSave={handleSaveGame}
        onClose={() => { setShowForm(false); setEditGame(null); }}
      />

      <ConfirmModal
        open={!!confirmId}
        message="¿Eliminar esta partida?"
        onConfirm={() => { onDeleteGame(torneo.id, confirmId); setConfirmId(null); }}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
