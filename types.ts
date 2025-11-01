export enum Role {
  ProjectOwner = 'Project Owner',
  TeamLeader = 'Team Leader',
  Member = 'Member',
  ViewOnly = 'View-Only',
}

export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
  Blocked = 'Blocked',
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: Role;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string | null;
  startDate: Date;
  dueDate: Date;
  durationDays: number;
  dependencies: string[]; // array of task IDs
}

export interface Phase {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  team: User[];
  phases: Phase[];
}

export interface Workspace {
  id: string;
  name: string;
  projects: Project[];
}

export enum NotificationType {
  TaskStart,
  DeadlineSoon,
  TaskOverdue,
  TaskCompleted,
  PhaseCompleted,
  TimelineShift,
  DailyPlan,
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  isRead: boolean;
  userId: string;
}

export type View = { type: 'dashboard' } | { type: 'project'; projectId: string };

export interface DashboardData {
  member: User;
  assignedTasks: number;
  dueSoon: number;
  overdue: number;
  workload: number;
  doneTasks: number;
}