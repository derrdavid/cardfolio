import React, { useState, useEffect } from "react";
import { Card, Input, Select, List, Flex, Typography } from "antd";
import { fetchCards, fetchSets } from "../Services/pokemon_tcg_service";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation, useNavigate } from "react-router-dom";


const { Search } = Input;
const { Option } = Select;

const Cards = ({ set }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { locationSet } = location.state || {}; // Fallback, falls nichts übergeben wurde

    const [cards, setCards] = useState([]);
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredCards, setFilteredCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [cardType, setCardType] = useState("all");
    const [selectedSet, setSelectedSet] = useState(locationSet != null ? locationSet.id : 'all');
    const [sortOrder, setSortOrder] = useState('id-asc');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const sortCards = (cards, sortOrder) => {
        return cards.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            if (sortOrder === "name-asc") {
                return aName.localeCompare(bName);
            } else if (sortOrder === "name-desc") {
                return bName.localeCompare(aName);
            } else if (sortOrder === "id-asc") {
                return a.number.localeCompare(b.number, undefined, { numeric: true });
            } else if (sortOrder === "id-desc") {
                return b.number.localeCompare(a.number, undefined, { numeric: true });
            } else if (sortOrder === "date-asc") {
                return new Date(a.releaseDate) - new Date(b.releaseDate);
            } else if (sortOrder === "date-desc") {
                return new Date(b.releaseDate) - new Date(a.releaseDate);
            }
            return 0;
        });
    };

    // load cards when page changes (including initial load)
    useEffect(() => {
        setLoading(true);
        fetchCards(`?page=${page}${selectedSet != "all" ? `&q=set.id:${selectedSet}` : ''}&orderBy=id`)
            .then((data) => {
                if (data.data.length === 0) {
                    setHasMore(false);
                } else {
                    const newCards = page === 1 ? data.data : [...cards, ...data.data];
                    const sortedData = sortCards(newCards, sortOrder);
                    setCards(sortedData);
                }
            })
            .finally(() => setLoading(false));
    }, [selectedSet, page, sortOrder]);


    useEffect(() => {
        fetchSets('orderBy=id')
            .then((data) => {
                setSets(data.data);
            })
    }, []);

    // filter and sort
    useEffect(() => {
        const searchLower = searchTerm.toLowerCase();
        let result = cards.filter((card) => {
            const name = card.name.toLowerCase();
            const matchesSet = selectedSet === "all" || card.set.id === selectedSet;
            const matchesSearch = name.includes(searchLower);
            const matchesType =
                cardType === "all" ? true : card.type.toLowerCase() === cardType;
            return matchesSearch && matchesType && matchesSet;
        });

        const sortedResult = sortCards(result, sortOrder);
        console.log(sortOrder)

        setFilteredCards(sortedResult);
    }, [searchTerm, cardType, sortOrder, cards, selectedSet ]);

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
                    defaultValue={locationSet != null ? locationSet.id : 'all'}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value) => setSelectedSet(value)}
                    style={{ width: 200 }}
                >
                    <Option value="all">Alle Sets</Option>
                    {sets.map((set) => (
                        <Option key={set.id} value={set.id} name={set.name}>
                            {set.name}
                        </Option>
                    ))}
                </Select>
                <Select
                    defaultValue="id-asc"
                    onChange={(value) => setSortOrder(value)}
                    style={{ width: 200 }}
                >
                    <Option value="name-asc">Name (A-Z)</Option>
                    <Option value="name-desc">Name (Z-A)</Option>
                    <Option value="id-asc">ID (aufsteigend)</Option>
                    <Option value="id-desc">ID (absteigend)</Option>
                </Select>
            </Flex>

            <InfiniteScroll
                dataLength={filteredCards.length}
                next={loadMoreData}
                hasMore={hasMore}
            >
                <List
                    loading={loading}
                    grid={{ gutter: 16, column: 6 }}
                    dataSource={filteredCards}
                    renderItem={(item) => (
                        <List.Item>
                            <Card onClick={() => navigate(`/card/${item.id}`)} hoverable cover={<img src={item.images.small} alt={item.name} />}>
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

export default Cards;
