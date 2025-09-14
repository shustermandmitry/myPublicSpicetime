import { Col, Form, Row } from 'antd';
import React from 'react';
import { addComponent } from '../../../../tree';
import { RenderMeta } from '../../../../tree/ui/render-meta';
import { produce } from '../../../../utils/immer';
import { MetaEdit } from '../../../types/meta/MetaEdit';

import { addActionMenu } from '../addActionMenu';
import { ActionDropdown } from '../menu/addButtonActionMenu';
import { TelegramActionIfElse } from './TelegramActionIfElse.meta';

const IfElseEdit = ({ value, onChange, node, autosave }) => {
  const changeAction = name => action => {
    onChange(
      produce(value, value => {
        value[`action${name}`] = action;
      }),
    );
  };

  const changeIf = changeAction('If');
  const changeElse = changeAction('Else');

  return (
    <>
      <MetaEdit
        value={value}
        onChange={onChange}
        fields={['condition', 'stopAfterAction']}
        autosave={autosave}
      />
      <Row style={{ width: '100%' }}>
        <Col span={12} className="p-r-8">
          <Form.Item label="If">
            <ActionDropdown
              node={node}
              currentValue={value.actionIf?._t}
              onChange={changeIf}
              simpleCreate={false}
            />
          </Form.Item>
          {value.actionIf && (
            <RenderMeta
              node={node}
              value={value.actionIf}
              onChange={changeIf}
              context="react edit"
            />
          )}
        </Col>
        <Col span={12} className="p-l-8">
          <Form.Item label="Else">
            <ActionDropdown
              node={node}
              currentValue={value?.actionElse?._t}
              onChange={changeElse}
              simpleCreate={false}
            />
          </Form.Item>
          {value.actionElse && (
            <RenderMeta
              node={node}
              value={value.actionElse}
              onChange={changeElse}
              context="react edit"
            />
          )}
        </Col>
      </Row>
    </>
  );
};

addComponent(IfElseEdit, TelegramActionIfElse, 'react edit');
addActionMenu(TelegramActionIfElse, 'utils', 'if - else');
