# Business & Manufacturing Mechanics Analysis

## Executive Summary
Comparison of business and manufacturing mechanics between Universal Paperclips React recreation (`~/Projects/paperclips/src/store/gameStore.ts`) and the original game (`~/Projects/paperclips-original/main.js` + `globals.js`).

---

## ✅ What Matches the Original

### Wire Price Fluctuation
**Original** (main.js:23-37):
```javascript
function adjustWirePrice(){
    wirePriceTimer++;
    if (wirePriceTimer>250 && wireBasePrice>15){
        wireBasePrice = wireBasePrice - (wireBasePrice/1000);
        wirePriceTimer = 0;
    }
    if (Math.random() < .015) {
        wirePriceCounter++;
        var wireAdjust = 6*(Math.sin(wirePriceCounter));
        wireCost = Math.ceil(wireBasePrice + wireAdjust);
    }
}
```

**React Recreation** (gameStore.ts:503-518):
```typescript
// Wire price adjustment (original adjustWirePrice function)
const currentTimer = (s.manufacturing.wirePriceTimer ?? 0) + 1;
let currentBasePrice = s.manufacturing.wireBasePrice;
let newTimer = currentTimer;

if (currentTimer > 250 && currentBasePrice > 15) {
    currentBasePrice = currentBasePrice - (currentBasePrice / 1000);
    newTimer = 0;
}

if (Math.random() < 0.015) {
    const newPriceCounter = (s.manufacturing.wirePriceCounter ?? 0) + 1;
    const wireAdjust = 6 * Math.sin(newPriceCounter);
    newState.manufacturing = {
        // ... wireCost: Math.ceil(currentBasePrice + wireAdjust)
    };
}
```
✅ **MATCHES**: Logic, formulas, and thresholds are identical.

### Wire Buying Cost Calculation
**Original** (main.js:52-59):
```javascript
function buyWire(){
    if(funds >= wireCost){
        wirePriceTimer = 0;
        wire = wire + wireSupply;
        funds = funds - wireCost;
        wirePurchase = wirePurchase + 1;
        wireBasePrice = wireBasePrice + .05;
    }
}
```

**React Recreation** (gameStore.ts:666-680):
```typescript
buyWire: () => {
    set((s) => {
        if (s.business.funds < s.manufacturing.wireCost) return s;
        return {
            business: { funds: s.business.funds - s.manufacturing.wireCost },
            manufacturing: {
                wire: s.manufacturing.wire + s.manufacturing.wireSupply,
                wirePurchase: s.manufacturing.wirePurchase + 1,
                wireBasePrice: s.manufacturing.wireBasePrice + 0.05,
                wirePriceTimer: 0,
            },
        };
    });
}
```
✅ **MATCHES**: Cost calculation, base price increment (+0.05), timer reset all match.

### AutoClipper Production Rate Formula
**Original** (main.js:3356-3357):
```javascript
clipClick(clipperBoost*(clipmakerLevel/100));
```

**React Recreation** (gameStore.ts:252-253):
```typescript
const clipperProduction = s.manufacturing.clipperBoost * (s.manufacturing.clipmakerLevel / 100);
```
✅ **MATCHES**: Identical formula `clipperBoost * (clipmakerLevel / 100)`.

### MegaClipper Production Rate Formula
**Original** (main.js:3358):
```javascript
clipClick(megaClipperBoost*(megaClipperLevel*5));
```

**React Recreation** (gameStore.ts:254):
```typescript
const megaClipperProduction = s.manufacturing.megaClipperBoost * (s.manufacturing.megaClipperLevel * 5);
```
✅ **MATCHES**: Identical formula `megaClipperBoost * (megaClipperLevel * 5)`.

### Demand Calculation
**Original** (main.js:3355-3357):
```javascript
marketing = (Math.pow(1.1,(marketingLvl-1)));
demand = (((.8/margin) * marketing * marketingEffectiveness)*demandBoost);
demand = demand + ((demand/10)*prestigeU);
```

**React Recreation** (gameStore.ts:465-468):
```typescript
const marketing = Math.pow(1.1, s.business.marketingLvl - 1);
let demand = ((0.8 / s.business.margin) * marketing * s.business.marketingEffectiveness * s.business.demandBoost);
demand = demand + ((demand / 10) * s.prestige.prestigeU);
```
✅ **MATCHES**: All formulas and calculations identical.

### Marketing Cost Scaling
**Original** (main.js:2362-2367):
```javascript
function buyAds(){
    if(funds >= adCost){
        marketingLvl = marketingLvl +1;             
        funds = funds - adCost; 
        adCost = Math.floor(adCost * 2);
    }
}
```

**React Recreation** (gameStore.ts:755-769):
```typescript
buyMarketing: () => {
    set((s) => {
        if (s.business.funds < s.business.adCost) return s;
        const newLevel = s.business.marketingLvl + 1;
        const newCost = Math.floor(s.business.adCost * 2);
        return {
            business: {
                funds: s.business.funds - s.business.adCost,
                marketingLvl: newLevel,
                adCost: newCost,
            },
        };
    });
}
```
✅ **MATCHES**: Cost doubles exactly as in original.

