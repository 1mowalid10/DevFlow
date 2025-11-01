import React, { useState, useEffect } from 'react';
import * as db from '../services/db';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const allUsers = [...new Map(db.getUsers().map(item => [item['id'], item])).values()];
        setUsers(allUsers);
    }, []);

    const handleUserSelect = (userId: string) => {
        db.login(userId);
        onLogin();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">DevFlow</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Your Project Workflow Assistant</p>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-8">
                    <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">Select your profile to continue</h2>
                    <div className="space-y-4">
                        {users.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => handleUserSelect(user.id)}
                                className="w-full flex items-center p-4 text-left bg-gray-50 dark:bg-gray-700/50 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <img className="h-12 w-12 rounded-full object-cover" src={user.avatar} alt={user.name} />
                                <div className="ml-4">
                                    <div className="text-md font-semibold text-gray-900 dark:text-white">{user.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.role}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};