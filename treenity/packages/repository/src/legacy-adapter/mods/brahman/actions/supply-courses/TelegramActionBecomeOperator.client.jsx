import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { TelegramActionBecomeOperator } from './TelegramActionBecomeOperator.meta';

addComponent(MetaEdit, TelegramActionBecomeOperator, 'react edit');
addActionMenu(TelegramActionBecomeOperator, 'courses', 'Become Operator');
