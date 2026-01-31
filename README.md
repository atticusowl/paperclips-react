# Universal Paperclips - React Edition

A modern React + TypeScript conversion of the classic incremental game [Universal Paperclips](https://www.decisionproblem.com/paperclips/) by Frank Lantz.

## Features

- **Modern React Stack**: Built with Vite, React 18, TypeScript, and Zustand for state management
- **Faithful Recreation**: Core mechanics preserved from the original game
- **Persistent Save**: Game state automatically saves to localStorage
- **Responsive Design**: Works on desktop and mobile devices

## Game Phases Implemented

### Phase 1: Manual Paperclips
- Click to make paperclips
- Buy wire, set prices, manage inventory
- Marketing to increase demand

### Phase 2: Automation
- AutoClippers for passive clip production
- MegaClippers (unlock via projects)
- WireBuyer for automatic wire purchasing

### Phase 3: Computational Resources
- Processors and Memory allocation
- Operations for executing projects
- Creativity generation at max ops
- Quantum Computing (photonic chips)

### Phase 4: Projects
- Research projects that unlock new features
- Trust-gaining mathematical proofs
- Efficiency upgrades for clippers and wire

### Phase 5: Strategic Modeling
- Tournament system for yomi generation
- Multiple strategies to choose from
- AutoTourney for passive yomi

### Phase 6: Investments
- Deposit funds for returns
- Multiple risk levels
- Upgradeable investment engine

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management with persistence
- **CSS** - Styling (no frameworks)

## Architecture

```
src/
├── components/     # React components
├── hooks/          # Custom hooks (game loop)
├── store/          # Zustand stores
│   ├── gameStore.ts     # Main game state
│   └── projectsStore.ts # Projects system
├── types/          # TypeScript interfaces
└── utils/          # Formatting utilities
```

## Original Game

The original Universal Paperclips was created by Frank Lantz and released in 2017. This React version aims to faithfully recreate the gameplay while modernizing the codebase.

## Status

This is a work-in-progress conversion. Currently implemented:
- [x] Core paperclip making and selling
- [x] Wire purchasing and management
- [x] AutoClippers and MegaClippers
- [x] Computational resources (processors, memory, operations)
- [x] Creativity system
- [x] Projects system (~20 core projects)
- [x] Strategic Modeling / Tournaments with yomi
- [x] Investment Engine
- [x] Quantum Computing with photonic chips
- [x] Save/Load (automatic via localStorage)
- [x] Clips per second display
- [x] WireBuyer automation
- [ ] Space exploration phase
- [ ] Probe design and management
- [ ] Combat system
- [ ] Swarm computing
- [ ] Power management
- [ ] End game sequence

**Playable from start through the mid-game automation phase.**

## License

This is a fan recreation for educational purposes.
