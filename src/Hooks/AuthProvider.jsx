import { createContext, useContext } from 'react';
import { useAuth } from '../api/auth';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';

const AuthContext = createContext(null);

// Named function export statt Arrow Function
export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext muss innerhalb eines AuthProviders verwendet werden');
    }
    return context;
}

export function AuthProvider({ children }) {
    const { data: user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    // Öffentliche Routen definieren
    const publicPaths = ['/login', '/register'];
    const isPublicPath = publicPaths.includes(location.pathname);

    if (!user && !isPublicPath) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (user && isPublicPath) {
        return <Navigate to="/" replace />;
    }

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
}