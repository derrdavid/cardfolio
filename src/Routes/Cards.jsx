import React, { use, useEffect } from "react";
import { Card, Select, List, Flex, Typography } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCardFiltering } from "../Hooks/useCardFiltering";
import { useCardsData } from "../api/pokemon_tcg_service";
import Search from "antd/es/transfer/search";
import Title from "antd/es/typography/Title";

export const Cards = () => {
    const navigate = useNavigate();
    const { state: set } = useLocation();

    // React Query Hook
    const { data: cards, isLoading } = useCardsData(`?q=set.id:${set.id}&orderBy=id`);

    useEffect(() => { setSortType(SORT_TYPES.ID_ASC) }, [isLoading])

    // Card Filtering Hook
    const {
        filteredCards,
        setSearchTerm,
        setSortType,
        setFilterType,
        SORT_TYPES
    } = useCardFiltering(cards || []);

    // Sortieroptionen verwenden SORT_TYPES
    const sortOptions = [
        { value: SORT_TYPES.NAME_ASC, label: 'Name (A-Z)' },
        { value: SORT_TYPES.NAME_DESC, label: 'Name (Z-A)' },
        { value: SORT_TYPES.ID_ASC, label: 'ID (asc)' },
        { value: SORT_TYPES.ID_DESC, label: 'ID (desc)' }
    ];

    return (
        <Flex vertical gap="large">
            <Title level={1}>{set.name}</Title>

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
                    {sortOptions.map(({ value, label }) => (
                        <Option key={value} value={value}>{label}</Option>
                    ))}
                </Select>
            </Flex>

            <List
                loading={isLoading}
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
        </Flex>
    );
};