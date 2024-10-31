import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LibraryCardServices from '../../services/LibraryCardServices';

const LibraryCardForm = () => {
  const [card, setCard] = useState({
    card_number: '',
    start_date: '',
    expiry_date: '',
    notes: '',
  });
  const navigate = useNavigate();
  const { number } = useParams();

  useEffect(() => {
    if (number) {
      LibraryCardServices.getById(number)
        .then((res) => setCard(res.data))
        .catch((err) => console.error(err));
    }
  }, [number]);

  const handleChange = (e) => {
    setCard({
      ...card,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (number) {
      LibraryCardServices.update(number, card)
        .then(() => navigate('/librarycards'))
        .catch((err) => console.error(err));
    } else {
      LibraryCardServices.create(card)
        .then(() => navigate('/librarycards'))
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
        {number ? 'Chỉnh sửa Thẻ Thư Viện' : 'Thêm mới Thẻ Thư Viện'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Số thẻ */}
        {!number && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Số thẻ</label>
            <input
              type="text"
              name="card_number"
              value={card.card_number}
              onChange={handleChange}
              placeholder="Nhập số thẻ"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              required
            />
          </div>
        )}

        {/* Ngày bắt đầu */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Ngày bắt đầu</label>
          <input
            type="date"
            name="start_date"
            value={card.start_date}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
            required
          />
        </div>

        {/* Ngày hết hạn */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Ngày hết hạn</label>
          <input
            type="date"
            name="expiry_date"
            value={card.expiry_date}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
          />
        </div>

        {/* Ghi chú */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Ghi chú</label>
          <textarea
            name="notes"
            value={card.notes}
            onChange={handleChange}
            placeholder="Nhập ghi chú (nếu có)"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
            rows="4"
          />
        </div>

        {/* Nút Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200"
        >
          {number ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>
    </div>
  );
};

export default LibraryCardForm;
