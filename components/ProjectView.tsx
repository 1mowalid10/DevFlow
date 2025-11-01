import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Phase, Project, Task } from '../types';
import { TaskCard } from './TaskCard';
import { generateTasksForPhase } from '../services/geminiService';
import { SparklesIcon } from './icons/Icon';

interface ProjectViewProps {
  projectId: string;
}

const ProjectHeader: React.FC<{ project: Project }> = ({ project }) => (
  <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
    <p className="mt-2 text-gray-600 dark:text-gray-300">{project.description}</p>
    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
      <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
      <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
      <span>Members: {project.team.length}</span>
    </div>
  </div>
);

const PhaseColumn: React.FC<{ phase: Phase; projectId: string; }> = ({ phase, projectId }) => {
    const { dispatch } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateTasks = async () => {
        setIsLoading(true);
        try {
            const lastTask = phase.tasks.length > 0 ? phase.tasks[phase.tasks.length - 1] : null;
            const newTasks = await generateTasksForPhase(phase.title, lastTask);
            if(newTasks.length > 0) {
                dispatch({ type: 'ADD_TASKS', payload: { projectId, phaseId: phase.id, tasks: newTasks } });
            }
        } catch (error) {
            console.error("Failed to generate and add tasks", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 flex-shrink-0 w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{phase.title}</h3>
                <button
                    onClick={handleGenerateTasks}
                    disabled={isLoading}
                    className="flex items-center text-xs bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900 px-3 py-1.5 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SparklesIcon className="w-4 h-4 mr-1.5" />
                    {isLoading ? 'Generating...' : 'Generate with AI'}
                </button>
            </div>
            <div className="space-y-3">
                {phase.tasks.map((task: Task) => (
                    <TaskCard key={task.id} task={task} projectId={projectId} phaseId={phase.id} />
                ))}
            </div>
        </div>
    );
};

export const ProjectView: React.FC<ProjectViewProps> = ({ projectId }) => {
  const { state } = useAppContext();
  const project = state.workspace?.projects.find((p) => p.id === projectId);

  if (!project) {
    return <div>Project not found or is loading...</div>;
  }

  return (
    <div>
      <ProjectHeader project={project} />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {project.phases.map((phase) => (
          <PhaseColumn key={phase.id} phase={phase} projectId={project.id} />
        ))}
      </div>
    </div>
  );
};