
import React from 'react';
import { ICONS } from '../constants';

const RolesPermissionsPage: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Roles & Permissions</h1>
            
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <div className="flex justify-center items-center mb-4">
                    <span className="text-gray-400 h-16 w-16">{ICONS.shieldCheck}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Coming Soon</h2>
                <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                    This page is a placeholder for future role and permission management. Here you will be able to define what each role (Admin, Support, Finance, User) can see and do within the application.
                </p>
            </div>
        </div>
    );
};

export default RolesPermissionsPage;
