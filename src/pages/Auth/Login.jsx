import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import AuthLayout from '../../layouts/AuthLayout';
import { login } from '../../store/authSlice';
import EmployeeServices from '../../services/EmployeeServices';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await EmployeeServices.login({ username, password });
            if (response) {
                console.log('User logged in:', response.data);
                // Assuming response contains user data and token
                dispatch(login({
                    user: response.data.user,
                    token: response.data.token
                }));
                toast.success('Login successful!', {
                    position: "top-right"
                });
                navigate('/');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
            toast.error(errorMessage, {
                position: "top-right"
            });
        }
    };


    return (
        <AuthLayout>
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
            <InputField label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
            <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            <Button text="Login" className="!w-full" onClick={handleLogin} />
        </AuthLayout>
    );
};

export default LoginPage;
