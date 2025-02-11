import React, { useState, useEffect } from "react";
import { Card, Input, Select, List, Flex, Typography } from "antd";
import { fetchCards } from "../Services/pokemon_tcg_service";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";


const { Search } = Input;
const { Option } = Select;

const Cards = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredCards, setFilteredCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [cardType, setCardType] = useState("all");
    const [sortOrder, setSortOrder] = useState("name-asc");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // load cards when page changes (including initial load)
    useEffect(() => {
        fetchCards(`?page=${page}`)
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
    }, [page]);

    // filter and sort
    useEffect(() => {
        const searchLower = searchTerm.toLowerCase();
        let result = cards.filter((card) => {
            const name = card.name.toLowerCase();
            const matchesSearch = name.includes(searchLower);
            const matchesType =
                cardType === "all" ? true : card.type.toLowerCase() === cardType;
            return matchesSearch && matchesType;
        });

        result.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            if (sortOrder === "name-asc") {
                return aName.localeCompare(bName);
            } else if (sortOrder === "name-desc") {
                return bName.localeCompare(aName);
            }
            return 0;
        });
        setFilteredCards(result);
    }, [searchTerm, cardType, sortOrder, cards]);

    // load next page
    const loadMoreData = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <Flex vertical gap="large">
            <Flex gap="small">
                <Search
                    placeholder="Search for a card"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                />
                <Select
                    defaultValue="all"
                    onChange={(value) => setCardType(value)}
                    style={{ width: 200 }}
                >
                    <Option value="all">All Types</Option>
                    <Option value="booster">Booster</Option>
                    <Option value="deck">Deck</Option>
                    <Option value="promo">Promo</Option>
                </Select>
                <Select
                    defaultValue="name-asc"
                    onChange={(value) => setSortOrder(value)}
                    style={{ width: 200 }}
                >
                    <Option value="name-asc">Name (A-Z)</Option>
                    <Option value="name-desc">Name (Z-A)</Option>
                </Select>
            </Flex>

            <InfiniteScroll
                dataLength={filteredCards.length}
                next={loadMoreData}
                hasMore={hasMore}
                endMessage={<p>No more cards to show.</p>}
            >
                <List
                    loading={loading}
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={filteredCards}
                    renderItem={(item) => (
                        <List.Item hoverable onClick={() => navigate(`/card/${item.id}`)} style={{ cursor: 'pointer' }}>
                            <List.Item.Meta
                                hoverable
                                avatar={
                                    <img
                                        src={item.images.small}
                                        alt="Activity"
                                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                }
                                title={item.name}
                            />
                            <Typography className={`activity-amount ${item.amountType}`}>{item.amount}</Typography>
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </Flex>
    );
};

export default Cards;
