import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PublisherServices from '../../services/PublisherServices';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const PublisherForm = () => {
  const [publisher, setPublisher] = useState({
    publisher_name: '',
    address: '',
    email: '',
    representative_info: '',
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      PublisherServices.getById(id)
        .then((res) => setPublisher(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setPublisher({
      ...publisher,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      PublisherServices.update(id, publisher)
        .then(() => navigate('/publishers'))
        .catch((err) => console.error(err));
    } else {
      PublisherServices.create(publisher)
        .then(() => navigate('/publishers'))
        .catch((err) => console.error(err));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="link" onClick={() => navigate('/publishers')} style={{ padding: 0, fontSize: 16 }}>
          <ArrowLeftOutlined className='text-black' /> <span className='hover:underline text-black'>Quay lại</span>
        </Button>
      </div>
      <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
          {id ? 'Chỉnh sửa Nhà Xuất Bản' : 'Thêm Mới Nhà Xuất Bản'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên nhà xuất bản */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Tên Nhà Xuất Bản</label>
            <input
              type="text"
              name="publisher_name"
              value={publisher.publisher_name}
              onChange={handleChange}
              placeholder="Nhập tên nhà xuất bản"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              required
            />
          </div>

          {/* Địa chỉ */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Địa Chỉ</label>
            <input
              type="text"
              name="address"
              value={publisher.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={publisher.email}
              onChange={handleChange}
              placeholder="Nhập email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
            />
          </div>

          {/* Thông tin người đại diện */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Thông Tin Người Đại Diện</label>
            <textarea
              name="representative_info"
              value={publisher.representative_info}
              onChange={handleChange}
              placeholder="Nhập thông tin người đại diện (nếu có)"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              rows="4"
            />
          </div>

          {/* Nút Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200"
          >
            {id ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublisherForm;
