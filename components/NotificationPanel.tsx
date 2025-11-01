import React from 'react';
import { useAppContext } from '../context/AppContext';

interface NotificationPanelProps {
    closePanel: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ closePanel }) => {
  const { state, dispatch } = useAppContext();
  const { notifications } = state;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = () => {
    dispatch({ type: 'MARK_NOTIFICATIONS_READ' });
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20 border dark:border-gray-700">
      <div className="py-2 px-4 flex justify-between items-center border-b dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
        {unreadCount > 0 && (
          <button onClick={handleMarkAsRead} className="text-sm text-primary-500 hover:underline">
            Mark all as read
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">No new notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start p-4 border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.isRead ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
            >
              {!notification.isRead && <span className="flex-shrink-0 w-2 h-2 mt-1.5 bg-primary-500 rounded-full mr-3"></span>}
              <div className={`flex-1 ${notification.isRead ? 'ml-5' : ''}`}>
                <p className="text-sm text-gray-700 dark:text-gray-300">{notification.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
