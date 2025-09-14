import { Button } from 'antd';
import React from 'react';
import { addComponent } from '../../../../tree';
import { addActionMenu } from '../addActionMenu';
import { addButtonActionMenu } from '../menu/addButtonActionMenu';
import { MenuEdit } from '../MenuEdit';
import { TelegramActionBack, TelegramActionDelete } from './TelegramActionBack.meta';

const ActionBack = ({ onChange, autosave }) =>
  autosave ? <div>tg.back</div> : <Button onClick={() => onChange({}, true)}>Save "Back"</Button>;

addComponent(ActionBack, TelegramActionBack, 'react edit');

addButtonActionMenu(TelegramActionBack, '', 'Back');
addActionMenu(TelegramActionBack, 'utils', 'Back');

const ActionDelete = ({ onChange, autosave }) =>
  autosave ? (
    <div>tg.delete</div>
  ) : (
    <Button onClick={() => onChange({}, true)}>Save "Delete message"</Button>
  );

addComponent(MenuEdit, TelegramActionDelete, 'react edit');

addButtonActionMenu(TelegramActionDelete, '', 'Delete message');
addActionMenu(TelegramActionDelete, 'utils', 'Delete messate');
