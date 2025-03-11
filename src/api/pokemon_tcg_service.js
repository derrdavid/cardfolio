import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'https://api.pokemontcg.io/v2';

const fetchWithAuth = async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'X-Api-Key': import.meta.env.VITE_TCG_API_KEY
        }
    });
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data.data;
};

export const useSetData = (params = '') => {
    return useQuery({
        queryKey: ['sets', params],
        queryFn: () => fetchWithAuth(`/sets${params}`),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
    });
};

export const useCardsData = (params = '') => {
    return useQuery({
        queryKey: ['cards', params],
        queryFn: () => fetchWithAuth(`/cards${params}`),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
    });
};