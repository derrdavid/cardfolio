import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Navbar from '../Components/Navbar';

export const ProtectedRoutes = ({ publicRoutes }) => {
    const location = useLocation();

    if (isLoading) {
        return (
            <Spin size="large" />
        );
    }

    const isPublicRoute = publicRoutes.some(route => location.pathname.includes(route));

    if (!user && !isPublicRoute) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Layout>
            <Navbar />
            <Content className='content-wrapper'>
                <Outlet />
            </Content>
        </Layout>
    );
};