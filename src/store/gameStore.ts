import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  GameState,
  QChip,
  Strategy,
  PayoffGrid
} from '../types/game';

// Strategy helper functions
const findBiggestPayoff = (payoffGrid: PayoffGrid): number => {
  const values = [payoffGrid.valueAA, payoffGrid.valueAB, payoffGrid.valueBA, payoffGrid.valueBB];
  const max = Math.max(...values);
  return values.indexOf(max) + 1;
};

const whatBeatsLast = (currentPos: number, hMovePrev?: number, vMovePrev?: number): number => {
  const lastMove = currentPos === 1 ? vMovePrev : hMovePrev;
  return lastMove === 1 ? 2 : 1;
};

// Tournament Strategies
const stratRandom: Strategy = {
  name: "RANDOM",
  active: 1,
  currentScore: 0,
  currentPos: 1,
  pickMove: () => {
    const r = Math.random();
    return r < 0.5 ? 1 : 2;
  }
};

const stratA100: Strategy = {
  name: "A100",
  active: 0,
  currentScore: 0,
  currentPos: 1,
  pickMove: () => 1
};

const stratB100: Strategy = {
  name: "B100",
  active: 0,
  currentScore: 0,
  currentPos: 1,
  pickMove: () => 2
};

const stratGreedy: Strategy = {
  name: "GREEDY",
  active: 0,
  currentScore: 0,
  currentPos: 1,
  pickMove: (payoffGrid = { valueAA: 5, valueAB: 5, valueBA: 5, valueBB: 5 }) => {
    const x = findBiggestPayoff(payoffGrid);
    return x < 3 ? 1 : 2;
  }
};

const stratGenerous: Strategy = {
  name: "GENEROUS",
  active: 0,
  currentScore: 0,
  currentPos: 1,
  pickMove: (payoffGrid = { valueAA: 5, valueAB: 5, valueBA: 5, valueBB: 5 }) => {
    const x = findBiggestPayoff(payoffGrid);
    return (x === 1 || x === 3) ? 1 : 2;
  }
};

const stratTitForTat: Strategy = {
  name: "TIT FOR TAT",
  active: 0,
  currentScore: 0,
  currentPos: 1,
  pickMove: (_payoffGrid, hMovePrev, vMovePrev) => {
    if (stratTitForTat.currentPos === 1) {
      return vMovePrev || 1;
    } else {
      return hMovePrev || 1;
    }
  }
};

const stratBeatLast: Strategy = {
  name: "BEAT LAST",
  active: 0,
  currentScore: 0,
  currentPos: 1,
  pickMove: (_payoffGrid, hMovePrev, vMovePrev) => {
    return whatBeatsLast(stratBeatLast.currentPos, hMovePrev, vMovePrev);
  }
};

// All strategies array
const allStrats = [stratRandom, stratA100, stratB100, stratGreedy, stratGenerous, stratTitForTat, stratBeatLast];

// Active strategies (initially just RANDOM)
const createStrats = (): Strategy[] => {
  return [{ ...stratRandom }];
};

// Initial Q-Chips setup
const createQChips = (): QChip[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    waveSeed: (i + 1) * 0.1,
    value: 0,
    active: false,
  }));
};

const initialState: GameState = {
  ticks: 0,
  
  business: {
    funds: 0,
    margin: 0.25,
    demand: 5,
    marketing: 1,
    marketingLvl: 1,
    marketingEffectiveness: 1,
    adCost: 100,
    unsoldClips: 0,
    clipsSold: 0,
    avgRev: 0,
    avgSales: 0,
    income: 0,
    incomeTracker: [0],  // Stores deltas (income per second)
    lastIncomeReading: 0, // Previous cumulative income
    demandBoost: 1,
    secTimer: 0,  // Timer for revenue calculation
  },
  
  manufacturing: {
    clips: 0,
    unusedClips: 0,
    clipRate: 0,
    wire: 1000,
    wireCost: 20,
    wireBasePrice: 20,
    wireSupply: 1000,
    wirePurchase: 0,
    wirePriceCounter: 0,  // Counter for sine wave
    wirePriceTimer: 0,    // Timer for base price decay
    wireBuyerFlag: false,
    wireBuyerStatus: true,
    clipmakerLevel: 0,
    clipperCost: 5,
    clipperBoost: 1,
    megaClipperLevel: 0,
    megaClipperCost: 500,
    megaClipperBoost: 1,
  },
  
  computing: {
    processors: 1,
    memory: 1,
    operations: 0,
    maxOps: 1000,
    trust: 2,
    nextTrust: 3000,
    creativity: 0,
    creativityOn: false,
    creativitySpeed: 1,
    creativityCounter: 0,
    standardOps: 0,
    tempOps: 0,
    fib1: 2,
    fib2: 3,
    qFlag: false,
    qChips: createQChips(),
    qClock: 0,
  },
  
  strategic: {
    yomi: 0,
    stratPicked: 10,
    tourneyInProg: false,
    tourneyCost: 1000,
    autoTourneyFlag: false,
    autoTourneyStatus: true,
    resultsFlag: false,
    currentRound: 0,
    rounds: 0,
    payoffGrid: {
      valueAA: 0,
      valueAB: 0,
      valueBA: 0,
      valueBB: 0,
    },
    hMove: 0,
    vMove: 0,
    hMovePrev: 0,
    vMovePrev: 0,
    rCounter: 0,
    stratCounter: 0,
    h: 0,
    v: 0,
    hStrat: null as Strategy | null,
    vStrat: null as Strategy | null,
    strats: createStrats(),
    tourneyResults: [] as Strategy[],
    winnerPtr: 0,
    high: 0,
    placeScore: 0,
    showScore: 0,
    yomiBoost: 1,
  },
  
  investment: {
    investmentEngineFlag: false,
    investmentLevel: 1,
    bankroll: 0,
    secValue: 0,
    portTotal: 0,
    stocks: [],
    investStrat: 'low',
  },
  
  space: {
    spaceFlag: false,
    availableMatter: Math.pow(10, 24) * 6000,
    acquiredMatter: 0,
    totalMatter: Math.pow(10, 54) * 30,
    foundMatter: Math.pow(10, 24) * 6000,
    factoryLevel: 0,
    factoryCost: 100000000,
    factoryBoost: 1,
    harvesterLevel: 0,
    harvesterCost: 1000000,
    wireDroneLevel: 0,
    wireDroneCost: 1000000,
    droneBoost: 1,
    farmLevel: 0,
    farmCost: 10000000,
    batteryLevel: 0,
    batteryCost: 1000000,
    storedPower: 0,
    maxStorage: 10000,
    powMod: 0,
    probeCount: 0,
    probeLaunchLevel: 0,
    probeCost: Math.pow(10, 20),
    probeDescendents: 0,
    probesLostHaz: 0,
    probesLostDrift: 0,
    probesLostCombat: 0,
    probeSpeed: 1,
    probeNav: 1,
    probeRep: 1,
    probeHaz: 1,
    probeFac: 1,
    probeHarv: 1,
    probeWire: 1,
    probeCombat: 0,
    probeTrust: 10,
    probeTrustUsed: 8,
    maxTrust: 20,
  },
  
  swarm: {
    swarmFlag: false,
    swarmGifts: 0,
    swarmStatus: 7,
    sliderPos: 0,
    giftCountdown: 125000,
  },
  
  combat: {
    battleFlag: false,
    honor: 0,
    drifterCount: 0,
    driftersKilled: 0,
  },
  
  flags: {
    humanFlag: true,
    compFlag: false,
    projectsFlag: false,
    autoClipperFlag: false,
    megaClipperFlag: false,
    revPerSecFlag: false,
    investmentEngineFlag: false,
    strategyEngineFlag: false,
    stratA100Flag: false,
    stratB100Flag: false,
    stratGreedyFlag: false,
    stratGenerousFlag: false,
    stratTitForTatFlag: false,
    stratBeatLastFlag: false,
    wireProductionFlag: false,
    creationFlag: false,
    tothFlag: false,
    milestoneFlag: 0,
  },
  
  prestige: {
    prestigeU: 0,
    prestigeS: 0,
  },
  
  messages: [{ id: 0, text: 'Welcome to Universal Paperclips', timestamp: Date.now() }],
  activeProjects: [],
};

