import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Button, Divider, Spin, List, Flex, Breadcrumb, Popconfirm, InputNumber, Select, Form, Card, Space, Input, message } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, HomeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useCardsData } from '../api/pokemon_tcg_service';
import Card3D from '../Components/Card3D';
import { useAuth } from '../Hooks/useAuth';

const { Title, Text } = Typography;
const { Option } = Select;

const CardInfoList = ({ infoList }) => (
    <List bordered className="card-info-list">
        {infoList.map((item) => (
            <List.Item key={item.key} className="info-list-item">
                <Text type='secondary' className="info-title">{item.title}</Text>
                <Text strong className="info-data">{item.data}</Text>
            </List.Item>
        ))}
    </List>
);

const CardCollectionTable = ({ condition_list = [] }) => {
    const { handleRemoveCard } = useAuth();

    const updateQuantity = (id, value) => {
        //TODO UPDATE ROUTE 
        console.log('Update quantity:', id, value);
    };

    const deleteItem = (id) => {
        handleRemoveCard({ id })
            .then(() => {
                message.success(`Card deleted!`);
            });
    };

    return (
        <List bordered className="card-info-list">
            {condition_list.map(item => (
                <List.Item key={item.id} className="info-list-item">
                    <Text className="info-title">{item.condition}</Text>
                    <Text strong className="info-data">
                        <InputNumber
                            min={0}
                            value={item.quantity}
                            onChange={value => updateQuantity(item.id, value)}
                            size="small"
                        />
                        <Button
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => deleteItem(item.id)}
                            style={{ marginLeft: 8 }}
                        />
                    </Text>
                </List.Item>
            ))}
        </List>
    );
};

export const CardDetails = () => {
    const { user, cards, handleGetCard, handleAddCard, handleRemoveCard } = useAuth();
    const { id } = useParams();
    const { data: card, isLoading } = useCardsData(`/${id}`);
    const [userCards, setUserCards] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        getCard();
    }, [cards]);

    const getCard = async () => {
        const userCard = await handleGetCard(id);
        setUserCards(userCard);
    }

    const addToCollection = () => {
        const values = form.getFieldsValue();
        handleAddCard({
            card_api_id: id,
            set_api_id: card?.set?.id,
            condition: values.condition || 'Mint',
            quantity: values.quantity || 1
        }).then((newCard) => {
            setUserCards(newCard);
            message.success(`${values.quantity}x ${card.name} - ${values.condition} added!`);
            form.resetFields(); // Reset form after adding
        }).catch(error => {
            message.error(`Failed to add card: ${error.message}`);
        });
    };

    const cardInfo = card && card.set ? [
        { title: 'Nr.', key: 'number', data: card.number },
        { title: 'Name', key: 'name', data: card.name },
        { title: 'Rarity', key: 'rarity', data: card.rarity },
        { title: 'Set', key: 'set', data: card.set.name }
    ] : [];

    if (isLoading) {
        return (
            <div className="card-details-container loading-container">
                <Spin size="large" />
            </div>
        );
    }

    if (!card || !card.set) {
        return (
            <div className="card-details-container error-container">
                <Text type="danger">Card not found</Text>
            </div>
        );
    }

    // Extrahiere die conditions aus userCards, falls vorhanden

    const ActionButtons = () => (
        <Flex gap="middle" vertical className="action-buttons">
            <Form form={form} layout="vertical" initialValues={{ quantity: 1, condition: 'Mint' }}>
                <Flex gap="middle">
                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                        <InputNumber min={1} max={999} />
                    </Form.Item>
                    <Form.Item name="condition" label="Condition" rules={[{ required: true }]}>
                        <Select style={{ width: 120 }}>
                            <Option value="Mint">Mint</Option>
                            <Option value="Near Mint">Near Mint</Option>
                            <Option value="Excellent">Excellent</Option>
                            <Option value="Good">Good</Option>
                            <Option value="Light Played">Light Played</Option>
                            <Option value="Played">Played</Option>
                            <Option value="Poor">Poor</Option>
                        </Select>
                    </Form.Item>
                </Flex>
            </Form>
            <Flex gap="middle" horizontal>
                <Popconfirm
                    title="Add to collection"
                    description="Add this card to your collection?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={addToCollection}
                >
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                    >
                        Add to Collection
                    </Button>
                </Popconfirm>
                <Popconfirm
                    title="Buy this card"
                    description="Purchase this card?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => console.log('Purchase initiated')}
                >
                    <Button
                        size="large"
                        icon={<ShoppingCartOutlined />}
                    >
                        Buy
                    </Button>
                </Popconfirm>
            </Flex>
        </Flex>
    );

    return (
        <div className="card-details-container">
            <Breadcrumb className="breadcrumb-nav">
                <Breadcrumb.Item>
                    <Link to="/"><HomeOutlined /> Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/cards">Cards</Link></Breadcrumb.Item>
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
                    <Title level={3} type='secondary' >DETAILS</Title>
                    <CardInfoList infoList={cardInfo} />
                    <ActionButtons />
                    <Divider />
                    <Title level={3} type='secondary'>COLLECTION</Title>
                    {userCards && <CardCollectionTable condition_list={userCards.conditions} />}
                </Flex>
            </Flex>
        </div>
    );
};