import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => (
    <div className="relative mb-4 flex-shrink-0">
        <input
            type="search"
            id="searchInput"
            className="w-full p-3 pl-4 pr-12 rounded-xl bg-gray-200/50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all"
            placeholder="Search by name, style, tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    </div>
);

export default SearchBar;
