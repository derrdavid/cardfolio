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
        mutationFn: ({ username, password, email }) => {
            try {
                return fetch(BASE_URL + "/register", {
                    method: 'POST',
                    body: {
                        username: username,
                        email: email,
                        password: password
                    }
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
            }
        }
    });
};

// Login
const useLogin = () => {
    return useMutation({
        mutationKey: ['login'],
        mutationFn: ({ token, username, password }) => {
            try {
                return fetch(BASE_URL + "/login", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    method: 'POST',
                    body: {
                        username: username,
                        password: password
                    }
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
            }
        }
    });
};

export { useRefresh, useRegister, useLogin };