import { createContext, useState, useEffect } from "react";
import { useDeleteUser, useLogin, useRefresh, useRegister, useUpdateUser, useUpdateUserPassword } from "../api/auth";
import { useAddCard, useRemoveCard, useGetAllCards, useGetCard, useUpdateCard } from "../api/user_cards";
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
    const queryClient = useQueryClient();

    // Auth mutations
    const loginMutation = useLogin();
    const registerMutation = useRegister();
    const refreshMutation = useRefresh();
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();
    const updateUserPasswordMutation = useUpdateUserPassword();

    // Card mutations
    const addCardMutation = useAddCard();
    const removeCardMutation = useRemoveCard();
    const updateCardMutation = useUpdateCard();

    // Card queries
    const { data: cards = [], refetch: refetchAllCards, isSuccess } = useGetAllCards(token);

    // Auth handlers
    const handleRegister = async ({ username, password, passwordConfirm, email }) => {
        if (password !== passwordConfirm) {
            console.error("Passwords do not match.");
            return;
        }
        try {
            const res = await registerMutation.mutateAsync({ username, password, email });
            setToken(res.token);
            setUser(res.user);
        } catch (error) {
            console.error("Registration failed", error);
        }
    };

    const handleLogin = async ({ username, password }) => {
        try {
            const res = await loginMutation.mutateAsync({ username, password });
            setToken(res.token);
            setUser(res.user);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setToken("");
        // Clear cache
        queryClient.invalidateQueries(['user_cards']);
    };

    const handleRefresh = async () => {
        try {
            const res = await refreshMutation.mutateAsync({ token });
            if (!res?.token) {
                handleLogout();
                return;
            }
            if (token !== res.token) {
                setToken(res.token);
            }
        } catch (error) {
            console.error("Refresh failed", error);
        }
    };

    // User management handlers
    const handleUpdateUser = async ({ password, email }) => {
        const { id } = user;
        try {
            const new_user = await updateUserMutation.mutateAsync({ token, id, email, password });
            setUser(new_user);
        } catch (error) {
            console.error("Update user failed", error);
        }
    }

    const handleUpdateUserPassword = async ({ password, new_password }) => {
        const { id } = user;
        try {
            const new_user = await updateUserPasswordMutation.mutateAsync({ token, id, password, new_password });
            setUser(new_user);
        } catch (error) {
            console.error("Update user password failed", error);
        }
    }

    const handleDeleteUser = async ({ password }) => {
        const { id } = user;
        try {
            await deleteUserMutation.mutateAsync({ token, id, password });
            handleLogout();
        } catch (error) {
            console.error("Delete user failed", error);
        }
    }

    // Card handlers
    const handleAddCard = async ({ card_api_id, set_api_id, condition, quantity }) => {
        try {
            // Add card
            const response = await addCardMutation.mutateAsync({
                token,
                user,
                card_api_id,
                set_api_id,
                condition,
                quantity
            });

            // Get the updated card data (assuming the API returns it)
            const newCard = response[0] || response;

            // Update the cache with the new card data
            queryClient.setQueryData(["user_cards"], (oldCards = []) => {
                // Check if the card exists in the cache
                const existingCardIndex = oldCards.findIndex(card => card.card_api_id === card_api_id);

                if (existingCardIndex >= 0) {
                    // Update existing card
                    return oldCards.map((card, index) =>
                        index === existingCardIndex ? newCard : card
                    );
                } else {
                    // Add new card
                    return [...oldCards, newCard];
                }
            });

            return newCard;
        } catch (error) {
            console.error("Failed to add card", error);
            throw error;
        }
    }

    const handleUpdateCard = async ({ id, quantity }) => {
        try {
            // Update card in database
            const response = await updateCardMutation.mutateAsync({
                token,
                id,
                quantity
            });

            // Get the updated card data (assuming the API returns it)
            const updatedCard = response[0] || response;

            // Update the cache
            queryClient.setQueryData(["user_cards"], (oldCards = []) => {
                return oldCards.map(card => {
                    // Find the card in the collection that needs updating
                    if (card.card_api_id === updatedCard.card_api_id) {
                        // Update the conditions array with the new quantity
                        const updatedConditions = card.conditions.map(cond =>
                            cond.id === id ? { ...cond, quantity } : cond
                        );

                        // Return the updated card
                        return {
                            ...card,
                            conditions: updatedConditions
                        };
                    }
                    return card;
                });
            });

            // Get the updated card for the UI
            const updatedCardWithConditions = await handleGetCard(updatedCard.card_api_id);
            return updatedCardWithConditions;
        } catch (error) {
            console.error("Failed to update card", error);
            throw error;
        }
    }

    const handleRemoveCard = async ({ id }) => {
        try {
            // Find which card this condition belongs to before removing
            let cardApiId = null;
            let cardToUpdate = null;

            queryClient.setQueryData(["user_cards"], (oldCards = []) => {
                // Find the card that contains this condition
                for (const card of oldCards) {
                    const conditionIndex = card.conditions.findIndex(cond => cond.id === id);
                    if (conditionIndex >= 0) {
                        cardApiId = card.card_api_id;
                        // Store a copy of the card for later use
                        cardToUpdate = {
                            ...card,
                            conditions: card.conditions.filter(cond => cond.id !== id)
                        };
                        break;
                    }
                }

                // If we found the card, update it in the cache
                if (cardApiId) {
                    return oldCards.map(card =>
                        card.card_api_id === cardApiId ? cardToUpdate : card
                    );
                }

                return oldCards;
            });

            // Remove the card condition from the database
            await removeCardMutation.mutateAsync({ token, user, id });

            // Return the updated card for the UI
            if (cardApiId) {
                return cardToUpdate;
            }

            return null;
        } catch (error) {
            console.error("Failed to remove card", error);
            throw error;
        }
    }

    const handleGetCard = async (card_api_id) => {
        try {
            return cards.find(card => card.card_api_id === card_api_id) || null;
        } catch (error) {
            console.error("Failed to get specific card", error);
            return null;
        }
    }

    // Context value with grouped properties for better organization
    const contextValue = {
        // State
        token,
        user,
        cards,

        // Status flags
        isLoading: loginMutation.isLoading || registerMutation.isLoading ||
            refreshMutation.isLoading || addCardMutation.isLoading ||
            removeCardMutation.isLoading,
        error: loginMutation.error || registerMutation.error ||
            refreshMutation.error || addCardMutation.error ||
            removeCardMutation.error,

        // Auth functions
        handleLogin,
        handleRegister,
        handleRefresh,
        handleLogout,

        // User management functions
        handleUpdateUser,
        handleUpdateUserPassword,
        handleDeleteUser,

        // Card management functions
        handleAddCard,
        handleRemoveCard,
        handleGetCard,
        handleUpdateCard,
        refetchAllCards // For manual refresh if needed
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };