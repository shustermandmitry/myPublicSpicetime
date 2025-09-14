import { Col, Row } from 'antd';
import React from 'react';
import { addComponent } from '../../../../tree';

import { RenderMeta } from '../../../../tree/ui/render-meta';
import TagField from '../../../../ui/components/TagEditorNew';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { ActionDropdown, addButtonActionMenu } from '../menu/addButtonActionMenu';
import { TelegramActionBroadcast } from './TelegramActionBroadcast.meta';

const TelegramActionBroadcastComponent = ({ value, onChange, node }) => {
  const changeAction = action => {
    value.set({ action });
    onChange(value);
  };

  return (
    <>
      <MetaEdit value={value} onChange={onChange} />
      <Row style={{ width: '100%', marginTop: 25 }}>
        <Col span={12}>
          <span style={{ marginRight: 10 }}>Action</span>
          <ActionDropdown node={node} onChange={changeAction} />
          {value.action && (
            <RenderMeta
              node={node}
              value={value.action}
              onChange={changeAction}
              context="react edit"
            />
          )}
        </Col>
      </Row>
    </>
  );
};

addComponent(MetaEdit, TelegramActionBroadcast, 'react edit', {
  props: {
    fields: {
      userTags: {
        component: TagField,
      },
      action: true,
    },
  },
});
// addComponent(TelegramActionBroadcastComponent, TelegramActionBroadcast, 'react edit');
addButtonActionMenu(TelegramActionBroadcast, '', 'Broadcast');
addActionMenu(TelegramActionBroadcast, '', 'Broadcast');
