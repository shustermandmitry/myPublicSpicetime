/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Segmented from '@/components/Segmented';
import styled from '@emotion/styled';
import { FC } from 'react';

export type EditPanelTabType = 'elements' | 'style' | 'layers' | 'settings';

interface IOptionsEditPanelTabsList {
  value: EditPanelTabType | string;
  label: string;
}

interface HeaderEditPanelProps {
  value: EditPanelTabType | string;
  onChangeTab(tab: EditPanelTabType): void;
  tabs?: IOptionsEditPanelTabsList[];
}

const optionsEditPanelTabsList: IOptionsEditPanelTabsList[] = [
  {
    value: 'elements',
    label: 'Elements',
  },
  {
    value: 'style',
    label: 'Style',
  },
  {
    value: 'layers',
    label: 'Layers',
  },
  {
    value: 'settings',
    label: 'Settings',
  },
];

const HeaderEditPanel: FC<HeaderEditPanelProps> = ({
  onChangeTab,
  value,
  tabs = optionsEditPanelTabsList,
}) => {
  return (
    <Root>
      {/*<Input prefix={<Icon name="search_outlined" />} size="small" placeholder="Search" />*/}
      <Segmented options={tabs} block onChange={onChangeTab} value={value} />
    </Root>
  );
};

const Root = styled.div`
  background: ${p => p.theme.colorBgPanel};
  z-index: 1;
  position: sticky;
  top: 0;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-bottom: 1px solid ${p => p.theme.gray400};
`;

export default HeaderEditPanel;
