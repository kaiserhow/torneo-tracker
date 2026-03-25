/**
 * UI VIEW — TorneosView
 * Pantalla principal con listado de torneos
 */

import React, { useState } from 'react';
import { Button, IconButton, StatPill, ConfirmModal, EmptyState } from '../components/index.jsx';
import { TorneoForm } from '../components/TorneoForm.jsx';

function fmtDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

export function TorneosView({ torneos, onOpen, onAdd, onUpdate, onDelete, onGoGlobal }) {
  const [showForm,    setShowForm]    = useState(false);
  const [editTorneo,  setEditTorneo]  = useState(null);
  const [confirmId,   setConfirmId]   = useState(null);

  function handleSave(data) {
    if (editTorneo) { onUpdate(editTorneo.id, data); setEditTorneo(null); }
    else            { onAdd(data); }
    setShowForm(false);
  }

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="section-title">MIS TORNEOS</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="muted" size="sm" onClick={onGoGlobal}>📊 GLOBAL</Button>
          <Button onClick={() => { setEditTorneo(null); setShowForm(true); }}>+ NUEVO TORNEO</Button>
        </div>
      </div>

      {/* Grid */}
      {torneos.length === 0
        ? <EmptyState icon="🃏" text="SIN TORNEOS AÚN — CREA UNO PARA EMPEZAR" />
        : (
          <div className="torneos-grid">
            {[...torneos].reverse().map(t => {
              const wins   = t.games.filter(g => g.result === 'win').length;
              const losses = t.games.filter(g => g.result === 'loss').length;
              const total  = wins + losses;
              const wr     = total > 0 ? Math.round((wins / total) * 100) : null;
              return (
                <div key={t.id} className="torneo-card" onClick={() => onOpen(t.id)}>
                  <div className="card-actions">
                    <IconButton title="Editar" onClick={e => { e.stopPropagation(); setEditTorneo(t); setShowForm(true); }}>✏️</IconButton>
                    <IconButton danger title="Eliminar" onClick={e => { e.stopPropagation(); setConfirmId(t.id); }}>✕</IconButton>
                  </div>
                  <div className="torneo-name">{t.name}</div>
                  <div className="torneo-meta">
                    {t.date && <span>📅 {fmtDate(t.date)}</span>}
                    {t.deck && <span>🃏 {t.deck}</span>}
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <StatPill type="win">{wins}V</StatPill>
                    <StatPill type="loss">{losses}D</StatPill>
                    <StatPill type="neutral">{wr !== null ? `${wr}% WR` : 'SIN PARTIDAS'}</StatPill>
                  </div>
                </div>
              );
            })}
          </div>
        )
      }

      <TorneoForm open={showForm} torneo={editTorneo} onSave={handleSave} onClose={() => setShowForm(false)} />

      <ConfirmModal
        open={!!confirmId}
        message={`¿Eliminar "${torneos.find(t => t.id === confirmId)?.name}" y todas sus partidas?`}
        onConfirm={() => { onDelete(confirmId); setConfirmId(null); }}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
