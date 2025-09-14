import { Extra } from 'telegraf';
import { TelegramActionMenu } from '../menu/TelegramActionMenu.meta';

export function sendKeyboard(ctx, text, keyboard, moreExtra, menuType) {
  const extra = {
    ...keyboard,
    ...moreExtra,
    ...Extra.HTML(true),
  };

  if (
    ctx.callbackQuery &&
    keyboard.reply_markup?.inline_keyboard &&
    menuType !== TelegramActionMenu.Type.INLINE_NEW
  ) {
    return ctx.editMessageText(text, extra);
  } else {
    return ctx.reply(text, extra);
  }
}
