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

// Login
const useLogin = () => {
    return useMutation({
        mutationKey: ['login'],
        mutationFn: ({ username, password }) => {
            try {
                return fetch(BASE_URL + "/login", {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                })
                    .then(res => {
                        const token = res.headers.get('Authorization').split(' ')[1];
                        const user = res.json()
                        return {
                            token: token,
                            user: user
                        }
                    })
            } catch (error) {
                console.log(error.message);
                throw error;
            }
        }
    });
};

export { useRefresh, useRegister, useLogin };