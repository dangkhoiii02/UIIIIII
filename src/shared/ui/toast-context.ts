import { createContext, useContext } from 'react';
export const ToastContext = createContext<((message: string) => void) | null>(null);
export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast requires ToastProvider');
  return value;
}
