import { List, Spin, Typography, Divider } from "antd";
import Card3D from "../Components/Card3D";

const { Title } = Typography;


export const MyCollection = () => {
    console.log(user)
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