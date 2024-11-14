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
          marginLeft: collapsed ? 80 : 250, 
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        {/* Header */}
        <Header
          className="bg-blue-500 text-white px-6 flex items-center justify-between shadow-md"
        >
          <div className="text-xl font-semibold">Hệ thống quản lý thư viện</div>
        </Header>

        {/* Content */}
        <Content
          className="p-6 bg-white shadow-md"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
