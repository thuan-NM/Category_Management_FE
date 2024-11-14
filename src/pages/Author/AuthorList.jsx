// src/components/AuthorList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PencilSquareIcon, 
  TrashIcon, 
  PlusIcon, 
  MagnifyingGlassIcon 
} from "@heroicons/react/24/outline";
import AuthorServices from '../../services/AuthorServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [totalAuthors, setTotalAuthors] = useState(0);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    author_name: '',
    website: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    fetchAuthors();
    // eslint-disable-next-line
  }, [pagination]);

  const fetchAuthors = async () => {
    try {
      const params = {
        ...searchParams,
        ...pagination,
      };
      const data = await AuthorServices.getAll(params);
      setAuthors(data.rows);
      setTotalAuthors(data.count);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      toast.error('Tìm kiếm thất bại!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tác giả này?')) {
      try {
        await AuthorServices.delete(id);
        fetchAuthors(); // Refresh the list after deletion
        toast.success('Xóa tác giả thành công!');
      } catch (err) {
        console.error(err);
        setError('Đã xảy ra lỗi khi xóa tác giả. Vui lòng thử lại sau.');
        toast.error('Xóa tác giả thất bại!');
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
    if (newPage < 1 || (newPage - 1) * pagination.limit >= totalAuthors) return;
    setPagination(prev => ({ ...prev, page: newPage }));
    toast.info(`Đang chuyển đến trang ${newPage}...`);
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 })); // Reset về trang đầu khi tìm kiếm mới
    toast.info('Đang tìm kiếm...');
    fetchAuthors();
  };

  return (
    <div className="p-4">
      <ToastContainer />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Tác giả</h2>
        <Link to="/authors/new" className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition duration-200">
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Tác giả
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
        {/* Author Name */}
        <input
          type="text"
          name="author_name"
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Tên tác giả"
          value={searchParams.author_name}
          onChange={handleSearchChange}
        />
        {/* Website */}
        <input
          type="text"
          name="website"
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Website"
          value={searchParams.website}
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

      {/* Author Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              {/* STT */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">STT</th>
              {/* Author Name */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Tên tác giả</th>
              {/* Website */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Website</th>
              {/* Notes */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Ghi chú</th>
              {/* Actions */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {Array.isArray(authors) && authors.length > 0 ? (
              authors.map((author, index) => (
                <tr key={author.author_id} className="hover:bg-gray-100 transition duration-150">
                  <td className="py-3 px-4">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                  <td className="py-3 px-4">{author.author_name}</td>
                  <td className="py-3 px-4">{author.website || 'N/A'}</td>
                  <td className="py-3 px-4">{author.notes || 'N/A'}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <Link to={`/authors/edit/${author.author_id}`} className="text-yellow-600 hover:text-yellow-800">
                      <PencilSquareIcon className="h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDelete(author.author_id)} className="text-red-600 hover:text-red-800">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center">Không tìm thấy tác giả nào.</td>
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
            Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến {Math.min(pagination.page * pagination.limit, totalAuthors)} trong tổng số {totalAuthors} tác giả
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
            disabled={pagination.page * pagination.limit >= totalAuthors}
            className={`px-3 py-1 rounded ${pagination.page * pagination.limit >= totalAuthors ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 transition duration-200'}`}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorList;
