import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useToast: simple toast manager hook.
 * Returns:
 * - toasts: array of toasts
 * - addSuccess(message), addError(message)
 * - dismiss(id), clear()
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const add = useCallback((type, message, ttlMs = 4000) => {
    idRef.current += 1;
    const id = idRef.current;
    const toast = { id, type, message };
    setToasts((prev) => [...prev, toast]);
    if (ttlMs > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, ttlMs);
    }
    return id;
  }, []);

  const addSuccess = useCallback((message, ttlMs) => add('success', message, ttlMs), [add]);
  const addError = useCallback((message, ttlMs) => add('error', message, ttlMs), [add]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => setToasts([]), []);

  return useMemo(
    () => ({ toasts, addSuccess, addError, dismiss, clear }),
    [toasts, addSuccess, addError, dismiss, clear]
  );
}
