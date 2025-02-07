import React from 'react';
import { Layout, Typography } from 'antd';
import './CardDetail.css';

const { Content } = Layout;
const { Title } = Typography;

const CardDetail = () => {
    return (
        <Layout className="dashboard-body-layout">
            <Content className="dashboard-body-content">
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <Title level={4}>Estimated Collection Value</Title>
                        <div className="stat-number">$2,750</div>
                        <div className="stat-trend positive">
                            <span className="trend-icon">⬆</span>
                            <span>+12.5% from last month</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <Title level={4}>Total Cards</Title>
                        <div className="stat-number">3,245</div>
                        <div className="stat-info">145 new cards this month</div>
                    </div>
                    <div className="stat-card">
                        <Title level={4}>Unique Sets</Title>
                        <div className="stat-number">48</div>
                        <div className="stat-info">Last updated: 2 days ago</div>
                    </div>
                </div>
                <div className="dashboard-chart">
                    <div className="chart-placeholder">Chart Placeholder</div>
                </div>
            </Content>
        </Layout>
    );
};

export default CardDetail;
