import React, { useContext } from 'react';
import { Layout, Menu, Avatar, Space } from 'antd';
import { HomeFilled, AppstoreFilled, OrderedListOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import Search from 'antd/es/input/Search';
import { useAuth } from '../Hooks/AuthProvider';

const { Header } = Layout;
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

const Navbar = () => {
    const { user } = useAuth();

    return (
        <Header className="header">
            <Link style={{ color: "black" }} to="/"><span style={{ display: "Flex", gap: ".2rem", fontWeight: "600", fontSize: "1rem" }}><img src={Logo} style={{ width: "2rem" }}></img>cardfolio</span></Link>
            <Search className='header__search' placeholder='Search for a card' />
            <Menu mode="horizontal" defaultSelectedKeys={['1']} items={menu_items} className='header__menu' />
            <Link className='avatarLink' to="/user"><Avatar style={{ width: 40, height: 40, backgroundColor: '#fde3cf', color: '#f56a00' }}>{user.username}</Avatar></Link>
        </Header>
    );
};

export default Navbar;