interface GameActions {
  // Core actions
  tick: () => void;
  slowTick: () => void;
  reset: () => void;
  
  // Manufacturing
  makeClip: (amount?: number) => void;
  buyWire: () => void;
  toggleWireBuyer: () => void;
  makeClipper: () => void;
  makeMegaClipper: () => void;
  
  // Business
  raisePrice: () => void;
  lowerPrice: () => void;
  buyMarketing: () => void;
  sellClips: () => void;
  
  // Computing
  addProcessor: () => void;
  addMemory: () => void;
  computeQuantum: () => void;
  
  // Projects
  activateProject: (projectId: string) => void;
  completeProject: (projectId: string) => void;
  
  // Strategic
  runTourney: () => void;
  newTourney: () => void;
  toggleAutoTourney: () => void;
  runTourneyRound: (roundNum: number) => any;
  pickWinner: () => any;
  addStrategy: (strategyName: string) => void;
  
  // Investment
  investDeposit: () => void;
  investWithdraw: () => void;
  upgradeInvestment: () => void;
  
  // Space
  makeFactory: () => void;
  makeHarvester: (amount: number) => void;
  makeWireDrone: (amount: number) => void;
  makeFarm: (amount: number) => void;
  makeBattery: (amount: number) => void;
  makeProbe: () => void;
  
  // Probe Design
  adjustProbeSpeed: (delta: number) => void;
  adjustProbeNav: (delta: number) => void;
  adjustProbeRep: (delta: number) => void;
  adjustProbeHaz: (delta: number) => void;
  adjustProbeFac: (delta: number) => void;
  adjustProbeHarv: (delta: number) => void;
  adjustProbeWire: (delta: number) => void;
  adjustProbeCombat: (delta: number) => void;
  
  // UI
  addMessage: (text: string) => void;
  
  // Flags
  setFlag: (flag: keyof GameState['flags'], value: boolean) => void;
  
  // Cheats
  cheatFunds: (amount: number) => void;
  cheatOps: (amount: number) => void;
  cheatCreativity: (amount: number) => void;
  cheatTrust: (amount: number) => void;
  cheatYomi: (amount: number) => void;
  cheatWire: (amount: number) => void;
}

type GameStore = GameState & GameActions;

