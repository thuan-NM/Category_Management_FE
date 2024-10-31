import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import LibraryCardServices from '../../services/LibraryCardServices';

const LibraryCardList = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios.get('/api/librarycards')
    LibraryCardServices.getAll()
      .then(res => setCards(res.data.rows))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (number) => {
    if (window.confirm('Bạn có chắc muốn xóa thẻ thư viện này?')) {
      LibraryCardServices.delete(number)
        .then(() => setCards(cards.filter(card => card.card_number !== number)))
        .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Thẻ thư viện</h2>
        <Link to="/librarycards/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Thẻ thư viện
        </Link>
      </div>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Số thẻ</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Ngày bắt đầu</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Ngày hết hạn</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Ghi chú</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {cards.map(card => (
            <tr key={card.card_number} className="hover:bg-gray-100">
              <td className="py-3 px-4">{card.card_number}</td>
              <td className="py-3 px-4">{card.start_date ? new Date(card.start_date).toLocaleDateString() : ''}</td>
              <td className="py-3 px-4">{card.expiry_date ? new Date(card.expiry_date).toLocaleDateString() : ''}</td>
              <td className="py-3 px-4">{card.notes}</td>
              <td className="py-3 px-4 flex space-x-2">
                <Link to={`/librarycards/edit/${card.card_number}`} className="text-blue-600 hover:text-blue-800">
                  <PencilSquareIcon className="h-5 w-5" />
                </Link>
                <button onClick={() => handleDelete(card.card_number)} className="text-red-600 hover:text-red-800">
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

export default LibraryCardList;
