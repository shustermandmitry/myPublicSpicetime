import { addComponent } from '../../../../tree';
import { registerEnum } from '../../../form/enum-form';

import { addActionMenu } from '../addActionMenu';
import { MenuEdit } from '../MenuEdit';
import TString from '../translate/TString';
import { TelegramActionQuestion } from './TelegramActionQuestion.meta';

addComponent(MenuEdit, TelegramActionQuestion, 'react edit', {
  props: {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
    fields: {
      text: TString,
      type: true,
      saveTo: true,
      deleteMessages: true,
    },
  },
});
registerEnum(TelegramActionQuestion.Type);
addActionMenu(TelegramActionQuestion, '', 'Question');
// addButtonActionMenu(TelegramActionQuestion, '', 'Question');
