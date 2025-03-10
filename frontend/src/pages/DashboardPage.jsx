import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import AdminDashboard from '../components/AdminDashboard';
import UserDashboard from '../components/UserDashboard';

const DashboardPage = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return user?.role === 'Admin' ? <AdminDashboard /> : <UserDashboard />;
};

export default DashboardPage; 