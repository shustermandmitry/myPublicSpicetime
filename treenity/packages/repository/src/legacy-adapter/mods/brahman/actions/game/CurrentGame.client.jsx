import { last } from '@s-libs/micro-dash';
import { Cascader, Form } from 'antd';
import React, { useMemo } from 'react';
import { addComponent } from '../../../../tree';
import withTracker from '../../../../ui/utils/withTracker';
import { addActionMenu } from '../addActionMenu';
import { CurrentGame } from './CurrentGame.meta';
import { TelegramActionGame } from './TelegramActionGame.meta';

export function GameComponent({ value, onChange, pages, options }) {
  const val = useMemo(() => buildValue(pages, value.menuId), [pages, value.menuId]);

  const change = val => {
    onChange({ menuId: last(val) });
  };

  return (
    <Form.Item label="Choose game">
      <Cascader options={options} value={val} onChange={change} allowClear={false} />
    </Form.Item>
  );
}

const buildOptions = node => {
  const pages = node._m
    .filter(m => m instanceof TelegramActionGame)
    .map(({ _id, message }) => {
      return {
        value: _id,
        label: message,
      };
    });

  const children = node.findChildren();

  return {
    value: node._id,
    label: node.name,
    disabled: children.length + pages.length === 0,
    children: pages.concat(children.map(buildOptions)),
  };
};

const buildValue = (pages, val) => {
  if (!val) return undefined;
  const value = [val];
  const tree = pages.findAllChildren();

  const node = pages.findChildDeep({ '_m._id': val });

  const build = v => {
    const node = tree.find(n => n._id === v);
    if (node) {
      value.unshift(v);
      if (tree.find(n => n._id === node._p)) {
        build(node._p);
      }
    }
  };
  build(node._id);
  return value;
};

export const CurrentGameComponent = withTracker((props, onData) => {
  const { node } = props;
  const pages = node.findAllParents({ '_m._t': 'tg.telegram' })[0].findChild({ name: 'pages' });

  return onData({
    options: pages.findChildren().map(buildOptions),
    pages,
  });
})(GameComponent);

addComponent(CurrentGameComponent, CurrentGame, 'react edit');
addActionMenu(CurrentGame, 'game', 'CurrentGame');
