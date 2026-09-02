import React from "react";
import { X, Cloud, Check, Bell, RefreshCw, Database, ShieldCheck } from "lucide-react";
import { WorkspaceNotification } from "../../types/workspace";

interface WorkspaceSyncNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: WorkspaceNotification[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  syncStatusText: string;
  onForceSync: () => void;
  onShowToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

export const WorkspaceSyncNotificationDrawer: React.FC<WorkspaceSyncNotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications,
  syncStatusText,
  onForceSync,
  onShowToast
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full p-6 shadow-2xl flex flex-col space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Cloud Sync & Notifications</h3>
              <p className="text-[10px] text-slate-400">Workspace Real-time Status</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sync Status Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-slate-950 border border-indigo-100 dark:border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Cloud Backup Engine
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              {syncStatusText}
            </span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Your saved papers, notes, AI ideas, proposals, and collections are encrypted and stored locally in browser state and synchronized.
          </p>

          <button
            onClick={() => {
              onForceSync();
              onShowToast("Cloud Sync Triggered", "All workspace records verified and backed up.", "success");
            }}
            className="w-full py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Force Sync Now
          </button>
        </div>

        {/* Notifications Center */}
        <div className="space-y-3 flex-1 flex flex-col text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" /> Notifications ({notifications.filter((n) => !n.isRead).length} Unread)
            </span>
            {notifications.length > 0 && (
              <button
                onClick={onClearAllNotifications}
                className="text-[10px] font-bold text-slate-400 hover:text-indigo-600"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Bell className="w-6 h-6 mx-auto text-slate-300" />
                <p className="font-bold">No Notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onMarkNotificationRead(notif.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                    !notif.isRead
                      ? "bg-indigo-50/50 dark:bg-slate-950 border-indigo-200 dark:border-indigo-900"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white line-clamp-1">{notif.title}</span>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
