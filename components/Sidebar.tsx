import React from 'react';
import { useAppContext } from '../context/AppContext';
import { View } from '../types';
import { DashboardIcon, ProjectIcon } from './icons/Icon';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen }) => {
  const { state } = useAppContext();

  const handleNavigation = (view: View) => {
    setView(view);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }

  const NavLink: React.FC<{
    view: View;
    icon: React.ReactNode;
    label: string;
  }> = ({ view, icon, label }) => {
    const isActive = JSON.stringify(currentView) === JSON.stringify(view);
    return (
      <li>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation(view);
          }}
          className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
            isActive
              ? 'bg-primary-600 text-white'
              : 'text-gray-300 hover:bg-primary-800 hover:text-white'
          }`}
        >
          {icon}
          <span className="ml-3">{label}</span>
        </a>
      </li>
    );
  };
  
  return (
    <>
       <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
       <div className={`fixed md:relative z-30 flex flex-col w-64 bg-gray-800 text-gray-200 h-full transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="flex items-center justify-start h-16 px-4 border-b border-gray-700">
                <h1 className="text-xl font-bold text-white">DevFlow</h1>
            </div>
            <div className="flex-1 overflow-y-auto">
                <nav className="p-2">
                    <ul>
                        <NavLink view={{ type: 'dashboard' }} icon={<DashboardIcon className="w-6 h-6" />} label="Dashboard" />
                        <li className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Projects</li>
                        {state.workspace?.projects.map((project) => (
                            <NavLink key={project.id} view={{ type: 'project', projectId: project.id }} icon={<ProjectIcon className="w-6 h-6" />} label={project.title} />
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    </>
  );
};