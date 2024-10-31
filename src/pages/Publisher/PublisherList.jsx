import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import PublisherServices from '../../services/PublisherServices';

const PublisherList = () => {
  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    PublisherServices.getAll()
      .then(res => setPublishers(res.data.rows))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhà xuất bản này?')) {
      PublisherServices.delete(id)
        .then(() => setPublishers(publishers.filter(publisher => publisher.publisher_id !== id)))
        .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Nhà xuất bản</h2>
        <Link to="/publishers/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Nhà xuất bản
        </Link>
      </div>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">ID</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Tên Nhà xuất bản</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Địa chỉ</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Email</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Thông tin đại diện</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {publishers.map(publisher => (
            <tr key={publisher.publisher_id} className="hover:bg-gray-100">
              <td className="py-3 px-4">{publisher.publisher_id}</td>
              <td className="py-3 px-4">{publisher.publisher_name}</td>
              <td className="py-3 px-4">{publisher.address}</td>
              <td className="py-3 px-4">{publisher.email}</td>
              <td className="py-3 px-4">{publisher.representative_info}</td>
              <td className="py-3 px-4 flex space-x-2">
                <Link to={`/publishers/edit/${publisher.publisher_id}`} className="text-blue-600 hover:text-blue-800">
                  <PencilSquareIcon className="h-5 w-5" />
                </Link>
                <button onClick={() => handleDelete(publisher.publisher_id)} className="text-red-600 hover:text-red-800">
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

export default PublisherList;
