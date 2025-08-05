import React from 'react';
import { Page } from '../types';

export interface NavigationContextType {
    navigate: (page: Page, context?: any) => void;
}

export const NavigationContext = React.createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = (): NavigationContextType => {
    const context = React.useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};
