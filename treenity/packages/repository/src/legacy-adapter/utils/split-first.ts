export default function splitFirst(str: string, split: string): [string, string] {
  const index = str.indexOf(split);
  if (index < 0) {
    return [str, ''];
  } else {
    return [str.slice(0, index), str.slice(index + split.length)];
  }
}
