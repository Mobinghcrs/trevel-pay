
import React, { useState, useEffect, useCallback } from 'react';
import { CryptoCurrency, PhysicalCurrency } from '../../types';
import { getCryptoPrices, getPhysicalRates } from '../../services/apiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import Sparkline from '../../components/Sparkline';
import { ICONS } from '../../constants';

const ChangeIndicator: React.FC<{ value: number }> = ({ value }) => {
  const isPositive = value >= 0;
  return (
    <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      {isPositive ? ICONS.chevronUp : ICONS.chevronDown}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
};

const MarketRates: React.FC = () => {
  const [crypto, setCrypto] = useState<CryptoCurrency[]>([]);
  const [physical, setPhysical] = useState<PhysicalCurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cryptoData, physicalData] = await Promise.all([
        getCryptoPrices(),
        getPhysicalRates()
      ]);
      setCrypto(cryptoData);
      setPhysical(physicalData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <Spinner message="Fetching latest market data..." />;
  }

  if (error && !crypto.length && !physical.length) {
    return <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-white border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Top Cryptocurrencies</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {crypto.map((c) => (
            <div key={c.symbol} className="p-4 grid grid-cols-3 items-center gap-4">
              <div className="col-span-1">
                <p className="font-bold text-gray-800">{c.name}</p>
                <p className="text-sm text-gray-500">{c.symbol}</p>
              </div>
               <div className="col-span-1">
                {c.history && <Sparkline data={c.history} color={c.change24h >= 0 ? '#22c55e' : '#ef4444'} />}
              </div>
              <div className="text-right col-span-1">
                <p className="font-mono text-gray-800">${c.priceUSD.toLocaleString()}</p>
                <ChangeIndicator value={c.change24h} />
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="bg-white border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Fiat Exchange Rates (vs USD)</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {physical.map((p) => (
            <div key={p.code} className="p-4 grid grid-cols-3 items-center gap-4">
              <div className="col-span-1">
                <p className="font-bold text-gray-800">{p.currency}</p>
                <p className="text-sm text-gray-500">{p.code}</p>
              </div>
              <div className="col-span-1">
                 {p.history && <Sparkline data={p.history} color={'#6b7280'} />}
              </div>
              <div className="text-right col-span-1">
                <p className="font-mono text-gray-800">{p.rate.toFixed(4)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MarketRates;