import React from 'react';
import { Dropdown } from 'react-bootstrap';

const FilterDropdown = ({ filterStatus, onFilterChange }) => {
  return (
    <Dropdown className="mb-3">
      <Dropdown.Toggle variant="secondary" id="dropdown-filter">
        {filterStatus === 'all'
          ? 'All'
          : filterStatus === 'completed'
          ? 'Completed'
          : 'Not Completed'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onFilterChange('all')}>
          All
        </Dropdown.Item>
        <Dropdown.Item onClick={() => onFilterChange('completed')}>
          Completed
        </Dropdown.Item>
        <Dropdown.Item onClick={() => onFilterChange('not_completed')}>
          Not Completed
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FilterDropdown;
