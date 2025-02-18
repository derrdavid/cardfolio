import { Route, Routes } from 'react-router-dom';
import Nav from './Components/Nav';
import Home from './Routes/Home';
import { Card, ConfigProvider, Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { fetchSets } from './Services/pokemon_tcg_service';
import CardDetail from './Routes/CardDetail';
import Sets from './Routes/Sets';
import Cards from './Routes/Cards';
import Collection from './Routes/Collection';
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
                <Content className='content-wrapper'>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/card/:id" element={<CardDetail />} />
                        <Route path="/cards" element={<Cards />} />
                        <Route path="/sets" element={<Sets />} />
                        <Route path="/collection" element={<Collection />} />
                    </Routes>
                </Content>
            </Layout>
        </ConfigProvider>
    );
}

export default App;