

import React from 'react';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactElement;
    color: 'green' | 'blue' | 'yellow' | 'violet';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    
    const colorClasses = {
        green: 'bg-green-100 text-green-600',
        blue: 'bg-blue-100 text-blue-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        violet: 'bg-violet-100 text-violet-600',
    };

    // Clone the icon to enforce a consistent size.
    const sizedIcon = React.cloneElement(icon, Object.assign({}, icon.props, { className: "h-6 w-6" }));

    return (
        <Card>
            <div className="p-5 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                </div>
                <div className={`flex items-center justify-center h-12 w-12 rounded-full ${colorClasses[color]}`}>
                    {sizedIcon}
                </div>
            </div>
            <div className="px-5 py-2 bg-slate-50 border-t border-slate-200">
                <a href="#" className="text-xs font-medium text-teal-600 hover:text-teal-500 flex items-center gap-1">
                    View Details {ICONS.arrowRight}
                </a>
            </div>
        </Card>
    );
};

export default StatCard;