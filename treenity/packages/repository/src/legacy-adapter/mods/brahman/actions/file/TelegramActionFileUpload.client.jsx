import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { addButtonActionMenu } from '../menu/addButtonActionMenu';
import { TelegramActionFileUpload } from './TelegramActionFileUpload.meta';

addComponent(MetaEdit, TelegramActionFileUpload, 'react edit');

addActionMenu(TelegramActionFileUpload, 'file', 'Upload');
addButtonActionMenu(TelegramActionFileUpload, 'file', 'Upload');
