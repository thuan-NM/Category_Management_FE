import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import GenreServices from '../../services/GenreServices';

const GenreList = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    GenreServices.getAll()
      .then(res => setGenres(res.data.rows))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa thể loại này?')) {
      GenreServices.delete(id)
        .then(() => setGenres(genres.filter(genre => genre.genre_id !== id)))
        .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Thể loại</h2>
        <Link to="/genres/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Thể loại
        </Link>
      </div>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">ID</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Tên thể loại</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {genres.map(genre => (
            <tr key={genre.genre_id} className="hover:bg-gray-100">
              <td className="py-3 px-4">{genre.genre_id}</td>
              <td className="py-3 px-4">{genre.genre_name}</td>
              <td className="py-3 px-4 flex space-x-2">
                <Link to={`/genres/edit/${genre.genre_id}`} className="text-blue-600 hover:text-blue-800">
                  <PencilSquareIcon className="h-5 w-5" />
                </Link>
                <button onClick={() => handleDelete(genre.genre_id)} className="text-red-600 hover:text-red-800">
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

export default GenreList;
