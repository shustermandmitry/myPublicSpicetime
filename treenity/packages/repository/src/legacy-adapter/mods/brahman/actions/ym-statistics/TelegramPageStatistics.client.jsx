import { addComponent } from '../../../../tree';
import addToolbarMenu from '../../../../tree/ui/create-meta/addToolbarMenu';
import MetaEdit from '../../../types/meta/MetaEdit';
import { TelegramPageStatistics } from './TelegramPageStatistics.meta';

addComponent(MetaEdit, TelegramPageStatistics, 'react');
addComponent(MetaEdit, TelegramPageStatistics, 'react edit');
addToolbarMenu(TelegramPageStatistics, 'telegram', 'Yandex Metrika');
