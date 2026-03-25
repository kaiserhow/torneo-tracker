/**
 * UI HOOK — useTorneos
 * Conecta casos de uso con el estado React.
 */

import { useState, useCallback } from 'react';
import * as uc from '../../application/torneoUseCases.js';

export function useTorneos() {
  const [torneos, setTorneos] = useState(() => uc.loadTorneos());

  const addTorneo    = useCallback((data)               => setTorneos(t => uc.addTorneo(t, data)),            []);
  const updateTorneo = useCallback((id, data)           => setTorneos(t => uc.updateTorneo(t, id, data)),     []);
  const deleteTorneo = useCallback((id)                 => setTorneos(t => uc.deleteTorneo(t, id)),           []);
  const addGame      = useCallback((torneoId, data)     => setTorneos(t => uc.addGame(t, torneoId, data)),    []);
  const updateGame   = useCallback((tId, gId, data)     => setTorneos(t => uc.updateGame(t, tId, gId, data)),[]);
  const deleteGame   = useCallback((torneoId, gameId)   => setTorneos(t => uc.deleteGame(t, torneoId, gameId)),[]);

  return { torneos, addTorneo, updateTorneo, deleteTorneo, addGame, updateGame, deleteGame };
}
