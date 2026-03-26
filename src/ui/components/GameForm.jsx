/**
 * UI COMPONENT — GameForm
 * Modal para crear y editar partidas
 */

import React, { useState, useEffect } from 'react';
import { Modal, Field, Button, ToggleGroup, ToggleBtn, AutocompleteInput } from './index.jsx';
import { useAutocomplete } from '../hooks/useAutocomplete.js';

const empty = { oppDeck: '', round: '', first: null, result: null, notes: '' };

export function GameForm({ open, game, torneos, onSave, onClose }) {
  const [form, setForm]   = useState(empty);
  const [errors, setErrors] = useState({});
  const ac = useAutocomplete(torneos);

  useEffect(() => {
    if (open) {
      setForm(game ? { oppDeck: game.oppDeck || '', round: game.round || '', first: game.first, result: game.result, notes: game.notes || '' } : empty);
      setErrors({});
    }
  }, [open, game]);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleSave() {
    const errs = {};
    if (!form.oppDeck.trim()) errs.oppDeck = 'Obligatorio';
    if (!form.first)          errs.first   = 'Indica quién fue primero';
    if (!form.result)         errs.result  = 'Indica el resultado';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ oppDeck: form.oppDeck.trim(), round: form.round.trim(), first: form.first, result: form.result, notes: form.notes.trim() });
  }

  return (
    <Modal open={open} title={game ? 'EDITAR PARTIDA' : 'NUEVA PARTIDA'} onClose={onClose}>
      <Field label="Baraja del Oponente" error={errors.oppDeck}>
        <AutocompleteInput
          value={form.oppDeck}
          onChange={v => { set('oppDeck', v); ac.query(v); }}
          onSelect={v => { set('oppDeck', v); ac.close(); }}
          onFocus={() => ac.query(form.oppDeck)}
          onBlur={() => setTimeout(ac.close, 160)}
          suggestions={ac.suggestions}
          open={ac.open}
          placeholder="Ej: Burn, Midrange Verde..."
        />
      </Field>

      <Field label="Ronda">
        <input type="text" value={form.round} onChange={e => set('round', e.target.value)} placeholder="Ej: Ronda 1, Top 8, Final..." />
      </Field>

      <Field label="¿Quién fue primero?" error={errors.first}>
        <ToggleGroup>
          <ToggleBtn active={form.first === 'yo'}  activeClass="active-first" onClick={() => set('first', 'yo')}>YO PRIMERO</ToggleBtn>
          <ToggleBtn active={form.first === 'opp'} activeClass="active-first" onClick={() => set('first', 'opp')}>OPONENTE 1º</ToggleBtn>
        </ToggleGroup>
      </Field>

      <Field label="Resultado" error={errors.result}>
        <ToggleGroup>
          <ToggleBtn active={form.result === 'win'}  activeClass="active-win"  onClick={() => set('result', 'win')}>VICTORIA</ToggleBtn>
          <ToggleBtn active={form.result === 'draw'} activeClass="active-draw" onClick={() => set('result', 'draw')}>EMPATE</ToggleBtn>
          <ToggleBtn active={form.result === 'loss'} activeClass="active-loss" onClick={() => set('result', 'loss')}>DERROTA</ToggleBtn>
        </ToggleGroup>
      </Field>

      <Field label="Notas (sideboard, jugadas clave...)">
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Opcional..." />
      </Field>

      <div className="modal-actions">
        <Button variant="success" onClick={handleSave}>{game ? 'ACTUALIZAR' : 'GUARDAR'}</Button>
        <Button variant="danger" size="sm" onClick={onClose}>CANCELAR</Button>
      </div>
    </Modal>
  );
}
