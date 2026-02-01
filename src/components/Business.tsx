import { useGameStore } from '../store/gameStore';
import { formatMoney, formatNumber } from '../utils/format';
import './Section.css';

export function Business() {
  const { 
    funds, margin, demand, marketingLvl, adCost, unsoldClips, 
    avgRev, avgSales 
  } = useGameStore((s) => s.business);
  
  const { revPerSecFlag } = useGameStore((s) => s.flags);
  
  const raisePrice = useGameStore((s) => s.raisePrice);
  const lowerPrice = useGameStore((s) => s.lowerPrice);
  const buyMarketing = useGameStore((s) => s.buyMarketing);
  
  return (
    <div className="section">
      <h3>Business</h3>
      <hr />
      
      <p>Available Funds: $<span className="value">{formatMoney(funds)}</span></p>
      
      {revPerSecFlag && (
        <>
          <p className="small">Avg. Rev. per sec: ${formatMoney(avgRev)}</p>
          <p className="small">Avg. Clips Sold per sec: {formatNumber(avgSales)}</p>
        </>
      )}
      
      <p>Unsold Inventory: <span className="value">{formatNumber(unsoldClips)}</span></p>
      
      <div className="price-controls">
        <button onClick={lowerPrice} disabled={margin <= 0.01}>lower</button>
        <button onClick={raisePrice}>raise</button>
        {/* Original uses margin.toFixed(2) which shows "0.25" for values < 1 */}
        <span> Price per Clip: $ {margin.toFixed(2)}</span>
      </div>
      
      <p>Public Demand: <span className="value">{Math.round(demand * 10)}%</span></p>
      
      <div className="marketing-section">
        <button 
          onClick={buyMarketing}
          disabled={funds < adCost}
        >
          Marketing
        </button>
        <span className="level"> Level: {marketingLvl}</span>
        <p className="cost">Cost: $ {adCost.toFixed(2)}</p>
      </div>
    </div>
  );
}
