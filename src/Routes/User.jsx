import { useAuthContext } from "../Hooks/AuthProvider";

export const User = () => {
    const { user } = useAuthContext();
    return (
        <div>
            <h1>User</h1>
            <p>Username: {user.toString()}</p>
            <p>Email: {user.email}</p>
        </div>
    );
}