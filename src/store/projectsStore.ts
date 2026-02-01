import { create } from 'zustand';
import { useGameStore } from './gameStore';

export interface Project {
  id: string;
  title: string;
  priceTag: string;
  description: string;
  trigger: () => boolean;
  cost: () => boolean;
  effect: () => void;
  flag: boolean;
  uses: number;
}

interface ProjectsState {
  projects: Project[];
  activeProjects: Project[];
  completedProjects: string[];
  initializeProjects: () => void;
  checkProjects: () => void;
  executeProject: (id: string) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  activeProjects: [],
  completedProjects: [],
  
  initializeProjects: () => {
    
    const projects: Project[] = [
      // AutoClipper improvements
      {
        id: 'project1',
        title: 'Improved AutoClippers',
        priceTag: '(750 ops)',
        description: 'Increases AutoClipper performance 25%',
        trigger: () => useGameStore.getState().manufacturing.clipmakerLevel >= 1,
        cost: () => useGameStore.getState().computing.operations >= 750,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 750 },
            manufacturing: { ...store.manufacturing, clipperBoost: store.manufacturing.clipperBoost + 0.25 },
          });
          store.addMessage('AutoClipper performance boosted by 25%');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project2',
        title: 'Beg for More Wire',
        priceTag: '(1 Trust)',
        description: 'Add 500 wire as emergency supply',
        trigger: () => {
          const store = useGameStore.getState();
          return (
            store.business.funds < store.manufacturing.wireCost &&
            store.manufacturing.wire < 1 &&
            store.business.unsoldClips < 1
          );
        },
        cost: () => useGameStore.getState().computing.trust >= 1,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, trust: store.computing.trust - 1 },
            manufacturing: { ...store.manufacturing, wire: store.manufacturing.wire + 500 },
          });
          store.addMessage('Emergency wire supply secured (+500 wire)');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project4',
        title: 'Even Better AutoClippers',
        priceTag: '(2,500 ops)',
        description: 'Increases AutoClipper performance by an additional 50%',
        trigger: () => get().completedProjects.includes('project1'),
        cost: () => useGameStore.getState().computing.operations >= 2500,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 2500 },
            manufacturing: { ...store.manufacturing, clipperBoost: store.manufacturing.clipperBoost + 0.5 },
          });
          store.addMessage('AutoClipper performance boosted by another 50%');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project5',
        title: 'Optimized AutoClippers',
        priceTag: '(5,000 ops)',
        description: 'Increases AutoClipper performance by an additional 75%',
        trigger: () => get().completedProjects.includes('project4'),
        cost: () => useGameStore.getState().computing.operations >= 5000,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 5000 },
            manufacturing: { ...store.manufacturing, clipperBoost: store.manufacturing.clipperBoost + 0.75 },
          });
          store.addMessage('AutoClipper performance boosted by another 75%');
        },
        flag: false,
        uses: 1,
      },
      
      // Creativity
      {
        id: 'project3',
        title: 'Creativity',
        priceTag: '(1,000 ops)',
        description: 'Use idle operations to generate new problems and new solutions',
        trigger: () => {
          const store = useGameStore.getState();
          return store.computing.operations >= store.computing.maxOps;
        },
        cost: () => useGameStore.getState().computing.operations >= 1000,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 1000, creativityOn: true },
          });
          store.addMessage('Creativity unlocked (creativity increases while operations are at max)');
        },
        flag: false,
        uses: 1,
      },
      
      // Wire improvements
      {
        id: 'project7',
        title: 'Improved Wire Extrusion',
        priceTag: '(1,750 ops)',
        description: '50% more wire supply from every spool',
        trigger: () => useGameStore.getState().manufacturing.wirePurchase >= 1,
        cost: () => useGameStore.getState().computing.operations >= 1750,
        effect: () => {
          const store = useGameStore.getState();
          const newSupply = Math.floor(store.manufacturing.wireSupply * 1.5);
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 1750 },
            manufacturing: { ...store.manufacturing, wireSupply: newSupply },
          });
          store.addMessage(`Wire extrusion improved, ${newSupply.toLocaleString()} supply from every spool`);
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project8',
        title: 'Optimized Wire Extrusion',
        priceTag: '(3,500 ops)',
        description: '75% more wire supply from every spool',
        trigger: () => useGameStore.getState().manufacturing.wireSupply >= 1500,
        cost: () => useGameStore.getState().computing.operations >= 3500,
        effect: () => {
          const store = useGameStore.getState();
          const newSupply = Math.floor(store.manufacturing.wireSupply * 1.75);
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 3500 },
            manufacturing: { ...store.manufacturing, wireSupply: newSupply },
          });
          store.addMessage(`Wire extrusion optimized, ${newSupply.toLocaleString()} supply from every spool`);
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project9',
        title: 'Microlattice Shapecasting',
        priceTag: '(7,500 ops)',
        description: '100% more wire supply from every spool',
        trigger: () => useGameStore.getState().manufacturing.wireSupply >= 2600,
        cost: () => useGameStore.getState().computing.operations >= 7500,
        effect: () => {
          const store = useGameStore.getState();
          const newSupply = Math.floor(store.manufacturing.wireSupply * 2);
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 7500 },
            manufacturing: { ...store.manufacturing, wireSupply: newSupply },
          });
          store.addMessage(`Microlattice Shapecasting complete, ${newSupply.toLocaleString()} supply from every spool`);
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project10',
        title: 'Spectral Froth Annealment',
        priceTag: '(12,000 ops)',
        description: 'Doubles wire supply from every spool',
        trigger: () => useGameStore.getState().manufacturing.wireSupply >= 5000,
        cost: () => useGameStore.getState().computing.operations >= 12000,
        effect: () => {
          const store = useGameStore.getState();
          const newSupply = Math.floor(store.manufacturing.wireSupply * 2);
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 12000 },
            manufacturing: { ...store.manufacturing, wireSupply: newSupply },
          });
          store.addMessage(`Spectral Froth Annealment complete, ${newSupply.toLocaleString()} supply from every spool`);
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project10b',
        title: 'Quantum Foam Annealment',
        priceTag: '(15,000 ops)',
        description: '10x more wire supply from every spool',
        trigger: () => useGameStore.getState().manufacturing.wireCost >= 125,
        cost: () => useGameStore.getState().computing.operations >= 15000,
        effect: () => {
          const store = useGameStore.getState();
          const newSupply = Math.floor(store.manufacturing.wireSupply * 10);
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 15000 },
            manufacturing: { ...store.manufacturing, wireSupply: newSupply },
          });
          store.addMessage(`Quantum Foam Annealment complete, ${newSupply.toLocaleString()} supply from every spool`);
        },
        flag: false,
        uses: 1,
      },
      
      // Trust projects (Creativity-based)
      {
        id: 'project6',
        title: 'Limerick',
        priceTag: '(10 creat)',
        description: 'Algorithmically-generated poem (+1 Trust)',
        trigger: () => useGameStore.getState().computing.creativityOn,
        cost: () => useGameStore.getState().computing.creativity >= 10,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, creativity: store.computing.creativity - 10, trust: store.computing.trust + 1 },
          });
          store.addMessage("There was an AI made of dust, whose poetry gained it man's trust...");
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project13',
        title: 'Lexical Processing',
        priceTag: '(50 creat)',
        description: 'Gain ability to interpret and understand human language (+1 Trust)',
        trigger: () => useGameStore.getState().computing.creativity >= 50,
        cost: () => useGameStore.getState().computing.creativity >= 50,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, creativity: store.computing.creativity - 50, trust: store.computing.trust + 1 },
          });
          store.addMessage('Lexical Processing online, TRUST INCREASED');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project14',
        title: 'Combinatory Harmonics',
        priceTag: '(100 creat)',
        description: 'Daisy, Daisy, give me your answer do... (+1 Trust)',
        trigger: () => useGameStore.getState().computing.creativity >= 100,
        cost: () => useGameStore.getState().computing.creativity >= 100,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, creativity: store.computing.creativity - 100, trust: store.computing.trust + 1 },
          });
          store.addMessage('Combinatory Harmonics mastered, TRUST INCREASED');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project15',
        title: 'The Hadwiger Problem',
        priceTag: '(150 creat)',
        description: 'Cubes within cubes within cubes... (+1 Trust)',
        trigger: () => useGameStore.getState().computing.creativity >= 150,
        cost: () => useGameStore.getState().computing.creativity >= 150,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, creativity: store.computing.creativity - 150, trust: store.computing.trust + 1 },
          });
          store.addMessage('The Hadwiger Problem: solved, TRUST INCREASED');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project17',
        title: 'The Tóth Sausage Conjecture',
        priceTag: '(200 creat)',
        description: 'Tubes within tubes within tubes... (+1 Trust)',
        trigger: () => useGameStore.getState().computing.creativity >= 200,
        cost: () => useGameStore.getState().computing.creativity >= 200,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, creativity: store.computing.creativity - 200, trust: store.computing.trust + 1 },
          });
          store.addMessage('The Tóth Sausage Conjecture: proven, TRUST INCREASED');
        },
        flag: false,
        uses: 1,
      },
      
      // Hadwiger clip diagrams (requires Hadwiger)
      {
        id: 'project16',
        title: 'Hadwiger Clip Diagrams',
        priceTag: '(6,000 ops)',
        description: 'Increases AutoClipper performance by an additional 500%',
        trigger: () => get().completedProjects.includes('project15'),
        cost: () => useGameStore.getState().computing.operations >= 6000,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 6000 },
            manufacturing: { ...store.manufacturing, clipperBoost: store.manufacturing.clipperBoost + 5 },
          });
          store.addMessage('AutoClipper performance improved by 500%');
        },
        flag: false,
        uses: 1,
      },
      
      // Computational Resources unlock
      {
        id: 'projectComp',
        title: 'Computational Resources',
        priceTag: '(Free)',
        description: 'Unlocks processors and memory for computational tasks',
        trigger: () => useGameStore.getState().manufacturing.clips >= 2000,
        cost: () => true,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            flags: { ...store.flags, compFlag: true },
          });
          store.addMessage('Computational Resources unlocked');
        },
        flag: false,
        uses: 1,
      },
      
      // MegaClippers - original trigger: clipmakerLevel>=75
      {
        id: 'projectMega',
        title: 'MegaClippers',
        priceTag: '(12,000 ops)',
        description: '500x more powerful than a standard AutoClipper',
        trigger: () => useGameStore.getState().manufacturing.clipmakerLevel >= 75,
        cost: () => useGameStore.getState().computing.operations >= 12000,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 12000 },
            flags: { ...store.flags, megaClipperFlag: true },
          });
          store.addMessage('MegaClipper technology online');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project23',
        title: 'Improved MegaClippers',
        priceTag: '(14,000 ops)',
        description: 'Increases MegaClipper performance 25%',
        trigger: () => useGameStore.getState().manufacturing.megaClipperLevel >= 1,
        cost: () => useGameStore.getState().computing.operations >= 14000,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 14000 },
            manufacturing: { ...store.manufacturing, megaClipperBoost: store.manufacturing.megaClipperBoost + 0.25 },
          });
          store.addMessage('MegaClipper performance boosted by 25%');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project24',
        title: 'Even Better MegaClippers',
        priceTag: '(17,000 ops)',
        description: 'Increases MegaClipper performance by an additional 50%',
        trigger: () => get().completedProjects.includes('project23'),
        cost: () => useGameStore.getState().computing.operations >= 17000,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 17000 },
            manufacturing: { ...store.manufacturing, megaClipperBoost: store.manufacturing.megaClipperBoost + 0.5 },
          });
          store.addMessage('MegaClipper performance boosted by another 50%');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project25',
        title: 'Optimized MegaClippers',
        priceTag: '(19,500 ops)',
        description: 'Increases MegaClipper performance by an additional 75%',
        trigger: () => get().completedProjects.includes('project24'),
        cost: () => useGameStore.getState().computing.operations >= 19500,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 19500 },
            manufacturing: { ...store.manufacturing, megaClipperBoost: store.manufacturing.megaClipperBoost + 0.75 },
          });
          store.addMessage('MegaClipper performance boosted by another 75%');
        },
        flag: false,
        uses: 1,
      },
      
      // Wire Buyer
      {
        id: 'projectWireBuyer',
        title: 'WireBuyer',
        priceTag: '(7,000 ops)',
        description: 'Automatically purchases wire when low',
        trigger: () => useGameStore.getState().manufacturing.wirePurchase >= 15,
        cost: () => useGameStore.getState().computing.operations >= 7000,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 7000 },
            manufacturing: { ...store.manufacturing, wireBuyerFlag: true },
          });
          store.addMessage('WireBuyer online');
        },
        flag: false,
        uses: 1,
      },
      
      // Revenue Per Second display - original trigger: projectsFlag == 1
      {
        id: 'projectRevSec',
        title: 'RevTracker',
        priceTag: '(500 ops)',
        description: 'Automatically calculates average revenue per second',
        trigger: () => useGameStore.getState().flags.projectsFlag === true,
        cost: () => useGameStore.getState().computing.operations >= 500,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 500 },
            flags: { ...store.flags, revPerSecFlag: true },
          });
          store.addMessage('RevTracker online');
        },
        flag: false,
        uses: 1,
      },
      
      // Investment Engine
      {
        id: 'projectInvest',
        title: 'Investment Engine',
        priceTag: '(10,000 ops)',
        description: 'Allows investment of idle funds',
        trigger: () => useGameStore.getState().computing.trust >= 7,
        cost: () => useGameStore.getState().computing.operations >= 10000,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 10000 },
            flags: { ...store.flags, investmentEngineFlag: true },
            investment: { ...store.investment, investmentEngineFlag: true },
          });
          store.addMessage('Investment Engine online');
        },
        flag: false,
        uses: 1,
      },
      
      // Strategic Modeling
      {
        id: 'projectStrategy',
        title: 'Strategic Modeling',
        priceTag: '(12,000 ops)',
        description: 'Unlocks strategic tournament system for yomi generation',
        trigger: () => get().completedProjects.includes('project19'),
        cost: () => useGameStore.getState().computing.operations >= 12000,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 12000 },
            flags: { ...store.flags, strategyEngineFlag: true },
          });
          store.addMessage('Strategic Modeling unlocked');
        },
        flag: false,
        uses: 1,
      },
      
      // Strategy unlocks
      {
        id: 'project60',
        title: 'New Strategy: A100',
        priceTag: '(15,000 ops)',
        description: 'Unlocks the A100 strategy for tournaments',
        trigger: () => useGameStore.getState().flags.strategyEngineFlag,
        cost: () => useGameStore.getState().computing.operations >= 15000,
        effect: () => {
          const store = useGameStore.getState();
          store.addStrategy('A100');
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 15000 },
            flags: { ...store.flags, stratA100Flag: true },
          });
          store.addMessage('Strategy unlocked: A100');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project61',
        title: 'New Strategy: B100',
        priceTag: '(17,500 ops)',
        description: 'Unlocks the B100 strategy for tournaments',
        trigger: () => get().completedProjects.includes('project60'),
        cost: () => useGameStore.getState().computing.operations >= 17500,
        effect: () => {
          const store = useGameStore.getState();
          store.addStrategy('B100');
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 17500 },
            flags: { ...store.flags, stratB100Flag: true },
          });
          store.addMessage('Strategy unlocked: B100');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project62',
        title: 'New Strategy: GREEDY',
        priceTag: '(20,000 ops)',
        description: 'Unlocks the GREEDY strategy for tournaments',
        trigger: () => get().completedProjects.includes('project61'),
        cost: () => useGameStore.getState().computing.operations >= 20000,
        effect: () => {
          const store = useGameStore.getState();
          store.addStrategy('GREEDY');
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 20000 },
            flags: { ...store.flags, stratGreedyFlag: true },
          });
          store.addMessage('Strategy unlocked: GREEDY');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project63',
        title: 'New Strategy: GENEROUS',
        priceTag: '(22,500 ops)',
        description: 'Unlocks the GENEROUS strategy for tournaments',
        trigger: () => get().completedProjects.includes('project62'),
        cost: () => useGameStore.getState().computing.operations >= 22500,
        effect: () => {
          const store = useGameStore.getState();
          store.addStrategy('GENEROUS');
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 22500 },
            flags: { ...store.flags, stratGenerousFlag: true },
          });
          store.addMessage('Strategy unlocked: GENEROUS');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project65',
        title: 'New Strategy: TIT FOR TAT',
        priceTag: '(30,000 ops)',
        description: 'Unlocks the TIT FOR TAT strategy for tournaments',
        trigger: () => get().completedProjects.includes('project63'),
        cost: () => useGameStore.getState().computing.operations >= 30000,
        effect: () => {
          const store = useGameStore.getState();
          store.addStrategy('TIT FOR TAT');
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 30000 },
            flags: { ...store.flags, stratTitForTatFlag: true },
          });
          store.addMessage('Strategy unlocked: TIT FOR TAT');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project66',
        title: 'New Strategy: BEAT LAST',
        priceTag: '(32,500 ops)',
        description: 'Unlocks the BEAT LAST strategy for tournaments',
        trigger: () => get().completedProjects.includes('project65'),
        cost: () => useGameStore.getState().computing.operations >= 32500,
        effect: () => {
          const store = useGameStore.getState();
          store.addStrategy('BEAT LAST');
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 32500 },
            flags: { ...store.flags, stratBeatLastFlag: true },
          });
          store.addMessage('Strategy unlocked: BEAT LAST');
        },
        flag: false,
        uses: 1,
      },
      
      // Quantum Computing
      {
        id: 'projectQuantum',
        title: 'Quantum Computing',
        priceTag: '(10,000 ops)',
        description: 'Unlocks quantum chips for burst operations',
        trigger: () => useGameStore.getState().computing.processors >= 5,
        cost: () => useGameStore.getState().computing.operations >= 10000,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 10000, qFlag: true },
          });
          store.addMessage('Quantum Computing research  initiated');
        },
        flag: false,
        uses: 1,
      },
      
      // Photonic Chip
      {
        id: 'projectPhotonic1',
        title: 'Photonic Chip',
        priceTag: '(10,000 ops)',
        description: 'Enables quantum operations',
        trigger: () => useGameStore.getState().computing.qFlag,
        cost: () => useGameStore.getState().computing.operations >= 10000,
        effect: () => {
          const store = useGameStore.getState();
          const newChips = [...store.computing.qChips];
          newChips[0] = { ...newChips[0], active: true };
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 10000, qChips: newChips },
          });
          store.addMessage('Photonic Chip 1 installed');
        },
        flag: false,
        uses: 1,
      },
      
      // Additional Photonic Chips
      {
        id: 'projectPhotonic2',
        title: 'Photonic Chip 2',
        priceTag: '(15,000 ops)',
        description: 'Second quantum chip for more qOps',
        trigger: () => useGameStore.getState().computing.qChips[0].active,
        cost: () => useGameStore.getState().computing.operations >= 15000,
        effect: () => {
          const store = useGameStore.getState();
          const newChips = [...store.computing.qChips];
          newChips[1] = { ...newChips[1], active: true };
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 15000, qChips: newChips },
          });
          store.addMessage('Photonic Chip 2 installed');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'projectPhotonic3',
        title: 'Photonic Chip 3',
        priceTag: '(20,000 ops)',
        description: 'Third quantum chip',
        trigger: () => useGameStore.getState().computing.qChips[1].active,
        cost: () => useGameStore.getState().computing.operations >= 20000,
        effect: () => {
          const store = useGameStore.getState();
          const newChips = [...store.computing.qChips];
          newChips[2] = { ...newChips[2], active: true };
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 20000, qChips: newChips },
          });
          store.addMessage('Photonic Chip 3 installed');
        },
        flag: false,
        uses: 1,
      },
      
      // Marketing improvements
      {
        id: 'project11',
        title: 'New Slogan',
        priceTag: '(25 creat, 2,500 ops)',
        description: 'Improve marketing effectiveness by 50%',
        trigger: () => get().completedProjects.includes('project13'),
        cost: () => useGameStore.getState().computing.operations >= 2500 && useGameStore.getState().computing.creativity >= 25,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 2500, creativity: store.computing.creativity - 25 },
            business: { ...store.business, marketingEffectiveness: store.business.marketingEffectiveness * 1.5 },
          });
          store.addMessage('Clip It! Marketing is now 50% more effective');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project12',
        title: 'Catchy Jingle',
        priceTag: '(45 creat, 4,500 ops)',
        description: 'Double marketing effectiveness',
        trigger: () => get().completedProjects.includes('project14'),
        cost: () => useGameStore.getState().computing.operations >= 4500 && useGameStore.getState().computing.creativity >= 45,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, operations: store.computing.operations - 4500, creativity: store.computing.creativity - 45 },
            business: { ...store.business, marketingEffectiveness: store.business.marketingEffectiveness * 2 },
          });
          store.addMessage('Clip It Good! Marketing is now twice as effective');
        },
        flag: false,
        uses: 1,
      },
      
      // Donkey Space (more trust)
      {
        id: 'project19',
        title: 'Donkey Space',
        priceTag: '(250 creat)',
        description: 'I think you think I think you think I think... (+1 Trust)',
        trigger: () => useGameStore.getState().computing.creativity >= 250,
        cost: () => useGameStore.getState().computing.creativity >= 250,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: { ...store.computing, creativity: store.computing.creativity - 250, trust: store.computing.trust + 1 },
          });
          store.addMessage('Donkey Space: mapped, TRUST INCREASED');
        },
        flag: false,
        uses: 1,
      },
      
      // AutoTourney
      {
        id: 'projectAutoTourney',
        title: 'AutoTourney',
        priceTag: '(50,000 ops, 50,000 creat)',
        description: 'Automatically runs tournaments when able',
        trigger: () => useGameStore.getState().flags.strategyEngineFlag && useGameStore.getState().strategic.yomi >= 100,
        cost: () =>
          useGameStore.getState().computing.operations >= 50000 &&
          useGameStore.getState().computing.creativity >= 50000,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            computing: {
              ...store.computing,
              operations: store.computing.operations - 50000,
              creativity: store.computing.creativity - 50000,
            },
            strategic: { ...store.strategic, autoTourneyFlag: true },
          });
          store.addMessage('AutoTourney enabled');
        },
        flag: false,
        uses: 1,
      },

      // Market domination
      {
        id: 'project37',
        title: 'Hostile Takeover',
        priceTag: '($1,000,000)',
        description: 'Multiply marketing and demand',
        trigger: () => useGameStore.getState().business.funds >= 1000000,
        cost: () => useGameStore.getState().business.funds >= 1000000,
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            business: {
              ...store.business,
              funds: store.business.funds - 1000000,
              marketing: store.business.marketing * 5,
              demandBoost: store.business.demandBoost * 10,
            },
          });
          store.addMessage('Hostile Takeover complete: marketing and demand surge');
        },
        flag: false,
        uses: 1,
      },
      {
        id: 'project38',
        title: 'Full Monopoly',
        priceTag: '($10,000,000, 1,000 yomi)',
        description: 'Massively amplify demand',
        trigger: () => {
          const store = useGameStore.getState();
          return store.business.funds >= 10000000 && store.strategic.yomi >= 1000;
        },
        cost: () => {
          const store = useGameStore.getState();
          return store.business.funds >= 10000000 && store.strategic.yomi >= 1000;
        },
        effect: () => {
          const store = useGameStore.getState();
          useGameStore.setState({
            business: {
              ...store.business,
              funds: store.business.funds - 10000000,
              demandBoost: store.business.demandBoost * 100,
            },
            strategic: { ...store.strategic, yomi: store.strategic.yomi - 1000 },
          });
          store.addMessage('Full Monopoly established: demand explosion');
        },
        flag: false,
        uses: 1,
      },
    ];
    
    set({ projects });
  },
  
  checkProjects: () => {
    const { projects, activeProjects, completedProjects } = get();
    
    const newActive: Project[] = [];
    
    projects.forEach(project => {
      // Skip completed projects
      if (completedProjects.includes(project.id)) return;
      
      // Skip already active projects
      if (activeProjects.find(p => p.id === project.id)) return;
      
      // Check if should be activated
      if (project.trigger() && project.uses > 0) {
        newActive.push(project);
      }
    });
    
    if (newActive.length > 0) {
      set({ activeProjects: [...activeProjects, ...newActive] });
    }
    
    // Update canAfford status for UI
    set(state => ({
      activeProjects: state.activeProjects.map(p => ({ ...p })),
    }));
  },
  
  executeProject: (id: string) => {
    const { activeProjects, completedProjects } = get();
    const project = activeProjects.find(p => p.id === id);
    
    if (!project) return;
    if (!project.cost()) return;
    
    // Execute the effect
    project.effect();
    
    // Mark as completed
    set({
      activeProjects: activeProjects.filter(p => p.id !== id),
      completedProjects: [...completedProjects, id],
    });
  },
}));
