import '../styles/globals.css';
import React from 'react';
import { Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ProjectManagementPage from './pages/ProjectManagementPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import UserProfilePage from './pages/UserProfilePage';
import ClientManagementPage from './pages/ClientManagementPage';
import LeaveManagementPage from './pages/LeaveManagementPage';
import Test from './pages/Test';
import NotFound from './pages/NotFound';
import { UserProvider } from './context/UserContext';
import Sidebar from './components/Sidebar';

const AppContent = () => {
  const location = useLocation();
  const noSidebarPaths = ['/', '/404'];

  return (
    <div className="flex h-screen">
      {!noSidebarPaths.includes(location.pathname) && <Sidebar />}
      <div className="flex-grow overflow-auto">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/project-management" element={<ProjectManagementPage />} />
          <Route path="/client-management/*" element={<ClientManagementPage />} />
          <Route path="/leave-management/*" element={<LeaveManagementPage />} />
          <Route path="/projects" element={<NotFound />} />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
