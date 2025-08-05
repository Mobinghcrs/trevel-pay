
import React from 'react';
import { RevenueDataPoint } from '../../../types';

interface LineChartProps {
  data: RevenueDataPoint[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 p-8">No data available to display chart.</div>;
  }

  const width = 500;
  const height = 250;
  const padding = 40;
  
  const maxValue = Math.max(...data.flatMap(d => [d.flights, d.hotels, d.exchange]));
  const yAxisMax = Math.ceil(maxValue / 10000) * 10000;

  const getX = (index: number) => padding + (index * (width - 2 * padding) / (data.length - 1));
  const getY = (value: number) => height - padding - (value / yAxisMax * (height - 2 * padding));

  const createPath = (key: keyof Omit<RevenueDataPoint, 'month'>) => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[key])}`).join(' ');
  };
  
  const colors = {
    flights: '#2dd4bf', // teal-400
    hotels: '#a78bfa',  // violet-400
    exchange: '#34d399' // emerald-400
  };

  return (
    <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`}>
            {/* Y-axis grid lines and labels */}
            {[...Array(5)].map((_, i) => {
                const y = height - padding - (i * (height - 2 * padding) / 4);
                const value = (yAxisMax / 4) * i;
                return (
                    <g key={i}>
                        <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,3" />
                        <text x={padding - 10} y={y + 3} textAnchor="end" fontSize="10" fill="#6b7280">
                            {`$${(value/1000)}k`}
                        </text>
                    </g>
                );
            })}
            {/* X-axis labels */}
            {data.map((d, i) => (
                <text key={d.month} x={getX(i)} y={height - padding + 15} textAnchor="middle" fontSize="10" fill="#6b7280">
                    {d.month}
                </text>
            ))}

            {/* Data paths */}
            <path d={createPath('flights')} fill="none" stroke={colors.flights} strokeWidth="2" />
            <path d={createPath('hotels')} fill="none" stroke={colors.hotels} strokeWidth="2" />
            <path d={createPath('exchange')} fill="none" stroke={colors.exchange} strokeWidth="2" />
        </svg>
        <div className="flex justify-center gap-4 text-xs mt-2">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: colors.flights}}></div><span className="text-gray-700">Flights</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: colors.hotels}}></div><span className="text-gray-700">Hotels</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: colors.exchange}}></div><span className="text-gray-700">Exchange</span></div>
        </div>
    </div>
  );
};

export default LineChart;