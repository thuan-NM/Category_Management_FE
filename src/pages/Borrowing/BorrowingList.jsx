import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import BorrowingServices from '../../services/BorrowingServices';

const BorrowingList = () => {
  const [borrowings, setBorrowings] = useState([]);
  console.log(borrowings);
  useEffect(() => {
    BorrowingServices.getAll()
      .then(res => setBorrowings(res.data.rows))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bản ghi mượn sách này?')) {
      BorrowingServices.delete(id)
        .then(() => setBorrowings(borrowings.filter(borrowing => borrowing.borrow_id !== id)))
        .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Mượn sách</h2>
        <Link to="/borrowings/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Mượn sách
        </Link>
      </div>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">ID</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Ngày mượn</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Thẻ thư viện</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Nhân viên</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {borrowings.map(borrowing => (
            <tr key={borrowing.borrow_id} className="hover:bg-gray-100">
              <td className="py-3 px-4">{borrowing.borrow_id}</td>
              <td className="py-3 px-4">{new Date(borrowing.borrow_date).toLocaleDateString()}</td>
              <td className="py-3 px-4">{borrowing.card_number}</td>
              <td className="py-3 px-4">{borrowing.employee_id}</td>
              <td className="py-3 px-4 flex space-x-2">
                <Link to={`/borrowings/edit/${borrowing.borrow_id}`} className="text-blue-600 hover:text-blue-800">
                  <PencilSquareIcon className="h-5 w-5" />
                </Link>
                <button onClick={() => handleDelete(borrowing.borrow_id)} className="text-red-600 hover:text-red-800">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowingList;
