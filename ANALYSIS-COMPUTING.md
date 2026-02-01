# Computing & Strategic Mechanics Analysis

## Original vs React Recreation Comparison

This analysis compares the computing and strategic mechanics between the original Universal Paperclips (main.js) and the React recreation (gameStore.ts).

---

## ✅ What Matches the Original

### Trust Calculation (Fibonacci Sequence)
- **Original** (main.js ~3140): 
  ```js
  function calculateTrust(){
      if (clips>(nextTrust-1)){
          trust = trust +1;
          displayMessage("Production target met: TRUST INCREASED, additional processor/memory capacity granted");
          var fibNext = fib1+fib2;
          nextTrust = fibNext*1000;
          fib1 = fib2;
          fib2 = fibNext;
      }
  }
  ```
- **Recreation** (gameStore.ts:299-309): ✅ **MATCHES EXACTLY**
  ```ts
  if (s.manufacturing.clips > (s.computing.nextTrust - 1)) {
    const fibNext = s.computing.fib1 + s.computing.fib2;
    newState.computing = {
      trust: s.computing.trust + 1,
      nextTrust: fibNext * 1000,
      fib1: s.computing.fib2,
      fib2: fibNext,
    };
  }
  ```

### Operations Per Tick Formula
- **Original** (main.js ~3160):
  ```js
  var opCycle = processors/10;  // Per 100ms tick
  ```
- **Recreation** (gameStore.ts:205): ✅ **MATCHES** 
  ```ts
  const opCycle = s.computing.processors / 100;  // Adjusted for 10ms tick
  ```
  *Correctly adjusted timing: original 100ms → recreation 10ms = divide by 10*

### Quantum Computing qChips Behavior
- **Original** (main.js ~95-110):
  ```js
  function quantumCompute(){
      qClock = qClock+.01;
      for (var i = 0; i<qChips.length; i++){
          qChips[i].value = Math.sin(qClock*qChips[i].waveSeed*qChips[i].active);
      }
  }
  ```
- **Recreation** (gameStore.ts:397-403): ✅ **MATCHES**
  ```ts
  const newQClock = s.computing.qClock + 0.01;
  const newQChips = s.computing.qChips.map(chip => ({
    value: chip.active ? Math.sin(newQClock * chip.waveSeed) : 0,
  }));
  ```

### qComp Computation Logic
- **Original** (main.js ~115-135):
  ```js
  var qq = Math.ceil(q*360);
  var buffer = (memory*1000) - standardOps;
  var damper = (tempOps/100)+5;
  if (qq>buffer) {
      tempOps = tempOps + Math.ceil(qq/damper) - buffer;
      qq = buffer;
  }
  standardOps = standardOps + qq;
  ```
- **Recreation** (gameStore.ts:906-922): ✅ **MATCHES EXACTLY**

### Processor Effects on Creativity Speed
- **Original** (main.js ~3148): 
  ```js
  creativitySpeed = Math.log10(processors) * Math.pow(processors,1.1) + processors-1;
  ```
- **Recreation** (gameStore.ts:877): ✅ **MATCHES**
  ```ts
  const newCreativitySpeed = Math.log10(newProcessors) * Math.pow(newProcessors, 1.1) + newProcessors - 1;
  ```

---

## ⚠️ What Deviates from Original

### Operations Calculation Structure
- **Original** (main.js ~3160): Complex tempOps overflow logic with opFade
  ```js
  function calculateOperations(){
      if (tempOps + standardOps < memory*1000){
          standardOps = standardOps + tempOps;
          tempOps = 0;
      }
      operations = Math.floor(standardOps + Math.floor(tempOps));
      // ... opFade logic for tempOps decay
  }
  ```
- **Recreation** (gameStore.ts:190-220): ⚠️ **SIMPLIFIED**
  ```ts
  // Merge tempOps into standardOps when there's room
  if (tempOps + standardOps < maxOps) {
    standardOps = standardOps + tempOps;
    tempOps = 0;
  }
  ```
  **Missing**: tempOps fade/decay mechanism (`opFade`, `opFadeTimer`, `opFadeDelay`)

