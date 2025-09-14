import { addComponent } from '../../../../tree';
import addToolbarMenu from '../../../../tree/ui/create-meta/addToolbarMenu';
import MetaEdit from '../../../types/meta/MetaEdit';
import TimersServiceMeta, { Timer } from './timers.service.meta';

addComponent(MetaEdit, Timer, 'react');
addComponent(MetaEdit, Timer, 'react edit');

addComponent(MetaEdit, TimersServiceMeta, 'react');
addComponent(MetaEdit, TimersServiceMeta, 'react edit');
addToolbarMenu(TimersServiceMeta, 'services', 'Timers Service');
