import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthorServices from '../../services/AuthorServices';

const AuthorForm = () => {
  const [author, setAuthor] = useState({
    author_name: '',
    website: '',
    notes: '',
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      AuthorServices.getById(id)
        .then((res) => setAuthor(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setAuthor({
      ...author,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      AuthorServices.update(id, author)
        .then(() => navigate('/authors'))
        .catch((err) => console.error(err));
    } else {
      AuthorServices.create(author)
        .then(() => navigate('/authors'))
        .catch((err) => console.error(err));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{id ? 'Chỉnh sửa Tác giả' : 'Thêm mới Tác giả'}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Tên Tác giả</label>
          <input
            type="text"
            name="author_name"
            value={author.author_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Website</label>
          <input
            type="text"
            name="website"
            value={author.website}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Ghi chú</label>
          <textarea
            name="notes"
            value={author.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {id ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>
    </div>
  );
};

export default AuthorForm;
