import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Divider, Spin, List, Flex } from 'antd';
import { fetchCards } from '../Services/pokemon_tcg_service';
import Card3D from '../Components/Card3D';
import './CardDetail.css';

const { Title, Text } = Typography;

const Breadcrumbs = () => (
    <div className="breadcrumbs">
        <Text type="secondary">
            <a href="#">Home</a> / <a href="#">Portfolio</a> / <span>Pokemon</span>
        </Text>
    </div>
);

const CardInfoList = ({ card }) => (
    <List bordered>
        <List.Item>
            <Text>Nr.</Text>
            <Text strong>{card.number}</Text>
        </List.Item>
        <List.Item>
            <Text>Name</Text>
            <Text strong>{card.name}</Text>
        </List.Item>
        <List.Item>
            <Text>Rarity</Text>
            <Text strong>{card.rarity}</Text>
        </List.Item>
        <List.Item>
            <Text>Set</Text>
            <Text strong>{card.set.name}</Text>
        </List.Item>
        <List.Item>
            <Text>Release</Text>
            <Text strong>{card.set.releaseDate}</Text>
        </List.Item>
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
            <Breadcrumbs />
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
                <Flex gap="middle" vertical style={{ width: '25%' }}>
                    <CardInfoList card={card} />
                    <ActionButtons />
                </Flex>
            </Flex>
        </div>
    );
};

export default CardDetails;