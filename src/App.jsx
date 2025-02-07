import { Route, Routes } from 'react-router-dom';
import Nav from './Components/Nav';
import Home from './Routes/Home';
import { Card, ConfigProvider, Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { fetchSets } from './Services/pokemon_tcg_service';
import CardDetail from './Routes/CardDetail';
function App() {

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
                <Header
                    style={{
                        padding: '0 1.5rem',
                        background: '#FFFFFF',
                    }}
                >
                    <Nav />
                </Header>
                <Content
                    style={{
                        padding: '1rem',
                        background: '#FFFFFF',
                        borderRadius: '1.5rem',
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/card" element={<CardDetail />} />
                        <Route path="/cart" />
                    </Routes>
                </Content>
            </Layout>
        </ConfigProvider>
    );
}

export default App;