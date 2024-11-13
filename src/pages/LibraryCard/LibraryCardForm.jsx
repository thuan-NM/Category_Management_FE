import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LibraryCardServices from '../../services/LibraryCardServices';
import { toast } from 'react-toastify';

const LibraryCardForm = () => {
  const [card, setCard] = useState({
    start_date: '',
    expiry_date: '',
    reader_name: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { number } = useParams();

  useEffect(() => {
    if (number) {
      fetchLibraryCard(number);
    }
  }, [number]);

  const fetchLibraryCard = async (cardNumber) => {
    try {
      const res = await LibraryCardServices.getById(cardNumber);
      setCard({
        start_date: res.data.start_date,
        expiry_date: res.data.expiry_date,
        reader_name: res.data.reader_name,
        address: res.data.address,
        notes: res.data.notes,
      });
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải dữ liệu thẻ thư viện.');
    }
  };

  const handleChange = (e) => {
    setCard({
      ...card,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!card.start_date) newErrors.start_date = 'Ngày bắt đầu là bắt buộc.';
    if (!card.reader_name) newErrors.reader_name = 'Tên người đọc là bắt buộc.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const actionToast = toast.info(number ? "Đang cập nhật thẻ thư viện..." : "Đang tạo thẻ thư viện...", { autoClose: false });
    
    try {
      if (number) {
        await LibraryCardServices.update(number, card);
        toast.dismiss(actionToast);
        toast.success('Cập nhật thẻ thư viện thành công!');
      } else {
        await LibraryCardServices.create(card);
        toast.dismiss(actionToast);
        toast.success('Thêm mới thẻ thư viện thành công!');
      }
      navigate('/librarycards');
    } catch (err) {
      console.error(err);
      toast.dismiss(actionToast);
      toast.error('Không thể lưu thẻ thư viện.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
        {number ? 'Chỉnh sửa Thẻ Thư Viện' : 'Thêm mới Thẻ Thư Viện'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ngày bắt đầu */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Ngày bắt đầu</label>
          <input
            type="date"
            name="start_date"
            value={card.start_date}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.start_date ? 'border-red-500' : ''}`}
            required
          />
          {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
        </div>

        {/* Ngày hết hạn */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Ngày hết hạn</label>
          <input
            type="date"
            name="expiry_date"
            value={card.expiry_date}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Tên người đọc */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Tên người đọc</label>
          <input
            type="text"
            name="reader_name"
            value={card.reader_name}
            onChange={handleChange}
            placeholder="Nhập tên người đọc"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.reader_name ? 'border-red-500' : ''}`}
            required
          />
          {errors.reader_name && <p className="text-red-500 text-sm mt-1">{errors.reader_name}</p>}
        </div>

        {/* Địa chỉ */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={card.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Ghi chú */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Ghi chú</label>
          <textarea
            name="notes"
            value={card.notes}
            onChange={handleChange}
            placeholder="Nhập ghi chú (nếu có)"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
          />
        </div>

        {/* Nút Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200"
        >
          {number ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>
    </div>
  );
};

export default LibraryCardForm;
