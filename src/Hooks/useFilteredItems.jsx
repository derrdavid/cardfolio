import { useState, useMemo } from 'react';
import { SORT_TYPES, DEFAULT_SORT, baseSortFunctions } from '../Utils/baseSortFunctions';

export const useFilteredItems = (
    items = [],
    options = {}
) => {
    const {
        filterFn = () => true,
        sortFunctions = baseSortFunctions
    } = options;

    const [searchTerm, setSearchTerm] = useState("");
    const [sortType, setSortType] = useState(DEFAULT_SORT);
    const [filterType, setFilterType] = useState("all");

    const filteredItems = useMemo(() => {
        if (!items.length) return [];

        const searchLower = searchTerm.toLowerCase().trim();

        // Filter
        const filtered = items.filter(item => {
            const nameMatch = item.name.toLowerCase().includes(searchLower);
            return nameMatch && filterFn(item, filterType);
        });

        // Sort
        return filtered.sort((a, b) => {
            const [type, direction] = sortType.split('-');
            const isAsc = direction === 'asc';
            return sortFunctions[type]?.(a, b, isAsc) || 0;
        });
    }, [items, searchTerm, sortType, filterType, filterFn]);

    return {
        filteredItems,
        searchTerm,
        setSearchTerm,
        sortType,
        setSortType,
        filterType,
        setFilterType,
        SORT_TYPES
    };
};