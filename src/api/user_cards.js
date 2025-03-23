import { useMutation, useQuery } from '@tanstack/react-query';

const BASE_URL = "http://localhost:3000";

const useAddCard = () => {
    return useMutation({
        mutationKey: ['user_cards'],
        mutationFn: async ({ token, user, card_api_id, set_api_id, condition, quantity = 1 }) => {
            try {
                const response = await fetch(`${BASE_URL}/cards`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id: user.id,
                        card_api_id,
                        set_api_id,
                        condition,
                        quantity
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return await response.json();
            } catch (error) {
                throw new Error(error?.message || "Add card failed");
            }
        }
    });
};

const useRemoveCard = () => {
    return useMutation({
        mutationKey: ['user_cards'],
        mutationFn: async ({ token, user, id }) => {
            try {
                const response = await fetch(`${BASE_URL}/cards`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id: user.id,
                        card_id: id
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return await response.json();
            } catch (error) {
                throw new Error(error?.message || "Remove card failed");
            }
        }
    });
};

const useGetAllCards = (token) => {
    return useQuery({
        queryKey: ['user_cards'],
        queryFn: async () => {
            try {
                const response = await fetch(`${BASE_URL}/cards/sort`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return await response.json();
            } catch (error) {
                throw new Error(error?.message || "Get all cards failed");
            }
        },
        enabled: !!token // Only run when token exists
    });
};

const useGetCard = (token, card_api_id) => {
    return useQuery({
        queryKey: ['user_cards', card_api_id],
        queryFn: async () => {
            try {
                const response = await fetch(`${BASE_URL}/cards/${card_api_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return await response.json();
            } catch (error) {
                throw new Error(error?.message || "Get card failed");
            }
        },
        enabled: !!token,
    });
};

const useUpdateCard = () => {
    return useMutation({
        mutationKey: ['user_cards'],
        mutationFn: async ({ token, id, quantity }) => {
            try {
                const response = await fetch(`${BASE_URL}/cards/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        quantity: quantity
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return await response.json();
            } catch (error) {
                throw new Error(error?.message || "Add card failed");
            }
        }
    });
};

export { useAddCard, useRemoveCard, useGetAllCards, useGetCard, useUpdateCard };