import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ProjectView } from './components/ProjectView';
import { LoginScreen } from './components/LoginScreen';
import { View } from './types';
import * as db from './services/db';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>({ type: 'dashboard' });
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check for a logged-in user when the app starts
    const currentUser = db.getCurrentUserId();
    if (currentUser) {
      setIsAuthenticated(true);
    }
    db.initializeDB(); // Ensure DB is seeded
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView({ type: 'dashboard' }); // Reset to dashboard on login
  };

  const handleLogout = () => {
    db.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView.type) {
      case 'project':
        return <ProjectView projectId={currentView.projectId} />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <Sidebar 
          currentView={currentView} 
          setView={setCurrentView} 
          isOpen={isSidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            currentView={currentView}
            toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
            {renderView()}
          </main>
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
