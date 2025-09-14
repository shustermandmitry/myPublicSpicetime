import Button from '@/components/button';
import Icon from '@/components/icon';
import { IconNamesMap } from '@/components/icon/icon-component/types';
import styled from '@emotion/styled';
import { useToggle } from '@treenity/ui-kit/hooks';
import { Popover } from 'antd';
import React, { FC, useCallback } from 'react';
import AreaEditSettings from './AreaEditSettings';
import GridEditSettings from './GridEditSettings';
import type { IGridSettingsArea, IGridSettingsValueCR } from './types';

interface GridSettingsItemProps {
  icon: IconNamesMap;
  value: IGridSettingsValueCR | IGridSettingsArea;
  index: number;
  onDuplicate(): void;
  onRemove(): void;
  onChange(value: IGridSettingsValueCR | IGridSettingsArea): void;
}

export const areaLabel = (area: IGridSettingsArea, index: number) =>
  `Area ${index + 1}; Col ${area.columns_start}/${area.columns_end}; Row ${area.rows_start}/${area.rows_end}`;

const GridSettingsItem: FC<GridSettingsItemProps> = ({
  icon,
  value,
  index,
  onDuplicate,
  onRemove,
  onChange,
}) => {
  const [showEditPopover, toggleEditPopover] = useToggle();
  const getPopupContainer = useCallback(() => document.body, []);

  const getTitle = (): string => {
    if ('format' in value) {
      switch (value.format) {
        case 'fixed':
          return (value.size || '0px') as string;
        case 'auto':
          return 'Auto';
        case 'min-max':
          //@ts-ignore
          return `Min ${value.size?.min || value.size || '0px'}; Max ${value.size?.max || value.size || '0px'}`;
        default:
          return '';
      }
    } else {
      return areaLabel(value, index);
    }
  };

  return (
    <Popover
      getPopupContainer={getPopupContainer}
      open={showEditPopover}
      content={
        'format' in value ? (
          <GridEditSettings
            onCancel={() => toggleEditPopover(false)}
            value={value}
            onChange={onChange}
          />
        ) : (
          <AreaEditSettings
            onCancel={() => toggleEditPopover(false)}
            value={value}
            onChange={onChange}
          />
        )
      }
    >
      <Root
        onClick={e => {
          toggleEditPopover();
          e.stopPropagation();
        }}
      >
        <Icon name={icon} />
        <Title>{getTitle()}</Title>
        <Button
          onClick={e => {
            onDuplicate();
            e.stopPropagation();
          }}
          size="x-small"
          type="text"
          icon={<Icon name="duplicate_outlined" />}
        />
        <Button
          onClick={e => {
            onRemove();
            e.stopPropagation();
          }}
          size="x-small"
          type="text"
          icon={<Icon name="trash_outlined" color="danger" />}
        />
      </Root>
    </Popover>
  );
};

const Root = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 0 6px;
  height: 20px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);

  &:hover {
    background: ${p => p.theme.Button.secFilledHoverBg};
  }

  && > span > i {
    font-size: 12px;
    color: ${p => p.theme.colorPrimary};
  }
`;

const Title = styled.p`
  margin: 0;
  flex: 1;
  color: ${p => p.theme.colorText};
  font-size: 10px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.2px;
`;

export default GridSettingsItem;
