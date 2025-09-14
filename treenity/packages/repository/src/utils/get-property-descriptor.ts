export default function getPropertyDescriptor(obj: any, prop: string) {
  while (obj) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor) {
      return descriptor;
    }
    obj = Object.getPrototypeOf(obj);
  }
  return undefined;
}

export function isWritableProperty(obj: any, prop: string) {
  const descriptor = getPropertyDescriptor(obj, prop);
  if (!descriptor) return true;

  const isWritable = (descriptor.get && descriptor.set) || descriptor?.writable;
  return !!isWritable;
}
