export interface CallChainMixins<T> {}

export const callChainMixins: CallChainMixins<any> = {} as CallChainMixins<any>;

export function defineMixin(mixins: any) {
  const chainMixins: any = callChainMixins;
  Object.keys(mixins).forEach(key => {
    const mixinKey = key[0] === '$' ? `_${key}_` : key;
    if (chainMixins[mixinKey]) {
      throw new Error(`Mixin ${key} already defined`);
    }
    chainMixins[mixinKey] = mixins[key];
  });
}
