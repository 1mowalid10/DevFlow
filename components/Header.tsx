import React, { useState } from 'react';
import { BellIcon, ChevronDownIcon, MenuIcon } from './icons/Icon';
import { NotificationPanel } from './NotificationPanel';
import { useAppContext } from '../context/AppContext';
import { View } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  currentView: View;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, currentView, onLogout }) => {
  const { state } = useAppContext();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const user = state.currentUser;

  const getTitle = () => {
    if (currentView.type === 'dashboard') {
      return 'Team Dashboard';
    }
    const project = state.workspace?.projects.find(p => p.id === currentView.projectId);
    return project ? project.title : 'Project';
  }

  if (!user) {
    return null; // Don't render header if no user is logged in
  }

  return (
    <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none mr-4">
            <MenuIcon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{getTitle()}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Notifications"
            >
              <BellIcon className="h-6 w-6" />
            </button>
            {notificationsOpen && <NotificationPanel closePanel={() => setNotificationsOpen(false)} />}
          </div>

          <div className="relative">
             <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-2">
                <img className="h-9 w-9 rounded-full object-cover" src={user.avatar} alt={user.name} />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user.role}</div>
                </div>
                 <ChevronDownIcon className="hidden sm:block w-5 h-5 text-gray-400" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border dark:border-gray-700">
                <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Sign Out</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};