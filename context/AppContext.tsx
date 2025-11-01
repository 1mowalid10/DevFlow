import React, { createContext, useReducer, useContext, ReactNode, Dispatch, useEffect } from 'react';
import { Workspace, TaskStatus, Task, Notification, NotificationType, Role, User } from '../types';
import * as db from '../services/db';

type AppState = {
  isInitialized: boolean;
  workspace: Workspace | null;
  notifications: Notification[];
  currentUser: User | null;
};

const initialState: AppState = {
  isInitialized: false,
  workspace: null,
  notifications: [],
  currentUser: null,
};

type Action = 
  | { type: 'SET_INITIAL_STATE'; payload: { workspace: Workspace; notifications: Notification[]; currentUser: User } }
  | { type: 'ADD_TASKS'; payload: { projectId: string; phaseId: string; tasks: Task[] } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'UPDATE_TASK_STATUS', payload: { projectId: string, phaseId: string, taskId: string, status: TaskStatus, taskTitle: string, user: User } };

const AppContext = createContext<{ state: AppState; dispatch: Dispatch<Action> } | undefined>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_INITIAL_STATE':
      return {
        ...state,
        isInitialized: true,
        workspace: action.payload.workspace,
        notifications: action.payload.notifications,
        currentUser: action.payload.currentUser,
      };
    case 'ADD_TASKS': {
        const { projectId, phaseId, tasks } = action.payload;
        if (!state.workspace) return state;

        const newWorkspace = JSON.parse(JSON.stringify(state.workspace));
        const project = newWorkspace.projects.find((p: Project) => p.id === projectId);
        if (project) {
            const phase = project.phases.find((ph: Phase) => ph.id === phaseId);
            if (phase) {
                phase.tasks.push(...tasks);
            }
        }
        return { ...state, workspace: newWorkspace };
    }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATIONS_READ':
       if (!state.currentUser) return state;
       db.markNotificationsRead(state.currentUser.id);
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      };
    case 'UPDATE_TASK_STATUS': {
      if (!state.workspace) return state;
      const { projectId, phaseId, taskId, status } = action.payload;
      const newWorkspace = JSON.parse(JSON.stringify(state.workspace));
      const project = newWorkspace.projects.find((p: Project) => p.id === projectId);
      if (project) {
        const phase = project.phases.find((ph: Phase) => ph.id === phaseId);
        if (phase) {
          const task = phase.tasks.find((t: Task) => t.id === taskId);
          if (task) {
            task.status = status;
          }
        }
      }
      return { ...state, workspace: newWorkspace };
    }
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load data from our DB service on mount
    const loadData = () => {
      const currentUserId = db.getCurrentUserId();
      if (currentUserId) {
        const workspace = db.getWorkspace();
        const notifications = db.getNotifications(currentUserId);
        const currentUser = db.getUserById(currentUserId);
        if(workspace && currentUser) {
          dispatch({ type: 'SET_INITIAL_STATE', payload: { workspace, notifications, currentUser } });
        }
      }
    };
    loadData();
  }, []);

  const enhancedDispatch: Dispatch<Action> = (action) => {
    // Middleware to persist changes to DB before updating state
    if(action.type === 'ADD_TASKS') {
        db.addTasks(action.payload.projectId, action.payload.phaseId, action.payload.tasks);
    }
    if (action.type === 'UPDATE_TASK_STATUS') {
        const { projectId, phaseId, taskId, status, taskTitle, user } = action.payload;
        db.updateTaskStatus(projectId, phaseId, taskId, status);

        // Create a notification when a task is marked as Done
        if (status === TaskStatus.Done && state.workspace) {
            const project = state.workspace.projects.find(p => p.id === projectId);
            const projectOwner = project?.team.find(u => u.role === Role.ProjectOwner);
            if (projectOwner && projectOwner.id !== user.id) { // Don't notify on self-actions
                const newNotification: Notification = {
                    id: `notif-${Date.now()}`,
                    type: NotificationType.TaskCompleted,
                    message: `${user.name} completed the task: "${taskTitle}"`,
                    timestamp: new Date(),
                    isRead: false,
                    userId: projectOwner.id,
                };
                db.addNotification(newNotification);
                // If the logged-in user is the project owner, update state locally
                if(state.currentUser?.id === projectOwner.id) {
                    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
                }
            }
        }
    }
    // Call the original dispatch to update the UI
    dispatch(action);
  };


  if (!state.isInitialized) {
    return <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900"><p className="text-lg">Loading DevFlow...</p></div>;
  }

  return (
    <AppContext.Provider value={{ state, dispatch: enhancedDispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Define Project and Phase interfaces to avoid errors
interface Project {
  id: string;
  phases: Phase[];
}

interface Phase {
  id: string;
  tasks: Task[];
}