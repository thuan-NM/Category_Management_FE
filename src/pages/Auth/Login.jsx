import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import AuthLayout from '../../layouts/AuthLayout';
import { login } from '../../store/authSlice';
import EmployeeServices from '../../services/EmployeeServices';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            toast.warn('Vui lòng nhập tên đăng nhập và mật khẩu');
            return;
        }

        setLoading(true);
        try {
            const response = await EmployeeServices.login({ username, password });
            if (response) {
                const { user, token } = response.data;
                dispatch(login({ user, token }));
                toast.success('Đăng nhập thành công');
                navigate('/');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <InputField
                    label="Tên đăng nhập"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập vào tên đăng nhập"
                />
                <InputField
                    label="Mật khẩu"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập vào mật khẩu"
                />
                <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full"
                    onClick={handleLogin}
                    loading={loading} // Trạng thái loading
                >
                    Đăng nhập
                </Button>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;
