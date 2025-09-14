import { FC, PropsWithChildren, useLayoutEffect, useState } from 'react';

function useLoadingTimeout(ms: number): boolean {
  const [loading, setLoading] = useState(false);
  useLayoutEffect(() => {
    const id = setTimeout(() => {
      setLoading(true);
    }, ms);
    return () => clearTimeout(id);
  }, []);

  return loading;
}

export const ShowAfterTimeout: FC<PropsWithChildren & { timeout: number }> = ({
  children,
  timeout,
}) => {
  const showChild = useLoadingTimeout(timeout);
  return showChild ? children : null;
};
