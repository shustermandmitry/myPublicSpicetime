const CAMEL_UNDERSCORE_REGEX = /([a-zA-Z])(?=[A-Z])/g;

export function camelToUnderscore(name: string) {
  return name.replace(CAMEL_UNDERSCORE_REGEX, '$1_').toLowerCase();
}
export function camelToDash(name: string) {
  return name.replace(CAMEL_UNDERSCORE_REGEX, '$1-').toLowerCase();
}

const DASH_CAMEL_REGEX = /_(\w)/g;

export function dashToCamel(name: string): string {
  return name.replace(DASH_CAMEL_REGEX, (_, w) => w.toUpperCase());
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function stripSlashes(name: string) {
  return name.replace(/^\/+|\/+$/g, '');
}
