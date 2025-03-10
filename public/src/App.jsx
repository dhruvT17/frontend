import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import UserProfilePage from './pages/UserProfilePage';
import Test from './pages/Test';
import NotFound from './pages/NotFound';
import { UserProvider } from './context/UserContext';
import Sidebar from './components/Sidebar';

const AppContent = () => {
  const location = useLocation();
  
  // Define paths where the sidebar should not be displayed
  const noSidebarPaths = ['/', '/404'];

  return (
    <div className="flex h-screen">
      {!noSidebarPaths.includes(location.pathname) && <Sidebar />}
      <div className="flex-grow p-4 overflow-auto">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;
