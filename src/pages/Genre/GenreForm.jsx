import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenreServices from '../../services/GenreServices';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const GenreForm = () => {
  const [genre, setGenre] = useState({
    genre_name: '',
    description: '', // Add description to the initial state
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
      <div style={{ marginBottom: 16 }}>
        <Button type="link" onClick={() => navigate('/genres')} style={{ padding: 0, fontSize: 16 }}>
          <ArrowLeftOutlined className='text-black' /> <span className='hover:underline text-black'>Quay lại</span>
        </Button>
      </div>
      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">{id ? 'Chỉnh sửa Thể loại' : 'Thêm mới Thể loại'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Mô tả</label>
            <textarea
              name="description"
              value={genre.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              rows="4"
            />
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {id ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenreForm;
