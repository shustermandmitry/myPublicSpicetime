import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { TelegramActionGetWallet } from './TelegramActionGetWallet.meta';

addComponent(MetaEdit, TelegramActionGetWallet, 'react edit');
addActionMenu(TelegramActionGetWallet, 'payment', 'Get Wallet Info');
