import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import GenreServices from '../../services/GenreServices';

const GenreForm = () => {
  const [genre, setGenre] = useState({
    genre_name: '',
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      GenreServices.getById(id)
        .then(res => setGenre(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setGenre({
      ...genre,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      GenreServices.update(id, genre)
        .then(() => navigate('/genres'))
        .catch(err => console.error(err));
    } else {
      GenreServices.create(genre)
        .then(() => navigate('/genres'))
        .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{id ? 'Chỉnh sửa Thể loại' : 'Thêm mới Thể loại'}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Tên Thể loại</label>
          <input
            type="text"
            name="genre_name"
            value={genre.genre_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {id ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>
    </div>
  );
};

export default GenreForm;
