import styled from '@emotion/styled';
import { Icon } from '@treenity/admin-components/components';
import { useToggle } from '@treenity/ui-kit/hooks';
import { Dropdown, Input, MenuProps, Tooltip } from 'antd';
import React, { FC, KeyboardEvent, ReactNode, useCallback, useEffect, useState } from 'react';

interface ToolbarInputSelectProps {
  value?: number;
  onChange?: (value: number) => void;
  values: number[];
  prefixIcon?: ReactNode;
  min?: number;
  max?: number;
  tooltip?: string;
}

const ToolbarInputSelect: FC<ToolbarInputSelectProps> = ({
  value = 16,
  onChange,
  values,
  prefixIcon,
  tooltip,
  min = 1,
  max = 100,
}) => {
  const getPopupContainer = useCallback(() => document.body, []);
  const [inputValue, setInputValue] = useState(String(value));
  const [open, toggleOpen] = useToggle();

  // Transform values array to antd menu items format
  const menuItems: MenuProps['items'] = values.map(val => ({
    key: String(val),
    label: String(val),
  }));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const validateAndUpdateValue = (newValue: string) => {
    const numValue = Number(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange?.(numValue);
      setInputValue(String(numValue));
    } else {
      setInputValue(String(value));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '' || (/^\d*$/.test(newValue) && !isNaN(Number(newValue)))) {
      setInputValue(newValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      validateAndUpdateValue(inputValue);
      toggleOpen(false);
    }
  };

  const handleBlur = () => {
    validateAndUpdateValue(inputValue);
  };

  const handleMenuClick: MenuProps['onClick'] = e => {
    const numValue = Number(e.key);
    if (!isNaN(numValue)) {
      onChange?.(numValue);
      setInputValue(String(numValue));
    }
    toggleOpen(false);
  };

  return (
    <Root>
      <Tooltip
        trigger="hover"
        title={tooltip}
        placement="bottom"
        getPopupContainer={getPopupContainer}
        mouseEnterDelay={1}
      >
        <IconContainer>{prefixIcon}</IconContainer>
      </Tooltip>
      <Input
        type="number"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        value={inputValue}
        min={min}
        max={max}
      />
      <Dropdown
        placement="bottomRight"
        menu={{ items: menuItems, onClick: handleMenuClick }}
        trigger={['click']}
        onOpenChange={toggleOpen}
        open={open}
      >
        <Container>
          <Icon name="chevron-down_outlined" rotate={open ? 180 : 0} />
        </Container>
      </Dropdown>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  input {
    border: 0;
    font-size: 12px;
    min-width: 36px;
    max-width: 40px;
    padding-right: 0;
    padding-left: 8px;
    transition:
      background-color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
      border 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
      color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  //Firefox

  input[type='number'] {
    -moz-appearance: textfield;
  }
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: ${p => p.theme.colorPrimary};

  i {
    transition: color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }
`;

const Container = styled.div`
  cursor: pointer;
  color: ${p => p.theme.colorTextBase};
`;

export default ToolbarInputSelect;
