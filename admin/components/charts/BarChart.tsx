
import React from 'react';
import { P2PVolume } from '../../../types';

interface BarChartProps {
  data: P2PVolume;
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const { buyVolume, sellVolume } = data;
  const totalVolume = buyVolume + sellVolume;
  const buyPercentage = totalVolume > 0 ? (buyVolume / totalVolume) * 100 : 0;
  const sellPercentage = totalVolume > 0 ? (sellVolume / totalVolume) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-gray-700">Buy Volume</span>
          <span className="font-mono text-green-600">${buyVolume.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${buyPercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-gray-700">Sell Volume</span>
          <span className="font-mono text-red-600">${sellVolume.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-red-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${sellPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;