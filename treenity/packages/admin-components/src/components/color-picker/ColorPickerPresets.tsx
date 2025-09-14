import Icon from '@/components/icon';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useStorage } from '@treenity/ui-kit/hooks';
import { omitProps } from '@treenity/ui-kit/utils';
import { Divider, Dropdown } from 'antd';
import React, { FC, useCallback, useMemo } from 'react';

interface ColorPickerPresetsProps {
  color?: string | null;
  onClick?(color: string): void;
}

const DEFAULT_LENGTH_COLORS = 11;

const ColorPickerPresets: FC<ColorPickerPresetsProps> = ({ color, onClick }) => {
  const [presets, setPresets] = useStorage<string[]>('colors-preset', []);

  const onSetColor = useCallback(
    (index: number) => {
      if (presets[index]) {
        onClick?.(presets[index]);
      }
    },
    [presets, onClick],
  );

  const onAddPreset = useCallback(() => {
    if (color && presets.length < DEFAULT_LENGTH_COLORS) {
      const newPresets = [color, ...presets];
      setPresets(newPresets);
    }
  }, [color, presets.length, setPresets]);

  const onRemove = useCallback(
    (index: number) => {
      const newPresets = [...presets.slice(0, index), ...presets.slice(index + 1)];
      setPresets(newPresets);
    },
    [setPresets, presets],
  );

  const dropdownItems = useMemo(
    () => ({
      key: 'remove',
      danger: true,
      label: (
        <DropdownItem>
          <DropdownIcon name="trash_outlined" />
          <span>Remove</span>
        </DropdownItem>
      ),
    }),
    [],
  );

  const colorItems = useMemo(() => {
    const items = [];
    const itemCount = Math.min(
      DEFAULT_LENGTH_COLORS,
      Math.max(DEFAULT_LENGTH_COLORS - 1, presets.length),
    );

    for (let i = 0; i < itemCount; i++) {
      items.push(
        <Dropdown
          key={i}
          menu={{
            items: [
              {
                ...dropdownItems,
                onClick: () => onRemove(i),
              },
            ],
          }}
          trigger={['contextMenu']}
          placement="topRight"
        >
          <ColorItem background={presets[i]} onClick={() => onSetColor(i)} />
        </Dropdown>,
      );
    }

    return items;
  }, [presets, onSetColor, onRemove, dropdownItems]);

  return (
    <div>
      <Divider type="horizontal" style={{ width: 'auto', margin: '8px 0' }} />
      <Colors>
        {presets.length < DEFAULT_LENGTH_COLORS && (
          <ColorItem onClick={onAddPreset}>
            <Icon name="plus_outlined" />
          </ColorItem>
        )}
        {colorItems}
      </Colors>
    </div>
  );
};

const DropdownIcon = styled(Icon)`
  & {
    font-size: 12px;
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ColorItem = styled('div', omitProps('background'))<{ background?: string }>`
  width: 19px;
  height: 19px;
  border: 1px solid ${p => p.theme.gray400};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  ${p =>
    p.background &&
    css`
      background: ${p.background};
    `};

  i {
    font-size: 12px;
    color: ${p => p.theme.colorPrimary};
    transition: color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }

  &:hover i {
    font-size: 12px;
    color: ${p => p.theme.colorPrimaryHover};
  }
`;

const Colors = styled.div`
  display: flex;
  gap: 2px;
`;

export default ColorPickerPresets;
