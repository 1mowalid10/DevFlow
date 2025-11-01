import React from 'react';
import { Task, TaskStatus } from '../types';
import { useAppContext } from '../context/AppContext';
import { TASK_STATUSES } from '../constants';

interface TaskCardProps {
  task: Task;
  projectId: string;
  phaseId: string;
}

const statusColors: Record<TaskStatus, { bg: string, text: string, ring: string, border: string }> = {
    [TaskStatus.ToDo]: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200', ring: 'ring-gray-300 dark:ring-gray-600', border: 'border-gray-300 dark:border-gray-600' },
    [TaskStatus.InProgress]: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-300', ring: 'ring-blue-300 dark:ring-blue-700', border: 'border-blue-400 dark:border-blue-600' },
    [TaskStatus.Done]: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-300', ring: 'ring-green-300 dark:ring-green-700', border: 'border-green-400 dark:border-green-600' },
    [TaskStatus.Blocked]: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-300', ring: 'ring-red-300 dark:ring-red-700', border: 'border-red-400 dark:border-red-600' },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, projectId, phaseId }) => {
    const { state, dispatch } = useAppContext();
    const assignee = state.workspace?.projects
        .flatMap(p => p.team)
        .find(u => u.id === task.assigneeId);
    
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!state.currentUser) return;
        const newStatus = e.target.value as TaskStatus;
        dispatch({
            type: 'UPDATE_TASK_STATUS',
            payload: { projectId, phaseId, taskId: task.id, status: newStatus, taskTitle: task.title, user: state.currentUser }
        });
    };

    const colors = statusColors[task.status];

    return (
        <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 ${colors.border}`}>
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-2 pr-2">{task.title}</h4>
                {assignee && (
                    <img
                        className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800 flex-shrink-0"
                        src={assignee.avatar}
                        alt={assignee.name}
                        title={assignee.name}
                    />
                )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{task.description}</p>
            
            <div className="flex items-center justify-between text-xs">
                <div className="text-gray-500 dark:text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <select
                    value={task.status}
                    onChange={handleStatusChange}
                    className={`${colors.bg} ${colors.text} text-xs font-medium rounded-md px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${colors.ring}`}
                    aria-label="Task status"
                >
                    {TASK_STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};