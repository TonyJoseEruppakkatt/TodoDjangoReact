import React from 'react';
import { Form, FormControl } from 'react-bootstrap';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <Form className="mb-3">
      <FormControl
        type="text"
        placeholder="Search todos..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </Form>
  );
};

export default SearchBar;
