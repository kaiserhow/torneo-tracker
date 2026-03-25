/**
 * UI COMPONENT — TorneoForm
 * Modal para crear y editar torneos
 */

import React, { useState, useEffect } from 'react';
import { Modal, Field, Button } from './index.jsx';

const empty = { name: '', date: '', deck: '' };

export function TorneoForm({ open, torneo, onSave, onClose }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(torneo ? { name: torneo.name, date: torneo.date || '', deck: torneo.deck || '' } : { ...empty, date: new Date().toISOString().split('T')[0] });
      setError('');
    }
  }, [open, torneo]);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleSave() {
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    onSave({ name: form.name.trim(), date: form.date, deck: form.deck.trim() });
  }

  return (
    <Modal open={open} title={torneo ? 'EDITAR TORNEO' : 'NUEVO TORNEO'} onClose={onClose}>
      <Field label="Nombre del Torneo" error={error}>
        <input
          type="text"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="Regional Barcelona, FNM..."
          style={error ? { borderColor: 'var(--danger)' } : {}}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />
      </Field>
      <Field label="Fecha">
        <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
      </Field>
      <Field label="Tu Baraja">
        <input type="text" value={form.deck} onChange={e => set('deck', e.target.value)} placeholder="Ej: Dragons, Control Azul..." />
      </Field>
      <div className="modal-actions">
        <Button onClick={handleSave}>{torneo ? 'GUARDAR' : 'CREAR'}</Button>
        <Button variant="danger" size="sm" onClick={onClose}>CANCELAR</Button>
      </div>
    </Modal>
  );
}
