import React, { useState, useEffect } from "react";
import { Card, Input, Select, Row, Col, List, Flex } from "antd";
import { fetchSets } from '../Services/pokemon_tcg_service';
import SetCard from "../Components/SetCard";
import InfiniteScroll from 'react-infinite-scroll-component';

const { Search } = Input;
const { Option } = Select;

const Sets = () => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredSets, setFilteredSets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name-asc");
  const [page, setPage] = useState(1); // Seitenzahl für die Paginierung
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    console.log(page)
    fetchSets(`page=${page}`).then((data) => {
      // Wenn es keine Sets mehr gibt, setzen wir hasMore auf false
      if (data.data.length === 0) {
        setHasMore(false);
      } else {
        setSets(data.data);
      }
    }).then(() => setLoading(false));
  }, []);

  // Handle search and filter
  useEffect(() => {
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

        if (filterType.includes("name")) {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          // Sortiere nach Namen (A-Z oder Z-A)
          if (filterType === "name-asc") {
            return aName.localeCompare(bName); // A-Z
          } else if (filterType === "name-desc") {
            return bName.localeCompare(aName); // Z-A
          }
        }

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


  const loadMoreData = () => {
    if (hasMore) {
      setPage(page + 1); // Lade die nächste Seite
    }
  };

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

      <InfiniteScroll
        dataLength={filteredSets.length} // Anzahl der bisher geladenen Sets
        hasMore={hasMore} // Flag, ob mehr Sets vorhanden sind
        endMessage={<p>No more sets to show.</p>} // Nachricht, wenn alle Sets geladen sind
      >
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
      </InfiniteScroll>
    </Flex>
  );
};

export default Sets;
