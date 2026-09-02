import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${
            toast.type === "success"
              ? "bg-slate-900/95 border-emerald-500/40 text-emerald-100"
              : toast.type === "error"
              ? "bg-slate-900/95 border-rose-500/40 text-rose-100"
              : "bg-slate-900/95 border-indigo-500/40 text-indigo-100"
          }`}
        >
          <div className="mr-3 mt-0.5">
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-indigo-400" />}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{toast.title}</h4>
            {toast.message && <p className="text-xs text-slate-300 mt-1">{toast.message}</p>}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
