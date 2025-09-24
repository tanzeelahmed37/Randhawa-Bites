

import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { MenuIcon, DashboardIcon, TableIcon, LogoutIcon, UserIcon } from './common/Icon';
import { RandhawaBitesIcon } from './common/Brand';

interface POSLayoutProps {
  onLogout: () => void;
}

const POSLayout: React.FC<POSLayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const navItems = [
    { to: '/', label: 'POS', icon: MenuIcon },
    { to: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { to: '/tables', label: 'Tables', icon: TableIcon },
  ];
  
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Sidebar */}
      <aside className="w-24 bg-white dark:bg-gray-800 shadow-lg flex flex-col items-center py-6">
        <RandhawaBitesIcon className="w-12 h-12" />
        <nav className="flex-1 flex flex-col items-center justify-center space-y-6 mt-12">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center p-3 rounded-lg w-16 h-16 justify-center transition-colors duration-200 ${
                  isActive
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`
              }
              title={label}
            >
              <Icon className="w-7 h-7" />
              <span className="text-xs mt-1">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center text-center p-2" title="User">
                <UserIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                <span className="text-xs mt-1 text-gray-500 dark:text-gray-400 truncate w-20">User</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex flex-col items-center p-3 rounded-lg w-16 h-16 justify-center transition-colors duration-200 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-300"
              title="Logout"
            >
              <LogoutIcon className="w-7 h-7" />
              <span className="text-xs mt-1">Logout</span>
            </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default POSLayout;