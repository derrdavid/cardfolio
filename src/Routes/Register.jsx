import { Button, Flex, Input, Form } from "antd";
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined, MailOutlined } from '@ant-design/icons';
import { useState } from "react";
import { useRegister } from "../api/auth";

export const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const register = useRegister();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            console.error('Passwörter stimmen nicht überein');
            return;
        }
        try {
            await register.mutateAsync({ 
                username, 
                email,
                password 
            });
        } catch (error) {
            console.error('Registrierung fehlgeschlagen');
        }
    }

    return (
        <Flex 
            style={{ 
                height: 'calc(100vh - 64px)',
                width: '100%',
            }}
            vertical
            justify="center"
            align="center"
        >
            <Flex
                vertical
                style={{
                    width: '90%',
                    maxWidth: '400px',
                    padding: '2rem',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                gap="large"
            >
                <h1 style={{ textAlign: 'center', margin: 0 }}>Registrierung</h1>
                <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    size="large"
                    placeholder="Benutzername"
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="large"
                    placeholder="E-Mail"
                    prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
                <Input.Password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="large"
                    placeholder="Passwort"
                    iconRender={(visible) => (
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    )}
                />
                <Input.Password
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    size="large"
                    placeholder="Passwort bestätigen"
                    iconRender={(visible) => (
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    )}
                />
                <Button 
                    type="primary" 
                    size="large"
                    onClick={handleRegister}
                    loading={register.isLoading}
                >
                    Registrieren
                </Button>
            </Flex>
        </Flex>
    );
}