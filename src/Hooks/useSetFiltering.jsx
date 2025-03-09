import { useState, useMemo } from 'react';

// Konstanten außerhalb des Hooks definieren
const SORT_TYPES = {
    NAME_ASC: 'name-asc',
    NAME_DESC: 'name-desc',
    DATE_ASC: 'date-asc',
    DATE_DESC: 'date-desc'
};

const DEFAULT_SORT = SORT_TYPES.DATE_DESC;

// Sortier-Funktionen auslagern
const sortByName = (a, b, isAsc) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    return isAsc ? aName.localeCompare(bName) : bName.localeCompare(aName);
};

const sortByDate = (a, b, isAsc) => {
    const aDate = new Date(a.releaseDate);
    const bDate = new Date(b.releaseDate);
    return isAsc ? aDate - bDate : bDate - aDate;
};

export const useSetFiltering = (initialSets = []) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortType, setSortType] = useState(DEFAULT_SORT);

    // Memoisierte Filterung und Sortierung
    const filteredSets = useMemo(() => {
        if (!initialSets.length) return [];

        const searchLower = searchTerm.toLowerCase().trim();

        // Erst filtern
        const filtered = searchLower
            ? initialSets.filter(set =>
                set.name.toLowerCase().includes(searchLower))
            : initialSets;

        // Dann sortieren
        return filtered.sort((a, b) => {
            if (sortType.includes('name')) {
                return sortByName(a, b, sortType === SORT_TYPES.NAME_ASC);
            }
            if (sortType.includes('date')) {
                return sortByDate(a, b, sortType === SORT_TYPES.DATE_ASC);
            }
            return 0;
        });
    }, [initialSets, searchTerm, sortType]);

    return {
        filteredSets,
        searchTerm,
        setSearchTerm,
        sortType,
        setSortType,
        SORT_TYPES // Exportieren der Konstanten für Komponenten
    };
};