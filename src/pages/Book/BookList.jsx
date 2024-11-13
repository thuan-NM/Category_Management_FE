// src/components/BookList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import BookServices from '../../services/BookServices';
import { toast } from 'react-toastify'; // Import toast
import GenericExport from '../../components/GenericExport';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    title: '',
    genre: '',
    author: '',
    publisher: '',
    publicationYearFrom: '',
    publicationYearTo: '',
    inStock: false,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [pagination]);

  const fetchBooks = () => {
    const params = {
      ...searchParams,
      ...pagination,
      // sortBy: sort.sortBy, // Loại bỏ sortBy
      // order: sort.order,   // Loại bỏ order
    };

    BookServices.getAll(params)
      .then(data => {
        setBooks(data.rows);
        setTotalBooks(data.count);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
        toast.error('Tìm kiếm thất bại!');
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sách này?')) {
      BookServices.delete(id)
        .then(() => {
          fetchBooks(); // Refresh the list after deletion
          toast.success('Xóa sách thành công!');
        })
        .catch(err => {
          console.error(err);
          setError('Đã xảy ra lỗi khi xóa sách. Vui lòng thử lại sau.');
          toast.error('Xóa sách thất bại!');
        });
    }
  };

  const handleSearchChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (newPage - 1) * pagination.limit >= totalBooks) return;
    setPagination(prev => ({ ...prev, page: newPage }));
    toast.info(`Đang chuyển đến trang ${newPage}...`);
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 })); // Reset về trang đầu khi tìm kiếm mới
    toast.info('Đang tìm kiếm...');
    fetchBooks();
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row !justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Sách</h2>
        <div className="flex space-x-2">
          <Link to="/books/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition duration-200">
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm Sách
          </Link>
          <GenericExport collectionname={"Book"} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 mb-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Tiêu đề"
          value={searchParams.title}
          onChange={handleSearchChange}
        />
        {/* Author */}
        <input
          type="text"
          name="author"
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Tác giả"
          value={searchParams.author}
          onChange={handleSearchChange}
        />
        {/* Genre */}
        <input
          type="text"
          name="genre"
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Thể loại"
          value={searchParams.genre}
          onChange={handleSearchChange}
        />
        {/* Publisher */}
        <input
          type="text"
          name="publisher"
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nhà xuất bản"
          value={searchParams.publisher}
          onChange={handleSearchChange}
        />
        {/* Publication Year From */}
        <input
          type="number"
          name="publicationYearFrom"
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Năm từ"
          value={searchParams.publicationYearFrom}
          onChange={handleSearchChange}
        />
        {/* Publication Year To */}
        <input
          type="number"
          name="publicationYearTo"
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Năm đến"
          value={searchParams.publicationYearTo}
          onChange={handleSearchChange}
        />
        {/* In Stock */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="inStock"
            checked={searchParams.inStock}
            onChange={handleSearchChange}
            className="mr-2"
          />
          <label className="text-gray-700">Còn hàng</label>
        </div>
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

      {/* Book Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              {/* STT */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">STT</th>
              {/* Title */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                Tiêu đề
              </th>
              {/* Author */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                Tác giả
              </th>
              {/* Genre */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                Thể loại
              </th>
              {/* Publisher */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                Nhà xuất bản
              </th>
              {/* Publication Year */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                Năm xuất bản
              </th>
              {/* Quantity */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                Số lượng
              </th>
              {/* Actions */}
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {Array.isArray(books) && books.length > 0 ? (
              books.map((book, index) => (
                <tr key={book.book_id} className="hover:bg-gray-100 transition duration-150">
                  <td className="py-3 px-4">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                  <td className="py-3 px-4">{book.title}</td>
                  <td className="py-3 px-4">{book.Author ? book.Author.author_name : 'N/A'}</td>
                  <td className="py-3 px-4">{book.Genre ? book.Genre.genre_name : 'N/A'}</td>
                  <td className="py-3 px-4">{book.Publisher ? book.Publisher.publisher_name : 'N/A'}</td>
                  <td className="py-3 px-4">{book.publication_year || 'N/A'}</td>
                  <td className="py-3 px-4">{book.quantity || 0}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <Link to={`/books/edit/${book.book_id}`} className="text-yellow-600 hover:text-yellow-800">
                      <PencilSquareIcon className="h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDelete(book.book_id)} className="text-red-600 hover:text-red-800">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 px-4 text-center">Không tìm thấy sách nào.</td>
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
            Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến {Math.min(pagination.page * pagination.limit, totalBooks)} trong tổng số {totalBooks} sách
          </span>
        </div>
        {/* Pagination Buttons */}
        <div className="flex space-x-2 mt-2 md:mt-0">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`px-3 py-1 rounded ${pagination.page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 transition duration-200'
              }`}
          >
            Trước
          </button>
          <span className="px-3 py-1">{pagination.page}</span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page * pagination.limit >= totalBooks}
            className={`px-3 py-1 rounded ${pagination.page * pagination.limit >= totalBooks ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 transition duration-200'
              }`}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookList;
