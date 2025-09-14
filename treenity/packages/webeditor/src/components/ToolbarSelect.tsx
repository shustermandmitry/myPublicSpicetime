import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Icon } from '@treenity/admin-components/components';
import { useToggle } from '@treenity/ui-kit/hooks';
import { omitProps } from '@treenity/ui-kit/utils';
import { Select, Tooltip } from 'antd';
import React, { FC, ReactNode, useCallback, useState } from 'react';

interface ToolbarSelectProps {
  items: { label: string | ReactNode; value: string | ReactNode }[];
  value?: string | ReactNode;
  onChange?: (value: string | ReactNode) => void;
  width?: number;
  hideIcon?: boolean;
  prefixIcon?: ReactNode;
  tooltip?: string;
}

const ToolbarSelect: FC<ToolbarSelectProps> = ({
  items,
  value,
  onChange,
  width,
  hideIcon,
  prefixIcon,
  tooltip,
}) => {
  const getPopupContainer = useCallback(() => document.body, []);

  const [localValue, setLocalValue] = useState(value || items[0].value);
  const [open, toggleOpen] = useToggle(false);

  const hangleChange = (value: string | ReactNode) => {
    setLocalValue(value);
    onChange?.(value);
    toggleOpen(false);
  };

  return (
    <Root width={width} hideIcon={hideIcon}>
      <Tooltip
        trigger="hover"
        title={tooltip}
        placement="bottom"
        getPopupContainer={getPopupContainer}
        mouseEnterDelay={1}
      >
        <IconContainer>{prefixIcon}</IconContainer>
      </Tooltip>
      <Select
        options={items}
        open={open}
        size="small"
        onChange={hangleChange}
        onClick={toggleOpen}
        onBlur={() => toggleOpen(false)}
        onSelect={toggleOpen}
        value={localValue}
        suffixIcon={
          <ChevronIcon>
            {!hideIcon && <Icon name="chevron-down_outlined" rotate={open ? 180 : 0} />}
          </ChevronIcon>
        }
        popupMatchSelectWidth={false}
      />
    </Root>
  );
};

const ChevronIcon = styled.div`
  pointer-events: none !important; // Hack from AntD docs

  i {
    transition: color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: ${p => p.theme.colorPrimary};
`;

const Root = styled('div', omitProps('width'))<{ width?: number; hideIcon?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
  transition: background-color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);

  &&& {
    .ant-select {
      height: 22px;
    }

    .ant-select-selector {
      border: 0;
      height: 22px;
      padding: 0;
      box-shadow: none !important;

      ${p =>
        p.width &&
        css`
          width: ${p.width}px !important;
        `};

      .ant-btn {
        font-size: 12px;
      }
    }

    .ant-select-arrow {
      inset-inline-end: 2px;
      pointer-events: none;

      i {
        color: ${p => p.theme.colorTextBase};
        pointer-events: none;
      }
    }

    .rc-virtual-list-holder {
      max-height: 320px !important;
    }

    .ant-select-item {
      padding: 0;
    }

    .ant-select-selection-item {
      padding-inline-end: 18px !important;
      font-size: 12px !important;
    }

    ${p =>
      p.hideIcon &&
      css`
        .ant-select-selection-search,
        .ant-select-selection-item {
          padding-inline-end: 0 !important;
        }
      `}
  }
`;

export default ToolbarSelect;
