import React, { useState } from 'react';
import { Layout, Menu, Avatar, Button } from 'antd';
import {
    UserOutlined,
    BookOutlined,
    TeamOutlined,
    LogoutOutlined,
    PhoneOutlined,
    AreaChartOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const { Sider } = Layout;

const Sidebar = ({ collapsed, onToggle }) => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.auth.user); // Fetch user data from Redux store

    const handleLogout = () => {
        dispatch(logout());
    };

    // Define the items for the menu, filtering out "Employees" tab for employees
    const menuItems = [
        {
            key: '1',
            icon: <TeamOutlined />,
            label: <Link to="/authors">Tác giả</Link>,
        },
        {
            key: '2',
            icon: <BookOutlined />,
            label: <Link to="/books">Sách</Link>,
        },
        {
            key: '3',
            icon: <BookOutlined />,
            label: <Link to="/borrowings">Mượn sách</Link>,
        },
        ...(userInfo?.role === 'admin' ? [
            {
                key: '4',
                icon: <TeamOutlined />,
                label: <Link to="/employees">Nhân viên</Link>,
            },
        ] : []),
        {
            key: '5',
            icon: <BookOutlined />,
            label: <Link to="/genres">Thể loại</Link>,
        },
        {
            key: '6',
            icon: <BookOutlined />,
            label: <Link to="/librarycards">Thẻ thư viện</Link>,
        },
        {
            key: '7',
            icon: <BookOutlined />,
            label: <Link to="/publishers">Nhà xuất bản</Link>,
        },
        {
            key: '8',
            icon: <AreaChartOutlined />,
            label: <Link to="/statistics">Thống kê</Link>,
        },
    ];

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onToggle}
            className="min-h-screen bg-gray-900 shadow-lg flex flex-col justify-between py-4 fixed left-0 top-0"
            width={250}
        >
            {/* Header Section */}
            <div className="p-5 text-center">
                <Avatar size={collapsed ? 48 : 72} icon={<UserOutlined />} className="mx-auto" />
                {!collapsed && userInfo && (
                    <div className="mt-4 text-white">
                        <div className="font-semibold text-lg">{userInfo.full_name}</div>
                        <div className="mt-2 flex items-center justify-center text-sm text-gray-300">
                            <PhoneOutlined className="mr-1" />
                            <span>{userInfo.phone_number}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-300">
                            Chức vụ: {userInfo.role}
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Section */}
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={menuItems} className="flex-1" />

            {/* Footer Section */}
            <div className="p-5 text-center">
                <Button
                    type="primary"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 border-none"
                >
                    {!collapsed && 'Đăng xuất'}
                </Button>
            </div>
        </Sider>
    );
};

export default Sidebar;
