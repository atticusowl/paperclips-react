// Universal Paperclips Game Types

export interface BusinessState {
  funds: number;
  margin: number;
  demand: number;
  marketing: number;
  marketingLvl: number;
  marketingEffectiveness: number;
  adCost: number;
  unsoldClips: number;
  clipsSold: number;
  avgRev: number;
  avgSales: number;
  income: number;
  incomeTracker: number[];  // Stores deltas (income earned each second)
  lastIncomeReading: number; // Previous cumulative income for delta calculation
  demandBoost: number;
  secTimer: number;  // Timer for revenue calculation (fires every 10 slow ticks)
}

export interface ManufacturingState {
  clips: number;
  unusedClips: number;
  clipRate: number;
  wire: number;
  wireCost: number;
  wireBasePrice: number;
  wireSupply: number;
  wirePurchase: number;
  wirePriceCounter: number;  // Counter for sine wave price calculation
  wirePriceTimer: number;    // Timer for base price decay
  wireBuyerFlag: boolean;
  wireBuyerStatus: boolean;
  
  // AutoClippers
  clipmakerLevel: number;
  clipperCost: number;
  clipperBoost: number;
  
  // MegaClippers
  megaClipperLevel: number;
  megaClipperCost: number;
  megaClipperBoost: number;
}

export interface ComputingState {
  processors: number;
  memory: number;
  operations: number;
  maxOps: number;
  trust: number;
  nextTrust: number;
  creativity: number;
  creativityOn: boolean;
  creativitySpeed: number;
  creativityCounter: number;
  
  // Operations tracking (original uses standardOps + tempOps)
  standardOps: number;
  tempOps: number;
  
  // Fibonacci for trust milestones
  fib1: number;
  fib2: number;
  
  // Quantum Computing
  qFlag: boolean;
  qChips: QChip[];
  qClock: number;
}

export interface QChip {
  waveSeed: number;
  value: number;
  active: boolean;
}

export interface Strategy {
  name: string;
  active: number;
  currentScore: number;
  currentPos: number;
  pickMove: (payoffGrid?: PayoffGrid, hMovePrev?: number, vMovePrev?: number) => number;
}

export interface PayoffGrid {
  valueAA: number;
  valueAB: number;
  valueBA: number;
  valueBB: number;
}

export interface StrategicState {
  yomi: number;
  stratPicked: number;
  tourneyInProg: boolean;
  tourneyCost: number;
  autoTourneyFlag: boolean;
  autoTourneyStatus: boolean;
  resultsFlag: boolean;
  currentRound: number;
  rounds: number;
  payoffGrid: PayoffGrid;
  hMove: number;
  vMove: number;
  hMovePrev: number;
  vMovePrev: number;
  rCounter: number;
  stratCounter: number;
  h: number;
  v: number;
  hStrat: Strategy | null;
  vStrat: Strategy | null;
  strats: Strategy[];
  tourneyResults: Strategy[];
  winnerPtr: number;
  high: number;
  placeScore: number;
  showScore: number;
  yomiBoost: number;
}

export interface InvestmentState {
  investmentEngineFlag: boolean;
  investmentLevel: number;
  bankroll: number;
  secValue: number;
  portTotal: number;
  stocks: Stock[];
  investStrat: 'low' | 'med' | 'hi';
}

export interface Stock {
  sym: string;
  amt: number;
  price: number;
  avgPrice: number;
}

export interface SpaceState {
  spaceFlag: boolean;
  availableMatter: number;
  acquiredMatter: number;
  totalMatter: number;
  foundMatter: number;
  
  // Factories, Harvesters, Wire Drones
  factoryLevel: number;
  factoryCost: number;
  factoryBoost: number;
  harvesterLevel: number;
  harvesterCost: number;
  wireDroneLevel: number;
  wireDroneCost: number;
  droneBoost: number;
  
  // Power
  farmLevel: number;
  farmCost: number;
  batteryLevel: number;
  batteryCost: number;
  storedPower: number;
  maxStorage: number;
  powMod: number;
  
  // Probes
  probeCount: number;
  probeLaunchLevel: number;
  probeCost: number;
  probeDescendents: number;
  probesLostHaz: number;
  probesLostDrift: number;
  probesLostCombat: number;
  
  // Probe Design
  probeSpeed: number;
  probeNav: number;
  probeRep: number;
  probeHaz: number;
  probeFac: number;
  probeHarv: number;
  probeWire: number;
  probeCombat: number;
  probeTrust: number;
  probeTrustUsed: number;
  maxTrust: number;
}

export interface SwarmState {
  swarmFlag: boolean;
  swarmGifts: number;
  swarmStatus: number;
  sliderPos: number;
  giftCountdown: number;
}

export interface CombatState {
  battleFlag: boolean;
  honor: number;
  drifterCount: number;
  driftersKilled: number;
}

export interface ProjectState {
  id: string;
  title: string;
  priceTag: string;
  description: string;
  flag: boolean;
  uses: number;
}

export interface GameFlags {
  humanFlag: boolean;
  compFlag: boolean;
  projectsFlag: boolean;
  autoClipperFlag: boolean;
  megaClipperFlag: boolean;
  revPerSecFlag: boolean;
  investmentEngineFlag: boolean;
  strategyEngineFlag: boolean;
  stratA100Flag: boolean;
  stratB100Flag: boolean;
  stratGreedyFlag: boolean;
  stratGenerousFlag: boolean;
  stratTitForTatFlag: boolean;
  stratBeatLastFlag: boolean;
  wireProductionFlag: boolean;
  creationFlag: boolean;
  tothFlag: boolean;
  milestoneFlag: number; // Tracks which milestones have been shown
}

export interface PrestigeState {
  prestigeU: number;
  prestigeS: number;
}

export interface ConsoleMessage {
  id: number;
  text: string;
  timestamp: number;
}

export interface GameState {
  // Core
  ticks: number;
  
  // Sub-states
  business: BusinessState;
  manufacturing: ManufacturingState;
  computing: ComputingState;
  strategic: StrategicState;
  investment: InvestmentState;
  space: SpaceState;
  swarm: SwarmState;
  combat: CombatState;
  flags: GameFlags;
  prestige: PrestigeState;
  
  // UI State
  messages: ConsoleMessage[];
  activeProjects: string[];
}
