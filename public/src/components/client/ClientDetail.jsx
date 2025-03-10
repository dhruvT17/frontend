import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { FaEdit, FaArrowLeft, FaBuilding, FaEnvelope, FaPhone, FaProjectDiagram } from 'react-icons/fa';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/clients/${id}`);
        setClient(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch client details');
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  if (loading) {
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
        <div className="mt-4">
          <button 
            onClick={() => navigate('/client-management')}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">Client not found</h2>
        <p className="text-gray-500 mt-2">The client you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/client-management')}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Clients
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">
            <FaBuilding className="mr-3" />
            {client.client_name}
          </h1>
          <div className="flex space-x-2">
            <Link 
              to={`/client-management/edit/${id}`} 
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaEdit className="mr-2" />
              Edit
            </Link>
            <Link 
              to="/client-management" 
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <FaEnvelope className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{client.client_contact?.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{client.client_contact?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Projects</h2>
            {client.projects && client.projects.length > 0 ? (
              <ul className="space-y-2">
                {client.projects.map(project => (
                  <li key={project._id} className="flex items-center">
                    <FaProjectDiagram className="text-blue-500 mr-3" />
                    <Link 
                      to={`/project-management/view/${project._id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {project.project_name || project}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No projects associated with this client.</p>
            )}
          </div>
        </div>

        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Client ID</p>
              <p className="font-medium">{client._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium">
                {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">
                {client.updatedAt ? new Date(client.updatedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;