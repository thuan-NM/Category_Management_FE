// src/components/PublisherList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PencilSquareIcon, 
  TrashIcon, 
  PlusIcon, 
  MagnifyingGlassIcon 
} from "@heroicons/react/24/outline";
import PublisherServices from '../../services/PublisherServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PublisherList = () => {
  const [publishers, setPublishers] = useState([]);
  const [totalPublishers, setTotalPublishers] = useState(0);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    publisher_name: '',
    email: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    fetchPublishers();
    // eslint-disable-next-line
  }, [pagination]);

  const fetchPublishers = async () => {
    try {
      const params = {
        ...searchParams,
        ...pagination,
      };
      const data = await PublisherServices.getAll(params);
      setPublishers(data.rows);
      setTotalPublishers(data.count);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      toast.error('Tìm kiếm thất bại!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhà xuất bản này?')) {
      try {
        await PublisherServices.delete(id);
        fetchPublishers(); // Refresh the list after deletion
        toast.success('Xóa nhà xuất bản thành công!');
      } catch (err) {
        console.error(err);
        setError('Đã xảy ra lỗi khi xóa nhà xuất bản. Vui lòng thử lại sau.');
        toast.error('Xóa nhà xuất bản thất bại!');
      }
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (newPage - 1) * pagination.limit >= totalPublishers) return;
    setPagination(prev => ({ ...prev, page: newPage }));
    toast.info(`Đang chuyển đến trang ${newPage}...`);
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 })); // Reset về trang đầu khi tìm kiếm mới
    toast.info('Đang tìm kiếm...');
    fetchPublishers();
  };

  return (
    <div className="p-4">
      <ToastContainer />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Nhà xuất bản</h2>
        <Link to="/publishers/new" className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition duration-200">
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Nhà xuất bản
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Publisher Name */}
        <input
          type="text"
          name="publisher_name"
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Tên nhà xuất bản"
          value={searchParams.publisher_name}
          onChange={handleSearchChange}
        />
        {/* Email */}
        <input
          type="text"
          name="email"
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          value={searchParams.email}
          onChange={handleSearchChange}
        />
        {/* Search Button */}
        <div className="flex items-center">
          <button 
            onClick={handleSearch} 
            className="w-full bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-green-700 transition duration-200"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Publisher Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              {/* STT */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">STT</th>
              {/* Publisher Name */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Tên nhà xuất bản</th>
              {/* Email */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Email</th>
              {/* Actions */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {Array.isArray(publishers) && publishers.length > 0 ? (
              publishers.map((publisher, index) => (
                <tr key={publisher.publisher_id} className="hover:bg-gray-100 transition duration-150">
                  <td className="py-3 px-4">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                  <td className="py-3 px-4">{publisher.publisher_name}</td>
                  <td className="py-3 px-4">{publisher.email || 'N/A'}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <Link to={`/publishers/edit/${publisher.publisher_id}`} className="text-yellow-600 hover:text-yellow-800">
                      <PencilSquareIcon className="h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDelete(publisher.publisher_id)} className="text-red-600 hover:text-red-800">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center">Không tìm thấy nhà xuất bản nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4">
        {/* Display Range */}
        <div>
          <span className="text-sm text-gray-700">
            Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến {Math.min(pagination.page * pagination.limit, totalPublishers)} trong tổng số {totalPublishers} nhà xuất bản
          </span>
        </div>
        {/* Pagination Buttons */}
        <div className="flex space-x-2 mt-2 md:mt-0">
          <button 
            onClick={() => handlePageChange(pagination.page - 1)} 
            disabled={pagination.page === 1}
            className={`px-3 py-1 rounded ${pagination.page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 transition duration-200'}`}
          >
            Trước
          </button>
          <span className="px-3 py-1">{pagination.page}</span>
          <button 
            onClick={() => handlePageChange(pagination.page + 1)} 
            disabled={pagination.page * pagination.limit >= totalPublishers}
            className={`px-3 py-1 rounded ${pagination.page * pagination.limit >= totalPublishers ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 transition duration-200'}`}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublisherList;
