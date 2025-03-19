import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Space, theme, Flex, Input, Badge } from 'antd';
import {
    HomeFilled,
    AppstoreFilled,
    OrderedListOutlined,
    UserOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.png';

const { Header } = Layout;
const { Search } = Input;

const Navbar = () => {
    const { useToken } = theme;
    const { token } = useToken();
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState('1');

    useEffect(() => {
        const path = location.pathname;

        if (path === '/') {
            setSelectedKey('1');
        } else if (path === '/sets' || path.startsWith('/sets/')) {
            setSelectedKey('2');
        } else if (path === '/collection' || path.startsWith('/collection/')) {
            setSelectedKey('3');
        } else if (path === '/user') {
            setSelectedKey('4');
        }
    }, [location]);

    const menu_items = [
        {
            key: '1',
            icon: <HomeFilled />,
            label: <Link to='/'>Home</Link>
        },
        {
            key: '2',
            icon: <AppstoreFilled />,
            label: <Link to='/sets'>Sets</Link>
        },
        {
            key: '3',
            icon: <OrderedListOutlined />,
            label: <Link to='/collection'>MyCollection</Link>
        }
    ];

    return (
        <Header className="navbar-header">
            <Flex align="center" gap="small">
                <Link to="/">
                    <Flex align="center" gap="small">
                        <img
                            src={Logo}
                            alt="Cardfolio Logo"
                            className="navbar-logo"
                        />
                        <span className="navbar-title" style={{ color: token.colorPrimary }}>
                            cardfolio
                        </span>
                    </Flex>
                </Link>
            </Flex>

            <Search
                placeholder="Search for a card"
                prefix={<SearchOutlined />}
                className="navbar-search"
                allowClear
            />

            <Flex align="center" gap="large">
                <Menu
                    mode="horizontal"
                    selectedKeys={[selectedKey]}
                    items={menu_items}
                    className="navbar-menu"
                />

                <Link to="/user" className='avatarLink'>
                    <Avatar
                        icon={<UserOutlined />}
                        className={`navbar-avatar ${selectedKey === '4' ? 'active' : ''}`}
                        style={{
                            backgroundColor: selectedKey === '4' ? token.colorPrimary : token.colorPrimaryBg,
                            color: selectedKey === '4' ? 'white' : token.colorPrimary,
                        }}
                        size="large"
                    />
                </Link>
            </Flex>
        </Header>
    );
};

export default Navbar;
