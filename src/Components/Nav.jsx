import React from 'react';
import { Layout, Menu, Avatar, Space, Flex } from 'antd';
import { UserOutlined, DashboardOutlined, AppstoreOutlined, ShopOutlined, SearchOutlined, HomeFilled, AppstoreFilled, OrderedListOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Search from 'antd/es/input/Search';

const { Header } = Layout;

const DashboardHeader = () => {
    return (
        <Header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E8EB', position: 'fixed', zIndex: 1, width: '100%', top: 0, left: 0 }}>
            <Flex justify='space-between' align='center' gap='large'>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Work Sans' }}><Link to="/">cardfolio</Link></div>
                <Search size='large'/>
                <Space size='large'>
                    <Menu mode="horizontal" defaultSelectedKeys={['1']} style={{ borderBottom: 'none', width: '20vw', display: 'flex', justifyContent: 'center' }}>
                        <Menu.Item key="1" icon={<HomeFilled />} ><Link to="/">Home</Link></Menu.Item>
                        <Menu.Item key="2" icon={<AppstoreFilled />}><Link to="/sets">Sets</Link></Menu.Item>
                        <Menu.Item key="3" icon={<OrderedListOutlined />}><Link to="/cards">Cards</Link></Menu.Item>
                    </Menu>
                    <Avatar src="https://via.placeholder.com/40x40" style={{ width: 40, height: 40 }} />
                </Space>
            </Flex>
        </Header>
    );
};

export default DashboardHeader;
