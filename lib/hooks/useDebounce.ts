import { useEffect, useState } from 'react';

function useDebounce<T>(value: T, delay?: number): T;
function useDebounce<T>(
  value: T,
  delay: number | undefined,
  withStatus: true,
): {
  debouncedValue: T;
  isDebouncing: boolean;
};

function useDebounce<T>(value: T, delay = 500, withStatus?: boolean) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    if (withStatus) setIsDebouncing(true);

    const timer = setTimeout(() => {
      setDebouncedValue(value);
      if (withStatus) setIsDebouncing(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, withStatus]);

  if (withStatus) {
    return { debouncedValue, isDebouncing };
  }
  return debouncedValue;
}

export default useDebounce;
