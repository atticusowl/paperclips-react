# Universal Paperclips - Phase 1 Projects Analysis

## Overview
This analysis compares Phase 1 projects (pre-space exploration) between the React recreation (`src/store/projectsStore.ts`) and the original game (`~/Projects/paperclips-original/projects.js`).

**Scope:** Projects that appear before "Space Exploration" project that transitions to Phase 2.

---

## ✅ Projects That Match the Original

### AutoClipper Improvements
- **project1**: Improved AutoClippers (750 ops) ✓
  - Trigger: `clipmakerLevel >= 1` ✓
  - Cost: 750 ops ✓  
  - Effect: +25% clipper boost ✓

- **project4**: Even Better AutoClippers (2,500 ops) ✓
  - Trigger: Requires project1 completion ✓
  - Cost: 2,500 ops ✓
  - Effect: +50% clipper boost ✓

- **project5**: Optimized AutoClippers (5,000 ops) ✓
  - Trigger: Requires project4 completion ✓
  - Cost: 5,000 ops ✓
  - Effect: +75% clipper boost ✓

### Core System Projects
- **project3**: Creativity (1,000 ops) ✓
  - Trigger: Operations at max ✓
  - Cost: 1,000 ops ✓
  - Effect: Unlocks creativity generation ✓

- **project6**: Limerick (10 creat) ✓
  - Trigger: Creativity enabled ✓
  - Cost: 10 creativity ✓
  - Effect: +1 Trust ✓

### Wire Improvements  
- **project7**: Improved Wire Extrusion (1,750 ops) ✓
  - Trigger: `wirePurchase >= 1` ✓
  - Cost: 1,750 ops ✓
  - Effect: 50% more wire per spool ✓

- **project8**: Optimized Wire Extrusion (3,500 ops) ✓
  - Trigger: `wireSupply >= 1500` ✓
  - Cost: 3,500 ops ✓
  - Effect: 75% more wire per spool ✓

### Trust/Creativity Projects
- **project13**: Lexical Processing (50 creat) ✓
  - Trigger: `creativity >= 50` ✓
  - Cost: 50 creativity ✓
  - Effect: +1 Trust ✓

- **project14**: Combinatory Harmonics (100 creat) ✓
  - Trigger: `creativity >= 100` ✓
  - Cost: 100 creativity ✓
  - Effect: +1 Trust ✓

- **project15**: The Hadwiger Problem (150 creat) ✓
  - Trigger: `creativity >= 150` ✓
  - Cost: 150 creativity ✓
  - Effect: +1 Trust ✓

- **project17**: The Tóth Sausage Conjecture (200 creat) ✓
  - Trigger: `creativity >= 200` ✓
  - Cost: 200 creativity ✓
  - Effect: +1 Trust ✓

- **project19**: Donkey Space (250 creat) ✓
  - Trigger: `creativity >= 250` ✓
  - Cost: 250 creativity ✓
  - Effect: +1 Trust ✓

### Advanced Projects
- **project16**: Hadwiger Clip Diagrams (6,000 ops) ✓
  - Trigger: Requires Hadwiger Problem completion ✓
  - Cost: 6,000 ops ✓
  - Effect: +500% clipper boost ✓

- **projectComp**: Computational Resources ✓
  - Trigger: `clips >= 2000` ✓
  - Cost: Free ✓
  - Effect: Unlocks processors/memory ✓

- **projectMega**: MegaClippers (12,000 ops) ✓
  - Trigger: `clipmakerLevel >= 75` ✓
  - Cost: 12,000 ops ✓
  - Effect: Unlocks MegaClipper technology ✓

- **projectWireBuyer**: WireBuyer (7,000 ops) ✓
  - Trigger: `wirePurchase >= 15` ✓
  - Cost: 7,000 ops ✓
  - Effect: Auto wire purchasing ✓

- **projectRevSec**: RevTracker (500 ops) ✓
  - Trigger: `projectsFlag === true` ✓
  - Cost: 500 ops ✓
  - Effect: Revenue tracking ✓

