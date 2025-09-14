import { TelegramUser } from '../User.meta';

export function checkAuth(ctx, next) {
  const from = ctx.from;
  let user = ctx.userNode.getMeta(TelegramUser);

  if (user && user.banned) {
    return;
  }

  if (!user) {
    user = ctx.userNode.addMeta(TelegramUser, {
      tid: from.id,
      lang: from.language_code,
    });
  }

  if (
    user._isNew ||
    user.firstName !== from.first_name ||
    user.lastName !== from.last_name ||
    user.username !== from.username
  ) {
    user.set({
      firstName: from.first_name,
      lastName: from.last_name,
      username: from.username,
    });

    ctx.userNode.save();
  }

  ctx.user = user;

  return next();
}
