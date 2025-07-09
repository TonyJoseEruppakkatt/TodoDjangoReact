import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { importCSV } from '../services/api';

import { toast } from 'react-toastify';

const ImportCSV = ({ onImport }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      toast.warning('Please select a CSV file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/todos/import-csv/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('CSV imported successfully!');
      onImport(); // Refresh the todo list
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to import CSV.');
    }
  };

  return (
    <Form className="d-flex mb-3 mx-2 align-items-center">
      <Form.Control
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="me-2"
      />
      <Button onClick={handleImport} variant="primary">
        Import CSV
      </Button>
    </Form>
  );
};

export default ImportCSV;
