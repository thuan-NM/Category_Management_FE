import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import EmployeeServices from '../../services/EmployeeServices';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    EmployeeServices.getAll()
      .then(res => setEmployees(res.data.rows))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      EmployeeServices.delete(id)
        .then(() => setEmployees(employees.filter(employee => employee.employee_id !== id)))
        .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Nhân viên</h2>
        <Link to="/employees/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Nhân viên
        </Link>
      </div>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">ID</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Họ tên</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Ngày sinh</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Số điện thoại</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Username</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {employees.map(employee => (
            <tr key={employee.employee_id} className="hover:bg-gray-100">
              <td className="py-3 px-4">{employee.employee_id}</td>
              <td className="py-3 px-4">{employee.full_name}</td>
              <td className="py-3 px-4">{employee.birth_date ? new Date(employee.birth_date).toLocaleDateString() : ''}</td>
              <td className="py-3 px-4">{employee.phone_number}</td>
              <td className="py-3 px-4">{employee.username}</td>
              <td className="py-3 px-4 flex space-x-2">
                <Link to={`/employees/edit/${employee.employee_id}`} className="text-blue-600 hover:text-blue-800">
                  <PencilSquareIcon className="h-5 w-5" />
                </Link>
                <button onClick={() => handleDelete(employee.employee_id)} className="text-red-600 hover:text-red-800">
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

export default EmployeeList;
