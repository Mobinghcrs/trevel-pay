import React, { useState, useEffect, useCallback } from 'react';
import App from './App';
import AdminPanel from './admin/AdminPanel';
import AdminLoginPage from './admin/AdminLoginPage';
import MerchantLoginPage from './features/merchant/MerchantLoginPage';
import MerchantPanel from './features/merchant/MerchantPanel';
import { getCurrentUser, clearCurrentUser } from './services/currentUser';

const Router: React.FC = () => {
    const [route, setRoute] = useState(window.location.hash);
    const [isAuthenticated, setIsAuthenticated] = useState(!!getCurrentUser());
    const [userRole, setUserRole] = useState(getCurrentUser()?.role);

    const handleAuthChange = useCallback(() => {
        const user = getCurrentUser();
        setIsAuthenticated(!!user);
        setUserRole(user?.role);
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash);
        };
        
        // This acts as a global event bus for auth changes
        window.addEventListener('authchange', handleAuthChange);
        window.addEventListener('hashchange', handleHashChange);
        
        return () => {
            window.removeEventListener('authchange', handleAuthChange);
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [handleAuthChange]);
    
    // Simple routing based on hash
    if (route.startsWith('#/admin')) {
        if (isAuthenticated && userRole === 'admin') {
            return <AdminPanel />;
        }
        return <AdminLoginPage />;
    }

    if (route.startsWith('#/merchant')) {
        if (isAuthenticated && userRole === 'merchant') {
            return <MerchantPanel />;
        }
        // Clear any non-merchant session and show login
        if (getCurrentUser()) clearCurrentUser();
        return <MerchantLoginPage />;
    }
    
    return <App />;
};

export default Router;
