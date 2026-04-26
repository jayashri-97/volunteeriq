'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type ToastType = 'parsing' | 'success' | 'error' | 'email';

interface ToastProps {
  type: ToastType;
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

const icons: Record<ToastType, React.ReactNode> = {
  parsing: (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="var(--blue)" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth={2.5} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth={2.5} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth={2} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
};

const bgColors: Record<ToastType, string> = {
  parsing: 'rgba(79, 70, 229, 0.06)',
  success: 'rgba(16, 185, 129, 0.06)',
  error: 'rgba(239, 68, 68, 0.06)',
  email: 'rgba(16, 185, 129, 0.06)',
};

const borderColors: Record<ToastType, string> = {
  parsing: 'rgba(79, 70, 229, 0.15)',
  success: 'rgba(16, 185, 129, 0.15)',
  error: 'rgba(239, 68, 68, 0.15)',
  email: 'rgba(16, 185, 129, 0.15)',
};

export default function Toast({ type, message, visible, onDismiss }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      // Auto-dismiss after 2.2s (except parsing)
      if (type !== 'parsing') {
        const timer = setTimeout(() => {
          setShow(false);
          setTimeout(onDismiss, 300);
        }, 2200);
        return () => clearTimeout(timer);
      }
    } else {
      setShow(false);
    }
  }, [visible, type, onDismiss]);

  if (!visible && !show) return null;

  return (
    <div
      className={cn(
        'fixed top-16 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2.5 rounded-lg border',
        'text-[11px] font-medium text-text1 shadow-lg',
        show ? 'animate-toast-pop' : 'opacity-0 -translate-y-3'
      )}
      style={{
        background: bgColors[type],
        borderColor: borderColors[type],
        zIndex: 'var(--z-toast)',
        backdropFilter: 'blur(12px)',
      }}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      {icons[type]}
      <span>{message}</span>
    </div>
  );
}
