import { createContext, useState, useEffect } from "react";
import { useDeleteUser, useLogin, useRefresh, useRegister, useUpdateUser, useUpdateUserPassword } from "../api/auth";
import { useAddCard, useRemoveCard, useGetAllCards, useGetCard } from "../api/user_cards";
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

    // Card queries
    const { data: cards = [], refetch: refetchAllCards } = useGetAllCards(token);

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
        // Cache leeren
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
            // Karte hinzufügen
            const newCard = await addCardMutation.mutateAsync({
                token,
                user,
                card_api_id,
                set_api_id,
                condition,
                quantity
            });

            // Optimistic update - neue Karte zum lokalen State hinzufügen
            // Dies ist optional, da React Query den Cache automatisch aktualisieren kann
            queryClient.setQueryData(['user_cards'], (oldData) => {
                if (!oldData) return [newCard];

                // Prüfen, ob Karte bereits existiert (für Mengenupdates)
                const existingCardIndex = oldData.findIndex(
                    card => card.card_api_id === card_api_id
                );

                if (existingCardIndex !== -1) {
                    // Bestehende Karte updaten
                    const updatedData = [...oldData];
                    updatedData[existingCardIndex] = newCard;
                    return updatedData;
                } else {
                    // Neue Karte hinzufügen
                    return [...oldData, newCard];
                }
            });

            // Alternativ: Komplettes Refresh der Karten
            // await refetchAllCards();

        } catch (error) {
            console.error("Failed to add card", error);
            // Bei Fehler komplettes Refresh
            refetchAllCards();
        }
    }

    const handleRemoveCard = async ({ id }) => {
        try {
            // Optimistic update - Karte aus lokalem State entfernen
            queryClient.setQueryData(['user_cards'], (oldData) => {
                return oldData?.filter(card => card.id !== id) || [];
            });

            // API-Call zum Löschen
            await removeCardMutation.mutateAsync({ token, user, id });

        } catch (error) {
            console.error("Failed to remove card", error);
            // Bei Fehler komplettes Refresh
            refetchAllCards();
        }
    }

    // Get card from state by ID
    const handleGetCard = async (card_api_id) => {
        // Methode 1: Aus dem lokalen Cache holen
        const existingCard = cards.find(card => card.card_api_id === card_api_id);

        if (existingCard) return existingCard;

        // Methode 2: Falls nicht im Cache, einzelne Karte fetchen
        try {
            const { data } = await queryClient.fetchQuery(
                ['user_cards', card_api_id],
                () => useGetCard(token, card_api_id).queryFn()
            );
            return data;
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
        refetchAllCards // Für manuelles Refresh, falls nötig
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };