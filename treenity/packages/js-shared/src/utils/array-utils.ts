export function arrayRemoveCopy<T>(arr: T[], value: T): T[] {
  return arr.filter(el => el !== value);
}

/**
 * Copy exact n elements from sourceArray, if sourceArray is shorter than n,
 * fill the rest of the elements with undefined
 * @param sourceArray - array to copy from
 * @param n - amount of elements to copy
 */
export function copyElements<T>(sourceArray: T[], n: number) {
  // Copy n elements from sourceArray
  let copiedArray = sourceArray.slice(0, n);

  // If sourceArray is shorter than n, fill the rest of the elements with undefined
  if (sourceArray.length < n) {
    return copiedArray.concat(Array.from({ length: n - sourceArray.length }));
  }

  return copiedArray;
}

/**
 * Finds the last index in the array where the predicate is true, and returns that index.
 * If no element satisfies the predicate, the function returns -1.
 *
 * @param array - The array to search.
 * @param predicate - A function to test each element of the array.
 * @returns The last index of the element in the array that satisfies the predicate, or -1 if no element satisfies the predicate.
 */
export function findLastIndex<T>(array: T[], predicate: (value: T, index: number, array: T[]) => boolean): number {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }
  return -1;
}