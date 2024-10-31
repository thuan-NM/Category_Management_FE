import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import AuthorServices from '../../services/AuthorServices';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    AuthorServices.getAll()
      .then((res) => setAuthors(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tác giả này?')) {
      AuthorServices.delete(id)
        .then(() => setAuthors(authors.filter((author) => author.author_id !== id)))
        .catch((err) => console.error(err));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Tác giả</h2>
        <Link to="/authors/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Tác giả
        </Link>
      </div>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">ID</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Tên tác giả</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Website</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Ghi chú</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {authors.map((author) => (
            <tr key={author.author_id} className="hover:bg-gray-100">
              <td className="py-3 px-4">{author.author_id}</td>
              <td className="py-3 px-4">{author.author_name}</td>
              <td className="py-3 px-4">{author.website}</td>
              <td className="py-3 px-4">{author.notes}</td>
              <td className="py-3 px-4 flex space-x-2">
                <Link to={`/authors/edit/${author.author_id}`} className="text-blue-600 hover:text-blue-800">
                  <PencilSquareIcon className="h-5 w-5" />
                </Link>
                <button onClick={() => handleDelete(author.author_id)} className="text-red-600 hover:text-red-800">
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

export default AuthorList;
