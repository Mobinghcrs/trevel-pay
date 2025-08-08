import { AuthState } from '@/types';

const USER_SESSION_KEY = 'travel_pay_user_session';

export const setCurrentUser = (user: AuthState['user']): void => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    }
};

export const getCurrentUser = (): AuthState['user'] | null => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
        const userJson = window.sessionStorage.getItem(USER_SESSION_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }
    return null;
};

export const clearCurrentUser = (): void => {
     if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(USER_SESSION_KEY);
    }
};
