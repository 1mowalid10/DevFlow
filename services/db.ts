import { Workspace, Role, TaskStatus, Task, Notification, User } from '../types';

// --- MOCK DATA FOR INITIAL SEEDING ---
const users: User[] = [
  { id: 'user-1', name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=sarah', role: Role.ProjectOwner },
  { id: 'user-2', name: 'Omar', avatar: 'https://i.pravatar.cc/150?u=omar', role: Role.TeamLeader },
  { id: 'user-3', name: 'Khaled', avatar: 'https://i.pravatar.cc/150?u=khaled', role: Role.Member },
  { id: 'user-4', name: 'Aisha', avatar: 'https://i.pravatar.cc/150?u=aisha', role: Role.Member },
  { id: 'user-5', name: 'Fatima', avatar: 'https://i.pravatar.cc/150?u=fatima', role: Role.ViewOnly },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const initialWorkspace: Workspace = {
  id: 'ws-1',
  name: 'Phoenix Digital',
  projects: [
    {
      id: 'proj-1',
      title: 'NextGen E-commerce Platform',
      description: 'A scalable and modern e-commerce solution for our new client.',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-10-30'),
      team: users,
      phases: [
        {
          id: 'phase-1',
          title: 'Phase 1: Discovery & Planning',
          tasks: [
            { id: 'task-1-1', title: 'Market Research', description: 'Analyze competitor landscape and target audience.', status: TaskStatus.Done, assigneeId: 'user-1', startDate: new Date('2024-08-01'), dueDate: new Date('2024-08-05'), durationDays: 5, dependencies: [] },
            { id: 'task-1-2', title: 'Define MVP Features', description: 'Finalize the feature list for the first release.', status: TaskStatus.Done, assigneeId: 'user-2', startDate: new Date('2024-08-06'), dueDate: new Date('2024-08-10'), durationDays: 5, dependencies: ['task-1-1'] },
          ]
        },
        {
          id: 'phase-2',
          title: 'Phase 2: UI/UX Design',
          tasks: [
            { id: 'task-2-1', title: 'Create Wireframes', description: 'Low-fidelity layouts for all major screens.', status: TaskStatus.Done, assigneeId: 'user-4', startDate: new Date('2024-08-11'), dueDate: new Date('2024-08-15'), durationDays: 5, dependencies: ['task-1-2'] },
            { id: 'task-2-2', title: 'High-Fidelity Mockups', description: 'Design pixel-perfect mockups in Figma.', status: TaskStatus.InProgress, assigneeId: 'user-4', startDate: new Date('2024-08-16'), dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), durationDays: 7, dependencies: ['task-2-1'] },
            { id: 'task-2-3', title: 'Prototype User Flows', description: 'Create an interactive prototype for user testing.', status: TaskStatus.ToDo, assigneeId: 'user-3', startDate: new Date('2024-08-23'), dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), durationDays: 5, dependencies: ['task-2-2'] },
          ]
        },
        {
          id: 'phase-3',
          title: 'Phase 3: Frontend Development',
          tasks: [
            { id: 'task-3-1', title: 'Setup Project Structure', description: 'Initialize repository and configure build tools.', status: TaskStatus.ToDo, assigneeId: 'user-3', startDate: new Date('2024-08-28'), dueDate: tomorrow, durationDays: 2, dependencies: ['task-2-3'] },
            { id: 'task-3-2', title: 'Overdue Task Example', description: 'This task is intentionally overdue for demo.', status: TaskStatus.InProgress, assigneeId: 'user-3', startDate: yesterday, dueDate: yesterday, durationDays: 2, dependencies: [] }
          ]
        }
      ]
    }
  ]
};

const DB_KEY_WORKSPACE = 'devflow_workspace';
const DB_KEY_NOTIFICATIONS = 'devflow_notifications';
const DB_KEY_CURRENT_USER = 'devflow_currentUser';

// --- DATABASE INITIALIZATION ---
export const initializeDB = () => {
    if (!localStorage.getItem(DB_KEY_WORKSPACE)) {
        localStorage.setItem(DB_KEY_WORKSPACE, JSON.stringify(initialWorkspace));
        localStorage.setItem(DB_KEY_NOTIFICATIONS, JSON.stringify([]));
    }
};

// --- AUTHENTICATION ---
export const getUsers = (): User[] => {
    const workspace = getWorkspace();
    return workspace ? workspace.projects.flatMap(p => p.team) : [];
}
export const getUserById = (userId: string): User | undefined => {
    const allUsers = [...new Map(getUsers().map(item => [item['id'], item])).values()];
    return allUsers.find(u => u.id === userId);
}
export const login = (userId: string) => localStorage.setItem(DB_KEY_CURRENT_USER, userId);
export const logout = () => localStorage.removeItem(DB_KEY_CURRENT_USER);
export const getCurrentUserId = (): string | null => localStorage.getItem(DB_KEY_CURRENT_USER);


// --- DATA ACCESS ---
export const getWorkspace = (): Workspace | null => {
    const data = localStorage.getItem(DB_KEY_WORKSPACE);
    return data ? JSON.parse(data) : null;
};

const saveWorkspace = (workspace: Workspace) => {
    localStorage.setItem(DB_KEY_WORKSPACE, JSON.stringify(workspace));
}

export const getNotifications = (userId: string): Notification[] => {
    const data = localStorage.getItem(DB_KEY_NOTIFICATIONS);
    const allNotifications: Notification[] = data ? JSON.parse(data) : [];
    return allNotifications.filter(n => n.userId === userId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const saveNotifications = (notifications: Notification[]) => {
    localStorage.setItem(DB_KEY_NOTIFICATIONS, JSON.stringify(notifications));
}


// --- DATA MUTATION ---

export const addTasks = (projectId: string, phaseId: string, tasks: Task[]) => {
    const workspace = getWorkspace();
    if (!workspace) return;

    const project = workspace.projects.find(p => p.id === projectId);
    if (project) {
        const phase = project.phases.find(ph => ph.id === phaseId);
        if (phase) {
            phase.tasks.push(...tasks);
            saveWorkspace(workspace);
        }
    }
}

export const updateTaskStatus = (projectId: string, phaseId: string, taskId: string, status: TaskStatus) => {
    const workspace = getWorkspace();
    if (!workspace) return;

    const project = workspace.projects.find(p => p.id === projectId);
    if (project) {
        const phase = project.phases.find(ph => ph.id === phaseId);
        if (phase) {
            const task = phase.tasks.find(t => t.id === taskId);
            if (task) {
                task.status = status;
                saveWorkspace(workspace);
            }
        }
    }
};

export const addNotification = (notification: Notification) => {
    const data = localStorage.getItem(DB_KEY_NOTIFICATIONS);
    const allNotifications: Notification[] = data ? JSON.parse(data) : [];
    allNotifications.push(notification);
    saveNotifications(allNotifications);
}

export const markNotificationsRead = (userId: string) => {
    const data = localStorage.getItem(DB_KEY_NOTIFICATIONS);
    const allNotifications: Notification[] = data ? JSON.parse(data) : [];
    const updated = allNotifications.map(n => n.userId === userId ? { ...n, isRead: true } : n);
    saveNotifications(updated);
}