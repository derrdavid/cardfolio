export const SORT_TYPES = {
    NAME_ASC: 'name-asc',
    NAME_DESC: 'name-desc',
    DATE_ASC: 'date-asc',
    DATE_DESC: 'date-desc',
    ID_ASC: 'id-asc',
    ID_DESC: 'id-desc'
};

export const DEFAULT_SORT = SORT_TYPES.DATE_DESC;

export const baseSortFunctions = {
    name: (a, b, isAsc) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        return isAsc ? aName.localeCompare(bName) : bName.localeCompare(aName);
    },
    date: (a, b, isAsc) => {
        const aDate = new Date(a.releaseDate);
        const bDate = new Date(b.releaseDate);
        return isAsc ? aDate - bDate : bDate - aDate;
    },
    id: (a, b, isAsc) => {
        return isAsc 
            ? a.number.localeCompare(b.number, undefined, { numeric: true })
            : b.number.localeCompare(a.number, undefined, { numeric: true });
    }
};