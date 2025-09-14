import React from 'react';

import { addComponent } from '../../../tree';
import { CreateMetaMenu } from '../../../tree/ui/create-meta/CreateMetaMenu';
import DropdownMenu from '../../../tree/ui/create-meta/DropdownMenu';
import { BotPage } from '../page/Page.meta';

const actionMetas = new CreateMetaMenu();

addComponent(
  props => (
    <DropdownMenu
      {...props}
      title="Add action (Cmd+.)"
      metas={actionMetas.metaData}
      hotkey="cmd+.,ctrl+."
      style={{ width: 400 }}
    />
  ),
  BotPage,
  'addmeta layout',
);

export const addActionMenu = (...args) => actionMetas.add(...args);
