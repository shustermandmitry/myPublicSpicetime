import { addComponent } from '../../../../tree';
import MetaEdit from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { TelegramActionGame } from './TelegramActionGame.meta';

// addComponent(TelegramActionMenuRows, [TelegramMenuRow], 'react form');
addComponent(MetaEdit, TelegramActionGame, 'react edit');
addActionMenu(TelegramActionGame, 'game', 'Game');
