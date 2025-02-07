import React, { useEffect, useState } from 'react';
import { Card, Col, Flex, Grid, Image, List, Row, Typography, theme } from "antd";
import { fetchSets } from '../Services/pokemon_tcg_service';
import './Home.css';

const Home = () => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSets('orderBy=-releaseDate&pageSize=6').then((data) => {
      setSets(data.data);
    }).then(() => setLoading(false));
  }, []);

  const { Title, Text } = Typography;
  return (
    <div className="dashboard-container">
      <Title level={2}>Hello Dave!</Title>
      <Flex gap="middle" vertical>
        <Card className="card" title="Estimated Collection Value">
          <Title level={3}>Chart</Title>
        </Card>

        <Flex className="stats-section" gap="middle">
          <Card className="card" title="Estimated Collection Value">
            <Card.Meta title="2750€" description="+12.5% from last month"></Card.Meta>
          </Card>

          <Card className="card" title="Total Cards">
            <Card.Meta title="3245€" description="145 new cards this month"></Card.Meta>
          </Card>

          <Card className="card" title="Unique Sets">
            <Card.Meta title="48" description="Last updated: 2 days ago"></Card.Meta>
          </Card>
          <Card className="card" title="Unique Sets">
            <Card.Meta title="48" description="Last updated: 2 days ago"></Card.Meta>
          </Card>
        </Flex>

        <Title level={3}>Quick Actions</Title>
        <Flex className="quick-actions-section" gap="middle">
          <Card className="card" title="+" hoverable onClick={() => console.log('Clicked')}>
            <Card.Meta title="My Collection" />
          </Card>

          <Card className="card" title="+" hoverable>
            <Card.Meta title="Browse Sets" />
          </Card>

          <Card className="card" title="+" hoverable>
            <Card.Meta title="Browse Singles" />
          </Card>
        </Flex>

        <Title level={3}>Newest Sets</Title>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={sets}
          renderItem={(item) => (
            <List.Item>
              <Card
                loading={loading}
                className='set-card'
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
                    width={'100%'}
                    style={{ aspectRatio: '2/1', objectFit: 'contain' }}
                  />
                }
              >
                <Card.Meta title={item.name} />
                </Card>
            </List.Item>
          )}
        />

        <Title level={3}>Trending</Title>
        <List
          itemLayout="horizontal"
          dataSource={sets}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
              /* Uncomment and style if images are needed like below:
              avatar={
                <img
                  src={item.imageUrl}
                  alt="Activity"
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
              }
              title={item.title}
              description={item.description}
              */
              />
              <Text className={`activity-amount ${item.amountType}`}>{item.amount}</Text>
            </List.Item>
          )}
        />
      </Flex>
    </div>
  );
};

export default Home;
