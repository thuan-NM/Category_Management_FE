import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/outline";
import BookServices from '../../services/BookServices';

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    BookServices.getAll()
      .then(res => setBooks(res.data.rows))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sách này?')) {
      BookServices.delete(id)
        .then(() => setBooks(books.filter(book => book.book_id !== id)))
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Danh sách Sách</h2>
        <Link to="/books/new" className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-green-700 transition duration-200">
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Sách
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">ID</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Tiêu đề</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Tác giả</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Thể loại</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Nhà xuất bản</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Năm xuất bản</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Số lượng</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {books.map(book => (
              <tr key={book.book_id} className="hover:bg-gray-100 transition duration-150">
                <td className="py-3 px-4">{book.book_id}</td>
                <td className="py-3 px-4">{book.title}</td>
                <td className="py-3 px-4">{book.Author ? book.Author.author_name : 'N/A'}</td>
                <td className="py-3 px-4">{book.Genre ? book.Genre.genre_name : 'N/A'}</td>
                <td className="py-3 px-4">{book.Publisher ? book.Publisher.publisher_name : 'N/A'}</td>
                <td className="py-3 px-4">{book.publication_year || 'N/A'}</td>
                <td className="py-3 px-4">{book.quantity || 0}</td>
                <td className="py-3 px-4 flex space-x-2">
                  <Link to={`/books/view/${book.book_id}`} className="text-blue-600 hover:text-blue-800">
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                  <Link to={`/books/edit/${book.book_id}`} className="text-yellow-600 hover:text-yellow-800">
                    <PencilSquareIcon className="h-5 w-5" />
                  </Link>
                  <button onClick={() => handleDelete(book.book_id)} className="text-red-600 hover:text-red-800">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;
