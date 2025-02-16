import React, { useState, useEffect } from "react";
import { Card, Input, Select, List, Flex, Typography } from "antd";
import { fetchCards, fetchSets } from "../Services/pokemon_tcg_service";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";


const { Search } = Input;
const { Option } = Select;

const Cards = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredCards, setFilteredCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [cardType, setCardType] = useState("all");
    const [selectedSet, setSelectedSet] = useState();
    const [sortOrder, setSortOrder] = useState("name-asc");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // load cards when page changes (including initial load)
    useEffect(() => {
        fetchCards(`?page=${page}${selectedSet != "all" ? `&q=set.id:${selectedSet}` : ''}&orderBy=id`)
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
    }, [selectedSet, page]);


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

        result.sort((a, b) => {
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
            }
            return 0;
        });
        setFilteredCards(result);
    }, [searchTerm, cardType, sortOrder, cards, selectedSet]);

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
                endMessage={<p>No more cards to show.</p>}
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
