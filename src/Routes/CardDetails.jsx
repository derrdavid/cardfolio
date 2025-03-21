import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Button, Divider, Spin, List, Flex, Breadcrumb, Popconfirm } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, HomeOutlined } from '@ant-design/icons';
import { useCardsData } from '../api/pokemon_tcg_service';
import Card3D from '../Components/Card3D';
import { useAuth } from '../Hooks/useAuth';

const { Title, Text } = Typography;

const CardInfoList = ({ infoList }) => (
    <List bordered className="card-info-list">
        {infoList.map((item) => (
            <List.Item key={item.key} className="info-list-item">
                <Text className="info-title">{item.title}</Text>
                <Text strong className="info-data">{item.data}</Text>
            </List.Item>
        ))}
    </List>
);

const ActionButtons = () => (
    <Flex gap="middle" horizontal className="action-buttons">
        <Popconfirm
            title="Add to collection"
            description="Do you want to add this card to your collection?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => console.log('Card added to collection')}
        >
            <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                className="action-button"
            >
                Add
            </Button>
        </Popconfirm>
        <Popconfirm
            title="Buy this card"
            description="Do you want to purchase this card?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => console.log('Purchase initiated')}
        >
            <Button
                size="large"
                icon={<ShoppingCartOutlined />}
                className="action-button"
            >
                Buy
            </Button>
        </Popconfirm>
    </Flex>
);

export const CardDetails = () => {
    const { user, handleAddCard } = useAuth();
    console.log(user)
    const { id } = useParams();
    const { data: card, isLoading } = useCardsData(`/${id}`);

    // Erst prüfen ob card existiert
    const cardInfo = card && card.set ? [
        { title: 'Nr.', key: 'number', data: card.number },
        { title: 'Name', key: 'name', data: card.name },
        { title: 'Rarity', key: 'rarity', data: card.rarity },
        { title: 'Set', key: 'set', data: card.set.name },
    ] : [];

    if (isLoading) {
        return (
            <div className="card-details-container loading-container">
                <Spin size="large" />
            </div>
        );
    }

    // Prüfen ob card und card.set existieren
    if (!card || !card.set) {
        return (
            <div className="card-details-container error-container">
                <Text type="danger">Karte nicht gefunden</Text>
            </div>
        );
    }

    return (
        <div className="card-details-container">
            <Breadcrumb className="breadcrumb-nav">
                <Breadcrumb.Item>
                    <Link to="/">
                        <HomeOutlined /> Home
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/cards">Cards</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{card.name}</Breadcrumb.Item>
            </Breadcrumb>

            <Divider />

            <Title level={1} className="card-title">
                <span>
                    {card.name}{' '}
                    <Text type="secondary" className="card-code">
                        {card.set.ptcgoCode} {card.number}
                    </Text>
                </span>
            </Title>

            <Flex className="card-content" wrap="wrap" gap="large">
                <div className="card-visual-container">
                    <Card3D card={card} />
                </div>

                <Flex gap="middle" vertical className="card-info-container">
                    <CardInfoList infoList={cardInfo} />
                    <ActionButtons />
                </Flex>
            </Flex>
        </div>
    );
};