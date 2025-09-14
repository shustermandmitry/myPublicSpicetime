import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { TelegramActionGetValue } from './GetValue.meta';

addComponent(MetaEdit, TelegramActionGetValue, 'react edit');
addActionMenu(TelegramActionGetValue, 'utils', 'Get Value');
