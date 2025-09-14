import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { Tooltip } from 'antd';
import React, { FC, type PropsWithChildren, useCallback } from 'react';

type ItemAlign = 'left' | 'center' | 'right';

interface ToolbarItemProps extends PropsWithChildren {
  align?: ItemAlign;
  interactive?: boolean;
  active?: boolean;
  onClick?: () => void;
  tooltip?: string;
}

const ToolbarItem: FC<ToolbarItemProps> = ({
  children,
  onClick,
  tooltip,
  active = false,
  interactive = false,
  align = 'center',
}) => {
  const getPopupContainer = useCallback(() => document.body, []);

  return (
    <Tooltip
      trigger={['hover']}
      getPopupContainer={getPopupContainer}
      title={tooltip}
      placement="bottom"
      mouseEnterDelay={1}
    >
      <Root align={align} onClick={onClick} interactive={interactive} active={active}>
        {children}
      </Root>
    </Tooltip>
  );
};

const Root = styled('div', omitProps('align', 'interactive', 'active'))<{
  align: ItemAlign;
  active?: boolean;
  interactive?: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: ${p => p.align};
  align-items: center;
  padding-inline: 6px;
  cursor: pointer;
  color: ${p => p.theme.colorTextBase};
  transition:
    color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
    background-color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);

  &&& {
    i {
      padding-block: 4px;
      font-size: 14px;
      transition: color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }
  }

  .ant-select-item-option-selected & {
    color: ${p => p.theme.colorTextLightSolid};
  }

  ${p =>
    p.active &&
    css`
      &&& {
        color: ${p.theme.colorPrimary};

        i {
          color: ${p.theme.colorPrimary};
        }
      }
    `};

  ${p =>
    p.interactive &&
    css`
      padding-inline: 4px;

      &:hover {
        color: ${p.theme.colorPrimaryHover};

        i {
          color: ${p.theme.colorPrimaryHover};
        }
      }

      &:active {
        color: ${p.theme.colorPrimaryActive};

        i {
          color: ${p.theme.colorPrimaryActive};
        }
      }
    `}
`;

export default ToolbarItem;
