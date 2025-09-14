export function getSymbolField<T, R>(entity: T, sym: symbol): R {
  const object = (entity as any)[sym];
  if (!object) throw new Error(sym.toString() + ' not found in object');
  return object as R;
}

export function setSymbolField<T, R>(entity: T, sym: symbol, value: any): void {
  if ((entity as any)[sym]) throw new Error(sym.toString() + ' already exists in object');
  (entity as any)[sym] = value;
}
