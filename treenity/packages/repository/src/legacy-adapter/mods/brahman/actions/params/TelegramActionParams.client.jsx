import { addComponent } from '../../../../tree';
import { ArrayEditor } from '../../../../ui/components/ArrayEditor';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { TelegramActionParams } from './TelegramActionParams.meta';

addComponent(MetaEdit, TelegramActionParams, 'react edit');
addComponent(ArrayEditor, [String], 'react form', {
  props: {
    valueType: String,
    context: 'react form',
  },
});
addActionMenu(TelegramActionParams, 'utils', 'Params Namer');
