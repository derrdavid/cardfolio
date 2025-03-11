import { client } from './client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:3000/api/users';

export const authKey = {
    login: ['auth'],
    user: ['user'],
}

export const login = async (username, password) => {
    return client.post(`${API_URL}/login`, { username, password });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ username, password }) => login(username, password),
        onSuccess: () => {
            queryClient.invalidateQueries(authKey.user);
        }
    });
};

export const logout = () => {
    return client.post(`${API_URL}/logout`, {});
};

export const checkAuth = async () => {
    try {
        return await client.post(`${API_URL}/auth`);
    } catch {
        return null;
    }
};

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

export const register = async (userData) => {
    const { data } = await client.post(`${API_URL}/register`, userData);
    return data;
};

export const useRegister = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: register,
        onSuccess: () => {
            queryClient.invalidateQueries(authKey.user);
        }
    });
};