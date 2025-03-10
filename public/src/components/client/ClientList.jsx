import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, deleteClient, setCurrentClient } from '../../store/clientStore';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const ClientList = () => {
  const dispatch = useDispatch();
  const { clients, isLoading, error } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      dispatch(deleteClient(id));
    }
  };

  const handleEdit = (client) => {
    dispatch(setCurrentClient(client));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">Client Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Phone</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {clients.length > 0 ? (
            clients.map((client) => (
              <tr key={client._id} className="hover:bg-gray-50">
                <td className="py-3 px-4">{client.client_name}</td>
                <td className="py-3 px-4">{client.client_contact.email}</td>
                <td className="py-3 px-4">{client.client_contact.phone}</td>
                <td className="py-3 px-4 flex space-x-2">
                  <Link 
                    to={`/client-management/view/${client._id}`} 
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEye />
                  </Link>
                  <Link 
                    to={`/client-management/edit/${client._id}`} 
                    className="text-yellow-500 hover:text-yellow-700"
                    onClick={() => handleEdit(client)}
                  >
                    <FaEdit />
                  </Link>
                  <button 
                    onClick={() => handleDelete(client._id)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-6 text-center text-gray-500">
                No clients found. Create a new client to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;