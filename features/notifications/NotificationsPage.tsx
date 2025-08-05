import React from 'react';
import { ICONS } from '../../constants';

const NotificationsPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full min-h-[50vh]">
        <div className="h-20 w-20 text-gray-400 mb-4">{ICONS.notifications}</div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">This feature is coming soon!</p>
        <p className="text-gray-500 mt-1">Updates about your bookings and account activity will be shown here.</p>
    </div>
  );
};

export default NotificationsPage;