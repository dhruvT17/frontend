import React, { useEffect, useState } from 'react';
import useUserStore from '../store/userStore';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import CreateUserModal from '../components/CreateUserModal';

const UserManagementPage = () => {
  const { user } = useUser();
  const { users, fetchUsers, isLoading, error } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Create User</button>
      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Contact Number</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{user.credentialId.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.contact_number}</td>
                <td className="border px-4 py-2">{user.credentialId.role}</td>
                <td className="border px-4 py-2">
                  <Link to={`/edit-user/${user._id}`} className="text-blue-500">Edit</Link>
                  <button onClick={() => deleteUser(user._id)} className="text-red-500 ml-2">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border px-4 py-2 text-center">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default UserManagementPage; 