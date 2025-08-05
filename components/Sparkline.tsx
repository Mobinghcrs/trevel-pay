import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 100,
  height = 30,
  color = '#a0aec0', // gray-500
}) => {
  if (!data || data.length < 2) {
    return null;
  }

  const yMin = Math.min(...data);
  const yMax = Math.max(...data);
  const xStep = width / (data.length - 1);

  const gety = (y: number) => {
    // Adding a small padding (2px) to prevent clipping at the very top/bottom
    const paddedHeight = height - 4;
    if (yMax === yMin) {
      return paddedHeight / 2 + 2;
    }
    return paddedHeight - ((y - yMin) / (yMax - yMin)) * paddedHeight + 2;
  };

  const path = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * xStep} ${gety(d)}`)
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};

export default Sparkline;
