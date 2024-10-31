import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <div className="ml-64 flex-1 flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
      <Footer />
    </div>
  </div>
);

export default MainLayout;
