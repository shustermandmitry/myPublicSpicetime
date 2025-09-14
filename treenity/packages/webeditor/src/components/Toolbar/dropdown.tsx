import styled from '@emotion/styled';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { FC, ReactNode } from 'react';
import React from 'react';

export type DropdownProps = {
  menuItems: { key: string; label: ReactNode }[];
  show?: boolean;
  beforeTrigger?: ReactNode;
} & DropdownMenu.DropdownMenuProps;

const Content = styled(DropdownMenu.Content)`
  background-color: ${p => p.theme.colorBgContainer};
  border: 1px solid var(--puck-color-grey-05);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 1px;
`;

const Dropdown: FC<DropdownProps> = ({
  open,
  show = true,
  onOpenChange,
  menuItems,
  children,
  beforeTrigger,
  ...rest
}) => {
  if (!show) {
    return null;
  }

  return (
    <div>
      <DropdownMenu.Root open={open} onOpenChange={onOpenChange} {...rest}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: 'min-content',
          }}
        >
          {beforeTrigger}
          <DropdownMenu.Trigger asChild>
            <button
              style={{
                border: 'none',
                background: 'none',
                padding: '0',
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--puck-color-grey-08)',
              }}
            >
              {children}
            </button>
          </DropdownMenu.Trigger>
        </div>
        <Content className="DropdownMenuContent" sideOffset={5}>
          {menuItems?.map((item, index) => {
            return <React.Fragment key={`${item.label}-${index}`}>{item.label}</React.Fragment>;
          })}
        </Content>
      </DropdownMenu.Root>
    </div>
  );
};

export default Dropdown;
