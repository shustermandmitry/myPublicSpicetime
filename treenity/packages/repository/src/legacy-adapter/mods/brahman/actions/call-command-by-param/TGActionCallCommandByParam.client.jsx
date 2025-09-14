import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';

import { TelegramActionCallCommandByParam } from './TGActionCallCommandByParam.meta';

addComponent(MetaEdit, TelegramActionCallCommandByParam, 'react edit');
addActionMenu(TelegramActionCallCommandByParam, 'utils', 'Call command by param');