- **projectInvest**: Investment Engine (10,000 ops) ⚠️
  - Trigger: `funds >= 10000` vs original `trust >= 8` ⚠️
  - Cost: 10,000 ops ✓
  - Effect: Unlocks investment system ✓

- **projectStrategy**: Strategic Modeling (12,000 ops) ⚠️
  - Trigger: `trust >= 7` vs original requires Donkey Space ⚠️
  - Cost: 12,000 ops ✓
  - Effect: Unlocks tournament system ✓

### Quantum Computing
- **projectQuantum**: Quantum Computing (10,000 ops) ⚠️
  - Trigger: `trust >= 10` vs original `processors >= 5` ⚠️
  - Cost: 10,000 ops ✓
  - Effect: Unlocks quantum chips ✓

- **projectPhotonic1**: Photonic Chip (10,000 ops) ✓
  - Trigger: Quantum Computing enabled ✓
  - Cost: 10,000 ops ✓
  - Effect: First quantum chip ✓

- **projectPhotonic2**: Photonic Chip 2 (15,000 ops) ⚠️
  - Original cost: 10,000 ops (increases by 5,000 each time) ⚠️
  - Cost: 15,000 ops ⚠️

- **projectPhotonic3**: Photonic Chip 3 (20,000 ops) ⚠️
  - Original cost: 15,000 ops ⚠️
  - Cost: 20,000 ops ⚠️

### Marketing
- **project11**: New Slogan (25 creat, 2,500 ops) ✓
  - Trigger: Requires Lexical Processing ✓
  - Cost: 25 creativity + 2,500 ops ✓
  - Effect: 50% marketing boost ✓

- **project12**: Catchy Jingle (45 creat, 4,500 ops) ✓
  - Trigger: Requires Combinatory Harmonics ✓
  - Cost: 45 creativity + 4,500 ops ✓
  - Effect: 2x marketing effectiveness ✓

### AutoTourney
- **projectAutoTourney**: AutoTourney (50,000 ops) ⚠️
  - Trigger: Strategic engine + `yomi >= 100` vs original `creativity >= 50,000` ⚠️
  - Cost: 50,000 ops vs original 50,000 creativity ⚠️
  - Effect: Auto tournament running ✓

---

## ⚠️ Projects With Wrong Triggers/Costs/Effects

### Major Discrepancies

1. **Investment Engine** (lines 834-845 in original)
   - React: Trigger `funds >= 10000`
   - Original: Trigger `trust >= 8`
   - **Issue**: Completely different trigger logic

2. **Strategic Modeling** (lines 727-741 in original)  
   - React: Trigger `trust >= 7`
   - Original: Trigger `project19.flag == 1` (requires Donkey Space)
   - **Issue**: Missing dependency chain

3. **Quantum Computing** (lines 1904-1917 in original)
   - React: Trigger `trust >= 10` 
   - Original: Trigger `processors >= 5`
   - **Issue**: Wrong trigger type

4. **AutoTourney** (lines 1654-1667 in original)
   - React: Costs 50,000 ops, triggers with `yomi >= 100`
   - Original: Costs 50,000 creativity, triggers with `trust >= 90`
   - **Issue**: Wrong cost type and trigger

5. **Photonic Chip Costs** (lines 1929-1948 in original)
   - React: Fixed costs (15,000, 20,000)
   - Original: Variable costs starting at 10,000, increasing by 5,000 each
   - **Issue**: Static vs dynamic pricing

---

## ❌ Missing Phase 1 Projects

### Critical Missing Projects

1. **project2**: Beg for More Wire (1 Trust) - lines 34-50
   - Trigger: `portTotal < wireCost && funds < wireCost && wire < 1 && unsoldClips < 1`
   - Emergency wire acquisition when broke

2. **project9**: Microlattice Shapecasting (7,500 ops) - lines 198-213  
   - Trigger: `wireSupply >= 2600`
   - Effect: 100% more wire per spool
   
