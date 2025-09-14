import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';

import { TelegramActionSetTelegramUser } from './TGActionSetTelegramUser.meta';

addComponent(MetaEdit, TelegramActionSetTelegramUser, 'react edit');
addActionMenu(TelegramActionSetTelegramUser, 'utils', 'Set current Tid');
