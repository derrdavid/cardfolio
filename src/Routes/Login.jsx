import { Button, Flex, Form, Image, Input } from "antd";
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import { useLogin } from "../api/auth";
import LogoSvg from '../assets/logo.svg'; // SVG hier importieren
import { useNavigate } from "react-router-dom";
import { useUser } from "../Hooks/AuthProvider";

export const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const login = useLogin();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleAuthenticate = async () => {
        try {
            await login.mutateAsync({ username: username, password: password });
            navigate('/'); // Nach erfolgreichem Login zur Home-Route
        } catch (error) {
            console.error('Login fehlgeschlagen');
        }
    }

    return (
        <Flex
            style={{
                minHeight: '50vh',
                padding: '20px'
            }}
            vertical
            justify="center"
            align="center"
        >
            <img src={LogoSvg} alt="Cardfolio Logo" style={{ width: '5rem', height: '5rem' }} />
            <h1 style={{ textAlign: 'center' }}>cardfolio</h1>
            <Form gap="middle" style={{
                width: '100%',
                maxWidth: '400px',
                gap: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem',
            }}>
                <h2 style={{ textAlign: 'center' }}>Login</h2>
                <Input
                    value={username}
                    autoComplete="username"
                    onChange={(val) => setUsername(val.target.value)}
                    size="large"
                    placeholder="Benutzername"
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
                <Input.Password
                    value={password}
                    autoComplete="current-password"
                    onChange={(val) => setPassword(val.target.value)}
                    size="large"
                    placeholder="Passwort"
                    iconRender={(visible) => (
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    )}
                />
                <Button type="primary" size="large" onClick={(() => { handleAuthenticate(username, password) })}>
                    Anmelden
                </Button>
            </Form>
        </Flex>
    );
}