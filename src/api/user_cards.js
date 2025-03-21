import { useMutation, useQuery } from '@tanstack/react-query';

const BASE_URL = "http://localhost:3000";

const addCard = () => {
    return useMutation({
        mutationKey: ['user_cards'],
        mutationFn: async ({ token, user, card_api_id, set_api_id, condition, quantity = 1 }) => {
            try {
                const response = await fetch(`${BASE_URL}/user`, {
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

const removeCard = () => {
    return useMutation({
        mutationKey: ['user_cards'],
        mutationFn: async ({ token, user, card }) => {
            try {
                const response = await fetch(`${BASE_URL}/user`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id: user.id,
                        card_id: card.id
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

const getAllCards = (token) => {
    return useQuery({
        queryKey: ['user_cards'],
        queryFn: async () => {
            try {
                const response = await fetch(`${BASE_URL}/user/sort`, {
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
        }
    });
};

const getCard = (token, card_api_id) => {
    return useQuery({
        queryKey: ['user_cards', card_api_id],
        queryFn: async () => {
            try {
                const response = await fetch(`${BASE_URL}/user/${card_api_id}`, {
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
        }
    });
};

export { addCard, removeCard, getAllCards, getCard };