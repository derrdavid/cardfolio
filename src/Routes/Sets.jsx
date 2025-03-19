import React from "react";
import { Input, Select, List, Flex } from "antd";
import { useSetData } from '../api/pokemon_tcg_service';
import SetCard from "../Components/SetCard";
import Title from "antd/es/typography/Title";
import { useSetFiltering } from "../Hooks/useSetFiltering";

const { Search } = Input;
const { Option } = Select;

const Sets = () => {
  const { data: sets, isLoading } = useSetData();

  // Verwende den verbesserten Hook mit SORT_TYPES
  const {
    filteredSets,
    setSearchTerm,
    setSortType,
    setFilterType,
    SORT_TYPES
  } = useSetFiltering(sets);

  // Sortieroptionen verwenden nun SORT_TYPES
  const sortOptions = [
    { value: SORT_TYPES.NAME_ASC, label: 'Name (A-Z)' },
    { value: SORT_TYPES.NAME_DESC, label: 'Name (Z-A)' },
    { value: SORT_TYPES.DATE_ASC, label: 'Date (asc)' },
    { value: SORT_TYPES.DATE_DESC, label: 'Date (desc)' }
  ];

  return (
    <Flex vertical gap="large">
      <Title level={1}>Browse Sets</Title>

      <Flex gap="small">
        <Search
          placeholder="Search for a set"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{flex: 1}}
        />

        <Select
          defaultValue={SORT_TYPES.DATE_DESC}
          onChange={setSortType}
          style={{flex: 2}}
          >
          {sortOptions.map(({ value, label }) => (
            <Option key={value} value={value}>{label}</Option>
          ))}
        </Select>
      </Flex>

      <List
        loading={isLoading}
        grid={{ gutter: 8, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
        dataSource={filteredSets}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <SetCard loading={isLoading} item={item} />
          </List.Item>
        )}
      />
    </Flex>
  );
};

export default Sets;