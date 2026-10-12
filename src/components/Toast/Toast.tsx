import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const ICONS = { success: CircleCheck, error: CircleAlert, info: Info };

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const Icon = ICONS[type];
  return (
    <div className={`toast toast--${type}`}>
      <Icon size={16} className="toast__icon" aria-hidden="true" />
      <p className="toast__message">{message}</p>
      <button type="button" className="toast__close" aria-label="Dismiss notification" onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="toast-region" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
}
