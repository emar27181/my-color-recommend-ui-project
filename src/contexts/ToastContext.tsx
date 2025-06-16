import React, { createContext, useContext } from 'react';
import { useToast } from '@/hooks/useToast';
import type { ToastMessage } from '@/hooks/useToast';

interface ToastContextType {
  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast, removeToast } = useToast();

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};