export function findMap<T, T1>(arr: T[], callback: (value: T, i: number) => T1 | undefined) {
  for (let i = 0; i < arr.length; i++) {
    const result = callback(arr[i], i);
    if (result != undefined) {
      return result;
    }
  }
  return undefined;
}