3. **project10**: Spectral Froth Annealment (12,000 ops) - lines 215-230
   - Trigger: `wireSupply >= 5000`  
   - Effect: 200% more wire per spool

4. **project10b**: Quantum Foam Annealment (15,000 ops) - lines 232-247
   - Trigger: `wireCost >= 125`
   - Effect: 1,000% more wire per spool

5. **project18**: Tóth Tubule Enfolding (45,000 ops) - lines 404-419
   - Trigger: Requires Tóth Sausage Conjecture + `humanFlag == 0`
   - Effect: Enables building machinery from clips

6. **MegaClipper Improvement Chain**: - lines 847-908
   - **project23**: Improved MegaClippers (14,000 ops)
   - **project24**: Even Better MegaClippers (17,000 ops)  
   - **project25**: Optimized MegaClippers (19,500 ops)

7. **Marketing Advanced Chain**: - lines 1047-1085
   - **project34**: Hypno Harmonics (7,500 ops, 1 Trust)
   - **project70**: HypnoDrones (70,000 ops)
   - **project35**: Release the HypnoDrones (100 Trust)

8. **Late Phase 1 Projects**:
   - **project27**: Coherent Extrapolated Volition (500 creat, 1,000 Yomi, 20,000 ops) - lines 1087-1102
   - **project28**: Cure for Cancer (25,000 ops) - lines 1104-1117  
   - **project29**: World Peace (5,000 yomi, 30,000 ops) - lines 1119-1135
   - **project30**: Global Warming (1,500 yomi, 50,000 ops) - lines 1137-1152
   - **project31**: Male Pattern Baldness (20,000 ops) - lines 1154-1168

9. **Business Projects**:
   - **project37**: Hostile Takeover ($1,000,000) - lines 1221-1236
   - **project38**: Full Monopoly (1,000 yomi, $10,000,000) - lines 1238-1254

10. **Late Manufacturing**:
    - **project41**: Nanoscale Wire Production (35,000 ops) - lines 1170-1183
    - **project43**: Harvester Drones (25,000 ops) - lines 1324-1337
    - **project44**: Wire Drones (25,000 ops) - lines 1339-1352  
    - **project45**: Clip Factories (35,000 ops) - lines 1354-1367

11. **Trust Management**:
    - **project40**: A Token of Goodwill... ($500,000) - lines 1369-1383
    - **project40b**: Another Token of Goodwill... (variable cost) - lines 1385-1405
    - **project219**: Xavier Re-initialization (100,000 creat) - lines 2427-2448

12. **Strategic Projects**: Complete strategy unlock chain - lines 1987-2181
    - **project60**: New Strategy: A100 (15,000 ops)
    - **project61**: New Strategy: B100 (17,500 ops)  
    - **project62**: New Strategy: GREEDY (20,000 ops)
    - **project63**: New Strategy: GENEROUS (22,500 ops)
    - **project64**: New Strategy: MINIMAX (25,000 ops)
    - **project65**: New Strategy: TIT FOR TAT (30,000 ops)
    - **project66**: New Strategy: BEAT LAST (32,500 ops)

---

## Summary Statistics

- **Total Original Phase 1 Projects**: ~47 projects
- **Total React Implementation**: 25 projects  
- **Matching Projects**: ~15 projects (32%)
- **Projects with Issues**: ~6 projects (13%)
- **Missing Projects**: ~26 projects (55%)

## Critical Issues

1. **Incomplete progression chains** - Many upgrade sequences missing their later stages
2. **Wrong trigger logic** - Several projects use different conditions than original
3. **Missing emergency mechanics** - "Beg for More Wire" absent
4. **Incomplete wire improvements** - Missing 3+ major wire upgrades
5. **No business/marketing advanced chain** - Major game progression missing
6. **Strategy system incomplete** - Most strategy types missing
7. **Missing late-phase projects** - Trust management, nanoscale production, etc.

The React recreation covers the basic early game but is missing majority of Phase 1 content, particularly mid and late Phase 1 progression.