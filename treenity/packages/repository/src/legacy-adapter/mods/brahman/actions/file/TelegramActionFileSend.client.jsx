import { last } from '@s-libs/micro-dash';
import { Cascader, Form } from 'antd';
import React, { useMemo } from 'react';

import { addComponent } from '../../../../tree';
import { RenderMeta } from '../../../../tree/ui/render-meta';
import withTracker from '../../../../ui/utils/withTracker';
import { registerEnum } from '../../../form/enum-form';
import MetaEdit from '../../../types/meta/MetaEdit';

import { addActionMenu } from '../addActionMenu';
import { addButtonActionMenu } from '../menu/addButtonActionMenu';
import { TelegramSubTypes } from './file-types';

import { TelegramActionFileSend } from './TelegramActionFileSend.meta';
import { TelegramFile } from './TelegramFile.meta';

export function FileComponent({ value, files, options, onChange }) {
  const val = useMemo(() => buildValue(files, value.fileId), [files, value.fileId]);
  const change = val => {
    onChange({ fileId: last(val) });
  };

  return (
    <>
      <Form.Item label="Choose file">
        <Cascader
          placeholder="Please select"
          value={val}
          options={options}
          onChange={change}
          allowClear={false}
          showSearch
        />
      </Form.Item>
      <Form.Item label="Send as type">
        <RenderMeta
          type={TelegramSubTypes}
          value={value.asType}
          onChange={asType => onChange({ asType })}
          context="react form"
        />
      </Form.Item>
    </>
  );
}

const getName = node => {
  const file = node.getMeta(TelegramFile);
  return file && `${file.caption || (file.file ? file.file.name : 'unknown')}-${node.name}`;
};

const buildValue = (files, val) => {
  if (!val) {
    return undefined;
  }
  const tree = files.findAllChildren();

  const node = files.findChildDeep({ name: val });

  const value = [val];

  const build = v => {
    const node = tree.find(n => n._id === v);
    if (node) {
      value.unshift(v);
      if (tree.find(n => n.name === node._p)) {
        build(node._p);
      }
    }
  };
  if (node) build(node.name);
  return value;
};

const buildOptions = node => {
  const label = getName(node);

  return (
    label && {
      value: node.name,
      label,
    }
  );
};

export const CurrentFileComponent = withTracker(
  (props, onData) => {
    const { node } = props;

    const files = node.findAllParents({ '_m._t': 'tg.telegram' })[0].findChild({ name: 'files' });
    if (!files) return;

    return onData({
      options: files.findChildren().map(buildOptions).filter(Boolean),
      files,
    });
  },
  {
    errorLoader: () => {},
  },
)(FileComponent);

addComponent(CurrentFileComponent, TelegramActionFileSend, 'react edit');

addComponent(MetaEdit, TelegramActionFileSend, 'react');
// addComponent(MetaEdit, TelegramActionFileSend, 'react edit');
registerEnum(TelegramSubTypes);

addActionMenu(TelegramActionFileSend, 'file', 'Send');
addButtonActionMenu(TelegramActionFileSend, 'file', 'Send');
