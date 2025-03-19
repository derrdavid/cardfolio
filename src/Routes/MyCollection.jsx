import React from 'react';
import { List, Spin, Typography, Divider, Flex } from 'antd';
import Card3D from '../Components/Card3D';
import { useAuth } from '../Hooks/useAuth';

const { Title, Text } = Typography;

export const MyCollection = () => {
    const { user } = useAuth();
    const cardsBySet = {}; 

    return (
        <div className="my-collection-container">
            <Title level={1}>My Collection</Title>
            {Object.entries(cardsBySet).map(([setId, { setName, cards }]) => (
                <div key={setId} className="set-section">
                    <Divider orientation="left">
                        <Title level={2}>{setName}</Title>
                    </Divider>
                    <List
                        grid={{
                            gutter: 16,
                            xs: 1, // 1 Spalte für extra kleine Geräte
                            sm: 2, // 2 Spalten für kleine Geräte
                            md: 3, // 3 Spalten für mittlere Geräte
                            lg: 4, // 4 Spalten für große Geräte
                            xl: 4, // 4 Spalten für extra große Geräte
                        }}
                        dataSource={cards}
                        renderItem={(card) => (
                            <List.Item key={card.id}>
                                <Card3D card={card} />
                                <div className="card-meta">
                                    <Text strong>{card.name}</Text>
                                    <Flex vertical>
                                        <Text>Zustand: {card.condition}/5</Text>
                                        <Text>Anzahl: {card.quantity}</Text>
                                        <Text>Wert: {card.price}€</Text>
                                        <Text>Hinzugefügt: {new Date(card.added_at).toLocaleDateString()}</Text>
                                    </Flex>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            ))}
        </div>
    );
};