import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API Basis-URL und globale Axios-Konfiguration
const API_URL = 'http://localhost:3000/api/users';
axios.defaults.withCredentials = true;

// Query Keys für React Query
export const authKey = {
    login: ['auth'],
    user: ['user'],
}

// Login-Funktion
export const login = async (username, password) => {
    const { data } = await axios.post(`${API_URL}/login`, { username, password });
    return data;
};

// Login Hook
export const useLogin = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ username, password }) => login(username, password),
        onSuccess: () => {
            queryClient.invalidateQueries(authKey.user);
        }
    });
};

// Logout-Funktion
export const logout = () => {
    return axios.post(`${API_URL}/logout`, {});
};

// Auth Status Check
export const checkAuth = async () => {
    try {
        const data = await axios.post(`${API_URL}/auth`); 
        return data.data;
    } catch {
        return null;
    }
};

// Auth Status Hook mit optimiertem Caching
export const useAuth = () => {
    return useQuery({
        queryKey: authKey.user,
        queryFn: checkAuth,
        staleTime: 1000 * 60 * 5, // 5 Minuten Cache
        cacheTime: 1000 * 60 * 30, // 30 Minuten im Cache behalten
        retry: 1,
        refetchOnWindowFocus: false // Deaktiviert ständiges Neuladen
    });
};

// Register-Funktion
export const register = async (userData) => {
    const { data } = await axios.post(`${API_URL}/register`, userData);
    return data;
};

// Register Hook
export const useRegister = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: register,
        onSuccess: () => {
            queryClient.invalidateQueries(authKey.user);
        }
    });
};