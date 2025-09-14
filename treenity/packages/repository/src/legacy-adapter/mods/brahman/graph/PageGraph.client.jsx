/**
 * Created by kriz on 11.05.2020.
 */

import { addComponent } from '../../../tree';
import addToolbarMenu from '../../../tree/ui/create-meta/addToolbarMenu';

import { Lazy } from '../../../ui/utils/Lazy';
import { MetaEdit } from '../../types/meta/MetaEdit';
import { PageGraphMeta } from './PageGraph';

const PageGraph = Lazy(() => import('./PageGraph.dynamic'));

addToolbarMenu(PageGraphMeta, 'telegram', 'Page Graph');
addComponent(PageGraph, PageGraphMeta, 'react');
addComponent(MetaEdit, PageGraphMeta, 'react edit');
