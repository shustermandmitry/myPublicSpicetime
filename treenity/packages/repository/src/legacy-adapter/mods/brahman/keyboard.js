export function inlineKeyboard(rows) {
  return {
    reply_markup: { inline_keyboard: rows },
  };
}

export function keyboard(rows) {
  return {
    reply_markup: { keyboard: rows, resize_keyboard: true },
  };
}

export function remove() {
  return {
    reply_markup: { remove_keyboard: true },
  };
}

export function forceReply() {
  return {
    reply_markup: { force_reply: true },
  };
}
