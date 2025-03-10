import React, { useCallback, useEffect, useState } from "react";
import { Card, Select, List, Flex, Typography } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation, useNavigate } from "react-router-dom";
import { useCardFiltering } from "../Hooks/useCardFiltering";
import Search from "antd/es/transfer/search";
import { fetchCards, fetchSets } from "../api/pokemon_tcg_service";

export const Cards = ({ set }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { locationSet } = location.state || {};
    
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState([]);
    const [sets, setSets] = useState([]);

    // Card Filtering Hook
    const {
        filteredCards,
        setSearchTerm,
        setSortType,
        setFilterType,
        SORT_TYPES
    } = useCardFiltering(cards);

    // Karten laden
    const loadCards = useCallback(() => {
        setLoading(true);
        const setFilter = locationSet?.id ? `&q=set.id:${locationSet.id}` : "";
        
        fetchCards(`?page=${page}${setFilter}&orderBy=id`)
            .then((data) => {
                if (data.data.length === 0) {
                    setHasMore(false);
                } else {
                    setCards(prevCards => 
                        page === 1 ? data.data : [...prevCards, ...data.data]
                    );
                }
            })
            .finally(() => setLoading(false));
    }, [page, locationSet]);

    // Initialer Load
    useEffect(() => {
        loadCards();
    }, [loadCards]);

    // Sets laden
    useEffect(() => {
        fetchSets("orderBy=id").then((data) => setSets(data.data));
    }, []);

    return (
        <Flex vertical gap="large">
            <Flex gap="small">
                <Search
                    placeholder="Search for a card"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                />
                <Select
                    defaultValue={SORT_TYPES.ID_ASC}
                    onChange={setSortType}
                    style={{ width: 200 }}
                >
                    <Option value={SORT_TYPES.NAME_ASC}>Name (A-Z)</Option>
                    <Option value={SORT_TYPES.NAME_DESC}>Name (Z-A)</Option>
                    <Option value={SORT_TYPES.ID_ASC}>ID (aufsteigend)</Option>
                    <Option value={SORT_TYPES.ID_DESC}>ID (absteigend)</Option>
                </Select>
            </Flex>

            <InfiniteScroll
                dataLength={filteredCards.length}
                next={() => setPage(p => p + 1)}
                hasMore={hasMore}
            >
                <List
                    loading={loading}
                    grid={{ gutter: 16, column: 6 }}
                    dataSource={filteredCards}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                hoverable
                                onClick={() => navigate(`/card/${item.id}`)}
                                cover={<img src={item.images.small} alt={item.name} />}
                            >
                                <Typography>#{item.number}</Typography>
                                <Card.Meta title={item.name} />
                            </Card>
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </Flex>
    );
};