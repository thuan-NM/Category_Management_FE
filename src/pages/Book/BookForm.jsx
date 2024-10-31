import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import BookServices from '../../services/BookServices';
import AuthorServices from '../../services/AuthorServices';
import GenreServices from '../../services/GenreServices';
import PublisherServices from '../../services/PublisherServices';

const BookForm = () => {
  const [book, setBook] = useState({
    title: '',
    publication_year: '',
    author_id: '',
    genre_id: '',
    publisher_id: '',
  });
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    AuthorServices.getAll().then(res => setAuthors(res.data));
    GenreServices.getAll().then(res => setGenres(res.data.rows));
    PublisherServices.getAll().then(res => setPublishers(res.data.rows));

    if (id) {
      BookServices.getById(id)
        .then(res => setBook(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      BookServices.update(id,book)
        .then(() => navigate('/books'))
        .catch(err => console.error(err));
    } else {
      axios.post('/api/books', book)
      BookServices.create(book)
        .then(() => navigate('/books'))
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">{id ? 'Chỉnh sửa Sách' : 'Thêm mới Sách'}</h2>
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
          >
            <option value="">Chọn nhà xuất bản</option>
            {publishers.map((publisher) => (
              <option key={publisher.publisher_id} value={publisher.publisher_id}>
                {publisher.publisher_name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200"
        >
          {id ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>
    </div>
  );
};

export default BookForm;