import { addComponent } from '../../../tree';
import addToolbarMenu from '../../../tree/ui/create-meta/addToolbarMenu';
import MetaEdit from '../../types/meta/MetaEdit';
import MetaShow from '../../types/meta/MetaShow';
import { TelegramBot } from './TelegramBot.meta';

addComponent(MetaShow, TelegramBot, 'react');
addComponent(MetaEdit, TelegramBot, 'react edit');

addToolbarMenu(TelegramBot, 'telegram', 'TelegramBot');
