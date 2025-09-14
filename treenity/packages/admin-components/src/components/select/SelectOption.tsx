/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Icon from '@/components/icon';
import type { IconNamesMap } from '@/components/icon/icon-component/types';
import { TextContent } from '@/components/typography';
import styled from '@emotion/styled';
import { FC, ReactNode } from 'react';

interface ISelectOption {
  label: ReactNode;
  icon: IconNamesMap;
}

const SelectOption: FC<ISelectOption> = ({ label, icon }) => (
  <Root>
    <IconStyled name={icon} />
    <TextContent size={10}>{label}</TextContent>
  </Root>
);

const IconStyled = styled(Icon)`
  i {
    font-size: 12px !important;
  }
`;

const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export default SelectOption;
