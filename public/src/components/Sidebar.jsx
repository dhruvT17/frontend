import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Sidebar = () => {
  const { user } = useUser();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const adminLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/user-management', label: 'User Management' },
    // Add more admin-specific links here
  ];

  const userLinks = [
    { path: '/profile', label: 'Profile' },
    // Add more user-specific links here
  ];

  return (
    <div className="w-64 h-full bg-gray-800 text-white shadow-lg md:w-80 transition-all duration-300">
      <h2 className="text-2xl font-bold p-4 text-center border-b border-gray-700">Navigation</h2>
      <ul className="flex flex-col space-y-2 p-4">
        {user?.role === 'Admin' ? (
          adminLinks.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={`block p-4 rounded-lg transition duration-200 ${activePath === link.path ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                {link.label}
              </Link>
            </li>
          ))
        ) : (
          userLinks.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={`block p-4 rounded-lg transition duration-200 ${activePath === link.path ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                {link.label}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Sidebar; 