/**
 * APP — Componente raíz
 * Gestiona la navegación entre vistas y conecta el hook principal
 */

import React, { useState } from 'react';
import { useTorneos }     from './ui/hooks/useTorneos.js';
import { TorneosView }    from './ui/views/TorneosView.jsx';
import { DetalleView }    from './ui/views/DetalleView.jsx';
import { GlobalView }     from './ui/views/GlobalView.jsx';
import { TorneoForm }     from './ui/components/TorneoForm.jsx';

export default function App() {
  const { torneos, addTorneo, updateTorneo, deleteTorneo, addGame, updateGame, deleteGame } = useTorneos();

  // Navegación simple: 'list' | 'detalle' | 'global'
  const [view,       setView]       = useState('list');
  const [currentId,  setCurrentId]  = useState(null);
  const [editTorneo, setEditTorneo] = useState(null);
  const [showEdit,   setShowEdit]   = useState(false);

  const currentTorneo = torneos.find(t => t.id === currentId);

  function openTorneo(id) {
    setCurrentId(id);
    setView('detalle');
  }

  function handleEditTorneo() {
    setEditTorneo(currentTorneo);
    setShowEdit(true);
  }

  function handleSaveEditTorneo(data) {
    updateTorneo(editTorneo.id, data);
    setShowEdit(false);
    setEditTorneo(null);
  }

  return (
    <div className="app">
      <header>
        <div>
          <div className="logo">TORNEO<span>TRACK</span></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="header-sub">Registro de partidas</div>
        </div>
      </header>

      {view === 'list' && (
        <TorneosView
          torneos={torneos}
          onOpen={openTorneo}
          onAdd={addTorneo}
          onUpdate={updateTorneo}
          onDelete={deleteTorneo}
          onGoGlobal={() => setView('global')}
        />
      )}

      {view === 'detalle' && currentTorneo && (
        <>
          <DetalleView
            torneo={currentTorneo}
            torneos={torneos}
            onBack={() => setView('list')}
            onAddGame={addGame}
            onUpdateGame={updateGame}
            onDeleteGame={deleteGame}
            onEditTorneo={handleEditTorneo}
          />
          <TorneoForm
            open={showEdit}
            torneo={editTorneo}
            onSave={handleSaveEditTorneo}
            onClose={() => { setShowEdit(false); setEditTorneo(null); }}
          />
        </>
      )}

      {view === 'global' && (
        <GlobalView
          torneos={torneos}
          onBack={() => setView('list')}
        />
      )}
    </div>
  );
}
