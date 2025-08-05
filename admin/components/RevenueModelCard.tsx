import React from 'react';
import { FeeModel } from '../../types';

interface RevenueModelCardProps {
    title: string;
    feeModel: FeeModel;
    onChange: (newModel: FeeModel) => void;
    compact?: boolean;
}

const RevenueModelCard: React.FC<RevenueModelCardProps> = ({ title, feeModel, onChange, compact = false }) => {
    
    const handleTypeChange = (type: 'fixed' | 'percentage') => {
        onChange({ ...feeModel, type });
    };

    const handleValueChange = (value: string) => {
        onChange({ ...feeModel, value: parseFloat(value) || 0 });
    };

    const isFixed = feeModel.type === 'fixed';

    return (
        <div className={`bg-white border border-slate-200 rounded-lg p-5 flex flex-col ${compact ? '' : 'h-full'}`}>
            <h3 className={`font-bold text-slate-900 ${compact ? 'text-base mb-3' : 'text-lg mb-4'}`}>{title}</h3>
            
            <div className="flex bg-slate-100 rounded-md p-1 mb-4">
                <button 
                    onClick={() => handleTypeChange('fixed')}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded transition-colors ${isFixed ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                    Fixed Fee
                </button>
                <button 
                    onClick={() => handleTypeChange('percentage')}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded transition-colors ${!isFixed ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                    Percentage
                </button>
            </div>

            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-slate-500">{isFixed ? '$' : '%'}</span>
                </div>
                <input
                    type="number"
                    value={feeModel.value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    step={isFixed ? '0.01' : '0.1'}
                    min="0"
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>
            <p className={`text-xs text-slate-500 mt-2 ${compact ? 'hidden' : ''}`}>
                {isFixed 
                    ? `A flat fee charged for every transaction.`
                    : `A percentage of the total transaction value.`
                }
            </p>
        </div>
    );
};

export default RevenueModelCard;