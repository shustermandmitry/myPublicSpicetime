/**
 * Build query string for uri encoded url based on json object
 */
export const makeQueryString = function makeQueryString(q) {
  return q
    ? '?' +
        Object.keys(q)
          .map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(q[k]);
          })
          .join('&')
    : '';
};
