import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import BorrowingDetailsServices from '../../services/BorrowingDetailsServices ';

const BorrowingDetailsList = () => {
  const [borrowingDetails, setBorrowingDetails] = useState([]);

  useEffect(() => {
    BorrowingDetailsServices.getAll()
      .then((res) => setBorrowingDetails(res.data.rows))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa chi tiết mượn này?')) {
      BorrowingDetailsServices.delete(id)
        .then(() => setBorrowingDetails(borrowingDetails.filter((detail) => detail.borrow_detail_id !== id)))
        .catch((err) => console.error(err));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Chi tiết Mượn</h2>
        <Link to="/borrowingdetails/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Chi tiết Mượn
        </Link>
      </div>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">ID</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Borrow ID</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Book ID</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Ngày Trả</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Ghi chú</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {borrowingDetails.map((detail) => (
            <tr key={detail.borrow_detail_id} className="hover:bg-gray-100">
              <td className="py-3 px-4">{detail.borrow_detail_id}</td>
              <td className="py-3 px-4">{detail.borrow_id}</td>
              <td className="py-3 px-4">{detail.book_id}</td>
              <td className="py-3 px-4">{detail.return_date ? detail.return_date : 'Chưa trả'}</td>
              <td className="py-3 px-4">{detail.notes}</td>
              <td className="py-3 px-4 flex space-x-2">
                <Link to={`/borrowingdetails/edit/${detail.borrow_detail_id}`} className="text-blue-600 hover:text-blue-800">
                  <PencilSquareIcon className="h-5 w-5" />
                </Link>
                <button onClick={() => handleDelete(detail.borrow_detail_id)} className="text-red-600 hover:text-red-800">
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

export default BorrowingDetailsList;
