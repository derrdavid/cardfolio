import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Divider, Spin, List, Flex, Breadcrumb } from 'antd';
import { fetchCards } from '../api/pokemon_tcg_service';
import Card3D from '../Components/Card3D';

const { Title, Text } = Typography;

const CardInfoList = ({ infoList }) => (
    <List bordered>
        {infoList.map((item) => (
            <List.Item>
                <Text>{item.title}</Text>
                <Text strong>{item.data}</Text>
            </List.Item>
        ))}
    </List>
);

const ActionButtons = () => (
    <Flex gap="middle" horizontal>
        <Button type="primary" size="large" style={{ width: '50%' }}>
            Add
        </Button>
        <Button size="large" style={{ width: '50%' }}>
            Buy
        </Button>
    </Flex>
);

const CardDetails = () => {
    const { id } = useParams();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);

    const cardInfo = card ? [
        {title: 'Nr.', key: 'number', data: card.number},
        {title: 'Name', key: 'name', data: card.name},
        {title: 'Rarity', key: 'rarity', data: card.rarity},
        {title: 'Set', key: 'set', data: card.set.name},
    ] : [];

    useEffect(() => {
        fetchCards(`/${id}`)
            .then((data) => setCard(data.data))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="card-details-container">
                <Spin size="large" />
            </div>
        );
    }

    if (!card) {
        return (
            <div className="card-details-container">
                <Text type="danger">Karte nicht gefunden</Text>
            </div>
        );
    }

    return (
        <div className="card-details-container">
            <Breadcrumb></Breadcrumb>
            <Divider />
            <Title level={1}>
                <span>
                    {card.name}{' '}
                    <Text type="secondary">
                        {card.set.ptcgoCode} {card.number}
                    </Text>
                </span>
            </Title>
            <Flex gap="large" justify="left">
                <Card3D card={card} />
                <Flex gap="middle" vertical style={{ width: '30vw' }}>
                    <CardInfoList infoList={cardInfo} />
                    <ActionButtons />
                </Flex>
            </Flex>
        </div>
    );
};

export default CardDetails;