// import { camelCase } from '@s-libs/micro-dash';
import { Meteor } from '../../../utils/meteor';

const Messages = new Meteor.Collection('tgmsg');
Messages._ensureIndex({ 'from.id': 1 });

function camelCase(updateType) {
  const [type, ...rest] = updateType.split('_');
  return type + rest.map(s => s[0].toUpperCase() + s.slice(1)).join('');
}

const saveMessages = Meteor.bindEnvironment((ctx, next) => {
  const update = ctx[camelCase(ctx.updateType)];
  if (update) {
    Messages.insert({ ...update, type: ctx.updateType });
  } else {
    console.error('type not found', ctx.updateType);
  }

  return next();
});

export default saveMessages;
