import { ReactNode } from 'react';

export interface ToolbarClassNameContextType {
  className: string | undefined;
  portalTarget: HTMLElement;
}

export interface RootProps {
  id: string;
  children: ReactNode;
}
