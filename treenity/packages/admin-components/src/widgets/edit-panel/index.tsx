/*
 * Copyright (c) 2024. Treenity Inc.
 */

import EmptyEditPanel from '@/components/EmptyEditPanel';
import styled from '@emotion/styled';
import { Form } from 'antd';
import { FC, useState } from 'react';
import Elements from './elements';
import HeaderEditPanel, { EditPanelTabType } from './Header';
import Layers from './layers';
import Settings from './settings';
import type { ISettingsValues } from './settings/types';
import Styles from './Styles';

const EditPanel: FC = () => {
  const [tab, setTab] = useState<EditPanelTabType>('elements');

  const onFinish = (values: ISettingsValues) =>
    console.log('[31m%s\x1b[0m', 'CHANGE SETTINGS', values);

  return (
    <Root>
      <HeaderEditPanel onChangeTab={setTab} value={tab} />
      {tab === 'elements' ? (
        <Elements />
      ) : tab === 'style' ? (
        <Styles />
      ) : tab === 'layers' ? (
        <Layers />
      ) : tab === 'settings' ? (
        <Form<ISettingsValues> onFinish={onFinish}>
          <Form.Item name="settings">
            <Settings />
          </Form.Item>
        </Form>
      ) : (
        <EmptyEditPanel />
      )}
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${p => p.theme.colorBgPanel};
  width: 320px;
  padding-bottom: 12px;
  gap: 12px;
`;

export default EditPanel;
export { Elements, HeaderEditPanel, Layers };
