 import { useCallback, useRef } from 'react';

export default function useLongPress(
  callback: () => void,
  speed = 200, // Loop speed (ms) - Increased to 200ms for control
  delay = 1000 // Start delay (ms) - Increased to 1000ms
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback((e?: React.SyntheticEvent) => {
    // Prevent default to stop scrolling/selecting while holding
    if (e && e.type === 'touchstart') {
        // e.preventDefault(); // Optional: might block scrolling on some devices
    }

    // 1. Single Tap Action (Fire immediately)
    callback();

    // 2. Start Timer for Long Press
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        callback();
      }, speed);
    }, delay);
  }, [callback, speed, delay]);

  const stop = useCallback(() => {
    // Clear both timers immediately on release
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
