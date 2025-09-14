import Button from '@/components/button';
import Icon from '@/components/icon';
import styled from '@emotion/styled';

import { FC } from 'react';
import { IHeaderFolderButtons } from './types';

const HeaderFolderButtons: FC<IHeaderFolderButtons> = ({ isSelect, disabled, onSelect }) => {
  return (
    <HeaderButtons>
      <Button
        type="primary"
        ghost={!isSelect}
        icon={<Icon name={isSelect ? 'select-file_outlined' : 'selected_outlined'} />}
        onClick={onSelect}
        disabled={disabled}
      >
        Selected
      </Button>
    </HeaderButtons>
  );
};

const HeaderButtons = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 8px 6px 6px;
  justify-content: flex-end;
`;

export default HeaderFolderButtons;