### Creativity Calculation Timing
- **Original** (main.js ~2910):
  ```js
  function calculateCreativity(number){
      creativityCounter++;
      var creativityThreshold = 400;
      var s = prestigeS/10;
      var ss = creativitySpeed+(creativitySpeed*s);
      var creativityCheck = creativityThreshold/ss;
  }
  ```
- **Recreation** (gameStore.ts:234-254): ⚠️ **TIMING ADJUSTED**
  ```ts
  // We increment by 0.1 per 10ms tick to match original 1 per 100ms
  const creativityCounter = (newState.computing?.creativityCounter ?? s.computing.creativityCounter) + 0.1;
  ```
  **Issue**: Counter increment timing may not perfectly match original behavior

### Tournament Logic Simplification  
- **Original** (strategy section ~1080+): Full payoff matrix system with multiple strategies
  ```js
  function runTourney(){
      if (currentRound < rounds){
          round(currentRound);
      } else {
          pickWinner();    
          calculatePlaceScore();
          calculateShowScore();    
          declareWinner();    
      }    
  }
  ```
- **Recreation** (gameStore.ts:957-969): ⚠️ **OVERSIMPLIFIED**
  ```ts
  runTourney: () => {
    // Simplified tourney - generate yomi based on strategy
    const yomiGain = Math.floor(Math.random() * 50) + 10;
    return {
      strategic: {
        yomi: s.strategic.yomi + yomiGain,
        resultsFlag: true,
      },
    };
  },
  ```
  **Major Deviation**: No actual tournament simulation, just random yomi generation

---

## ❌ What's Missing

### 1. Complete Tournament System
**Original Features Missing**:
- Payoff matrix generation (`generateGrid()`)
- Strategy vs strategy competition
- Multiple AI strategies (A100, B100, GREEDY, GENEROUS, MINIMAX, TIT FOR TAT, BEAT LAST)
- Proper round-by-round simulation
- Strategy selection and performance tracking
- Win/place/show scoring system

### 2. tempOps Overflow System
**Original** (main.js ~3160):
```js
if (tempOps > 0){
    opFadeTimer++;
}
if (opFadeTimer > opFadeDelay && tempOps > 0) {
    opFade = opFade + Math.pow(3,3.5)/1000;
}
if (tempOps > 0) {
    tempOps = Math.round(tempOps - opFade);
}
```
**Missing**: Gradual tempOps decay system that prevents infinite operation accumulation

### 3. Prestige Bonus Effects
**Original** creativity calculation includes prestige bonus:
```js
var s = prestigeS/10;
var ss = creativitySpeed+(creativitySpeed*s);
```
**Missing**: Prestige system integration for creativity speed boost

### 4. Advanced qChips Features  
**Missing**:
- Individual qChip activation states (recreation assumes all active)
- qChip cost progression system
- Proper qChip upgrade mechanics

### 5. Strategic Engine Components
**Missing**:
- Strategy picker interface
- Auto-tournament system with timing
- Tournament results display and analysis
- Yomi-based upgrades beyond basic investment

### 6. Memory/Operations Edge Cases
**Original** has sophisticated overflow handling:
```js
if (standardOps > memory*1000){
    standardOps = memory*1000;
}
```
**Recreation**: Basic capping but missing nuanced overflow scenarios

---

## Summary

**Strong Points**: ✅
- Core mathematical formulas are faithfully reproduced
- Trust/Fibonacci progression works correctly  
- Basic operations generation matches original
- qChips sine wave behavior is accurate

**Weak Points**: ⚠️❌
- Tournament system is completely gutted (random yomi vs real strategy competition)
- Missing advanced operations overflow mechanics
- No prestige system integration
- Simplified creativity timing may cause drift
- Missing strategic depth and player agency in tournaments

**Recommendation**: The basic computational mechanics work well, but the strategic layer needs significant expansion to match the original's depth and player engagement.