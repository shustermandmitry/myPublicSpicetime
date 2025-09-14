import React, { useEffect, useRef, useState } from 'react';

type UseHoverType<T extends HTMLDivElement> = [React.RefObject<T>, boolean];

export default function useHover<T extends HTMLDivElement>(): UseHoverType<T> {
  const [value, setValue] = useState(false);

  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);

    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);

      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, [ref.current]);

  return [ref, value];
}
