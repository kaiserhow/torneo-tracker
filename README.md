# 🃏 TorneoTrack

Aplicación para registrar partidas de juegos de cartas por torneos, con estadísticas detalladas de winrate, análisis por baraja rival y comparativas.

---

## 🏗️ Arquitectura Hexagonal

```
src/
├── domain/                     # Lógica pura de negocio (sin dependencias)
│   ├── Torneo.js               # Entidades: createTorneo, createGame
│   └── stats.js                # Cálculos puros: calcStats, buildDeckMap...
│
├── application/                # Casos de uso (orquestan dominio + infra)
│   └── torneoUseCases.js       # addTorneo, deleteGame, updateGame...
│
├── infrastructure/             # Adaptadores externos
│   └── torneoRepository.js     # Persistencia en localStorage
│
└── ui/                         # Capa de presentación (React)
    ├── hooks/
    │   ├── useTorneos.js        # Estado global → conecta casos de uso con React
    │   └── useAutocomplete.js   # Lógica de autocompletado
    ├── components/
    │   ├── index.jsx            # Componentes reutilizables (Button, Modal, Field...)
    │   ├── TorneoForm.jsx       # Modal crear/editar torneo
    │   ├── GameForm.jsx         # Modal crear/editar partida
    │   ├── DeckStatsPanel.jsx   # Estadísticas por baraja rival
    │   └── ComparePanel.jsx     # Comparativa entre dos barajas
    ├── views/
    │   ├── TorneosView.jsx      # Pantalla principal (lista de torneos)
    │   ├── DetalleView.jsx      # Detalle de un torneo con partidas
    │   └── GlobalView.jsx       # Historial global con filtros
    └── styles/
        ├── main.css             # Variables CSS, body, layout base
        └── components.css       # Estilos de todos los componentes + responsive
```

### Principios aplicados

- **Domain** no importa nada de React ni de infraestructura
- **Application** solo conoce domain e infrastructure, nunca UI
- **Infrastructure** es el único lugar que toca `localStorage`
- **UI** solo llama a casos de uso a través del hook `useTorneos`
- Cada capa es **testeable de forma independiente**

---

## 🚀 Instalación y uso

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo
npm run dev

# 3. Build para producción
npm run build

# 4. Preview del build
npm run preview
```

---

## 🌐 Despliegue en GitHub Pages

```bash
# 1. Build
npm run build

# 2. Sube la carpeta /dist a tu repositorio
# 3. En GitHub → Settings → Pages → selecciona la rama/carpeta dist
```

O con el paquete `gh-pages`:

```bash
npm install -D gh-pages
# Añade en package.json: "deploy": "gh-pages -d dist"
npm run build && npm run deploy
```

---

## ✨ Funcionalidades

- Crear y editar torneos (nombre, fecha, tu baraja)
- Registrar partidas con baraja rival, ronda, turno y resultado
- Notas por partida (sideboard, jugadas clave...)
- Autocompletado de barajas usadas anteriormente
- Stats por torneo: WR global, WR yendo 1º/2º turno
- Agrupación de partidas por ronda
- Vista "VS. Barajas": rendimiento contra cada baraja rival
- Historial Global con filtro por tu baraja
- Comparativa lado a lado entre dos barajas rivales
- Responsive para móvil
- Datos persistidos en `localStorage`
