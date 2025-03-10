import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, setCurrentProject } from '../store/projectStore';
import { fetchClients } from '../store/clientStore';
import ProjectList from '../components/project/ProjectList';
import ProjectForm from '../components/project/ProjectForm';

const ProjectManagementPage = () => {
  const dispatch = useDispatch();
  const { projects, isLoading, error } = useSelector((state) => state.projects);
  const currentProject = useSelector(state => state.projects.currentProject);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchClients());
  }, [dispatch]);

  const handleCreateProject = () => {
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    dispatch(setCurrentProject(project));
    setIsEditing(true);
    setShowForm(true);
    return false;
  };

  const handleCloseForm = () => {
    setShowForm(false);
    dispatch(fetchProjects());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Project Management</h1>
        {!showForm && (
          <button
            onClick={handleCreateProject}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New Project
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {showForm ? (
        <div>
          <button
            onClick={handleCloseForm}
            className="mb-4 text-blue-500 hover:text-blue-700"
          >
            ← Back to Projects
          </button>
          <ProjectForm 
            isEditing={isEditing} 
            onClose={handleCloseForm}
            project={currentProject}
          />
        </div>
      ) : (
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ProjectList 
              projects={projects} 
              onEditProject={handleEditProject} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectManagementPage;