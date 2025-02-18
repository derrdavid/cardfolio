import { List, Spin, Typography, Divider } from "antd";
import Card3D from "../Components/Card3D";
import { useQuery } from "@tanstack/react-query";
import { fetchCards } from "../Services/pokemon_tcg_service";
import { useUserCollections } from "../api/users";

const { Title } = Typography;

const Collection = () => {
    const userId = 1;

    const {
        data: userData,
        isLoading: isLoadingUser,
        isError,
        error
    } = useUserCollections(userId);

    const { data: cardDetails, isLoading: isLoadingCards } = useQuery({
        queryKey: ['cardDetails', userData?.user_set_collection],
        queryFn: async () => {
            if (!userData) return [];

            const allCards = userData.user_set_collection.flatMap(
                set => set.user_card_collection.map(card => ({
                    ...card,
                    set_api_id: set.set_api_id // Set-ID zu jeder Karte hinzufügen
                }))
            );

            const promises = allCards.map(async (card) => {
                const tcgCard = await fetchCards(`/${card.card_api_id}`);
                return {
                    ...tcgCard.data,
                    id: card.id,
                    condition: card.condition,
                    price: card.price,
                    quantity: card.quantity,
                    set_collection_id: card.set_collection_id,
                    set_api_id: card.set_api_id,
                    added_at: card.added_at
                };
            });

            return Promise.all(promises);
        },
        enabled: !!userData
    });

    if (isLoadingUser || isLoadingCards) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    // Karten nach Sets gruppieren
    const cardsBySet = cardDetails?.reduce((acc, card) => {
        const setId = card.set.id;
        if (!acc[setId]) {
            acc[setId] = {
                setName: card.set.name,
                cards: []
            };
        }
        acc[setId].cards.push(card);
        return acc;
    }, {}) || {};

    return (
        <div style={{ padding: '24px' }}>
            <Title level={1}>Meine Sammlung</Title>
            {Object.entries(cardsBySet).map(([setId, { setName, cards }]) => (
                <div key={setId}>
                    <Divider orientation="left">
                        <Title level={2}>{setName}</Title>
                    </Divider>
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={cards}
                        renderItem={(card) => (
                            <List.Item key={card.id}>
                                <Card3D card={card}>
                                    <List.Item.Meta
                                        title={card.name}
                                        description={
                                            <>
                                                <p>Zustand: {card.condition}/5</p>
                                                <p>Anzahl: {card.quantity}</p>
                                                <p>Wert: {card.price}€</p>
                                                <p>Hinzugefügt: {new Date(card.added_at).toLocaleDateString()}</p>
                                            </>
                                        }
                                    />
                                </Card3D>
                            </List.Item>
                        )}
                    />
                </div>
            ))}
        </div>
    );
};

export default Collection;