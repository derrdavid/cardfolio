import React, { useState, useEffect } from "react";
import { Card, Input, Select, Row, Col, List, Flex } from "antd";
import { fetchSets } from '../Services/pokemon_tcg_service';
import SetCard from "../Components/SetCard";

const { Search } = Input;
const { Option } = Select;

const Sets = () => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredSets, setFilteredSets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchSets().then((data) => {
      setSets(data.data);
    }).then(() => setLoading(false));
  }, []);

  // Handle search and filter
  useEffect(() => {
    console.log("HEy")
    const searchLower = searchTerm.toLowerCase();
    const filtered = sets
      .filter((set) => {
        const name = set.name.toLowerCase();
        const matchesSearch = name.includes(searchLower);
        return matchesSearch;
      })
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        // Ermittele, an welcher Stelle der Suchbegriff auftaucht:
        const aIndex = aName.indexOf(searchLower);
        const bIndex = bName.indexOf(searchLower);
        // Je früher der Suchbegriff auftaucht, desto besser:
        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }
        // Falls beide den Suchbegriff an gleicher Stelle haben, kürzeren Namen bevorzugen
        return aName.length - bName.length;
      });
    setFilteredSets(filtered);
  }, [searchTerm, filterType, sets]);

  return (
    <Flex vertical gap="large">
      <Flex gap="small">
        <Search
          placeholder="Search for a set"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          defaultValue="all"
          onChange={(value) => setFilterType(value)}
          style={{ width: 200 }}
        >
          <Option value="all">All Types</Option>
          <Option value="booster">Booster</Option>
          <Option value="deck">Deck</Option>
          <Option value="promo">Promo</Option>
        </Select>

        <Select
          defaultValue="name-asc"
          onChange={(value) => setFilterType(value)}
          style={{ width: 200 }}
        >
          <Option value="name-asc">Name (A-Z)</Option>
          <Option value="name-desc">Name (Z-A)</Option>
        </Select>

      </Flex>

      <List
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        dataSource={filteredSets}
        key={filteredSets.id}
        renderItem={(item) => (
          <List.Item>
            <SetCard loading={loading} item={item} />
          </List.Item>
        )}
      />
    </Flex>
  );
};

export default Sets;
