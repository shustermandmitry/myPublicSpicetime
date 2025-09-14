import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { TelegramActionResetSession } from './ResetSession.meta';

addComponent(MetaEdit, TelegramActionResetSession, 'react edit');
addActionMenu(TelegramActionResetSession, 'utils', 'Reset Session');
