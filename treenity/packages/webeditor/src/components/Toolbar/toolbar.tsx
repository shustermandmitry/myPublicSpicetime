// @ts-nocheck
import getToolbarButtonClassname from '@/utils/get-toolbar-button-classname';
import getToolbarPortal from '@/utils/get-toolbar-portal';

import { Tooltip } from 'antd';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';

import { ToolbarClassNameContext, useToolbarContext } from './context';
import Dropdown from './dropdown';
import type { RootProps } from './types';

const Action: FC<
  PropsWithChildren<{
    hint?: string;
    show?: boolean;
    active?: boolean;
    onClick: () => void;
  }>
> = ({ hint, show = true, active = false, children, onClick, ...rest }) => {
  const { className } = useToolbarContext();

  if (!show) {
    return null;
  }

  return (
    <Tooltip title={hint}>
      <button
        className={['ToolbarButton', className, active ? 'ToolbarButton--active' : false]
          .filter(Boolean)
          .join(' ')}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    </Tooltip>
  );
};

const Root: FC<React.PropsWithChildren<RootProps>> = ({ id, children }) => {
  // const portalTarget = getToolbarPortal(id);
  const portalTarget =
    (
      document?.querySelector('iframe#canvas-iframe') as HTMLIFrameElement
    ).contentDocument?.querySelector('.page-container div') ||
    document?.querySelector('.page-container div');

  const className = getToolbarButtonClassname(id);

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <ToolbarClassNameContext.Provider value={{ className, portalTarget }}>
      {children}
    </ToolbarClassNameContext.Provider>,
    portalTarget,
  );
};

export { Action, Dropdown, Root };
