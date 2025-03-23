import { ConfigProvider, theme } from 'antd';
import { Outlet, RouterProvider } from 'react-router-dom';
import router from './Config/routes'
import { AuthProvider } from './Hooks/AuthProvider';

function App() {
    return (
        <ConfigProvider theme={{
            algorithm: theme.darkAlgorithm
        }}>
            <AuthProvider>
                <RouterProvider router={router}>
                    <Outlet />
                </RouterProvider>
            </AuthProvider>
        </ConfigProvider>
    );
}

export default App;