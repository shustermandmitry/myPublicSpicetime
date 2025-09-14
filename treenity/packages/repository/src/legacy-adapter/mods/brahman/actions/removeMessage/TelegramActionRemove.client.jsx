import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { TelegramActionRemove } from './TelegramActionRemove.meta';

addComponent(MetaEdit, TelegramActionRemove, 'react edit');
addActionMenu(TelegramActionRemove, 'utils', 'Remove');
