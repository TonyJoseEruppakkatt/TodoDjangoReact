import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ImportCSV = ({ onImport }) => {
  const [file, setFile] = useState(null);

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // 🔥 must match Django's `request.FILES.get('file')`

    try {
      const response = await fetch('http://localhost:8000/api/import-csv/', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.success || 'CSV imported successfully');
        setFile(null);
        onImport();
      } else {
        toast.error(result.error || 'CSV import failed');
      }
    } catch (error) {
      console.error('CSV upload error:', error);
      toast.error('CSV import failed');
    }
  };

  return (
    <div className="mb-3">
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button className="btn btn-secondary ms-2" onClick={handleImport}>
        Import CSV
      </button>
    </div>
  );
};

export default ImportCSV;
