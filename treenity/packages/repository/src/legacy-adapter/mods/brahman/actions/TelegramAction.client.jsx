import React from 'react';
import { addComponent } from '../../../tree';
import { RenderMeta } from '../../../tree/ui/render-meta';
import { ActionDropdown } from './menu/addButtonActionMenu';
import { TelegramAction } from './TelegramAction.meta';

const TelegramActionEdit = ({ extra: { node, simpleCreate = true }, value, onChange }) => {
  return (
    <>
      <div className="m-b-8">
        <ActionDropdown
          node={node}
          currentValue={value?._t}
          onChange={onChange}
          simpleCreate={simpleCreate}
        />
      </div>
      {value && <RenderMeta node={node} value={value} onChange={onChange} context="react edit" />}
    </>
  );
};

addComponent(TelegramActionEdit, TelegramAction, 'react edit');
addComponent(TelegramActionEdit, TelegramAction, 'react form');
