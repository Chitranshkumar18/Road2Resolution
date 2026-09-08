import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, ExternalLink } from 'lucide-react';
import { NotificationContext } from '../../context/NotificationContext';

export const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, markAllAsRead, clearNotifications } = React.useContext(NotificationContext);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNotificationClick = (item) => {
    if (item.link) {
      navigate(item.link);
      onClose();
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-84 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-indigo-950/70 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-850 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          <h4 className="text-sm font-semibold text-slate-100">Civic Alerts</h4>
          <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-500/20 text-indigo-300 font-medium">
            {notifications.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={markAllAsRead}
            title="Mark all as read"
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
          <button
            onClick={clearNotifications}
            title="Clear all"
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">No new notifications</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-3.5 hover:bg-slate-800/60 transition-colors cursor-pointer flex gap-3 items-start ${
                !n.read ? 'bg-indigo-500/5' : ''
              }`}
            >
              <div
                className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                  !n.read ? 'bg-indigo-400' : 'bg-transparent'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <p className="text-xs font-semibold text-slate-200 truncate">{n.title}</p>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{n.message}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-600 self-center" />
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-slate-950/70 border-t border-slate-800 text-center">
        <span className="text-[11px] text-slate-400 font-medium">Real-time municipal telemetry active</span>
      </div>
    </div>
  );
};

export default NotificationPanel;
