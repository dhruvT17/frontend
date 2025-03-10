import React from 'react';
import { useUser } from '../context/UserContext'; // Import UserContext
import useAuthStore from '../store/authStore'; // Import useAuthStore

const UserDashboard = () => {
  const { user, setUser } = useUser(); // Use UserContext
  const { logout: authLogout } = useAuthStore(); // Get logout function from authStore

  const logout = () => {
    setUser(null); // Clear user data on logout
    authLogout(); // Call the logout function from authStore
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">User Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user?.username}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Dashboard Widgets */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">My Projects</h2>
            {/* Add projects content */}
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">My Tasks</h2>
            {/* Add tasks content */}
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            {/* Add activity content */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard; 
