import { Card, Image } from "antd";
import { useNavigate } from "react-router-dom";

const SetCard = (({ loading, item }) => {
    const navigate = useNavigate();
    return (
        <Card
            loading={loading}
            onClick={() => navigate('/cards', { state: { locationSet: item } })}
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
                    loading="eager"
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