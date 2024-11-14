// src/components/EmployeeForm.js

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeServices from '../../services/EmployeeServices';
import { Button, Card, Form, Input, DatePicker, Select } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import { toast } from 'react-toastify'; // Import toast từ react-toastify
import { debounce } from 'lodash';
import { Progress } from 'antd';
const { Option } = Select;

const EmployeeForm = () => {
  const [form] = Form.useForm(); // Lấy form instance
  const navigate = useNavigate();
  const { id } = useParams();
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (id) {
      EmployeeServices.getById(id)
        .then(res => {
          if (res.status === 200 && res.data) {
            const employeeData = res.data;
            // Chuyển đổi birth_date thành moment object nếu có
            if (employeeData.birth_date) {
              employeeData.birth_date = moment(employeeData.birth_date, 'YYYY-MM-DD');
            }
            form.setFieldsValue(employeeData);
          } else {
            toast.error('Không tìm thấy nhân viên!');
            navigate('/employees');
          }
        })
        .catch(err => {
          console.error(err);
          toast.error('Đã xảy ra lỗi khi lấy thông tin nhân viên.');
          navigate('/employees');
        });
    }
  }, [id, form, navigate]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[@$!%*?&]/.test(password)) strength += 1;
    return (strength / 5) * 100;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    const strength = calculatePasswordStrength(value);
    setPasswordStrength(strength);
  };

  const handleSubmit = (values) => {
    const employeeData = {
      ...values,
      birth_date: values.birth_date ? values.birth_date.format('YYYY-MM-DD') : '',
    };
    if (id) {
      EmployeeServices.update(id, employeeData)
        .then(res => {
          if (res.status === 200) {
            toast.success('Cập nhật nhân viên thành công!');
            navigate('/employees');
          } else {
            toast.error('Cập nhật nhân viên thất bại!');
          }
        })
        .catch(err => {
          console.error(err);
          toast.error('Đã xảy ra lỗi khi cập nhật nhân viên.');
        });
    } else {
      EmployeeServices.create(employeeData)
        .then(res => {
          if (res.status === 201) {
            toast.success('Thêm nhân viên thành công!');
            navigate('/employees');
          } else {
            toast.error('Thêm nhân viên thất bại!');
          }
        })
        .catch(err => {
          console.error(err);
          toast.error('Đã xảy ra lỗi khi thêm nhân viên.');
        });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="link" onClick={() => navigate('/employees')} style={{ padding: 0, fontSize: 16 }}>
          <ArrowLeftOutlined className='text-black' /> <span className='hover:underline text-black'>Quay lại</span>
        </Button>
      </div>
      <Card bordered={false} className='max-w-3xl mx-auto bg-white p-8 !rounded-lg !shadow-md'>
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
          {id ? 'Chỉnh sửa Nhân viên' : 'Thêm mới Nhân viên'}
        </h2>

        <Form
          form={form} // Bind form instance
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Họ tên"
            name="full_name"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="birth_date"
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone_number"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại người giám hộ"
            name="parent_number"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đăng nhập' },
              { type: 'email', message: 'Tên đăng nhập phải là email hợp lệ' },
            ]}
          >
            <Input type="email" disabled={id} placeholder="example@domain.com" />
          </Form.Item>

          <Form.Item
            label="Chức vụ"
            name="role"
            rules={[{ required: true, message: 'Vui lòng điền vào chức vụ' }]}
          >
            <Select>
              <Option value="employee">Nhân viên</Option>
              <Option value="admin">Quản trị viên</Option>
            </Select>
          </Form.Item>

          {!id && (
            <>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái in hoa, chữ cái thường, số và ký tự đặc biệt (@$!%*?&).',
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Nhập mật khẩu" onChange={handlePasswordChange} />
              </Form.Item>
              <Form.Item>
                <Progress percent={passwordStrength} showInfo={false} />
                <div>
                  {passwordStrength === 100
                    ? 'Mật khẩu mạnh'
                    : passwordStrength >= 60
                      ? 'Mật khẩu vừa phải'
                      : 'Mật khẩu yếu'}
                </div>
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {id ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EmployeeForm;