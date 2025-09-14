/**
 * Created by kriz on 15/04/2017.
 */

/**
 * search in collection and return mapped element
 * @param col collection to find and map in
 * @param resolver function to resolve value - should return any value differ from undefined if found
 * @returns found element, mapped by resolver
 */
export default function findMap(col, resolver) {
  // eslint-disable-next-line no-undef-init
  let el = undefined;
  // eslint-disable-next-line no-return-assign
  col.some(e => (el = resolver(e)) != undefined);
  return el;
}
