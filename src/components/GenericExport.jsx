// src/components/GenericExport.js

import React, { useState } from 'react';
import ExportServices from '../services/ExportServices';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GenericExport = ({ collectionname }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    if (!collectionname) {
      toast.error('Vui lòng chọn collection để xuất');
      return;
    }

    try {
      setIsLoading(true);
      const response = await ExportServices.exportCSV(collectionname);
      // Tạo link để tải về file CSV
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${collectionname}.csv`);
      document.body.appendChild(link);
      link.click();
      toast.success('Xuất CSV thành công!');
    } catch (error) {
      console.error(error);
      toast.error('Xuất CSV thất bại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isLoading}
      className={`bg-green-600 text-white px-4 py-2 rounded flex items-center hover:bg-green-700 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Đang xuất...' : 'Xuất CSV'}
    </button>
  );
};

export default GenericExport;
