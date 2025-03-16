import { Card, List, Typography, Flex } from 'antd';
import { useSetData } from '../api/pokemon_tcg_service';
import SetCard from '../Components/SetCard';
import { useAuth } from '../Hooks/useAuth';

const { Title } = Typography;

const Home = () => {
  const { user } = useAuth();
  const { data: sets, isPending: loading, isError } = useSetData('?orderBy=-releaseDate&pageSize=6');

  return (
    <div className="dashboard-container">
      <Title level={1}>Hello {user.username} 👋</Title>
      <Flex gap="middle" vertical>
        <Card className="card" title="Estimated Collection Value">
          <Title level={3}>Chart</Title>
        </Card>

        <StatsSection stats={stats} />

        <Title level={2}>My Collection</Title>

        {/* Neueste Sets */}
        <SetsList
          title="Newest Sets"
          data={sets}
          gridConfig={{ gutter: 16, column: 3 }}
          renderItem={(item) => <SetCard loading={loading} item={item} />}
        />
      </Flex>
    </div>
  );
};

const SetsList = ({ title, data, renderItem, gridConfig, itemClick }) => (
  <>
    <Title level={2}>{title}</Title>
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

const StatsSection = ({ stats }) => (
  <Flex className="stats-section" gap="middle">
    {stats.map((item, idx) => (
      <Card key={idx} className="card" title={item.title} style={{ backgroundColor: "white" }}>
        <Card.Meta title={item.metaTitle} description={item.metaDescription} />
      </Card>
    ))}
  </Flex>
);
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
  }
];

export default Home;