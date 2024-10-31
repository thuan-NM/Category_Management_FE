import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReaderServices from '../../services/ReaderServices';
import LibraryCardServices from '../../services/LibraryCardServices';

const ReaderForm = () => {
  const [reader, setReader] = useState({
    reader_name: '',
    address: '',
    card_number: '',
  });
  const [libraryCards, setLibraryCards] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    LibraryCardServices.getAll().then(res => setLibraryCards(res.data.rows));

    if (id) {
      ReaderServices.getById(id)
        .then(res => setReader(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setReader({
      ...reader,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      ReaderServices.update(id, reader)
        .then(() => navigate('/readers'))
        .catch(err => console.error(err));
    } else {
      ReaderServices.create(reader)
        .then(() => navigate('/readers'))
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{id ? 'Chỉnh sửa Độc giả' : 'Thêm mới Độc giả'}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg">
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Tên độc giả</label>
          <input
            type="text"
            name="reader_name"
            value={reader.reader_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Địa chỉ</label>
          <textarea
            name="address"
            value={reader.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            rows="3"
            required
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Số thẻ thư viện</label>
          <select
            name="card_number"
            value={reader.card_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          >
            <option value="">Chọn thẻ thư viện</option>
            {libraryCards.length > 0 ? (
              libraryCards.map(card => (
                <option key={card.card_number} value={card.card_number}>
                  {card.card_number} - {card.notes ? card.notes : 'Không có ghi chú'}
                </option>
              ))
            ) : (
              <option value="">Không có thẻ thư viện nào</option>
            )}
          </select>
        </div>
        <div className="flex justify-end mt-8">
          <button
            type="button"
            className="mr-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            onClick={() => navigate('/readers')}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {id ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReaderForm;
