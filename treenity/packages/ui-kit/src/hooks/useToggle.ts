import { useCallback, useState } from 'react';

export default function useToggle(start: boolean = false): [boolean, (value?: any) => void] {
  const [value, setValue] = useState<boolean>(start);
  const toggle = useCallback(
    (value?: any) => setValue(prevValue => (typeof value === 'boolean' ? value : !prevValue)),
    [],
  );
  return [value, toggle];
}
