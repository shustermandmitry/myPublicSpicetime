import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { TelegramActionSendCoins } from './TelegramActionSendCoins.meta';

addComponent(MetaEdit, TelegramActionSendCoins, 'react edit');
addActionMenu(TelegramActionSendCoins, 'payment', 'Send Coins');
