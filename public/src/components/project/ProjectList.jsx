import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProject, setCurrentProject } from '../../store/projectStore';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const ProjectList = ({ projects, onEditProject }) => {
  const dispatch = useDispatch();
  const { clients } = useSelector((state) => state.clients);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(id));
    }
  };

  const handleEdit = (project) => {
    dispatch(setCurrentProject(project));
    if (onEditProject) {
      onEditProject(project);
    }
  };

  // Function to get client name from client ID
  const getClientName = (clientId) => {
    const client = clients.find(client => client._id === clientId);
    return client ? client.client_name : 'Unknown Client';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">Project Name</th>
            <th className="py-3 px-4 text-left">Client</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Progress</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <tr key={project._id} className="hover:bg-gray-50">
                <td className="py-3 px-4">{project.project_details.name}</td>
                <td className="py-3 px-4">{getClientName(project.client_id)}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.project_details.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    project.project_details.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.project_details.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${project.project_details.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{project.project_details.progress}%</span>
                </td>
                <td className="py-3 px-4 flex space-x-2">
                  <Link 
                    to={`/project-management/view/${project._id}`} 
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEye />
                  </Link>
                  <Link 
                    to={`/project-management/edit/${project._id}`} 
                    className="text-yellow-500 hover:text-yellow-700"
                    onClick={() => handleEdit(project)}
                  >
                    <FaEdit />
                  </Link>
                  <button 
                    onClick={() => handleDelete(project._id)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-6 text-center text-gray-500">
                No projects found. Create a new project to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectList;