import { Card, Image } from "antd";

const SetCard = (({ loading, item }) => {
    return (
        <Card
            loading={loading}
            className="set-card"
            hoverable
            extra={
                <img
                    src={item.images.symbol}
                    alt="logo"
                    width={30}
                    style={{ objectFit: 'cover' }}
                />
            }
            cover={
                <Image
                    loading={loading}
                    src={item.images.logo}
                    alt="logo"
                    preview={false}
                    width="100%"
                    style={{ aspectRatio: '2/1', objectFit: 'contain' }}
                />
            }
        >
            <Card.Meta title={item.name} />
        </Card>
    );
});

export default SetCard;