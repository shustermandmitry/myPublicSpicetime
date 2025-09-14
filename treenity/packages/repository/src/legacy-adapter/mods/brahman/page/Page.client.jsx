import { addComponent } from '../../../tree';
import addToolbarMenu from '../../../tree/ui/create-meta/addToolbarMenu';
import { MetaEdit } from '../../types/meta/MetaEdit';
import { BotPage } from './Page.meta';
import PageLayout from './PageLayout';

addComponent(MetaEdit, BotPage, 'react');
addComponent(MetaEdit, BotPage, 'react edit');
addComponent(PageLayout, BotPage, 'layout');

addToolbarMenu(BotPage, 'telegram', 'Page');
