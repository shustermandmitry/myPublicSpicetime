import React from 'react';

import { CreateMetaMenu } from '../../../../tree/ui/create-meta/CreateMetaMenu';
import DropdownMenu from '../../../../tree/ui/create-meta/DropdownMenu';

const actionMetas = new CreateMetaMenu();
actionMetas.add(null, '', 'None');

export const ActionDropdown = props => (
  <DropdownMenu
    simpleCreate
    size="small"
    metas={actionMetas.metaData}
    {...props}
    title="Add action"
  />
);

export const addButtonActionMenu = (type, path, label, onCreated) =>
  actionMetas.add(type, path, label, onCreated);
