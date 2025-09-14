import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';

import { TelegramActionSelectLanguage } from './TGActionSelectLanguage.meta';

addComponent(MetaEdit, TelegramActionSelectLanguage, 'react');
addComponent(MetaEdit, TelegramActionSelectLanguage, 'react edit');
addActionMenu(TelegramActionSelectLanguage, 'utils', 'Select language');
