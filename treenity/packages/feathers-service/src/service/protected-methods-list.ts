// using set is the fastest to check if something in a list
import { protectedMethods } from '../feathers';

export const PROTECTED_PROXY_METHODS = new Set<string | symbol>([
  ...protectedMethods,

  'handle',
  'set',
  'raw',
  'service',
  'services',
  'events',
  'splice',
  'then',
  'catch',
  'customMethods',
  'customEvents',
  'serviceAwaiter',
  'getCustomMethods',
  'getCustomEvents',
]);
