import React from 'react';
import { importCSV } from '../services/api';
import { toast } from 'react-toastify';

const ImportCSV = ({ onImport }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await importCSV(file);
      toast.success('CSV imported successfully!');
      onImport(); // Refresh todos
    } catch (error) {
      console.error('CSV Import Error:', error.response?.data || error.message);
      toast.error('Failed to import CSV');
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor="csvUpload">Import CSV</label>
      <input
        type="file"
        accept=".csv"
        id="csvUpload"
        className="form-control"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImportCSV;
