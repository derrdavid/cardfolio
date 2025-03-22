import React, { useEffect, useState } from 'react';
import { List, Spin, Typography, Divider, Flex, Empty, Card, Tag, Statistic, Button, Row, Col } from 'antd';
import { ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Card3D from '../Components/Card3D';
import { useAuth } from '../Hooks/useAuth';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

export const MyCollection = () => {
    const { user, cards, handleRemoveCard, isLoading } = useAuth();
    const [cardsBySet, setCardsBySet] = useState({});
    const [collectionStats, setCollectionStats] = useState({
        totalCards: 0,
        uniqueCards: 0,
        totalValue: 0,
        sets: 0
    });

    // Process cards when they change
    useEffect(() => {
        if (cards && cards.length > 0) {
            // Group cards by set
            const groupedCards = {};
            let totalCards = 0;
            let totalValue = 0;

            cards.forEach(card => {
                if (!card.set) return;

                const setId = card.set.id;
                if (!groupedCards[setId]) {
                    groupedCards[setId] = {
                        setName: card.set.name,
                        setLogo: card.set.images?.logo || '',
                        releaseDate: card.set.releaseDate,
                        cards: []
                    };
                }

                groupedCards[setId].cards.push(card);
                totalCards += card.quantity || 1;
                totalValue += (card.price || 0) * (card.quantity || 1);
            });

            // Sort sets by release date (newest first)
            const sortedBySet = Object.fromEntries(
                Object.entries(groupedCards).sort(([, a], [, b]) => {
                    return new Date(b.releaseDate) - new Date(a.releaseDate);
                })
            );

            setCardsBySet(sortedBySet);
            setCollectionStats({
                totalCards,
                uniqueCards: cards.length,
                totalValue,
                sets: Object.keys(sortedBySet).length
            });
        } else {
            setCardsBySet({});
            setCollectionStats({
                totalCards: 0,
                uniqueCards: 0,
                totalValue: 0,
                sets: 0
            });
        }
    }, [cards]);

    const handleCardRemove = (card) => {
        handleRemoveCard({ card });
    };

    // Use the isLoading state from the auth context
    if (isLoading) {
        return (
            <Flex justify="center" align="center" style={{ height: "50vh" }}>
                <Spin size="large" />
            </Flex>
        );
    }

    if (!user) {
        return (
            <Flex justify="center" align="center" style={{ height: "50vh" }}>
                <Empty
                    description="Please log in to view your collection"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Flex>
        );
    }

    if (Object.keys(cardsBySet).length === 0) {
        return (
            <Flex justify="center" align="center" vertical style={{ height: "50vh" }}>
                <Empty
                    description="Your collection is empty"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <Button
                    type="primary"
                    style={{ marginTop: 16 }}
                    onClick={() => window.location.href = '/cards'}
                >
                    Browse Cards
                </Button>
            </Flex>
        );
    }

    return (
        <div className="my-collection-container">
            <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
                <Title level={2}>My Collection</Title>
                <Button
                    icon={<ReloadOutlined />}
                    loading={isLoading}
                >
                    Refresh
                </Button>
            </Flex>

            <Row gutter={[16, 24]} style={{ marginBottom: 32 }}>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic title="Total Cards" value={collectionStats.totalCards} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic title="Unique Cards" value={collectionStats.uniqueCards} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Estimated Value"
                            value={collectionStats.totalValue}
                            precision={2}
                            suffix="€"
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic title="Sets" value={collectionStats.sets} />
                    </Card>
                </Col>
            </Row>

            {Object.entries(cardsBySet).map(([setId, { setName, setLogo, cards }]) => (
                <div key={setId} className="set-section" style={{ marginBottom: 40 }}>
                    <Divider orientation="left">
                        <Flex align="center" gap="small">
                            {setLogo && (
                                <img
                                    src={setLogo}
                                    alt={setName}
                                    style={{ height: 28, marginRight: 8 }}
                                />
                            )}
                            <Title level={3} style={{ margin: 0 }}>{setName}</Title>
                            <Tag color="blue">{cards.length} cards</Tag>
                        </Flex>
                    </Divider>

                    <List
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 4,
                            xl: 5,
                        }}
                        dataSource={cards}
                        renderItem={(card) => (
                            <List.Item key={card.id}>
                                <Card
                                    hoverable
                                    cover={<Card3D card={card} />}
                                    actions={[
                                        <Link to={`/card/${card.id}`}><EditOutlined key="edit" /></Link>,
                                        <DeleteOutlined key="delete" onClick={() => handleCardRemove(card)} />
                                    ]}
                                >
                                    <Card.Meta
                                        title={card.name}
                                        description={
                                            <Flex vertical>
                                                <Text>Condition: {card.condition || 'Mint'}</Text>
                                                <Text>Quantity: {card.quantity || 1}</Text>
                                                {card.price && (
                                                    <Text>Value: {card.price}€</Text>
                                                )}
                                                {card.added_at && (
                                                    <Text>Added: {new Date(card.added_at).toLocaleDateString()}</Text>
                                                )}
                                            </Flex>
                                        }
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
            ))}
        </div>
    );
};