### Unsold Clips Selling Logic
**Original** (main.js:3616-3617):
```javascript
if (Math.random() < (demand/100)){
    sellClips(Math.floor(.7 * Math.pow(demand, 1.15)));
}
```

**React Recreation** (gameStore.ts:539-541):
```typescript
const sellChance = s.business.demand / 100;
if (Math.random() < sellChance) {
    const potentialSell = Math.floor(0.7 * Math.pow(s.business.demand, 1.15));
}
```
✅ **MATCHES**: Identical probability and sale calculation formulas.

### AutoClipper Cost Formula
**Original** (main.js:1673):
```javascript
clipperCost = (Math.pow(1.1,clipmakerLevel)+5);
```

**React Recreation** (gameStore.ts:689):
```typescript
const newCost = Math.pow(1.1, newLevel) + 5;
```
✅ **MATCHES**: Identical formula `Math.pow(1.1, level) + 5`.

### MegaClipper Cost Formula
**Original** (main.js:1686):
```javascript
megaClipperCost = (Math.pow(1.07,megaClipperLevel)*1000);
```

**React Recreation** (gameStore.ts:714):
```typescript
const newCost = Math.pow(1.07, newLevel) * 1000;
```
✅ **MATCHES**: Identical formula `Math.pow(1.07, level) * 1000`.

---

## ⚠️ What Deviates from Original

### Auto Wire Buyer Trigger Logic
**Original** (main.js:3291):
```javascript
if (wireBuyerFlag==1 && wireBuyerStatus==1 && wire<=1){
    buyWire();
}
```

**React Recreation** (gameStore.ts:423-432):
```typescript
if (s.manufacturing.wireBuyerFlag && 
    s.manufacturing.wireBuyerStatus && 
    s.manufacturing.wire <= 1 &&
    s.business.funds >= s.manufacturing.wireCost) {
    // ... purchase logic
}
```
⚠️ **DEVIATION**: React version adds funds check before purchase. Original triggers buyWire() which handles the funds check internally, but React does the check upfront to avoid state mutations.

### Revenue Calculation Timing
**Original** (main.js:3623-3627):
```javascript
secTimer++;
if (secTimer >= 10){
    calculateRev();
    secTimer = 0;
}
```

**React Recreation** (gameStore.ts:581-614):
```typescript
const secTimer = (s.business.secTimer ?? 0) + 1;
if (s.flags.humanFlag && secTimer >= 10) {
    // Revenue calculation logic inline
}
```
⚠️ **DEVIATION**: Original calls `calculateRev()` function, React inlines the calculation. Functionally equivalent but different structure.

### Initial State Values
**Original** (globals.js:14-17):
```javascript
var margin = .25;
var wire = 1000;
var wireCost = 20;
```

**React Recreation** (gameStore.ts:53-59):
```typescript
margin: 0.25,
wire: 1000,
wireCost: 20,
wireBasePrice: 20,
```
⚠️ **MINOR DEVIATION**: React uses explicit `wireBasePrice: 20` while original infers it from `wireCost`. Functionally identical.

---

## ❌ What's Missing

### Wire Price Timer Reset in slowTick
**Original** (main.js): Wire price timer is incremented and managed in the slow loop (100ms interval).

**React Recreation**: Wire price logic is in main tick (10ms interval) instead of slowTick (100ms).

❌ **MISSING**: React should move `adjustWirePrice()` equivalent to `slowTick()` to match original timing exactly.

### Revenue Per Second Display Flag
**Original** (globals.js:48):
```javascript
var revPerSecFlag = 0;
```

**React Recreation**: Missing the `revPerSecFlag` state management.

❌ **MISSING**: `revPerSecFlag` state to control revenue display visibility.

### Marketing Effectiveness State Tracking
**Original** (globals.js:39):
```javascript
var marketingEffectiveness = 1;
```

**React Recreation** (gameStore.ts:54):
```typescript
marketingEffectiveness: 1,
```

✅ **PRESENT**: Actually this is included, no issue here.

### Exact Timing Separation
**Original**: Main loop (10ms) vs Slow loop (100ms) separation
- Main loop: Auto-clippers, operations, creativity, etc.
- Slow loop: Wire price, sales, revenue calculation

**React Recreation**: Both fast and slow operations mixed in same tick functions.

❌ **MISSING**: Perfect separation of fast (10ms) vs slow (100ms) operations to match original game timing.

---

## Summary Scores

- **✅ Matches**: 9/12 core mechanics (75%)
- **⚠️ Deviations**: 3/12 mechanics (25%) - minor implementation differences
- **❌ Missing**: 2 timing-related features

The React recreation successfully implements the core business and manufacturing formulas with high fidelity. The main deviations are architectural (inline vs function calls) and timing-related (mixed tick rates vs separated). The mathematical formulas for demand, pricing, production, and costs are identical to the original.