import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject, updateProject, clearCurrentProject } from '../../store/projectStore';
import { fetchClients } from '../../store/clientStore';
import { useNavigate } from 'react-router-dom';

const ProjectForm = ({ isEditing = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProject, isLoading, error } = useSelector((state) => state.projects);
  const { clients } = useSelector((state) => state.clients);

  const [formData, setFormData] = useState({
    client_id: '',
    project_details: {
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      status: 'Pending',
      priority: 'Medium',
      progress: 0
    }
  });

  useEffect(() => {
    dispatch(fetchClients());
    
    if (isEditing && currentProject) {
      setFormData({
        client_id: currentProject.client_id || '',
        project_details: {
          name: currentProject.project_details?.name || '',
          description: currentProject.project_details?.description || '',
          start_date: currentProject.project_details?.start_date ? new Date(currentProject.project_details.start_date).toISOString().split('T')[0] : '',
          end_date: currentProject.project_details?.end_date ? new Date(currentProject.project_details.end_date).toISOString().split('T')[0] : '',
          status: currentProject.project_details?.status || 'Pending',
          priority: currentProject.project_details?.priority || 'Medium',
          progress: currentProject.project_details?.progress || 0
        }
      });
    }

    return () => {
      if (isEditing) {
        dispatch(clearCurrentProject());
      }
    };
  }, [isEditing, currentProject, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'client_id') {
      setFormData({
        ...formData,
        client_id: value
      });
    } else {
      setFormData({
        ...formData,
        project_details: {
          ...formData.project_details,
          [name]: value
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isEditing && currentProject) {
      await dispatch(updateProject({ id: currentProject._id, projectData: formData }));
    } else {
      await dispatch(createProject(formData));
    }
    
    if (!error) {
      navigate('/project-management');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Project' : 'Create New Project'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="client_id">
              Client
            </label>
            <select
              id="client_id"
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.client_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.project_details.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.project_details.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start_date">
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.project_details.start_date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_date">
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.project_details.end_date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.project_details.status}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.project_details.priority}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          
          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="progress">
              Progress: {formData.project_details.progress}%
            </label>
            <input
              type="range"
              id="progress"
              name="progress"
              min="0"
              max="100"
              value={formData.project_details.progress}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate('/project-management')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;