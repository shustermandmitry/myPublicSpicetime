import { Card } from 'antd';
import React from 'react';

import { RenderMeta } from '../../../tree/ui/render-meta';
import { useArrayCallback } from '../../../ui/utils/useArrayCallback';
import { DndList } from '../../types/dnd-list/DndListLayout.client';
import './PageLayout.css';

const ActionsList = ({ node, value, onChange }) => {
  const changeMeta = useArrayCallback((key, action, change) => {
    // make it plain object first
    action.set(Object.assign({}, change));
    action.node().save();
  });

  const updatePositions = positions => {
    changeMeta('page', value)({ positions });
  };

  return (
    <>
      <div className="m-b-8">
        <RenderMeta value={value} node={node} context="addmeta layout" onChange={null} />
      </div>
      <DndList
        node={node}
        defaultPositions={value.positions}
        dataSource={value.actions}
        onChange={updatePositions}
        handle={action => <div className="card-meta-name">{action._t}</div>}
        renderItem={action => (
          <Card>
            <RenderMeta
              key={action._id}
              value={action}
              node={node}
              context="react edit"
              onChange={changeMeta(action._id, action)}
            />
          </Card>
        )}
      />
    </>
  );
};

export default ActionsList;
