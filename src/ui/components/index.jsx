/**
 * UI COMPONENTS — Componentes reutilizables
 */

import React, { useEffect } from 'react';

// ── Button ────────────────────────────────────────────────
export function Button({ children, variant = 'default', size = 'md', onClick, type = 'button', style }) {
  const cls = ['btn', variant !== 'default' ? `btn-${variant}` : '', size === 'sm' ? 'btn-sm' : ''].filter(Boolean).join(' ');
  return <button className={cls} type={type} onClick={onClick} style={style}>{children}</button>;
}

// ── IconButton ────────────────────────────────────────────
export function IconButton({ children, danger, onClick, title }) {
  return (
    <button className={`icon-btn${danger ? ' del' : ''}`} onClick={onClick} title={title}>
      {children}
    </button>
  );
}

// ── StatPill ──────────────────────────────────────────────
export function StatPill({ children, type = 'neutral' }) {
  return <span className={`stat-pill pill-${type}`}>{children}</span>;
}

// ── StatCard ──────────────────────────────────────────────
export function StatCard({ label, value, valueClass = 'neutral', bar, barClass = 'fill-win' }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${valueClass}`}>{value}</div>
      {bar !== undefined && (
        <div className="progress-wrap">
          <div className="progress-bar">
            <div className={`progress-fill ${barClass}`} style={{ width: `${bar || 0}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── ProgressBar ───────────────────────────────────────────
export function ProgressBar({ pct, color = 'var(--win)' }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${pct || 0}%`, background: color }} />
    </div>
  );
}

// ── ToggleButton ──────────────────────────────────────────
export function ToggleGroup({ children }) {
  return <div className="toggle-group">{children}</div>;
}

export function ToggleBtn({ children, active, activeClass, onClick }) {
  return (
    <button
      type="button"
      className={`toggle-btn${active ? ` ${activeClass}` : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ── Field ─────────────────────────────────────────────────
export function Field({ label, error, children }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {error && <span style={{ fontSize: 10, color: 'var(--danger)', marginTop: 4, display: 'block' }}>{error}</span>}
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`tab${active === t.id ? ' active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── BackButton ────────────────────────────────────────────
export function BackButton({ onClick, children }) {
  return (
    <button className="back-btn" onClick={onClick}>
      {children}
    </button>
  );
}

// ── EmptyState ────────────────────────────────────────────
export function EmptyState({ icon, text }) {
  return (
    <div className="empty-state">
      <div className="icon">{icon}</div>
      <p>{text}</p>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────
export function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

// ── ConfirmModal ──────────────────────────────────────────
export function ConfirmModal({ open, message, onConfirm, onCancel }) {
  return (
    <Modal open={open} title="CONFIRMAR" onClose={onCancel}>
      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 24 }}>{message}</p>
      <div className="modal-actions">
        <Button variant="danger" onClick={onConfirm}>ELIMINAR</Button>
        <Button variant="muted" size="sm" onClick={onCancel}>CANCELAR</Button>
      </div>
    </Modal>
  );
}

// ── Autocomplete ──────────────────────────────────────────
export function AutocompleteInput({ value, onChange, onSelect, suggestions, open, onFocus, onBlur, placeholder }) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <div className="autocomplete-list">
          {suggestions.map(s => (
            <div
              key={s.label}
              className="autocomplete-item"
              onMouseDown={e => { e.preventDefault(); onSelect(s.label); }}
            >
              <span>{s.label}</span>
              <span className="autocomplete-count">{s.count}×</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
