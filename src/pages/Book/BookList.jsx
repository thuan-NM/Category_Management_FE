import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, PlusIcon, EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import BookServices from '../../services/BookServices';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchParams, setSearchParams] = useState({
    title: '',
    genre: '',
    author: '',
    publisher: '',
    publicationYearFrom: '',
    publicationYearTo: '',
    inStock: false,
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    BookServices.getAll()
      .then(res => setBooks(res.data.rows))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sách này?')) {
      BookServices.delete(id)
        .then(() => setBooks(books.filter(book => book.book_id !== id)))
        .catch(err => console.error(err));
    }
  };

  const handleSearchChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSearchParams({
      ...searchParams,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const filteredBooks = books.filter(book => {
    const matchesTitle = searchParams.title === '' || book.title.toLowerCase().includes(searchParams.title.toLowerCase());
    const matchesGenre = searchParams.genre === '' || (book.Genre && book.Genre.genre_name.toLowerCase().includes(searchParams.genre.toLowerCase()));
    const matchesAuthor = searchParams.author === '' || (book.Author && book.Author.author_name.toLowerCase().includes(searchParams.author.toLowerCase()));
    const matchesPublisher = searchParams.publisher === '' || (book.Publisher && book.Publisher.publisher_name.toLowerCase().includes(searchParams.publisher.toLowerCase()));
    const matchesPublicationYearFrom = searchParams.publicationYearFrom === '' || (book.publication_year && book.publication_year >= parseInt(searchParams.publicationYearFrom));
    const matchesPublicationYearTo = searchParams.publicationYearTo === '' || (book.publication_year && book.publication_year <= parseInt(searchParams.publicationYearTo));
    const matchesInStock = !searchParams.inStock || (book.quantity && book.quantity > 0);

    return matchesTitle && matchesGenre && matchesAuthor && matchesPublisher && matchesPublicationYearFrom && matchesPublicationYearTo && matchesInStock;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Sách</h2>
        <Link to="/books/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Sách
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-2 mb-4">
        <input
          type="text"
          name="title"
          className="w-full px-2 py-1 border rounded-lg shadow-sm"
          placeholder="Tiêu đề"
          value={searchParams.title}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="genre"
          className="w-full px-2 py-1 border rounded-lg shadow-sm"
          placeholder="Thể loại"
          value={searchParams.genre}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="author"
          className="w-full px-2 py-1 border rounded-lg shadow-sm"
          placeholder="Tác giả"
          value={searchParams.author}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="publisher"
          className="w-full px-2 py-1 border rounded-lg shadow-sm"
          placeholder="Nhà xuất bản"
          value={searchParams.publisher}
          onChange={handleSearchChange}
        />
        <input
          type="number"
          name="publicationYearFrom"
          className="w-full px-2 py-1 border rounded-lg shadow-sm"
          placeholder="Năm từ"
          value={searchParams.publicationYearFrom}
          onChange={handleSearchChange}
        />
        <input
          type="number"
          name="publicationYearTo"
          className="w-full px-2 py-1 border rounded-lg shadow-sm"
          placeholder="Năm đến"
          value={searchParams.publicationYearTo}
          onChange={handleSearchChange}
        />
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
            {filteredBooks.map(book => (
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
