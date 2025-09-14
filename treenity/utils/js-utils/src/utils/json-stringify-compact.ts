// @ts-ignore cant make this declarations in types/types.d.ts working =(
import stringify from 'json-stringify-raw';

export const jsonStringifyCompact = (obj: any): string =>
  stringify(
    obj,
    (key: string, value: any) => {
      // don't optimize arrays yet, coz pnpm deoptimizes them every time.
      // if (Array.isArray(value) && value.length > 0) {
      //   const str = value.map(v => `"${v}"`).join(', ');
      //   if (str.length < 80) return `[${str}]`;
      // }
    },
    2,
  );
