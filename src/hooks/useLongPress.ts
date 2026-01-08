 import { useCallback, useRef } from 'react';

export default function useLongPress(
  callback: () => void,
  speed = 200,
  delay = 800
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback((e: React.SyntheticEvent) => {
    // IMPORTANT: Stop the long-press context menu on Android
    if (e.type === 'touchstart') {
       // We don't preventDefault() here because it blocks scrolling the page
       // Instead, we handle context menu prevention on the button itself
    }
    
    callback(); // Fire once immediately

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        callback();
      }, speed);
    }, delay);
  }, [callback, speed, delay]);

  const stop = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}
