import { useCallback, useRef, useState } from 'react';

export default function useLongPress(
  callback: () => void,
  ms = 100
) {
  const [startLongPress, setStartLongPress] = useState(false);
  const timerId = useRef<NodeJS.Timeout>();

  const start = useCallback(() => {
    // Trigger immediately once
    callback(); 
    // Then start interval
    timerId.current = setInterval(callback, ms);
    setStartLongPress(true);
  }, [callback, ms]);

  const stop = useCallback(() => {
    if (timerId.current) {
      clearInterval(timerId.current);
    }
    setStartLongPress(false);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}
