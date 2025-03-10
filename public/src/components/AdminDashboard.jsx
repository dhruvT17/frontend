import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import useAuthStore from '../store/authStore';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects } from '../store/projectStore';
import useUserStore from '../store/userStore'; // Changed to import the store directly
import { Link } from 'react-router-dom';
import { FaUsers, FaProjectDiagram, FaChartLine, FaBell, FaTasks } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const { projects, isLoading: projectsLoading } = useSelector((state) => state.projects);
  
  // Use the Zustand store directly
  const { users, isLoading: usersLoading, fetchUsers } = useUserStore();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingTasks: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Fetch data when component mounts
    dispatch(fetchProjects());
    fetchUsers(); // Call the function directly from the store
  }, [dispatch, fetchUsers]);

  useEffect(() => {
    if (!projectsLoading && !usersLoading && projects && users) {
      // Calculate stats based on fetched data
      setStats({
        totalUsers: users.length || 0,
        activeProjects: projects.filter(p => p.status === 'active' || p.status === 'in-progress').length || 0,
        completedProjects: projects.filter(p => p.status === 'completed').length || 0,
        pendingTasks: projects.filter(p => !p.completed).length || 0
      });

      // Generate recent activities from projects and users
      const activities = [];
      
      // Add project activities
      projects.slice(0, 3).forEach(project => {
        activities.push({
          id: `project-${project.id}`,
          user: project.createdBy || user?.username || 'Admin',
          userInitial: (project.createdBy || user?.username || 'A')[0].toUpperCase(),
          action: 'created project',
          target: project.name,
          time: project.createdAt || new Date().toISOString(),
          color: 'blue'
        });
      });
      
      // Add user activities
      users.slice(0, 2).forEach(appUser => {
        activities.push({
          id: `user-${appUser.id}`,
          user: user?.username || 'Admin',
          userInitial: (user?.username || 'A')[0].toUpperCase(),
          action: 'added user',
          target: appUser.username || appUser.name || 'New User',
          time: appUser.createdAt || new Date().toISOString(),
          color: 'green'
        });
      });
      
      // Sort by time (most recent first) and limit to 4
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      setRecentActivities(activities.slice(0, 4));
    }
  }, [projects, users, projectsLoading, usersLoading, user]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get status display class
  const getStatusClass = (status) => {
    if (status === 'active' || status === 'completed') return 'bg-green-100 text-green-800';
    if (status === 'in-progress') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Get status display text
  const getStatusText = (status) => {
    if (status === 'active') return 'Active';
    if (status === 'in-progress') return 'In Progress';
    if (status === 'completed') return 'Completed';
    return 'Delayed';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with just title and user info */}
      <div className="bg-white shadow-sm py-4 px-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Dashboard Overview</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaBell className="text-gray-500 hover:text-blue-600 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {recentActivities.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="font-medium">{user?.username || 'Admin'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6">
        <div className="mb-6">
          <p className="text-gray-600">Welcome back, {user?.username || 'Admin'}! Here's what's happening today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                <FaUsers />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-green-500">
              {stats.totalUsers > 0 ? `${stats.totalUsers} registered users` : 'No users yet'}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <FaProjectDiagram />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Projects</p>
                <p className="text-2xl font-bold">{stats.activeProjects}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-green-500">
              {stats.activeProjects > 0 ? `${projects?.length} total projects` : 'No active projects'}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                <FaChartLine />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Completed Projects</p>
                <p className="text-2xl font-bold">{stats.completedProjects}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-blue-500">
              {stats.completedProjects > 0 ? `${Math.round((stats.completedProjects / projects?.length) * 100)}% completion rate` : 'No completed projects'}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                <FaTasks />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending Tasks</p>
                <p className="text-2xl font-bold">{stats.pendingTasks}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-yellow-500">
              {stats.pendingTasks > 0 ? 'Require attention' : 'All tasks completed'}
            </div>
          </div>
        </div>

        {/* Main Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Projects</h2>
              <Link to="/projects" className="text-blue-500 text-sm hover:underline">View All</Link>
            </div>
            {projectsLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects && projects.length > 0 ? (
                      projects.slice(0, 3).map((project) => {
                        const projectOwner = users?.find(u => u.id === project.ownerId || u.id === project.userId);
                        return (
                          <tr key={project.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link to={`/projects/${project.id}`} className="text-blue-600 hover:underline">
                                {project.name}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {projectOwner ? (
                                <Link to={`/users/${projectOwner.id}`} className="hover:underline">
                                  {projectOwner.username || projectOwner.name}
                                </Link>
                              ) : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(project.status)}`}>
                                {getStatusText(project.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{formatDate(project.deadline)}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                          No projects found. <Link to="/projects/new" className="text-blue-500 hover:underline">Create one</Link>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">User Activity</h2>
              <Link to="/users" className="text-blue-500 text-sm hover:underline">View All Users</Link>
            </div>
            {usersLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {users && users.length > 0 ? (
                  users.slice(0, 5).map((appUser) => (
                    <div key={appUser.id} className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3 flex-shrink-0">
                        {(appUser.username || appUser.name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          <Link to={`/users/${appUser.id}`} className="font-semibold hover:underline">
                            {appUser.username || appUser.name}
                          </Link>
                          <span className="ml-2 text-xs text-gray-500">
                            {appUser.role || 'User'}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Last active: {appUser.lastActive ? formatDate(appUser.lastActive) : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No users found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;