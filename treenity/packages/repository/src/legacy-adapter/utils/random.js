const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charsLen = chars.length;

function id(len) {
  return _randomString(len, chars);
}

function _randomString(len, chars) {
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLen));
  }
  return result;
}

export const Random = {
  id,
  _randomString,
};
