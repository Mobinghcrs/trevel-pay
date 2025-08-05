
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const baseClasses =
    'bg-white border border-slate-200/80 rounded-xl shadow-lg overflow-hidden transition-all duration-300';
  const interactiveClasses = onClick
    ? 'cursor-pointer hover:shadow-xl hover:border-slate-300 hover:-translate-y-px'
    : '';

  return (
    <div className={`${baseClasses} ${interactiveClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;