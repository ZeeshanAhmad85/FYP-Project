import { useRef, useCallback, useState } from 'react';

const useTimer = (callback: () => void, delay: number) => {
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const start = useRef<number>(0);
  const remaining = useRef<number>(delay);
  const [elapsed, setElapsed] = useState<number>(0);

  const pause = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    const timeElapsed = Date.now() - start.current;
    remaining.current -= timeElapsed;
    setElapsed((prev) => prev + timeElapsed);
  }, []);

  const resume = useCallback(() => {
    start.current = Date.now();
    timerId.current = setTimeout(() => {
      remaining.current = delay;
      setElapsed((prev) => prev + (Date.now() - start.current));
      callback();
    }, remaining.current);
  }, [callback, delay]);

  const reset = useCallback(() => {
    remaining.current = delay;
    setElapsed(0);
  }, [delay]);

  return { pause, resume, reset, elapsed };
};

export default useTimer;
