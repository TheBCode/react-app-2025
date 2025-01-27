// /c:/Users/Byron B/react-app-2025/src/components/search.jsx
import React, { useState } from 'react';

const Search = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search..."
                className='search border border-gray-300 rounded-md p-2 text-white bg-gray-800'
            />
        </div>
    );
};

export default Search;