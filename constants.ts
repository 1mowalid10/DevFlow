import { Role, TaskStatus } from './types';

export const TASK_STATUSES: TaskStatus[] = [
  TaskStatus.ToDo,
  TaskStatus.InProgress,
  TaskStatus.Done,
  TaskStatus.Blocked,
];

export const ROLES: Role[] = [
  Role.ProjectOwner,
  Role.TeamLeader,
  Role.Member,
  Role.ViewOnly,
];
