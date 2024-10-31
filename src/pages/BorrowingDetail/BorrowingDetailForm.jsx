import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BorrowingDetailsServices from '../../services/BorrowingDetailsServices ';
import BorrowingServices from '../../services/BorrowingServices';
import BookServices from '../../services/BookServices';

const BorrowingDetailsForm = () => {
  const [borrowingDetail, setBorrowingDetail] = useState({
    borrow_id: '',
    book_id: '',
    return_date: '',
    notes: '',
  });

  const [borrowings, setBorrowings] = useState([]);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    BorrowingServices.getAll().then(res => setBorrowings(res.data.rows));
    BookServices.getAll().then(res => setBooks(res.data.rows));

    if (id) {
      BorrowingDetailsServices.getById(id)
        .then(res => setBorrowingDetail(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setBorrowingDetail({
      ...borrowingDetail,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      BorrowingDetailsServices.update(id, borrowingDetail)
        .then(() => navigate('/borrowingdetails'))
        .catch(err => console.error(err));
    } else {
      BorrowingDetailsServices.create(borrowingDetail)
        .then(() => navigate('/borrowingdetails'))
        .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{id ? 'Chỉnh sửa Chi tiết Mượn' : 'Thêm mới Chi tiết Mượn'}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Mã mượn sách</label>
          <select
            name="borrow_id"
            value={borrowingDetail.borrow_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            <option value="">Chọn mã mượn sách</option>
            {borrowings.map((borrow) => (
              <option key={borrow.borrow_id} value={borrow.borrow_id}>
                {borrow.borrow_id}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Mã sách</label>
          <select
            name="book_id"
            value={borrowingDetail.book_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            <option value="">Chọn mã sách</option>
            {books.map((book) => (
              <option key={book.book_id} value={book.book_id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Ngày trả</label>
          <input
            type="date"
            name="return_date"
            value={borrowingDetail.return_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Ghi chú</label>
          <textarea
            name="notes"
            value={borrowingDetail.notes}
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

export default BorrowingDetailsForm;
