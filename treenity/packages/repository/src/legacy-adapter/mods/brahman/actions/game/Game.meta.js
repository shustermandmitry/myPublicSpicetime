import { Class, Meta } from '../../../../tree';

export const Button = Class.create({
  name: 'tg.game.data.button',
  fields: {
    id: Number,
    name: String,
    isPushed: {
      type: Boolean,
      default: false,
    },
  },
});

export const Data = Class.create({
  name: 'tg.game.data',
  fields: {
    buttons: {
      type: [Button],
      default() {
        return [];
      },
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});

export const Game = Meta.inherit({
  name: 'tg.game',
  fields: {
    menuId: String,
    data: {
      type: [Data],
      default() {
        return [];
      },
    },
  },
});
