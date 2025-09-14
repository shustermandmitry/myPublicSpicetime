import { addComponent } from '../../../../tree';
import addToolbarMenu from '../../../../tree/ui/create-meta/addToolbarMenu';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { TelegramCoursesOperator } from './TelegramCoursesOperator.meta';

addComponent(MetaEdit, TelegramCoursesOperator, 'react edit');
addComponent(MetaEdit, TelegramCoursesOperator, 'react');

addToolbarMenu(TelegramCoursesOperator, 'telegram', 'Operator');
