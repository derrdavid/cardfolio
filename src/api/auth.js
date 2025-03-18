import { useMutation, useQuery } from '@tanstack/react-query';

const BASE_URL = "http://localhost:3000";

// Token-Refresh
const useRefresh = () => {
    return useMutation({
        mutationKey: ['refresh-token'],
        mutationFn: async ({ token }) => {
            try {
                const response = await fetch(BASE_URL + "/refresh", {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Registration failed');
                }

                const res_token = response.headers.get('Authorization')?.split(' ')[1];


                if (!res_token && response.ok) {
                    return {
                        token: token
                    }
                }
                return {
                    token: res_token
                };
            } catch (error) {
                console.log(error.message);
            }
        },
    });
};

// Register
const useRegister = () => {
    return useMutation({
        mutationKey: ['register'],
        mutationFn: async ({ username, password, email }) => {
            try {
                const response = await fetch(BASE_URL + "/register", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                });

                if (!response.ok) {
                    throw new Error('Registration failed');
                }

                const token = response.headers.get('Authorization')?.split(' ')[1];
                const user = await response.json();

                console.log(token);

                return {
                    token: token,
                    user: user
                };
            } catch (error) {
                console.error(error.message);
                throw error;
            }
        }
    });
};

const useLogin = () => {
    return useMutation({
        mutationKey: ['login'],
        mutationFn: async ({ username, password }) => {
            try {
                const res = await fetch(BASE_URL + "/login", {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });

                if (!res.ok) {
                    throw new Error('Login failed');
                }
                const token = res.headers.get('Authorization')?.split(' ')[1];
                const data = await res.json();
                const user = data.user;

                return {
                    token,
                    user
                };
            } catch (error) {
                console.log(error.message);
                throw error;
            }
        }
    });
};

const useUpdateUser = () => {
    return useMutation({
        mutationKey: ['delete_user'],
        mutationFn: async ({ username, password, email }) => {
            if (!username || !email || !password) {
                throw new Error("Alle Felder sind erforderlich.");
            }
            try {
                const response = await fetch(BASE_URL + "/user", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                });

                return response.data;
            } catch (error) {
                throw new Error(error.response?.data?.error || "Update fehlgeschlagen");
            }
        }
    });
};

const useDeleteUser = () => {
    return useMutation({
        mutationKey: ['update_user'],
        mutationFn: async ({ username, password, email }) => {
            if (!username || !email || !password) {
                throw new Error("Alle Felder sind erforderlich.");
            }
            try {
                const response = await fetch(BASE_URL + "/user", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                });
                
                return response.data;
            } catch (error) {
                throw new Error(error.response?.data?.error || "Löschen fehlgeschlagen");
            }
        }
    })
};


export { useRefresh, useRegister, useLogin, useUpdateUser, useDeleteUser };