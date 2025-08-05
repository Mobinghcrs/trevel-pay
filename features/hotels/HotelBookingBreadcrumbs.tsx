
import React from 'react';
import { HotelBookingStep } from '../../types';

interface BookingBreadcrumbsProps {
  currentStep: HotelBookingStep;
}

const Step: React.FC<{
  label: string;
  isComplete: boolean;
  isActive: boolean;
}> = ({ label, isComplete, isActive }) => {
  const baseClasses = "text-sm font-semibold transition-colors duration-200";
  let stateClasses = "text-slate-500";
  if (isActive) {
    stateClasses = "text-sky-500 font-bold";
  } else if (isComplete) {
    stateClasses = "text-slate-400";
  }

  return <span className={`${baseClasses} ${stateClasses}`}>{label}</span>;
};

const Separator = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const HotelBookingBreadcrumbs: React.FC<BookingBreadcrumbsProps> = ({ currentStep }) => {
  const steps: HotelBookingStep[] = ['search', 'guests', 'confirmation'];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 bg-slate-800 p-3 rounded-lg mb-8">
      <Step label="Search & Select" isComplete={currentIndex > 0} isActive={currentIndex === 0} />
      <Separator />
      <Step label="Guest Details" isComplete={currentIndex > 1} isActive={currentIndex === 1} />
      <Separator />
      <Step label="Confirmation" isComplete={currentIndex > 2} isActive={currentIndex === 2} />
    </div>
  );
};

export default HotelBookingBreadcrumbs;
