import { addComponent } from '../../../../tree';
import { registerEnum } from '../../../form/enum-form';
import { TelegramActionMenu, TelegramMenuRow } from './TelegramActionMenu.meta';
import {
  TelegramActionMenuConstructor,
  TelegramActionMenuRows,
} from './TelegramActionMenuConstructor';

registerEnum(TelegramActionMenu.Type);
addComponent(TelegramActionMenuConstructor, TelegramActionMenu, 'react form');
addComponent(TelegramActionMenuRows, [TelegramMenuRow], 'react form');
