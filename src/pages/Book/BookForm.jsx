// src/components/BookForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookServices from '../../services/BookServices';
import AuthorServices from '../../services/AuthorServices';
import GenreServices from '../../services/GenreServices';
import PublisherServices from '../../services/PublisherServices';
import { toast } from 'react-toastify'; // Import toast
import { 
  PencilSquareIcon, 
  TrashIcon, 
  PlusIcon, 
  EyeIcon, 
  MagnifyingGlassIcon 
} from "@heroicons/react/24/outline";

const BookForm = () => {
  const [book, setBook] = useState({
    title: '',
    publication_year: '',
    author_id: '',
    genre_id: '',
    publisher_id: '',
    quantity: '', // Added quantity field
  });
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch authors, genres, and publishers concurrently
        const [authorsRes, genresRes, publishersRes] = await Promise.all([
          AuthorServices.getAll(),
          GenreServices.getAll(),
          PublisherServices.getAll(),
        ]);

        setAuthors(authorsRes.data); // Assuming AuthorServices.getAll() returns data directly
        setGenres(genresRes.data.rows); // Assuming GenreServices.getAll() returns { rows, count }
        setPublishers(publishersRes.data.rows); // Assuming PublisherServices.getAll() returns { rows, count }

        if (id) {
          const bookRes = await BookServices.getById(id);
          setBook(bookRes); // Correctly set the book data
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
        toast.error('Tải dữ liệu thất bại!');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook({
      ...book,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic front-end validation
    if (!book.title.trim()) {
      setError('Tiêu đề không được để trống.');
      toast.warn('Vui lòng nhập tiêu đề sách.');
      return;
    }

    if (book.quantity === '' || book.quantity < 0) {
      setError('Số lượng phải là số không âm.');
      toast.warn('Số lượng phải là số không âm.');
      return;
    }

    try {
      if (id) {
        await BookServices.update(id, book);
        toast.success('Cập nhật sách thành công!');
        navigate('/books');
      } else {
        await BookServices.create(book);
        toast.success('Thêm mới sách thành công!');
        navigate('/books');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại sau.');
      toast.error('Lưu dữ liệu thất bại!');
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Đang tải...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
        {id ? 'Chỉnh sửa Sách' : 'Thêm mới Sách'}
      </h2>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tiêu đề */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={book.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề sách"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
            required
          />
        </div>

        {/* Năm xuất bản */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Năm xuất bản</label>
          <input
            type="number"
            name="publication_year"
            value={book.publication_year}
            onChange={handleChange}
            placeholder="Nhập năm xuất bản"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
            min="0" // Ensures publication year is non-negative
          />
        </div>

        {/* Tác giả */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Tác giả</label>
          <select
            name="author_id"
            value={book.author_id}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
            required
          >
            <option value="">Chọn tác giả</option>
            {authors.map((author) => (
              <option key={author.author_id} value={author.author_id}>
                {author.author_name}
              </option>
            ))}
          </select>
        </div>

        {/* Thể loại */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Thể loại</label>
          <select
            name="genre_id"
            value={book.genre_id}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
            required
          >
            <option value="">Chọn thể loại</option>
            {genres.map((genre) => (
              <option key={genre.genre_id} value={genre.genre_id}>
                {genre.genre_name}
              </option>
            ))}
          </select>
        </div>

        {/* Nhà xuất bản */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Nhà xuất bản</label>
          <select
            name="publisher_id"
            value={book.publisher_id}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
            required
          >
            <option value="">Chọn nhà xuất bản</option>
            {publishers.map((publisher) => (
              <option key={publisher.publisher_id} value={publisher.publisher_id}>
                {publisher.publisher_name}
              </option>
            ))}
          </select>
        </div>

        {/* Số lượng */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Số lượng</label>
          <input
            type="number"
            name="quantity"
            value={book.quantity}
            onChange={handleChange}
            placeholder="Nhập số lượng sách"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
            required
            min="0" // Ensures quantity is non-negative
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200 flex items-center justify-center"
        >
          {id ? (
            <>
              <PencilSquareIcon className="h-5 w-5 mr-2" />
              Cập nhật
            </>
          ) : (
            <>
              <PlusIcon className="h-5 w-5 mr-2" />
              Thêm mới
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookForm;
