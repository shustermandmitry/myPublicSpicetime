import React from 'react';
import { addComponent } from '../../../../tree';
import { RenderMeta } from '../../../../tree/ui/render-meta';
import { MetaEdit } from '../../../types/meta/MetaEdit';

import { addActionMenu } from '../addActionMenu';
import { ActionDropdown } from '../menu/addButtonActionMenu';
import { TelegramActionOnError } from './TelegramActionOnError.meta';

const OnErrorEdit = ({ value, onChange, node }) => {
  const changeAction = action => {
    value.set({ action });
    onChange(value);
  };
  return (
    <>
      <MetaEdit value={value} onChange={onChange} fields={['error']} />
      <ActionDropdown node={node} onChange={changeAction} simpleCreate={false} />
      {value.action && (
        <RenderMeta node={node} value={value.action} onChange={changeAction} context="react edit" />
      )}
    </>
  );
};

addComponent(OnErrorEdit, TelegramActionOnError, 'react edit');
addActionMenu(TelegramActionOnError, 'utils', 'on error');
