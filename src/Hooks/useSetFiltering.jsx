import { useFilteredItems } from './useFilteredItems';

export const useSetFiltering = (sets = []) => {
    const {
        filteredItems,
        ...rest
    } = useFilteredItems(sets);

    return {
        ...rest,
        filteredSets: filteredItems
    };
};