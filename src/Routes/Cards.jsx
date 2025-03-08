import React, { useState, useEffect, useCallback } from "react";
import { Card, Input, Select, List, Flex, Typography } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchCards, fetchSets } from "../api/pokemon_tcg_service";
import { useLocation, useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

/**
 * Sortiert ein Array von Karten basierend auf den Übergabeparametern.
 */
const sortCards = (cards, sortOrder) => {
    return cards.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        switch (sortOrder) {
            case "name-asc":
                return aName.localeCompare(bName);
            case "name-desc":
                return bName.localeCompare(aName);
            case "id-asc":
                return a.number.localeCompare(b.number, undefined, { numeric: true });
            case "id-desc":
                return b.number.localeCompare(a.number, undefined, { numeric: true });
            case "date-asc":
                return new Date(a.releaseDate) - new Date(b.releaseDate);
            case "date-desc":
                return new Date(b.releaseDate) - new Date(a.releaseDate);
            default:
                return 0;
        }
    });
};

/**
 * Filtert die Karten basierend auf Suche, Karten-Typ und ausgewähltem Set.
 */
const filterCards = (cards, { searchTerm, cardType, selectedSet }) => {
    const searchLower = searchTerm.toLowerCase();
    return cards.filter((card) => {
        const name = card.name.toLowerCase();
        const matchesSet = selectedSet === "all" || card.set.id === selectedSet;
        const matchesSearch = name.includes(searchLower);
        const matchesType = cardType === "all" ? true : card.type.toLowerCase() === cardType;
        return matchesSearch && matchesType && matchesSet;
    });
};

const Cards = ({ set }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { locationSet } = location.state || {};
    const [cards, setCards] = useState([]);
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredCards, setFilteredCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [cardType, setCardType] = useState("all");
    const [selectedSet, setSelectedSet] = useState(locationSet ? locationSet.id : "all");
    const [sortOrder, setSortOrder] = useState("id-asc");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    /**
     * Lädt Karten basierend auf Seite, selektiertem Set und Sortierreihenfolge.
     */
    const loadCards = useCallback(() => {
        setLoading(true);
        const setFilter = selectedSet !== "all" ? `&q=set.id:${selectedSet}` : "";
        fetchCards(`?page=${page}${setFilter}&orderBy=id`)
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
        // cards wird hier absichtlich als Abhängigkeit genutzt, damit bei Page 1 der neue State korrekt gesetzt wird.
    }, [page, selectedSet, sortOrder, cards]);

    // Initialer und paginierter Karten-Load
    useEffect(() => {
        loadCards();
    }, [loadCards]);

    // Laden der Sets
    useEffect(() => {
        fetchSets("orderBy=id").then((data) => setSets(data.data));
    }, []);

    // Filter und Sortierung anwenden
    useEffect(() => {
        const result = filterCards(cards, { searchTerm, cardType, selectedSet });
        const sortedResult = sortCards(result, sortOrder);
        setFilteredCards(sortedResult);
    }, [searchTerm, cardType, sortOrder, cards, selectedSet]);

    const loadMoreData = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleCardClick = (id) => navigate(`/card/${id}`);

    return (
        <Flex vertical gap="large">
            <Flex gap="small">
                <Search
                    placeholder="Search for a card"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                />
                <Select
                    defaultValue={selectedSet}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value) => {
                        setSelectedSet(value);
                        setPage(1); // Reset Page beim Set-Wechsel
                    }}
                    style={{ width: 200 }}
                >
                    <Option value="all">Alle Sets</Option>
                    {sets.map((s) => (
                        <Option key={s.id} value={s.id} name={s.name}>
                            {s.name}
                        </Option>
                    ))}
                </Select>
                <Select
                    defaultValue={sortOrder}
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
                            <Card
                                hoverable
                                onClick={() => handleCardClick(item.id)}
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

export default Cards;