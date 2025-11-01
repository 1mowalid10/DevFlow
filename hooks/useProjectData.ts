import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { DashboardData, TaskStatus } from '../types';

export const useProjectData = (): DashboardData[] => {
  const { state } = useAppContext();
  const { workspace } = state;

  return useMemo(() => {
    if (!workspace || !workspace.projects.length) {
      return [];
    }
    
    const allProjects = workspace.projects;
    const allUsers = [...new Map(allProjects.flatMap(p => p.team).map(item => [item['id'], item])).values()];

    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    return allUsers.map(user => {
      let assignedTasks = 0;
      let dueSoon = 0;
      let overdue = 0;
      let doneTasks = 0;

      allProjects.forEach(project => {
        project.phases.forEach(phase => {
          phase.tasks.forEach(task => {
            if (task.assigneeId === user.id) {
              if (task.status === TaskStatus.Done) {
                doneTasks++;
              } else {
                assignedTasks++;
                const dueDate = new Date(task.dueDate);
                // FIX: Removed redundant check `task.status !== TaskStatus.Done` because this code is in an `else` block that already confirms the status is not `Done`.
                if (dueDate < now) {
                  overdue++;
                } else if (dueDate >= now && dueDate <= threeDaysFromNow) {
                  dueSoon++;
                }
              }
            }
          });
        });
      });
      
      const totalTasks = assignedTasks + doneTasks;
      const workload = totalTasks > 0 ? Math.round((assignedTasks / (totalTasks + 5)) * 100) : 0; // Simple workload calc

      return {
        member: user,
        assignedTasks,
        dueSoon,
        overdue,
        doneTasks,
        workload: Math.min(100, workload),
      };
    });
  }, [workspace]);
};