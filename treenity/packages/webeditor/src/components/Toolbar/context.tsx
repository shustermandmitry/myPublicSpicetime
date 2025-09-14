import { createContext, useContext } from 'react';

import type { ToolbarClassNameContextType } from './types';

export const ToolbarClassNameContext = createContext<ToolbarClassNameContextType | null>(null);

export function useToolbarContext() {
  const className = useContext(ToolbarClassNameContext);

  if (className === null) {
    throw new Error('Toolbar components must be used within a Toolbar.Root');
  }
  return className;
}
