import { addComponent } from '../../../../tree';
import { TelegramAction } from '../TelegramAction.meta';

const TASeTag = TelegramAction.inherit({
  name: 'tg.action.setTag',
  fields: {
    tag: String,
    valueFrom: String,
  },
});

if (globalThis.isServer) {
  addComponent(
    async ({ ctx, value }) => {
      const tag = ctx.format(value.tag);
      const checked = ctx.format(value.valueFrom);

      ctx.user.setTag(tag, !!checked);

      ctx.userNode.save();
    },
    TASeTag,
    'bot action',
  );
} else {
  const { addActionMenu } = require('../../../brahman/actions/addActionMenu');
  const { MetaEdit } = require('../../../types/meta/MetaEdit');

  addActionMenu(TASeTag, 'user', 'Set Tag');
  addComponent(MetaEdit, TASeTag, 'react edit');
}
