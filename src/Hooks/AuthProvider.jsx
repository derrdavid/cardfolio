import { createContext, useState, useContext } from "react";
import { useLogin, useRefresh, useRegister } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");

    const loginMutation = useLogin();
    const registerMutation = useRegister();
    const refreshMutation = useRefresh();


    const handleRegister = async ({ username, password, passwordConfirm, email }) => {
        if (password !== passwordConfirm) {
            console.error("Unübereinstimmende Passwörter.");
            return;
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

    const handleRefresh = async () => {
        try {
            const res = await refreshMutation.mutateAsync({ token });
            console.log(res);
            if (!res?.token) {
                handleLogout();
                return;
            }

            setToken(res.token);
        } catch (error) {
            console.error("Refresh fehlgeschlagen", error);
        }
    };

    return (
        <AuthContext.Provider value={{
            token,
            user,
            isLoading: loginMutation.isLoading || registerMutation.isLoading || refreshMutation.isLoading,
            error: loginMutation.error || registerMutation.error || refreshMutation.error,
            handleLogin,
            handleRegister,
            handleRefresh,
            handleLogout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };