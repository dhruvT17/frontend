import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ClientList from '../components/client/ClientList';
import ClientForm from '../components/client/ClientForm';
import ClientDetail from '../components/client/ClientDetail';
import { FaPlus, FaUsers } from 'react-icons/fa';

const ClientManagementPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaUsers className="mr-3 text-blue-600" />
          Client Management
        </h1>
        <button 
          onClick={() => navigate('/client-management/create')} 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <FaPlus className="mr-2" />
          Add New Client
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <Routes>
          <Route path="/" element={<ClientList />} />
          <Route path="/create" element={<ClientForm isEditing={false} />} />
          <Route path="/edit/:id" element={<ClientForm isEditing={true} />} />
          <Route path="/view/:id" element={<ClientDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default ClientManagementPage;