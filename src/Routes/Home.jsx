import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Flex } from 'antd';
import { fetchCards, fetchSets } from '../Services/pokemon_tcg_service';
import { useNavigate } from 'react-router-dom';
import SetCard from '../Components/SetCard';
import './styles/Home.css';
import { useAuthContext } from '../Hooks/AuthProvider';

const { Title } = Typography;

/* Eine stateless Komponente für die statischen Metriken */
const StatsSection = ({ stats }) => (
  <Flex className="stats-section" gap="middle">
    {stats.map((item, idx) => (
      <Card key={idx} className="card" title={item.title}>
        <Card.Meta title={item.metaTitle} description={item.metaDescription} />
      </Card>
    ))}
  </Flex>
);

/* Eine Komponente für Schnellaktionen */
const QuickActions = ({ onAction }) => (
  <Flex className="quick-actions-section" gap="middle">
    {[
      { action: 'collection', label: 'My Collection' },
      { action: 'sets', label: 'Browse Sets' },
      { action: 'singles', label: 'Browse Singles' },
    ].map(({ action, label }) => (
      <Card
        key={action}
        className="card"
        title="+"
        hoverable
        onClick={() => onAction(action)}
      >
        <Card.Meta title={label} />
      </Card>
    ))}
  </Flex>
);

/* Eine generische Komponente, um eine Liste in einem Abschnitt anzuzeigen */
const SectionList = ({ title, data, renderItem, gridConfig, itemClick }) => (
  <>
    <Title level={3}>{title}</Title>
    <List
      grid={gridConfig}
      dataSource={data}
      renderItem={(item) => (
        <List.Item onClick={itemClick ? () => itemClick(item.id) : undefined}>
          {renderItem(item)}
        </List.Item>
      )}
    />
  </>
);

const Home = () => {
  const {user} = useAuthContext();
  const [sets, setSets] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  console.log(user)

  useEffect(() => {
    fetchSets('orderBy=-releaseDate&pageSize=6').then((data) => {
      setSets(data.data);
    });
    fetchCards()
      .then((data) => {
        setCards(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      title: 'Estimated Collection Value',
      metaTitle: '2750€',
      metaDescription: '+12.5% from last month',
    },
    {
      title: 'Total Cards',
      metaTitle: '3245€',
      metaDescription: '145 new cards this month',
    },
    {
      title: 'Unique Sets',
      metaTitle: '48',
      metaDescription: 'Last updated: 2 days ago',
    },
    {
      title: 'Unique Sets',
      metaTitle: '48',
      metaDescription: 'Last updated: 2 days ago',
    },
  ];

  const handleQuickAction = (actionType) => {
    console.log('Quick action:', actionType);
  };

  const handleCardClick = (cardId) => {
    navigate(`/card/${cardId}`);
  };

  return (
    <div className="dashboard-container">
      <Title level={2}>Hello {user.username} 👋</Title>
      <Flex gap="middle" vertical>
        <Card className="card" title="Estimated Collection Value">
          <Title level={3}>Chart</Title>
        </Card>

        <StatsSection stats={stats} />

        <Title level={3}>Quick Actions</Title>
        <QuickActions onAction={handleQuickAction} />

        {/* Neueste Sets */}
        <SectionList
          title="Newest Sets"
          data={sets}
          gridConfig={{ gutter: 16, column: 3 }}
          renderItem={(item) => <SetCard loading={loading} item={item} />}
        />
      </Flex>
    </div>
  );
};

export default Home;