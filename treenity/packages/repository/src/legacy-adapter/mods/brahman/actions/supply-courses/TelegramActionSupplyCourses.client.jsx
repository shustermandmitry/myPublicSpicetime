import { Col, Row } from 'antd';
import React from 'react';
import { addComponent } from '../../../../tree';
import { RenderMeta } from '../../../../tree/ui/render-meta';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { ActionDropdown } from '../menu/addButtonActionMenu';
import { TelegramActionSupplyCourses } from './TelegramActionSupplyCourses.meta';

const TelegramActionSupplyCoursesComponent = ({ value, onChange, node }) => {
  const changeAction = name => action => {
    value.set({ [`${name}`]: action });
    onChange(value);
  };
  const changeUser = changeAction('actionUserEnd');
  const changeOperator = changeAction('actionOperatorEnd');

  return (
    <>
      <MetaEdit value={value} onChange={onChange} />
      <Row style={{ width: '100%', marginTop: 25 }}>
        <Col span={12}>
          EndingForUser
          <ActionDropdown node={node} onChange={changeUser} />
          {value.actionUserEnd && (
            <RenderMeta
              node={node}
              value={value.actionUserEnd}
              onChange={changeUser}
              context="react edit"
            />
          )}
        </Col>
        <Col span={12}>
          EndingForOperator
          <ActionDropdown node={node} onChange={changeOperator} />
          {value.actionOperatorEnd && (
            <RenderMeta
              node={node}
              value={value.actionOperatorEnd}
              onChange={changeOperator}
              context="react edit"
            />
          )}
        </Col>
      </Row>
    </>
  );
};

addComponent(TelegramActionSupplyCoursesComponent, TelegramActionSupplyCourses, 'react edit');
addActionMenu(TelegramActionSupplyCourses, 'courses', 'Course Order');
