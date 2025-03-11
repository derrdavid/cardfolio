import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkAuth, useLogin, authKey } from "../api/auth";

const AuthContext = createContext(null);

export const useUser = ()  => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}

export const useUserCollection = () => {
    return ""
}

export function AuthProvider({ children }) {
    // Auth Status Query
    const { data: user, isLoading, error } = useQuery({
        queryKey: authKey.user,
        queryFn: checkAuth,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        retry: 1,
        refetchOnWindowFocus: false
    });

    // Login Mutation
    const { mutateAsync: login } = useLogin();

    const value = {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        login
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}