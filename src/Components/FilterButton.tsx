import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const FilterButton: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center p-2 bg-blue-500 text-white rounded focus:outline-none focus:bg-blue-600"
        onClick={toggleFilter}
      >
        <FontAwesomeIcon icon={faFilter} className="mr-2" />
        <span>Filter</span>
      </button>

      {isFilterOpen && (
        <div className="absolute right-0 mt-2 p-4 bg-white border shadow-lg">
          {/* Add your filter options here */}
          <label className="block mb-2">
            <input type="checkbox" className="mr-2" />
            Option 1
          </label>
          <label className="block mb-2">
            <input type="checkbox" className="mr-2" />
            Option 2
          </label>
          {/* Add more checkboxes as needed */}
        </div>
      )}
    </div>
  );
};

export default FilterButton;
