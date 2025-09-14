import styled from '@emotion/styled';
import { Popover } from 'antd';
import { FC } from 'react';
import Button from '../button';
import ContextMenu from '../contextMenu';
import Icon from '../icon';

const PopoverContextMenu: FC<any> = ({ menu, onOpen, open }) => {
  return (
    <PopoverStyled
      open={open}
      placement="bottomRight"
      trigger="click"
      content={() => <ContextMenu list={menu} />}
      onOpenChange={onOpen}
    >
      <Button
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        icon={<Icon name="kebab-v_filled" />}
      />
    </PopoverStyled>
  );
};

const PopoverStyled = styled(Popover)`
  & + .ant-popover {
    .ant-popover-inner {
      border: 1px solid #f4f4f6;
      padding: 2px;
    }
  }
`;

export default PopoverContextMenu;
