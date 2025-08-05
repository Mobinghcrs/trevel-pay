

import React from 'react';
import { AdminUser } from '../../types';

interface UserTableRowProps {
    user: AdminUser;
    onViewDetails: (user: AdminUser) => void;
}

const StatusBadge: React.FC<{ status: AdminUser['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5";
    let colorClasses = "";
    switch (status) {
        case 'Active': colorClasses = "bg-green-100 text-green-800"; break;
        case 'Suspended': colorClasses = "bg-red-100 text-red-800"; break;
    }
    return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>
}

const AccountTypeBadge: React.FC<{ type: AdminUser['accountType'] }> = ({ type }) => {
    const isGuest = type === 'Guest';
    const classes = isGuest 
        ? "bg-slate-200 text-slate-700"
        : "bg-blue-100 text-blue-800";
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center ${classes}`}>{type}</span>;
}


const UserTableRow: React.FC<UserTableRowProps> = ({ user, onViewDetails }) => {
    
    const totalBalanceUSD = user.wallets.reduce((total, wallet) => {
        // A real app would have live conversion rates.
        // Here we'll just sum USD and assume others are negligible for this display.
        if (wallet.currency === 'USD') {
            return total + wallet.balance;
        }
        return total;
    }, 0);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD
    }

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <img className="h-10 w-10 rounded-full bg-slate-200 object-cover" src={user.avatarUrl} alt={user.name} />
                    <div>
                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={user.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{user.role}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <AccountTypeBadge type={user.accountType} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDate(user.memberSince)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">${totalBalanceUSD.toFixed(2)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                    onClick={() => onViewDetails(user)}
                    className="text-teal-600 hover:text-teal-500 transition-colors"
                >
                    View Details
                </button>
            </td>
        </tr>
    );
};

export default UserTableRow;