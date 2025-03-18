import {
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    LogoutOutlined,
    MailOutlined,
    SaveOutlined,
    CloseOutlined,
    LockOutlined
} from "@ant-design/icons";
import {
    Avatar,
    Card,
    Button,
    Typography,
    Modal,
    Form,
    Input,
    Flex,
    Divider,
    message,
    Popconfirm,
    theme
} from "antd";
import { useState } from "react";
import { useAuth } from "../Hooks/useAuth";

const { Title, Text } = Typography;
const { useToken } = theme;

export const User = () => {
    const { token } = useToken();
    const { user, handleLogout, handleUpdateUser, handleDeleteUser } = useAuth();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleEdit = () => {
        setIsEditModalOpen(true);
    }

    const handleConfirmUpdate = async () => {
        try {
            const values = await form.validateFields(); // Holt die Werte aus der Form
            if (values.password !== values.passwordConfirm) {
                message.error("Die Passwörter stimmen nicht überein.");
                return;
            }

            // update Password und email nur möglich
            await handleUpdateUser({
                username: values.username,
                email: values.email,
                password: values.password,
            });

            message.success("Profil erfolgreich aktualisiert!");
            setIsEditModalOpen(false);
        } catch (error) {
            message.error("Fehler beim Aktualisieren des Profils.");
        }
    };

    const handleConfirmDeletion = async () => {
        try {
            await handleDeleteUser({
                username: user.username,
                email: user.email,
                // password Confirm nötig
            });

            message.success("Profil erfolgreich gelöscht.");
            handleLogout();
        } catch (error) {
            message.error("Fehler beim Löschen des Profils.");
        }
    };



    return (
        <Flex vertical gap="large" style={{ maxWidth: 800, margin: "24px auto", padding: "0 16px" }}>
            <Card
                bordered={false}
                style={{
                    borderRadius: token.borderRadiusLG,
                    boxShadow: token.boxShadow
                }}
            >
                <Flex vertical align="center" gap="middle">
                    <Avatar
                        size={96}
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: token.colorPrimary,
                            marginBottom: 16
                        }}
                    />
                    <Title level={2} style={{ margin: 0 }}>{user.username}</Title>
                    <Flex align="center" gap="small">
                        <MailOutlined />
                        <Text type="secondary">{user.email}</Text>
                    </Flex>

                    <Divider />

                    <Flex gap="middle" wrap="wrap" justify="center">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleEdit}
                        >
                            Edit Profile
                        </Button>
                        <Popconfirm
                            title="Delete account"
                            description="Are you sure you want to delete your account? This action cannot be undone."
                            okText="Yes, delete"
                            cancelText="Cancel"
                            onConfirm={handleConfirmDeletion}
                            okButtonProps={{ danger: true, loading }}
                        >
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                            >
                                Delete Account
                            </Button>
                        </Popconfirm>
                        <Button
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Flex>
                </Flex>
            </Card >

            <Modal
                title="Edit Profile"
                open={isEditModalOpen}
                footer={null}
                onCancel={() => setIsEditModalOpen(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleConfirmUpdate}
                >
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="passwordConfirm"
                        label="Confirm Password"
                        rules={[{ required: true, message: 'Please confirm your password!' },
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item>
                        <Flex gap="small" justify="end">
                            <Button
                                icon={<CloseOutlined />}
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={<SaveOutlined />}
                            >
                                Save Changes
                            </Button>
                        </Flex>
                    </Form.Item>
                </Form>
            </Modal>
        </Flex >
    );
};