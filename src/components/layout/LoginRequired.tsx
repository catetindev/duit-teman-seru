
import React from 'react';
import { Link } from 'react-router-dom';

const LoginRequired = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <img src="/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png" alt="Catatuy Logo" className="h-20 mb-8" />
      <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">You need to log in</h2>
      <p className="mb-6 text-center text-gray-600 dark:text-gray-300">Please log in to access the dashboard</p>
      <div className="flex gap-4">
        <Link to="/login" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2.5 rounded-full hover:opacity-90 transition-all shadow-md">
          Login
        </Link>
        <Link to="/signup" className="bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-full hover:bg-gray-50 transition-all shadow-sm">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginRequired;
