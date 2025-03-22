import { Button, Flex, Form, Input, Typography, Tabs, Card, Divider, notification } from "antd";
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export const Login = () => {
    const navigate = useNavigate();
    const { user, handleLogin, handleRegister, isLoading } = useAuth();
    const [activeTab, setActiveTab] = useState("login");
    const [loginForm] = Form.useForm();
    const [registerForm] = Form.useForm();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const onLoginFinish = (values) => {
        handleLogin(values);
    };

    const onRegisterFinish = (values) => {
        if (values.password !== values.passwordConfirm) {
            notification.error({
                message: "Passwords don't match",
                description: "Please make sure your passwords match."
            });
            return;
        }
        handleRegister(values);
    };

    const containerStyle = {
        minHeight: '100vh',
    };

    const contentStyle = {
        width: '100%',
        maxWidth: '1200px',
        padding: '2rem',
    };

    const cardStyle = {
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    };

    const formStyle = {
        width: '100%',
        maxWidth: '400px',
        padding: '1rem',
    };

    return (
        <Flex style={containerStyle} justify="center" align="center">
            <Flex style={contentStyle} wrap="wrap" gap="large" justify="space-between" align="center">
                <Flex vertical style={{ flex: 1, minWidth: '300px' }} gap="middle">
                    <Title style={{ fontSize: '3.5rem', margin: 0 }}>Cardfolio</Title>
                    <Title level={3} style={{ fontWeight: 400, marginTop: 0 }}>
                        Manage your card collection with ease
                    </Title>
                    <Text style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                        Track, organize, and showcase your trading card collection all in one place.
                        Join thousands of collectors who use Cardfolio to manage their Pokemon cards.
                    </Text>
                    <Flex gap="middle">
                        <Button type="default" size="large">Learn More</Button>
                    </Flex>
                </Flex>

                <Card style={cardStyle}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        centered
                        items={[
                            {
                                key: 'login',
                                label: 'Login',
                                children: (
                                    <Flex style={formStyle} vertical gap="middle">
                                        <Form
                                            form={loginForm}
                                            layout="vertical"
                                            onFinish={onLoginFinish}
                                        >
                                            <Form.Item
                                                name="username"
                                                rules={[{ required: true, message: 'Please enter your username' }]}
                                            >
                                                <Input
                                                    size="large"
                                                    placeholder="Username"
                                                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="password"
                                                rules={[{ required: true, message: 'Please enter your password' }]}
                                            >
                                                <Input.Password
                                                    size="large"
                                                    placeholder="Password"
                                                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
                                                    iconRender={(visible) =>
                                                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                                    }
                                                />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    size="large"
                                                    block
                                                    loading={isLoading}
                                                >
                                                    Login
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                        <Divider plain>Don't have an account?</Divider>
                                        <Button
                                            type="default"
                                            block
                                            onClick={() => setActiveTab('register')}
                                        >
                                            Register Now
                                        </Button>
                                    </Flex>
                                ),
                            },
                            {
                                key: 'register',
                                label: 'Register',
                                children: (
                                    <Flex style={formStyle} vertical gap="middle">
                                        <Form
                                            form={registerForm}
                                            layout="vertical"
                                            onFinish={onRegisterFinish}
                                        >
                                            <Form.Item
                                                name="username"
                                                rules={[{ required: true, message: 'Please enter a username' }]}
                                            >
                                                <Input
                                                    size="large"
                                                    placeholder="Username"
                                                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="email"
                                                rules={[
                                                    { required: true, message: 'Please enter your email' },
                                                    { type: 'email', message: 'Please enter a valid email' }
                                                ]}
                                            >
                                                <Input
                                                    size="large"
                                                    placeholder="Email"
                                                    prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="password"
                                                rules={[{ required: true, message: 'Please enter a password' }]}
                                            >
                                                <Input.Password
                                                    size="large"
                                                    placeholder="Password"
                                                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
                                                    iconRender={(visible) =>
                                                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                                    }
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="passwordConfirm"
                                                rules={[{ required: true, message: 'Please confirm your password' }]}
                                            >
                                                <Input.Password
                                                    size="large"
                                                    placeholder="Confirm Password"
                                                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
                                                    iconRender={(visible) =>
                                                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                                    }
                                                />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    size="large"
                                                    block
                                                    loading={isLoading}
                                                >
                                                    Register
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                        <Divider plain>Already have an account?</Divider>
                                        <Button
                                            type="default"
                                            block
                                            onClick={() => setActiveTab('login')}
                                        >
                                            Login Instead
                                        </Button>
                                    </Flex>
                                ),
                            },
                        ]}
                    />
                </Card>
            </Flex>
        </Flex>
    );
};