import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import ReaderServices from '../../services/ReaderServices';

const ReaderList = () => {
  const [readers, setReaders] = useState([]);

  useEffect(() => {
    ReaderServices.getAll()
      .then(res => setReaders(res.data.rows))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa độc giả này?')) {
      ReaderServices.delete(id)
        .then(() => setReaders(readers.filter(reader => reader.reader_id !== id)))
        .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Độc giả</h2>
        <Link to="/readers/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Độc giả
        </Link>
      </div>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">ID</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Tên Độc giả</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Địa chỉ</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Số thẻ</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {readers.map(reader => (
            <tr key={reader.reader_id} className="hover:bg-gray-100">
              <td className="py-3 px-4">{reader.reader_id}</td>
              <td className="py-3 px-4">{reader.reader_name}</td>
              <td className="py-3 px-4">{reader.address}</td>
              <td className="py-3 px-4">{reader.card_number}</td>
              <td className="py-3 px-4 flex space-x-2">
                <Link to={`/readers/edit/${reader.reader_id}`} className="text-blue-600 hover:text-blue-800">
                  <PencilSquareIcon className="h-5 w-5" />
                </Link>
                <button onClick={() => handleDelete(reader.reader_id)} className="text-red-600 hover:text-red-800">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReaderList;
