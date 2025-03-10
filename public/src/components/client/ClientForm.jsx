import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createClient, updateClient, clearCurrentClient } from '../../store/clientStore';
import { useNavigate } from 'react-router-dom';

const ClientForm = ({ isEditing = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentClient, isLoading, error } = useSelector((state) => state.clients);

  const [formData, setFormData] = useState({
    client_name: '',
    client_contact: {
      email: '',
      phone: ''
    }
  });

  useEffect(() => {
    if (isEditing && currentClient) {
      setFormData({
        client_name: currentClient.client_name || '',
        client_contact: {
          email: currentClient.client_contact?.email || '',
          phone: currentClient.client_contact?.phone || ''
        }
      });
    }

    return () => {
      if (isEditing) {
        dispatch(clearCurrentClient());
      }
    };
  }, [isEditing, currentClient, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'email' || name === 'phone') {
      setFormData({
        ...formData,
        client_contact: {
          ...formData.client_contact,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isEditing && currentClient) {
      await dispatch(updateClient({ id: currentClient._id, clientData: formData }));
    } else {
      await dispatch(createClient(formData));
    }
    
    if (!error) {
      navigate('/client-management');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Client' : 'Create New Client'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="client_name">
            Client Name
          </label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.client_contact.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.client_contact.phone}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : isEditing ? 'Update Client' : 'Create Client'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/client-management')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;