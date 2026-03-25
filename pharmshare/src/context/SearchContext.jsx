import React, { createContext, useState, useContext } from 'react';

/* eslint-disable react-refresh/only-export-components */


const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 400); // 400ms delay

        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery, debouncedSearchQuery }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
