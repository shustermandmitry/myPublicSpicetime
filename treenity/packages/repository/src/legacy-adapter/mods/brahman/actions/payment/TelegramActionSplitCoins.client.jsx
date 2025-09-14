import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { TelegramActionSplitCoins } from './TelegramActionSplitCoins.meta';

addComponent(MetaEdit, TelegramActionSplitCoins, 'react edit');
addActionMenu(TelegramActionSplitCoins, 'payment', 'Split Coins');
