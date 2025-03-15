import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Navbar from '../Components/Navbar';
import { useAuth } from './AuthProvider';

export const ProtectedRoutes = ({ publicRoutes }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();
    const isPublicRoute = publicRoutes.some(route => location.pathname.includes(route));

    if (isLoading) {
        return <Spin size="large" />;
    }

    if (user && isPublicRoute) {
        const redirectTo = location.state?.from?.pathname || '/';
        return <Navigate to={redirectTo} replace />;
    }

    if (!user && !isPublicRoute) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return (
        <Layout>
            {!isPublicRoute && <Navbar />} 
            <Content className="content-wrapper">
                <Outlet />
            </Content>
        </Layout>
    );
};