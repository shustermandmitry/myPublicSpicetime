import { last } from '@s-libs/micro-dash';
import { Cascader } from 'antd';
import React, { useMemo } from 'react';

import { addComponent } from '../../../../../tree';
import withTracker from '../../../../../ui/utils/withTracker';
import { registerEnum } from '../../../../form/enum-form';
import MetaEdit from '../../../../types/meta/MetaEdit';

import { addActionMenu } from '../../addActionMenu';
import { TelegramFile } from '../../file/TelegramFile.meta';
import { SynhesizeAudioVideo, VoiceGender, VoiceVendor } from './SynhesizeAudioVideo.meta';

export function FileComponent({ value, onChange, files, options }) {
  const val = useMemo(() => buildValue(files, value), [files, value]);
  const change = val => {
    onChange(last(val));
  };

  return (
    <Cascader
      placeholder="Please select"
      value={val}
      options={options}
      onChange={change}
      allowClear={false}
      showSearch
    />
  );
}

const getName = node => {
  const file = node.getMeta(TelegramFile);
  return file && `${file.caption || (file.file ? file.file.name : 'unknown')}-${node.name}`;
};

const q = { '_m.file.meta.type': { $in: ['video', 'video_note', 'document'] } };

const buildValue = (files, val) => {
  if (!val) {
    return undefined;
  }
  const tree = files.findAllChildren(q);

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
    const { node } = props.extra;

    const files = node.findAllParents({ '_m._t': 'tg.telegram' })[0].findChild({ name: 'files' });
    if (!files) {
      return;
    }

    return onData({
      options: files.findChildren(q).map(buildOptions).filter(Boolean),
      files,
    });
  },
  {
    errorLoader: () => {},
  },
)(FileComponent);

registerEnum(VoiceGender);
registerEnum(VoiceVendor);

addComponent(CurrentFileComponent, 'fileId', 'react form');

addComponent(MetaEdit, SynhesizeAudioVideo, 'react edit');
addComponent(MetaEdit, SynhesizeAudioVideo, 'react');

addActionMenu(SynhesizeAudioVideo, 'voice', 'Synhesize video note');
