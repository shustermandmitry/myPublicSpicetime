import { ButtonWithIcon } from '@/components';
import Icon from '@/components/icon';
import Input from '@/components/input';
import styled from '@emotion/styled';
import { useToggle } from '@treenity/ui-kit/hooks';
import { Popover } from 'antd';
import React, { FC, useState } from 'react';

interface EditPopoverProps {
  onChange(value: string): void;
  initialValues: string;
  title: string;
}

const EditPopover: FC<EditPopoverProps> = ({ onChange, initialValues, title }) => {
  const [value, setValue] = useState(initialValues);
  const [visible, setVisible] = useToggle();

  const onOk = () => {
    onChange(value);
    setVisible(false);
  };

  const content = (
    <PopoverContent>
      <p>{title}</p>
      <FlexContainer>
        <Input autoFocus size="x-small" value={value} onChange={e => setValue(e.target.value)} />
        <ButtonWithIcon
          size="x-small"
          type="primary"
          icon={<Icon name="check_outlined" />}
          onClick={onOk}
        />
        <ButtonWithIcon
          size="x-small"
          danger
          type="primary"
          icon={<Icon name="x-axis_outlined" />}
          onClick={() => setVisible(false)}
        />
      </FlexContainer>
    </PopoverContent>
  );
  return (
    <Popover content={content} placement="bottom" open={visible}>
      <div onClick={() => setVisible(true)}>
        <Icon name="rename_outlined" className={visible ? 'open' : ''} />
      </div>
    </Popover>
  );
};

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const PopoverContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  button {
    min-width: 20px;
  }

  & > p {
    margin: 0;
    width: 72px;
    min-width: 72px;
    font-size: 10px;
    font-weight: 800;
    line-height: 140%;
    letter-spacing: -0.2px;
  }
`;

export default EditPopover;
