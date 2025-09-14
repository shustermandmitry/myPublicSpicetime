import { addComponent, Meta } from '../../../tree';
import { TelegramAction } from '../actions/TelegramAction.meta';

const TelegramAvatar = Meta.inherit({
  name: 'tg.avatar',
  fields: {
    path: String,
  },
});

const TAGetAvatar = TelegramAction.inherit({
  name: 'tg.action.avatar.get',
  fields: {},
});

export default TelegramAvatar;

if (globalThis.isServer) {
  const { TelegramBot } = require('../bot/TelegramBot.meta');
  const { getAvatar } = require('../../abilene/utils/get-avatar');

  addComponent(
    async ({ ctx, node }) => {
      const botMeta = node.findParentMeta(TelegramBot);
      await getAvatar(botMeta.token, ctx.userNode, true);
    },
    TAGetAvatar,
    'bot action',
  );
} else {
  const { MetaEdit } = require('../../types/meta/MetaEdit');
  const { addActionMenu } = require('../actions/addActionMenu');

  addComponent(MetaEdit, TAGetAvatar, 'react edit');
  addComponent(MetaEdit, TAGetAvatar, 'react');
  addActionMenu(TAGetAvatar, 'avatar', 'get');
}
