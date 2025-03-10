import React, { useEffect, useState } from 'react';
import useUserStore from '../store/userStore';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import CreateUserModal from '../components/CreateUserModal';
import EditUserModal from '../components/EditUserModal';

const UserManagementPage = () => {
  const { user } = useUser();
  const { users, fetchUsers, isLoading, error, deleteUser } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  const usersPerPage = 8;

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId) => {
    await deleteUser(userId);
    fetchUsers(); // Refresh the list after deletion
    setDeleteConfirmId(null);
  };

  const handleUserCreated = () => {
    fetchUsers(); // Refresh the user list after creation
  };

  // Add the missing handleUserUpdated function
  const handleUserUpdated = () => {
    fetchUsers(); // Refresh the user list after update
  };

  // Filter users based on search term
  const filteredUsers = users?.filter(user => {
    if (!searchTerm.trim()) return true;
    
    const username = user.credentialId?.username || user.username || '';
    const email = user.email || '';
    const role = user.credentialId?.role || user.role || '';
    const contactNumber = user.contact_number || '';
    
    const searchLower = searchTerm.toLowerCase();
    
    return username.toLowerCase().includes(searchLower) || 
           email.toLowerCase().includes(searchLower) ||
           role.toLowerCase().includes(searchLower) ||
           contactNumber.includes(searchLower);
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil((filteredUsers?.length || 0) / usersPerPage);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-50 rounded-lg flex items-center justify-center min-h-[200px]">
      <div className="text-red-500 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create User
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by username, email, role or contact number..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers && currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-blue-50 transition-colors duration-200">
                    {/* User row content */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-sm">
                          {(user.credentialId?.username || user.username || '').charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.credentialId?.username || user.username}</div>
                          <div className="text-xs text-gray-500">User ID: {user._id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      {user.email_verified && (
                        <div className="text-xs text-green-600 flex items-center mt-1">
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Verified
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{user.contact_number || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (user.credentialId?.role || user.role) === 'Admin' 
                          ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {user.credentialId?.role || user.role}
                      </span>
                      {user.is_active !== undefined && (
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          user.is_active 
                            ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => {
                            setUserToEdit(user);
                            setIsEditModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        {deleteConfirmId === user._id ? (
                          <div className="inline-flex items-center space-x-2 bg-red-50 px-2 py-1 rounded border border-red-100">
                            <button 
                              onClick={() => handleDelete(user._id)} 
                              className="text-red-600 hover:text-red-900 font-medium"
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => setDeleteConfirmId(null)} 
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setDeleteConfirmId(user._id)} 
                            className="text-red-600 hover:text-red-900 inline-flex items-center hover:bg-red-50 px-2 py-1 rounded transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 bg-gray-50">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="text-lg font-medium">
                      {searchTerm ? 'No matching users found' : 'No users found'}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {searchTerm ? (
                        <>
                          Try adjusting your search criteria or 
                          <button 
                            onClick={() => setSearchTerm('')}
                            className="text-blue-500 hover:text-blue-700 ml-1"
                          >
                            clear search
                          </button>
                        </>
                      ) : (
                        'Get started by creating a new user'
                      )}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination controls */}
        {filteredUsers && filteredUsers.length > usersPerPage && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastUser, filteredUsers.length)}
              </span>{" "}
              of <span className="font-medium">{filteredUsers.length}</span> users
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = idx + 1;
                } else if (currentPage <= 3) {
                  pageNumber = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + idx;
                } else {
                  pageNumber = currentPage - 2 + idx;
                }
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUserCreated={handleUserCreated} />
      {userToEdit && (
        <EditUserModal 
          isOpen={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            setUserToEdit(null);
          }} 
          user={userToEdit}
          onUserUpdated={handleUserUpdated} 
        />
      )}
    </div>
  );
};

export default UserManagementPage;