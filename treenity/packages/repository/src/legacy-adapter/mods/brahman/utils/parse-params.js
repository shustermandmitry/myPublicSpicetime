// import { find } from '@s-libs/micro-dash';

export function parseParams(ctx, next) {
  let cmdEntity;
  if (ctx.message && (cmdEntity = ctx.message.entities.find(e => e.type === 'bot_command'))) {
    const cmd = ctx.message.text.substr(cmdEntity.offset + 1, cmdEntity.length - 1);
    const param = ctx.message.text.substr(cmdEntity.offset + cmdEntity.length + 1);
    const params = param.split(' ').filter(Boolean);
    ctx.cmd = cmd;
    ctx.session.param = param;
    ctx.session.params = params;
  }

  if (next) return next();
}
