import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={handleToggleSidebar} />

      {/* Main Content Area */}
      <Layout
        className={`transition-all duration-300 ease-in-out`}
        style={{
          marginLeft: collapsed ? 80 : 250, // Thay đổi margin-left dựa trên trạng thái thu gọn
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        {/* Header */}
        <Header
          className="bg-blue-500 text-white px-6 flex items-center justify-between shadow-md"
        >
          <div className="text-xl font-semibold">Hệ thống quản lý thư viện</div>
          <button onClick={handleToggleSidebar} className="bg-white text-black px-4 py-1 rounded">
            {collapsed ? 'Mở Sidebar' : 'Thu gọn Sidebar'}
          </button>
        </Header>

        {/* Content */}
        <Content
          className="p-6 bg-white shadow-md"
        >
          <Outlet />
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: 'center' }}>
          Hệ thống quản lý thư viện ©2024
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
