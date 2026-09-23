'use client';

import { useEffect } from 'react';

export function useKeyboardShortcut(key, callback, ctrlKey = true) {
  useEffect(() => {
    function handleKeyDown(event) {
      const isCtrlOrMeta = ctrlKey ? event.ctrlKey || event.metaKey : true;
      if (isCtrlOrMeta && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        callback();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, ctrlKey]);
}
