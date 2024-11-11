// src/layouts/AuthLayout.js
import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;