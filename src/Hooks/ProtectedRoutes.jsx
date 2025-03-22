import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Navbar from '../Components/Navbar';
import { useAuth } from './useAuth';
import { useEffect, useRef } from 'react';

export const ProtectedRoutes = ({ publicRoutes }) => {
    const { user, isLoading, handleRefresh } = useAuth();
    const location = useLocation();
    const isPublicRoute = publicRoutes.some(route => location.pathname.includes(route));
    const prevPathRef = useRef(null);

    useEffect(() => {
        const isLoginRoute = prevPathRef.current === '/login' || prevPathRef.current === '/register';

        if (!isPublicRoute && !isLoginRoute && !isLoading && user) {
            handleRefresh();
        }

        prevPathRef.current = location.pathname;
    }, [location, isLoading, user]);

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
        <Layout className='container'>
            {!isPublicRoute && <Navbar />}
            <Content className="content-wrapper">
                <Outlet />
            </Content>
        </Layout>
    );
};