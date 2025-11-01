import React from 'react';
import { useProjectData } from '../hooks/useProjectData';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon, ProjectIcon } from './icons/Icon';
import { DashboardData } from '../types';

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: number, total: number }> = ({ icon, label, value, total }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center">
        <div className="bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 rounded-full p-3">
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}<span className="text-sm font-normal text-gray-500"> / {total}</span></p>
        </div>
    </div>
);


const MemberRow: React.FC<{ data: DashboardData }> = ({ data }) => {
    const { member, assignedTasks, dueSoon, overdue, workload, doneTasks } = data;
    return (
        <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full" src={member.avatar} alt={member.name} />
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{member.role}</div>
                    </div>
                </div>
            </td>
            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{assignedTasks}</td>
            <td className="py-3 px-4 whitespace-nowrap text-sm text-yellow-600 dark:text-yellow-400 font-medium">{dueSoon}</td>
            <td className="py-3 px-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-medium">{overdue}</td>
            <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mr-2">
                        <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${workload}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{workload}%</span>
                </div>
            </td>
        </tr>
    );
};

export const Dashboard: React.FC = () => {
  const teamData = useProjectData();
  
  const totalTasks = teamData.reduce((sum, member) => sum + member.assignedTasks + member.doneTasks, 0);
  const totalDone = teamData.reduce((sum, member) => sum + member.doneTasks, 0);
  const totalDueSoon = teamData.reduce((sum, member) => sum + member.dueSoon, 0);
  const totalOverdue = teamData.reduce((sum, member) => sum + member.overdue, 0);


  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<ProjectIcon className="w-6 h-6"/>} label="Total Tasks" value={totalDone} total={totalTasks} />
            <StatCard icon={<CheckCircleIcon className="w-6 h-6"/>} label="Completed" value={totalDone} total={totalTasks} />
            <StatCard icon={<ClockIcon className="w-6 h-6"/>} label="Due Soon" value={totalDueSoon} total={totalTasks} />
            <StatCard icon={<ExclamationCircleIcon className="w-6 h-6"/>} label="Overdue" value={totalOverdue} total={totalTasks} />
        </div>
      
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Team Workload</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Member</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Assigned Tasks</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due Soon</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Overdue</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Workload</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {teamData.map((data) => (
                           <MemberRow key={data.member.id} data={data} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};