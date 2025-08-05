import React from 'react';
import { PromoSlide } from '../../types';
import { ICONS } from '../../constants';

interface PromoTableRowProps {
    slide: PromoSlide;
    onEdit: () => void;
    onDelete: () => void;
}

const PromoTableRow: React.FC<PromoTableRowProps> = ({ slide, onEdit, onDelete }) => {
    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{slide.title}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{slide.subtitle}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 capitalize flex items-center gap-2">
                <span className="text-cyan-500 h-5 w-5">
                    {ICONS[slide.icon as keyof typeof ICONS] || ICONS.logo}
                </span>
                {slide.icon}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 capitalize">{slide.link}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-4">
                    <button onClick={onEdit} className="text-cyan-600 hover:text-cyan-500 transition-colors flex items-center gap-1">
                        {ICONS.edit} Edit
                    </button>
                    <button onClick={onDelete} className="text-red-600 hover:text-red-500 transition-colors flex items-center gap-1">
                        {ICONS.trash} Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default PromoTableRow;
