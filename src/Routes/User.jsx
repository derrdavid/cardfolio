import {
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    LogoutOutlined,
    MailOutlined,
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
    theme,
    Tabs
} from "antd";
import { useState, useEffect } from "react";
import { useAuth } from "../Hooks/useAuth";

const { Title, Text } = Typography;
const { useToken } = theme;

export const User = () => {
    const { token } = useToken();
    const { user, handleLogout, handleUpdateUser, handleDeleteUser, handleUpdateUserPassword } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    const showModal = (tab) => {
        form.resetFields();
        setActiveTab(tab);
        setIsModalOpen(true);
    };

    // Dynamisch Formularfelder validieren basierend auf aktivem Tab
    useEffect(() => {
        if (isModalOpen) {
            // Formular neu validieren wenn Tab wechselt
            form.validateFields(['password', 'currentPassword', 'newPassword', 'confirmPassword'].filter(Boolean));
        }
    }, [activeTab, form, isModalOpen]);

    const handleSave = async () => {
        try {
            setLoading(true);
            // Nur Felder für den aktiven Tab validieren
            const values = await form.validateFields(
                activeTab === 'profile'
                    ? ['username', 'email', 'password']
                    : ['currentPassword', 'newPassword', 'confirmPassword']
            );

            if (activeTab === "profile") {
                await handleUpdateUser({
                    username: values.username,
                    email: values.email,
                    password: values.password,
                });
                message.success("Profile updated!");
            }

            if (activeTab === "password") {
                if (values.newPassword !== values.confirmPassword) {
                    throw new Error("Passwords do not match");
                }

                await handleUpdateUserPassword({
                    password: values.currentPassword,
                    new_password: values.newPassword,
                });
                message.success("Password changed!");
            }

            setIsModalOpen(false);
        } catch (error) {
            message.error(error.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    // Profilreiter mit conditionaler Validierung
    const profileTab = (
        <Form.Item noStyle>
            <Form.Item
                name="username"
                label="Username"
            >
                <Input disabled={true} prefix={<UserOutlined />} style={{ color: token.colorText }} />
            </Form.Item>
            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: "Required field" },
                    { type: 'email', message: "Invalid email" }
                ]}
            >
                <Input prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item
                name="password"
                label="Confirm password"
                rules={[
                    { required: activeTab === "profile", message: "Required field" }
                ]}
            >
                <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
        </Form.Item>
    );

    // Kennwort-Tab mit conditionaler Validierung
    const passwordTab = (
        <Form.Item noStyle>
            <Form.Item
                name="currentPassword"
                label="Current password"
                rules={[
                    { required: activeTab === "password", message: "Required field" }
                ]}
            >
                <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item
                name="newPassword"
                label="New password"
                rules={[
                    { required: activeTab === "password", message: "Required field" },
                    { min: 8, message: "Min. 8 characters" }
                ]}
            >
                <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item
                name="confirmPassword"
                label="Confirm password"
                rules={[
                    { required: activeTab === "password", message: "Required field" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (activeTab !== "password" || !value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject("Passwords do not match");
                        },
                    }),
                ]}
            >
                <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
        </Form.Item>
    );

    const items = [
        {
            key: "profile",
            label: "Profile",
            children: profileTab
        },
        {
            key: "password",
            label: "Change password",
            children: passwordTab
        },
    ];

    return (
        <Card
            bordered={false}
            style={{
                maxWidth: 600,
                margin: "24px auto",
                borderRadius: token.borderRadiusLG,
                boxShadow: token.boxShadow
            }}
        >
            <Flex vertical align="center" gap="middle">
                <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: token.colorPrimary }}
                    alt={`${user.username}'s profile`}
                />
                <Title level={3} style={{ margin: 0 }}>{user.username}</Title>
                <Text type="secondary">{user.email}</Text>

                <Divider style={{ margin: "12px 0" }} />

                <Flex gap="small" wrap="wrap" justify="center">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showModal("profile")}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete account?"
                        description="This action cannot be undone."
                        okText="Delete"
                        cancelText="Cancel"
                        onConfirm={handleDeleteUser}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Delete
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

            <Modal
                title={activeTab === "profile" ? "Edit profile" : "Change password"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSave}
                okText="Save"
                cancelText="Cancel"
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={activeTab === "profile" ? {
                        username: user.username,
                        email: user.email
                    } : {}}
                >
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={items}
                    />
                </Form>
            </Modal>
        </Card>
    );
};