import { addComponent } from '../../../../tree';
import MetaEdit from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { addButtonActionMenu } from '../menu/addButtonActionMenu';
import TgActionSetTimer, { TgActionCancelTimer } from './TgActionSetTimer.meta';

addComponent(MetaEdit, TgActionSetTimer, 'react edit');
addButtonActionMenu(TgActionSetTimer, '', 'Set Timer');
addActionMenu(TgActionSetTimer, 'timers', 'Set Timer');

addComponent(MetaEdit, TgActionCancelTimer, 'react edit');
addActionMenu(TgActionCancelTimer, 'timers', 'Cancel Timer');
