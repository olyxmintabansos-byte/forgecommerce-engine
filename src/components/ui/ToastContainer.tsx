"use client";

import React, { useEffect, useState } from 'react';
import { ToastMessage } from '@/lib/toast';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastMessage>;
      if (customEvent.detail) {
        const newToast = customEvent.detail;
        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, newToast.duration || 3200);
      }
    };

    window.addEventListener('forge_toast_event', handleToast);
    return () => window.removeEventListener('forge_toast_event', handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0">
      {toasts.map((t) => {
        let borderClass = 'border-emerald-500/40 bg-slate-950/90 text-emerald-400';
        let icon = <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />;

        if (t.type === 'info') {
          borderClass = 'border-cyan-500/40 bg-slate-950/90 text-cyan-400';
          icon = <Info className="h-5 w-5 text-cyan-400 shrink-0" />;
        } else if (t.type === 'warning') {
          borderClass = 'border-amber-500/40 bg-slate-950/90 text-amber-400';
          icon = <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />;
        } else if (t.type === 'error') {
          borderClass = 'border-rose-500/40 bg-slate-950/90 text-rose-400';
          icon = <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />;
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start justify-between gap-3 animate-slide-in-right ${borderClass}`}
          >
            <div className="flex items-start gap-3">
              {icon}
              <div>
                {t.title && <h5 className="font-bold text-xs text-white mb-0.5">{t.title}</h5>}
                <p className="text-xs text-slate-200 leading-snug">{t.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-500 hover:text-slate-300 p-1 -mr-1 -mt-1 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
