import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
}

export const Toast: React.FC<ToastProps> = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          {t.type === 'success' && <CheckCircle2 size={18} color="var(--accent-emerald)" />}
          {t.type === 'error' && <AlertCircle size={18} color="var(--accent-rose)" />}
          {t.type === 'info' && <Info size={18} color="var(--accent-cyan)" />}
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
};
