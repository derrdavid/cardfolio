import { createContext, useState } from "react";
import { useDeleteUser, useLogin, useRefresh, useRegister, useUpdateUser, useUpdateUserPassword } from "../api/auth";
import { addCard, getAllCards, getCard, removeCard } from "../api/user_cards";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [cards, setCards] = useState([]);
    const [token, setToken] = useState("");

    const loginMutation = useLogin();
    const registerMutation = useRegister();
    const refreshMutation = useRefresh();
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();
    const updateUserPasswordMutation = useUpdateUserPassword();

    const addCardMutation = addCard();
    const removeCardMutation = removeCard();
    // Needs to pass token as parameter
    const getAllCardsQuery = getAllCards(token);
    // Can't initialize here without card_api_id
    // We'll modify the handler function instead

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
        setCards([]);
    };

    const handleRefresh = async () => {
        try {
            const res = await refreshMutation.mutateAsync({ token });
            if (!res?.token) {
                handleLogout();
                return;
            }

            setToken(res.token);
        } catch (error) {
            console.error("Refresh failed", error);
        }
    };

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

    const handleAddCard = async ({ card_api_id, set_api_id, condition, quantity }) => {
        try {
            // Avoid passing user and token as they're available in context
            const new_card = await addCardMutation.mutateAsync({
                token,
                user,
                card_api_id,
                set_api_id,
                condition,
                quantity
            });
            setCards([...cards, new_card]);
        } catch (error) {
            console.error("Failed to add card", error);
        }
    }

    const handleRemoveCard = async ({ card }) => {
        try {
            // Filter to keep cards that DON'T match the one being removed
            setCards(cards.filter(item => item.id !== card.id));
            await removeCardMutation.mutateAsync({ token, user, card });
        } catch (error) {
            console.error("Failed to remove card", error);
        }
    }

    const handleGetAllCards = async () => {
        try {
            // No need to pass user as parameter, use refetch to get fresh data
            const result = await getAllCardsQuery.refetch();
            setCards(result.data || []);
        } catch (error) {
            console.error("Failed to fetch all cards", error);
        }
    };

    const handleGetCard = async (card_api_id) => {
        try {
            // Use the getCard function directly with the necessary parameters
            const cardQuery = getCard(token, card_api_id);
            const result = await cardQuery.refetch();
            // Only add the card if it's not already in the array
            if (result.data && !cards.some(card => card.id === result.data.id)) {
                setCards([...cards, result.data]);
            }
        } catch (error) {
            console.error("Failed to fetch card", error);
        }
    };

    return (
        <AuthContext.Provider value={{
            token,
            user,
            cards,
            isLoading: loginMutation.isLoading || registerMutation.isLoading || refreshMutation.isLoading ||
                addCardMutation.isLoading || removeCardMutation.isLoading || getAllCardsQuery.isLoading,
            error: loginMutation.error || registerMutation.error || refreshMutation.error ||
                addCardMutation.error || removeCardMutation.error || getAllCardsQuery.error,
            handleLogin,
            handleRegister,
            handleRefresh,
            handleLogout,
            handleUpdateUser,
            handleUpdateUserPassword,
            handleDeleteUser,
            handleAddCard,
            handleRemoveCard,
            handleGetAllCards,
            handleGetCard
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };