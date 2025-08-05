
import React from 'react';
import { P2PCurrencyType } from '../../../types';
import Card from '../../../components/Card';
import { ICONS } from '../../../constants';

interface P2PSelectionPageProps {
  onSelect: (type: P2PCurrencyType) => void;
}

const SelectionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
  <Card onClick={onClick} className="p-8 text-center flex flex-col items-center border-slate-200 hover:border-teal-500">
    <div className="p-4 bg-slate-100 rounded-full text-teal-600 mb-4">
      <div className="h-10 w-10">{icon}</div>
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </Card>
);

const P2PSelectionPage: React.FC<P2PSelectionPageProps> = ({ onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">P2P Trading</h2>
        <p className="text-slate-600 mt-1">Choose the type of currency you want to trade.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SelectionCard
          title="Digital Currency"
          description="Trade cryptocurrencies like USDT with other users."
          icon={ICONS.bitcoin}
          onClick={() => onSelect('digital')}
        />
        <SelectionCard
          title="Physical Currency"
          description="Exchange fiat currencies like USD or EUR with local users."
          icon={ICONS.bank}
          onClick={() => onSelect('physical')}
        />
      </div>
    </div>
  );
};

export default P2PSelectionPage;