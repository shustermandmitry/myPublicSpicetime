/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { AUTO_SAVE } from '@/constants';
import { useLayout } from '@/context/LayoutContext';

import styled from '@emotion/styled';
import { Button, message } from 'antd';
import type { FC, PropsWithChildren } from 'react';
import { memo } from 'react';

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 999;
  grid-area: header;
  width: 100%;
  background: #fff;
  background-color: ${p => p.theme.colorBgPanel};
  padding: 14px;
  color: #64748b;
`;

const Header: FC<PropsWithChildren<{ onClick?: () => void }>> = ({ onClick, children }) => {
  function clearLocalStorage() {
    const keys = Object.keys(localStorage).filter(key =>
      ['node-engine-store', 'page-editor-store'].includes(key),
    );
    keys.forEach(key => localStorage.removeItem(key));
  }

  return (
    <StyledHeader onClick={onClick}>
      <Button onClick={clearLocalStorage}>Clear local storage</Button>
      <AutoSaveButton />
      <Button type="primary" href="/render">
        Preview on a page
      </Button>
      {children}
    </StyledHeader>
  );
};

export default Header;

const AutoSaveButton: FC = memo(() => {
  const { layout } = useLayout();
  const { info } = message;

  return (
    <Button
      aria-label={`Turn auto-save ${layout.autoSave ? 'off' : 'on'}`}
      onClick={() =>
        layout.setAutoSave(prev => {
          info(
            prev
              ? 'Auto save off'
              : `Autosaving on, saving every ${AUTO_SAVE.interval / 1000} seconds`,
          );

          return !prev;
        })
      }
    >
      Autosave {layout.autoSave ? 'on' : 'off'}
    </Button>
  );
});
