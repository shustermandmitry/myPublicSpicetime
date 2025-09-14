import type { IconNames, IIcon } from './make-icon/types';

export { default as makeIcon } from './make-icon';
export { makeIconWithTooltip } from './make-icon/with-tooltip';

export * from './components/ShowAfterTimeout';
export * from './components/ErrorBoundary';

export * from './store/create-store';

export * from './context';

export * from './render/Render';

export type { IIcon, IconNames };
