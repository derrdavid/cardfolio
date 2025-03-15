import { Button, Flex } from "antd";
import { useMemo, useState } from "react";
import { useAuth } from "../Hooks/AuthProvider";


export const initialItems = new Array(30_000_000).fill(0).map((_, i) => {
    return {
        id: i,
        isSelected: i === 29_999_999,
    };
});


export const User = () => {
    const { user } = useAuth();
    const [num, setNum] = useState(0);
    const [items] = useState(initialItems);


    const selectedItem = useMemo(() => {
        return items.find((item) => item.isSelected)
    }, [])



    return (
        <div>
            <Button onClick={() => setNum(num + 1)}>{num}</Button>
            <h1>{selectedItem?.id}</h1>
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
        </div>
    );
}