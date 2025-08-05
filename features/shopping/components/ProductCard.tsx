import React from 'react';
import { Product } from '../../../types';
import Card from '../../../components/Card';

interface ProductCardProps {
  product: Product;
  onSelect: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <Card onClick={onSelect} className="flex flex-col group overflow-hidden border-slate-200">
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-110" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div>
            <span className="text-xs font-semibold text-sky-600 uppercase">{product.category}</span>
            <h3 className="text-lg font-bold text-slate-800 truncate">{product.name}</h3>
        </div>
        <div className="mt-auto flex justify-between items-end pt-2">
          <p className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</p>
          <button className="text-sm font-semibold text-sky-700 bg-sky-100 hover:bg-sky-200 px-3 py-1.5 rounded-md transition-colors">
            View
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;