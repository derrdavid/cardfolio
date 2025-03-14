import { useMutation, useQuery } from '@tanstack/react-query';

const BASE_URL = "http://localhost:3000";

// Token-Refresh
const useRefresh = () => {
    return useQuery({
        queryKey: ['refresh-token'],
        queryFn: ({ token }) => {
            try {
                return fetch(BASE_URL + "/register", {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(res => {
                        const res_token = res.headers.get('Authorization').split(' ')[1];
                        return res_token;
                    })
            } catch (error) {
                console.log(error.message);
            }
        },
        staleTime: 1000 * 60 * 55, // Token nach 55 Minuten erneuern
    });
};

// Register
const useRegister = () => {
    return useMutation({
        mutationKey: ['register'],
        mutationFn: async ({ username, password, email }) => {
            console.log(username + password + email);
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
                throw error; // Für react-query Fehlerbehandlung
            }
        }
    });
};

export { useRefresh, useRegister, useLogin };