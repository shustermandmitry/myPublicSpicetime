/*
 * Copyright (c) 2024. Treenity Inc.
 */

import ButtonWithIcon from '@/components/ButtonWithIcon';
import Icon from '@/components/icon';
import styled from '@emotion/styled';
import { FC, PropsWithChildren } from 'react';

interface WithResetWrapperProps {
  onReset(value: unknown): void;
  className?: string;
  disabled?: boolean;
}

const WrapperWithReset: FC<PropsWithChildren<WithResetWrapperProps>> = ({
  className,
  onReset,
  disabled,
  children,
}) => {
  return (
    <Root className={className}>
      {children}
      {!disabled && (
        <CloseButton type="text" onClick={onReset}>
          <Icon name="close_outlined" />
        </CloseButton>
      )}
    </Root>
  );
};

const Root = styled.div`
  position: relative;
  line-height: 1px;

  .ant-input-affix-wrapper {
    padding-right: 17px;
  }
`;

const CloseButton = styled(ButtonWithIcon)`
  position: absolute;
  top: calc(50% - 10px);
  right: 0;
  width: 20px;
  height: 20px;
  padding: 2px;
  border: 0;
  color: ${p => p.theme.colorText};

  &:hover {
    color: ${p => p.theme.colorPrimary} !important;
  }

  && {
    i {
      font-size: 12px;
    }
  }
`;

export default WrapperWithReset;
