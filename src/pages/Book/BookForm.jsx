// src/components/BookForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookServices from '../../services/BookServices';
import AuthorServices from '../../services/AuthorServices';
import GenreServices from '../../services/GenreServices';
import PublisherServices from '../../services/PublisherServices';
import { toast } from 'react-toastify';
import {
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';

const { Option } = Select; // Import Option từ antd

const BookForm = () => {
  const [book, setBook] = useState({
    title: '',
    publication_year: '',
    author_id: '',
    genre_id: '',
    publisher_id: '',
    quantity: '',
  });
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsRes, genresRes, publishersRes] = await Promise.all([
          AuthorServices.getAll(),
          GenreServices.getAll(),
          PublisherServices.getAll(),
        ]);

        setAuthors(authorsRes.rows);
        setGenres(genresRes.rows);
        setPublishers(publishersRes.rows);

        if (id) {
          const bookRes = await BookServices.getById(id);
          setBook(bookRes);
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

  // Hàm xử lý cho các trường input thông thường
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook({
      ...book,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Hàm xử lý chung cho các Select
  const handleSelectChange = (value, fieldName) => {
    setBook({
      ...book,
      [fieldName]: value,
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
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="link" onClick={() => navigate('/books')} style={{ padding: 0, fontSize: 16 }}>
          <ArrowLeftOutlined className='text-black' /> <span className='hover:underline text-black'>Quay lại</span>
        </Button>
      </div>
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              placeholder="Nhập năm xuất bản"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              min="0"
            />
          </div>

          {/* Tác giả */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Tác giả</label>
            <Select
              showSearch
              name="author_id"
              value={book.author_id || undefined} // undefined để hiển thị placeholder khi không có giá trị
              onChange={(value) => handleSelectChange(value, 'author_id')}
              className='w-full'
              required
              placeholder="Chọn tác giả"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {authors.map((author) => (
                <Option key={author.author_id} value={author.author_id}>
                  {author.author_name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Thể loại */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Thể loại</label>
            <Select
              showSearch
              name="genre_id"
              value={book.genre_id || undefined}
              onChange={(value) => handleSelectChange(value, 'genre_id')}
              className='w-full'
              required
              placeholder="Chọn thể loại"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {genres.map((genre) => (
                <Option key={genre.genre_id} value={genre.genre_id}>
                  {genre.genre_name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Nhà xuất bản */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Nhà xuất bản</label>
            <Select
              showSearch
              name="publisher_id"
              value={book.publisher_id || undefined}
              onChange={(value) => handleSelectChange(value, 'publisher_id')}
              className='w-full'
              required
              placeholder="Chọn nhà xuất bản"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {publishers.map((publisher) => (
                <Option key={publisher.publisher_id} value={publisher.publisher_id}>
                  {publisher.publisher_name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Số lượng */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Số lượng</label>
            <input
              type="number"
              name="quantity"
              value={book.quantity}
              onChange={handleInputChange}
              placeholder="Nhập số lượng sách"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              required
              min="0"
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
    </div>
  );
};

export default BookForm;
