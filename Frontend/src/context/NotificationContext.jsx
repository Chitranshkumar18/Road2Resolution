import React, { createContext, useState } from 'react';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: '🚨 Live GPS Telemetry Active',
      message: 'Municipal AI radar is scanning your sector for infrastructure updates.',
      time: 'Just now',
      read: false,
      type: 'info',
      link: '/citizen/explore'
    },
    {
      id: 'notif-2',
      title: '📋 Citizen Reports Queue',
      message: 'Track the status and municipal resolution progress of your submitted complaints.',
      time: '1h ago',
      read: false,
      type: 'info',
      link: '/citizen/my-reports'
    },
    {
      id: 'notif-3',
      title: '🔍 Repair Audit Portal',
      message: 'Inspect AI differential before-and-after audits for completed hazard repairs.',
      time: '3h ago',
      read: true,
      type: 'success',
      link: '/citizen/repair-verification'
    }
  ]);

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
      type: 'info',
      ...notif
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        addToast,
        addNotification,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
      {/* Global Toast Render */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-2xl border text-sm flex items-center gap-3 backdrop-blur-md transition-all duration-300 animate-bounce-short ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
                : 'bg-slate-900/95 border-indigo-500/50 text-slate-100'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
