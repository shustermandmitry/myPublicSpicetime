import { useState, useRef, useEffect } from 'react';
import { useThrottledCallback } from 'use-debounce';

export function useThrottledInput(
  initialValue: string,
  onChangeCallback: (value: string) => void,
  delay = 400,
) {
  const [value, setValue] = useState(initialValue);
  const lastSyncedValue = useRef(initialValue);

  useEffect(() => {
    if (initialValue === lastSyncedValue.current) return;
    setValue(initialValue);
  }, [initialValue]);

  const throttledHandleChange = useThrottledCallback((newValue: string) => {
    lastSyncedValue.current = newValue;
    onChangeCallback(newValue);
  }, delay);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    throttledHandleChange(newValue);
  };

  return { value, onChange };
}
