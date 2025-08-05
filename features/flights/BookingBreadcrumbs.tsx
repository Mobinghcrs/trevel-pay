import React from 'react';
import { FlightBookingStep } from '../../types';

interface BookingBreadcrumbsProps {
  currentStep: FlightBookingStep;
}

const Step: React.FC<{
  label: string;
  isComplete: boolean;
  isActive: boolean;
}> = ({ label, isComplete, isActive }) => {
  const baseClasses = "text-sm font-semibold transition-colors duration-200";
  let stateClasses = "text-slate-400";
  if (isActive) {
    stateClasses = "text-teal-500";
  } else if (isComplete) {
    stateClasses = "text-slate-600";
  }

  return <span className={`${baseClasses} ${stateClasses}`}>{label}</span>;
};

const Separator = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const BookingBreadcrumbs: React.FC<BookingBreadcrumbsProps> = ({ currentStep }) => {
  const steps: FlightBookingStep[] = ['search', 'passengers', 'confirmation'];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 bg-white p-3 rounded-xl mb-8 shadow-sm border border-slate-200">
      <Step label="Search" isComplete={currentIndex > 0} isActive={currentIndex === 0} />
      <Separator />
      <Step label="Passengers" isComplete={currentIndex > 1} isActive={currentIndex === 1} />
      <Separator />
      <Step label="Confirmation" isComplete={currentIndex > 2} isActive={currentIndex === 2} />
    </div>
  );
};

export default BookingBreadcrumbs;