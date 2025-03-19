import { Button, Flex, Form, Input } from "antd";
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { user, handleLogin, isLoading } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user])

    const containerStyle = {
        height: 'calc(100vh - 64px)',
        width: '100%',
    };

    const formStyle = {
        width: '90%',
        maxWidth: '400px',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    };

    return (
        <Flex style={containerStyle} vertical justify="center" align="center">
            <Form style={formStyle}>
                <Flex vertical gap="middle">
                    <h1 style={{ textAlign: 'center', margin: 0 }}>Login</h1>
                    <Input
                        value={username}
                        autoComplete="username"
                        onChange={(e) => setUsername(e.target.value)}
                        size="large"
                        placeholder="Benutzername"
                        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                    <Input.Password
                        value={password}
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        size="large"
                        placeholder="Passwort"
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => handleLogin({ username, password })}
                        loading={isLoading}
                    >
                        Login
                    </Button>
                    <Button
                        type="default"
                        size="large"
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </Button>
                </Flex>
            </Form>
        </Flex>
    );
};