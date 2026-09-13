import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ToastContext } from './toast-context';
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const notify = useCallback((text: string) => {
    clearTimeout(timer.current);
    setMessage(text);
    timer.current = setTimeout(() => setMessage(''), 4000);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div id="toast" role="status" className={message ? 'show' : ''}>
        {message}
      </div>
    </ToastContext.Provider>
  );
}
