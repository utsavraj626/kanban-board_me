// components/SortOptions.js
import React from 'react';

const SortOptions = ({ sorting, setSorting }) => {
    return (
        <div className="sort-options">
            <label htmlFor="sorting">Sort by: </label>
            <select
                id="sorting"
                value={sorting}
                onChange={(e) => setSorting(e.target.value)}
            >
                <option value="priority">Priority</option>
                <option value="title">Title</option>
            </select>
        </div>
    );
};

export default SortOptions;
