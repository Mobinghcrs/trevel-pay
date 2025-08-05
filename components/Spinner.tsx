
import React from 'react';

interface SpinnerProps {
    message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="w-12 h-12 rounded-full animate-spin border-4 border-dashed border-teal-600 border-t-transparent"></div>
      <p className="text-slate-500">{message}</p>
    </div>
  );
};

export default Spinner;