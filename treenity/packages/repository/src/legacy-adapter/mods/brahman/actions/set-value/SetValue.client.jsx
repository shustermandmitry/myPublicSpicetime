import { addComponent } from '../../../../tree';
import CodeEditor from '../../../code-editor/CodeEditor';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { addActionMenu } from '../addActionMenu';
import { addButtonActionMenu } from '../menu/addButtonActionMenu';
import { TelegramActionEval, TelegramActionSetValue } from './SetValue.meta';

addComponent(MetaEdit, TelegramActionSetValue, 'react edit', {
  fields: {
    value: {
      form: {
        type: 'textarea',
      },
    },
  },
});
addActionMenu(TelegramActionSetValue, 'utils', 'Set Value');
addButtonActionMenu(TelegramActionSetValue, '', 'Set Value');

addComponent(MetaEdit, TelegramActionEval, 'react edit', {
  props: {
    fields: {
      value: {
        component: CodeEditor,
      },
    },
  },
});
addActionMenu(TelegramActionEval, 'utils', 'Eval');
addButtonActionMenu(TelegramActionEval, '', 'Eval');
