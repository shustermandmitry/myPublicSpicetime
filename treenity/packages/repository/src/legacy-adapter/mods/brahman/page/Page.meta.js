import { Meta } from '../../../tree';

export const BotPage = Meta.inherit({
  name: 'tg.page',
  fields: {
    // name: {
    //   type: String,
    //   //optional: true,
    //   // form: {
    //   //   label: label('Name', 'Name of the page to navigate inside constructor'),
    //   //   attrs: {
    //   //     placeholder: 'Name of the page to navigate inside constructor'
    //   //   }
    //   // }
    // },
    command: {
      type: String,
      optional: true,
      // form: {
      //   label: label('Command', 'Name of the command to link this page to'),
      // }
    },
    positions: {
      type: [String],
      optional: true,
      form: {
        hide: true,
      },
    },
    // actions: actionsField,
  },
  behaviors: { timestamp: {} },
  // indexes: {
  //   name: {
  //     fields: { name: 1 },
  //     options: { unique: true }
  //   },
  //   command: {
  //     fields: { command: 1 },
  //     options: {
  //       unique: true,
  //       partialFilterExpression: { command: { $gt: '' } }
  //     }
  //   }
  // },
});
