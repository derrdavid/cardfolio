import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:3000/api/users';

// Query Keys als Konstanten definieren
export const userKeys = {
    all: ['users'],
    single: (id) => ['users', id],
    collections: (userId) => ['users', userId, 'collections']
};

// Alle Nutzer abrufen
export const fetchUsers = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};

// Neuen Nutzer erstellen
export const createUser = async (user) => {
    const { data } = await axios.post(API_URL, user, {
        headers: { 'Content-Type': 'application/json' },
    });
    return data;
};

// Nutzer mit ID abrufen
export const fetchUser = async (userId) => {
    const { data } = await axios.get(`${API_URL}/${userId}`);
    return data;
};

// Nutzer aktualisieren
export const updateUser = async ({ userId, ...user }) => {
    const { data } = await axios.put(`${API_URL}/${userId}`, user, {
        headers: { 'Content-Type': 'application/json' },
    });
    return data;
};

// Nutzer löschen
export const deleteUser = async (userId) => {
    const { data } = await axios.delete(`${API_URL}/${userId}`);
    return data;
};

// Custom Hooks mit v5 Syntax
export const useUsers = () => {
    return useQuery({
        queryKey: userKeys.all,
        queryFn: fetchUsers
    });
};

export const useUser = (userId) => {
    return useQuery({
        queryKey: userKeys.single(userId),
        queryFn: () => fetchUser(userId),
        enabled: !!userId
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        }
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUser,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            queryClient.invalidateQueries({
                queryKey: userKeys.single(variables.userId)
            });
        }
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteUser,
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            queryClient.invalidateQueries({
                queryKey: userKeys.single(userId)
            });
        }
    });
};

const fetchUserCollections = async (userId) => {
    const response = await axios.get(`http://localhost:3000/api/users/collections`, {
    });
    return response.data;
};

export const useUserCollections = (userId) => {
    return useQuery({
        queryKey: userKeys.collections(userId),
        queryFn: () => fetchUserCollections(userId),
        staleTime: 1000 * 60 * 5, // 5 Minuten Cache
        cacheTime: 1000 * 60 * 30, // 30 Minuten im Cache behalten
    });
};

