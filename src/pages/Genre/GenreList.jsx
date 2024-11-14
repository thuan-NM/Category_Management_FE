// src/components/GenreList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import GenreServices from '../../services/GenreServices';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GenericExport from '../../components/GenericExport';

const GenreList = () => {
  const [genres, setGenres] = useState([]);
  const [totalGenres, setTotalGenres] = useState(0);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    genre_name: '',
    description: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    fetchGenres();
    // eslint-disable-next-line
  }, [pagination]);

  const fetchGenres = async () => {
    try {
      const params = {
        ...searchParams,
        ...pagination,
      };
      const data = await GenreServices.getAll(params);
      setGenres(data.rows);
      setTotalGenres(data.count);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      toast.error('Tìm kiếm thất bại!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa thể loại này?')) {
      try {
        await GenreServices.delete(id);
        fetchGenres(); // Refresh the list after deletion
        toast.success('Xóa thể loại thành công!');
      } catch (err) {
        console.error(err);
        setError('Đã xảy ra lỗi khi xóa thể loại. Vui lòng thử lại sau.');
        toast.error('Xóa thể loại thất bại!');
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
    if (newPage < 1 || (newPage - 1) * pagination.limit >= totalGenres) return;
    setPagination(prev => ({ ...prev, page: newPage }));
    toast.info(`Đang chuyển đến trang ${newPage}...`);
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 })); // Reset về trang đầu khi tìm kiếm mới
    toast.info('Đang tìm kiếm...');
    fetchGenres();
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Thể loại</h2>
        <div className="flex space-x-2">
          <Link to="/genres/new" className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition duration-200">
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm Thể loại
          </Link>
          <GenericExport collectionname={"Genre"} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Genre Name */}
        <input
          type="text"
          name="genre_name"
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Tên thể loại"
          value={searchParams.genre_name}
          onChange={handleSearchChange}
        />
        {/* Description */}
        <input
          type="text"
          name="description"
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Mô tả"
          value={searchParams.description}
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

      {/* Genre Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              {/* STT */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center border-r border-gray-500">STT</th>
              {/* Genre Name */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center border-r border-gray-500">Tên thể loại</th>
              {/* Description */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center border-r border-gray-500">Mô tả</th>
              {/* Actions */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {Array.isArray(genres) && genres.length > 0 ? (
              genres.map((genre, index) => (
                <tr key={genre.genre_id} className="hover:bg-gray-100 transition duration-150">
                  <td className="py-3 px-4">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                  <td className="py-3 px-4">{genre.genre_name}</td>
                  <td className="py-3 px-4">{genre.description || 'N/A'}</td>
                  <td className="py-3 px-4 flex space-x-2 justify-center">
                    <Link to={`/genres/edit/${genre.genre_id}`} className="text-yellow-600 hover:text-yellow-800">
                      <PencilSquareIcon className="h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDelete(genre.genre_id)} className="text-red-600 hover:text-red-800">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center">Không tìm thấy thể loại nào.</td>
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
            Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến {Math.min(pagination.page * pagination.limit, totalGenres)} trong tổng số {totalGenres} thể loại
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
            disabled={pagination.page * pagination.limit >= totalGenres}
            className={`px-3 py-1 rounded ${pagination.page * pagination.limit >= totalGenres ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 transition duration-200'}`}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenreList;
