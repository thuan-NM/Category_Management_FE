import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import BorrowingServices from '../../services/BorrowingServices';
import LibraryCardServices from '../../services/LibraryCardServices';
import EmployeeServices from '../../services/EmployeeServices';
import BookServices from '../../services/BookServices';

const BorrowingForm = () => {
  const [borrowing, setBorrowing] = useState({
    borrow_date: '',
    card_number: '',
    employee_id: '',
    books: [],
  });
  const [libraryCards, setLibraryCards] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch all library cards
    LibraryCardServices.getAll()
      .then((res) => {
        // Kiểm tra và đảm bảo res là một mảng
        if (Array.isArray(res.data.rows)) {
          setLibraryCards(res.data.rows);
        } else {
          console.error('Expected an array for library cards, got:', res.data);
          setLibraryCards([]);
        }
      })
      .catch((err) => console.error(err));

    // Fetch all employees
    EmployeeServices.getAll()
      .then((res) => setEmployees(res.data.rows)) // Assumed that res.data contains the employee list
      .catch((err) => console.error(err));

    // Fetch all books
    BookServices.getAll({})
      .then((res) => setBooks(res.rows)) // Assumed that res.data contains the book list
      .catch((err) => console.error(err));

    // If id exists, fetch borrowing details
    if (id) {
      BorrowingServices.getById(id)
        .then((res) => setBorrowing(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  console.log(books)

  const handleChange = (e) => {
    setBorrowing({
      ...borrowing,
      [e.target.name]: e.target.value,
    });
  };

  const handleBookSelection = (e) => {
    const selectedBooks = Array.from(e.target.selectedOptions, (option) => option.value);
    setBorrowing({
      ...borrowing,
      books: selectedBooks,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      BorrowingServices.update(id, borrowing)
        .then(() => navigate('/borrowings'))
        .catch((err) => console.error(err));
    } else {
      BorrowingServices.create(borrowing)
        .then(() => navigate('/borrowings'))
        .catch((err) => console.error(err));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{id ? 'Chỉnh sửa Mượn sách' : 'Thêm mới Mượn sách'}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Ngày mượn</label>
          <input
            type="date"
            name="borrow_date"
            value={borrowing.borrow_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Thẻ thư viện</label>
          <select
            name="card_number"
            value={borrowing.card_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            <option value="">Chọn thẻ thư viện</option>
            {Array.isArray(libraryCards) && libraryCards.map((card) => (
              <option key={card.card_number} value={card.card_number}>{card.card_number}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Nhân viên</label>
          <select
            name="employee_id"
            value={borrowing.employee_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            <option value="">Chọn nhân viên</option>
            {Array.isArray(employees) && employees.map((employee) => (
              <option key={employee.employee_id} value={employee.employee_id}>{employee.full_name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Sách mượn</label>
          <select
            multiple
            name="books"
            value={borrowing.books}
            onChange={handleBookSelection}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          >
            {Array.isArray(books) && books.map((book) => (
              <option key={book.book_id} value={book.book_id}>{book.title}</option>
            ))}
          </select>
          <small className="text-gray-500">Giữ Ctrl (hoặc Cmd trên Mac) để chọn nhiều sách</small>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {id ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>
    </div>
  );
};

export default BorrowingForm;
