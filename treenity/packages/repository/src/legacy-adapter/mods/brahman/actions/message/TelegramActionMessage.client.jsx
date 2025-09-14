import { merge } from '@s-libs/micro-dash';
import { addComponent } from '../../../../tree';

import { addActionMenu } from '../addActionMenu';
import { addButtonActionMenu } from '../menu/addButtonActionMenu';
import { MenuEdit } from '../MenuEdit';
import TString from '../translate/TString';
import {
  TelegramActionMessage,
  TelegramActionMessageChat,
  TelegramActionMessageReply,
} from './TelegramActionMessage.meta';

const config = {
  props: {
    // labelCol: { span: 4 },
    // wrapperCol: { span: 20 },
    fields: {
      text: {
        type: TString,
        attrs: {
          autoSize: true,
        },
      },
      disableLinks: true,
      menuType: true,
    },
  },
};

addComponent(MenuEdit, TelegramActionMessage, 'react edit', config);
addActionMenu(TelegramActionMessage, '', 'Message');
addButtonActionMenu(TelegramActionMessage, '', 'Message');

addComponent(
  MenuEdit,
  TelegramActionMessageChat,
  'react edit',
  merge({}, config, {
    props: {
      fields: { chatId: true },
    },
  }),
);
addComponent(
  MenuEdit,
  TelegramActionMessageReply,
  'react edit',
  merge({}, config, {
    props: {
      fields: { msgIdFrom: true },
    },
  }),
);
addActionMenu(TelegramActionMessageChat, 'message', 'Message to Chat');
addActionMenu(TelegramActionMessageReply, 'message', 'Reply Message');
