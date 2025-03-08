import React from 'react';
import { Layout, Menu, Avatar, Space } from 'antd';
import { HomeFilled, AppstoreFilled, OrderedListOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import Search from 'antd/es/input/Search';
import { useAuthContext } from '../Hooks/AuthProvider';
import './Navbar.css';

const { Header } = Layout;

const menu_items = [
    {
        key: 1,
        icon: <HomeFilled />,
        text: 'Home',
        link: '/'
    },
    {
        key: 2,
        icon: <AppstoreFilled />,
        text: 'Sets',
        link: '/sets'
    },
    {
        key: 3,
        icon: <OrderedListOutlined />,
        text: 'MyCollection',
        link: '/collection'
    }
]

const Navbar = () => {
    const { user } = useAuthContext();
    return (
        <Header className="header">
            <Link style={{ color: "black" }} to="/"><span style={{ display: "Flex", gap: ".2rem", fontWeight: "600", fontSize: "1rem" }}><img src={Logo} style={{ width: "2rem" }}></img>cardfolio</span></Link>
            <Search className='header__search' />
            <Menu mode="horizontal" defaultSelectedKeys={['1']} className='header__menu'>
                {menu_items.map((item) => {
                    return <Menu.Item key={item.key} icon={item.icon} ><Link to={item.link}>{item.text}</Link></Menu.Item>
                })}
            </Menu>
            <Link className='avatarLink' to="/user"><Avatar style={{ width: 40, height: 40, backgroundColor: '#fde3cf', color: '#f56a00' }}>{user.username}</Avatar></Link>
        </Header>
    );
};

export default Navbar;
