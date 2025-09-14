import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';

import { addActionMenu } from '../addActionMenu';
import { TelegramActionForward } from './TelegramActionForward.meta';

addComponent(MetaEdit, TelegramActionForward, 'react edit');
addActionMenu(TelegramActionForward, 'message', 'Forward');
