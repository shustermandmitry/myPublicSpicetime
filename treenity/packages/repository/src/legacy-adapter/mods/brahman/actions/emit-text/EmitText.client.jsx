import { addComponent } from '../../../../tree';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { EmitText } from './EmitText.meta';

addComponent(MetaEdit, EmitText, 'react edit');
addActionMenu(EmitText, 'emit', 'Text');
