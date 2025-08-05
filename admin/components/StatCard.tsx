
import React from 'react';
import Card from '../../components/Card';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    return (
        <Card className="p-5">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-slate-100 ${color}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-600">{title}</p>
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                </div>
            </div>
        </Card>
    );
};

export default StatCard;