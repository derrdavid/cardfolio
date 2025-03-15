import { createContext, useState, useContext } from "react";
import { useLogin, useRegister } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");

    const loginMutation = useLogin();
    const registerMutation = useRegister();


    const handleRegister = async ({ username, password, passwordConfirm, email }) => {
        if (password !== passwordConfirm) {
            throw error("Unübereinstimmende Passwörter.")
        }
        try {
            const res = await registerMutation.mutateAsync({ username, password, email });
            setToken(res.token);
            setUser(res.user);
        } catch (error) {
            console.error("Registrierung fehlgeschlagen", error);
        }
    };

    const handleLogin = async ({ username, password }) => {
        try {
            const res = await loginMutation.mutateAsync({ username, password });
            setToken(res.token);
            setUser(res.user);
        } catch (error) {
            console.error("Login fehlgeschlagen", error);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setToken("");
    };

    return (
        <AuthContext.Provider value={{
            token,
            user,
            isLoading: loginMutation.isLoading || registerMutation.isLoading,
            error: loginMutation.error || registerMutation.error,
            handleLogin,
            handleRegister,
            handleLogout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};