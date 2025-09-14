import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { TelegramActionGetParams } from './TelegramActionGetRates.meta';

addComponent(MetaEdit, TelegramActionGetParams, 'react edit');
addActionMenu(TelegramActionGetParams, 'crypto', 'Get Rates');
