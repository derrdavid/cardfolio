import { useFilteredItems } from './useFilteredItems';

// Spezifische Filterlogik für Karten
const cardFilterFn = (card, type) => {
    if (type === "all") return true;
    return card.type.toLowerCase() === type.toLowerCase();
};

export const useCardFiltering = (cards = []) => {
    const {
        filteredItems,
        ...rest
    } = useFilteredItems(cards, {
        filterFn: cardFilterFn
    });

    return {
        ...rest,
        filteredCards: filteredItems
    };
};