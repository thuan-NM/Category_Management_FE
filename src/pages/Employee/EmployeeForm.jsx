import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeServices from '../../services/EmployeeServices';

const EmployeeForm = () => {
  const [employee, setEmployee] = useState({
    full_name: '',
    birth_date: '',
    phone_number: '',
    parent_number: '',
    username: '',
    password: '',
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      EmployeeServices.getById(id)
        .then(res => setEmployee(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      EmployeeServices.update(id, employee)
        .then(() => navigate('/employees'))
        .catch(err => console.error(err));
    } else {
      EmployeeServices.create(employee)
        .then(() => navigate('/employees'))
        .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{id ? 'Chỉnh sửa Nhân viên' : 'Thêm mới Nhân viên'}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Họ tên</label>
          <input
            type="text"
            name="full_name"
            value={employee.full_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Ngày sinh</label>
          <input
            type="date"
            name="birth_date"
            value={employee.birth_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Số điện thoại</label>
          <input
            type="text"
            name="phone_number"
            value={employee.phone_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Số điện thoại người giám hộ</label>
          <input
            type="text"
            name="parent_number"
            value={employee.parent_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Tên đăng nhập</label>
          <input
            type="text"
            name="username"
            value={employee.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={employee.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required={!id}
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {id ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
