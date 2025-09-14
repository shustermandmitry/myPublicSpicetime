import type { PropsWithChildren } from 'react';

export interface IPortalProps extends PropsWithChildren {
  name: string;
}

export interface IPortals {
  [key: string]: IPortalsProps;
}

export interface IComponentPortal {
  forceUpdate(): void;
  el?: Element;
}

export interface IPortalsProps {
  comp?: IComponentPortal;
  el?: Element[];
}

export interface IPortalHandlerProps {
  name: string;
  component?: string;
  multi?: boolean;
}
