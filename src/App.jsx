import { Route, Routes, useLocation } from 'react-router-dom';
import Nav from './Components/Nav';
import Home from './Routes/Home';
import { Card, ConfigProvider, Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { fetchSets } from './Services/pokemon_tcg_service';
import CardDetail from './Routes/CardDetail';
import Sets from './Routes/Sets';
import Collection from './Routes/Collection';
import { Login } from './Routes/Login';
import { Register } from './Routes/Register';
import { User } from './Routes/User';
import { AuthProvider } from './Hooks/AuthProvider';
function App() {
    const location = useLocation();
    const publicPaths = ['/login', '/register'];
    const isPublicPath = publicPaths.includes(location.pathname);

    return (
        <ConfigProvider theme={{
            token: {
                // Seed Token
                borderRadius: 25,
                // Alias Token
            },
        }}
        >
            <Layout
                style={{
                    background: '#FFFFFF',
                }}
            >
                <AuthProvider>
                    {isPublicPath ? null : (
                        <Header
                            style={{
                                padding: '0 1.5rem',
                                background: '#FFFFFF',
                            }}
                        >
                            <Nav />
                        </Header>
                    )}

                    <Content className='content-wrapper'>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/card/:id" element={<CardDetail />} />
                            <Route path="/sets" element={<Sets />} />
                            <Route path="/user" element={<User />} />
                            <Route path="/collection" element={<Collection />} />
                        </Routes>
                    </Content>
                </AuthProvider>
            </Layout>
        </ConfigProvider>
    );
}

export default App;