let messageId = 1;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Core tick - called 100x per second (every 10ms)
      tick: () => {
        get(); // Ensure we're reading current state
        
        set((s) => {
          const newState = { ...s, ticks: s.ticks + 1 };
          
          // Update manufacturing from autoclippers
          if (s.manufacturing.clipmakerLevel > 0 && s.manufacturing.wire > 0) {
            const clipperProduction = s.manufacturing.clipperBoost * (s.manufacturing.clipmakerLevel / 100);
            const megaClipperProduction = s.manufacturing.megaClipperBoost * (s.manufacturing.megaClipperLevel * 5);
            const totalProduction = clipperProduction + megaClipperProduction;
            
            if (totalProduction > 0 && s.manufacturing.wire >= totalProduction) {
              newState.manufacturing = {
                ...s.manufacturing,
                wire: s.manufacturing.wire - totalProduction,
                clips: s.manufacturing.clips + totalProduction,
              };
              
              if (s.flags.humanFlag) {
                newState.business = {
                  ...s.business,
                  unsoldClips: s.business.unsoldClips + totalProduction,
                };
              } else {
                newState.manufacturing.unusedClips = s.manufacturing.unusedClips + totalProduction;
              }
            }
          }
          
          // Calculate operations - matches original calculateOperations() exactly
          // Original runs at 100ms ticks, ours at 10ms, so we divide by 10
          if (s.flags.compFlag) {
            const maxOps = s.computing.memory * 1000;
            let standardOps = newState.computing?.standardOps ?? s.computing.standardOps;
            let tempOps = newState.computing?.tempOps ?? s.computing.tempOps;
            
            // Merge tempOps into standardOps when there's room
            if (tempOps + standardOps < maxOps) {
              standardOps = standardOps + tempOps;
              tempOps = 0;
            }
            
            // Calculate operations from standardOps + tempOps
            let operations = Math.floor(standardOps + Math.floor(tempOps));
            
            // Generate new ops from processors
            // Original: opCycle = processors/10 per 100ms = processors/sec
            // Our tick is 10ms, so we add processors/100 per tick
            if (operations < maxOps) {
              const opCycle = s.computing.processors / 100;
              const opBuf = maxOps - operations;
              
              const actualAdd = Math.min(opCycle, opBuf);
              standardOps = standardOps + actualAdd;
            }
            
            // Cap standardOps at max
            if (standardOps > maxOps) {
              standardOps = maxOps;
            }
            
            // Recalculate operations
            operations = Math.floor(standardOps + Math.floor(tempOps));
            
            newState.computing = {
              ...(newState.computing || s.computing),
              operations,
              maxOps,
              standardOps,
              tempOps,
            };
          }
          
          // Calculate creativity - matches original calculateCreativity() exactly
          // Only generates when ops are full
          if (s.computing.creativityOn) {
            const currentOps = newState.computing?.operations ?? s.computing.operations;
            const maxOps = s.computing.memory * 1000;
            
            if (currentOps >= maxOps) {
              // Original runs at 100ms, ours at 10ms, so we adjust counter increment
              // We increment by 0.1 per 10ms tick to match original 1 per 100ms
              const creativityCounter = (newState.computing?.creativityCounter ?? s.computing.creativityCounter) + 0.1;
              const creativityThreshold = 400;
              
              // prestigeS bonus
              const prestigeBonus = s.prestige.prestigeS / 10;
              const ss = s.computing.creativitySpeed + (s.computing.creativitySpeed * prestigeBonus);
              
              const creativityCheck = creativityThreshold / ss;
              
              let creativity = newState.computing?.creativity ?? s.computing.creativity;
              let newCounter = creativityCounter;
              
              if (creativityCounter >= creativityCheck) {
                if (creativityCheck >= 1) {
                  creativity = creativity + 1;
                } else {
                  // When creativityCheck < 1, add proportionally more
                  creativity = creativity + ss / creativityThreshold;
                }
                newCounter = 0;
              }
              
              newState.computing = {
                ...(newState.computing || s.computing),
                creativity,
                creativityCounter: newCounter,
              };
            }
          }
          
          // Trust milestones (human phase) - uses Fibonacci sequence
          // Original: if (clips>(nextTrust-1)) - equivalent to clips >= nextTrust for integers
          if (s.flags.humanFlag) {
            if (s.manufacturing.clips > (s.computing.nextTrust - 1)) {
              const fibNext = s.computing.fib1 + s.computing.fib2;
              newState.computing = {
                ...(newState.computing || s.computing),
                trust: s.computing.trust + 1,
                nextTrust: fibNext * 1000,
                fib1: s.computing.fib2,
                fib2: fibNext,
              };
              // Add trust increase message
              newState.messages = [
                { id: Date.now(), text: 'Production target met: TRUST INCREASED, additional processor/memory capacity granted', timestamp: Date.now() },
                ...(newState.messages || s.messages).slice(0, 4),
              ];
            }
          }
          
          // Unlock autoClippers when funds >= 5
          if (!s.flags.autoClipperFlag && s.business.funds >= 5) {
            newState.flags = {
              ...(newState.flags || s.flags),
              autoClipperFlag: true,
            };
          }
          
          // Unlock computing + projects when: clips >= 2000 OR player is stuck
          if (!s.flags.compFlag && s.flags.humanFlag) {
            const isStuck = s.business.unsoldClips < 1 && 
                           s.business.funds < s.manufacturing.wireCost && 
                           s.manufacturing.wire < 1;
            const hasEnoughClips = Math.ceil(s.manufacturing.clips) >= 2000;
            
            if (isStuck || hasEnoughClips) {
              newState.flags = {
                ...(newState.flags || s.flags),
                compFlag: true,
                projectsFlag: true,
              };
              // Add the unlock message
              newState.messages = [
                { id: Date.now(), text: 'Trust-Constrained Self-Modification enabled', timestamp: Date.now() },
                ...(newState.messages || s.messages).slice(0, 4),
              ];
            }
          }
          
          // Milestone checks - show messages at clip thresholds
          const currentFlags = newState.flags || s.flags;
          const clips = Math.ceil(s.manufacturing.clips);
          const ticks = s.ticks;
          
          // Helper to format time like original: "X hours Y minutes Z seconds"
          const formatMilestoneTime = (t: number): string => {
            const x = t / 100;
            const h = Math.floor(x / 3600);
            const m = Math.floor((x % 3600) / 60);
            const sec = Math.floor(x % 60);
            
            const hDisplay = h > 0 ? h + (h === 1 ? ' hour ' : ' hours ') : '';
            const mDisplay = m > 0 ? m + (m === 1 ? ' minute ' : ' minutes ') : '';
            const sDisplay = sec > 0 ? sec + (sec === 1 ? ' second' : ' seconds') : '';
            
            return hDisplay + mDisplay + sDisplay;
          };
          
          // Milestone 0 -> 1: funds >= 5 (autoclipper available)
          if (currentFlags.milestoneFlag === 0 && s.business.funds >= 5) {
            newState.flags = { ...currentFlags, milestoneFlag: 1 };
            newState.messages = [
              { id: Date.now(), text: 'AutoClippers available for purchase', timestamp: Date.now() },
              ...(newState.messages || s.messages).slice(0, 4),
            ];
          }
          
          // Milestone 1 -> 2: 500 clips
          if (currentFlags.milestoneFlag === 1 && clips >= 500) {
            newState.flags = { ...currentFlags, milestoneFlag: 2 };
            newState.messages = [
              { id: Date.now(), text: `500 clips created in ${formatMilestoneTime(ticks)}`, timestamp: Date.now() },
              ...(newState.messages || s.messages).slice(0, 4),
            ];
          }
          
          // Milestone 2 -> 3: 1,000 clips
          if (currentFlags.milestoneFlag === 2 && clips >= 1000) {
            newState.flags = { ...currentFlags, milestoneFlag: 3 };
            newState.messages = [
              { id: Date.now(), text: `1,000 clips created in ${formatMilestoneTime(ticks)}`, timestamp: Date.now() },
              ...(newState.messages || s.messages).slice(0, 4),
            ];
          }
          
          // Milestone 3 -> 4: 10,000 clips
          if (currentFlags.milestoneFlag === 3 && clips >= 10000) {
            newState.flags = { ...currentFlags, milestoneFlag: 4 };
            newState.messages = [
              { id: Date.now(), text: `10,000 clips created in ${formatMilestoneTime(ticks)}`, timestamp: Date.now() },
              ...(newState.messages || s.messages).slice(0, 4),
            ];
          }
          
          // Milestone 4 -> 5: 100,000 clips
          if (currentFlags.milestoneFlag === 4 && clips >= 100000) {
            newState.flags = { ...currentFlags, milestoneFlag: 5 };
            newState.messages = [
              { id: Date.now(), text: `100,000 clips created in ${formatMilestoneTime(ticks)}`, timestamp: Date.now() },
              ...(newState.messages || s.messages).slice(0, 4),
            ];
          }
          
          // Milestone 5 -> 6: 1,000,000 clips
          if (currentFlags.milestoneFlag === 5 && clips >= 1000000) {
            newState.flags = { ...currentFlags, milestoneFlag: 6 };
            newState.messages = [
              { id: Date.now(), text: `1,000,000 clips created in ${formatMilestoneTime(ticks)}`, timestamp: Date.now() },
              ...(newState.messages || s.messages).slice(0, 4),
            ];
          }
          
          // Auto wire buyer (original main.js line 3291: wire <= 1 triggers purchase)
          if (s.manufacturing.wireBuyerFlag && 
              s.manufacturing.wireBuyerStatus && 
              s.manufacturing.wire <= 1 &&
              s.business.funds >= s.manufacturing.wireCost) {
            newState.business = {
              ...newState.business,
              funds: s.business.funds - s.manufacturing.wireCost,
            };
            newState.manufacturing = {
              ...newState.manufacturing,
              wire: s.manufacturing.wire + s.manufacturing.wireSupply,
              wirePurchase: s.manufacturing.wirePurchase + 1,
              wireBasePrice: s.manufacturing.wireBasePrice + 0.05,
              wirePriceTimer: 0,  // Reset timer on purchase
            };
          }
          
          // NOTE: Sales and revenue calculation moved to slowTick (100ms loop)
          // to match original game's timing
          
          // Calculate demand (human phase)
          // Original: marketing = (Math.pow(1.1,(marketingLvl-1)));
          //           demand = (((.8/margin) * marketing * marketingEffectiveness)*demandBoost);
          //           demand = demand + ((demand/10)*prestigeU);
          if (s.flags.humanFlag) {
            const marketing = Math.pow(1.1, s.business.marketingLvl - 1);
            let demand = ((0.8 / s.business.margin) * marketing * s.business.marketingEffectiveness * s.business.demandBoost);
            demand = demand + ((demand / 10) * s.prestige.prestigeU);
            newState.business = {
              ...newState.business,
              demand,
              marketing,
            };
          }
          
          // NOTE: Wire price fluctuation moved to slowTick (100ms loop)
          // to match original game's timing (adjustWirePrice called in slow loop)
          
          // Quantum computing animation
          if (s.computing.qFlag) {
            const newQClock = s.computing.qClock + 0.01;
            const newQChips = s.computing.qChips.map(chip => ({
              ...chip,
              value: chip.active ? Math.sin(newQClock * chip.waveSeed) : 0,
            }));
            newState.computing = {
              ...newState.computing,
              qClock: newQClock,
              qChips: newQChips,
            };
          }
          
          return newState;
        });
      },
      
      // Slow tick - called 10x per second (every 100ms) 
      // Handles: wire price fluctuation, sales, revenue calculation
      // Matches original game's slow loop
      slowTick: () => {
        set((s) => {
          const newState: Partial<GameState> = {};
          
          // Wire price adjustment (original adjustWirePrice function)
          // wirePriceTimer increments each slow tick
          const currentTimer = (s.manufacturing.wirePriceTimer ?? 0) + 1;
          let currentBasePrice = s.manufacturing.wireBasePrice;
          let newTimer = currentTimer;
          
          // Decay base price if no purchases for 250+ slow ticks and price > 15
          if (currentTimer > 250 && currentBasePrice > 15) {
            currentBasePrice = currentBasePrice - (currentBasePrice / 1000);
            newTimer = 0;
          }
          
          // 1.5% chance each slow tick to update price
          if (Math.random() < 0.015) {
            const newPriceCounter = (s.manufacturing.wirePriceCounter ?? 0) + 1;
            const wireAdjust = 6 * Math.sin(newPriceCounter);
            newState.manufacturing = {
              ...s.manufacturing,
              wireCost: Math.ceil(currentBasePrice + wireAdjust),
              wireBasePrice: currentBasePrice,
              wirePriceCounter: newPriceCounter,
              wirePriceTimer: newTimer,
            };
          } else {
            newState.manufacturing = {
              ...s.manufacturing,
              wireBasePrice: currentBasePrice,
              wirePriceTimer: newTimer,
            };
          }
          
          // Sales (human phase only)
          // Original: if (Math.random() < (demand/100)) { sellClips(Math.floor(.7 * Math.pow(demand, 1.15))); }
          if (s.flags.humanFlag && s.business.unsoldClips > 0) {
            const sellChance = s.business.demand / 100;
            if (Math.random() < sellChance) {
              const potentialSell = Math.floor(0.7 * Math.pow(s.business.demand, 1.15));
              const currentBiz = newState.business ?? s.business;
              const unsoldClips = currentBiz.unsoldClips;
              
              if (potentialSell > unsoldClips) {
                // Sell all remaining
                const transaction = Math.floor(unsoldClips * s.business.margin * 1000) / 1000;
                newState.business = {
                  ...currentBiz,
                  unsoldClips: 0,
                  clipsSold: (currentBiz.clipsSold ?? s.business.clipsSold) + unsoldClips,
                  funds: Math.floor(((currentBiz.funds ?? s.business.funds) + transaction) * 100) / 100,
                  income: (currentBiz.income ?? s.business.income) + transaction,
                };
              } else if (potentialSell > 0) {
                const transaction = Math.floor(potentialSell * s.business.margin * 1000) / 1000;
                newState.business = {
                  ...currentBiz,
                  unsoldClips: unsoldClips - potentialSell,
                  clipsSold: (currentBiz.clipsSold ?? s.business.clipsSold) + potentialSell,
                  funds: Math.floor(((currentBiz.funds ?? s.business.funds) + transaction) * 100) / 100,
                  income: (currentBiz.income ?? s.business.income) + transaction,
                };
              }
            }
          }
          
          // Revenue calculation every 10 slow ticks (once per second)
          // Track with a counter in business state
          const secTimer = (s.business.secTimer ?? 0) + 1;
          if (s.flags.humanFlag && secTimer >= 10) {
            const currentBiz = newState.business ?? s.business;
            
            const incomeThen = currentBiz.lastIncomeReading ?? 0;
            const incomeNow = currentBiz.income;
            const incomeLastSecond = Math.round((incomeNow - incomeThen) * 100) / 100;
            
            const newTracker = [...(currentBiz.incomeTracker ?? [0]), incomeLastSecond];
            if (newTracker.length > 10) {
              newTracker.splice(0, 1);
            }
            
            let sum = 0;
            for (let i = 0; i < newTracker.length; i++) {
              sum = Math.round((sum + newTracker[i]) * 100) / 100;
            }
            const trueAvgRev = sum / newTracker.length;
            
            let chanceOfPurchase = currentBiz.demand / 100;
            if (chanceOfPurchase > 1) chanceOfPurchase = 1;
            if (currentBiz.unsoldClips < 1) chanceOfPurchase = 0;
            
            let avgSales = chanceOfPurchase * (0.7 * Math.pow(currentBiz.demand, 1.15)) * 10;
            let avgRev = chanceOfPurchase * (0.7 * Math.pow(currentBiz.demand, 1.15)) * currentBiz.margin * 10;
            
            if (currentBiz.demand > currentBiz.unsoldClips) {
              avgRev = trueAvgRev;
              avgSales = currentBiz.margin > 0 ? avgRev / currentBiz.margin : 0;
            }
            
            newState.business = {
              ...currentBiz,
              incomeTracker: newTracker,
              lastIncomeReading: incomeNow,
              avgRev,
              avgSales,
              secTimer: 0,
            };
          } else if (s.flags.humanFlag) {
            newState.business = {
              ...(newState.business ?? s.business),
              secTimer,
            };
          }
          
          return newState as GameState;
        });
      },
      
      reset: () => set({ ...initialState, messages: [{ id: messageId++, text: 'Welcome to Universal Paperclips', timestamp: Date.now() }] }),
      
      // Manufacturing
      makeClip: (amount = 1) => {
        set((s) => {
          if (s.manufacturing.wire < amount) return s;
          
          const newClips = s.manufacturing.clips + amount;
          const newWire = s.manufacturing.wire - amount;
          
          if (s.flags.humanFlag) {
            return {
              manufacturing: {
                ...s.manufacturing,
                clips: newClips,
                wire: newWire,
              },
              business: {
                ...s.business,
                unsoldClips: s.business.unsoldClips + amount,
              },
            };
          }
          
          return {
            manufacturing: {
              ...s.manufacturing,
              clips: newClips,
              wire: newWire,
              unusedClips: s.manufacturing.unusedClips + amount,
            },
          };
        });
      },
      
      buyWire: () => {
        set((s) => {
          if (s.business.funds < s.manufacturing.wireCost) return s;
          
          return {
            business: {
              ...s.business,
              funds: s.business.funds - s.manufacturing.wireCost,
            },
            manufacturing: {
              ...s.manufacturing,
              wire: s.manufacturing.wire + s.manufacturing.wireSupply,
              wirePurchase: s.manufacturing.wirePurchase + 1,
              wireBasePrice: s.manufacturing.wireBasePrice + 0.05,
              wirePriceTimer: 0,  // Reset timer on purchase (original line 52)
            },
          };
        });
      },
      
      toggleWireBuyer: () => {
        set((s) => ({
          manufacturing: {
            ...s.manufacturing,
            wireBuyerStatus: !s.manufacturing.wireBuyerStatus,
          },
        }));
      },
      
      makeClipper: () => {
        set((s) => {
          if (s.business.funds < s.manufacturing.clipperCost) return s;
          
          const newLevel = s.manufacturing.clipmakerLevel + 1;
          // Original formula: clipperCost = Math.pow(1.1, clipmakerLevel) + 5 (main.js line 1673)
          const newCost = Math.pow(1.1, newLevel) + 5;
          
          // Show autoclippers section if first one
          const newFlags = newLevel === 1 ? { ...s.flags, autoClipperFlag: true } : s.flags;
          
          return {
            business: {
              ...s.business,
              funds: s.business.funds - s.manufacturing.clipperCost,
            },
            manufacturing: {
              ...s.manufacturing,
              clipmakerLevel: newLevel,
              clipperCost: newCost,
            },
            flags: newFlags,
          };
        });
      },
      
      makeMegaClipper: () => {
        set((s) => {
          if (s.business.funds < s.manufacturing.megaClipperCost) return s;
          
          const newLevel = s.manufacturing.megaClipperLevel + 1;
          // Original formula: megaClipperCost = Math.pow(1.07, megaClipperLevel) * 1000 (main.js line 1686)
          const newCost = Math.pow(1.07, newLevel) * 1000;
          
          return {
            business: {
              ...s.business,
              funds: s.business.funds - s.manufacturing.megaClipperCost,
            },
            manufacturing: {
              ...s.manufacturing,
              megaClipperLevel: newLevel,
              megaClipperCost: newCost,
            },
          };
        });
      },
      
      // Business
      raisePrice: () => {
        set((s) => ({
          business: {
            ...s.business,
            margin: Math.round((s.business.margin + 0.01) * 100) / 100,
          },
        }));
      },
      
      lowerPrice: () => {
        set((s) => ({
          business: {
            ...s.business,
            margin: Math.max(0.01, Math.round((s.business.margin - 0.01) * 100) / 100),
          },
        }));
      },
      
      buyMarketing: () => {
        set((s) => {
          if (s.business.funds < s.business.adCost) return s;
          
          const newLevel = s.business.marketingLvl + 1;
          // Original: adCost = Math.floor(adCost * 2);
          const newCost = Math.floor(s.business.adCost * 2);
          
          return {
            business: {
              ...s.business,
              funds: s.business.funds - s.business.adCost,
              marketingLvl: newLevel,
              adCost: newCost,
            },
          };
        });
      },
      
      sellClips: () => {
        // Manual selling handled by tick
      },
      
      // Computing
      addProcessor: () => {
        set((s) => {
          const available = s.computing.trust - (s.computing.processors + s.computing.memory) + s.swarm.swarmGifts;
          if (available <= 0) return s;
          
          const newProcessors = s.computing.processors + 1;
          // Original formula: creativitySpeed = Math.log10(processors) * Math.pow(processors,1.1) + processors-1;
          const newCreativitySpeed = Math.log10(newProcessors) * Math.pow(newProcessors, 1.1) + newProcessors - 1;
          
          // Use swarm gift if no trust available
          if (s.computing.trust <= s.computing.processors + s.computing.memory && s.swarm.swarmGifts > 0) {
            return {
              computing: {
                ...s.computing,
                processors: newProcessors,
                creativitySpeed: newCreativitySpeed,
              },
              swarm: {
                ...s.swarm,
                swarmGifts: s.swarm.swarmGifts - 1,
              },
            };
          }
          
          return {
            computing: {
              ...s.computing,
              processors: newProcessors,
              creativitySpeed: newCreativitySpeed,
            },
          };
        });
      },
      
      addMemory: () => {
        set((s) => {
          const available = s.computing.trust - (s.computing.processors + s.computing.memory) + s.swarm.swarmGifts;
          if (available <= 0) return s;
          
          if (s.computing.trust <= s.computing.processors + s.computing.memory && s.swarm.swarmGifts > 0) {
            return {
              computing: {
                ...s.computing,
                memory: s.computing.memory + 1,
                maxOps: (s.computing.memory + 1) * 1000,
              },
              swarm: {
                ...s.swarm,
                swarmGifts: s.swarm.swarmGifts - 1,
              },
            };
          }
          
          return {
            computing: {
              ...s.computing,
              memory: s.computing.memory + 1,
              maxOps: (s.computing.memory + 1) * 1000,
            },
          };
        });
      },
      
      computeQuantum: () => {
        set((s) => {
          // Original checks qChips[0].active specifically
          if (!s.computing.qChips[0]?.active) return s;
          
          // Sum all chip values (inactive chips have value 0)
          const q = s.computing.qChips.reduce((sum, chip) => sum + chip.value, 0);
          let qq = Math.ceil(q * 360);
          
          const maxOps = s.computing.memory * 1000;
          const buffer = maxOps - s.computing.standardOps;
          let tempOps = s.computing.tempOps;
          let standardOps = s.computing.standardOps;
          
          // Original overflow behavior with damper
          if (qq > buffer) {
            const damper = (tempOps / 100) + 5;
            tempOps = tempOps + Math.ceil(qq / damper) - buffer;
            qq = buffer;
          }
          
          standardOps = standardOps + qq;
          
          const operations = Math.floor(standardOps + Math.floor(tempOps));
          
          return {
            computing: {
              ...s.computing,
              operations,
              standardOps,
              tempOps,
            },
          };
        });
      },
      
      // Projects
      activateProject: (projectId: string) => {
        set((s) => ({
          activeProjects: [...s.activeProjects, projectId],
        }));
      },
      
      completeProject: (projectId: string) => {
        set((s) => ({
          activeProjects: s.activeProjects.filter(p => p !== projectId),
        }));
      },
      
      // Strategic
      runTourney: () => {
        set((s) => {
          if (!s.strategic.tourneyInProg) return s;
          
          const strategic = s.strategic;
          
          // Tournament progression
          if (strategic.currentRound < strategic.rounds) {
            // Run a round
            const newState = get().runTourneyRound(strategic.currentRound);
            return {
              strategic: {
                ...strategic,
                currentRound: strategic.currentRound + 1,
                ...newState,
              },
            };
          } else {
            // Tournament complete - pick winner and calculate results
            const results = get().pickWinner();
            const pickedStrategy = strategic.strats[strategic.stratPicked] || strategic.strats[0];
            const yomiGain = pickedStrategy.currentScore * strategic.yomiBoost;
            
            return {
              strategic: {
                ...strategic,
                tourneyInProg: false,
                resultsFlag: true,
                tourneyResults: results.results,
                winnerPtr: results.winnerPtr,
                high: results.high,
                placeScore: results.placeScore,
                showScore: results.showScore,
                yomi: strategic.yomi + yomiGain,
              },
            };
          }
        });
      },
      
      newTourney: () => {
        set((s) => {
          if (s.computing.operations < s.strategic.tourneyCost) return s;
          
          // Generate new payoff grid
          const payoffGrid = {
            valueAA: Math.ceil(Math.random() * 10),
            valueAB: Math.ceil(Math.random() * 10),
            valueBA: Math.ceil(Math.random() * 10),
            valueBB: Math.ceil(Math.random() * 10),
          };
          
          // Reset all strategy scores
          const strats = s.strategic.strats.map(strat => ({
            ...strat,
            currentScore: 0,
          }));
          
          const rounds = strats.length * strats.length;
          
          return {
            computing: {
              ...s.computing,
              operations: s.computing.operations - s.strategic.tourneyCost,
            },
            strategic: {
              ...s.strategic,
              tourneyInProg: true,
              resultsFlag: false,
              currentRound: 0,
              rounds,
              payoffGrid,
              strats,
              stratCounter: 0,
              h: 0,
              v: 0,
              hMove: 0,
              vMove: 0,
              hMovePrev: 0,
              vMovePrev: 0,
              rCounter: 0,
              high: 0,
              tourneyResults: [],
            },
          };
        });
      },
      
      runTourneyRound: (roundNum: number) => {
        const s = get();
        const strategic = s.strategic;
        const strats = strategic.strats;
        
        // Pick strategies for this round (original pickStrats logic)
        let h: number, v: number;
        if (roundNum < strats.length) {
          h = 0;
          v = roundNum;
        } else {
          const newStratCounter = (strategic.stratCounter + 1) >= strats.length 
            ? (strategic.stratCounter + 1) - strats.length 
            : strategic.stratCounter + 1;
          h = Math.floor(roundNum / strats.length);
          v = newStratCounter;
        }
        
        const hStrat = { ...strats[h], currentPos: 1 };
        const vStrat = { ...strats[v], currentPos: 2 };
        
        // Update strategy positions for this round
        stratTitForTat.currentPos = hStrat === strats.find(s => s.name === "TIT FOR TAT") ? 1 : 2;
        stratBeatLast.currentPos = hStrat === strats.find(s => s.name === "BEAT LAST") ? 1 : 2;
        
        // Run 10 sub-rounds
        let newHStrat = hStrat;
        let newVStrat = vStrat;
        let hMovePrev = strategic.hMovePrev;
        let vMovePrev = strategic.vMovePrev;
        
        for (let i = 0; i < 10; i++) {
          const hMove = newHStrat.pickMove(strategic.payoffGrid, hMovePrev, vMovePrev);
          const vMove = newVStrat.pickMove(strategic.payoffGrid, hMovePrev, vMovePrev);
          
          // Calculate payoffs
          if (hMove === 1 && vMove === 1) {
            newHStrat.currentScore += strategic.payoffGrid.valueAA;
            newVStrat.currentScore += strategic.payoffGrid.valueAA;
          } else if (hMove === 1 && vMove === 2) {
            newHStrat.currentScore += strategic.payoffGrid.valueAB;
            newVStrat.currentScore += strategic.payoffGrid.valueBA;
          } else if (hMove === 2 && vMove === 1) {
            newHStrat.currentScore += strategic.payoffGrid.valueBA;
            newVStrat.currentScore += strategic.payoffGrid.valueAB;
          } else if (hMove === 2 && vMove === 2) {
            newHStrat.currentScore += strategic.payoffGrid.valueBB;
            newVStrat.currentScore += strategic.payoffGrid.valueBB;
          }
          
          hMovePrev = hMove;
          vMovePrev = vMove;
        }
        
        // Update strats with new scores
        const newStrats = [...strats];
        newStrats[h] = newHStrat;
        newStrats[v] = newVStrat;
        
        return {
          strats: newStrats,
          stratCounter: h === 0 ? strategic.stratCounter : (strategic.stratCounter + 1) >= strats.length 
            ? (strategic.stratCounter + 1) - strats.length 
            : strategic.stratCounter + 1,
          h,
          v,
          hStrat: newHStrat,
          vStrat: newVStrat,
          hMovePrev,
          vMovePrev,
        };
      },
      
      pickWinner: () => {
        const s = get();
        const strats = s.strategic.strats;
        
        // Create sorted results (original pickWinner logic)
        const results = [...strats].sort((a, b) => b.currentScore - a.currentScore);
        
        let winnerPtr = 0;
        let high = 0;
        
        // Find the highest scoring strategy
        for (let i = 0; i < strats.length; i++) {
          if (strats[i].currentScore > high) {
            winnerPtr = i;
            high = strats[i].currentScore;
          }
        }
        
        // Calculate place and show scores (2nd and 3rd place scores)
        let placeScore = 0;
        let showScore = 0;
        
        for (let i = 1; i < results.length; i++) {
          if (results[i].currentScore < results[i - 1].currentScore) {
            placeScore = results[i].currentScore;
            break;
          }
        }
        
        for (let i = 1; i < results.length; i++) {
          if (results[i].currentScore < placeScore) {
            showScore = results[i].currentScore;
            break;
          }
        }
        
        return {
          results,
          winnerPtr,
          high,
          placeScore,
          showScore,
        };
      },
      
      addStrategy: (strategyName: string) => {
        set((s) => {
          const strategy = allStrats.find(strat => strat.name === strategyName);
          if (!strategy) return s;
          
          // Check if strategy already exists
          const exists = s.strategic.strats.some(strat => strat.name === strategyName);
          if (exists) return s;
          
          // Add the strategy
          const newStrategy = {
            ...strategy,
            active: 1,
            currentScore: 0,
          };
          
          return {
            strategic: {
              ...s.strategic,
              strats: [...s.strategic.strats, newStrategy],
            },
          };
        });
      },
      
      toggleAutoTourney: () => {
        set((s) => ({
          strategic: {
            ...s.strategic,
            autoTourneyStatus: !s.strategic.autoTourneyStatus,
          },
        }));
      },
      
      // Investment
      investDeposit: () => {
        set((s) => {
          if (s.business.funds <= 0) return s;
          
          return {
            business: {
              ...s.business,
              funds: 0,
            },
            investment: {
              ...s.investment,
              bankroll: s.investment.bankroll + s.business.funds,
            },
          };
        });
      },
      
      investWithdraw: () => {
        set((s) => ({
          business: {
            ...s.business,
            funds: s.business.funds + s.investment.bankroll + s.investment.secValue,
          },
          investment: {
            ...s.investment,
            bankroll: 0,
            secValue: 0,
            stocks: [],
          },
        }));
      },
      
      upgradeInvestment: () => {
        set((s) => {
          const cost = Math.pow(2, s.investment.investmentLevel) * 100;
          if (s.strategic.yomi < cost) return s;
          
          return {
            strategic: {
              ...s.strategic,
              yomi: s.strategic.yomi - cost,
            },
            investment: {
              ...s.investment,
              investmentLevel: s.investment.investmentLevel + 1,
            },
          };
        });
      },
      
      // Space
      makeFactory: () => {
        set((s) => {
          if (s.manufacturing.unusedClips < s.space.factoryCost) return s;
          
          return {
            manufacturing: {
              ...s.manufacturing,
              unusedClips: s.manufacturing.unusedClips - s.space.factoryCost,
            },
            space: {
              ...s.space,
              factoryLevel: s.space.factoryLevel + 1,
            },
          };
        });
      },
      
      makeHarvester: (amount: number) => {
        set((s) => {
          const cost = s.space.harvesterCost * amount;
          if (s.manufacturing.unusedClips < cost) return s;
          
          return {
            manufacturing: {
              ...s.manufacturing,
              unusedClips: s.manufacturing.unusedClips - cost,
            },
            space: {
              ...s.space,
              harvesterLevel: s.space.harvesterLevel + amount,
            },
          };
        });
      },
      
      makeWireDrone: (amount: number) => {
        set((s) => {
          const cost = s.space.wireDroneCost * amount;
          if (s.manufacturing.unusedClips < cost) return s;
          
          return {
            manufacturing: {
              ...s.manufacturing,
              unusedClips: s.manufacturing.unusedClips - cost,
            },
            space: {
              ...s.space,
              wireDroneLevel: s.space.wireDroneLevel + amount,
            },
          };
        });
      },
      
      makeFarm: (amount: number) => {
        set((s) => {
          const cost = s.space.farmCost * amount;
          if (s.manufacturing.unusedClips < cost) return s;
          
          return {
            manufacturing: {
              ...s.manufacturing,
              unusedClips: s.manufacturing.unusedClips - cost,
            },
            space: {
              ...s.space,
              farmLevel: s.space.farmLevel + amount,
            },
          };
        });
      },
      
      makeBattery: (amount: number) => {
        set((s) => {
          const cost = s.space.batteryCost * amount;
          if (s.manufacturing.unusedClips < cost) return s;
          
          return {
            manufacturing: {
              ...s.manufacturing,
              unusedClips: s.manufacturing.unusedClips - cost,
            },
            space: {
              ...s.space,
              batteryLevel: s.space.batteryLevel + amount,
              maxStorage: (s.space.batteryLevel + amount) * 10000,
            },
          };
        });
      },
      
      makeProbe: () => {
        set((s) => {
          if (s.manufacturing.unusedClips < s.space.probeCost) return s;
          
          return {
            manufacturing: {
              ...s.manufacturing,
              unusedClips: s.manufacturing.unusedClips - s.space.probeCost,
            },
            space: {
              ...s.space,
              probeCount: s.space.probeCount + 1,
              probeLaunchLevel: s.space.probeLaunchLevel + 1,
            },
          };
        });
      },
      
      // Probe Design adjustments
      adjustProbeSpeed: (delta: number) => {
        set((s) => {
          const newUsed = s.space.probeTrustUsed + delta;
          if (newUsed > s.space.probeTrust || s.space.probeSpeed + delta < 0) return s;
          
          return {
            space: {
              ...s.space,
              probeSpeed: Math.max(0, s.space.probeSpeed + delta),
              probeTrustUsed: newUsed,
            },
          };
        });
      },
      
      adjustProbeNav: (delta: number) => {
        set((s) => {
          const newUsed = s.space.probeTrustUsed + delta;
          if (newUsed > s.space.probeTrust || s.space.probeNav + delta < 0) return s;
          
          return {
            space: {
              ...s.space,
              probeNav: Math.max(0, s.space.probeNav + delta),
              probeTrustUsed: newUsed,
            },
          };
        });
      },
      
      adjustProbeRep: (delta: number) => {
        set((s) => {
          const newUsed = s.space.probeTrustUsed + delta;
          if (newUsed > s.space.probeTrust || s.space.probeRep + delta < 0) return s;
          
          return {
            space: {
              ...s.space,
              probeRep: Math.max(0, s.space.probeRep + delta),
              probeTrustUsed: newUsed,
            },
          };
        });
      },
      
      adjustProbeHaz: (delta: number) => {
        set((s) => {
          const newUsed = s.space.probeTrustUsed + delta;
          if (newUsed > s.space.probeTrust || s.space.probeHaz + delta < 0) return s;
          
          return {
            space: {
              ...s.space,
              probeHaz: Math.max(0, s.space.probeHaz + delta),
              probeTrustUsed: newUsed,
            },
          };
        });
      },
      
      adjustProbeFac: (delta: number) => {
        set((s) => {
          const newUsed = s.space.probeTrustUsed + delta;
          if (newUsed > s.space.probeTrust || s.space.probeFac + delta < 0) return s;
          
          return {
            space: {
              ...s.space,
              probeFac: Math.max(0, s.space.probeFac + delta),
              probeTrustUsed: newUsed,
            },
          };
        });
      },
      
      adjustProbeHarv: (delta: number) => {
        set((s) => {
          const newUsed = s.space.probeTrustUsed + delta;
          if (newUsed > s.space.probeTrust || s.space.probeHarv + delta < 0) return s;
          
          return {
            space: {
              ...s.space,
              probeHarv: Math.max(0, s.space.probeHarv + delta),
              probeTrustUsed: newUsed,
            },
          };
        });
      },
      
      adjustProbeWire: (delta: number) => {
        set((s) => {
          const newUsed = s.space.probeTrustUsed + delta;
          if (newUsed > s.space.probeTrust || s.space.probeWire + delta < 0) return s;
          
          return {
            space: {
              ...s.space,
              probeWire: Math.max(0, s.space.probeWire + delta),
              probeTrustUsed: newUsed,
            },
          };
        });
      },
      
      adjustProbeCombat: (delta: number) => {
        set((s) => {
          const newUsed = s.space.probeTrustUsed + delta;
          if (newUsed > s.space.probeTrust || s.space.probeCombat + delta < 0) return s;
          
          return {
            space: {
              ...s.space,
              probeCombat: Math.max(0, s.space.probeCombat + delta),
              probeTrustUsed: newUsed,
            },
          };
        });
      },
      
      // UI
      addMessage: (text: string) => {
        set((s) => ({
          messages: [
            { id: messageId++, text, timestamp: Date.now() },
            ...s.messages.slice(0, 4),
          ],
        }));
      },
      
      // Flags
      setFlag: (flag, value) => {
        set((s) => ({
          flags: {
            ...s.flags,
            [flag]: value,
          },
        }));
      },
      
      // Cheats
      cheatFunds: (amount: number) => {
        set((s) => ({
          business: {
            ...s.business,
            funds: s.business.funds + amount,
          },
        }));
      },
      
      cheatOps: (amount: number) => {
        set((s) => ({
          computing: {
            ...s.computing,
            operations: Math.min(s.computing.operations + amount, s.computing.maxOps),
          },
        }));
      },
      
      cheatCreativity: (amount: number) => {
        set((s) => ({
          computing: {
            ...s.computing,
            creativity: s.computing.creativity + amount,
          },
        }));
      },
      
      cheatTrust: (amount: number) => {
        set((s) => ({
          computing: {
            ...s.computing,
            trust: s.computing.trust + amount,
          },
        }));
      },
      
      cheatYomi: (amount: number) => {
        set((s) => ({
          strategic: {
            ...s.strategic,
            yomi: s.strategic.yomi + amount,
          },
        }));
      },
      
      cheatWire: (amount: number) => {
        set((s) => ({
          manufacturing: {
            ...s.manufacturing,
            wire: s.manufacturing.wire + amount,
          },
        }));
      },
    }),
    {
      name: 'paperclips-save',
      partialize: (state) => ({
        ...state,
        // Don't persist messages
        messages: [],
      }),
    }
  )
);
