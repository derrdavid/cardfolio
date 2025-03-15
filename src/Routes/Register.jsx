import { Button, Flex, Form, Input } from "antd";
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined, MailOutlined } from '@ant-design/icons';
import { useState } from "react";
import { useAuth } from "../Hooks/AuthProvider";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const { handleRegister, isLoading } = useAuth();

    // Einheitliches Styling für Container und Form
    const containerStyle = {
        height: 'calc(100vh - 64px)',
        width: '100%',
    };

    const formStyle = {
        width: '90%',
        maxWidth: '400px',
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    };

    return (
        <Flex style={containerStyle} vertical justify="center" align="center">
            <Form style={formStyle}>
                <Flex vertical gap="middle">
                    <h1 style={{ textAlign: 'center', margin: 0 }}>Registrierung</h1>
                    <Input
                        value={username}
                        autoComplete="username"
                        onChange={(e) => setUsername(e.target.value)}
                        size="large"
                        placeholder="Benutzername"
                        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                    <Input
                        value={email}
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        size="large"
                        placeholder="E-Mail"
                        prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                    <Input.Password
                        value={password}
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                        size="large"
                        placeholder="Passwort"
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                    <Input.Password
                        value={passwordConfirm}
                        autoComplete="new-password"
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        size="large"
                        placeholder="Passwort bestätigen"
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => handleRegister({ username, password, passwordConfirm, email })}
                        loading={isLoading}
                    >
                        Register
                    </Button>
                    <Button
                        type="default"
                        size="large"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </Button>
                </Flex>
            </Form>
        </Flex>
    );
};