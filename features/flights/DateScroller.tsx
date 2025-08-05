
import React from 'react';

interface DateScrollerProps {
  currentDate: string; // YYYY-MM-DD
  onDateChange: (newDate: string) => void;
}

const DateScroller: React.FC<DateScrollerProps> = ({ currentDate, onDateChange }) => {
    const dates: { dateStr: string; day: string; date: string }[] = [];
    // Ensure currentDate is valid before creating a Date object
    const sanitizedDate = currentDate && !isNaN(new Date(currentDate).getTime()) ? currentDate : new Date().toISOString().split('T')[0];
    const today = new Date(sanitizedDate);

    for (let i = -5; i <= 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push({
            dateStr: date.toISOString().split('T')[0],
            day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            date: date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
        });
    }

    return (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
            {dates.map(({ dateStr, day, date }) => {
                const isActive = dateStr === currentDate;
                return (
                    <button
                        key={dateStr}
                        onClick={() => onDateChange(dateStr)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg w-16 h-16 flex-shrink-0 transition-all duration-200 ${
                            isActive
                                ? 'bg-teal-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-teal-100 border border-gray-200'
                        }`}
                    >
                        <span className="text-xs font-semibold">{day}</span>
                        <span className="text-sm font-bold">{date}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default DateScroller;