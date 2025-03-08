import { Button, Flex } from "antd";

export const User = () => {
    return (
        <Flex vertical>
            <h2>{user.username}</h2>
            <h3>{user.email}</h3>
            <Flex vertical gap="middle" align="start">
                <Flex horizontal gap="middle">
                    <Button type="primary">Edit Account</Button>
                    <Button danger>Delete Account</Button>
                    <Button type="default">Logout</Button>
                </Flex>
            </Flex>
        </Flex>
    );
}