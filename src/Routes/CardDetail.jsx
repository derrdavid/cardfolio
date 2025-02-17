import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Divider, Table, Spin, Image, Grid, Flex, List, Descriptions } from 'antd';
import { fetchCards } from '../Services/pokemon_tcg_service'; // Stelle sicher, dass diese Funktion existiert
import './CardDetail.css';
import ButtonGroup from 'antd/es/button/button-group';
import Card3D from '../Components/Card3D';

const { Title, Text } = Typography;

const CardDetails = () => {
    const { id } = useParams();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCards(`/${id}`).then((data) => {
            setCard(data.data);
        }).then(() => setLoading(false));
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
        <div>
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
                <Text type="secondary">
                    <a href="#">Home</a> / <a href="#">Portfolio</a> / <span>Pokemon</span>
                </Text>
            </div>
            <Divider />
            {/* Card Title */}
            <Title level={1}><span>{card.name} <Text level={2} type='secondary'>{card.set.ptcgoCode + " " + card.number}</Text></span></Title>
            {/* Card Image */}
            <Flex gap="large" justify="left">
                <Card3D card={card}></Card3D>
                <Flex gap="middle" vertical style={{ width: '25%' }}>
                    <List bordered>
                        <List.Item>
                            <Text>{"Nr."}</Text>
                            <Text strong>{card.number}</Text>
                        </List.Item>
                        <List.Item>
                            <Text>{"Name"}</Text>
                            <Text strong>{card.name}</Text>
                        </List.Item>
                        <List.Item >
                            <Text>{"Rarity"}</Text>
                            <Text strong>{card.rarity}</Text>
                        </List.Item>
                        <List.Item >
                            <Text>{"Set"}</Text>
                            <Text strong>{card.set.name}</Text>
                        </List.Item>
                        <List.Item >
                            <Text>{"Release"}</Text>
                            <Text strong>{card.set.releaseDate}</Text>
                        </List.Item>
                    </List>
                    <Flex gap="middle" horizontal style={{}}>
                        <Button color='bl' type='primary' size='large' style={{ width: '50%' }}>Add</Button>
                        <Button size='large' style={{ width: '50%' }}>Buy</Button>
                    </Flex>
                </Flex>
            </Flex>
        </div>
    );
};

export default CardDetails;
