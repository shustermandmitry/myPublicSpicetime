import { groupBy } from '@s-libs/micro-dash';
import { Card } from 'antd';
import React, { useMemo } from 'react';

import { RenderMeta } from '../../../tree/ui/render-meta';
import { useArrayCallback } from '../../../ui/utils/useArrayCallback';
import { DndList } from '../../types/dnd-list/DndListLayout.client';
import { TelegramAction } from '../actions/TelegramAction.meta';
import './PageLayout.css';

const PageLayout = ({ node, value }) => {
  const actions = useMemo(
    () =>
      groupBy(
        node._m.filter(m => m._t !== 'tg.page'),
        m => m instanceof TelegramAction,
      ),
    [node.updatedAt],
  );

  const changeMeta = useArrayCallback((key, action, change) => {
    // make it plain object first
    action.set(Object.assign({}, change));
    action.node().save();
  });

  const updatePositions = positions => {
    changeMeta('page', value)({ positions });
  };

  return (
    <div className="tg-page-layout">
      <Card>
        <RenderMeta node={node} meta={value} context="react edit" />
      </Card>
      <Card className="m-t-16">
        <div className="m-b-8">
          <RenderMeta value={value} node={node} context="addmeta layout" onChange={null} />
        </div>
        <DndList
          value={value}
          node={node}
          defaultPositions={value.positions}
          dataSource={actions.true || []}
          onChange={updatePositions}
          handle={
            action => <div className="card-meta-name">{action._t}</div>
            //
            //   <div
            //     style={{ float: 'left', marginLeft: -18, /*position: 'absolute', top: 0, left: 4*/ }}
            //   >
            //     <DragOutlined />
            //   </div>
          }
          renderItem={action => (
            <Card>
              <RenderMeta
                key={action._id}
                value={action}
                node={node}
                context="react edit"
                onChange={change => {
                  changeMeta(action._id, action)(change);
                  console.log(change);
                }}
              />
            </Card>
          )}
        />
      </Card>
      {actions.false && actions.false.length !== 0 && (
        <Card>
          {actions.false.map(meta => (
            <RenderMeta
              key={meta._id}
              value={meta}
              node={node}
              context="react"
              onChange={change => {
                changeMeta(meta._id, meta)(change);
                console.log(change);
              }}
            />
          ))}
        </Card>
      )}
    </div>
  );
};

export default PageLayout;
