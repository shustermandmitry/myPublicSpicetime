import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { TelegramActionResetHistory } from './ResetSession.meta';

addComponent(MetaEdit, TelegramActionResetHistory, 'react edit');
addActionMenu(TelegramActionResetHistory, 'utils', 'Reset History');
